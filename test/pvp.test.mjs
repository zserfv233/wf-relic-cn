import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { isPvpSource, filterSources } from '../js/lib/sources.js';
import { RAW_DIR, hasRawFiles } from '../scripts/lib/raw-dir.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

describe('刷取来源 PvP 标记与筛选 (PvP / Conclave Filter - Invariants)', () => {
  const sourcesFile = path.join(DATA_DIR, 'sources.json');
  const metaFile = path.join(DATA_DIR, 'meta.json');
  const rawFile = path.join(RAW_DIR, 'drops_all.json');

  assert.ok(fs.existsSync(sourcesFile), 'data/sources.json 必须存在');
  assert.ok(fs.existsSync(metaFile), 'data/meta.json 必须存在');

  const sources = JSON.parse(fs.readFileSync(sourcesFile, 'utf8'));
  const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));

  // 从 raw drops_all.json 重算预期 Conclave 来源数
  let expectedPvpCount = null;
  if (hasRawFiles('drops_all.json')) {
    try {
      const raw = JSON.parse(fs.readFileSync(rawFile, 'utf8'));
      let rawPvpCount = 0;
      for (const [planet, nodes] of Object.entries(raw.missionRewards || {})) {
        for (const [node, nodeData] of Object.entries(nodes || {})) {
          if (nodeData.gameMode === 'Conclave') {
            if (nodeData.rewards && !Array.isArray(nodeData.rewards)) {
              rawPvpCount += Object.keys(nodeData.rewards).length;
            } else {
              rawPvpCount += 1;
            }
          }
        }
      }
      if (rawPvpCount > 0) expectedPvpCount = rawPvpCount;
    } catch (e) {
      console.warn('读取 drops_all.json 出错:', e.message);
    }
  }

  it('构建产物中，名称含 (Conclave) 或 gameMode===Conclave 的来源全部 isPvp===true，其它全部 isPvp===false', () => {
    assert.ok(sources.length > 0, '来源总数必须大于 0');

    for (const src of sources) {
      assert.strictEqual(typeof src.isPvp, 'boolean', `来源 ${src.id} 的 isPvp 必须是布尔值`);

      const hasConclaveName = (src.nameEn && src.nameEn.includes('(Conclave)')) ||
                              (src.nameZh && src.nameZh.includes('(Conclave)')) ||
                              (src.nameZh && src.nameZh.includes('武形秘仪'));
      const isConclaveMode = src.gameMode === 'Conclave';

      if (hasConclaveName || isConclaveMode) {
        assert.strictEqual(src.isPvp, true, `来源 ${src.id} 包含 Conclave 标识，isPvp 必须为 true`);
      } else {
        assert.strictEqual(src.isPvp, false, `来源 ${src.id} 不属于 Conclave，isPvp 必须为 false`);
      }
    }
  });

  it('PvP 来源数量与从原始 DE 数据重算结果一致，且 meta.stats 保持一致', (t) => {
    const pvpSources = sources.filter(s => s.isPvp);
    const nonPvpSources = sources.filter(s => !s.isPvp);

    // 核心不变量：sources 中 gameMode === 'Conclave' 的来源数 == isPvp 来源数
    const conclaveModeSources = sources.filter(s => s.gameMode === 'Conclave');
    assert.strictEqual(pvpSources.length, conclaveModeSources.length, 'sources 中 gameMode === Conclave 的来源数必须等于 isPvp 来源数');
    assert.strictEqual(pvpSources.length + nonPvpSources.length, sources.length);
    assert.strictEqual(meta.stats.pvpSources, pvpSources.length);
    assert.strictEqual(meta.pvpSources, pvpSources.length);
    assert.strictEqual(meta.stats.totalSources, sources.length);

    if (expectedPvpCount !== null) {
      assert.strictEqual(pvpSources.length, expectedPvpCount, `实际 PvP 来源数量应等于从原始数据重算的 ${expectedPvpCount}`);
    } else {
      if (t && typeof t.skip === 'function') {
        t.skip('原始 DE 数据 drops_all.json 不存在，跳过与原始数据重算数量对比');
      } else {
        console.log('原始 DE 数据 drops_all.json 不存在，跳过与原始数据重算数量对比');
      }
    }
  });

  it('isPvpSource 纯函数识别逻辑健全，不误判普通星图任务', () => {
    assert.strictEqual(isPvpSource({ gameMode: 'Conclave' }), true);
    assert.strictEqual(isPvpSource({ nameEn: 'Saturn - Annihilation (Conclave)' }), true);
    assert.strictEqual(isPvpSource({ nameZh: '土星 - 歼灭 (武形秘仪)' }), true);

    // 负向测试
    assert.strictEqual(isPvpSource({ gameMode: 'Survival', nameEn: 'Mercury - Apollodorus (Survival)' }), false);
    assert.strictEqual(isPvpSource({ gameMode: 'Defense', nameZh: '地球 - Lith (防御)' }), false);
    assert.strictEqual(isPvpSource(null), false);
    assert.strictEqual(isPvpSource({}), false);
  });

  it('前端筛选纯函数 filterSources: 默认列表排除 isPvp，PvP 模式仅包含 isPvp 来源', () => {
    const pvpSourcesCount = sources.filter(s => s.isPvp).length;
    const historicalSourcesCount = sources.filter(s => s.historicalEvent).length;

    // 默认模式 (pvpOnly: false, 默认亦排除历史活动)
    const defaultList = filterSources(sources, { pvpOnly: false });
    assert.strictEqual(defaultList.length, sources.length - pvpSourcesCount - historicalSourcesCount);
    assert.ok(defaultList.every(s => s.isPvp === false), '默认列表中不能包含任何 isPvp 来源');

    // PvP 模式 (pvpOnly: true)
    const pvpList = filterSources(sources, { pvpOnly: true });
    assert.strictEqual(pvpList.length, pvpSourcesCount, `PvP 视图中必须正好显示 ${pvpSourcesCount} 处来源`);
    assert.ok(pvpList.every(s => s.isPvp === true), 'PvP 列表中每一项都必须是 isPvp === true');
  });

  it('回归验证: 再次执行 build-data.mjs 后 isPvp 仍正确生成并保持一致', (t) => {
    if (!hasRawFiles('drops_all.json', 'Relics.json', 'zh.json')) {
      t.skip('缺少原始资料文件 (drops_all.json, Relics.json, zh.json)，跳过重新构建回归测试');
      return;
    }

    // 运行构建脚本
    execFileSync('node', ['scripts/build-data.mjs', '--raw', RAW_DIR], {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'pipe'
    });

    const freshSources = JSON.parse(fs.readFileSync(sourcesFile, 'utf8'));
    const freshMeta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));

    const pvpFresh = freshSources.filter(s => s.isPvp === true);
    const nonPvpFresh = freshSources.filter(s => s.isPvp === false);
    const conclaveFresh = freshSources.filter(s => s.gameMode === 'Conclave');

    assert.strictEqual(pvpFresh.length, conclaveFresh.length, '重新构建后 gameMode === Conclave 数必须等于 isPvp 数');
    assert.strictEqual(nonPvpFresh.length, freshSources.length - pvpFresh.length);
    assert.strictEqual(freshMeta.stats.pvpSources, pvpFresh.length);
    assert.strictEqual(freshMeta.pvpSources, pvpFresh.length);
    if (expectedPvpCount !== null) {
      assert.strictEqual(pvpFresh.length, expectedPvpCount);
    }
  });
});
