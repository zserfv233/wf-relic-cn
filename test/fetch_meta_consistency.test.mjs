import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { calculatePriceCoverage } from '../js/lib/prices.js';
import { buildMetaPrices } from '../scripts/fetch-prices.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

describe('fetch-prices 与 meta.json 覆盖率口径一致性回归测试', () => {
  const realPricesPath = path.join(DATA_DIR, 'prices.json');
  const realMetaPath = path.join(DATA_DIR, 'meta.json');
  const relicsPath = path.join(DATA_DIR, 'relics.json');
  const rivensPath = path.join(DATA_DIR, 'rivens.json');
  const arcanesPath = path.join(DATA_DIR, 'arcanes.json');
  const modsPath = path.join(DATA_DIR, 'mods.json');

  const realPricesContentBefore = fs.readFileSync(realPricesPath, 'utf8');
  const realMetaContentBefore = fs.readFileSync(realMetaPath, 'utf8');

  it('回归验证：fetch-prices 写入临时 meta.json 时与 calculatePriceCoverage 完全一致且不污染正式数据', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wf-fetch-meta-test-'));
    const tempPricesPath = path.join(tempDir, 'prices.json');
    const tempMetaPath = path.join(tempDir, 'meta.json');

    try {
      // 复制一份 data/prices.json 和 data/meta.json 进临时目录
      fs.copyFileSync(realPricesPath, tempPricesPath);
      fs.copyFileSync(realMetaPath, tempMetaPath);

      const fixturePath = path.join(ROOT_DIR, 'fixtures', 'orders-fixture.json');
      assert.ok(fs.existsSync(fixturePath), 'fixtures/orders-fixture.json 必须存在');

      // 使用 fixture 模式运行 fetch-prices.mjs，严格禁止联网
      execFileSync(
        process.execPath,
        [
          path.join(ROOT_DIR, 'scripts', 'fetch-prices.mjs'),
          '--fixture', fixturePath,
          '--out', tempPricesPath,
          '--max-age-hours', '0',
          '--limit', '40'
        ],
        {
          cwd: ROOT_DIR,
          stdio: 'pipe'
        }
      );

      // 读取临时产物
      const tempPrices = JSON.parse(fs.readFileSync(tempPricesPath, 'utf8'));
      const tempMeta = JSON.parse(fs.readFileSync(tempMetaPath, 'utf8'));

      // 读取真实数据集
      const relicsData = JSON.parse(fs.readFileSync(relicsPath, 'utf8')).relics;
      const rivensData = JSON.parse(fs.readFileSync(rivensPath, 'utf8'));
      const arcanesData = JSON.parse(fs.readFileSync(arcanesPath, 'utf8'));
      const modsData = JSON.parse(fs.readFileSync(modsPath, 'utf8'));

      const expectedCoverage = calculatePriceCoverage(tempPrices, {
        relics: relicsData,
        rivens: rivensData,
        arcanes: arcanesData,
        mods: modsData
      });

      // 1. 断言 <tmp>/meta.json 的 prices 段与 calculatePriceCoverage(临时 prices, 真实数据集) 逐字段深相等
      assert.deepStrictEqual(
        tempMeta.prices,
        expectedCoverage,
        '临时 meta.json 的 prices 段必须与 calculatePriceCoverage(临时 prices, 真实数据集) 逐字段深相等'
      );

      // 2. 断言 rivens.pricedCount 与直接数 *@unrevealed 有价项一致
      const unrevealedItems = Object.entries(tempPrices.items || {}).filter(([k, v]) => {
        if (!k.endsWith('@unrevealed')) return false;
        if (!v) return false;
        const sell = v.sellMin;
        const buy = v.buyMax;
        const isCrossed = (typeof sell === 'number' && Number.isFinite(sell) && typeof buy === 'number' && Number.isFinite(buy) && buy > sell);
        return !isCrossed && (sell !== null || buy !== null);
      });
      assert.strictEqual(
        tempMeta.prices.categories.rivens.pricedCount,
        unrevealedItems.length,
        'rivens.pricedCount 必须与直接数 *@unrevealed 有价项一致'
      );

      // 3. 断言真实 data/meta.json、data/prices.json 内容在测试前后不变
      const realPricesContentAfter = fs.readFileSync(realPricesPath, 'utf8');
      const realMetaContentAfter = fs.readFileSync(realMetaPath, 'utf8');
      assert.strictEqual(realPricesContentBefore, realPricesContentAfter, '真实 data/prices.json 绝不可被修改');
      assert.strictEqual(realMetaContentBefore, realMetaContentAfter, '真实 data/meta.json 绝不可被修改');
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('单元测试：8 个 slug@unrevealed 均有价时，buildMetaPrices 计算下 rivens.pricedCount === 8', () => {
    const rivensData = JSON.parse(fs.readFileSync(rivensPath, 'utf8'));
    assert.strictEqual(rivensData.length, 8, 'rivens.json 应包含 8 个紫卡条目');

    const mockPriceCache = {
      updatedAt: new Date().toISOString(),
      items: {}
    };

    // 为 8 个紫卡构造有效价格条目
    for (const r of rivensData) {
      mockPriceCache.items[`${r.slug}@unrevealed`] = {
        sellMin: 50,
        buyMax: 20,
        rawSellMin: 50,
        rawBuyMax: 20,
        sellCount: 5,
        buyCount: 2,
        fetchedAt: new Date().toISOString()
      };
    }

    const calculated = buildMetaPrices(mockPriceCache, DATA_DIR);

    assert.strictEqual(
      calculated.categories.rivens.pricedCount,
      8,
      '8 个 slug@unrevealed 均有价时，buildMetaPrices 统计的 rivens.pricedCount 必须严格为 8'
    );
    assert.strictEqual(calculated.categories.rivens.totalCount, 8);
    assert.strictEqual(calculated.categories.rivens.coverage, '100.0%');
  });
});
