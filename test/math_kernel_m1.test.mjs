import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  calculateExpectedValue,
  calculateSourceExpectedValue,
  calculateEnemyExpectedValue,
  isUntradeableItem,
  getItemPrice
} from '../js/lib/calculations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

// 测试固定的价格常量（保证价格更新后数学算法测试不失败）
const FIXTURE_PRICES = {
  // Nightmare Mode Rewards Mod prices (复现 Codex 审查报告所用基准卖价)
  'ice_storm@r0': { sellMin: 3, sellCount: 5 },
  'stunning_speed@r0': { sellMin: 2, sellCount: 5 },
  'hammer_shot@r0': { sellMin: 114, sellCount: 5 },
  'wildfire@r0': { sellMin: 3, sellCount: 5 },
  'accelerated_blast@r0': { sellMin: 3, sellCount: 5 },
  'blaze@r0': { sellMin: 36, sellCount: 5 },
  'chilling_reload@r0': { sellMin: 2, sellCount: 5 },
  'drifting_contact@r0': { sellMin: 2, sellCount: 5 },
  'seeking_fury@r0': { sellMin: 1, sellCount: 5 },
  'armored_agility@r0': { sellMin: 2, sellCount: 5 },
  'shred@r0': { sellMin: 5, sellCount: 5 },
  'rending_strike@r0': { sellMin: 1, sellCount: 5 },
  'fortitude@r0': { sellMin: 4, sellCount: 5 },
  'streamlined_form@r0': { sellMin: 1, sellCount: 5 },
  'animal_instinct@r0': { sellMin: 4, sellCount: 5 },
  'vigor@r0': { sellMin: 4, sellCount: 5 },
  'lethal_torrent@r0': { sellMin: 18, sellCount: 5 },
  'focus_energy@r0': { sellMin: 3, sellCount: 5 },
  'constitution@r0': { sellMin: 7, sellCount: 5 },

  // Cetus
  'redirection@r0': { sellMin: 1, sellCount: 5 },
  'redirection': { sellMin: 1, sellCount: 5 },

  // Arbitrations
  'arcane_pistoleer@r0': { sellMin: 2, sellCount: 5 },
  'arcane_tanker@r0': { sellMin: 2, sellCount: 5 },
  'arcane_bodyguard@r0': { sellMin: 3, sellCount: 5 },
  'combat_discipline@r0': { sellMin: 3, sellCount: 5 },
  'adaptation@r0': { sellMin: 5, sellCount: 5 },
  'aerodynamic@r0': { sellMin: 8, sellCount: 5 },
  'arcane_blade_charger@r0': { sellMin: 2, sellCount: 5 },
  'arcane_primary_charger@r0': { sellMin: 2, sellCount: 5 },
  'shepherd@r0': { sellMin: 4, sellCount: 5 },
  'melee_guidance@r0': { sellMin: 2, sellCount: 5 },
  'swift_momentum@r0': { sellMin: 4, sellCount: 5 },

  // Lith A1
  'saryn_prime_neuroptics_blueprint': { sellMin: 5, sellCount: 5 },
  'vectis_prime_blueprint': { sellMin: 9, sellCount: 5 },
  'braton_prime_barrel': { sellMin: 2, sellCount: 5 },
  'akstiletto_prime_blueprint': { sellMin: 13, sellCount: 5 },
  'vasto_prime_receiver': { sellMin: 8, sellCount: 5 }
};

