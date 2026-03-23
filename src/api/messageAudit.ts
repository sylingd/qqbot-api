/**
 * 消息审核API
 * 基于腾讯官方文档：https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message-audit/
 */

import { MessageAudit } from '../types/index';
import QQBotHttpClient from '../core/httpClient';

class MessageAuditAPI {
  private httpClient: QQBotHttpClient;

  constructor(httpClient: QQBotHttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * 获取审核结果
   * @param {string} auditId - 审核ID
   * @returns {Promise<MessageAudit>} 审核结果
   */
  async getAuditResult(auditId: string): Promise<MessageAudit> {
    const data = await this.httpClient.get(`/message/audit/${auditId}`);
    return data;
  }
}

export default MessageAuditAPI;