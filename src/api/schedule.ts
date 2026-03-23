/**
 * 日程API
 * 基于腾讯官方文档：https://bot.q.qq.com/wiki/develop/api-v2/server-inter/schedule/
 */

import { Schedule } from '../types/index';
import QQBotHttpClient from '../core/httpClient';

class ScheduleAPI {
  private httpClient: QQBotHttpClient;

  constructor(httpClient: QQBotHttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * 获取日程列表
   * @param {string} channelId - 子频道ID
   * @param {Object} options - 查询选项
   * @param {string} options.timestamp - 查询的时间戳
   * @returns {Promise<Schedule[]>} 日程列表
   */
  async getSchedules(channelId: string, options: { timestamp?: string } = {}): Promise<Schedule[]> {
    const params: any = {};
    const { timestamp } = options;

    if (timestamp) params.timestamp = timestamp;

    const data = await this.httpClient.get(`/channels/${channelId}/schedules`, params);
    return data;
  }

  /**
   * 获取日程详情
   * @param {string} channelId - 子频道ID
   * @param {string} scheduleId - 日程ID
   * @returns {Promise<Schedule>} 日程信息
   */
  async getSchedule(channelId: string, scheduleId: string): Promise<Schedule> {
    const data = await this.httpClient.get(`/channels/${channelId}/schedules/${scheduleId}`);
    return data;
  }

  /**
   * 创建日程
   * @param {string} channelId - 子频道ID
   * @param {Object} options - 日程选项
   * @param {Object} options.schedule - 日程信息
   * @param {string} options.schedule.name - 日程名称
   * @param {string} options.schedule.description - 日程描述
   * @param {string} options.schedule.start_timestamp - 开始时间戳
   * @param {string} options.schedule.end_timestamp - 结束时间戳
   * @param {string} options.schedule.creator_id - 创建者ID
   * @param {string} options.schedule.jump_channel_id - 跳转子频道ID
   * @param {string} options.schedule.remind_type - 提醒类型
   * @returns {Promise<Schedule>} 创建的日程
   */
  async createSchedule(
    channelId: string,
    options: {
      schedule: {
        name: string;
        description?: string;
        start_timestamp: string;
        end_timestamp: string;
        creator_id?: string;
        jump_channel_id?: string;
        remind_type?: string;
      };
    }
  ): Promise<Schedule> {
    const data = await this.httpClient.post(`/channels/${channelId}/schedules`, {
      schedule: options.schedule,
    });
    return data;
  }

  /**
   * 修改日程
   * @param {string} channelId - 子频道ID
   * @param {string} scheduleId - 日程ID
   * @param {Object} options - 日程选项
   * @param {Object} options.schedule - 日程信息
   * @param {string} options.schedule.name - 日程名称
   * @param {string} options.schedule.description - 日程描述
   * @param {string} options.schedule.start_timestamp - 开始时间戳
   * @param {string} options.schedule.end_timestamp - 结束时间戳
   * @param {string} options.schedule.creator_id - 创建者ID
   * @param {string} options.schedule.jump_channel_id - 跳转子频道ID
   * @param {string} options.schedule.remind_type - 提醒类型
   * @returns {Promise<Schedule>} 修改后的日程
   */
  async updateSchedule(
    channelId: string,
    scheduleId: string,
    options: {
      schedule: {
        name?: string;
        description?: string;
        start_timestamp?: string;
        end_timestamp?: string;
        creator_id?: string;
        jump_channel_id?: string;
        remind_type?: string;
      };
    }
  ): Promise<Schedule> {
    const data = await this.httpClient.patch(`/channels/${channelId}/schedules/${scheduleId}`, {
      schedule: options.schedule,
    });
    return data;
  }

  /**
   * 删除日程
   * @param {string} channelId - 子频道ID
   * @param {string} scheduleId - 日程ID
   * @returns {Promise<void>}
   */
  async deleteSchedule(channelId: string, scheduleId: string): Promise<void> {
    await this.httpClient.delete(`/channels/${channelId}/schedules/${scheduleId}`);
  }
}

export default ScheduleAPI;