/**
 * 成员API
 * 基于腾讯官方文档：https://bot.q.qq.com/wiki/develop/api-v2/server-inter/guild-member/
 */

import { Member } from '../types/index';
import QQBotHttpClient from '../core/httpClient';

class MemberAPI {
  private httpClient: QQBotHttpClient;

  constructor(httpClient: QQBotHttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * 获取频道成员列表
   * @param {string} guildId - 频道ID
   * @param {Object} options - 查询选项
   * @param {string} options.after - 读取此id之后的数据
   * @param {number} options.limit - 每次拉取多少条数据，最大400
   * @returns {Promise<Member[]>} 成员列表
   */
  async getMembers(guildId: string, options: { after?: string; limit?: number } = {}): Promise<Member[]> {
    const params: any = {};
    if (options.after) params.after = options.after;
    if (options.limit) params.limit = options.limit;

    const data = await this.httpClient.get(`/guilds/${guildId}/members`, params);
    return data;
  }

  /**
   * 获取频道成员详情
   * @param {string} guildId - 频道ID
   * @param {string} userId - 用户ID
   * @returns {Promise<Member>} 成员信息
   */
  async getMember(guildId: string, userId: string): Promise<Member> {
    const data = await this.httpClient.get(`/guilds/${guildId}/members/${userId}`);
    return data;
  }

  /**
   * 删除频道成员
   * @param {string} guildId - 频道ID
   * @param {string} userId - 用户ID
   * @param {Object} options - 选项
   * @param {string} options.add_timeout - 禁言时间（毫秒）
   * @param {string} options.reason - 踢出原因
   * @returns {Promise<void>}
   */
  async deleteMember(
    guildId: string,
    userId: string,
    options: { add_timeout?: number; reason?: string } = {}
  ): Promise<void> {
    const params: any = {};
    if (options.add_timeout !== undefined) params.add_timeout = options.add_timeout;
    if (options.reason) params.reason = options.reason;

    const queryString = new URLSearchParams(params).toString();
    let url = `/guilds/${guildId}/members/${userId}`;
    if (queryString) url += `?${queryString}`;

    await this.httpClient.delete(url);
  }
}

export default MemberAPI;