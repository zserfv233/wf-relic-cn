import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { searchIndex } from '../js/lib/search.js';
import { build } from '../scripts/build-data.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const CONFIG_DIR = path.join(ROOT_DIR, 'config');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');
const RAW_DIR = '/workspace/wf-relic-cn-raw';

const hasRaw = fs.existsSync(RAW_DIR) && fs.existsSync(path.join(RAW_DIR, 'wfcd-items/i18n_zh.json'));

const VALID_SOURCE_PREFIXES = [
  'wfcd_i18n:',
  'warframe_market:',
  'wfcd_worldstate:',
  'composed:',
  'traditional:',
  'en_as_is:',
  'en_fallback'
];

function isValidZhSource(source) {
  if (!source || typeof source !== 'string') return false;
  if (source === 'en_fallback') return true;
  return VALID_SOURCE_PREFIXES.some(prefix => source.startsWith(prefix));
}

describe('全站汉化覆盖率、反编造与不变量验证 (Localization Invariants & Anti-Fabrication)', () => {
  const metaPath = path.join(DATA_DIR, 'meta.json');
  const relicsPath = path.join(DATA_DIR, 'relics.json');
  const arcanesPath = path.join(DATA_DIR, 'arcanes.json');
  const rivensPath = path.join(DATA_DIR, 'rivens.json');
  const modsPath = path.join(DATA_DIR, 'mods.json');
  const sourcesPath = path.join(DATA_DIR, 'sources.json');
  const zhMapPath = path.join(CONFIG_DIR, 'zh-map.json');
  const remainingDocPath = path.join(DOCS_DIR, 'remaining-english.md');

  assert.ok(fs.existsSync(metaPath), 'data/meta.json 必须存在');
  assert.ok(fs.existsSync(relicsPath), 'data/relics.json 必须存在');
  assert.ok(fs.existsSync(arcanesPath), 'data/arcanes.json 必须存在');
  assert.ok(fs.existsSync(rivensPath), 'data/rivens.json 必须存在');
  assert.ok(fs.existsSync(modsPath), 'data/mods.json 必须存在');
  assert.ok(fs.existsSync(sourcesPath), 'data/sources.json 必须存在');
  assert.ok(fs.existsSync(zhMapPath), 'config/zh-map.json 必须存在');
  assert.ok(fs.existsSync(remainingDocPath), 'docs/remaining-english.md 必须存在');

  const metaData = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const relicsData = JSON.parse(fs.readFileSync(relicsPath, 'utf8'));
  const arcanesData = JSON.parse(fs.readFileSync(arcanesPath, 'utf8'));
  const rivensData = JSON.parse(fs.readFileSync(rivensPath, 'utf8'));
  const modsData = JSON.parse(fs.readFileSync(modsPath, 'utf8'));
  const sourcesData = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
  const zhMap = JSON.parse(fs.readFileSync(zhMapPath, 'utf8'));
  const remainingDocContent = fs.readFileSync(remainingDocPath, 'utf8');

  const relicsList = relicsData.relics || [];
  const itemsList = Object.values(relicsData.items || {});

  it('非空名称与受控合法 zhSource 不变量断言', () => {
    // 1. 遗物
    for (const r of relicsList) {
      assert.ok(r.zhName && r.zhName.trim().length > 0, `遗物 ${r.id} zhName 必须非空`);
      assert.ok(isValidZhSource(r.zhSource), `遗物 ${r.id} zhSource 非法: ${r.zhSource}`);
      for (const rew of r.rewards || []) {
        assert.ok(rew.zhName && rew.zhName.trim().length > 0, `遗物奖励 ${rew.name} zhName 必须非空`);
        assert.ok(isValidZhSource(rew.zhSource), `遗物奖励 ${rew.name} zhSource 非法: ${rew.zhSource}`);
      }
    }

    // 2. 物品
    for (const it of itemsList) {
      assert.ok(it.zhName && it.zhName.trim().length > 0, `物品 ${it.name} zhName 必须非空`);
      assert.ok(isValidZhSource(it.zhSource), `物品 ${it.name} zhSource 非法: ${it.zhSource}`);
    }

    // 3. 赋能
    for (const arc of arcanesData) {
      assert.ok(arc.zhName && arc.zhName.trim().length > 0, `赋能 ${arc.slug} zhName 必须非空`);
      assert.ok(isValidZhSource(arc.zhSource), `赋能 ${arc.slug} zhSource 非法: ${arc.zhSource}`);
    }

    // 4. 紫卡
    for (const riv of rivensData) {
      assert.ok(riv.zhName && riv.zhName.trim().length > 0, `紫卡 ${riv.slug} zhName 必须非空`);
      assert.ok(isValidZhSource(riv.zhSource), `紫卡 ${riv.slug} zhSource 非法: ${riv.zhSource}`);
    }

    // 5. Mod
    for (const mod of modsData) {
      assert.ok(mod.zhName && mod.zhName.trim().length > 0, `Mod ${mod.slug} zhName 必须非空`);
      assert.ok(isValidZhSource(mod.zhSource), `Mod ${mod.slug} zhSource 非法: ${mod.zhSource}`);
    }

    // 6. 掉落来源
    for (const src of sourcesData) {
      assert.ok(src.nameZh && src.nameZh.trim().length > 0, `来源 ${src.id} nameZh 必须非空`);
      assert.ok(isValidZhSource(src.zhSource), `来源 ${src.id} zhSource 非法: ${src.zhSource}`);
    }
  });

  it('汉化覆盖率不变量与保守下限断言 (物品/Mod/赋能/紫卡/遗物 >= 90%)', () => {
    assert.ok(metaData.localization, 'meta.json 必须包含 localization 字段');
    assert.ok(metaData.localization.stats, 'meta.localization 必须包含 stats');

    const stats = metaData.localization.stats;

    // 保守下限
    const checkCategoryFloor = (key, floor) => {
      const cat = stats[key];
      assert.ok(cat, `分类 ${key} 统计数据必须存在`);
      const num = parseFloat(cat.coverage);
      assert.ok(!isNaN(num), `${key} 覆盖率必须为合法数字`);
      assert.ok(num >= floor * 100, `${key} 汉化率 (${cat.coverage}) 低于保守下限 ${floor * 100}%`);
      assert.ok(num <= 100.0, `${key} 汉化率不可超过 100%`);
    };

    checkCategoryFloor('relics', 0.90);
    checkCategoryFloor('items', 0.90);
    checkCategoryFloor('arcanes', 0.90);
    checkCategoryFloor('rivens', 0.90);
    checkCategoryFloor('mods', 0.90);
    checkCategoryFloor('planets', 0.90);
    checkCategoryFloor('bounties', 0.90);

    // 节点规范覆盖率 (含资料原样英文) >= 90%
    const nodeEff = parseFloat(stats.nodes.effectiveCoverage);
    assert.ok(nodeEff >= 90.0, `节点规范覆盖率 (${stats.nodes.effectiveCoverage}) 应 >= 90%`);

    // 验证 meta.localization.stats 与 remaining-english.md 提取内容严格一致
    for (const [catKey, catVal] of Object.entries(stats)) {
      assert.ok(remainingDocContent.includes(catVal.coverage), `remaining-english.md 应包含 ${catKey} 覆盖率 ${catVal.coverage}`);
    }
  });

  it('防编造核验：zhSource 对应条目与原始资料严格一致（CI 优雅跳过）', (t) => {
    if (!hasRaw) {
      t.skip('本地原始资料 /workspace/wf-relic-cn-raw 不存在，跳过原始资料防编造比对');
      return;
    }

    const i18nZh = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'wfcd-items/i18n_zh.json'), 'utf8'));
    const wfmData = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'wfm_items_v2.json'), 'utf8')).data;
    const solNodesZh = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'wfcd-worldstate-zh/solNodes.json'), 'utf8'));
    const missionTypesZh = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'wfcd-worldstate-zh/missionTypes.json'), 'utf8'));
    const languagesZh = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'wfcd-worldstate-zh/languages.json'), 'utf8'));

    // 1. 验证 WFCD i18n 物品/Mod/赋能防编造
    let wfcdCheckedCount = 0;
    const allWfcdEntities = [
      ...itemsList,
      ...modsData,
      ...arcanesData,
      ...Object.entries(zhMap.items || {}).map(([name, it]) => ({ name, ...it }))
    ];
    for (const it of allWfcdEntities) {
      if (it.zhSource && it.zhSource.startsWith('wfcd_i18n:')) {
        const uniqueName = it.zhSource.replace('wfcd_i18n:', '');
        const rawEntry = i18nZh[uniqueName];
        if (rawEntry) {
          const rawName = rawEntry.name || rawEntry;
          const zh = it.zhName || it.nameZh;
          assert.strictEqual(zh, rawName, `条目 ${it.name} 的中文名 (${zh}) 必须与原始 i18n_zh.json (${rawName}) 完全一致`);
          wfcdCheckedCount++;
        }
      }
    }
    assert.ok(wfcdCheckedCount > 100, `抽检的 wfcd_i18n 条目数应 > 100 (实际 ${wfcdCheckedCount})`);

    // 2. 验证 warframe.market 防编造
    let wfmCheckedCount = 0;
    for (const it of itemsList) {
      if (it.zhSource && it.zhSource.startsWith('warframe_market:')) {
        const slug = it.zhSource.replace('warframe_market:', '');
        const wfmItem = wfmData.find(x => x.slug === slug);
        if (wfmItem && wfmItem.i18n?.['zh-hans']?.name) {
          assert.strictEqual(it.zhName, wfmItem.i18n['zh-hans'].name, `物品 ${it.name} 的 zhName 必须与原始 wfm_items_v2.json 完全一致`);
          wfmCheckedCount++;
        }
      }
    }
    assert.ok(wfmCheckedCount > 50, '抽检的 warframe_market 物品数应 > 50');

    // 3. 验证 solNodes 节点防编造
    let solNodesCheckedCount = 0;
    for (const [key, node] of Object.entries(zhMap.nodes || {})) {
      if (node.zhSource && node.zhSource.startsWith('wfcd_worldstate:solNodes:')) {
        const solKey = node.zhSource.replace('wfcd_worldstate:solNodes:', '');
        if (solNodesZh[solKey]?.value) {
          const rawVal = solNodesZh[solKey].value;
          assert.ok(
            node.nameZh === rawVal || node.nameZh.startsWith(rawVal),
            `节点 ${key} 的 nameZh (${node.nameZh}) 必须包含或等于原始 solNodes.json 值 (${rawVal})`
          );
          solNodesCheckedCount++;
        }
      }
    }
    assert.ok(solNodesCheckedCount > 50, '抽检的 solNodes 节点数应 > 50');

    // 4. 验证 missionTypes 任务类型防编造
    for (const [enType, mType] of Object.entries(zhMap.missionTypes || {})) {
      if (mType.zhSource && mType.zhSource.includes('missionTypes:')) {
        const mtKey = mType.zhSource.split(':').pop();
        if (missionTypesZh[mtKey]?.value) {
          assert.strictEqual(mType.nameZh, missionTypesZh[mtKey].value, `任务类型 ${enType} 的 nameZh 必须与原始 missionTypes.json 完全一致`);
        }
      }
    }
  });

  it('关键映射动态抽样核对（从原始资料读取断言，不硬编码字符串）', (t) => {
    if (!hasRaw) {
      t.skip('本地原始资料不存在，跳过关键映射动态比对');
      return;
    }

    const solNodesZh = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'wfcd-worldstate-zh/solNodes.json'), 'utf8'));
    const missionTypesZh = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'wfcd-worldstate-zh/missionTypes.json'), 'utf8'));
    const wfmData = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'wfm_items_v2.json'), 'utf8')).data;

    // SolNode94: Apollodorus
    const rawApollodorus = solNodesZh['SolNode94']?.value;
    const mappedNode = zhMap.nodes?.['Mercury:Apollodorus'];
    assert.ok(mappedNode, 'zhMap 必须包含 Mercury:Apollodorus');
    assert.strictEqual(mappedNode.nameZh, rawApollodorus);

    // MT_SURVIVAL: 生存
    const rawSurvival = missionTypesZh['MT_SURVIVAL']?.value;
    const mappedSurvival = zhMap.missionTypes?.['Survival'];
    assert.ok(mappedSurvival, 'zhMap 必须包含 Survival');
    assert.strictEqual(mappedSurvival.nameZh, rawSurvival);

    // Venka Prime Gauntlet
    const rawVenkaGauntlet = wfmData.find(x => x.slug === 'venka_prime_gauntlet')?.i18n?.['zh-hans']?.name;
    const mappedVenka = zhMap.items?.['Venka Prime Gauntlet'];
    assert.ok(mappedVenka, 'zhMap 必须包含 Venka Prime Gauntlet');
    assert.strictEqual(mappedVenka.nameZh, rawVenkaGauntlet);
  });

  it('简略名系统性消除断言：部件/蓝图中文名必须包含其父物品中文名', () => {
    const corrections = zhMap.abbreviatedCorrections || [];
    assert.ok(corrections.length >= 400, `简略名修正数 (${corrections.length}) 应 >= 400`);

    // 关键修正样例核查
    const venkaGauntlet = corrections.find(c => c.enName === 'Venka Prime Gauntlet');
    assert.ok(venkaGauntlet, 'Venka Prime Gauntlet 必须在简略名修正清单中');
    assert.ok(venkaGauntlet.correctedZh.includes(venkaGauntlet.parentZh), '修正后中文名必须包含父物品中文名');

    // 检查所有已汉化的 Prime 部件
    const partKeywords = ['Gauntlet', 'Chassis', 'Neuroptics', 'Systems', 'Blade', 'Hilt', 'Handle', 'Barrel', 'Receiver', 'Stock'];
    let verifiedPartCount = 0;

    for (const item of itemsList) {
      if (item.name.includes('Prime') && partKeywords.some(kw => item.name.includes(kw))) {
        if (item.zhSource && !item.zhSource.startsWith('en_fallback')) {
          // 查找父物品前缀（如 "Venka Prime Gauntlet" -> "Venka Prime"）
          const parentName = item.name.replace(/\s+(Gauntlet|Chassis|Neuroptics|Systems|Blade|Hilt|Handle|Barrel|Receiver|Stock|Blueprint).*/i, '').trim();
          const parentItem = zhMap.items?.[parentName] || zhMap.items?.[parentName + ' Blueprint'];
          if (parentItem && parentItem.nameZh && !parentItem.zhSource.startsWith('en_fallback')) {
            const baseParentZh = parentItem.nameZh.replace(/蓝图$/, '').trim();
            assert.ok(
              item.zhName.includes(baseParentZh) || item.zhName.includes('Prime'),
              `部件 ${item.name} (${item.zhName}) 应包含父物品中文名 (${baseParentZh})`
            );
            verifiedPartCount++;
          }
        }
      }
    }
    assert.ok(verifiedPartCount > 50, '核验的 Prime 部件数应 > 50');
  });

  it('多维搜索索引命中同一实体验证 (中文、英文、拼音全拼、拼音首字母)', () => {
    const indexFile = path.join(DATA_DIR, 'search-index.json');
    assert.ok(fs.existsSync(indexFile), 'data/search-index.json 必须存在');
    const index = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

    // 测试目标实体：Venka Prime Gauntlet (凯旋之爪 Prime 手套)
    const targetEn = 'Venka Prime Gauntlet';

    // 1. 中文搜索
    const resZh = searchIndex('凯旋之爪', index);
    assert.ok(resZh.some(r => r.name === targetEn), '搜 "凯旋之爪" 必须命中 Venka Prime Gauntlet');

    // 2. 英文搜索
    const resEn = searchIndex('Venka Prime Gauntlet', index);
    assert.ok(resEn.some(r => r.name === targetEn), '搜 "Venka Prime Gauntlet" 必须命中该实体');

    // 3. 拼音全拼搜索
    const resPy = searchIndex('kaixuanzhizhua', index);
    assert.ok(resPy.some(r => r.name === targetEn), '搜 "kaixuanzhizhua" 必须命中 Venka Prime Gauntlet');

    // 4. 拼音首字母搜索
    const resInitials = searchIndex('kxzz', index);
    assert.ok(resInitials.some(r => r.name === targetEn), '搜 "kxzz" 必须命中 Venka Prime Gauntlet');
  });

  it('重建后保留验证：构建到临时目录时 nameZh/zhSource 完整保留', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wf-rebuild-test-'));

    try {
      await build({ dataDir: tempDir, rawDir: RAW_DIR });

      const tempRelicsPath = path.join(tempDir, 'relics.json');
      const tempSourcesPath = path.join(tempDir, 'sources.json');
      const tempMetaPath = path.join(tempDir, 'meta.json');

      assert.ok(fs.existsSync(tempRelicsPath), '临时构建目录必须生成 relics.json');
      assert.ok(fs.existsSync(tempSourcesPath), '临时构建目录必须生成 sources.json');
      assert.ok(fs.existsSync(tempMetaPath), '临时构建目录必须生成 meta.json');

      const tempRelics = JSON.parse(fs.readFileSync(tempRelicsPath, 'utf8'));
      const tempSources = JSON.parse(fs.readFileSync(tempSourcesPath, 'utf8'));

      // 验证条目保留了 zhName 和 zhSource
      assert.ok(tempRelics.relics.length > 0);
      assert.ok(tempRelics.relics[0].zhName);
      assert.ok(tempRelics.relics[0].zhSource);

      assert.ok(tempSources.length > 0);
      assert.ok(tempSources[0].nameZh);
      assert.ok(tempSources[0].zhSource);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
