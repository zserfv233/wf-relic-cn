import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { RateLimiter } from '../js/lib/rate-limiter.js';

describe('限速器间隔 (Rate Limiter Interval)', () => {
  it('连续请求严格保证最小时间间隔', async () => {
    const testIntervalMs = 80;
    const limiter = new RateLimiter(testIntervalMs);

    const startTime = Date.now();

    // 第一次调用立即通过
    await limiter.wait();
    const t1 = Date.now();

    // 第二次调用应至少等待 testIntervalMs
    await limiter.wait();
    const t2 = Date.now();

    // 第三次调用应再次等待 testIntervalMs
    await limiter.wait();
    const t3 = Date.now();

    const d1 = t2 - t1;
    const d2 = t3 - t2;
    const total = t3 - startTime;

    assert.ok(d1 >= testIntervalMs - 10, `第2次调用间隔 (${d1}ms) 应不低于 ${testIntervalMs}ms`);
    assert.ok(d2 >= testIntervalMs - 10, `第3次调用间隔 (${d2}ms) 应不低于 ${testIntervalMs}ms`);
    assert.ok(total >= 2 * testIntervalMs - 15, `总耗时 (${total}ms) 应不低于 ${2 * testIntervalMs}ms`);
  });

  it('超过间隔时间的调用无需额外等待', async () => {
    const limiter = new RateLimiter(50);
    await limiter.wait();

    // 手动等待 70ms（大于 50ms 限制）
    await new Promise(r => setTimeout(r, 70));

    const waited = await limiter.wait();
    assert.strictEqual(waited, 0, '已经超过间隔时间，不应产生额外等待');
  });
});
