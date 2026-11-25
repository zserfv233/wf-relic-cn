import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

describe('入库状态判定与筛选 (Vaulted Filtering & Conflict Detection)', () => {
  const relicsFile = path.join(DATA_DIR, 'relics.json');
  const metaFile = path.join(DATA_DIR, 'meta.json');

  assert.ok(fs.existsSync(relicsFile));
  assert.ok(fs.existsSync(metaFile));

  const { relics } = JSON.parse(fs.readFileSync(relicsFile, 'utf8'));
  const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));

  it('总遗物数与元数据统计一致 (800 个)', () => {
    assert.strictEqual(relics.length, 800);
    assert.strictEqual(meta.stats.totalRelics, 800);
  });

  it('当前可获取遗物数为 36 个 (vaulted === false)', () => {
    const obtainable = relics.filter(r => !r.vaulted);
    assert.strictEqual(obtainable.length, 36);
    assert.strictEqual(meta.stats.obtainableRelics, 36);

    // 确认常见现存遗物都在其中
    const sampleUnvaulted = ['lith_l8', 'meso_d8', 'neo_a16', 'axi_a21'];
    for (const id of sampleUnvaulted) {
      const found = obtainable.find(r => r.id === id);
      assert.ok(found, `遗物 ${id} 应该为当前可获取 (未入库)`);
    }
  });

  it('已入库遗物数为 764 个 (vaulted === true)', () => {
    const vaulted = relics.filter(r => r.vaulted);
    assert.strictEqual(vaulted.length, 764);
    assert.strictEqual(meta.stats.vaultedRelics, 764);

    // Axi A1 确认入库
    const axiA1 = relics.find(r => r.id === 'axi_a1');
    assert.strictEqual(axiA1.vaulted, true);
  });

  it('准确识别 DE 掉落表与 WFCD Relics.json 的入库状态冲突 (2 个冲突)', () => {
    const conflicts = relics.filter(r => r.conflict);
    assert.strictEqual(conflicts.length, 2);
    assert.strictEqual(meta.stats.conflictRelics, 2);

    const conflictIds = conflicts.map(c => c.id).sort();
    assert.deepStrictEqual(conflictIds, ['axi_c13', 'requiem_eterna']);

    // 验证冲突信息
    for (const c of conflicts) {
      assert.ok(c.conflictNote);
      assert.notStrictEqual(c.vaulted, c.wfcdVaulted);
    }
  });
});
