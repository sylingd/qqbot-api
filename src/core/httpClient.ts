/**
 * QQ Bot API HTTP客户端
 * 基于腾讯官方文档：https://bot.q.qq.com/wiki/develop/api-v2/
 */

import type BotTokenManager from './botToken';

// 简单封装的 fetch 函数，添加默认配置、超时处理和错误处理
async function fetchWrapper(
  url: string,
  options: RequestInit = {},
  timeout: number = 10000,
) {
  // 创建一个 AbortController 来处理超时
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // 将 signal 添加到 options 中
    const opts = { ...options, signal: controller.signal };

    const response = await fetch(url, opts);

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${response.statusText}`,
      );
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }

    throw new Error('Unknown error occurred during fetch');
  }
}

/**
 * HTTP客户端类
 */
class QQBotHttpClient {
  private tokenManager: BotTokenManager;
  private baseURL: string;
  private timeout: number;

  /**
   * 构造函数
   * @param tokenManager - Token管理器
   * @param isSandbox - 是否为沙箱环境
   * @param timeout - 请求超时时间（毫秒），默认10秒
   */
  constructor(
    tokenManager: BotTokenManager,
    isSandbox?: boolean,
    timeout: number = 10000,
  ) {
    this.tokenManager = tokenManager;
    this.timeout = timeout;

    // 获取API基础URL
    this.baseURL = isSandbox
      ? 'https://sandbox.api.sgroup.qq.com'
      : 'https://api.sgroup.qq.com';
  }

  /**
   * 发送请求的通用方法
   * @param method - 请求方法
   * @param url - 请求URL
   * @param data - 请求数据（可选）
   * @param params - 查询参数（可选）
   * @returns 响应数据
   */
  private async request(
    method: string,
    url: string,
    data?: any,
    params?: any,
  ): Promise<any> {
    let fullUrl = `${this.baseURL}${url}`;

    // 处理查询参数
    if (params) {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          searchParams.append(key, params[key]);
        }
      });

      const queryString = searchParams.toString();
      if (queryString) {
        fullUrl += `?${queryString}`;
      }
    }

    // 获取认证令牌
    const token = await this.tokenManager.getToken();

    // 构建请求选项
    const options: RequestInit = {
      method,
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    };

    // 如果是需要body的方法，添加请求体
    const mu = method.toLocaleUpperCase();
    if (mu !== 'GET' && mu !== 'HEAD' && data) {
      options.body = JSON.stringify(data);
    }

    // 使用封装的 fetch 发送请求
    return fetchWrapper(fullUrl, options, this.timeout);
  }

  /**
   * 发送GET请求
   * @param url - 请求URL
   * @param params - 查询参数
   * @returns 响应数据
   */
  async get(url: string, params?: any): Promise<any> {
    return this.request('GET', url, undefined, params);
  }

  /**
   * 发送POST请求
   * @param url - 请求URL
   * @param data - 请求数据
   * @returns 响应数据
   */
  async post(url: string, data?: any): Promise<any> {
    return this.request('POST', url, data);
  }

  /**
   * 发送PUT请求
   * @param url - 请求URL
   * @param data - 请求数据
   * @returns 响应数据
   */
  async put(url: string, data?: any): Promise<any> {
    return this.request('PUT', url, data);
  }

  /**
   * 发送DELETE请求
   * @param url - 请求URL
   * @returns 响应数据
   */
  async delete(url: string, params?: any): Promise<any> {
    return this.request('DELETE', url, undefined, params);
  }

  /**
   * 发送PATCH请求
   * @param url - 请求URL
   * @param data - 请求数据
   * @returns 响应数据
   */
  async patch(url: string, data?: any): Promise<any> {
    return this.request('PATCH', url, data);
  }
}

export default QQBotHttpClient;
