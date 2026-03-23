/**
 * WebSocket Gateway连接模块
 * 基于腾讯官方文档：https://bot.q.qq.com/wiki/develop/api-v2/dev-protocol/
 */

import EventEmitter from 'node:events';
import WebSocket from 'ws';
import { EventType, InnerEventType, Intent, OpCode } from '../types/index';
import type BotTokenManager from './botToken';

interface WebSocketConfig {
  tokenManager: BotTokenManager;
  intents?: number;
  shard?: number[];
  getGateway: () => Promise<string>;
}

interface Payload {
  op: number;
  d?: any;
  s?: number;
  t?: string;
}

/**
 * WebSocket Gateway客户端
 */
class WebSocketGateway extends EventEmitter {
  private tokenManager: BotTokenManager;
  private intents: number;
  private shard: number[];
  private getGateway: () => Promise<string>;
  private ws: WebSocket | null = null;
  private sessionId: string | null = null;
  private seq: number = 0;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isReconnecting: boolean = false;

  /**
   * 构造函数
   * @param {WebSocketConfig} config - 配置对象
   * @param {string} config.appId - 机器人AppID
   * @param {string} config.token - 机器人Token
   * @param {number} config.intents - 订阅的事件
   * @param {number} config.shard - 分片信息 [shard_id, shard_count]
   * @param {string} config.url - WebSocket URL
   * @param {Function} config.getGateway - 获取Gateway地址的方法
   * @param {Object} config.http - HTTP客户端（用于获取token）
   */
  constructor(config: WebSocketConfig) {
    super();

    this.tokenManager = config.tokenManager;
    this.intents =
      config.intents ||
      Intent.GUILDS | Intent.GUILD_MESSAGES | Intent.GUILD_MEMBERS;
    this.shard = config.shard || [0, 1];
    this.getGateway = config.getGateway;
  }

