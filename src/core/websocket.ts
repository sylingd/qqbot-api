/**
 * WebSocket Gateway连接模块
 * 基于腾讯官方文档：https://bot.q.qq.com/wiki/develop/api-v2/dev-protocol/
 */

import EventEmitter from 'node:events';
import WebSocket from 'ws';
import { EventType, Intent, OpCode } from '../types/index';

interface WebSocketConfig {
  appId: string;
  token: string;
  intents?: number;
  shard?: number[];
  url: string; // 修改：添加url属性
  getGateway?: () => Promise<string>;
  http?: any;
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
  private appId: string;
  private token: string;
  private intents: number;
  private shard: number[];
  private url: string; // 新增：存储网关URL
  private getGateway?: () => Promise<string>;
  private http?: any;
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

    this.appId = config.appId;
    this.token = config.token;
    this.intents =
      config.intents ||
      Intent.GUILDS | Intent.GUILD_MESSAGES | Intent.GUILD_MEMBERS;
    this.shard = config.shard || [0, 1];
    this.url = config.url; // 新增：存储网关URL
    this.getGateway = config.getGateway;
    this.http = config.http;
  }

  /**
   * 连接WebSocket
   * @param {string} url - WebSocket URL
   */
  async connect(url?: string): Promise<void> {
    const gatewayUrl = url || this.url; // 使用传入的URL或配置中的URL

    if (this.ws) {
      this.ws.close();
    }

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(gatewayUrl);

        this.ws!.on('open', () => {
          this.emit('connected');
        });

        this.ws!.on('message', data => {
          this.handleMessage(data);
        });

        this.ws!.on('close', (code: number, reason: Buffer) => {
          this.handleClose(code, reason);
        });

        this.ws!.on('error', (error: Error) => {
          this.emit('error', error);
          reject(error);
        });

        // 等待READY事件
        this.once('ready', () => {
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
          this.emit('debug', `Unknown OpCode: ${payload.op}`);
      }
    } catch (error) {
      this.emit('error', error);
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
      this.emit('ready', eventData);
    } else if (eventType === EventType.RESUMED) {
      this.emit('ready', eventData);
    } else {
      // 触发对应事件
      if (eventType) {
        this.emit(eventType, eventData);
      }
      this.emit('dispatch', eventType, eventData);
    }
  }

  /**
   * 处理心跳回执
   */
  handleHeartbeatAck(): void {
    this.emit('debug', 'Heartbeat ACK received');
  }

  /**
   * 处理重连
   */
  handleReconnect(): void {
    this.emit('reconnect');
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

    this.emit('close', code, reason.toString());

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
    let token = this.token;

    // 如果没有token，从HTTP客户端获取
    if (!token && this.http) {
      try {
        const tokenData = await this.http.getAccessToken();
        token = tokenData.access_token;
      } catch (error) {
        this.emit(
          'error',
          new Error(`Failed to get access token: ${(error as Error).message}`),
        );
        return;
      }
    }

    if (!token) {
      this.emit('error', new Error('No token available for authentication'));
      return;
    }

    const payload = {
      op: OpCode.IDENTIFY,
      d: {
        token: `QQBot ${token}`,
        intents: this.intents,
        shard: this.shard,
        properties: {
          $os: process.platform,
          $browser: 'qqbot-plugin',
          $device: 'qqbot-plugin',
        },
      },
    };

    this.send(payload);
  }

  /**
   * 恢复连接
   */
  async resume(): Promise<void> {
    // 获取token
    let token = this.token;

    // 如果没有token，从HTTP客户端获取
    if (!token && this.http) {
      try {
        const tokenData = await this.http.getAccessToken();
        token = tokenData.access_token;
      } catch (error) {
        this.emit(
          'error',
          new Error(`Failed to get access token: ${(error as Error).message}`),
        );
        return;
      }
    }

    if (!token) {
      this.emit('error', new Error('No token available for resume'));
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
        this.emit('reconnecting');

        // 获取新的gateway地址
        const gatewayUrl = this.getGateway ? await this.getGateway() : this.url;
        await this.connect(gatewayUrl);

        this.isReconnecting = false;
      } catch (error) {
        this.emit('error', error);
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
