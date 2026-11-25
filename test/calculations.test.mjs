import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateExpectedValue, calculateAllRefinementValues } from '../js/lib/calculations.js';

describe('期望值计算 (Calculations)', () => {
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
    // 预期 intact 期望白金 = 0.2533*2 + 0.2533*3 + 0.2533*2 + 0.11*15 + 0.11*10 + 0.02*80
    // = 0.5066 + 0.7599 + 0.5066 + 1.65 + 1.10 + 1.60 = 6.1231 => 6.12
    const result = calculateExpectedValue(mockRewards, mockPrices, { priceType: 'sellMin', refinement: 'intact' });
    assert.strictEqual(result.expectedValue, 6.12);
    assert.strictEqual(result.missingPriceCount, 0);
    assert.strictEqual(result.breakdown.length, 6);
  });

  it('支持切换最高买价 (buyMax) 计算', () => {
    // 预期 intact 买价期望 = 0.2533*1 + 0.2533*2 + 0.2533*1 + 0.11*10 + 0.11*8 + 0.02*65
    // = 0.2533 + 0.5066 + 0.2533 + 1.10 + 0.88 + 1.30 = 4.2932 => 4.29
    const result = calculateExpectedValue(mockRewards, mockPrices, { priceType: 'buyMax', refinement: 'intact' });
    assert.strictEqual(result.expectedValue, 4.29);
    assert.strictEqual(result.missingPriceCount, 0);
  });

  it('缺价物品按 0 计并统计缺价数量', () => {
    const partialPrices = {
      common_a: { sellMin: 2, buyMax: 1 },
      rare_f: { sellMin: 80, buyMax: 65 }
      // 其余 4 项缺价
    };

    const result = calculateExpectedValue(mockRewards, partialPrices, { priceType: 'sellMin', refinement: 'intact' });
    // 0.2533 * 2 + 0.02 * 80 = 0.5066 + 1.60 = 2.1066 => 2.11
    assert.strictEqual(result.expectedValue, 2.11);
    assert.strictEqual(result.missingPriceCount, 4);
  });

  it('支持同时计算全部四个精炼等级的期望值', () => {
    const all = calculateAllRefinementValues(mockRewards, mockPrices, { priceType: 'sellMin' });
    assert.ok(all.intact);
    assert.ok(all.exceptional);
    assert.ok(all.flawless);
    assert.ok(all.radiant);

    assert.strictEqual(all.intact.expectedValue, 6.12);
    // Radiant: 稀有翻5倍(10%)，光辉期望值通常明显高于完整
    assert.ok(all.radiant.expectedValue > all.intact.expectedValue);
  });
});
