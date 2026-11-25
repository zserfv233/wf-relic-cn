import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { calculatePriceCoverage, computeCategoryStats } from '../js/lib/prices.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

// 覆盖率基准下限，保证数据质量不严重恶化
const COVERAGE_FLOOR = 0.90;

describe('价格覆盖率与统计口径 (Price Coverage & Meta - Invariants)', () => {
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

  // 动态重算各分类应抓键数不变量
  const expectedRelicCount = new Set(relicsData.flatMap(r => (r.rewards || []).map(rew => rew.marketSlug).filter(Boolean))).size;
  const expectedRivenCount = rivensData.length;
  const expectedArcaneCount = arcanesData.reduce((acc, a) => acc + ((a.maxRank ?? 5) > 0 ? 2 : 1), 0);
  const expectedModCount = modsData.reduce((acc, m) => acc + ((m.maxRank ?? 3) > 0 ? 2 : 1), 0);
  const expectedTotalCount = expectedRelicCount + expectedRivenCount + expectedArcaneCount + expectedModCount;

  it('基于数据结构重算应抓键数与覆盖率不变量 (pricedCount <= totalCount 且 rate >= COVERAGE_FLOOR)', () => {
    const coverage = calculatePriceCoverage(pricesData, {
      relics: relicsData,
      rivens: rivensData,
      arcanes: arcanesData,
      mods: modsData
    });

    // 1. Relics
    assert.strictEqual(coverage.categories.relics.totalCount, expectedRelicCount, 'relics 应抓数必须与数据集提取的唯一 marketSlug 数一致');
    assert.ok(coverage.categories.relics.pricedCount <= expectedRelicCount);
    const relicsRate = coverage.categories.relics.pricedCount / expectedRelicCount;
    assert.ok(relicsRate >= COVERAGE_FLOOR, `relics 覆盖率 (${(relicsRate * 100).toFixed(1)}%) 不得低于下限 ${COVERAGE_FLOOR * 100}%`);
    assert.ok(relicsRate <= 1.0);

    // 2. Rivens
    assert.strictEqual(coverage.categories.rivens.totalCount, expectedRivenCount, 'rivens 应抓数必须与紫卡数据集长度一致');
    assert.ok(coverage.categories.rivens.pricedCount <= expectedRivenCount);
    const rivensRate = coverage.categories.rivens.pricedCount / expectedRivenCount;
    assert.ok(rivensRate >= COVERAGE_FLOOR, `rivens 覆盖率 (${(rivensRate * 100).toFixed(1)}%) 不得低于下限 ${COVERAGE_FLOOR * 100}%`);
    assert.ok(rivensRate <= 1.0);

    // 3. Arcanes
    assert.strictEqual(coverage.categories.arcanes.totalCount, expectedArcaneCount, 'arcanes 应抓数必须与赋能等级键重算一致');
    assert.ok(coverage.categories.arcanes.pricedCount <= expectedArcaneCount);
    const arcanesRate = coverage.categories.arcanes.pricedCount / expectedArcaneCount;
    assert.ok(arcanesRate >= COVERAGE_FLOOR, `arcanes 覆盖率 (${(arcanesRate * 100).toFixed(1)}%) 不得低于下限 ${COVERAGE_FLOOR * 100}%`);
    assert.ok(arcanesRate <= 1.0);

    // 4. Mods
    assert.strictEqual(coverage.categories.mods.totalCount, expectedModCount, 'mods 应抓数必须与 Mod 等级键重算一致');
    assert.ok(coverage.categories.mods.pricedCount <= expectedModCount);
    const modsRate = coverage.categories.mods.pricedCount / expectedModCount;
    assert.ok(modsRate >= COVERAGE_FLOOR, `mods 覆盖率 (${(modsRate * 100).toFixed(1)}%) 不得低于下限 ${COVERAGE_FLOOR * 100}%`);
    assert.ok(modsRate <= 1.0);

    // 5. Total
    assert.strictEqual(coverage.totalCount, expectedTotalCount, '总应抓键数必须与四类之和严格一致');
    assert.ok(coverage.pricedCount <= expectedTotalCount);
    const totalRate = coverage.pricedCount / expectedTotalCount;
    assert.ok(totalRate >= COVERAGE_FLOOR, `全量覆盖率 (${(totalRate * 100).toFixed(1)}%) 不得低于下限 ${COVERAGE_FLOOR * 100}%`);
    assert.ok(totalRate <= 1.0);

    // 6. updatedAt 必须取自 prices.json
    assert.strictEqual(coverage.updatedAt, pricesData.updatedAt);
  });

  it('meta.json 中的 prices 段与从 data/prices.json + 数据集重算的结果完全一致', () => {
    const recalculated = calculatePriceCoverage(pricesData, {
      relics: relicsData,
      rivens: rivensData,
      arcanes: arcanesData,
      mods: modsData
    });

    const metaPrices = metaData.prices;
    assert.ok(metaPrices, 'meta.json 中必须包含 prices 字段');
    assert.strictEqual(metaPrices.updatedAt, recalculated.updatedAt);
    assert.strictEqual(metaPrices.totalCount, recalculated.totalCount);
    assert.strictEqual(metaPrices.pricedCount, recalculated.pricedCount);
    assert.strictEqual(metaPrices.coverage, recalculated.coverage);

    assert.strictEqual(metaPrices.categories.relics.totalCount, recalculated.categories.relics.totalCount);
    assert.strictEqual(metaPrices.categories.relics.pricedCount, recalculated.categories.relics.pricedCount);
    assert.strictEqual(metaPrices.categories.rivens.totalCount, recalculated.categories.rivens.totalCount);
    assert.strictEqual(metaPrices.categories.rivens.pricedCount, recalculated.categories.rivens.pricedCount);
    assert.strictEqual(metaPrices.categories.arcanes.totalCount, recalculated.categories.arcanes.totalCount);
    assert.strictEqual(metaPrices.categories.arcanes.pricedCount, recalculated.categories.arcanes.pricedCount);
    assert.strictEqual(metaPrices.categories.mods.totalCount, recalculated.categories.mods.totalCount);
    assert.strictEqual(metaPrices.categories.mods.pricedCount, recalculated.categories.mods.pricedCount);
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

  it('验证：在临时 prices 副本随机变动条目时，不变量断言仍全部通过且不改写真实 prices.json', () => {
    // 构造临时 prices 副本并随机删除 10 个条目
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wf-prices-test-'));
    const tempPricesPath = path.join(tempDir, 'temp-prices.json');
    const tempPrices = JSON.parse(JSON.stringify(pricesData));

    const keys = Object.keys(tempPrices.items);
    assert.ok(keys.length > 20);
    // 删掉 10 个键
    for (let i = 0; i < 10; i++) {
      delete tempPrices.items[keys[i]];
    }
    fs.writeFileSync(tempPricesPath, JSON.stringify(tempPrices, null, 2));

    const tempCoverage = calculatePriceCoverage(tempPrices, {
      relics: relicsData,
      rivens: rivensData,
      arcanes: arcanesData,
      mods: modsData
    });

    const originalCoverage = calculatePriceCoverage(pricesData, {
      relics: relicsData,
      rivens: rivensData,
      arcanes: arcanesData,
      mods: modsData
    });

    // 验证不变量
    assert.strictEqual(tempCoverage.totalCount, expectedTotalCount, '临时副本总应抓数依然等于数据集重算数');
    assert.ok(tempCoverage.pricedCount <= tempCoverage.totalCount);
    assert.ok(tempCoverage.pricedCount <= originalCoverage.pricedCount);
    assert.ok(parseFloat(tempCoverage.coverage) <= 100.0);
    assert.ok(parseFloat(tempCoverage.coverage) >= 80.0);

    // 清理临时目录
    fs.rmSync(tempDir, { recursive: true, force: true });

    // 确认真实 prices.json 未受影响
    const pristinePrices = JSON.parse(fs.readFileSync(pricesPath, 'utf8'));
    assert.strictEqual(Object.keys(pristinePrices.items).length, keys.length, '真实 prices.json 必须严格保持未被修改');
  });
});
