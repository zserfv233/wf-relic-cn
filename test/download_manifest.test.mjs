import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

import { REMOTE_FILES, REMOTE_URLS, build, validateWfmItems } from '../scripts/build-data.mjs';
import { RAW_DIR, hasRawFiles } from '../scripts/lib/raw-dir.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

describe('下载清单规范与原始文件完整性测试 (Download Manifest & Coverage)', () => {
  it('1. 不联网：断言 REMOTE_FILES 包含 de_droptables.html 且为必需，且 drops_all/Relics/zh 必需，wfm_items_v2 可降级', () => {
    assert.ok(REMOTE_FILES, 'REMOTE_FILES 常量必须成功导出');

    const manifestFiles = Object.values(REMOTE_FILES);
    const fileNames = manifestFiles.map(f => f.fileName);

    // 1.1 de_droptables.html 必须存在且必需
    assert.ok(fileNames.includes('de_droptables.html'), 'REMOTE_FILES 必须包含 de_droptables.html');
    const deEntry = REMOTE_FILES.de_droptables;
    assert.ok(deEntry, 'REMOTE_FILES 必须包含 key 为 de_droptables 的条目');
    assert.equal(deEntry.fileName, 'de_droptables.html');
    assert.equal(deEntry.url, 'https://www.warframe.com/droptables');
    assert.equal(deEntry.required, true, 'de_droptables.html 必须是必需文件 (required: true)');

    // 1.2 drops_all.json, Relics.json, zh.json 必须存在且必需
    assert.ok(fileNames.includes('drops_all.json'), 'REMOTE_FILES 必须包含 drops_all.json');
    assert.equal(REMOTE_FILES.drops_all?.required, true, 'drops_all.json 必须为必需文件');
    assert.equal(REMOTE_FILES.drops_all?.fileName, 'drops_all.json');

    assert.ok(fileNames.includes('Relics.json'), 'REMOTE_FILES 必须包含 Relics.json');
    assert.equal(REMOTE_FILES.relics?.required, true, 'Relics.json 必须为必需文件');
    assert.equal(REMOTE_FILES.relics?.fileName, 'Relics.json');

    assert.ok(fileNames.includes('zh.json'), 'REMOTE_FILES 必须包含 zh.json');
    assert.equal(REMOTE_FILES.zh?.required, true, 'zh.json 必须为必需文件');
    assert.equal(REMOTE_FILES.zh?.fileName, 'zh.json');

    // 1.3 wfm_items_v2.json 必须存在且允许降级 (required: false)，且必须声明 Language: 'zh-hans' 请求头
    assert.ok(fileNames.includes('wfm_items_v2.json'), 'REMOTE_FILES 必须包含 wfm_items_v2.json');
    assert.equal(REMOTE_FILES.wfm_items_v2?.required, false, 'wfm_items_v2.json 必须允许降级 (required: false)');
    assert.equal(REMOTE_FILES.wfm_items_v2?.fileName, 'wfm_items_v2.json');
    assert.equal(REMOTE_FILES.wfm_items_v2?.headers?.Language, 'zh-hans', "REMOTE_FILES.wfm_items_v2.headers.Language 必须为 'zh-hans'");

    // 1.4 REMOTE_URLS 保持对应 URL
    assert.equal(REMOTE_URLS.de_droptables, 'https://www.warframe.com/droptables');
    assert.equal(REMOTE_URLS.drops_all, 'https://drops.warframestat.us/data/all.json');
    assert.equal(REMOTE_URLS.relics, 'https://raw.githubusercontent.com/WFCD/warframe-items/master/data/json/Relics.json');
    assert.equal(REMOTE_URLS.zh, 'https://raw.githubusercontent.com/WFCD/warframe-items/master/data/json/i18n/zh.json');
    assert.equal(REMOTE_URLS.wfm_items_v2, 'https://api.warframe.market/v2/items');
  });

  it('2. 静态覆盖检查：build-data.mjs 引用的 raw 文件必须全部收录于下载清单', () => {
    const buildDataPath = path.join(ROOT_DIR, 'scripts', 'build-data.mjs');
    const buildDataCode = fs.readFileSync(buildDataPath, 'utf8');

    // 匹配 path.join(rawDir, '...') 或 path.join(rawDir, "...")
    const rawDirRegex = /path\.join\(\s*rawDir\s*,\s*['"]([^'"]+)['"]/g;
    const matches = Array.from(buildDataCode.matchAll(rawDirRegex));
    assert.ok(matches.length > 0, 'build-data.mjs 中必须包含对 rawDir 的引用');

    const manifestFileNames = new Set(Object.values(REMOTE_FILES).map(f => f.fileName));

    for (const match of matches) {
      const fileName = match[1];
      // 凡是 build-data.mjs 中使用 path.join(rawDir, '<文件>') 的无条件/条件降级输入，必须在清单内
      assert.ok(
        manifestFileNames.has(fileName),
        `scripts/build-data.mjs 中引用的 raw 文件 "${fileName}" 未收录于 REMOTE_FILES 清单`
      );
    }

    // 针对 de_droptables.html 进行特异性检查：
    // 虽然在 build() 中代码使用 fs.existsSync(htmlPath) 保护，但缺失会导致 Duviri 钢铁重复与 Recall: Ten-Zero 丢失，
    // 属于“存在才读但缺失会导致数据降级”的严重隐患项，必须在下载清单中且必需
    assert.ok(manifestFileNames.has('de_droptables.html'), 'de_droptables.html 必须在 REMOTE_FILES 中');
    assert.equal(REMOTE_FILES.de_droptables?.required, true, 'de_droptables.html 必须为必需文件');

    // 显式白名单验证：
    // scripts/build-zh-map.mjs 使用的原始资料（如 de-export/*, de-web/*, wfcd-*）仅在全量构建字典时使用，
    // 仓库已预置提交 config/zh-map.json，CI 重建无需也不应重新下载，列入显式白名单并注释说明。
    const ZH_MAP_RAW_WHITELIST = new Set([
      'wfcd-items',
      'wfcd-worldstate-zh',
      'wfcd-worldstate-en',
      'wfcd-worldstate-lang',
      'de-export',
      'de-web',
      'community'
    ]);

    const buildZhMapPath = path.join(ROOT_DIR, 'scripts', 'build-zh-map.mjs');
    const buildZhMapCode = fs.readFileSync(buildZhMapPath, 'utf8');
    const zhMapMatches = Array.from(buildZhMapCode.matchAll(rawDirRegex));

    for (const match of zhMapMatches) {
      const target = match[1];
      const inManifest = manifestFileNames.has(target);
      const inWhitelist = ZH_MAP_RAW_WHITELIST.has(target);
      assert.ok(
        inManifest || inWhitelist,
        `build-zh-map.mjs 引用的 raw 资源 "${target}" 必须在下载清单或白名单中`
      );
    }
  });

  it('3. 有 raw 时：使用仅含清单 5 个文件的临时 raw 目录重建，断言 sources/relics/rivens/arcanes/mods 完全一致', async (t) => {
    const manifestFileNames = ['drops_all.json', 'Relics.json', 'zh.json', 'wfm_items_v2.json', 'de_droptables.html'];
    if (!hasRawFiles(...manifestFileNames)) {
      t.skip(`本地缺少原始资料 (${manifestFileNames.join(', ')})，跳过隔离 raw 重建验证`);
      return;
    }

    const tempRawDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wf-raw-isolated-manifest-'));
    const tempDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wf-data-isolated-manifest-'));

    try {
      // 严格仅复制下载清单中声明的 5 个文件进入隔离 rawDir，杜绝读取任何其他本地 raw 目录
      for (const fileName of manifestFileNames) {
        const srcPath = path.join(RAW_DIR, fileName);
        fs.copyFileSync(srcPath, path.join(tempRawDir, fileName));
      }

      // 执行纯净构建，严格禁止网络下载，输出到临时数据目录（不污染正式 data/）
      await build({
        dataDir: tempDataDir,
        rawDir: tempRawDir,
        shouldDownload: false
      });

      // 读取临时产物与仓库基准数据
      const tempSources = JSON.parse(fs.readFileSync(path.join(tempDataDir, 'sources.json'), 'utf8'));
      const repoSources = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'sources.json'), 'utf8'));

      const tempRelics = JSON.parse(fs.readFileSync(path.join(tempDataDir, 'relics.json'), 'utf8'));
      const repoRelics = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'relics.json'), 'utf8'));

      const tempRivens = JSON.parse(fs.readFileSync(path.join(tempDataDir, 'rivens.json'), 'utf8'));
      const repoRivens = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'rivens.json'), 'utf8'));

      const tempArcanes = JSON.parse(fs.readFileSync(path.join(tempDataDir, 'arcanes.json'), 'utf8'));
      const repoArcanes = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'arcanes.json'), 'utf8'));

      const tempMods = JSON.parse(fs.readFileSync(path.join(tempDataDir, 'mods.json'), 'utf8'));
      const repoMods = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'mods.json'), 'utf8'));

      // 1. sources 的 id 集合与仓库 data/sources.json 完全一致
      const tempSourceIds = new Set(tempSources.map(s => s.id));
      const repoSourceIds = new Set(repoSources.map(s => s.id));
      assert.equal(
        tempSourceIds.size,
        repoSourceIds.size,
        `sources 数量必须完全一致 (临时构建: ${tempSourceIds.size}, 仓库基准: ${repoSourceIds.size})`
      );
      assert.deepEqual(
        Array.from(tempSourceIds).sort(),
        Array.from(repoSourceIds).sort(),
        'sources 的 id 集合与仓库 data/sources.json 必须完全一致'
      );

      // 2. 必须包含 5 个 event_recall_ten_zero_week_*
      for (let week = 1; week <= 5; week++) {
        const recallId = `event_recall_ten_zero_week_${week}`;
        assert.ok(tempSourceIds.has(recallId), `sources 必须包含历史活动来源: ${recallId}`);
      }

      // 3. relics/rivens/arcanes/mods 条目数一致
      assert.equal(tempRelics.relics.length, repoRelics.relics.length, 'relics 条目数必须一致');
      assert.equal(tempRivens.length, repoRivens.length, 'rivens 条目数必须一致');
      assert.equal(tempArcanes.length, repoArcanes.length, 'arcanes 条目数必须一致');
      assert.equal(tempMods.length, repoMods.length, 'mods 条目数必须一致');

      // 4. arcanes/rivens/mods/relics/sources 与仓库 data/ 对应文件 JSON 深相等
      assert.deepEqual(tempArcanes, repoArcanes, 'arcanes 与仓库 data/arcanes.json 必须深相等');
      assert.deepEqual(tempRivens, repoRivens, 'rivens 与仓库 data/rivens.json 必须深相等');
      assert.deepEqual(tempMods, repoMods, 'mods 与仓库 data/mods.json 必须深相等');
      assert.deepEqual(tempRelics, repoRelics, 'relics 与仓库 data/relics.json 必须深相等');
      assert.deepEqual(tempSources, repoSources, 'sources 与仓库 data/sources.json 必须深相等');
    } finally {
      fs.rmSync(tempRawDir, { recursive: true, force: true });
      fs.rmSync(tempDataDir, { recursive: true, force: true });
    }
  });

  it('4. validateWfmItems 纯函数校验：仅 en 的 fixture 拒绝，en+zh-hans fixture ratio=1 通过，空 data 拒绝', () => {
    // 4.1 断言 REMOTE_FILES.wfm_items_v2.headers.Language === 'zh-hans'
    assert.equal(REMOTE_FILES.wfm_items_v2?.headers?.Language, 'zh-hans');

    // 4.2 仅 en 的 fixture（构造 3 条）→ 抛错且错误信息写明缺少 zh-hans
    const enOnlyFixture = {
      data: [
        { slug: 'item_1', i18n: { en: { name: 'Item One' } } },
        { slug: 'item_2', i18n: { en: { name: 'Item Two' } } },
        { slug: 'item_3', i18n: { en: { name: 'Item Three' } } }
      ]
    };
    assert.throws(
      () => validateWfmItems(enOnlyFixture),
      /缺少 zh-hans，可能未带 Language 头/,
      '仅 en 的 fixture 必须抛错拒绝并写明“缺少 zh-hans，可能未带 Language 头”'
    );

    // 4.3 en+zh-hans fixture → ratio=1 通过
    const enZhFixture = {
      data: [
        { slug: 'item_1', i18n: { en: { name: 'Item One' }, 'zh-hans': { name: '物品一' } } },
        { slug: 'item_2', i18n: { en: { name: 'Item Two' }, 'zh-hans': { name: '物品二' } } },
        { slug: 'item_3', i18n: { en: { name: 'Item Three' }, 'zh-hans': { name: '物品三' } } }
      ]
    };
    const validResult = validateWfmItems(enZhFixture);
    assert.equal(validResult.total, 3);
    assert.equal(validResult.zhCount, 3);
    assert.equal(validResult.ratio, 1, 'en+zh-hans fixture 的 ratio 必须为 1');

    // 4.4 空 data → 拒绝
    assert.throws(
      () => validateWfmItems({ data: [] }),
      /缺少 zh-hans，可能未带 Language 头/,
      '空数组 data 必须抛错拒绝'
    );
    assert.throws(
      () => validateWfmItems({ data: null }),
      /缺少 zh-hans，可能未带 Language 头/
    );
    assert.throws(
      () => validateWfmItems({}),
      /缺少 zh-hans，可能未带 Language 头/
    );
    assert.throws(
      () => validateWfmItems(null),
      /缺少 zh-hans，可能未带 Language 头/
    );
  });

  it('5. 有 raw 时：对 RAW_DIR/wfm_items_v2.json 调 validateWfmItems (ratio >= 0.95)，去掉 zh-hans 重建时赋能汉化率 < 90% (回归哨兵)', async (t) => {
    const manifestFileNames = ['drops_all.json', 'Relics.json', 'zh.json', 'wfm_items_v2.json', 'de_droptables.html'];
    if (!hasRawFiles(...manifestFileNames)) {
      t.skip(`本地缺少原始资料 (${manifestFileNames.join(', ')})，跳过 wfm zh-hans 校验与回归哨兵测试`);
      return;
    }

    // 5.1 对 RAW_DIR/wfm_items_v2.json 调 validateWfmItems，ratio >= 0.95
    const rawWfmPath = path.join(RAW_DIR, 'wfm_items_v2.json');
    const rawWfmData = JSON.parse(fs.readFileSync(rawWfmPath, 'utf8'));
    const rawStats = validateWfmItems(rawWfmData);
    assert.ok(
      rawStats.ratio >= 0.95,
      `RAW_DIR/wfm_items_v2.json 的 zh-hans ratio (${(rawStats.ratio * 100).toFixed(2)}%) 必须 >= 0.95`
    );

    // 5.2 去掉 zh-hans 后的副本写到临时目录，与 drops_all.json, Relics.json, zh.json, de_droptables.html 一起用 build({ dataDir: tmp, rawDir: tmpRaw }) 重建
    const tempRawDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wf-raw-no-zh-manifest-'));
    const tempDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wf-data-no-zh-manifest-'));
    const remainingDocPath = path.join(ROOT_DIR, 'docs', 'remaining-english.md');
    const originalRemainingDoc = fs.existsSync(remainingDocPath) ? fs.readFileSync(remainingDocPath, 'utf8') : null;

    try {
      const otherFiles = ['drops_all.json', 'Relics.json', 'zh.json', 'de_droptables.html'];
      for (const fileName of otherFiles) {
        fs.copyFileSync(path.join(RAW_DIR, fileName), path.join(tempRawDir, fileName));
      }

      // 生成去掉 zh-hans 的 wfm 副本
      const wfmWithoutZh = {
        ...rawWfmData,
        data: rawWfmData.data.map(item => {
          if (!item?.i18n) return item;
          const { 'zh-hans': _, ...restI18n } = item.i18n;
          return {
            ...item,
            i18n: restI18n
          };
        })
      };
      fs.writeFileSync(path.join(tempRawDir, 'wfm_items_v2.json'), JSON.stringify(wfmWithoutZh));

      // 执行纯净构建，不写真实 data/
      await build({
        dataDir: tempDataDir,
        rawDir: tempRawDir,
        shouldDownload: false
      });

      // 读取临时 meta.json，断言赋能汉化率 < 90%
      const meta = JSON.parse(fs.readFileSync(path.join(tempDataDir, 'meta.json'), 'utf8'));
      const arcaneCoverageStr = meta.localization?.stats?.arcanes?.coverage;
      assert.ok(arcaneCoverageStr, 'meta.json 必须包含赋能汉化覆盖率统计');
      const arcaneCoverage = parseFloat(arcaneCoverageStr);
      assert.ok(
        arcaneCoverage < 90.0,
        `去掉 zh-hans 后赋能汉化率 (${arcaneCoverageStr}) 必须 < 90% (证明 zh-hans 是必需输入，回归哨兵生效)`
      );
    } finally {
      if (originalRemainingDoc !== null) {
        fs.writeFileSync(remainingDocPath, originalRemainingDoc, 'utf8');
      }
      fs.rmSync(tempRawDir, { recursive: true, force: true });
      fs.rmSync(tempDataDir, { recursive: true, force: true });
    }
  });
});
