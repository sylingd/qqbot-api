/**
 * QQ Bot Client
 * 基于腾讯官方文档：https://bot.q.qq.com/wiki/develop/api-v2/
 */

import QQBotHttpClient from './core/httpClient';
import BotToken from './core/botToken';
import WebSocketClient from './core/websocket';
import GuildAPI from './api/guild';
import ChannelAPI from './api/channel';
import MemberAPI from './api/member';
import MessageAPI from './api/message';
import MessageAuditAPI from './api/messageAudit';
import UserAPI from './api/user';
import ReactionAPI from './api/reaction';
import PermissionAPI from './api/permission';
import AudioAPI from './api/audio';
import ForumAPI from './api/forum';
import ScheduleAPI from './api/schedule';
import { EventType, Gateway } from './types/index';

interface QQBotConfig {
  appId: string;
  token: string;
  secret?: string;
  isSandbox?: boolean;
}

interface EventMap {
  [EventType.READY]: () => void;
  [EventType.GUILD_CREATE]: (data: any) => void;
  [EventType.GUILD_UPDATE]: (data: any) => void;
  [EventType.GUILD_DELETE]: (data: any) => void;
  [EventType.CHANNEL_CREATE]: (data: any) => void;
  [EventType.CHANNEL_UPDATE]: (data: any) => void;
  [EventType.CHANNEL_DELETE]: (data: any) => void;
  [EventType.GUILD_MEMBER_ADD]: (data: any) => void;
  [EventType.GUILD_MEMBER_UPDATE]: (data: any) => void;
  [EventType.GUILD_MEMBER_REMOVE]: (data: any) => void;
  [EventType.MESSAGE_CREATE]: (data: any) => void;
  [EventType.MESSAGE_DELETE]: (data: any) => void;
  [EventType.MESSAGE_REACTION_ADD]: (data: any) => void;
  [EventType.MESSAGE_REACTION_REMOVE]: (data: any) => void;
  [EventType.DIRECT_MESSAGE_CREATE]: (data: any) => void;
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
  [EventType.GUILD_MESSAGE_REACTIONS]: (data: any) => void;
  connect: () => void;
  disconnect: (code?: number, reason?: string) => void;
  error: (error: any) => void;
}

class QQBotClient {
  private config: QQBotConfig;
  private tokenManager: BotToken;
  public http: QQBotHttpClient;
  private ws: WebSocketClient | null = null;

  // API instances
  public guild: GuildAPI;
  public channel: ChannelAPI;
  public member: MemberAPI;
  public message: MessageAPI;
  public messageAudit: MessageAuditAPI;
  public user: UserAPI;
  public reaction: ReactionAPI;
  public permission: PermissionAPI;
  public audio: AudioAPI;
  public forum: ForumAPI;
  public schedule: ScheduleAPI;

  constructor(config: QQBotConfig) {
    this.config = config;
    this.tokenManager = new BotToken(config.appId, config.token, config.secret);

    // Initialize HTTP client
    this.http = new QQBotHttpClient(this.tokenManager, config.isSandbox);

    // Initialize API instances
    this.guild = new GuildAPI(this.http);
    this.channel = new ChannelAPI(this.http);
    this.member = new MemberAPI(this.http);
    this.message = new MessageAPI(this.http);
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
      console.warn('WebSocket not initialized yet. Please call bot.start() first.');
      return;
    }
    this.ws.on(event as string | symbol, listener);
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
    this.ws.off(event as string | symbol, listener);
  }

  /**
   * 启动机器人
   * @param intents 订阅的事件类型
   */
  async start(intents = 0): Promise<void> {
    // Get gateway info
    const gatewayInfo = await this.getGatewayBot();
    
    // Initialize WebSocket
    this.ws = new WebSocketClient({
      token: await this.tokenManager.getToken(),
      url: gatewayInfo.url || '',  // 修复类型问题，如果url是undefined则设为''
      intents,
      appId: this.config.appId,  // 修复属性名
    });

    // Start connection
    this.ws.connect(gatewayInfo.url);
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

  /**
   * 获取Gateway信息
   * @returns Gateway信息
   */
  async getGatewayBot(): Promise<Gateway> {
    const data = await this.http.get('/gateway/bot');
    return data;
  }
}

export default QQBotClient;