/**
 * Bot Token管理模块
 * 用于获取和管理QQ Bot Token
 */

interface TokenResponse {
  access_token: string;
  expires_in: number;
}

/**
 * Bot Token管理器
 */
class BotTokenManager {
  private appId: string | undefined;
  private clientSecret: string | undefined;
  private botToken: string | null = null;
  private botTokenExpireTime: number = 0;

  /**
   * 构造函数
   * @param appId - 机器人AppID
   * @param token - 已有的token
   * @param clientSecret - 机器人ClientSecret
   */
  constructor(appId?: string, token?: string, clientSecret?: string) {
    this.appId = appId;
    // 如果提供了token，则直接使用
    if (token) {
      this.botToken = token;
    }
    this.clientSecret = clientSecret;
  }

  /**
   * 获取Bot Token
   * @returns {Promise<TokenResponse>} Token信息
   */
  async getBotToken(): Promise<TokenResponse> {
    if (!this.appId || !this.clientSecret) {
      throw new Error('appId and clientSecret are required to get bot token');
    }

    try {
      const response = await fetch('https://bots.qq.com/app/getAppAccessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appId: this.appId,
          clientSecret: this.clientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      this.botToken = data.access_token;
      this.botTokenExpireTime = Date.now() + (data.expires_in - 60) * 1000; // 提前60秒过期

      return {
        access_token: this.botToken!,
        expires_in: data.expires_in,
      };
    } catch (error) {
      throw new Error(`Failed to get bot token: ${(error as Error).message}`);
    }
  }

  /**
   * 检查并刷新Bot Token
   * @returns {Promise<string>} Bot Token
   */
  async checkAndRefreshToken(): Promise<string> {
    if (!this.botToken || Date.now() >= this.botTokenExpireTime) {
      await this.getBotToken();
    }
    return this.botToken!;
  }

  /**
   * 获取完整的Bot Token字符串
   * 格式：Bot {appid}.{token}
   * @returns {Promise<string>} 完整的Bot Token
   */
  async getToken(): Promise<string> {
    const token = await this.checkAndRefreshToken();
    return `Bot ${this.appId}.${token}`;
  }

  /**
   * 清除Token缓存
   */
  clearToken(): void {
    this.botToken = null;
    this.botTokenExpireTime = 0;
  }
}

export default BotTokenManager;