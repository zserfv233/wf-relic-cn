/**
 * rate-limiter.js - 请求限速器与指数退避重试
 */

export class RateLimiter {
  /**
   * @param {number} minIntervalMs 两次请求之间的最小毫秒间隔（严格 ≤ 3 req/s 对应 ≥ 334ms，默认 350ms）
   */
  constructor(minIntervalMs = 350) {
    this.minIntervalMs = minIntervalMs;
    this.lastRequestTime = 0;
  }

  /**
   * 等待直到满足最小时间间隔
   * @returns {Promise<number>} 实际等待的毫秒数
   */
  async wait() {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    let waited = 0;
    if (elapsed < this.minIntervalMs) {
      waited = this.minIntervalMs - elapsed;
      await new Promise(resolve => setTimeout(resolve, waited));
    }
    this.lastRequestTime = Date.now();
    return waited;
  }
}

/**
 * 带指数退避重试的网络请求
 * @param {string} url 目标请求 URL
 * @param {Object} options fetch 配置项
 * @param {Object} retryOptions 重试配置
 * @returns {Promise<Response>}
 */
export async function fetchWithRetry(url, options = {}, { maxRetries = 3, baseDelayMs = 1000, rateLimiter = null } = {}) {
  let attempt = 0;
  while (true) {
    if (rateLimiter) {
      await rateLimiter.wait();
    }

    try {
      const response = await fetch(url, options);

      // 429 速率限制 或 5xx 服务端错误进行指数退避重试
      if ((response.status === 429 || response.status >= 500) && attempt < maxRetries) {
        attempt++;
        const retryAfter = response.headers.get('retry-after');
        let delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : baseDelayMs * Math.pow(2, attempt - 1);
        if (isNaN(delay) || delay <= 0) delay = baseDelayMs * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      return response;
    } catch (err) {
      attempt++;
      if (attempt > maxRetries) throw err;
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
