/**
 * QQ Bot Client
 * 基于腾讯官方文档：https://bot.q.qq.com/wiki/develop/api-v2/
 */

import {
  AudioAPI,
  ChannelAPI,
  ChannelMessageAPI,
  ForumAPI,
  GuildAPI,
  MemberAPI,
  MessageAPI,
  MessageAuditAPI,
  PermissionAPI,
  ReactionAPI,
  ScheduleAPI,
  UserAPI,
} from './api';
import { WebSocketGateway } from './core';
import BotToken from './core/botToken';
import QQBotHttpClient from './core/httpClient';
import type WebSocketClient from './core/websocket';
import {
  type C2CMessage,
  EventType,
  type Gateway,
  type GroupAtMessage,
  type Message,
} from './types/index';

export interface QQBotConfig {
  appId: string;
  token?: string;
  clientSecret: string;
  sandbox?: boolean;
  timeout?: number;
  intents?: number;
  shard?: number[];
}

export interface EventMap {
  [EventType.READY]: (data: any) => void;
  [EventType.ERROR]: (error: Error) => void;
  [EventType.CLOSE]: (code: number, reason: string) => void;
  [EventType.GUILD_CREATE]: (data: any) => void;
  [EventType.GUILD_UPDATE]: (data: any) => void;
  [EventType.GUILD_DELETE]: (data: any) => void;
  [EventType.CHANNEL_CREATE]: (data: any) => void;
  [EventType.CHANNEL_UPDATE]: (data: any) => void;
  [EventType.CHANNEL_DELETE]: (data: any) => void;
  [EventType.GUILD_MEMBER_ADD]: (data: any) => void;
  [EventType.GUILD_MEMBER_UPDATE]: (data: any) => void;
  [EventType.GUILD_MEMBER_REMOVE]: (data: any) => void;
  [EventType.MESSAGE_CREATE]: (data: Message) => void;
  [EventType.MESSAGE_DELETE]: (data: any) => void;
  [EventType.MESSAGE_REACTION_ADD]: (data: any) => void;
  [EventType.MESSAGE_REACTION_REMOVE]: (data: any) => void;
  [EventType.DIRECT_MESSAGE_CREATE]: (data: Message) => void;
  [EventType.THREAD_CREATE]: (data: any) => void;
  [EventType.THREAD_UPDATE]: (data: any) => void;
  [EventType.THREAD_DELETE]: (data: any) => void;
  [EventType.POST_CREATE]: (data: any) => void;
  [EventType.POST_DELETE]: (data: any) => void;
  [EventType.REPLY_CREATE]: (data: any) => void;
  [EventType.REPLY_DELETE]: (data: any) => void;
  [EventType.AUDIO_START]: (data: any) => void;
  [EventType.AUDIO_FINISH]: (data: any) => void;
  [EventType.AUDIO_ON_MIC]: (data: any) => void;
  [EventType.AUDIO_OFF_MIC]: (data: any) => void;
  [EventType.MESSAGE_AUDIT_PASS]: (data: any) => void;
  [EventType.MESSAGE_AUDIT_REJECT]: (data: any) => void;
  [EventType.FORUM_THREAD_CREATE]: (data: any) => void;
  [EventType.FORUM_THREAD_UPDATE]: (data: any) => void;
  [EventType.FORUM_THREAD_DELETE]: (data: any) => void;
  [EventType.FORUM_POST_CREATE]: (data: any) => void;
  [EventType.FORUM_POST_DELETE]: (data: any) => void;
  [EventType.FORUM_REPLY_CREATE]: (data: any) => void;
  [EventType.FORUM_REPLY_DELETE]: (data: any) => void;
  [EventType.INTERACTION_COMMAND]: (data: any) => void;
  [EventType.AT_MESSAGE_CREATE]: (data: Message) => void;
  [EventType.GROUP_AT_MESSAGE_CREATE]: (data: GroupAtMessage) => void;
  [EventType.C2C_MESSAGE_CREATE]: (data: C2CMessage) => void;
}

class QQBotClient {
  private tokenManager: BotToken;
  public http: QQBotHttpClient;
  public ws: WebSocketClient | null = null;

  // API instances
  public guild: GuildAPI;
  public channel: ChannelAPI;
  public member: MemberAPI;
  public message: MessageAPI;
  public channelMessage: ChannelMessageAPI;
  public messageAudit: MessageAuditAPI;
  public user: UserAPI;
  public reaction: ReactionAPI;
  public permission: PermissionAPI;
  public audio: AudioAPI;
  public forum: ForumAPI;
  public schedule: ScheduleAPI;

  constructor(config: QQBotConfig) {
    this.tokenManager = new BotToken(
      config.appId,
      config.token,
      config.clientSecret,
    );

    // 创建HTTP客户端
    this.http = new QQBotHttpClient(
      this.tokenManager,
      config.sandbox,
      config.timeout ?? 10000,
    );

    // 创建WebSocket Gateway
    if (typeof config.intents === 'number') {
      this.ws = new WebSocketGateway({
        tokenManager: this.tokenManager,
        getGateway: this.getGateway.bind(this),
        intents: config.intents,
        shard: config.shard || [0, 1],
      });
    }

    // Initialize API instances
    this.guild = new GuildAPI(this.http);
    this.channel = new ChannelAPI(this.http);
    this.member = new MemberAPI(this.http);
    this.message = new MessageAPI(this.http);
    this.channelMessage = new ChannelMessageAPI(this.http);
    this.messageAudit = new MessageAuditAPI(this.http);
    this.user = new UserAPI(this.http);
    this.reaction = new ReactionAPI(this.http);
    this.permission = new PermissionAPI(this.http);
    this.audio = new AudioAPI(this.http);
    this.forum = new ForumAPI(this.http);
    this.schedule = new ScheduleAPI(this.http);
  }

  /**
   * 事件监听
   * @param event 事件类型
   * @param listener 事件处理器
   */
  on<T extends keyof EventMap>(event: T, listener: EventMap[T]): void {
    if (!this.ws) {
      throw new Error(
        'WebSocket not initialized yet. Please pass intents parameter.',
      );
    }
    this.ws.on(event as string, listener);
  }

  /**
   * 移除事件监听
   * @param event 事件类型
   * @param listener 事件处理器
   */
  off<T extends keyof EventMap>(event: T, listener: EventMap[T]): void {
    if (!this.ws) {
      return;
    }
    this.ws.off(event as string, listener);
  }

  /**
   * 启动机器人
   * @param intents 订阅的事件类型
   */
  async start(): Promise<void> {
    if (!this.ws) {
      throw new Error(
        'WebSocket not initialized yet. Please pass intents parameter.',
      );
    }

    await this.ws.connect();
  }

  /**
   * 获取Gateway地址
   * @returns {Promise<string>} Gateway URL
   */
  async getGateway() {
    const data = await this.http.get('/gateway');
    return data.url;
  }

  /**
   * 获取Gateway信息
   * @returns Gateway信息
   */
  async getGatewayBot(): Promise<Gateway> {
    const data = await this.http.get('/gateway/bot');
    return data;
  }

  /**
   * 停止机器人
   */
  stop(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default QQBotClient;
