/**
 * QQ Bot API HTTP客户端
 * 基于腾讯官方文档：https://bot.q.qq.com/wiki/develop/api-v2/
 */

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type Method,
} from 'axios';
import type BotTokenManager from './botToken';

/**
 * HTTP客户端类
 */
class QQBotHttpClient {
  private client: AxiosInstance;
  private tokenManager: BotTokenManager;

  /**
   * 构造函数
   * @param tokenManager - Token管理器
   * @param isSandbox - 是否为沙箱环境
   */
  constructor(tokenManager: BotTokenManager, isSandbox?: boolean) {
    this.tokenManager = tokenManager;

    // 获取API基础URL
    const baseURL = isSandbox
      ? 'https://sandbox.api.sgroup.qq.com'
      : 'https://api.sgroup.qq.com';

    // 创建Axios实例
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 添加请求拦截器
    this.client.interceptors.request.use(
      async config => {
        // 设置Authorization头部
        config.headers.Authorization = await this.tokenManager.getToken();
        return config;
      },
      error => {
        return Promise.reject(error);
      },
    );

    // 添加响应拦截器
    this.client.interceptors.response.use(
      response => {
        return response.data;
      },
      error => {
        // 处理错误
        return Promise.reject(error);
      },
    );
  }

  /**
   * 发送GET请求
   * @param url - 请求URL
   * @param params - 查询参数
   * @returns 响应数据
   */
  async get(url: string, params?: any): Promise<any> {
    return this.request('GET', url, { params });
  }

  /**
   * 发送POST请求
   * @param url - 请求URL
   * @param data - 请求数据
   * @returns 响应数据
   */
  async post(url: string, data?: any): Promise<any> {
    return this.request('POST', url, { data });
  }

  /**
   * 发送PUT请求
   * @param url - 请求URL
   * @param data - 请求数据
   * @returns 响应数据
   */
  async put(url: string, data?: any): Promise<any> {
    return this.request('PUT', url, { data });
  }

  /**
   * 发送DELETE请求
   * @param url - 请求URL
   * @returns 响应数据
   */
  async delete(url: string): Promise<any> {
    return this.request('DELETE', url);
  }

  /**
   * 发送PATCH请求
   * @param url - 请求URL
   * @param data - 请求数据
   * @returns 响应数据
   */
  async patch(url: string, data?: any): Promise<any> {
    return this.request('PATCH', url, { data });
  }

  /**
   * 发送请求
   * @param method - 请求方法
   * @param url - 请求URL
   * @param config - 请求配置
   * @returns 响应数据
   */
  private async request(
    method: Method,
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<any> {
    const response = await this.client.request({
      method,
      url,
      ...config,
    });

    return response.data;
  }
}

export default QQBotHttpClient;
