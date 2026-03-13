/**
 * QQ Bot SDK 主入口类
 * 基于腾讯官方文档：https://bot.q.qq.com/wiki/develop/api-v2/
 */

import QQBotHttpClient from './core/httpClient.js';
import WebSocketGateway from './core/websocket.js';
import GuildAPI from './api/guild.js';
import MemberAPI from './api/member.js';
import ChannelAPI from './api/channel.js';
import MessageAPI from './api/message.js';
import ReactionAPI from './api/reaction.js';
import AudioAPI from './api/audio.js';
import ForumAPI from './api/forum.js';
import PermissionAPI from './api/permission.js';
import UserAPI from './api/user.js';
import ScheduleAPI from './api/schedule.js';
import MessageAuditAPI from './api/messageAudit.js';
import EventEmitter from 'events';
import { Gateway, Intent } from './types/index.js';

/**
 * QQ Bot客户端
 */
class QQBotClient extends EventEmitter {
  /**
   * 构造函数
   * @param {Object} config - 配置对象
   * @param {string} config.appId - 机器人AppID
   * @param {string} config.clientSecret - 机器人ClientSecret（可选）
   * @param {string} config.token - 机器人Token（可选，与clientSecret二选一）
   * @param {boolean} config.sandbox - 是否沙箱环境
   * @param {number} config.intents - 订阅的事件
   * @param {number[]} config.shard - 分片信息 [shard_id, shard_count]
   */
  constructor(config = {}) {
    super();

    this.config = config;

    // 创建HTTP客户端
    this.http = new QQBotHttpClient({
      appId: config.appId,
      clientSecret: config.clientSecret,
      token: config.token,
      sandbox: config.sandbox,
    });

    // 创建WebSocket Gateway
    this.gateway = new WebSocketGateway({
      appId: config.appId,
      token: config.token,
      intents: config.intents || Intent.GUILDS | Intent.GUILD_MESSAGES | Intent.GUILD_MEMBERS,
      shard: config.shard || [0, 1],
      getGateway: this.getGateway.bind(this),
      http: this.http, // 传递HTTP客户端，用于获取token
    });

    // 创建API实例
    this.guild = new GuildAPI(this.http);
    this.member = new MemberAPI(this.http);
    this.channel = new ChannelAPI(this.http);
    this.message = new MessageAPI(this.http);
    this.reaction = new ReactionAPI(this.http);
    this.audio = new AudioAPI(this.http);
    this.forum = new ForumAPI(this.http);
    this.permission = new PermissionAPI(this.http);
    this.user = new UserAPI(this.http);
    this.schedule = new ScheduleAPI(this.http);
    this.messageAudit = new MessageAuditAPI(this.http);

    // 绑定Gateway事件
    this.setupGatewayEvents();
  }

  /**
   * 设置Gateway事件监听
   */
  setupGatewayEvents() {
    // 连接成功
    this.gateway.on('ready', (data) => {
      this.emit('ready', data);
    });

    // 连接错误
    this.gateway.on('error', (error) => {
      this.emit('error', error);
    });

    // 连接关闭
    this.gateway.on('close', (code, reason) => {
      this.emit('close', code, reason);
    });

    // 重连
    this.gateway.on('reconnect', () => {
      this.emit('reconnect');
    });

    // 转发所有事件
    this.gateway.on('dispatch', (eventType, eventData) => {
      this.emit(eventType, eventData);
    });
  }

  /**
   * 启动客户端
   */
  async start() {
    try {
      // 获取Gateway地址
      const gatewayUrl = await this.getGateway();

      // 连接WebSocket
      await this.gateway.connect(gatewayUrl);

    } catch (error) {
      this.emit('error', error);
      throw error;
    }
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
   * 获取Gateway Bot信息
   * @returns {Promise<Gateway>} Gateway信息
   */
  async getGatewayBot() {
    const data = await this.http.get('/gateway/bot');
    return new Gateway(data);
  }

  /**
   * 关闭客户端
   */
  stop() {
    this.gateway.close();
  }
}

export default QQBotClient;
