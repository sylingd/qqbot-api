/**
 * 论坛API
 * 基于腾讯官方文档：https://bot.q.qq.com/wiki/develop/api-v2/server-inter/forum/
 */

import { Reply, Thread } from "../types/index";
import QQBotHttpClient from "../core/httpClient";

class ForumAPI {
  private httpClient: QQBotHttpClient;

  constructor(httpClient: QQBotHttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * 获取帖子列表
   * @param {string} channelId - 子频道ID
   * @param {Object} options - 查询选项
   * @param {string} options.older_than - 读取比这个时间更老的帖子
   * @param {number} options.limit - 每次拉取多少条数据，最大50
   * @returns {Promise<Thread[]>} 帖子列表
   */
  async getThreads(
    channelId: string,
    options: { older_than?: string; limit?: number } = {},
  ): Promise<Thread[]> {
    const params: any = {};
    if (options.older_than) params.older_than = options.older_than;
    if (options.limit) params.limit = options.limit;

    const data = await this.httpClient.get(
      `/channels/${channelId}/threads`,
      params,
    );
    return data;
  }

  /**
   * 获取帖子详情
   * @param {string} channelId - 子频道ID
   * @param {string} threadId - 帖子ID
   * @returns {Promise<Thread>} 帖子信息
   */
  async getThread(channelId: string, threadId: string): Promise<Thread> {
    const data = await this.httpClient.get(
      `/channels/${channelId}/threads/${threadId}`,
    );
    return data;
  }

  /**
   * 发表帖子
   * @param {string} channelId - 子频道ID
   * @param {Object} options - 帖子选项
   * @param {string} options.thread.title - 帖子标题
   * @param {string} options.thread.content - 帖子内容
   * @param {number} options.format - 内容格式，1表示JSON格式，2表示MARKDOWN格式，3表示纯净内容
   * @returns {Promise<Thread>} 创建的帖子
   */
  async createThread(
    channelId: string,
    options: {
      thread: {
        title: string;
        content: string;
      };
      format?: number;
    },
  ): Promise<Thread> {
    const data = await this.httpClient.put(
      `/channels/${channelId}/threads`,
      options,
    );
    return data;
  }

  /**
   * 删除帖子
   * @param {string} channelId - 子频道ID
   * @param {string} threadId - 帖子ID
   * @returns {Promise<void>}
   */
  async deleteThread(channelId: string, threadId: string): Promise<void> {
    await this.httpClient.delete(`/channels/${channelId}/threads/${threadId}`);
  }

  /**
   * 获取帖子回复列表
   * @param {string} channelId - 子频道ID
   * @param {string} threadId - 帖子ID
   * @param {Object} options - 分页选项
   * @param {string} options.before - 上一页最后一个回复ID
   * @param {string} options.after - 下一页第一个回复ID
   * @param {number} options.limit - 每页数量，默认20，最大50
   * @returns {Promise<Reply[]>} 回复列表
   */
  async getReplies(
    channelId: string,
    threadId: string,
    options?: {
      before: string;
      after: string;
      limit: number;
    },
  ): Promise<Reply[]> {
    const data = await this.httpClient.get(
      `/channels/${channelId}/threads/${threadId}/replies`,
      options,
    );
    return data;
  }

  /**
   * 发布回复
   * @param {string} channelId - 子频道ID
   * @param {string} threadId - 帖子ID
   * @param {Object} options - 回复选项
   * @param {string} options.content - 回复内容
   * @param {string} options.format - 格式，默认1
   * @returns {Promise<Reply>} 发布的回复
   */
  async createReply(
    channelId: string,
    threadId: string,
    options?: { content: string; format?: number },
  ): Promise<Reply> {
    const data = await this.httpClient.put(
      `/channels/${channelId}/threads/${threadId}/replies`,
      options,
    );
    return data;
  }

  /**
   * 删除回复
   * @param {string} channelId - 子频道ID
   * @param {string} threadId - 帖子ID
   * @param {string} replyId - 回复ID
   * @returns {Promise<void>}
   */
  async deleteReply(channelId: string, threadId: string, replyId: string) {
    await this.httpClient.delete(
      `/channels/${channelId}/threads/${threadId}/replies/${replyId}`,
    );
    1;
  }
}

export default ForumAPI;
