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
  getItemPrice,
  getPriceEntry,
  arcaneCopiesForRank,
  LOW_CONFIDENCE_MIN_SELLERS
} from '../js/lib/calculations.js';
import { parseOrdersTop } from '../js/lib/prices.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

describe('数学内核修复 (Math Kernel - Phase M2)', () => {
  const sources = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'sources.json'), 'utf8'));
  const rawPrices = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'prices.json'), 'utf8')).items;
  const relics = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'relics.json'), 'utf8')).relics;
  const arcanes = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'arcanes.json'), 'utf8'));
  const rivens = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'rivens.json'), 'utf8'));
  const mods = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'mods.json'), 'utf8'));

  it('1. 稀疏卖单稳健取价与低置信：常量定义、派生字段、高置信期望 expectedValueConfidentRaw 与 Soaring Strike 复算', () => {
    // 验证常量
    assert.strictEqual(LOW_CONFIDENCE_MIN_SELLERS, 3, 'LOW_CONFIDENCE_MIN_SELLERS 必须为 3');

    // 构造 Conclave 25 项有价 Mod fixture (报告数据: 24 项总和 487p, Soaring Strike 300p 单卖单)
    const conclaveFixturePrices = {
      'soaring_strike@r0': { sellMin: 300, buyMax: null, sellCount: 1, buyCount: 0 }
    };
    // 另外 24 项有价 Mod，每个掉率 2.48%，设单价分布使总和为 487，挂单数均为 5 (高置信)
    const mock24Mods = [
      { name: 'Blind Shot', slug: 'blind_shot', price: 40 },
      { name: 'Hydraulic Barrel', slug: 'hydraulic_barrel', price: 30 },
      { name: 'Lucky Shot', slug: 'lucky_shot', price: 25 },
      { name: 'Hydraulic Chamber', slug: 'hydraulic_chamber', price: 9 },
      { name: 'Adrenaline Boost', slug: 'adrenaline_boost', price: 15 },
      { name: 'Vital Systems Bypass', slug: 'vital_systems_bypass', price: 30 },
      { name: 'Secondary Wind', slug: 'secondary_wind', price: 40 },
      { name: 'Plan B', slug: 'plan_b', price: 9 },
      { name: 'Kill Switch', slug: 'kill_switch', price: 40 },
      { name: 'Grinloked', slug: 'grinloked', price: 15 },
      { name: 'Double Tap', slug: 'double_tap', price: 35 },
      { name: 'Triple Tap', slug: 'triple_tap', price: 40 },
      { name: 'Final Tap', slug: 'final_tap', price: 10 },
      { name: 'Directed Convergence', slug: 'directed_convergence', price: 10 },
      { name: 'Focused Acceleration', slug: 'focused_acceleration', price: 10 },
      { name: 'Measured Burst', slug: 'measured_burst', price: 29 },
      { name: 'Final Act', slug: 'final_act', price: 10 },
      { name: 'Mortal Conduct', slug: 'mortal_conduct', price: 20 },
      { name: 'Thundermiter', slug: 'thundermiter', price: 10 },
      { name: 'Shrapnel Rounds', slug: 'shrapnel_rounds', price: 10 },
      { name: 'Ambush Optics', slug: 'ambush_optics', price: 15 },
      { name: 'Skull Shots', slug: 'skull_shots', price: 10 },
      { name: 'Brain Storm', slug: 'brain_storm', price: 15 },
      { name: 'Precision Munition', slug: 'precision_munition', price: 10 }
    ];

    const sum24 = mock24Mods.reduce((acc, m) => acc + m.price, 0);
    assert.strictEqual(sum24, 487, '24 项 Mod 价格和必须恰好为 487p');

    const rewards = [
      ...mock24Mods.map(m => {
        conclaveFixturePrices[`${m.slug}@r0`] = { sellMin: m.price, buyMax: 5, sellCount: 5, buyCount: 2 };
        return { itemName: m.name, slug: m.slug, chance: 2.48, category: 'mod' };
      }),
      { itemName: 'Soaring Strike', slug: 'soaring_strike', chance: 2.48, category: 'mod' },
      { itemName: 'Unpriced Item', slug: 'unpriced_item', chance: 38.0, category: 'other' }
    ];

    const res = calculateSourceExpectedValue(rewards, conclaveFixturePrices, { priceType: 'sellMin' });

    // 标准期望 = 0.0248 * (487 + 300) = 19.5176p
    assert.ok(Math.abs(res.expectedValueRaw - 19.5176) < 0.0001, `含低置信项期望应为 19.5176p，实际为 ${res.expectedValueRaw}`);
    assert.strictEqual(res.expectedValue, 19.52);

    // 高置信期望 = 0.0248 * 487 = 12.0776p
    assert.ok(Math.abs(res.expectedValueConfidentRaw - 12.0776) < 0.0001, `高置信期望应为 12.0776p，实际为 ${res.expectedValueConfidentRaw}`);
    assert.strictEqual(res.expectedValueConfident, 12.08);

    // 低置信统计
    assert.strictEqual(res.lowConfidenceCount, 1, 'Soaring Strike 单独应被标低置信');
    assert.strictEqual(res.lowConfidenceProbability, 2.48);
    assert.strictEqual(res.incomplete, true);
  });

  it('2. 卖单稳健价 sellRobust 中位数计算与旧缓存兼容 robustUnavailable', () => {
    // 构造挂单：6 个卖单，在线且等级匹配 [50, 20, 10, 80, 15, 30]
    // 排序后为 [10, 15, 20, 30, 50, 80]
    // 前 3 个最低卖单为 [10, 15, 20]，中位数是 15
    const testOrders = {
      sell: [
        { platinum: 50, user: { status: 'ingame', ingameName: 'P1' } },
        { platinum: 20, user: { status: 'online', ingameName: 'P2' } },
        { platinum: 10, user: { status: 'ingame', ingameName: 'P3' } },
        { platinum: 80, user: { status: 'online', ingameName: 'P4' } },
        { platinum: 15, user: { status: 'ingame', ingameName: 'P5' } },
        { platinum: 30, user: { status: 'online', ingameName: 'P6' } }
      ],
      buy: [
        { platinum: 8, user: { status: 'online', ingameName: 'B1' } }
      ]
    };

    const parsed = parseOrdersTop(testOrders, { slug: 'test_mod' });
    assert.strictEqual(parsed.sellMin, 10, '最低卖价为 10');
    assert.strictEqual(parsed.sellRobust, 15, '前 3 单 [10, 15, 20] 的中位数必须为 15');
    assert.strictEqual(parsed.sellCount, 6);
    assert.strictEqual(parsed.uniqueSellers, 6);
    assert.strictEqual(parsed.lowConfidence, false);
    assert.strictEqual(parsed.robustUnavailable, false);

    // 旧缓存兼容：条目无 sellRobust 字段时，getPriceEntry 标记 robustUnavailable: true 并回退 sellMin
    const legacyPrices = {
      legacy_item: { sellMin: 42, buyMax: 35, sellCount: 4, buyCount: 2 }
    };
    const entry = getPriceEntry('legacy_item', null, legacyPrices);
    assert.ok(entry);
    assert.strictEqual(entry.sellMin, 42);
    assert.strictEqual(entry.sellRobust, 42);
    assert.strictEqual(entry.robustUnavailable, true, '旧缓存应标记 robustUnavailable === true');
  });

  it('3. Requiem ETERNA：不存在的精炼档返回 null，标记 dataConflict: true 及说明文字', () => {
    const eterna = relics.find(r => r.id === 'requiem_eterna');
    assert.ok(eterna, 'Requiem ETERNA 必须存在');
    assert.strictEqual(eterna.dataConflict, true);
    assert.ok(eterna.dataConflictNote.includes('资料冲突：DE 掉落表为 8 项×9.5%=76%'));
    assert.ok(eterna.dataConflictNote.includes('12.5%'));

    const allValues = calculateAllRefinementValues(eterna.rewards, rawPrices, { priceType: 'sellMin' });

    // intact 有值 (8 * 9.5% * 平均单价 ≈ 5.89p)
    assert.ok(allValues.intact.expectedValueRaw > 0);
    assert.ok(Math.abs(allValues.intact.expectedValueRaw - 5.89) < 0.1);
    assert.strictEqual(allValues.intact.unsupportedRefinement, false);

    // exceptional, flawless, radiant 全为 null，并且标记 unsupportedRefinement: true
    for (const ref of ['exceptional', 'flawless', 'radiant']) {
      assert.strictEqual(allValues[ref].expectedValue, null, `ETERNA ${ref} expectedValue 必须为 null`);
      assert.strictEqual(allValues[ref].expectedValueRaw, null, `ETERNA ${ref} expectedValueRaw 必须为 null`);
      assert.strictEqual(allValues[ref].unsupportedRefinement, true, `ETERNA ${ref} unsupportedRefinement 必须为 true`);
      assert.strictEqual(allValues[ref].notApplicable, true);
    }
  });

  it('4. 赋能满级合成换算：N(r)=(r+1)(r+2)/2，Energize 140/21 与 Pax Charge 44/10，严格去掉串级回退', () => {
    // 验证公式 N(r)
    assert.strictEqual(arcaneCopiesForRank(5), 21, 'Rank 5 赋能需要 21 个');
    assert.strictEqual(arcaneCopiesForRank(3), 10, 'Rank 3 赋能需要 10 个');
    assert.strictEqual(arcaneCopiesForRank(0), 1, 'Rank 0 需要 1 个');
    assert.strictEqual(arcaneCopiesForRank(-1), null, '负数非法返回 null');
    assert.strictEqual(arcaneCopiesForRank(2.5), null, '非整数返回 null');
    assert.strictEqual(arcaneCopiesForRank(null), null);
    assert.strictEqual(arcaneCopiesForRank(undefined), null);

    // 报告复算：Arcane Energize (maxRank 5) 卖 140/21≈6.6667，买 100/21≈4.7619
    const N5 = arcaneCopiesForRank(5);
    const energizeSellEquiv = 140 / N5;
    const energizeBuyEquiv = 100 / N5;
    assert.ok(Math.abs(energizeSellEquiv - 6.6667) < 0.001);
    assert.ok(Math.abs(energizeBuyEquiv - 4.7619) < 0.001);

    // 报告复算：Pax Charge (maxRank 3) 卖 44/10=4.4，买 28/10=2.8
    const N3 = arcaneCopiesForRank(3);
    const paxSellEquiv = 44 / N3;
    const paxBuyEquiv = 28 / N3;
    assert.strictEqual(paxSellEquiv, 4.4);
    assert.strictEqual(paxBuyEquiv, 2.8);

    // 去掉串级回退测试：构造只有基础 slug 键的有等级物品，请求 rank=0 查询必须返回 null
    const noFallbackPrices = {
      'serration': { sellMin: 20, buyMax: 15 } // 只有基础键，没有 serration@r0
    };
    const priceWithRank0 = getItemPrice('serration', 0, noFallbackPrices, 'sellMin');
    assert.strictEqual(priceWithRank0, null, '请求 rank=0 时若不存在 rank 键，严禁回退到基础 slug，必须返回 null');

    const priceWithNullRank = getItemPrice('serration', null, noFallbackPrices, 'sellMin');
    assert.strictEqual(priceWithNullRank, 20, '未请求 rank (rank === null) 时允许查找基础 slug');
  });

  it('5. 紫卡：缓存键带 subtype (@unrevealed)，旧缓存回退标 subtypeUnknown，mods.json 与 rivens.json 互斥', () => {
    // companion_weapon_riven_mod_veiled 不得在 mods.json
    assert.ok(!mods.some(m => m.slug === 'companion_weapon_riven_mod_veiled'));
    assert.ok(!mods.some(m => m.tags?.includes('veiled_riven')));

    // 集合互斥
    const modSlugs = new Set(mods.map(m => m.slug));
    const rivenSlugs = new Set(rivens.map(r => r.slug));
    const intersection = [...modSlugs].filter(s => rivenSlugs.has(s));
    assert.strictEqual(intersection.length, 0, 'mods.json 与 rivens.json slug 集合必须互斥');

    // 检查旧缓存回退标记
    const oldPrices = {
      'rifle_riven_mod_veiled': { sellMin: 25, buyMax: 20 }
    };
    const entry = getPriceEntry('rifle_riven_mod_veiled', null, oldPrices);
    assert.ok(entry);
    assert.strictEqual(entry.subtypeUnknown, true, '旧缓存紫卡回退必须标记 subtypeUnknown === true');

    const newPrices = {
      'rifle_riven_mod_veiled@unrevealed': { sellMin: 30, buyMax: 25 }
    };
    const newEntry = getPriceEntry('rifle_riven_mod_veiled', null, newPrices);
    assert.ok(newEntry);
    assert.strictEqual(newEntry.subtypeUnknown, false);
    assert.strictEqual(newEntry.sellMin, 30);
  });

  it('6. 来源 ID 格式合规：所有来源 ID 符合 /^[a-z0-9]+(_[a-z0-9]+)*$/，无尾部下划线，无双下划线', () => {
    const idRegex = /^[a-z0-9]+(_[a-z0-9]+)*$/;
    const badIds = [];
    for (const src of sources) {
      if (!idRegex.test(src.id)) {
        badIds.push(src.id);
      }
    }
    assert.strictEqual(badIds.length, 0, `发现格式不合规的来源 ID: ${badIds.slice(0, 10).join(', ')}`);
  });
});
