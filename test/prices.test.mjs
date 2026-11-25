import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { parseOrdersTop } from '../js/lib/prices.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURE_PATH = path.resolve(__dirname, '../fixtures/orders-fixture.json');
const DATA_PRICES_PATH = path.resolve(__dirname, '../data/prices.json');

describe('价格解析与乱序订单提取 (Price Parsing & Fixture Isolation)', () => {
  it('使用乱序订单 fixture 提取正确 min(sell.platinum) 与 max(buy.platinum)', () => {
    assert.ok(fs.existsSync(FIXTURE_PATH), 'fixtures/orders-fixture.json 必须存在');
    const fixtureData = JSON.parse(fs.readFileSync(FIXTURE_PATH, 'utf8'));

    const result = parseOrdersTop(fixtureData, { slug: 'test_item' });

    assert.strictEqual(result.sellMin, 18, '最低在线卖价应为 18');
    assert.strictEqual(result.buyMax, 15, '最高在线买价应为 15');
    assert.strictEqual(result.sellCount, 4);
    assert.strictEqual(result.buyCount, 3);
  });

  it('验证 fetchedAt 与 source 字段成功写入', () => {
    const fixtureData = JSON.parse(fs.readFileSync(FIXTURE_PATH, 'utf8'));
    const result = parseOrdersTop(fixtureData, { slug: 'arcane_energize', targetRank: 5 });

    assert.ok(result.fetchedAt, '必须生成 fetchedAt 字段');
    assert.ok(!isNaN(new Date(result.fetchedAt).getTime()), 'fetchedAt 必须为有效 ISO 时间戳');
    assert.strictEqual(result.rank, 5);
    assert.ok(result.source.includes('warframe.market v2 /orders/item/arcane_energize/top?rank=5'));
  });

  it('支持根据 targetRank 过滤指定等级的订单', () => {
    const rankOrdersData = {
      sell: [
        { platinum: 80, rank: 0, user: { status: 'ingame' } },
        { platinum: 60, rank: 0, user: { status: 'online' } },
        { platinum: 1500, rank: 5, user: { status: 'ingame' } },
        { platinum: 1200, rank: 5, user: { status: 'online' } }
      ],
      buy: [
        { platinum: 40, rank: 0, user: { status: 'online' } },
        { platinum: 900, rank: 5, user: { status: 'online' } }
      ]
    };

    const r0Result = parseOrdersTop(rankOrdersData, { targetRank: 0 });
    assert.strictEqual(r0Result.sellMin, 60, '0 级最低卖价应为 60');
    assert.strictEqual(r0Result.buyMax, 40, '0 级最高买价应为 40');
    assert.strictEqual(r0Result.sellCount, 2);

    const r5Result = parseOrdersTop(rankOrdersData, { targetRank: 5 });
    assert.strictEqual(r5Result.sellMin, 1200, '5 级最低卖价应为 1200');
    assert.strictEqual(r5Result.buyMax, 900, '5 级最高买价应为 900');
    assert.strictEqual(r5Result.sellCount, 2);
  });

  it('A1 断言: fixture 模式执行绝不会改写 data/prices.json', () => {
    // 记录执行前 data/prices.json 状态
    const beforeContent = fs.readFileSync(DATA_PRICES_PATH, 'utf8');

    // 运行 fetch-prices.mjs 并传入 --fixture
    execFileSync(process.execPath, [
      path.resolve(__dirname, '../scripts/fetch-prices.mjs'),
      '--fixture',
      FIXTURE_PATH,
      '--limit',
      '5'
    ], { stdio: 'pipe' });

    // 验证执行后文件内容完全未被更改
    const afterContent = fs.readFileSync(DATA_PRICES_PATH, 'utf8');
    assert.strictEqual(afterContent, beforeContent, 'fixture 模式绝不能修改 data/prices.json');
  });
});
