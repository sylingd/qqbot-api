/**
 * 频道API
 * 基于腾讯官方文档：https://bot.q.qq.com/wiki/develop/api-v2/server-inter/guild/
 */

import { Guild } from '../types/index';
import QQBotHttpClient from '../core/httpClient';

class GuildAPI {
  private httpClient: QQBotHttpClient;

  constructor(httpClient: QQBotHttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * 获取频道详情
   * @param {string} guildId - 频道ID
   * @returns {Promise<Guild>} 频道信息
   */
  async getGuild(guildId: string): Promise<Guild> {
    const data = await this.httpClient.get(`/guilds/${guildId}`);
    return data;
  }

  /**
   * 获取用户频道列表
   * @param {Object} options - 查询选项
   * @param {string} options.before - 读取此id之前的数据
   * @param {string} options.after - 读取此id之后的数据
   * @param {number} options.limit - 每次拉取多少条数据，最大100
   * @returns {Promise<Guild[]>} 频道列表
   */
  async getGuilds(options: { before?: string; after?: string; limit?: number } = {}): Promise<Guild[]> {
    const params: any = {};
    if (options.before) params.before = options.before;
    if (options.after) params.after = options.after;
    if (options.limit) params.limit = options.limit;

    const data = await this.httpClient.get('/users/@me/guilds', params);
    return data;
  }
}

export default GuildAPI;