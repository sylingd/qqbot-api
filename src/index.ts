/**
 * QQ Bot SDK
 * 基于腾讯官方文档：https://bot.q.qq.com/wiki/develop/api-v2/
 *
 * 使用方法：
 * import QQBot from 'qqbot-plugin';
 *
 * const bot = new QQBot({
 *   appId: 'your-app-id',
 *   token: 'your-token',
 * });
 *
 * bot.on('ready', () => {
 *   console.log('Bot is ready!');
 * });
 *
 * bot.on('MESSAGE_CREATE', (message) => {
 *   console.log('New message:', message);
 * });
 *
 * bot.start();
 */

import QQBotClient from './client';

export { ErrorCode, QQBotError } from './core/errorCode';
// 导出主类
export default QQBotClient;

// 导出所有类型
export * from './types/index';
