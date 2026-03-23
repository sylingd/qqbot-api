/**
 * 用户API
 * 基于腾讯官方文档：
 * - https://bot.q.qq.com/wiki/develop/api-v2/server-inter/user/
 * - https://bot.q.qq.com/wiki/develop/api-v2/server-inter/channel/manage/user/model.html
 * - https://bot.q.qq.com/wiki/develop/api-v2/server-inter/channel/manage/user/me.html
 * - https://bot.q.qq.com/wiki/develop/api-v2/server-inter/user/share_url.html
 * - https://bot.q.qq.com/wiki/develop/api-v2/server-inter/user/manage/event.html
 */

import { BotInfo, BotGuild } from '../types/index';
import QQBotHttpClient from '../core/httpClient';

class UserAPI {
  private httpClient: QQBotHttpClient;

  constructor(httpClient: QQBotHttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * 获取机器人信息
   * @returns {Promise<BotInfo>} 机器人信息
   */
  async getMe(): Promise<BotInfo> {
    const data = await this.httpClient.get('/users/@me');
    return data;
  }

  /**
   * 获取机器人所在的所有频道
   * @param {Object} options - 分页选项
   * @param {string} options.before - 上一页最后一个频道ID
   * @param {string} options.after - 下一页第一个频道ID
   * @param {number} options.limit - 每页数量，默认100，最大100
   * @returns {Promise<BotGuild[]>} 频道列表
   */
  async getMeGuilds(options: { before?: string; after?: string; limit?: number } = {}): Promise<BotGuild[]> {
    const params: any = {};
    if (options.before) params.before = options.before;
    if (options.after) params.after = options.after;
    if (options.limit) params.limit = options.limit;

    const data = await this.httpClient.get('/users/@me/guilds', params);
    return data.map((guild: any) => guild);
  }

  /**
   * 获取当前用户信息
   * 用于获取当前用户（机器人）的详细信息
   * @returns {Promise<Object>} 用户信息
   */
  async getCurrentUser(): Promise<any> {
    const data = await this.httpClient.get('/users/@me');
    return {
      id: data.id,
      username: data.username,
      avatar: data.avatar,
      bot: data.bot,
      union_openid: data.union_openid,
      union_user_account: data.union_user_account,
    };
  }

  /**
   * 获取用户信息
   * 获取指定用户的详细信息
   * @param {string} guildId - 频道ID
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 用户信息
   */
  async getUser(guildId: string, userId: string): Promise<any> {
    const data = await this.httpClient.get(`/guilds/${guildId}/members/${userId}`);
    return {
      user: data.user,
      nick: data.nick,
      roles: data.roles,
      joined_at: data.joined_at,
    };
  }

  /**
   * 获取机器人资料页分享链接
   * 用于生成机器人资料页的分享链接
   * @param {string} guildId - 频道ID
   * @param {string} channelId - 子频道ID（可选）
   * @returns {Promise<Object>} 分享链接信息
   */
  async getShareUrl(guildId: string, channelId: string | null = null): Promise<any> {
    const params: any = { guild_id: guildId };
    if (channelId) params.channel_id = channelId;

    const data = await this.httpClient.get('/users/@me/share_url', params);
    return {
      url: data.url,
      expire_time: data.expire_time,
    };
  }

  /**
   * 用户添加机器人
   * 用户主动添加机器人到频道
   * @param {string} guildId - 频道ID
   * @param {string} userId - 用户ID
   * @returns {Promise<void>}
   */
  async addBot(guildId: string, userId: string): Promise<void> {
    await this.httpClient.post(`/guilds/${guildId}/members/${userId}/bot`, {
      user_id: userId,
    });
  }

  /**
   * 用户删除机器人
   * 用户主动将机器人移出频道
   * @param {string} guildId - 频道ID
   * @param {string} userId - 用户ID
   * @returns {Promise<void>}
   */
  async removeBot(guildId: string, userId: string): Promise<void> {
    await this.httpClient.delete(`/guilds/${guildId}/members/${userId}/bot`);
  }

  /**
   * 拒绝机器人主动消息
   * 用户拒绝接收机器人的主动消息
   * @param {string} guildId - 频道ID
   * @param {string} userId - 用户ID
   * @returns {Promise<void>}
   */
  async rejectBotMessage(guildId: string, userId: string): Promise<void> {
    await this.httpClient.post(`/guilds/${guildId}/members/${userId}/bot/message/reject`);
  }

  /**
   * 允许机器人主动消息
   * 用户允许接收机器人的主动消息
   * @param {string} guildId - 频道ID
   * @param {string} userId - 用户ID
   * @returns {Promise<void>}
   */
  async allowBotMessage(guildId: string, userId: string): Promise<void> {
    await this.httpClient.post(`/guilds/${guildId}/members/${userId}/bot/message/allow`);
  }
}

export default UserAPI;