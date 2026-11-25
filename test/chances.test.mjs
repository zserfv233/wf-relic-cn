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

  it('断言 Axi A1 的罕见与常见奖励掉率与 DE 数据完全吻合', () => {
    const axiA1 = relics.find(r => r.id === 'axi_a1');
    const uncommons = axiA1.rewards.filter(rew => rew.rarity === 'Uncommon');
    const commons = axiA1.rewards.filter(rew => rew.rarity === 'Common');

    assert.strictEqual(uncommons.length, 2, 'Axi A1 应有 2 个罕见奖励');
    assert.strictEqual(commons.length, 3, 'Axi A1 应有 3 个常见奖励');

    // 罕见掉率: Intact 11%, Radiant 20%
    for (const unc of uncommons) {
      assert.strictEqual(unc.chances.intact, 11);
      assert.strictEqual(unc.chances.radiant, 20);
    }

    // 常见掉率: Intact 25.33%, Radiant 16.67%
    for (const com of commons) {
      assert.strictEqual(com.chances.intact, 25.33);
      assert.strictEqual(com.chances.radiant, 16.67);
    }
  });
});