  /**
   * 连接WebSocket
   * @param {string} url - WebSocket URL
   */
  async connect(url?: string): Promise<void> {
    let gatewayUrl = url;

    if (!gatewayUrl) {
      gatewayUrl = await this.getGateway();
    }

    if (!gatewayUrl) {
      throw new Error('Gateway URL is required');
    }

    if (this.ws) {
      this.ws.close();
    }

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(gatewayUrl);

        this.ws!.on('open', () => {
          this.emit(InnerEventType.CONNECTED);
        });

        this.ws!.on('message', data => {
          this.handleMessage(data);
        });

        this.ws!.on('close', (code: number, reason: Buffer) => {
          this.handleClose(code, reason);
        });

        this.ws!.on('error', (error: Error) => {
          this.emit(EventType.ERROR, error);
          reject(error);
        });

        // 等待READY事件
        this.once(EventType.READY, () => {
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 处理消息
   * @param {Buffer} data - 消息数据
   */
  handleMessage(data: WebSocket.Data): void {
    try {
      const payload: Payload = JSON.parse(data.toString());

      // 更新seq
      if (payload.s) {
        this.seq = payload.s;
      }

      // 根据OpCode处理
      switch (payload.op) {
        case OpCode.HELLO:
          this.handleHello(payload);
          break;

        case OpCode.DISPATCH:
          this.handleDispatch(payload);
          break;

        case OpCode.HEARTBEAT_ACK:
          this.handleHeartbeatAck();
          break;

        case OpCode.RECONNECT:
          this.handleReconnect();
          break;

        case OpCode.INVALID_SESSION:
          this.handleInvalidSession(payload);
          break;

        default:
          this.emit(InnerEventType.DEBUG, `Unknown OpCode: ${payload.op}`);
      }
    } catch (error) {
      this.emit(EventType.ERROR, error);
    }
  }

  /**
   * 处理Hello消息
   * @param {Payload} payload - 消息内容
   */
  handleHello(payload: Payload): void {
    // 开始心跳
    this.startHeartbeat(payload.d.heartbeat_interval);

    // 发送鉴权
    if (this.sessionId) {
      this.resume();
    } else {
      this.identify();
    }
  }

  /**
   * 处理Dispatch消息
   * @param {Payload} payload - 消息内容
   */
  handleDispatch(payload: Payload): void {
    const { t: eventType, d: eventData } = payload;

    // 保存session_id
    if (eventType === EventType.READY) {
      this.sessionId = eventData.session_id;
      this.emit(EventType.READY, eventData);
    } else if (eventType === EventType.RESUMED) {
      this.emit(EventType.RESUMED, eventData);
    } else if (eventType) {
      this.emit(eventType, eventData);
    }
  }

  /**
   * 处理心跳回执
   */
  handleHeartbeatAck(): void {
    this.emit(InnerEventType.DEBUG, 'Heartbeat ACK received');
  }

  /**
   * 处理重连
   */
  handleReconnect(): void {
    this.emit(InnerEventType.RECONNECTING);
    this.reconnect();
  }

  /**
   * 处理无效Session
   * @param {Payload} payload - 消息内容
   */
  handleInvalidSession(payload: Payload): void {
    if (payload.d) {
      // 可以恢复
      this.resume();
    } else {
      // 需要重新鉴权
      this.sessionId = null;
      this.identify();
    }
  }

  /**
   * 处理连接关闭
   * @param {number} code - 关闭码
   * @param {Buffer} reason - 关闭原因
   */
  handleClose(code: number, reason: Buffer): void {
    this.stopHeartbeat();

    this.emit(InnerEventType.CLOSE, code, reason.toString());

    // 自动重连
    if (!this.isReconnecting) {
      this.reconnect();
    }
  }

  /**
   * 发送鉴权
   */
  async identify(): Promise<void> {
    // 获取token
    const token = await this.tokenManager.checkAndRefreshToken();

    if (!token) {
      this.emit(
        EventType.ERROR,
        new Error('No token available for authentication'),
      );
      return;
    }

    const payload = {
      op: OpCode.IDENTIFY,
      d: {
        token: `QQBot ${token}`,
        intents: this.intents,
        shard: this.shard,
        // properties: {
        //   $os: process.platform,
        //   $browser: 'qqbot-plugin',
        //   $device: 'qqbot-plugin',
        // },
      },
    };

    this.send(payload);
  }

  /**
   * 恢复连接
   */
  async resume(): Promise<void> {
    // 获取token
    const token = await this.tokenManager.checkAndRefreshToken();

    if (!token) {
      this.emit(EventType.ERROR, new Error('No token available for resume'));
      return;
    }

    const payload = {
      op: OpCode.RESUME,
      d: {
        token: `QQBot ${token}`,
        session_id: this.sessionId,
        seq: this.seq,
      },
    };

    this.send(payload);
  }

  /**
   * 开始心跳
   * @param {number} interval - 心跳间隔（毫秒）
   */
  startHeartbeat(interval: number): void {
    this.stopHeartbeat();

    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, interval);
  }

  /**
   * 停止心跳
   */
  stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * 发送心跳
   */
  sendHeartbeat(): void {
    const payload = {
      op: OpCode.HEARTBEAT,
      d: this.seq,
    };

    this.send(payload);
  }

  /**
   * 重连
   */
  async reconnect(): Promise<void> {
    if (this.isReconnecting) {
      return;
    }

    this.isReconnecting = true;

    // 清除之前的重连定时器
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    // 延迟重连
    this.reconnectTimeout = setTimeout(async () => {
      try {
        this.emit(InnerEventType.RECONNECTING);

        await this.connect();

        this.isReconnecting = false;
      } catch (error) {
        this.emit(EventType.ERROR, error);
        this.isReconnecting = false;

        // 继续重连
        this.reconnect();
      }
    }, 3000);
  }

  /**
   * 发送消息
   * @param {Payload} payload - 消息内容
   */
  send(payload: Payload): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  /**
   * 关闭连接
   */
  close(): void {
    this.stopHeartbeat();

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.sessionId = null;
  }
}

export default WebSocketGateway;
