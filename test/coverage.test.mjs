import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { calculatePriceCoverage, computeCategoryStats } from '../js/lib/prices.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

describe('价格覆盖率与统计口径 (Price Coverage & Meta - Phase 4)', () => {
  const pricesPath = path.join(DATA_DIR, 'prices.json');
  const metaPath = path.join(DATA_DIR, 'meta.json');
  const relicsPath = path.join(DATA_DIR, 'relics.json');
  const arcanesPath = path.join(DATA_DIR, 'arcanes.json');
  const rivensPath = path.join(DATA_DIR, 'rivens.json');
  const modsPath = path.join(DATA_DIR, 'mods.json');

  assert.ok(fs.existsSync(pricesPath), 'data/prices.json 必须存在');
  assert.ok(fs.existsSync(metaPath), 'data/meta.json 必须存在');

  const pricesData = JSON.parse(fs.readFileSync(pricesPath, 'utf8'));
  const metaData = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const relicsData = JSON.parse(fs.readFileSync(relicsPath, 'utf8')).relics;
  const arcanesData = JSON.parse(fs.readFileSync(arcanesPath, 'utf8'));
  const rivensData = JSON.parse(fs.readFileSync(rivensPath, 'utf8'));
  const modsData = JSON.parse(fs.readFileSync(modsPath, 'utf8'));

  it('基于 data/prices.json 真实数据计算各类别覆盖率且每类 <= 100%', () => {
    const coverage = calculatePriceCoverage(pricesData, {
      relics: relicsData,
      rivens: rivensData,
      arcanes: arcanesData,
      mods: modsData
    });

    // 1. 遗物奖励 (relics)
    assert.strictEqual(coverage.categories.relics.totalCount, 603, 'relics 应抓数必须为 603');
    assert.ok(coverage.categories.relics.pricedCount <= 603, 'relics 有价格数不得超过应抓数');
    assert.ok(parseFloat(coverage.categories.relics.coverage) <= 100.0, 'relics 覆盖率不得超过 100%');
    assert.strictEqual(coverage.categories.relics.coverage, '100.0%');

    // 2. 未开紫卡 (rivens)
    assert.strictEqual(coverage.categories.rivens.totalCount, 8, 'rivens 应抓数必须为 8');
    assert.ok(coverage.categories.rivens.pricedCount <= 8, 'rivens 有价格数不得超过应抓数');
    assert.ok(parseFloat(coverage.categories.rivens.coverage) <= 100.0, 'rivens 覆盖率不得超过 100%');
    assert.strictEqual(coverage.categories.rivens.coverage, '100.0%');

    // 3. 赋能 (arcanes)
    assert.strictEqual(coverage.categories.arcanes.totalCount, 340, 'arcanes 应抓数必须为 340 (170个*2档)');
    assert.ok(coverage.categories.arcanes.pricedCount <= 340, 'arcanes 有价格数不得超过应抓数');
    assert.ok(parseFloat(coverage.categories.arcanes.coverage) <= 100.0, 'arcanes 覆盖率不得超过 100%');
    assert.strictEqual(coverage.categories.arcanes.coverage, '100.0%');

    // 4. Mod (mods)
    assert.strictEqual(coverage.categories.mods.totalCount, 1546, 'mods 应抓数必须为 1546 (773个*2档)');
    assert.ok(coverage.categories.mods.pricedCount <= 1546, 'mods 有价格数不得超过应抓数');
    assert.ok(parseFloat(coverage.categories.mods.coverage) <= 100.0, 'mods 覆盖率不得超过 100%');
    assert.strictEqual(coverage.categories.mods.coverage, '96.4%');

    // 5. 全量汇总
    assert.strictEqual(coverage.totalCount, 2497, '总应抓键数必须为 2497 (603 + 8 + 340 + 1546)');
    assert.ok(coverage.pricedCount <= 2497, '总抓取数不得超过总键数');
    assert.ok(parseFloat(coverage.coverage) <= 100.0, '全量覆盖率不得超过 100%');
    assert.strictEqual(coverage.coverage, '97.8%');

    // 6. prices.updatedAt
    assert.strictEqual(coverage.updatedAt, pricesData.updatedAt, 'meta 中 prices.updatedAt 必须取自 prices.json 的 updatedAt');
  });

  it('meta.json 中的 prices 段包含准确各类别统计与 updatedAt', () => {
    const metaPrices = metaData.prices;
    assert.ok(metaPrices, 'meta.json 中必须包含 prices 字段');
    assert.strictEqual(metaPrices.updatedAt, pricesData.updatedAt);
    assert.strictEqual(metaPrices.totalCount, 2497);
    assert.strictEqual(metaPrices.pricedCount, 2441);
    assert.strictEqual(metaPrices.coverage, '97.8%');

    const cats = metaPrices.categories;
    assert.ok(cats, 'meta.json 必须包含 categories 段');
    assert.strictEqual(cats.relics.totalCount, 603);
    assert.strictEqual(cats.arcanes.totalCount, 340);
    assert.strictEqual(cats.mods.totalCount, 1546);
    assert.strictEqual(cats.rivens.totalCount, 8);

    assert.ok(parseFloat(cats.relics.coverage) <= 100.0);
    assert.ok(parseFloat(cats.arcanes.coverage) <= 100.0);
    assert.ok(parseFloat(cats.mods.coverage) <= 100.0);
    assert.ok(parseFloat(cats.rivens.coverage) <= 100.0);
  });

  it('computeCategoryStats 保证覆盖率即使在异常输入下也严格不超过 100.0%', () => {
    const mockTargets = ['item_a', 'item_b'];
    const mockPrices = {
      item_a: { sellMin: 10, buyMax: 5 },
      item_b: { sellMin: 20, buyMax: null },
      item_extra: { sellMin: 50, buyMax: 40 }
    };
    const stats = computeCategoryStats(mockTargets, mockPrices);
    assert.strictEqual(stats.totalCount, 2);
    assert.strictEqual(stats.pricedCount, 2);
    assert.strictEqual(stats.coverage, '100.0%');
  });
});
