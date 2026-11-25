import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { searchIndex } from '../js/lib/search.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

describe('搜索功能 (Search Index & Matching)', () => {
  const indexFile = path.join(DATA_DIR, 'search-index.json');
  assert.ok(fs.existsSync(indexFile), 'data/search-index.json 必须存在');

  const index = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

  it('中文搜索用例：搜 "后纪 A1" 或 "侍刃" 正确匹配到候选', () => {
    const relicResults = searchIndex('后纪 A1', index);
    assert.ok(relicResults.length > 0, '应搜出结果');
    assert.strictEqual(relicResults[0].id, 'axi_a1');
    assert.strictEqual(relicResults[0].zhName, '后纪 A1 遗物');

    const itemResults = searchIndex('侍刃', index);
    assert.ok(itemResults.some(r => r.name.includes('Nikana') || r.zhName.includes('侍刃')));
  });

  it('英文搜索用例：搜 "Axi A1" 或 "Nikana Prime Blueprint" 正确匹配到候选', () => {
    const relicResults = searchIndex('Axi A1', index);
    assert.ok(relicResults.length > 0);
    assert.strictEqual(relicResults[0].id, 'axi_a1');

    const itemResults = searchIndex('Nikana Prime Blueprint', index);
    assert.ok(itemResults.length > 0);
    assert.strictEqual(itemResults[0].name, 'Nikana Prime Blueprint');
  });

  it('拼音全拼搜索用例：搜 "houji a1" 或 "shiren" 正确匹配到候选', () => {
    const relicResults = searchIndex('houji a1', index);
    assert.ok(relicResults.length > 0, '拼音全拼 houji a1 应匹配到后纪 A1');
    assert.strictEqual(relicResults[0].id, 'axi_a1');

    const itemResults = searchIndex('shiren', index);
    assert.ok(itemResults.length > 0, '拼音全拼 shiren 应匹配到侍刃');
    assert.ok(itemResults.some(r => r.zhName.includes('侍刃')));
  });

  it('拼音首字母搜索用例：搜 "hja1" 或 "sr" 正确匹配到候选', () => {
    const relicResults = searchIndex('hja1', index);
    assert.ok(relicResults.length > 0, '拼音首字母 hja1 应匹配到后纪 A1');
    assert.strictEqual(relicResults[0].id, 'axi_a1');

    const itemResults = searchIndex('sttsq', index);
    assert.ok(itemResults.some(r => r.name.includes('Akstiletto') || r.zhName.includes('史提托')), '拼音首字母 sttsq 应匹配到史提托');
  });

  it('英文缩写搜索用例：搜 "aps" 或 "tpsb" 正确匹配到候选', () => {
    const apsResults = searchIndex('aps', index);
    assert.ok(apsResults.some(r => r.name.toLowerCase().includes('ash prime systems')), 'aps 应匹配到 Ash Prime Systems');

    const tpsbResults = searchIndex('tpsb', index);
    assert.ok(tpsbResults.some(r => r.name.toLowerCase().includes('trinity prime systems blueprint')), 'tpsb 应匹配到 Trinity Prime Systems Blueprint');

    const bpResults = searchIndex('tpsbp', index);
    assert.ok(bpResults.some(r => r.name.toLowerCase().includes('trinity prime systems blueprint')), 'tpsbp 应匹配到 Trinity Prime Systems Blueprint');
  });
});
