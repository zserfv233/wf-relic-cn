import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

describe('未开紫卡 DE 名→slug 匹配与分类数据集 (Rivens & Drop Data - Invariants)', () => {
  const rivensPath = path.join(DATA_DIR, 'rivens.json');
  const arcanesPath = path.join(DATA_DIR, 'arcanes.json');
  const modsPath = path.join(DATA_DIR, 'mods.json');
  const sourcesPath = path.join(DATA_DIR, 'sources.json');

  assert.ok(fs.existsSync(rivensPath), 'data/rivens.json 必须存在');
  assert.ok(fs.existsSync(arcanesPath), 'data/arcanes.json 必须存在');
  assert.ok(fs.existsSync(modsPath), 'data/mods.json 必须存在');
  assert.ok(fs.existsSync(sourcesPath), 'data/sources.json 必须存在');

  const rivens = JSON.parse(fs.readFileSync(rivensPath, 'utf8'));
  const arcanes = JSON.parse(fs.readFileSync(arcanesPath, 'utf8'));
  const mods = JSON.parse(fs.readFileSync(modsPath, 'utf8'));
  const sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));

  it('验证全部未开紫卡 DE 官方掉落表名称精确对应 WFM slug 且 slug 唯一', () => {
    assert.strictEqual(rivens.length, new Set(rivens.map(r => r.slug)).size, '紫卡 slug 必须全部唯一');
    assert.ok(rivens.length >= 8, '应包含至少 8 种未开紫卡');

    const expectedMap = {
      'rifle_riven_mod_veiled': '步枪裂罅',
      'pistol_riven_mod_veiled': '手枪裂罅',
      'melee_riven_mod_veiled': '近战裂罅',
      'shotgun_riven_mod_veiled': '霰弹枪裂罅',
      'zaw_riven_mod_veiled': 'Zaw',
      'kitgun_riven_mod_veiled': '组合枪',
      'archgun_riven_mod_veiled': '曲翼枪械',
      'companion_weapon_riven_mod_veiled': '同伴武器'
    };

    for (const [slug, zhKeyword] of Object.entries(expectedMap)) {
      const riven = rivens.find(r => r.slug === slug);
      assert.ok(riven, `未开紫卡 slug ${slug} 必须存在`);
      assert.ok(riven.zhName.includes(zhKeyword), `紫卡中文名 (${riven.zhName}) 应包含 ${zhKeyword}`);
      assert.ok(riven.dropSources.length > 0, `紫卡 ${slug} 应包含实际掉落来源`);
    }
  });

  it('赋能与 Mod 数据集完整性与互斥不变量', () => {
    assert.strictEqual(arcanes.length, new Set(arcanes.map(a => a.slug)).size, '赋能 slug 必须全部唯一');
    assert.strictEqual(mods.length, new Set(mods.map(m => m.slug)).size, 'Mod slug 必须全部唯一');
    assert.ok(arcanes.length > 0, '赋能数据集不为空');
    assert.ok(mods.length > 0, 'Mod 数据集不为空');
    assert.ok(sources.length > 0, '统一掉落来源不为空');

    // 检查 Arcane Energize
    const energize = arcanes.find(a => a.slug === 'arcane_energize');
    assert.ok(energize);
    assert.strictEqual(energize.maxRank, 5);
    assert.ok(energize.zhName.includes('充沛'));

    // 检查 Serration (膛线)
    const serration = mods.find(m => m.slug === 'serration');
    assert.ok(serration);
    assert.strictEqual(serration.maxRank, 10);
    assert.ok(serration.zhName.includes('膛线'));
  });

  it('紫卡与 Mod 互斥不变量: companion_weapon_riven_mod_veiled 及任何紫卡不得出现在 mods.json', () => {
    const rivenSlugs = new Set(rivens.map(r => r.slug));
    const modSlugs = new Set(mods.map(m => m.slug));

    // companion_weapon_riven_mod_veiled 严禁在 mods 中
    assert.ok(!modSlugs.has('companion_weapon_riven_mod_veiled'), 'companion_weapon_riven_mod_veiled 严禁出现在 mods.json 中');

    // 两个集合交集必须严格为空
    const intersection = [...modSlugs].filter(slug => rivenSlugs.has(slug));
    assert.strictEqual(intersection.length, 0, `mods.json 与 rivens.json 的 slug 集合必须互斥，但发现了交集: ${intersection.join(', ')}`);

    // 任何带 veiled riven 标记的 mod 都不应混入 mods.json
    const leakedVeiled = mods.filter(m => m.slug.includes('riven_mod_veiled') || m.tags?.includes('veiled_riven'));
    assert.strictEqual(leakedVeiled.length, 0, 'mods.json 中不得包含任何未开紫卡');
  });
});
