import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateExpectedValue,
  calculateAllRefinementValues,
  calculateSourceExpectedValue,
  calculateEnemyExpectedValue,
  getItemPrice
} from '../js/lib/calculations.js';

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
      'rifle_riven_mod_veiled': { sellMin: 25, buyMax: 20 }
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
});
