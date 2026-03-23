/**
 * 消息反应API
 * 基于腾讯官方文档：https://bot.q.qq.com/wiki/develop/api-v2/server-inter/reaction/
 */

import QQBotHttpClient from '../core/httpClient';

class ReactionAPI {
  private httpClient: QQBotHttpClient;

  constructor(httpClient: QQBotHttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * 创建消息反应
   * @param {string} channelId - 子频道ID
   * @param {string} messageId - 消息ID
   * @param {string} emojiType - 表情类型
   * @param {string} emojiId - 表情ID
   * @returns {Promise<void>}
   */
  async createReaction(channelId: string, messageId: string, emojiType: string, emojiId: string): Promise<void> {
    await this.httpClient.put(
      `/channels/${channelId}/messages/${messageId}/reactions/${emojiType}:${emojiId}`
    );
  }

  /**
   * 删除消息反应
   * @param {string} channelId - 子频道ID
   * @param {string} messageId - 消息ID
   * @param {string} emojiType - 表情类型
   * @param {string} emojiId - 表情ID
   * @param {string} userId - 用户ID，不填则删除机器人自己的反应
   * @returns {Promise<void>}
   */
  async deleteReaction(
    channelId: string,
    messageId: string,
    emojiType: string,
    emojiId: string,
    userId: string | null = null
  ): Promise<void> {
    const url = userId
      ? `/channels/${channelId}/messages/${messageId}/reactions/${emojiType}:${emojiId}?user_id=${userId}`
      : `/channels/${channelId}/messages/${messageId}/reactions/${emojiType}:${emojiId}`;

    await this.httpClient.delete(url);
  }

  /**
   * 获取消息反应用户列表
   * @param {string} channelId - 子频道ID
   * @param {string} messageId - 消息ID
   * @param {string} emojiType - 表情类型
   * @param {string} emojiId - 表情ID
   * @param {Object} options - 分页选项
   * @param {string} options.cookie - 分页cookie
   * @param {number} options.limit - 每页数量，默认20，最大50
   * @returns {Promise<Object>} 用户列表和分页信息
   */
  async getReactionUsers(
    channelId: string,
    messageId: string,
    emojiType: string,
    emojiId: string,
    options: { cookie?: string; limit?: number } = {}
  ): Promise<any> {
    const params: any = {};
    if (options.cookie) params.cookie = options.cookie;
    if (options.limit) params.limit = options.limit;

    const data = await this.httpClient.get(
      `/channels/${channelId}/messages/${messageId}/reactions/${emojiType}:${emojiId}`,
      params
    );

    return data;
  }
}

export default ReactionAPI;