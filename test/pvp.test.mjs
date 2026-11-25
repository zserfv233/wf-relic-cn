import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { isPvpSource, filterSources } from '../js/lib/sources.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

describe('刷取来源 PvP 标记与筛选 (PvP / Conclave Filter)', () => {
  const sourcesFile = path.join(DATA_DIR, 'sources.json');
  const metaFile = path.join(DATA_DIR, 'meta.json');

  assert.ok(fs.existsSync(sourcesFile), 'sources.json 必须存在');
  assert.ok(fs.existsSync(metaFile), 'meta.json 必须存在');

  const sources = JSON.parse(fs.readFileSync(sourcesFile, 'utf8'));
  const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));

  it('构建产物中，名称含 (Conclave) 或 gameMode===Conclave 的来源全部 isPvp===true，其它全部 isPvp===false', () => {
    assert.strictEqual(sources.length, 2061, '来源总数应为 2061');

    for (const src of sources) {
      assert.strictEqual(typeof src.isPvp, 'boolean', `来源 ${src.id} 的 isPvp 必须是布尔值`);

      const hasConclaveName = (src.nameEn && src.nameEn.includes('(Conclave)')) ||
                              (src.nameZh && src.nameZh.includes('(Conclave)')) ||
                              (src.node && src.node.includes('(Conclave)'));
      const isConclaveMode = src.gameMode === 'Conclave';

      if (hasConclaveName || isConclaveMode) {
        assert.strictEqual(src.isPvp, true, `来源 ${src.nameEn} 应该被标记为 isPvp===true`);
      } else {
        assert.strictEqual(src.isPvp, false, `来源 ${src.nameEn} 应该被标记为 isPvp===false`);
      }
    }
  });

  it('断言 PvP 来源确切数量为 45，且 meta.json 准确记录 pvpSources 统计', () => {
    const pvpSources = sources.filter(s => s.isPvp);
    const nonPvpSources = sources.filter(s => !s.isPvp);

    assert.strictEqual(pvpSources.length, 45, '实际 PvP 来源数量应正好为 45');
    assert.strictEqual(nonPvpSources.length, 2016, '非 PvP 来源数量应为 2016');
    assert.strictEqual(pvpSources.length + nonPvpSources.length, 2061);

    // 检查 meta 统计
    assert.strictEqual(meta.stats.pvpSources, 45, 'meta.stats.pvpSources 必须为 45');
    assert.strictEqual(meta.pvpSources, 45, 'meta.pvpSources 必须为 45');
    assert.strictEqual(meta.stats.totalSources, 2061);
  });

  it('isPvpSource 纯函数识别逻辑健全，不误判普通星图任务', () => {
    // 正向匹配
    assert.strictEqual(isPvpSource({ gameMode: 'Conclave' }), true);
    assert.strictEqual(isPvpSource({ nameEn: 'Saturn - Cephalon Capture (Conclave) [Rot A]' }), true);
    assert.strictEqual(isPvpSource({ node: 'Team Annihilation (Conclave)' }), true);
    assert.strictEqual(isPvpSource({ nameZh: '土星 - 武形秘仪 [轮次 A]' }), true);
    assert.strictEqual(isPvpSource({ nameEn: 'Conclave Annihilation' }), true);

    // 负向匹配 (普通星图任务与敌人击杀)
    assert.strictEqual(isPvpSource({ nameEn: 'Earth - E Prime (Extermination)', gameMode: 'Extermination' }), false);
    assert.strictEqual(isPvpSource({ nameEn: 'Saturn - Helene (Defense)', gameMode: 'Defense' }), false);
    assert.strictEqual(isPvpSource({ type: 'enemy', enemyName: 'Corpus Tech' }), false);
    assert.strictEqual(isPvpSource({ type: 'bounty', nameEn: 'Cetus Bounty Tier 5' }), false);
    assert.strictEqual(isPvpSource(null), false);
    assert.strictEqual(isPvpSource({}), false);
  });

  it('前端筛选纯函数 filterSources: 默认列表排除 isPvp，PvP 模式仅包含 isPvp 来源', () => {
    // 默认模式 (pvpOnly: false)
    const defaultList = filterSources(sources, { pvpOnly: false });
    assert.strictEqual(defaultList.length, 2016, '默认视图应正好显示 2016 处非 PvP 来源');
    assert.ok(defaultList.every(s => s.isPvp === false), '默认列表中不能包含任何 isPvp 来源');

    // PvP 模式 (pvpOnly: true)
    const pvpList = filterSources(sources, { pvpOnly: true });
    assert.strictEqual(pvpList.length, 45, 'PvP 视图应正好显示 45 处 PvP 来源');
    assert.ok(pvpList.every(s => s.isPvp === true), 'PvP 列表中每一项必须都是 isPvp===true');

    // 联合其它筛选条件
    const pvpMissionList = filterSources(sources, { type: 'mission', pvpOnly: true });
    assert.strictEqual(pvpMissionList.length, 45);

    const pvpEnemyList = filterSources(sources, { type: 'enemy', pvpOnly: true });
    assert.strictEqual(pvpEnemyList.length, 0, 'PvP 模式下无敌人击杀来源');

    const defaultEnemyList = filterSources(sources, { type: 'enemy', pvpOnly: false });
    assert.ok(defaultEnemyList.length > 0, '默认视图应包含敌人击杀来源');
  });

  it('回归验证: 再次执行 build-data.mjs 后 isPvp 仍正确生成并保持一致', () => {
    // 执行数据重建命令
    const cmd = `node "${path.join(ROOT_DIR, 'scripts/build-data.mjs')}" --raw /workspace/wf-relic-cn-raw`;
    execSync(cmd, { stdio: 'pipe' });

    // 重新读取构建产物
    const freshSources = JSON.parse(fs.readFileSync(sourcesFile, 'utf8'));
    const freshMeta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));

    const pvpFresh = freshSources.filter(s => s.isPvp === true);
    const nonPvpFresh = freshSources.filter(s => s.isPvp === false);

    assert.strictEqual(pvpFresh.length, 45, '再次构建后 PvP 数量仍严格等于 45');
    assert.strictEqual(nonPvpFresh.length, 2016, '再次构建后非 PvP 数量仍严格等于 2016');
    assert.strictEqual(freshMeta.stats.pvpSources, 45, '再次构建后 meta.stats.pvpSources 仍为 45');
    assert.strictEqual(freshMeta.pvpSources, 45, '再次构建后 meta.pvpSources 仍为 45');

    // 验证 price 覆盖率未受损
    assert.strictEqual(freshMeta.prices.pricedCount, 2441);
    assert.strictEqual(freshMeta.prices.totalCount, 2453);
    assert.strictEqual(freshMeta.prices.coverage, '99.5%');
  });
});
