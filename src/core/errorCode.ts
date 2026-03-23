/**
 * QQ Bot API 错误码定义
 * 基于腾讯官方文档：https://bot.q.qq.com/wiki/develop/api-v2/openapi/error/error.html
 */

/**
 * 错误码定义
 */
export const ErrorCode = {
  // 通用错误码
  UNKNOWN: 0, // 未知错误
  SUCCESS: 1, // 成功
  TIMEOUT: 2, // 请求超时

  // 参数错误
  PARAM_ERROR: 1001, // 参数错误
  PARAM_MISSING: 1002, // 参数缺失
  PARAM_TYPE_ERROR: 1003, // 参数类型错误

  // Token相关错误
  TOKEN_ERROR: 11243, // Token错误
  TOKEN_EXPIRED: 11244, // Token过期
  TOKEN_INVALID: 11245, // Token无效

  // 权限相关错误
  NO_PERMISSION: 10403, // 无权限
  PERMISSION_DENIED: 10404, // 权限拒绝

  // 频道相关错误
  GUILD_NOT_FOUND: 11302, // 频道不存在
  GUILD_MEMBER_NOT_FOUND: 11303, // 成员不存在
  GUILD_ROLE_NOT_FOUND: 11304, // 身份组不存在
  UIN_NOT_FOUND: 11306, // UIN未找到
  BOT_NOT_IN_GUILD: 11305, // 机器人不在频道中

  // 子频道相关错误
  CHANNEL_NOT_FOUND: 11404, // 子频道不存在
  CHANNEL_TYPE_ERROR: 11405, // 子频道类型错误

  // 消息相关错误
  MESSAGE_NOT_FOUND: 12004, // 消息不存在
  MESSAGE_TOO_LONG: 12005, // 消息过长
  MESSAGE_CONTENT_ERROR: 12006, // 消息内容错误

  // 频率限制
  RATE_LIMIT: 13000, // 频率限制
  RATE_LIMIT_EXCEEDED: 13001, // 超过频率限制

  // 系统错误
  INTERNAL_ERROR: 14000, // 内部错误
  SERVICE_UNAVAILABLE: 14001, // 服务不可用
  DATABASE_ERROR: 14002, // 数据库错误
} as const;

// 获取ErrorCode的所有键值对类型
export type ErrorCodeKey = keyof typeof ErrorCode;
export type ErrorCodeValue = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * 错误码描述
 */
export const ErrorMessages: Record<ErrorCodeValue, string> = {
  [ErrorCode.UNKNOWN]: '未知错误',
  [ErrorCode.SUCCESS]: '成功',
  [ErrorCode.TIMEOUT]: '请求超时',
  [ErrorCode.PARAM_ERROR]: '参数错误',
  [ErrorCode.PARAM_MISSING]: '参数缺失',
  [ErrorCode.PARAM_TYPE_ERROR]: '参数类型错误',
  [ErrorCode.TOKEN_ERROR]: 'Token错误',
  [ErrorCode.TOKEN_EXPIRED]: 'Token过期',
  [ErrorCode.TOKEN_INVALID]: 'Token无效',
  [ErrorCode.NO_PERMISSION]: '无权限',
  [ErrorCode.PERMISSION_DENIED]: '权限拒绝',
  [ErrorCode.GUILD_NOT_FOUND]: '频道不存在',
  [ErrorCode.GUILD_MEMBER_NOT_FOUND]: '成员不存在',
  [ErrorCode.GUILD_ROLE_NOT_FOUND]: '身份组不存在',
  [ErrorCode.CHANNEL_NOT_FOUND]: '子频道不存在',
  [ErrorCode.CHANNEL_TYPE_ERROR]: '子频道类型错误',
  [ErrorCode.MESSAGE_NOT_FOUND]: '消息不存在',
  [ErrorCode.MESSAGE_TOO_LONG]: '消息过长',
  [ErrorCode.MESSAGE_CONTENT_ERROR]: '消息内容错误',
  [ErrorCode.RATE_LIMIT]: '频率限制',
  [ErrorCode.RATE_LIMIT_EXCEEDED]: '超过频率限制',
  [ErrorCode.INTERNAL_ERROR]: '内部错误',
  [ErrorCode.SERVICE_UNAVAILABLE]: '服务不可用',
  [ErrorCode.DATABASE_ERROR]: '数据库错误',
  [ErrorCode.UIN_NOT_FOUND]: 'UIN未找到',
  [ErrorCode.BOT_NOT_IN_GUILD]: '机器人不在频道中',
};

