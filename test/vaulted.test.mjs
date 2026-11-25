import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

describe('入库状态判定与未列出筛选 (Vaulted & Unlisted Status - Invariants)', () => {
  const relicsFile = path.join(DATA_DIR, 'relics.json');
  const metaFile = path.join(DATA_DIR, 'meta.json');

  assert.ok(fs.existsSync(relicsFile));
  assert.ok(fs.existsSync(metaFile));

  const { relics } = JSON.parse(fs.readFileSync(relicsFile, 'utf8'));
  const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));

  it('总遗物数与元数据统计完全一致', () => {
    assert.ok(relics.length > 0);
    assert.strictEqual(meta.stats.totalRelics, relics.length);
  });

  it('A3 断言: Requiem I/II/III/IV 状态标记为 unlisted 并包含机制原因', () => {
    const unlistedIds = ['requiem_i', 'requiem_ii', 'requiem_iii', 'requiem_iv'];
    for (const id of unlistedIds) {
      const r = relics.find(x => x.id === id);
      assert.ok(r, `遗物 ${id} 必须存在`);
      assert.strictEqual(r.status, 'unlisted');
      assert.strictEqual(r.unlisted, true);
      assert.strictEqual(r.vaulted, false, '未列出安魂遗物机制上不属于已入库');
      assert.ok(r.statusReason.includes('安魂遗物来自赤毒虹吸器/赤毒洪流，按游戏机制不入库'));
      assert.strictEqual(r.statusSource, '待确认：DE 掉落表未覆盖此来源');
    }

    const allUnlisted = relics.filter(r => r.unlisted);
    assert.strictEqual(allUnlisted.length, meta.stats.unlistedRelics);
    assert.ok(allUnlisted.length >= 4);
  });

  it('A3 断言: 可获取模式筛选逻辑支持包含/排除 unlisted 不变量', () => {
    // 默认模式: 包含普通可获取 + unlisted
    const defaultObtainable = relics.filter(r => {
      if (r.unlisted) return true; // 默认包含
      return !r.vaulted;
    });
    assert.strictEqual(defaultObtainable.length, meta.stats.obtainableRelics);

    // 排除 unlisted 模式: 纯 DE 掉落表现存掉落
    const strictDroptableOnly = relics.filter(r => {
      if (r.unlisted) return false; // 用户排除
      return !r.vaulted;
    });

    const allUnlisted = relics.filter(r => r.unlisted);
    assert.strictEqual(strictDroptableOnly.length + allUnlisted.length, defaultObtainable.length);
  });

  it('已入库遗物数不变量: obtainable + vaulted === total', () => {
    const vaultedRelics = relics.filter(r => r.vaulted);
    const nonVaulted = relics.filter(r => !r.vaulted);
    assert.strictEqual(vaultedRelics.length, meta.stats.vaultedRelics);
    assert.strictEqual(vaultedRelics.length + nonVaulted.length, relics.length);
  });

  it('准确识别 DE 掉落表与 WFCD Relics.json 的入库状态冲突', () => {
    const conflicts = relics.filter(r => r.conflict);
    assert.strictEqual(conflicts.length, meta.stats.conflictRelics);
    for (const r of conflicts) {
      assert.ok(r.conflictNote, `冲突遗物 ${r.id} 必须包含冲突原因说明`);
      assert.notStrictEqual(r.vaulted, r.wfcdVaulted, `冲突遗物 ${r.id} 的 DE 入库状态与 WFCD 状态必须相反`);
    }
  });
});