describe('数学内核修复 (Math Kernel - Phase M1 - Invariants)', () => {
  const sources = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'sources.json'), 'utf8'));
  const rawPrices = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'prices.json'), 'utf8')).items;
  const mergedPrices = { ...rawPrices, ...FIXTURE_PRICES };
  const relics = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'relics.json'), 'utf8')).relics;

  it('1. Nightmare Mode Rewards 拆分成 A/B/C 三个独立来源，并验证复算期望 (A≈4.0439p, B≈2.4649p, C≈5.802p)', () => {
    const nmA = sources.find(s => s.id === 'source_transient_nightmare_mode_rewards_a');
    const nmB = sources.find(s => s.id === 'source_transient_nightmare_mode_rewards_b');
    const nmC = sources.find(s => s.id === 'source_transient_nightmare_mode_rewards_c');

    assert.ok(nmA, 'Nightmare Rot A 必须作为独立来源存在');
    assert.ok(nmB, 'Nightmare Rot B 必须作为独立来源存在');
    assert.ok(nmC, 'Nightmare Rot C 必须作为独立来源存在');

    assert.strictEqual(nmA.rotation, 'A');
    assert.strictEqual(nmB.rotation, 'B');
    assert.strictEqual(nmC.rotation, 'C');

    const resA = calculateSourceExpectedValue(nmA.rewards, mergedPrices, { priceType: 'sellMin' });
    const resB = calculateSourceExpectedValue(nmB.rewards, mergedPrices, { priceType: 'sellMin' });
    const resC = calculateSourceExpectedValue(nmC.rewards, mergedPrices, { priceType: 'sellMin' });

    // 报告复算 A≈4.0439p、B≈2.4649p、C≈5.802p，误差 ±0.001
    assert.ok(Math.abs(resA.expectedValueRaw - 4.0439) < 0.001, `Nightmare A EV 应约为 4.0439，实际为 ${resA.expectedValueRaw}`);
    assert.ok(Math.abs(resB.expectedValueRaw - 2.4649) < 0.001, `Nightmare B EV 应约为 2.4649，实际为 ${resB.expectedValueRaw}`);
    assert.ok(Math.abs(resC.expectedValueRaw - 5.802) < 0.001, `Nightmare C EV 应约为 5.802，实际为 ${resC.expectedValueRaw}`);
  });

  it('2. 赏金解析：六类赏金按 (bountyLevel, rotation, stage) 分组，数量 > 0，首项 Redirection 掉率 20%', () => {
    const bounties = sources.filter(s => s.type === 'bounty');
    assert.ok(bounties.length > 0, `赏金来源数必须大于 0，实际为 ${bounties.length}`);

    // 验证每一项均保留 bountyLevel, rotation, stage
    for (const b of bounties) {
      assert.ok(b.bountyLevel, `赏金 ${b.id} 必须包含 bountyLevel`);
      assert.ok(b.rotation, `赏金 ${b.id} 必须包含 rotation`);
      assert.ok(b.stage, `赏金 ${b.id} 必须包含 stage`);
    }

    // 验证 Cetus 首项 Level 5 - 15 Cetus Bounty 轮次 A Stage 1
    const cetusFirst = bounties.find(b => 
      b.bountyLevel === 'Level 5 - 15 Cetus Bounty' &&
      b.rotation === 'A' &&
      b.stage === 'Stage 1'
    );
    assert.ok(cetusFirst, 'Level 5 - 15 Cetus Bounty [Rot A] (Stage 1) 来源必须存在');

    const redir = cetusFirst.rewards.find(r => r.itemName === 'Redirection');
    assert.ok(redir, 'Cetus 首项中必须包含 Redirection');
    assert.strictEqual(redir.chance, 20, 'Cetus 首项 Redirection 掉率必须为 20%');

    const res = calculateSourceExpectedValue(cetusFirst.rewards, mergedPrices, { priceType: 'sellMin' });
    assert.strictEqual(res.expectedValueRaw, 0.2, 'Redirection 单价 1p，掉率 20%，期望值贡献应为 0.2p');
    assert.strictEqual(res.pricedProbability, 20);
    assert.strictEqual(res.missingProbability, 80);
    assert.strictEqual(res.incomplete, true);
  });

  it('3. 仲裁单独处理：拆成 A/B/C 三个来源，验证期望 (A=0.67p, B=0.65p, C=0.715p) 及 rotationPattern 说明', () => {
    const arbA = sources.find(s => s.id === 'source_transient_arbitrations_a');
    const arbB = sources.find(s => s.id === 'source_transient_arbitrations_b');
    const arbC = sources.find(s => s.id === 'source_transient_arbitrations_c');

    assert.ok(arbA, 'Arbitrations Rot A 必须存在');
    assert.ok(arbB, 'Arbitrations Rot B 必须存在');
    assert.ok(arbC, 'Arbitrations Rot C 必须存在');

    const resA = calculateSourceExpectedValue(arbA.rewards, mergedPrices, { priceType: 'sellMin' });
    const resB = calculateSourceExpectedValue(arbB.rewards, mergedPrices, { priceType: 'sellMin' });
    const resC = calculateSourceExpectedValue(arbC.rewards, mergedPrices, { priceType: 'sellMin' });

    assert.ok(Math.abs(resA.expectedValueRaw - 0.67) < 0.001, `Arbitrations A 应为 0.67p，实际为 ${resA.expectedValueRaw}`);
    assert.ok(Math.abs(resB.expectedValueRaw - 0.65) < 0.001, `Arbitrations B 应为 0.65p，实际为 ${resB.expectedValueRaw}`);
    assert.ok(Math.abs(resC.expectedValueRaw - 0.715) < 0.001, `Arbitrations C 应为 0.715p，实际为 ${resC.expectedValueRaw}`);

    // rotationPattern 字段断言
    const expectedArbPattern = '仲裁轮次通常为 AABBCCCC…（不套用 AABC）';
    assert.strictEqual(arbA.rotationPattern, expectedArbPattern);
    assert.strictEqual(arbB.rotationPattern, expectedArbPattern);
    assert.strictEqual(arbC.rotationPattern, expectedArbPattern);

    // 普通无限任务 (如生存、防御) rotationPattern 断言
    const apolloA = sources.find(s => s.id === 'mission_mercury_apollodorus_a');
    assert.ok(apolloA);
    assert.strictEqual(apolloA.rotationPattern, '常见 AABC（仅供参考，未做聚合）');
  });

  it('4. 概率和核对：写入 probabilitySum 与 probabilityCheck 字段，不自动归一化', () => {
    for (const src of sources) {
      assert.strictEqual(typeof src.probabilitySum, 'number', `来源 ${src.id} 必须包含数值型 probabilitySum`);
      assert.ok(['ok', 'over', 'under'].includes(src.probabilityCheck), `来源 ${src.id} probabilityCheck 状态非法: ${src.probabilityCheck}`);

      if (src.probabilitySum > 100.15) {
        assert.strictEqual(src.probabilityCheck, 'over');
      } else if (src.probabilitySum < 99.85) {
        assert.strictEqual(src.probabilityCheck, 'under');
      } else {
        assert.strictEqual(src.probabilityCheck, 'ok');
      }
    }

    // 敌人来源用内表概率和核对
    const jackal = sources.find(s => s.id === 'enemy_jackal');
    assert.ok(jackal);
    const innerSum = Number(jackal.rewards.reduce((a, b) => a + b.chance, 0).toFixed(4));
    assert.strictEqual(jackal.probabilitySum, innerSum);
  });

  it('5. 缺价/概率未知记 null：返回 expectedValueRaw、incomplete、pricedProbability、missingProbability 等字段', () => {
    const mockRewards = [
      { itemName: 'Known Mod', slug: 'known_mod', chance: 25 },
      { itemName: 'Unknown Price Mod', slug: 'unknown_mod', chance: 25 },
      { itemName: 'Unknown Chance Mod', slug: 'mystery_mod', chance: null },
      { itemName: 'Forma Blueprint', slug: null, baseName: 'Forma Blueprint', chance: 25 }
    ];
    const mockPrices = {
      'known_mod@r0': { sellMin: 20, sellCount: 5 }
    };

    const res = calculateSourceExpectedValue(mockRewards, mockPrices, { priceType: 'sellMin' });
    assert.strictEqual(res.expectedValueRaw, 5.0, '25% * 20 = 5.0p');
    assert.strictEqual(res.expectedValue, 5.0);
    assert.strictEqual(res.incomplete, true, '存在未知概率或缺价项时 incomplete 必须为 true');
    assert.strictEqual(res.pricedProbability, 25);
    assert.strictEqual(res.missingProbability, 25);
    assert.strictEqual(res.untradeableProbability, 25);
    assert.strictEqual(res.unknownChanceCount, 1);
    assert.strictEqual(res.pricedCount, 1);
    assert.strictEqual(res.missingCount, 1);
    assert.strictEqual(res.untradeableCount, 1);

    // 真实敌人 Comet Shredder Captain 含 chance:null
    const captain = sources.find(s => s.nameEn.includes('Comet Shredder Captain'));
    assert.ok(captain);
    const capRes = calculateEnemyExpectedValue(captain.enemyModDropChance, captain.rewards, rawPrices, { priceType: 'sellMin' });
    assert.ok(capRes.unknownChanceCount > 0, 'Comet Shredder Captain 必须包含未知掉率统计');
    assert.strictEqual(capRes.incomplete, true);
  });

  it('6. 来源 ID 全局唯一且格式合规：所有 id 匹配 /^[a-z0-9]+(_[a-z0-9]+)*$/，且两个 Jackal 独立', () => {
    const idRegex = /^[a-z0-9]+(_[a-z0-9]+)*$/;
    const idSet = new Set();
    const duplicates = [];
    const invalidIds = [];

    for (const src of sources) {
      if (idSet.has(src.id)) {
        duplicates.push(src.id);
      }
      idSet.add(src.id);

      if (!idRegex.test(src.id)) {
        invalidIds.push(src.id);
      }
    }

    assert.strictEqual(duplicates.length, 0, `发现重复来源 ID: ${duplicates.join(', ')}`);
    assert.strictEqual(invalidIds.length, 0, `发现不合规 ID: ${invalidIds.slice(0, 5).join(', ')}`);
    assert.strictEqual(idSet.size, sources.length, '来源 ID 总数必须严格等于来源数量');

    // Jackal 两个条目拥有独立不同 id
    const jackals = sources.filter(s => s.enemyName === 'Jackal');
    assert.strictEqual(jackals.length, 2, '必须有两个 Jackal 敌人条目');
    assert.notStrictEqual(jackals[0].id, jackals[1].id, '两个 Jackal 必须具有不同的 ID');
    assert.strictEqual(jackals[0].id, 'enemy_jackal');
    assert.strictEqual(jackals[1].id, 'enemy_jackal_2');
  });

  it('7. 上游重复表去重：Europa Cryotic Front 45 项去重为 15 项，概率和≈100.04%，EV≈1.994p', () => {
    const ecf = sources.find(s => s.id === 'mission_europa_cryotic_front');
    assert.ok(ecf, 'Europa - Cryotic Front 来源必须存在');
    assert.strictEqual(ecf.rewards.length, 15, '去重后奖励列表应为 15 项');
    assert.strictEqual(ecf.dedupedRepeats, 3, '应记录 dedupedRepeats 为 3');
    assert.ok(ecf.dedupeNote && ecf.dedupeNote.includes('3 份完全相同'), '应记录详细去重说明');

    // 概率和 ≈ 100.04%
    assert.ok(Math.abs(ecf.probabilitySum - 100.04) < 0.05, `去重后概率和应约为 100.04%，实际为 ${ecf.probabilitySum}`);

    // 已知价贡献 ≈ 1.994p
    const res = calculateSourceExpectedValue(ecf.rewards, rawPrices, { priceType: 'sellMin' });
    assert.ok(Math.abs(res.expectedValueRaw - 1.994) < 0.005, `已知价贡献应约为 1.994p，实际为 ${res.expectedValueRaw}`);
  });

  it('8. 排序用未取整值：构造取整后相等但 Raw 不同的来源，排序顺序严格依据 Raw 值', () => {
    const srcA = {
      id: 'src_a',
      nameEn: 'Source A',
      rewards: [{ itemName: 'Item A', slug: 'item_a', chance: 10 }]
    };
    const srcB = {
      id: 'src_b',
      nameEn: 'Source B',
      rewards: [{ itemName: 'Item B', slug: 'item_b', chance: 10 }]
    };
    const testPrices = {
      'item_a@r0': { sellMin: 12.34, sellCount: 5 },
      'item_b@r0': { sellMin: 12.31, sellCount: 5 }
    };

    const expA = calculateSourceExpectedValue(srcA.rewards, testPrices, { priceType: 'sellMin' });
    const expB = calculateSourceExpectedValue(srcB.rewards, testPrices, { priceType: 'sellMin' });

    assert.strictEqual(expA.expectedValue, 1.23, '取整展示值均为 1.23');
    assert.strictEqual(expB.expectedValue, 1.23, '取整展示值均为 1.23');
    assert.ok(expA.expectedValueRaw > expB.expectedValueRaw, '未取整值 A 必须大于 B');

    srcA._exp = expA;
    srcB._exp = expB;

    const list = [srcB, srcA];
    list.sort((a, b) => {
      const eA = a._exp?.expectedValueConfidentRaw ?? a._exp?.expectedValueRaw ?? -1;
      const eB = b._exp?.expectedValueConfidentRaw ?? b._exp?.expectedValueRaw ?? -1;
      return eB - eA;
    });

    assert.strictEqual(list[0].id, 'src_a', '使用 Raw 排序时，1.234 必须排在 1.231 前面');
    assert.strictEqual(list[1].id, 'src_b');
  });

  it('9. 遗物 Forma Blueprint 明确为 untradeable (0p)，不导致 incomplete', () => {
    const lithA1 = relics.find(r => r.id === 'lith_a1');
    assert.ok(lithA1);

    const values = calculateExpectedValue(lithA1.rewards, mergedPrices, { priceType: 'sellMin', refinement: 'intact' });
    assert.strictEqual(values.incomplete, false, 'Lith A1 在 sellMin 口径下所有可交易物均有价，Forma 为 0p，incomplete 应为 false');
    assert.strictEqual(values.missingCount, 0);
    assert.strictEqual(values.untradeableCount, 1);
    assert.ok(Math.abs(values.expectedValueRaw - 4.333) < 0.005);
    assert.strictEqual(values.expectedValue, 4.33);
  });
});
