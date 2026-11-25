import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

describe('精炼掉率提取 (Drop Chances Extraction)', () => {
  const relicsFile = path.join(DATA_DIR, 'relics.json');
  assert.ok(fs.existsSync(relicsFile), 'data/relics.json 必须存在');

  const { relics } = JSON.parse(fs.readFileSync(relicsFile, 'utf8'));

  it('真实数据中存在 Axi A1 遗物且结构完整', () => {
    const axiA1 = relics.find(r => r.id === 'axi_a1');
    assert.ok(axiA1, 'Axi A1 遗物必须存在于构建结果中');
    assert.strictEqual(axiA1.tier, 'Axi');
    assert.strictEqual(axiA1.tierZh, '后纪');
    assert.strictEqual(axiA1.name, 'Axi A1');
    assert.strictEqual(axiA1.zhName, '后纪 A1 遗物');
    assert.strictEqual(axiA1.rewards.length, 6, 'Axi A1 必须包含 6 个奖励物品');
  });

  it('断言已知遗物 Axi A1 Intact 稀有奖励掉率为 2%、Radiant 为 10%', () => {
    const axiA1 = relics.find(r => r.id === 'axi_a1');
    assert.ok(axiA1);

    // 稀有奖励是 Nikana Prime Blueprint
    const rareReward = axiA1.rewards.find(rew => rew.rarity === 'Rare');
    assert.ok(rareReward, 'Axi A1 中必须包含稀有奖励');
    assert.strictEqual(rareReward.name, 'Nikana Prime Blueprint');
    assert.strictEqual(rareReward.zhName, '侍刃 Prime 蓝图');

    // 掉率验证：直接来自 DE 官方掉落表 drops_all.json
    assert.strictEqual(rareReward.chances.intact, 2, 'Axi A1 Intact 稀有掉率必须为 2%');
    assert.strictEqual(rareReward.chances.exceptional, 4, 'Axi A1 Exceptional 稀有掉率必须为 4%');
    assert.strictEqual(rareReward.chances.flawless, 6, 'Axi A1 Flawless 稀有掉率必须为 6%');
    assert.strictEqual(rareReward.chances.radiant, 10, 'Axi A1 Radiant 稀有掉率必须为 10%');
  });

  it('断言 Axi A1 的全部非稀有奖励在 DE 掉落表中均为 Uncommon', () => {
    const axiA1 = relics.find(r => r.id === 'axi_a1');
    const uncommons = axiA1.rewards.filter(rew => rew.rarity === 'Uncommon');
    const rares = axiA1.rewards.filter(rew => rew.rarity === 'Rare');

    assert.strictEqual(rares.length, 1, 'Axi A1 应有 1 个稀有奖励 (Nikana Prime Blueprint)');
    assert.strictEqual(uncommons.length, 5, 'Axi A1 的其余 5 个奖励在 DE 官方表中均为 Uncommon');

    // 掉率两档验证: Intact 11% / Radiant 20% (2项), Intact 25.33% / Radiant 16.67% (3项)
    const tier11 = uncommons.filter(u => u.chances.intact === 11);
    const tier25 = uncommons.filter(u => u.chances.intact === 25.33);

    assert.strictEqual(tier11.length, 2);
    assert.strictEqual(tier25.length, 3);
    for (const u of tier11) assert.strictEqual(u.chances.radiant, 20);
    for (const u of tier25) assert.strictEqual(u.chances.radiant, 16.67);
  });

  it('断言 Meso D1 两个 Forma Blueprint 槽位四档掉率正确配对', () => {
    const mesoD1 = relics.find(r => r.id === 'meso_d1');
    assert.ok(mesoD1, 'Meso D1 必须存在');
    assert.strictEqual(mesoD1.rewards.length, 6);

    const formaRewards = mesoD1.rewards.filter(r => r.baseName === 'Forma Blueprint' || r.name.includes('Forma Blueprint'));
    assert.strictEqual(formaRewards.length, 2, 'Meso D1 必须包含两个 Forma 蓝图槽位');

    const [slot1, slot2] = formaRewards;

    // Slot 1 (DE 原表 11% 槽位): Intact 11%, Exceptional 13%, Flawless 17%, Radiant 20%
    assert.strictEqual(slot1.chances.intact, 11);
    assert.strictEqual(slot1.chances.exceptional, 13);
    assert.strictEqual(slot1.chances.flawless, 17);
    assert.strictEqual(slot1.chances.radiant, 20);
    assert.strictEqual(slot1.rarity, 'Uncommon');
    assert.strictEqual(slot1.quantity, 2);

    // Slot 2 (DE 原表 25.33% 槽位): Intact 25.33%, Exceptional 23.33%, Flawless 20%, Radiant 16.67%
    assert.strictEqual(slot2.chances.intact, 25.33);
    assert.strictEqual(slot2.chances.exceptional, 23.33);
    assert.strictEqual(slot2.chances.flawless, 20);
    assert.strictEqual(slot2.chances.radiant, 16.67);
    assert.strictEqual(slot2.rarity, 'Uncommon');
    assert.strictEqual(slot2.quantity, 2);
  });

  it('断言 data/relics.json 里标准 6 奖励遗物四个精炼档每档掉率之和≈100 (误差 ±0.1)，冲突遗物 (ETERNA) 特殊处理', () => {
    const standardRelics = relics.filter(r => r.rewards.length === 6 && !r.dataConflict);
    assert.ok(standardRelics.length > 500, '应包含绝大部分标准 6 奖励遗物');

    const tiers = ['intact', 'exceptional', 'flawless', 'radiant'];
    for (const r of standardRelics) {
      for (const tier of tiers) {
        const sum = r.rewards.reduce((acc, rew) => acc + (rew.chances[tier] ?? 0), 0);
        assert.ok(
          Math.abs(sum - 100) <= 0.1,
          `遗物 ${r.name} 在精炼 ${tier} 下掉率总和 ${sum} 偏离 100% 超过 0.1`
        );
      }
    }

    // 检查 ETERNA 资料冲突不变量
    const eterna = relics.find(r => r.id === 'requiem_eterna');
    assert.ok(eterna, 'Requiem ETERNA 必须存在');
    assert.strictEqual(eterna.dataConflict, true, 'ETERNA 必须标记 dataConflict === true');
    assert.ok(eterna.dataConflictNote.includes('资料冲突'));
    assert.strictEqual(eterna.rewards.length, 8, 'ETERNA 包含 8 种安魂 Mod');
    const intactSum = eterna.rewards.reduce((acc, rew) => acc + (rew.chances.intact ?? 0), 0);
    assert.ok(Math.abs(intactSum - 76) <= 0.1, `ETERNA intact 掉率和为 76% (8 * 9.5%)，实测为 ${intactSum}`);
    for (const tier of ['exceptional', 'flawless', 'radiant']) {
      assert.ok(eterna.rewards.every(rew => rew.chances[tier] === null), `ETERNA ${tier} 必须全为 null`);
    }
  });

  it('断言 Lith A1 Braton Prime Barrel 的稀有度使用 DE 掉落表的 Uncommon', () => {
    const lithA1 = relics.find(r => r.id === 'lith_a1');
    assert.ok(lithA1, 'Lith A1 遗物必须存在');
    const bratonBarrel = lithA1.rewards.find(r => r.name === 'Braton Prime Barrel');
    assert.ok(bratonBarrel, 'Lith A1 必须包含 Braton Prime Barrel');
    assert.strictEqual(bratonBarrel.rarity, 'Uncommon', '稀有度必须取 DE 掉落表的 Uncommon 而非 Common');
    assert.strictEqual(bratonBarrel.chances.intact, 25.33);
  });
});
