import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseOrdersTop } from '../js/lib/prices.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURE_PATH = path.resolve(__dirname, '../fixtures/orders-fixture.json');

describe('价格解析与乱序订单提取 (Price Parsing & Order Filtering)', () => {
  it('使用乱序订单 fixture 提取正确 min(sell.platinum) 与 max(buy.platinum)', () => {
    assert.ok(fs.existsSync(FIXTURE_PATH), 'fixtures/orders-fixture.json 必须存在');
    const fixtureData = JSON.parse(fs.readFileSync(FIXTURE_PATH, 'utf8'));

    // 在 fixture 中：
    // sell 价格列表: 45(online), 18(ingame), 12(offline), 25(online), 20(ingame)
    // 在线/游戏内卖家最低卖价应为 18 (忽略离线的 12)
    // buy 价格列表: 5(online), 15(ingame), 20(offline), 12(online)
    // 在线/游戏内买家最高收购价应为 15 (忽略离线的 20)
    const result = parseOrdersTop(fixtureData);

    assert.strictEqual(result.sellMin, 18, '最低在线卖价应为 18');
    assert.strictEqual(result.buyMax, 15, '最高在线买价应为 15');
    assert.strictEqual(result.sellCount, 4, '有效在线卖单数应为 4');
    assert.strictEqual(result.buyCount, 3, '有效在线买单数应为 3');
  });

  it('当全部卖家/买家离线时，优雅降级取全局 min/max', () => {
    const allOfflineData = {
      sell: [
        { platinum: 30, user: { status: 'offline' } },
        { platinum: 14, user: { status: 'offline' } },
        { platinum: 22, user: { status: 'offline' } }
      ],
      buy: [
        { platinum: 8, user: { status: 'offline' } },
        { platinum: 11, user: { status: 'offline' } }
      ]
    };

    const result = parseOrdersTop(allOfflineData);
    assert.strictEqual(result.sellMin, 14, '全离线时应降级取最低价 14');
    assert.strictEqual(result.buyMax, 11, '全离线时应降级取最高价 11');
    assert.strictEqual(result.sellCount, 3);
    assert.strictEqual(result.buyCount, 2);
  });

  it('支持无 status 简易订单列表（直接乱序数字）', () => {
    const rawOrders = {
      sell: [{ platinum: 99 }, { platinum: 10 }, { platinum: 50 }, { platinum: 25 }],
      buy: [{ platinum: 2 }, { platinum: 8 }, { platinum: 5 }]
    };

    const result = parseOrdersTop(rawOrders);
    assert.strictEqual(result.sellMin, 10);
    assert.strictEqual(result.buyMax, 8);
  });

  it('处理空订单或无效数据不抛异常', () => {
    const emptyResult = parseOrdersTop({});
    assert.strictEqual(emptyResult.sellMin, null);
    assert.strictEqual(emptyResult.buyMax, null);
    assert.strictEqual(emptyResult.sellCount, 0);
    assert.strictEqual(emptyResult.buyCount, 0);

    const nullResult = parseOrdersTop(null);
    assert.strictEqual(nullResult.sellMin, null);
    assert.strictEqual(nullResult.buyMax, null);
  });
});
