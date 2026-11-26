import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

describe('圣殿等任务来源名称模式去重测试 (Sanctuary Mode Deduplication)', () => {
  const sourcesPath = path.join(DATA_DIR, 'sources.json');
  assert.ok(fs.existsSync(sourcesPath), 'data/sources.json 必须存在');
  const sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));

  it('断言 data/sources.json 里没有任何 mission 来源满足“括号内模式名被节点名完整包含”', () => {
    for (const s of sources) {
      if (s.type !== 'mission') continue;
      // 提取 nameEn 中括号包裹的模式名 (形如 "... - Node (Mode) [Rot X]" 或 "... - Node (Mode)")
      const match = s.nameEn.match(/^.+? - (.+?) \((.+?)\)(?: \[Rot [A-Z]\])?$/);
      if (match) {
        const nodePart = match[1].toLowerCase();
        const modePart = match[2].toLowerCase();
        assert.ok(
          !nodePart.includes(modePart),
          `来源 ${s.id} 的英文名 (${s.nameEn}) 仍包含重复的括号模式名 (${match[2]})`
        );
      }
    }
  });

  it('断言 14 个任务来源的新名称 (用 id 精确匹配)', () => {
    const expected14 = {
      'mission_sanctuary_sanctuary_onslaught_a': {
        nameEn: 'Sanctuary - Sanctuary Onslaught [Rot A]',
        nameZh: '圣殿 - 圣殿突袭 [轮次 A]'
      },
      'mission_sanctuary_sanctuary_onslaught_b': {
        nameEn: 'Sanctuary - Sanctuary Onslaught [Rot B]',
        nameZh: '圣殿 - 圣殿突袭 [轮次 B]'
      },
      'mission_sanctuary_sanctuary_onslaught_c': {
        nameEn: 'Sanctuary - Sanctuary Onslaught [Rot C]',
        nameZh: '圣殿 - 圣殿突袭 [轮次 C]'
      },
      'mission_sanctuary_elite_sanctuary_onslaught_a': {
        nameEn: 'Sanctuary - Elite Sanctuary Onslaught [Rot A]',
        nameZh: '圣殿 - 精英级圣殿突袭 [轮次 A]'
      },
      'mission_sanctuary_elite_sanctuary_onslaught_b': {
        nameEn: 'Sanctuary - Elite Sanctuary Onslaught [Rot B]',
        nameZh: '圣殿 - 精英级圣殿突袭 [轮次 B]'
      },
      'mission_sanctuary_elite_sanctuary_onslaught_c': {
        nameEn: 'Sanctuary - Elite Sanctuary Onslaught [Rot C]',
        nameZh: '圣殿 - 精英级圣殿突袭 [轮次 C]'
      },
      'mission_duviri_the_circuit_a': {
        nameEn: 'Duviri - The Circuit [Rot A]',
        nameZh: '双衍王境 - 无尽回廊 [轮次 A]'
      },
      'mission_duviri_the_circuit_b': {
        nameEn: 'Duviri - The Circuit [Rot B]',
        nameZh: '双衍王境 - 无尽回廊 [轮次 B]'
      },
      'mission_duviri_the_circuit_c': {
        nameEn: 'Duviri - The Circuit [Rot C]',
        nameZh: '双衍王境 - 无尽回廊 [轮次 C]'
      },
      'mission_h_llvania_legacyte_harvest_a': {
        nameEn: 'Höllvania - Legacyte Harvest [Rot A]',
        nameZh: '霍瓦尼亚 - 传承种收割 [轮次 A]'
      },
      'mission_h_llvania_legacyte_harvest_b': {
        nameEn: 'Höllvania - Legacyte Harvest [Rot B]',
        nameZh: '霍瓦尼亚 - 传承种收割 [轮次 B]'
      },
      'mission_h_llvania_legacyte_harvest_c': {
        nameEn: 'Höllvania - Legacyte Harvest [Rot C]',
        nameZh: '霍瓦尼亚 - 传承种收割 [轮次 C]'
      },
      'mission_h_llvania_exterminate_scaldra': {
        nameEn: 'Höllvania - Exterminate: Scaldra',
        nameZh: '霍瓦尼亚 - 歼灭：炽蛇军'
      },
      'mission_h_llvania_exterminate_techrot': {
        nameEn: 'Höllvania - Exterminate: Techrot',
        nameZh: '霍瓦尼亚 - 歼灭：科腐者'
      }
    };

    for (const [id, expected] of Object.entries(expected14)) {
      const src = sources.find(s => s.id === id);
      assert.ok(src, `必须存在来源 ${id}`);
      assert.strictEqual(src.nameEn, expected.nameEn, `来源 ${id} 的 nameEn 不匹配`);
      assert.strictEqual(src.nameZh, expected.nameZh, `来源 ${id} 的 nameZh 不匹配`);
    }
  });
});