// 定义错误数据接口
export interface IErrorData {
  [key: string]: any;
}

/**
 * QQ Bot API错误类
 */
export class QQBotError extends Error {
  public readonly code: ErrorCodeValue;
  public readonly data: IErrorData | null;
  public readonly timestamp: number;

  constructor(
    code: ErrorCodeValue,
    message?: string,
    data: IErrorData | null = null,
  ) {
    super(message || ErrorMessages[code] || '未知错误');
    this.name = 'QQBotError';
    this.code = code;
    this.data = data;
    this.timestamp = Date.now();

    // 维护原型链
    Object.setPrototypeOf(this, QQBotError.prototype);
  }

  /**
   * 获取错误描述
   * @returns {string} 错误描述
   */
  getDescription(): string {
    return `[${this.code}] ${this.message}`;
  }

  /**
   * 转换为JSON
   * @returns {Object} JSON对象
   */
  toJSON(): {
    name: string;
    code: number;
    message: string;
    data: IErrorData | null;
    timestamp: number;
  } {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      data: this.data,
      timestamp: this.timestamp,
    };
  }

  /**
   * 判断是否为特定错误码
   * @param {ErrorCodeValue} code - 错误码
   * @returns {boolean} 是否匹配
   */
  is(code: ErrorCodeValue): boolean {
    return this.code === code;
  }

  /**
   * 判断是否为 Token 错误
   * @returns {boolean} 是否为 Token 错误
   */
  isTokenError(): boolean {
    const tokenErrorCodes: ErrorCodeValue[] = [
      ErrorCode.TOKEN_ERROR,
      ErrorCode.TOKEN_EXPIRED,
      ErrorCode.TOKEN_INVALID,
    ];
    return tokenErrorCodes.includes(this.code);
  }

  /**
   * 判断是否为权限错误
   * @returns {boolean} 是否为权限错误
   */
  isPermissionError(): boolean {
    const permissionErrorCodes: ErrorCodeValue[] = [
      ErrorCode.NO_PERMISSION,
      ErrorCode.PERMISSION_DENIED,
    ];
    return permissionErrorCodes.includes(this.code);
  }

  /**
   * 判断是否为频率限制错误
   * @returns {boolean} 是否为频率限制错误
   */
  isRateLimitError(): boolean {
    const rateLimitErrorCodes: ErrorCodeValue[] = [
      ErrorCode.RATE_LIMIT,
      ErrorCode.RATE_LIMIT_EXCEEDED,
    ];
    return rateLimitErrorCodes.includes(this.code);
  }

  /**
   * 判断是否为资源不存在错误
   * @returns {boolean} 是否为资源不存在错误
   */
  isNotFoundError(): boolean {
    const notFoundErrorCodes: ErrorCodeValue[] = [
      ErrorCode.GUILD_NOT_FOUND,
      ErrorCode.GUILD_MEMBER_NOT_FOUND,
      ErrorCode.GUILD_ROLE_NOT_FOUND,
      ErrorCode.CHANNEL_NOT_FOUND,
      ErrorCode.MESSAGE_NOT_FOUND,
    ];
    return notFoundErrorCodes.includes(this.code);
  }
}

/**
 * 创建QQ Bot错误
 * @param {number} code - 错误码
 * @param {string} message - 错误消息
 * @param {Object} data - 错误数据
 * @returns {QQBotError} 错误对象
 */
export function createError(
  code: ErrorCodeValue,
  message?: string,
  data: IErrorData | null = null,
): QQBotError {
  return new QQBotError(code, message, data);
}

/**
 * 从API响应创建错误
 * @param {Object} response - API响应
 * @returns {QQBotError} 错误对象
 */
export function createErrorFromResponse(response: {
  code?: number;
  message?: string;
  [key: string]: any;
}): QQBotError {
  const code = response.code !== undefined ? response.code : ErrorCode.UNKNOWN;
  const message =
    response.message || ErrorMessages[code as ErrorCodeValue] || '未知错误';
  return new QQBotError(code as ErrorCodeValue, message, response);
}
