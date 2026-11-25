import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

describe('未开紫卡 DE 名→slug 匹配与分类数据集 (Rivens & Drop Data)', () => {
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

  it('验证全部 8 种未开紫卡 DE 官方掉落表名称精确对应 WFM slug', () => {
    assert.strictEqual(rivens.length, 8, '应包含 8 种未开紫卡');

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

  it('赋能与 Mod 数据集完整性验证', () => {
    assert.strictEqual(arcanes.length, 170, '赋能总数应为 170');
    assert.ok(mods.length >= 700, '具掉落来源的 Mod 数量应不低于 700');
    assert.ok(sources.length >= 2000, '统一掉落来源总数应不低于 2000');

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
});
