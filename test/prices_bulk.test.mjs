import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseOrdersTop, PRICE_SCHEMA_VERSION, computeCategoryStats } from '../js/lib/prices.js';
import { isFreshPrice } from '../scripts/fetch-prices.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));

describe('批量赋能报价按单件白金比较', () => {
  it('混合批量买卖单先逐单折算，再计算极值、中位数与覆盖率', () => {
    const parsed = parseOrdersTop({ data: {
      sell: [
        { platinum: 60, perTrade: 6, quantity: 60 },
        { platinum: 18, perTrade: 1, quantity: 100 },
        { platinum: 33, perTrade: 3, quantity: 30 },
        { platinum: 100, perTrade: 5, quantity: 50 }
      ],
      buy: [{ platinum: 54, perTrade: 6 }, { platinum: 16, perTrade: 2 }]
    } }, { slug: 'test_arcane', targetRank: 0 });
    // 旧算法比较 18 与 54，会把有价键隔离。单件价应为卖 10、买 9。
    assert.equal(parsed.sellMin, 10);
    assert.equal(parsed.buyMax, 9);
    assert.equal(parsed.sellRobust, 11);
    assert.deepEqual(parsed.sellSamples, [10, 11, 18, 20]);
    assert.deepEqual(parsed.buySamples, [9, 8]);
    assert.equal(parsed.crossedMarket, false);
    assert.equal(parsed.priceSchemaVersion, PRICE_SCHEMA_VERSION);
    assert.equal(parsed.priceUnit, 'platinum/item');
    assert.deepEqual(parsed.rawOrderSamples.sell[0], {
      platinum: 60, perTrade: 6, unitPrice: 10, rank: null, subtype: null
    });
    assert.equal(computeCategoryStats(['test_arcane@r0'], { 'test_arcane@r0': parsed }).pricedCount, 1);
  });

  it('折算后的真实倒挂仍隔离；相等不隔离；分数价不取整', () => {
    const orders = { sell: [{ platinum: 10, perTrade: 3 }], buy: [{ platinum: 20, perTrade: 6 }] };
    assert.equal(parseOrdersTop(orders).crossedMarket, false);
    assert.equal(parseOrdersTop(orders).sellMin, 10 / 3);
    orders.buy[0].platinum = 21;
    const crossed = parseOrdersTop(orders);
    assert.equal(crossed.crossedMarket, true);
    assert.equal(crossed.rawSellMin, 10 / 3);
    assert.equal(crossed.rawBuyMax, 3.5);
    assert.equal(crossed.sellMin, null);
    assert.equal(crossed.buyMax, null);
    assert.equal(crossed.sellRobust, null);
  });

  it('缺省数量为单件，兼容 per_trade；非法数量排除且不虚增卖家数', () => {
    const sell = [0, -1, 7, 1.5, '6', NaN, Infinity].map((perTrade, i) => ({
      platinum: 1, perTrade, user: { id: `bad-${i}` }
    }));
    sell.push({ platinum: 12, per_trade: 6, quantity: 600, user: { id: 'valid' } });
    const parsed = parseOrdersTop({ sell, buy: [{ platinum: 1, quantity: 100 }] });
    assert.equal(parsed.sellMin, 2);
    assert.equal(parsed.buyMax, 1);
    assert.equal(parsed.sellCount, 1);
    assert.equal(parsed.uniqueSellers, 1);
    assert.equal(parsed.rawOrderSamples.sell[0].perTrade, 6);
  });

  it('等级与 subtype 过滤继续先于批量报价计算', () => {
    const parsed = parseOrdersTop({
      sell: [
        { platinum: 1, rank: 5, subtype: 'unrevealed', perTrade: 6 },
        { platinum: 1, rank: 0, subtype: 'revealed', perTrade: 6 },
        { platinum: 12, rank: 0, subtype: 'unrevealed', perTrade: 3 }
      ], buy: []
    }, { targetRank: 0, subtype: 'unrevealed' });
    assert.equal(parsed.sellMin, 4);
    assert.equal(parsed.sellCount, 1);
    assert.equal(parsed.rawOrderSamples.sell[0].rank, 0);
  });

  it('旧总价缓存即使 TTL 未到期也重抓，新单价缓存仍遵守 TTL', () => {
    const now = Date.now();
    const cached = { priceSchemaVersion: 2, fetchedAt: new Date(now).toISOString() };
    assert.equal(isFreshPrice(cached, now, 3600000), false);
    cached.priceSchemaVersion = PRICE_SCHEMA_VERSION;
    assert.equal(isFreshPrice(cached, now, 3600000), true);
    assert.equal(isFreshPrice(cached, now + 3600000, 3600000), false);
    cached.fetchedAt = 'invalid';
    assert.equal(isFreshPrice(cached, now, 3600000), false);
  });

  it('抓价脚本在临时副本刷新新鲜 v2 缓存，逐单证据和单价完整写入', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wf-bulk-prices-'));
    try {
      const out = path.join(dir, 'prices.json');
      const fixture = path.join(dir, 'orders.json');
      const first = JSON.parse(fs.readFileSync(path.join(root, 'data/arcanes.json')))[0];
      const key = `${first.slug}@r0`;
      fs.writeFileSync(out, JSON.stringify({ items: {
        [key]: { priceSchemaVersion: 2, sellMin: 99, buyMax: 88, fetchedAt: new Date().toISOString() }
      } }));
      fs.writeFileSync(fixture, JSON.stringify({ data: {
        sell: [{ platinum: 60, perTrade: 6, rank: 0 }],
        buy: [{ platinum: 54, perTrade: 6, rank: 0 }]
      } }));
      execFileSync(process.execPath, [path.join(root, 'scripts/fetch-prices.mjs'),
        '--fixture', fixture, '--out', out, '--only', 'arcanes', '--limit', '1'
      ], { stdio: 'pipe' });
      const entry = JSON.parse(fs.readFileSync(out)).items[key];
      assert.equal(entry.priceSchemaVersion, PRICE_SCHEMA_VERSION);
      assert.equal(entry.sellMin, 10);
      assert.equal(entry.buyMax, 9);
      assert.equal(entry.rawOrderSamples.buy[0].platinum, 54);
      assert.equal(entry.rawOrderSamples.buy[0].perTrade, 6);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
