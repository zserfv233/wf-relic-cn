import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { parseOrdersTop, LOW_CONFIDENCE_MIN_SELLERS } from '../js/lib/prices.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURE_PATH = path.resolve(__dirname, '../fixtures/orders-fixture.json');
const DATA_PRICES_PATH = path.resolve(__dirname, '../data/prices.json');

describe('价格解析与乱序订单提取 (Price Parsing & Fixture Isolation)', () => {
  it('使用乱序订单 fixture 提取正确 min(sell.platinum) 与 max(buy.platinum)，并计算 sellRobust 中位数', () => {
    assert.ok(fs.existsSync(FIXTURE_PATH), 'fixtures/orders-fixture.json 必须存在');
    const fixtureData = JSON.parse(fs.readFileSync(FIXTURE_PATH, 'utf8'));

    const result = parseOrdersTop(fixtureData, { slug: 'test_item' });

    assert.strictEqual(result.sellMin, 18, '最低在线卖价应为 18');
    assert.strictEqual(result.buyMax, 15, '最高在线买价应为 15');
    assert.strictEqual(result.sellCount, 4);
    assert.strictEqual(result.buyCount, 3);

    // 在线卖单为 [18, 20, 25, 45]，前 3 个为 [18, 20, 25]，中位数为 20
    assert.strictEqual(result.sellRobust, 20, '最低 min(3, n) 个卖单价格中位数必须为 20');
    assert.strictEqual(result.lowConfidence, false, '卖单数 >= 3 时 lowConfidence 应为 false');
    assert.strictEqual(result.noBuyOrders, false);
    assert.strictEqual(result.uniqueSellers, 4);
    assert.strictEqual(result.uniqueBuyers, 3);
  });

  it('验证 fetchedAt 与 source 字段成功写入', () => {
    const fixtureData = JSON.parse(fs.readFileSync(FIXTURE_PATH, 'utf8'));
    const result = parseOrdersTop(fixtureData, { slug: 'arcane_energize', targetRank: 5 });

    assert.ok(result.fetchedAt, '必须生成 fetchedAt 字段');
    assert.ok(!isNaN(new Date(result.fetchedAt).getTime()), 'fetchedAt 必须为有效 ISO 时间戳');
    assert.strictEqual(result.rank, 5);
    assert.ok(result.source.includes('warframe.market v2 /orders/item/arcane_energize/top?rank=5'));
  });

  it('支持根据 targetRank 过滤指定等级的订单，并在卖单 < 3 时标记 lowConfidence 且 sellRobust 回退 sellMin', () => {
    const rankOrdersData = {
      sell: [
        { platinum: 80, rank: 0, user: { status: 'ingame', ingameName: 'P1' } },
        { platinum: 60, rank: 0, user: { status: 'online', ingameName: 'P2' } },
        { platinum: 1500, rank: 5, user: { status: 'ingame', ingameName: 'P3' } },
        { platinum: 1200, rank: 5, user: { status: 'online', ingameName: 'P4' } }
      ],
      buy: [
        { platinum: 40, rank: 0, user: { status: 'online', ingameName: 'B1' } },
        { platinum: 900, rank: 5, user: { status: 'online', ingameName: 'B2' } }
      ]
    };

    const r0Result = parseOrdersTop(rankOrdersData, { targetRank: 0 });
    assert.strictEqual(r0Result.sellMin, 60, '0 级最低卖价应为 60');
    assert.strictEqual(r0Result.buyMax, 40, '0 级最高买价应为 40');
    assert.strictEqual(r0Result.sellCount, 2);
    assert.strictEqual(r0Result.sellRobust, 60, '卖单数 < 3 时 sellRobust 等于现有 sellMin');
    assert.strictEqual(r0Result.lowConfidence, true, '卖单数 2 < 3 应标记 lowConfidence === true');

    const r5Result = parseOrdersTop(rankOrdersData, { targetRank: 5 });
    assert.strictEqual(r5Result.sellMin, 1200, '5 级最低卖价应为 1200');
    assert.strictEqual(r5Result.buyMax, 900, '5 级最高买价应为 900');
    assert.strictEqual(r5Result.sellCount, 2);
    assert.strictEqual(r5Result.sellRobust, 1200);
    assert.strictEqual(r5Result.lowConfidence, true);
  });

  it('A1 断言: fixture 模式执行绝不会改写 data/prices.json', () => {
    const beforeContent = fs.readFileSync(DATA_PRICES_PATH, 'utf8');

    execFileSync(process.execPath, [
      path.resolve(__dirname, '../scripts/fetch-prices.mjs'),
      '--fixture',
      FIXTURE_PATH,
      '--limit',
      '5'
    ], { stdio: 'pipe' });

    const afterContent = fs.readFileSync(DATA_PRICES_PATH, 'utf8');
    assert.strictEqual(afterContent, beforeContent, 'fixture 模式绝不能修改 data/prices.json');
  });
});
