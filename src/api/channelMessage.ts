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
import type { Message as MessageType } from '../types/index';

class ChannelMessageAPI {
  private httpClient: QQBotHttpClient;

  constructor(httpClient: QQBotHttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * 获取指定消息
   * @param {string} channelId - 子频道ID
   * @param {string} messageId - 消息ID
   * @returns {Promise<MessageType>} 消息信息
   */
  async getMessage(channelId: string, messageId: string): Promise<MessageType> {
    const data = await this.httpClient.get(
      `/channels/${channelId}/messages/${messageId}`,
    );
    return data;
  }

  /**
   * 获取指定子频道的消息列表
   * @param {string} channelId - 子频道ID
   * @param {Object} options - 分页选项
   * @param {string} options.type - 分页类型，0:按ID，1:按时间
   * @param {string} options.id - 消息ID
   * @param {string} options.limit - 每页数量，默认20，最大50
   * @returns {Promise<MessageType[]>} 消息列表
   */
  async getMessages(
    channelId: string,
    options: { type?: string; id?: string; limit?: string } = {},
  ): Promise<MessageType[]> {
    const params: any = {};
    if (options.type !== undefined) params.type = options.type;
    if (options.id) params.id = options.id;
    if (options.limit) params.limit = options.limit;

    const data = await this.httpClient.get(
      `/channels/${channelId}/messages`,
      params,
    );
    return data.map((msg: any) => msg);
  }

  /**
   * 发送消息
   * @param {string} channelId - 子频道ID
   * @param {Object} options - 消息选项
   * @param {string} options.content - 消息内容
   * @param {Object} options.embed - embed消息
   * @param {Object} options.ark - ark消息
   * @param {Object} options.message_reference - 引用消息
   * @param {Object} options.image - 图片URL
   * @param {Object} options.msg_id - 消息ID（用于被动消息）
   * @param {number} options.event_id - 事件ID（用于被动消息）
   * @param {string} options.markdown - markdown消息
   * @returns {Promise<MessageType>} 发送的消息
   */
  async sendMessage(
    channelId: string,
    options: {
      content?: string;
      embed?: any;
      ark?: any;
      message_reference?: { message_id: string };
      image?: string;
      msg_id?: string;
      event_id?: number;
      markdown?: any;
    },
  ): Promise<MessageType> {
    const data = await this.httpClient.post(
      `/channels/${channelId}/messages`,
      options,
    );
    return data;
  }

  /**
   * 发送文本消息
   * @param {string} channelId - 子频道ID
   * @param {string} content - 消息内容
   * @param {Object} options - 其他选项
   * @returns {Promise<MessageType>} 发送的消息
   */
  async sendTextMessage(
    channelId: string,
    content: string,
    options: any = {},
  ): Promise<MessageType> {
    return this.sendMessage(channelId, {
      content,
      ...options,
    });
  }

  /**
   * 发送Embed消息
   * @param {string} channelId - 子频道ID
   * @param {Object} embed - Embed对象
   * @param {Object} options - 其他选项
   * @returns {Promise<MessageType>} 发送的消息
   */
  async sendEmbedMessage(
    channelId: string,
    embed: any,
    options: any = {},
  ): Promise<MessageType> {
    return this.sendMessage(channelId, {
      embed,
      ...options,
    });
  }

  /**
   * 发送Ark消息
   * @param {string} channelId - 子频道ID
   * @param {Object} ark - Ark对象
   * @param {Object} options - 其他选项
   * @returns {Promise<MessageType>} 发送的消息
   */
  async sendArkMessage(
    channelId: string,
    ark: any,
    options: any = {},
  ): Promise<MessageType> {
    return this.sendMessage(channelId, {
      ark,
      ...options,
    });
  }

  /**
   * 发送Markdown消息
   * @param {string} channelId - 子频道ID
   * @param {Object} markdown - Markdown对象
   * @param {Object} options - 其他选项
   * @returns {Promise<MessageType>} 发送的消息
   */
  async sendMarkdownMessage(
    channelId: string,
    markdown: any,
    options: any = {},
  ): Promise<MessageType> {
    return this.sendMessage(channelId, {
      markdown,
      ...options,
    });
  }

  /**
   * 发送图片消息
   * @param {string} channelId - 子频道ID
   * @param {string} imageUrl - 图片URL
   * @param {Object} options - 其他选项
   * @returns {Promise<MessageType>} 发送的消息
   */
  async sendImageMessage(
    channelId: string,
    imageUrl: string,
    options: any = {},
  ): Promise<MessageType> {
    return this.sendMessage(channelId, {
      image: imageUrl,
      ...options,
    });
  }

  /**
   * 发送引用消息
   * @param {string} channelId - 子频道ID
   * @param {string} content - 消息内容
   * @param {string} referenceMessageId - 引用的消息ID
   * @param {Object} options - 其他选项
   * @returns {Promise<MessageType>} 发送的消息
   */
  async sendReplyMessage(
    channelId: string,
    content: string,
    referenceMessageId: string,
    options: any = {},
  ): Promise<MessageType> {
    return this.sendMessage(channelId, {
      content,
      message_reference: {
        message_id: referenceMessageId,
      },
      ...options,
    });
  }

  /**
   * 撤回消息
   * @param {string} channelId - 子频道ID
   * @param {string} messageId - 消息ID
   * @param {boolean} hideTip - 是否隐藏撤回提示
   * @returns {Promise<void>}
   */
  async deleteMessage(
    channelId: string,
    messageId: string,
    hideTip: boolean = false,
  ): Promise<void> {
    let url = `/channels/${channelId}/messages/${messageId}`;
    if (hideTip) url += '?hide_tip=true';
    await this.httpClient.delete(url);
  }

  /**
   * 创建私信会话
   * @param {string} recipientId - 接收者ID
   * @param {string} sourceGuildId - 来源频道ID
   * @returns {Promise<Object>} 私信会话信息
   */
  async createDMS(recipientId: string, sourceGuildId: string): Promise<any> {
    const data = await this.httpClient.post('/users/@me/dms', {
      recipient_id: recipientId,
      source_guild_id: sourceGuildId,
    });
    return data;
  }

  /**
   * 发送私信
   * @param {string} guildId - 私信频道ID
   * @param {Object} options - 消息选项
   * @param {string} options.content - 消息内容
   * @param {Object} options.embed - embed消息
   * @param {Object} options.ark - ark消息
   * @param {Object} options.image - 图片URL
   * @param {string} options.markdown - markdown消息
   * @returns {Promise<Object>} 发送的消息
   */
  async sendDMS(guildId: string, options: any): Promise<any> {
    const data = await this.httpClient.post(
      `/dms/${guildId}/messages`,
      options,
    );
    return data;
  }

  /**
   * 获取富媒体消息
   * 用于获取消息中的富媒体内容
   * @param {string} channelId - 子频道ID
   * @param {string} messageId - 消息ID
   * @returns {Promise<Object>} 富媒体消息信息
   */
  async getRichMediaMessage(
    channelId: string,
    messageId: string,
  ): Promise<any> {
    const data = await this.httpClient.get(
      `/channels/${channelId}/messages/${messageId}`,
    );
    return {
      id: data.id,
      channel_id: data.channel_id,
      guild_id: data.guild_id,
      content: data.content,
      attachments: data.attachments,
      embeds: data.embeds,
      ark: data.ark,
    };
  }

  /**
   * 设置消息按钮
   * 为消息添加交互按钮
   * @param {string} channelId - 子频道ID
   * @param {string} messageId - 消息ID
   * @param {Object} keyboard - 按钮配置
   * @returns {Promise<MessageType>} 更新后的消息
   */
  async setMessageButtons(
    channelId: string,
    messageId: string,
    keyboard: any,
  ): Promise<MessageType> {
    const data = await this.httpClient.patch(
      `/channels/${channelId}/messages/${messageId}`,
      {
        keyboard,
      },
    );
    return data;
  }

  /**
   * 创建消息按钮模板
   * @param {Object} template - 按钮模板配置
   * @returns {Promise<Object>} 模板信息
   */
  async createButtonTemplate(template: any): Promise<any> {
    const data = await this.httpClient.post(
      '/messages/button-templates',
      template,
    );
    return data;
  }

  /**
   * 获取消息按钮模板列表
   * @returns {Promise<Object[]>} 模板列表
   */
  async getButtonTemplates(): Promise<any[]> {
    const data = await this.httpClient.get('/messages/button-templates');
    return data;
  }

  /**
   * 删除消息按钮模板
   * @param {string} templateId - 模板ID
   * @returns {Promise<void>}
   */
  async deleteButtonTemplate(templateId: string): Promise<void> {
    await this.httpClient.delete(`/messages/button-templates/${templateId}`);
  }
}

export default ChannelMessageAPI;
