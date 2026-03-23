/**
 * 消息API
 * 基于腾讯官方文档：
 * - https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/
 * - https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/send-receive/send.html
 * - https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/send-receive/rich-media.html
 * - https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/send-receive/reset.html
 * - https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/send-receive/event.html
 * - https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/type/markdown.html
 * - https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/type/ark.html
 * - https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/template/model.html
 * - https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/trans/msg-btn.html
 * - https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/trans/text-chain.html
 */

import type QQBotHttpClient from '../core/httpClient';

class MessageAPI {
  private httpClient: QQBotHttpClient;

  constructor(httpClient: QQBotHttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * 发送单聊消息（C2C）
   * @param {string} openid - QQ用户的openid
   * @param {Object} options - 消息选项
   * @param {string} options.content - 文本消息内容
   * @param {number} options.msg_type - 消息类型：0 文本、2 markdown、3 ark、4 embed、7 media
   * @param {Object} options.markdown - Markdown 对象
   * @param {Object} options.keyboard - Keyboard 对象
   * @param {Object} options.ark - Ark 对象
   * @param {Object} options.media - 富媒体消息的 file_info
   * @param {Object} options.message_reference - 消息引用
   * @param {string} options.event_id - 前置收到的事件 ID，用于发送被动消息
   * @param {string} options.msg_id - 前置收到的用户发送过来的消息 ID，用于发送被动（回复）消息
   * @param {number} options.msg_seq - 回复消息的序号，与 msg_id 联合使用，避免相同消息 id 回复重复发送
   * @param {boolean} options.is_wakeup - 指明发送消息为互动召回消息
   * @returns {Promise<{id: string, timestamp: number}>} 发送的消息结果
   */
  async sendC2CMessage(
    openid: string,
    options: {
      content?: string;
      msg_type: number;
      markdown?: any;
      keyboard?: any;
      ark?: any;
      media?: any;
      message_reference?: any;
      event_id?: string;
      msg_id?: string;
      msg_seq?: number;
      is_wakeup?: boolean;
    },
  ): Promise<{ id: string; timestamp: number }> {
    const data = await this.httpClient.post(
      `/v2/users/${openid}/messages`,
      options,
    );
    return data;
  }

  /**
   * 发送群聊消息
   * @param {string} groupOpenid - 群聊的openid
   * @param {Object} options - 消息选项
   * @param {string} options.content - 文本消息内容
   * @param {number} options.msg_type - 消息类型：0 文本、2 markdown、3 ark、4 embed、7 media
   * @param {Object} options.markdown - Markdown 对象
   * @param {Object} options.keyboard - Keyboard 对象
   * @param {Object} options.media - 富媒体群聊的 file_info
   * @param {Object} options.ark - Ark 对象
   * @param {Object} options.message_reference - 消息引用
   * @param {string} options.event_id - 前置收到的事件 ID，用于发送被动消息
   * @param {string} options.msg_id - 前置收到的用户发送过来的消息 ID，用于发送被动消息（回复）
   * @param {number} options.msg_seq - 回复消息的序号，与 msg_id 联合使用
   * @returns {Promise<{id: string, timestamp: number}>} 发送的消息结果
   */
  async sendGroupMessage(
    groupOpenid: string,
    options: {
      content: string;
      msg_type: number;
      markdown?: any;
      keyboard?: any;
      media?: any;
      ark?: any;
      message_reference?: any;
      event_id?: string;
      msg_id?: string;
      msg_seq?: number;
    },
  ): Promise<{ id: string; timestamp: number }> {
    const data = await this.httpClient.post(
      `/v2/groups/${groupOpenid}/messages`,
      options,
    );
    return data;
  }
}

export default MessageAPI;
