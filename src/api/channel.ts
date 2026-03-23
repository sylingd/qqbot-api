/**
 * 子频道API
 * 基于腾讯官方文档：https://bot.q.qq.com/wiki/develop/api-v2/server-inter/channel/
 */

import { Channel } from '../types/index';
import QQBotHttpClient from '../core/httpClient';

class ChannelAPI {
  private httpClient: QQBotHttpClient;

  constructor(httpClient: QQBotHttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * 获取频道下的子频道列表
   * @param {string} guildId - 频道ID
   * @returns {Promise<Channel[]>} 子频道列表
   */
  async getChannels(guildId: string): Promise<Channel[]> {
    const data = await this.httpClient.get(`/guilds/${guildId}/channels`);
    return data;
  }

  /**
   * 获取子频道详情
   * @param {string} channelId - 子频道ID
   * @returns {Promise<Channel>} 子频道信息
   */
  async getChannel(channelId: string): Promise<Channel> {
    const data = await this.httpClient.get(`/channels/${channelId}`);
    return data;
  }

  /**
   * 创建子频道
   * @param {string} guildId - 频道ID
   * @param {Object} options - 子频道选项
   * @param {string} options.name - 子频道名称
   * @param {number} options.type - 子频道类型
   * @param {number} options.sub_type - 子频道子类型
   * @param {number} options.position - 排序
   * @param {string} options.parent_id - 父频道ID
   * @param {number} options.private_type - 私密类型
   * @param {Object[]} options.private_user_list - 私密用户列表
   * @param {number} options.speak_permission - 发言权限
   * @param {string} options.application_id - 应用ID
   * @returns {Promise<Channel>} 创建的子频道
   */
  async createChannel(
    guildId: string,
    options: {
      name: string;
      type?: number;
      sub_type?: number;
      position?: number;
      parent_id?: string;
      private_type?: number;
      private_user_list?: any[];
      speak_permission?: number;
      application_id?: string;
    }
  ): Promise<Channel> {
    const data = await this.httpClient.post(`/guilds/${guildId}/channels`, options);
    return data;
  }

  /**
   * 修改子频道
   * @param {string} channelId - 子频道ID
   * @param {Object} options - 修改选项
   * @param {string} options.name - 子频道名称
   * @param {number} options.position - 排序
   * @param {string} options.parent_id - 父频道ID
   * @param {number} options.private_type - 私密类型
   * @param {Object[]} options.private_user_list - 私密用户列表
   * @param {number} options.speak_permission - 发言权限
   * @param {string} options.application_id - 应用ID
   * @returns {Promise<Channel>} 修改后的子频道
   */
  async updateChannel(
    channelId: string,
    options: {
      name?: string;
      position?: number;
      parent_id?: string;
      private_type?: number;
      private_user_list?: any[];
      speak_permission?: number;
      application_id?: string;
    }
  ): Promise<Channel> {
    const data = await this.httpClient.patch(`/channels/${channelId}`, options);
    return data;
  }

  /**
   * 删除子频道
   * @param {string} channelId - 子频道ID
   * @returns {Promise<Channel>} 删除的子频道
   */
  async deleteChannel(channelId: string): Promise<Channel> {
    const data = await this.httpClient.delete(`/channels/${channelId}`);
    return data;
  }
}

export default ChannelAPI;