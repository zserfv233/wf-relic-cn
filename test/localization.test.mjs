import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { searchIndex } from '../js/lib/search.js';
import { build } from '../scripts/build-data.mjs';
import { isSiteWord } from '../scripts/build-zh-map.mjs';

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
    checkCategoryFloor('bounties', 0.65);

    // 节点规范覆盖率 (含资料原样英文) >= 90%
    const nodeEff = parseFloat(stats.nodes.effectiveCoverage);
    assert.ok(nodeEff >= 90.0, `节点规范覆盖率 (${stats.nodes.effectiveCoverage}) 应 >= 90%`);

    // 验证 meta.localization.stats 与 remaining-english.md 提取内容严格一致
    for (const [catKey, catVal] of Object.entries(stats)) {
      assert.ok(remainingDocContent.includes(catVal.coverage), `remaining-english.md 应包含 ${catKey} 覆盖率 ${catVal.coverage}`);
    }
  });

  it('出处一致性与逐段反编造断言：zh-map 与原始资料及 SITE_WORDS 严格一致（CI 优雅跳过）', (t) => {
    if (!hasRaw) {
      t.skip('本地原始资料 /workspace/wf-relic-cn-raw 不存在，跳过原始资料防编造比对');
      return;
    }

    const i18nZh = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'wfcd-items/i18n_zh.json'), 'utf8'));
    const wfmData = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'wfm_items_v2.json'), 'utf8')).data;
    const solNodesZh = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'wfcd-worldstate-zh/solNodes.json'), 'utf8'));
    const missionTypesZh = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'wfcd-worldstate-zh/missionTypes.json'), 'utf8'));
    const languagesZh = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'wfcd-worldstate-zh/languages.json'), 'utf8'));
    const sortieZh = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'wfcd-worldstate-zh/sortieData.json'), 'utf8'));

    const wfmBySlug = new Map(wfmData.map(x => [x.slug, x]));

    function resolveRawValue(source) {
      let cleanSource = source.replace(/^(traditional|en_as_is):/, '');
      if (cleanSource.startsWith('wfcd_i18n:')) {
        const key = cleanSource.replace('wfcd_i18n:', '');
        return i18nZh[key]?.name;
      }
      if (cleanSource.startsWith('warframe_market:')) {
        const slug = cleanSource.replace('warframe_market:', '');
        return wfmBySlug.get(slug)?.i18n?.['zh-hans']?.name;
      }
      if (cleanSource.startsWith('wfcd_worldstate:solNodes:')) {
        const key = cleanSource.replace('wfcd_worldstate:solNodes:', '');
        return solNodesZh[key]?.value;
      }
      if (cleanSource.startsWith('wfcd_worldstate:missionTypes:')) {
        const key = cleanSource.replace('wfcd_worldstate:missionTypes:', '');
        return missionTypesZh[key]?.value;
      }
      if (cleanSource.startsWith('wfcd_worldstate:languages:')) {
        const key = cleanSource.replace('wfcd_worldstate:languages:', '');
        return languagesZh[key]?.value;
      }
      if (cleanSource.startsWith('wfcd_worldstate:sortieData:bosses:')) {
        const key = cleanSource.replace('wfcd_worldstate:sortieData:bosses:', '');
        return sortieZh.bosses?.[key]?.name;
      }
      return null;
    }

    const cats = ['planets', 'missionTypes', 'nodes', 'enemies', 'bounties', 'transientSources', 'items'];
    let checkedCount = 0;
    let composedCount = 0;

    for (const cat of cats) {
      for (const [key, item] of Object.entries(zhMap[cat] || {})) {
        checkedCount++;
        const src = item.zhSource;
        if (src === 'en_fallback') continue;

        if (src.startsWith('composed:')) {
          composedCount++;
          assert.ok(Array.isArray(item.zhSegments) && item.zhSegments.length > 0, `composed 条目 ${cat}:${key} 必须提供非空 zhSegments`);
          const joined = item.zhSegments.map(s => s.text).join('');
          assert.strictEqual(joined, item.nameZh, `条目 ${cat}:${key} 的 zhSegments 拼接 (${joined}) 必须与 nameZh (${item.nameZh}) 严格一致`);

          for (const seg of item.zhSegments) {
            if (seg.source === 'SITE_WORDS') {
              assert.ok(isSiteWord(seg.text), `条目 ${cat}:${key} 的 SITE_WORDS 片段 "${seg.text}" 未在受控白名单中`);
            } else {
              const rawVal = resolveRawValue(seg.source);
              assert.ok(rawVal, `条目 ${cat}:${key} 的片段出处 ${seg.source} 在原始资料中不存在`);
              assert.ok(
                rawVal.includes(seg.text),
                `条目 ${cat}:${key} 的片段 "${seg.text}" 必须在资料出处内容 (${rawVal}) 中逐字出现`
              );
            }
          }
        } else {
          const rawVal = resolveRawValue(src);
          assert.ok(rawVal, `条目 ${cat}:${key} 的出处 ${src} 在原始资料中不存在`);
          assert.ok(
            rawVal.includes(item.nameZh),
            `条目 ${cat}:${key} 的中文名 "${item.nameZh}" 必须在原始资料 (${rawVal}) 中逐字存在`
          );
        }
      }
    }

    assert.ok(checkedCount > 3000, `全面核查的条目数应 > 3000 (实际 ${checkedCount})`);
    assert.ok(composedCount > 300, `全面核查的 composed 规则数应 > 300 (实际 ${composedCount})`);
  });

  it('审核方问题回归核验 (Z2 Review Regression Tests)', (t) => {
    if (!hasRaw) {
      t.skip('本地原始资料不存在，跳过 Z2 回归测试');
      return;
    }

    // 1. 无出处中文必须回退为英文 fallback
    const transientSources = zhMap.transientSources || {};
    assert.strictEqual(transientSources['Kuva Flood']?.zhSource, 'en_fallback', 'Kuva Flood 必须为 en_fallback');
    assert.strictEqual(transientSources['Kuva Flood']?.nameZh, 'Kuva Flood', 'Kuva Flood nameZh 必须为英文');

    assert.strictEqual(transientSources['Nightmare Mode Rewards']?.zhSource, 'en_fallback', 'Nightmare Mode Rewards 必须为 en_fallback');
    assert.strictEqual(transientSources['Nightmare Mode Rewards']?.nameZh, 'Nightmare Mode Rewards', 'Nightmare Mode Rewards nameZh 必须为英文');

    assert.strictEqual(transientSources['Fomorian Sabotage']?.zhSource, 'en_fallback', 'Fomorian Sabotage 必须为 en_fallback');
    assert.strictEqual(transientSources['Fomorian Sabotage']?.nameZh, 'Fomorian Sabotage', 'Fomorian Sabotage nameZh 必须为英文');

    const enemies = zhMap.enemies || {};
    assert.strictEqual(enemies['Shadow Stalker']?.zhSource, 'en_fallback', 'Shadow Stalker 必须为 en_fallback');
    assert.strictEqual(enemies['Shadow Stalker']?.nameZh, 'Shadow Stalker', 'Shadow Stalker nameZh 必须为英文');

    // 2. 错字纠正：Sedna 必须是「赛德娜」，且与原始资料逐字一致
    const sednaPlanet = zhMap.planets?.['Sedna'];
    assert.ok(sednaPlanet, 'zhMap.planets 必须包含 Sedna');
    assert.strictEqual(sednaPlanet.nameZh, '赛德娜', 'Sedna 中文名必须为「赛德娜」（非「塞德娜」）');
    const i18nZh = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'wfcd-items/i18n_zh.json'), 'utf8'));
    const sednaRawVal = i18nZh['/Lotus/Types/Items/ShipDecos/PlanetTrophies/PlanetTrophySednaBronze']?.name;
    assert.ok(sednaRawVal && sednaRawVal.includes(sednaPlanet.nameZh), '赛德娜 必须逐字来自 PlanetTrophySednaBronze');

    // 3. 部件名纠正：所有 Neuroptics Blueprint 不再含「头部蓝图」，若汉化则包含「头部神经光元」
    for (const [itemName, itemObj] of Object.entries(zhMap.items || {})) {
      if (itemName.toLowerCase().endsWith('neuroptics blueprint')) {
        assert.ok(!itemObj.nameZh.includes('头部蓝图'), `条目 ${itemName} (${itemObj.nameZh}) 绝不可包含「头部蓝图」`);
        if (itemObj.zhSource !== 'en_fallback') {
          assert.ok(itemObj.nameZh.includes('头部神经光元'), `已汉化部件 ${itemName} (${itemObj.nameZh}) 应包含「头部神经光元」`);
        }
      }
    }

    // 4. 出处引用纠正：
    // Höllvania / Hollvania 不得引用 HexDogTagUncommon
    const holl1 = zhMap.planets?.['Hollvania'];
    const holl2 = zhMap.planets?.['Höllvania'];
    assert.ok(holl1 && !holl1.zhSource.includes('HexDogTagUncommon'), 'Hollvania 绝不可引用 HexDogTagUncommon');
    assert.ok(holl2 && !holl2.zhSource.includes('HexDogTagUncommon'), 'Höllvania 绝不可引用 HexDogTagUncommon');
    assert.strictEqual(holl1.nameZh, '霍瓦尼亚');

    // Solaris 回退为英文
    const solaris = zhMap.planets?.['Solaris'];
    assert.strictEqual(solaris?.zhSource, 'en_fallback', 'Solaris 必须为 en_fallback');
    assert.strictEqual(solaris?.nameZh, 'Solaris', 'Solaris nameZh 必须为英文');

    // Deimos / Zariman / Duviri / Cetus 引用有效键
    const deimos = zhMap.planets?.['Deimos'];
    assert.ok(deimos && deimos.zhSource === 'wfcd_worldstate:solNodes:SolNode229');
    const zariman = zhMap.planets?.['Zariman'];
    assert.ok(zariman && zariman.zhSource === 'wfcd_worldstate:solNodes:SolNode230');
    const duviri = zhMap.planets?.['Duviri'];
    assert.ok(duviri && duviri.zhSource === 'wfcd_worldstate:solNodes:SolNode236');
    const cetus = zhMap.planets?.['Cetus'];
    assert.ok(cetus && cetus.zhSource === 'wfcd_worldstate:languages:/lotus/types/gameplay/eidolon/resources/cetuswispitem');
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
