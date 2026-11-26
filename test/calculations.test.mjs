import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  calculateExpectedValue,
  calculateAllRefinementValues,
  calculateSourceExpectedValue,
  calculateEnemyExpectedValue,
  getItemPrice
} from '../js/lib/calculations.js';
import { parseQuantityAndName } from '../scripts/build-data.mjs';
import { RAW_DIR, hasRawFiles } from '../scripts/lib/raw-dir.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('期望值计算 (Calculations - Phase 2)', () => {
  const mockRewards = [
    {
      name: 'Common Item A',
      zhName: '常见物品 A',
      rarity: 'Common',
      marketSlug: 'common_a',
      chances: { intact: 25.33, exceptional: 23.33, flawless: 20.0, radiant: 16.67 }
    },
    {
      name: 'Common Item B',
      zhName: '常见物品 B',
      rarity: 'Common',
      marketSlug: 'common_b',
      chances: { intact: 25.33, exceptional: 23.33, flawless: 20.0, radiant: 16.67 }
    },
    {
      name: 'Common Item C',
      zhName: '常见物品 C',
      rarity: 'Common',
      marketSlug: 'common_c',
      chances: { intact: 25.33, exceptional: 23.33, flawless: 20.0, radiant: 16.67 }
    },
    {
      name: 'Uncommon Item D',
      zhName: '罕见物品 D',
      rarity: 'Uncommon',
      marketSlug: 'uncommon_d',
      chances: { intact: 11.0, exceptional: 13.0, flawless: 17.0, radiant: 20.0 }
    },
    {
      name: 'Uncommon Item E',
      zhName: '罕见物品 E',
      rarity: 'Uncommon',
      marketSlug: 'uncommon_e',
      chances: { intact: 11.0, exceptional: 13.0, flawless: 17.0, radiant: 20.0 }
    },
    {
      name: 'Rare Item F',
      zhName: '稀有物品 F',
      rarity: 'Rare',
      marketSlug: 'rare_f',
      chances: { intact: 2.0, exceptional: 4.0, flawless: 6.0, radiant: 10.0 }
    }
  ];

  const mockPrices = {
    common_a: { sellMin: 2, buyMax: 1 },
    common_b: { sellMin: 3, buyMax: 2 },
    common_c: { sellMin: 2, buyMax: 1 },
    uncommon_d: { sellMin: 15, buyMax: 10 },
    uncommon_e: { sellMin: 10, buyMax: 8 },
    rare_f: { sellMin: 80, buyMax: 65 }
  };

  it('正确根据掉率与单价计算单个等级期望白金', () => {
    const result = calculateExpectedValue(mockRewards, mockPrices, { priceType: 'sellMin', refinement: 'intact' });
    assert.strictEqual(result.expectedValue, 6.12);
    assert.strictEqual(result.missingPriceCount, 0);
  });

  it('全缺价时 expectedValue 返回 null (显示 —)', () => {
    const result = calculateExpectedValue(mockRewards, {}, { priceType: 'sellMin', refinement: 'intact' });
    assert.strictEqual(result.expectedValue, null);
    assert.strictEqual(result.missingPriceCount, 6);
    assert.strictEqual(result.pricedCount, 0);
  });

  it('支持切换最高买价 (buyMax) 计算', () => {
    const result = calculateExpectedValue(mockRewards, mockPrices, { priceType: 'buyMax', refinement: 'intact' });
    assert.strictEqual(result.expectedValue, 4.29);
    assert.strictEqual(result.missingPriceCount, 0);
  });

  it('支持获取等级价格键 getItemPrice', () => {
    const rankPrices = {
      'arcane_energize@r0': { sellMin: 65, buyMax: 50 },
      'arcane_energize@r5': { sellMin: 1400, buyMax: 1200 },
      'serration@r0': { sellMin: 2, buyMax: 1 },
      'serration@r10': { sellMin: 180, buyMax: 150 },
      'rifle_riven_mod_veiled@unrevealed': { sellMin: 25, buyMax: 20 }
    };

    assert.strictEqual(getItemPrice('arcane_energize', 0, rankPrices, 'sellMin'), 65);
    assert.strictEqual(getItemPrice('arcane_energize', 5, rankPrices, 'sellMin'), 1400);
    assert.strictEqual(getItemPrice('serration', 0, rankPrices, 'buyMax'), 1);
    assert.strictEqual(getItemPrice('serration', 10, rankPrices, 'sellMin'), 180);
    assert.strictEqual(getItemPrice('rifle_riven_mod_veiled', null, rankPrices, 'sellMin'), 25);
  });

  it('任务/轮次来源期望值计算: sum(chance/100 * price)', () => {
    // 假设某间谍任务 C 轮掉落 3 个物品：
    // Mod A: 10% 掉率，价格 50
    // Mod B: 20% 掉率，价格 25
    // 其他: 70% 掉率，无价格
    const sourceRewards = [
      { itemName: 'Mod A', slug: 'mod_a', chance: 10 },
      { itemName: 'Mod B', slug: 'mod_b', chance: 20 },
      { itemName: 'Endo', slug: null, chance: 70 }
    ];
    const sourcePrices = {
      'mod_a@r0': { sellMin: 50 },
      'mod_b@r0': { sellMin: 25 }
    };

    // 0.1 * 50 + 0.2 * 25 = 5 + 5 = 10 白金
    const result = calculateSourceExpectedValue(sourceRewards, sourcePrices, { priceType: 'sellMin' });
    assert.strictEqual(result.expectedValue, 10.0);
    assert.strictEqual(result.pricedCount, 2);
    assert.strictEqual(result.missingCount, 1);
  });

  it('敌人来源期望值计算: enemyModDropChance% * sum(chance% * price)', () => {
    // 某敌人基础 Mod 掉落率 3% (0.03)
    // 掉落列表:
    // Mod X: 10% 掉率，价格 100 白金
    // Mod Y: 5% 掉率，价格 200 白金
    // 内部总期望 = 0.1 * 100 + 0.05 * 200 = 10 + 10 = 20 白金
    // 击杀期望 = 0.03 * 20 = 0.6 白金
    const enemyMods = [
      { modName: 'Mod X', slug: 'mod_x', chance: 10 },
      { modName: 'Mod Y', slug: 'mod_y', chance: 5 }
    ];
    const enemyPrices = {
      'mod_x@r0': { sellMin: 100 },
      'mod_y@r0': { sellMin: 200 }
    };

    const result = calculateEnemyExpectedValue(3.0, enemyMods, enemyPrices, { priceType: 'sellMin' });
    assert.strictEqual(result.expectedValue, 0.6);
    assert.strictEqual(result.enemyModDropChance, 3.0);
    assert.strictEqual(result.pricedCount, 2);
  });

  it('敌人来源缺价物品提取正确回退 itemName/itemZh (不显示为空)', () => {
    const enemyRewards = [
      { itemName: '15 Endo', itemZh: '15 Endo', chance: 37.94, slug: null, category: 'mod' },
      { modName: 'Argon Plating', modZh: '氩晶装甲', chance: 37.94, slug: 'argon_plating', category: 'mod' }
    ];
    const result = calculateEnemyExpectedValue(5.0, enemyRewards, {});
    assert.strictEqual(result.missingCount, 2);
    assert.strictEqual(result.missingItems.length, 2);
    const endo = result.missingItems[0];
    assert.strictEqual(endo.name, '15 Endo');
    assert.strictEqual(endo.itemName, '15 Endo');
    assert.strictEqual(endo.zhName, '15 Endo');

    const mod = result.missingItems[1];
    assert.strictEqual(mod.name, 'Argon Plating');
    assert.strictEqual(mod.zhName, '氩晶装甲');
  });

  it('期望值按 chance * quantity * price 倍率正确计算', () => {
    // 假设某遗物奖励包含 3X 物品：掉率 10%，单价 50 白金，数量 3
    // 单项贡献 = 0.1 * 3 * 50 = 15 白金
    const rewardsWithQty = [
      {
        name: '3X Arcane Energize',
        baseName: 'Arcane Energize',
        quantity: 3,
        marketSlug: 'arcane_energize',
        chances: { intact: 10, exceptional: 10, flawless: 10, radiant: 10 }
      },
      {
        name: 'Single Mod',
        baseName: 'Single Mod',
        quantity: 1,
        marketSlug: 'single_mod',
        chances: { intact: 20, exceptional: 20, flawless: 20, radiant: 20 }
      }
    ];
    const prices = {
      arcane_energize: { sellMin: 50 },
      single_mod: { sellMin: 10 }
    };

    // 0.1 * 3 * 50 + 0.2 * 1 * 10 = 15 + 2 = 17 白金
    const res = calculateExpectedValue(rewardsWithQty, prices, { priceType: 'sellMin', refinement: 'intact' });
    assert.strictEqual(res.expectedValue, 17.0);
    assert.strictEqual(res.breakdown[0].contribution, 15.0);
    assert.strictEqual(res.breakdown[1].contribution, 2.0);
  });

  it('任务与敌人掉落来源中数量前缀 quantity 倍率生效', () => {
    // 任务掉落: 3X Arcane Energize, 掉率 5%, 单价 100 -> 0.05 * 3 * 100 = 15 白金
    const srcRewards = [
      { itemName: '3X Arcane Energize', slug: 'arcane_energize', chance: 5, quantity: 3 }
    ];
    const prices = {
      arcane_energize: { sellMin: 100 }
    };
    const srcRes = calculateSourceExpectedValue(srcRewards, prices, { priceType: 'sellMin' });
    assert.strictEqual(srcRes.expectedValue, 15.0);

    // 敌人掉落: 敌人掉率 10%, 掉落 2X Mod, 掉率 20%, 单价 40 -> 0.10 * (0.20 * 2 * 40) = 0.10 * 16 = 1.6 白金
    const enemyMods = [
      { modName: '2X Rare Mod', slug: 'rare_mod', chance: 20, quantity: 2 }
    ];
    const enemyPrices = {
      rare_mod: { sellMin: 40 }
    };
    const enemyRes = calculateEnemyExpectedValue(10.0, enemyMods, enemyPrices, { priceType: 'sellMin' });
    assert.strictEqual(enemyRes.expectedValue, 1.6);
  });

  it('解析数量前缀函数 parseQuantityAndName 正确提取数量与基础名称', () => {
    assert.deepStrictEqual(parseQuantityAndName('3X Arcane Energize'), { quantity: 3, baseName: 'Arcane Energize' });
    assert.deepStrictEqual(parseQuantityAndName('2X Forma Blueprint'), { quantity: 2, baseName: 'Forma Blueprint' });
    assert.deepStrictEqual(parseQuantityAndName('2X Riven Sliver'), { quantity: 2, baseName: 'Riven Sliver' });
    assert.deepStrictEqual(parseQuantityAndName('100000X Kuva'), { quantity: 100000, baseName: 'Kuva' });
    assert.deepStrictEqual(parseQuantityAndName('Braton Prime Barrel'), { quantity: 1, baseName: 'Braton Prime Barrel' });
  });

  it('重跑后 unmatched.json 里不应再有能去掉前缀后匹配上的条目', () => {
    const unmatchedPath = path.join(ROOT_DIR, 'data', 'unmatched.json');
    assert.ok(fs.existsSync(unmatchedPath), 'data/unmatched.json 必须存在');
    const unmatched = JSON.parse(fs.readFileSync(unmatchedPath, 'utf8'));

    const rawDir = hasRawFiles('wfm_items_v2.json') 
      ? RAW_DIR 
      : path.join(ROOT_DIR, 'data', 'raw');
    const wfmPath = path.join(rawDir, 'wfm_items_v2.json');

    if (fs.existsSync(wfmPath)) {
      const wfmData = JSON.parse(fs.readFileSync(wfmPath, 'utf8'));
      const list = wfmData.data || [];
      const wfmByName = new Map();
      for (const item of list) {
        if (item.i18n?.en?.name) {
          wfmByName.set(item.i18n.en.name.toLowerCase().trim(), item);
        }
      }

      for (const u of unmatched) {
        const { quantity, baseName } = parseQuantityAndName(u.name);
        if (quantity > 1) {
          const lower = baseName.toLowerCase();
          const match = wfmByName.get(lower) || wfmByName.get('arcane ' + lower);
          assert.strictEqual(
            match,
            undefined,
            `条目 ${u.name} 在去掉数量前缀 ${quantity}X 后的基础名称 ${baseName} 仍能匹配到 market (${match?.slug})，应已被解析录入！`
          );
        }
      }
    }
  });

  it('README 与 index.html 均明示官方价格与期望值口径文字', () => {
    const expectedDisclaimer = '价格取 warframe.market /v2/orders/item/{slug}/top 返回订单中的最低卖价/最高收购价，仅代表抓取时刻；遗物期望值不含 Forma 等不可交易物';
    const readmeContent = fs.readFileSync(path.join(ROOT_DIR, 'README.md'), 'utf8');
    const indexContent = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');

    assert.ok(readmeContent.includes(expectedDisclaimer), 'README.md 必须包含规定的口径说明文字');
    assert.ok(indexContent.includes(expectedDisclaimer), 'index.html 必须包含规定的口径说明文字');
  });
});
