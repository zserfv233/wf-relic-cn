#!/usr/bin/env node
/**
 * scripts/build-zh-map.mjs
 * Warframe 全站汉化映射生成脚本
 * 仅从本地原始资料（/workspace/wf-relic-cn-raw）读取官方/开源译名，生成 config/zh-map.json
 * 严格遵循：绝不自行编造游戏译名，找不到保留英文。
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CONFIG_DIR = path.join(ROOT_DIR, 'config');

export function parseRawDir(customRaw) {
  if (customRaw) return path.resolve(customRaw);
  const args = process.argv.slice(2);
  let rawDir = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--raw' && args[i + 1]) {
      rawDir = path.resolve(args[i + 1]);
      i++;
    }
  }
  if (!rawDir) {
    const candidates = [
      '/workspace/wf-relic-cn-raw',
      path.join(ROOT_DIR, 'data', 'raw'),
      path.join(ROOT_DIR, 'raw')
    ];
    for (const cand of candidates) {
      if (fs.existsSync(cand) && fs.existsSync(path.join(cand, 'drops_all.json'))) {
        rawDir = cand;
        break;
      }
    }
    if (!rawDir) rawDir = '/workspace/wf-relic-cn-raw';
  }
  return rawDir;
}

export function readLooseJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    const cleaned = raw.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '');
    return JSON.parse(cleaned);
  }
}

// 常见部件后缀正则
export const COMPONENT_SUFFIX_REGEX = /\s+(Blueprint|Barrel|Receiver|Stock|Blade|Blades|Hilt|Handle|Gauntlet|Gauntlets|Boot|Boots|Chassis|Neuroptics|Systems|Chassis Blueprint|Neuroptics Blueprint|Systems Blueprint|Harness|Wings|Harness Blueprint|Wings Blueprint|Upper Limb|Lower Limb|Grip|String|Head|Ornament|Pouch|Stars|Guard|Buckle|Band|Chain|Carapace|Cerebrum|Motor|Heatsink|Sub-Cortex|Left Gauntlet|Right Gauntlet|Collar Blueprint)$/i;

// 受控文案词白名单（仅用于 composed 条目的界面修饰/结构词：整词 + 固定模板校验）
export const SITE_WORDS_VOCAB = new Set([
  '等级', '赏金', '阶段', '轮次', '特殊', '奖励'
]);

export function isSiteWord(text) {
  if (typeof text !== 'string') return false;
  const trimmed = text.trim();
  if (!trimmed) return false;

  // 必须只包含允许的 12 个汉字（来自六个词）以及数字、空格、括号、横杠
  // 严禁纯 ASCII（非空 ASCII 返回 false），严禁不在白名单的汉字
  const allowedChars = new Set(['等', '级', '赏', '金', '阶', '段', '轮', '次', '特', '殊', '奖', '励']);
  const chineseChars = trimmed.match(/[\u4e00-\u9fa5]/g);
  if (!chineseChars || chineseChars.length === 0) {
    return false;
  }
  for (const ch of chineseChars) {
    if (!allowedChars.has(ch)) return false;
  }

  // 1. 六个整词直接匹配
  if (SITE_WORDS_VOCAB.has(trimmed)) return true;

  // 2. 固定模板匹配：
  // 模板 1: 等级 {数值或区间}
  if (/^[\(（]?等级\s+\d+(\s*-\s*\d+)?[\)）]?$/.test(trimmed)) {
    return true;
  }

  // 模板 2: 阶段 {正整数}
  if (/^(?:-\s*)?阶段\s+[1-9]\d*$/.test(trimmed)) {
    return true;
  }

  // 模板 3: [轮次 {A/B/C}] 或 轮次 {A/B/C}
  if (/^\[?轮次\s+[A-C]\]?$/.test(trimmed)) {
    return true;
  }

  // 模板 4: （特殊） 或 (特殊)
  if (/^[（\(]特殊[）\)]$/.test(trimmed)) {
    return true;
  }

  // 任何随机重组（如 "奖等", "金赏", "级等"）或不在模板内的组合，均被严格拒收
  return false;
}

// 部件英文名到官方常见部件中文对照（严格带有本地原始资料出处）
export const STANDARD_PART_SOURCES = {
  'blueprint': { zh: '蓝图', source: 'warframe_market:zephyr_prime_chassis_blueprint' },
  'barrel': { zh: '枪管', source: 'warframe_market:fluctus_barrel' },
  'receiver': { zh: '枪机', source: 'warframe_market:strun_wraith_receiver' },
  'stock': { zh: '枪托', source: 'warframe_market:fluctus_stock' },
  'blade': { zh: '刀刃', source: 'warframe_market:kaszas_blade' },
  'blades': { zh: '爪刃', source: 'warframe_market:venka_prime_blades' },
  'hilt': { zh: '握柄', source: 'warframe_market:rathbone_handle' },
  'handle': { zh: '握柄', source: 'warframe_market:rathbone_handle' },
  'gauntlet': { zh: '手套', source: 'warframe_market:venka_prime_gauntlet' },
  'gauntlets': { zh: '手套', source: 'warframe_market:venka_prime_gauntlet' },
  'boot': { zh: '靴子', source: 'warframe_market:kogake_prime_boot' },
  'boots': { zh: '靴子', source: 'warframe_market:kogake_prime_boot' },
  'chassis': { zh: '机体', source: 'warframe_market:zephyr_prime_chassis_blueprint' },
  'chassis blueprint': { zh: '机体 蓝图', source: 'warframe_market:zephyr_prime_chassis_blueprint' },
  'neuroptics': { zh: '头部神经光元', source: 'wfcd_i18n:/Lotus/Types/Recipes/WarframeRecipes/AshHelmetComponent' },
  'neuroptics blueprint': { zh: '头部神经光元 蓝图', source: 'warframe_market:rhino_prime_neuroptics_blueprint' },
  'systems': { zh: '系统', source: 'warframe_market:loki_prime_systems_blueprint' },
  'systems blueprint': { zh: '系统 蓝图', source: 'warframe_market:loki_prime_systems_blueprint' },
  'harness': { zh: '外壳', source: 'warframe_market:helios_prime_carapace' },
  'harness blueprint': { zh: '外甲 蓝图', source: 'warframe_market:odonata_prime_harness_blueprint' },
  'wings': { zh: '机翼', source: 'warframe_market:amesha_wings' },
  'wings blueprint': { zh: '机翼 蓝图', source: 'warframe_market:odonata_prime_wings_blueprint' },
  'upper limb': { zh: '上弓臂', source: 'warframe_market:paris_prime_upper_limb' },
  'lower limb': { zh: '下弓臂', source: 'warframe_market:ballistica_prime_lower_limb' },
  'grip': { zh: '握把', source: 'warframe_market:ghoulsaw_grip' },
  'string': { zh: '弓弦', source: 'warframe_market:ballistica_prime_string' },
  'head': { zh: '锤头', source: 'warframe_market:wolf_sledge_head' },
  'ornament': { zh: '饰物', source: 'warframe_market:bo_prime_ornament' },
  'pouch': { zh: '镖袋', source: 'warframe_market:hikou_prime_pouch' },
  'stars': { zh: '星镖', source: 'warframe_market:hikou_prime_stars' },
  'guard': { zh: '护手', source: 'warframe_market:silva_and_aegis_prime_guard' },
  'buckle': { zh: '连接器', source: 'warframe_market:akbronco_prime_link' },
  'chain': { zh: '链条', source: 'warframe_market:ninkondi_prime_chain' },
  'motor': { zh: '马达', source: 'warframe_market:wolf_sledge_motor' },
  'collar blueprint': { zh: '项圈 蓝图', source: 'warframe_market:kavasa_prime_kubrow_collar_blueprint' }
};

export const STANDARD_PART_ZH = Object.fromEntries(
  Object.entries(STANDARD_PART_SOURCES).map(([k, v]) => [k, v.zh])
);

export async function buildZhMap(explicitRawDir = null) {
  const rawDir = parseRawDir(explicitRawDir);
  console.log(`[build-zh-map] 从 ${rawDir} 读取本地原始资料...`);

  if (!fs.existsSync(rawDir)) {
    throw new Error(`原始资料目录不存在: ${rawDir}`);
  }

  // 1. 读取 WFCD items 与 i18n
  const wfcdItemsDir = path.join(rawDir, 'wfcd-items');
  const i18nZhPath = path.join(wfcdItemsDir, 'i18n_zh.json');
  if (!fs.existsSync(i18nZhPath)) {
    throw new Error(`缺失 wfcd-items/i18n_zh.json: ${i18nZhPath}`);
  }
  const i18nZh = JSON.parse(fs.readFileSync(i18nZhPath, 'utf8'));

  const wfcdItemsByUniqueName = new Map();
  const wfcdItemsByEnName = new Map();
  const wfcdParentItemsByEn = new Map();

  const itemFiles = fs.readdirSync(wfcdItemsDir).filter(f => f.endsWith('.json') && f !== 'i18n_zh.json');
  for (const file of itemFiles) {
    const list = JSON.parse(fs.readFileSync(path.join(wfcdItemsDir, file), 'utf8'));
    if (!Array.isArray(list)) continue;
    for (const item of list) {
      if (item.uniqueName) {
        wfcdItemsByUniqueName.set(item.uniqueName, item);
      }
      if (item.name) {
        const enLower = item.name.toLowerCase().trim();
        if (!wfcdItemsByEnName.has(enLower)) {
          wfcdItemsByEnName.set(enLower, item);
        }
        // 如果是武器、战甲、守护等父实体，记录下来
        const cat = item.category || file.replace('.json', '');
        if (['Warframes', 'Primary', 'Secondary', 'Melee', 'Arch-Gun', 'Arch-Melee', 'Archwing', 'Sentinels', 'Pets'].includes(cat)) {
          const zh = i18nZh[item.uniqueName]?.name?.trim();
          if (zh) {
            wfcdParentItemsByEn.set(enLower, {
              name: item.name,
              zh,
              uniqueName: item.uniqueName,
              source: `wfcd_i18n:${item.uniqueName}`
            });
          }
        }
      }
    }
  }

  // 2. 读取 warframe.market v2 数据
  const wfmPath = path.join(rawDir, 'wfm_items_v2.json');
  const wfmBySlug = new Map();
  const wfmByEnName = new Map();
  if (fs.existsSync(wfmPath)) {
    const wfmData = JSON.parse(fs.readFileSync(wfmPath, 'utf8'));
    const wfmList = wfmData.data || (Array.isArray(wfmData) ? wfmData : []);
    for (const item of wfmList) {
      if (item.slug) wfmBySlug.set(item.slug, item);
      if (item.i18n?.en?.name) {
        wfmByEnName.set(item.i18n.en.name.toLowerCase().trim(), item);
      }
      // 记录父套装中文名
      if (item.slug && item.slug.endsWith('_set') && item.i18n?.['zh-hans']?.name) {
        const baseEn = item.i18n.en.name.replace(/\s+Set$/i, '').trim().toLowerCase();
        const baseZh = item.i18n['zh-hans'].name.replace(/\s*一套$/, '').replace(/\s*套装$/, '').trim();
        if (baseEn && baseZh && !wfcdParentItemsByEn.has(baseEn)) {
          wfcdParentItemsByEn.set(baseEn, {
            name: item.i18n.en.name.replace(/\s+Set$/i, ''),
            zh: baseZh,
            slug: item.slug,
            source: `warframe_market:${item.slug}`
          });
        }
      }
    }
  }

  // 3. 读取 WFCD worldstate (zh 与 en)
  const wsZhDir = path.join(rawDir, 'wfcd-worldstate-zh');
  const wsEnDir = path.join(rawDir, 'wfcd-worldstate-en');

  const solNodesZh = JSON.parse(fs.readFileSync(path.join(wsZhDir, 'solNodes.json'), 'utf8'));
  const solNodesEn = JSON.parse(fs.readFileSync(path.join(wsEnDir, 'solNodes.json'), 'utf8'));

  const missionTypesZh = JSON.parse(fs.readFileSync(path.join(wsZhDir, 'missionTypes.json'), 'utf8'));
  const missionTypesEn = JSON.parse(fs.readFileSync(path.join(wsEnDir, 'missionTypes.json'), 'utf8'));

  const languagesZh = JSON.parse(fs.readFileSync(path.join(wsZhDir, 'languages.json'), 'utf8'));
  const languagesEn = JSON.parse(fs.readFileSync(path.join(wsEnDir, 'languages.json'), 'utf8'));

  const sortieZh = JSON.parse(fs.readFileSync(path.join(wsZhDir, 'sortieData.json'), 'utf8'));
  const sortieEn = JSON.parse(fs.readFileSync(path.join(wsEnDir, 'sortieData.json'), 'utf8'));

  // languages 英文键反查表
  const languagesByEnValue = new Map();
  for (const [key, valObj] of Object.entries(languagesEn)) {
    if (valObj?.value && languagesZh[key]?.value) {
      const enVal = valObj.value.trim().toLowerCase();
      if (!languagesByEnValue.has(enVal)) {
        languagesByEnValue.set(enVal, { key, en: valObj.value, zh: languagesZh[key].value.trim() });
      }
    }
  }

  // sortie 敌人反查表
  const sortieBossesByEn = new Map();
  for (const [key, bossObj] of Object.entries(sortieEn.bosses || {})) {
    if (bossObj?.name && sortieZh.bosses?.[key]?.name) {
      sortieBossesByEn.set(bossObj.name.toLowerCase().trim(), {
        key,
        en: bossObj.name,
        zh: sortieZh.bosses[key].name.trim()
      });
    }
  }

  // 4. 读取 drops_all.json 与 Relics.json
  const dropsAll = JSON.parse(fs.readFileSync(path.join(rawDir, 'drops_all.json'), 'utf8'));
  const relicsAll = JSON.parse(fs.readFileSync(path.join(rawDir, 'Relics.json'), 'utf8'));

  // 补充：从 Relics.json 与 Components.json 恢复部件的全名 -> uniqueName 索引
  const itemMetaByEn = new Map();
  for (const r of relicsAll) {
    for (const rew of r.rewards || []) {
      if (rew.item?.name && rew.item?.uniqueName) {
        const enLower = rew.item.name.toLowerCase().trim();
        if (!itemMetaByEn.has(enLower)) {
          itemMetaByEn.set(enLower, {
            name: rew.item.name,
            uniqueName: rew.item.uniqueName,
            wfmSlug: rew.item.warframeMarket?.urlName
          });
        }
      }
    }
  }

  const compsListPath = path.join(wfcdItemsDir, 'Components.json');
  if (fs.existsSync(compsListPath)) {
    const compsList = JSON.parse(fs.readFileSync(compsListPath, 'utf8'));
    for (const c of compsList) {
      for (const d of c.drops || []) {
        if (d.type && d.type !== c.name) {
          const enLower = d.type.toLowerCase().trim();
          if (!itemMetaByEn.has(enLower)) {
            itemMetaByEn.set(enLower, {
              name: d.type,
              uniqueName: c.uniqueName,
              parentUniqueNames: c.parentUniqueNames,
              wfmSlug: c.warframeMarket?.urlName
            });
          }
        }
      }
    }
  }

  // 5. 读取 t2s-words.json
  const t2sPath = path.join(CONFIG_DIR, 't2s-words.json');
  const t2sData = fs.existsSync(t2sPath) ? JSON.parse(fs.readFileSync(t2sPath, 'utf8')) : { entries: [] };
  const t2sMissionMap = new Map();
  const t2sPlanetMap = new Map();
  const t2sEnemyMap = new Map();
  for (const entry of (t2sData.entries || [])) {
    if (entry.scope === 'missionTypes') {
      t2sMissionMap.set(entry.traditional, entry);
    } else if (entry.scope === 'nodes(planet part)') {
      t2sPlanetMap.set(entry.traditional, entry);
    } else if (entry.scope === 'enemies') {
      t2sEnemyMap.set(entry.traditional, entry);
    }
  }

  // 6. 读取 DE ExportRegions (zh 与 en)
  const deRegionsZhPath = path.join(rawDir, 'de-export', 'ExportRegions_zh.json');
  const deRegionsEnPath = path.join(rawDir, 'de-export', 'ExportRegions_en.json');
  let deRegionsZhMap = new Map();
  let deRegionsEnMap = new Map();
  if (fs.existsSync(deRegionsZhPath) && fs.existsSync(deRegionsEnPath)) {
    const rZh = readLooseJson(deRegionsZhPath).ExportRegions || [];
    const rEn = readLooseJson(deRegionsEnPath).ExportRegions || [];
    deRegionsZhMap = new Map(rZh.map(x => [x.uniqueName, x]));
    deRegionsEnMap = new Map(rEn.map(x => [x.uniqueName, x]));
  }

  // 7. 读取 DE ExportFlavour (zh 与 en)
  const deFlavourZhPath = path.join(rawDir, 'de-export', 'ExportFlavour_zh.json');
  const deFlavourEnPath = path.join(rawDir, 'de-export', 'ExportFlavour_en.json');
  let deFlavourGlyphs = new Map();
  if (fs.existsSync(deFlavourZhPath) && fs.existsSync(deFlavourEnPath)) {
    const fZh = readLooseJson(deFlavourZhPath).ExportFlavour || [];
    const fEn = readLooseJson(deFlavourEnPath).ExportFlavour || [];
    const fZhMap = new Map(fZh.map(x => [x.uniqueName, x]));
    for (const enItem of fEn) {
      const zhItem = fZhMap.get(enItem.uniqueName);
      if (!enItem.name || !zhItem?.name) continue;
      const enName = enItem.name.trim();
      const zhName = zhItem.name.trim();
      if (enName.endsWith(' Glyph') && zhName.endsWith('浮印')) {
        const enemyPart = enName.slice(0, -6).trim();
        const zhPrefix = zhName.replace(/\s*浮印$/, '').trim();
        const lower = enemyPart.toLowerCase();
        if (!deFlavourGlyphs.has(lower)) deFlavourGlyphs.set(lower, []);
        deFlavourGlyphs.get(lower).push({
          uniqueName: enItem.uniqueName,
          enGlyph: enName,
          zhGlyph: zhName,
          enemyPartEn: enemyPart,
          zhCandidate: zhPrefix
        });
      }
    }
  }

  // ----------------------------------------------------
  // A. 构建 Planets 映射
  // ----------------------------------------------------
  console.log('[build-zh-map] 正在构建星球映射 (planets)...');
  const planetsMap = {};
  
  const rawPlanetsDefs = [
    { en: 'Mercury', zh: '水星', source: 'wfcd_worldstate:solNodes:SolNode12' },
    { en: 'Venus', zh: '金星', source: 'wfcd_worldstate:solNodes:SolNode2' },
    { en: 'Earth', zh: '地球', source: 'wfcd_worldstate:solNodes:SolNode15' },
    { en: 'Mars', zh: '火星', source: 'wfcd_worldstate:solNodes:SolNode11' },
    { en: 'Jupiter', zh: '木星', source: 'wfcd_worldstate:solNodes:SolNode10' },
    { en: 'Saturn', zh: '土星', source: 'wfcd_worldstate:solNodes:SolNode7' },
    { en: 'Uranus', zh: '天王星', source: 'wfcd_worldstate:solNodes:SolNode3' },
    { en: 'Neptune', zh: '海王星', source: 'wfcd_worldstate:solNodes:SolNode1' },
    { en: 'Pluto', zh: '冥王星', source: 'wfcd_worldstate:solNodes:SolNode4' },
    { en: 'Ceres', zh: '谷神星', source: 'wfcd_i18n:/Lotus/Types/Items/ShipDecos/PlanetTrophies/PlanetTrophyCeresBronze' },
    { en: 'Eris', zh: '阋神星', source: 'wfcd_worldstate:solNodes:ErisHUB' },
    { en: 'Sedna', zh: '赛德娜', source: 'wfcd_i18n:/Lotus/Types/Items/ShipDecos/PlanetTrophies/PlanetTrophySednaBronze' },
    { en: 'Europa', zh: '欧罗巴', source: 'wfcd_i18n:/Lotus/Types/Items/ShipDecos/PlanetTrophies/PlanetTrophyEuropaBronze' },
    { en: 'Void', zh: '虚空', source: 'wfcd_worldstate:solNodes:SolNode400' },
    { en: 'Phobos', zh: '火卫一', source: 'wfcd_i18n:/Lotus/Types/Items/ShipDecos/PlanetTrophies/PlanetTrophyPhobosBronze' },
    { en: 'Deimos', zh: '火卫二', source: 'wfcd_worldstate:solNodes:SolNode229' },
    { en: 'Lua', zh: '月球', source: 'wfcd_worldstate:solNodes:SolNode304' },
    { en: 'Kuva Fortress', zh: '赤毒要塞', source: 'wfcd_i18n:/Lotus/Types/Items/ShipDecos/PlanetTrophies/PlanetTrophyKuvaFortressBronze' },
    { en: 'KuvaFortress', zh: '赤毒要塞', source: 'wfcd_i18n:/Lotus/Types/Items/ShipDecos/PlanetTrophies/PlanetTrophyKuvaFortressBronze' },
    { en: 'Sanctuary', zh: '圣殿', source: 'wfcd_worldstate:languages:/lotus/types/challenges/seasons/weekly/seasonweeklysimarisscan' },
    { en: 'Veil Proxima', zh: '面纱', source: 'wfcd_worldstate:solNodes:CrewBattleNode505' },
    { en: 'Zariman', zh: '扎里曼', source: 'wfcd_worldstate:solNodes:SolNode230' },
    { en: 'Duviri', zh: '双衍王境', source: 'wfcd_worldstate:solNodes:SolNode236' },
    { en: 'Höllvania', zh: '霍瓦尼亚', source: 'wfcd_i18n:/Lotus/Types/Gameplay/1999Wf/Resources/1999ResourceCommonB' },
    { en: 'Hollvania', zh: '霍瓦尼亚', source: 'wfcd_i18n:/Lotus/Types/Gameplay/1999Wf/Resources/1999ResourceCommonB' },
    { en: 'Cetus', zh: '希图斯', source: 'wfcd_worldstate:languages:/lotus/types/gameplay/eidolon/resources/cetuswispitem' },
    {
      en: 'Solaris',
      zh: '索拉里斯',
      source: 'decision:codex_1126b_item3:solaris',
      rule: 'derivation:strip_suffix',
      evidence: {
        decision: 'Codex 1126b 第 3 项决定',
        flavourSource: 'de_export:ExportFlavour_zh:/Lotus/Types/StoreItems/AvatarImages/TennoCon2023BestWorkmanshipAwardGlyph',
        flavourQuote: '索拉里斯工艺奖浮印',
        i18nSource: 'wfcd_i18n:/Lotus/Types/Challenges/Seasons/WeeklyHard/SeasonWeeklyHardThePriceOfFreedom',
        i18nQuote: '索拉里斯人',
        derivation: '派生：从“索拉里斯工艺奖浮印”及“索拉里斯人”提取专名“索拉里斯”'
      },
      aliases: ['Solaris']
    },
    {
      en: 'Dark Refractory, Deimos',
      zh: 'Dark Refractory, 火卫二',
      source: 'composed:en_node+planet:Deimos',
      zhSegments: [
        { text: 'Dark Refractory, ', source: 'original_en' },
        { text: '火卫二', source: 'wfcd_worldstate:solNodes:SolNode229' }
      ]
    }
  ];

  for (const p of rawPlanetsDefs) {
    planetsMap[p.en] = {
      nameZh: p.zh,
      zhSource: p.source,
      ...(p.zhSegments ? { zhSegments: p.zhSegments } : {}),
      ...(p.evidence ? { evidence: p.evidence } : {}),
      ...(p.rule ? { rule: p.rule } : {})
    };
  }

  // ----------------------------------------------------
  // B. 构建 MissionTypes 映射
  // ----------------------------------------------------
  console.log('[build-zh-map] 正在构建任务类型映射 (missionTypes)...');
  const missionTypesMap = {};

  const mtByEnValue = new Map();
  for (const [key, valObj] of Object.entries(missionTypesEn)) {
    if (valObj?.value && missionTypesZh[key]?.value) {
      mtByEnValue.set(valObj.value.toLowerCase().trim(), {
        key,
        en: valObj.value,
        zh: missionTypesZh[key].value.trim()
      });
    }
  }

  const allGameModes = new Set();
  for (const planetNodes of Object.values(dropsAll.missionRewards || {})) {
    for (const nodeData of Object.values(planetNodes || {})) {
      if (nodeData.gameMode) allGameModes.add(nodeData.gameMode);
    }
  }

  for (const gm of allGameModes) {
    const gmLower = gm.toLowerCase().trim();
    let match = mtByEnValue.get(gmLower);
    if (!match && gmLower === 'exterminate') {
      match = mtByEnValue.get('extermination');
    }

    if (match) {
      const isTrad = t2sMissionMap.has(match.zh);
      const isAsIs = match.zh.toLowerCase() === match.en.toLowerCase();
      const upstreamSource = `wfcd_worldstate:missionTypes:${match.key}`;
      if (isTrad) {
        const t2sEntry = t2sMissionMap.get(match.zh);
        missionTypesMap[gm] = {
          nameZh: t2sEntry.simplified,
          zhRaw: t2sEntry.traditional,
          zhSource: upstreamSource,
          zhTransform: 'traditional_to_simplified',
          isAsIs: false
        };
      } else if (isAsIs) {
        missionTypesMap[gm] = {
          nameZh: match.zh,
          zhSource: `en_as_is:${upstreamSource}`,
          isAsIs: true
        };
      } else {
        missionTypesMap[gm] = {
          nameZh: match.zh,
          zhSource: upstreamSource,
          isAsIs: false
        };
      }
    } else {
      missionTypesMap[gm] = {
        nameZh: gm,
        zhSource: 'en_fallback',
        isAsIs: false
      };
    }
  }

  // ----------------------------------------------------
  // C. 构建 Nodes 映射
  // ----------------------------------------------------
  console.log('[build-zh-map] 正在构建节点映射 (nodes)...');
  const nodesMap = {};

  const solNodesByPlanetNode = new Map();
  const solNodesByNodeName = new Map();

  for (const [key, enObj] of Object.entries(solNodesEn)) {
    if (!enObj.value) continue;
    const zhVal = solNodesZh[key]?.value?.trim() || enObj.value;
    const m = enObj.value.match(/^(.+?)\s*\((.+?)\)$/);
    if (m) {
      const nodePart = m[1].trim();
      const planetPart = m[2].trim();
      const mapKey = `${planetPart.toLowerCase()}:${nodePart.toLowerCase()}`;
      const info = { key, enVal: enObj.value, zhVal, nodePart, planetPart };
      solNodesByPlanetNode.set(mapKey, info);
      if (!solNodesByNodeName.has(nodePart.toLowerCase())) {
        solNodesByNodeName.set(nodePart.toLowerCase(), info);
      }
    } else {
      solNodesByNodeName.set(enObj.value.toLowerCase().trim(), {
        key, enVal: enObj.value, zhVal, nodePart: enObj.value, planetPart: null
      });
    }
  }

  for (const [planet, planetNodes] of Object.entries(dropsAll.missionRewards || {})) {
    const planetZh = planetsMap[planet]?.nameZh || planet;
    for (const [node, nodeData] of Object.entries(planetNodes || {})) {
      const key = `${planet}:${node}`;
      const cleanNode = node.replace(/\s*\((Caches|Extra|Resource)\)\s*/i, '').trim();
      const suffixMatch = node.match(/\s*\((Caches|Extra|Resource)\)\s*/i);
      const suffix = suffixMatch ? suffixMatch[0].trim() : '';

      const lookupKey = `${planet.toLowerCase()}:${cleanNode.toLowerCase()}`;
      const solMatch = solNodesByPlanetNode.get(lookupKey) || solNodesByNodeName.get(cleanNode.toLowerCase());

      // 核对 DE ExportRegions: 按 SolNode ID (uniqueName) 对齐
      let deAligned = false;
      let deZhObj = null;
      let deEnObj = null;

      if (solMatch) {
        deEnObj = deRegionsEnMap.get(solMatch.key);
        deZhObj = deRegionsZhMap.get(solMatch.key);
        if (deEnObj && deZhObj) {
          // 核对 en 记录的 name 与 systemName 与掉落表的节点/星球一致，不一致就不用
          const nameMatches = deEnObj.name.trim().toLowerCase() === cleanNode.toLowerCase();
          const sysMatches = deEnObj.systemName.trim().toLowerCase() === planet.toLowerCase();
          if (nameMatches && sysMatches) {
            deAligned = true;
          }
        }
      }

      if (deAligned) {
        // 使用 DE ExportRegions 官方译名
        const baseZh = deZhObj.name;
        const zhSource = `de_export:ExportRegions_zh:${solMatch.key}`;
        if (suffix) {
          nodesMap[key] = {
            nameZh: `${baseZh} ${suffix}`,
            zhSource: `composed:solNode+suffix:${solMatch.key}`,
            zhSegments: [
              { text: baseZh, source: zhSource },
              { text: ` ${suffix}`, source: 'original_en' }
            ],
            solNodeKey: solMatch.key,
            isAsIs: false,
            deAligned: true
          };
        } else {
          nodesMap[key] = {
            nameZh: baseZh,
            zhSource,
            solNodeKey: solMatch.key,
            isAsIs: false,
            deAligned: true
          };
        }
      } else if (solMatch) {
        // 未在 DE 对齐，但有上游 WFCD solNodeKey：保留上游原样英文/WFCD 记录 (as-is)
        // 检查星球部分是否在繁->简转换表 (Item 1)
        let nodeNameZh = solMatch.zhVal;
        let zhRaw = null;
        let zhTransform = null;

        for (const [trad, t2s] of t2sPlanetMap.entries()) {
          if (nodeNameZh.includes(trad)) {
            zhRaw = nodeNameZh;
            nodeNameZh = nodeNameZh.replace(new RegExp(trad, 'g'), t2s.simplified);
            zhTransform = 'traditional_to_simplified';
          }
        }

        const upstreamSource = `wfcd_worldstate:solNodes:${solMatch.key}`;
        if (suffix) {
          nodesMap[key] = {
            nameZh: `${nodeNameZh} ${suffix}`,
            ...(zhRaw ? { zhRaw: `${zhRaw} ${suffix}`, zhTransform } : {}),
            zhSource: `composed:solNode+suffix:${solMatch.key}`,
            zhSegments: [
              { text: nodeNameZh, source: upstreamSource, ...(zhRaw ? { zhRaw, zhTransform } : {}) },
              { text: ` ${suffix}`, source: 'original_en' }
            ],
            solNodeKey: solMatch.key,
            isAsIs: true,
            deAligned: false
          };
        } else {
          nodesMap[key] = {
            nameZh: nodeNameZh,
            ...(zhRaw ? { zhRaw, zhTransform } : {}),
            zhSource: upstreamSource,
            solNodeKey: solMatch.key,
            isAsIs: true,
            deAligned: false
          };
        }
      } else {
        // 无 solNodeKey 的 60 个节点：本站回退 (fallback)
        const pDef = planetsMap[planet];
        const composedZh = `${cleanNode} (${planetZh})${suffix ? ` ${suffix}` : ''}`;
        let zhSegments = [];
        if (pDef?.zhSegments) {
          zhSegments = [
            { text: `${cleanNode} (`, source: 'original_en' },
            ...pDef.zhSegments,
            { text: `)${suffix ? ` ${suffix}` : ''}`, source: 'original_en' }
          ];
        } else {
          zhSegments = [
            { text: `${cleanNode} (`, source: 'original_en' },
            { text: planetZh, source: pDef?.zhSource || 'en_fallback' },
            { text: `)${suffix ? ` ${suffix}` : ''}`, source: 'original_en' }
          ];
        }
        nodesMap[key] = {
          nameZh: composedZh,
          zhSource: `composed:en_node+planet:${planet}`,
          zhSegments,
          solNodeKey: null,
          isAsIs: false,
          fallback: true,
          deAligned: false
        };
      }
    }
  }

  // ----------------------------------------------------
  // D. 构建 Enemies 映射 (含 Eidolon、Acolyte、Bosses 等)
  // ----------------------------------------------------
  console.log('[build-zh-map] 正在构建敌人映射 (enemies)...');
  const enemiesMap = {};

  const SPECIAL_ENEMIES_ZH = {
    'eidolon teralyst': {
      zh: '夜灵兆力使',
      source: 'wfcd_i18n:/Lotus/Types/Items/ShipDecos/Vignettes/Enemies/TeralystAFItem',
      rawName: '夜灵兆力使可动模型',
      uniqueName: '/Lotus/Types/Items/ShipDecos/Vignettes/Enemies/TeralystAFItem',
      rule: 'strip_suffix:可动模型'
    },
    'eidolon gantulyst': {
      zh: '夜灵巨力使',
      source: 'wfcd_i18n:/Lotus/Types/Items/ShipDecos/Vignettes/Enemies/TeralystBigAFItem',
      rawName: '夜灵巨力使可动模型',
      uniqueName: '/Lotus/Types/Items/ShipDecos/Vignettes/Enemies/TeralystBigAFItem',
      rule: 'strip_suffix:可动模型'
    },
    'eidolon hydrolyst': {
      zh: '夜灵水力使',
      source: 'wfcd_i18n:/Lotus/Types/Items/ShipDecos/Vignettes/Enemies/TeralystRainAFItem',
      rawName: '夜灵水力使可动模型',
      uniqueName: '/Lotus/Types/Items/ShipDecos/Vignettes/Enemies/TeralystRainAFItem',
      rule: 'strip_suffix:可动模型'
    },
    'eidolon teralyst (special)': {
      zh: '夜灵兆力使（特殊）',
      source: 'composed:eidolon+special:wfcd_i18n:/Lotus/Types/Items/ShipDecos/Vignettes/Enemies/TeralystAFItem',
      rawName: '夜灵兆力使可动模型',
      uniqueName: '/Lotus/Types/Items/ShipDecos/Vignettes/Enemies/TeralystAFItem',
      rule: 'strip_suffix:可动模型',
      zhSegments: [
        {
          text: '夜灵兆力使',
          source: 'wfcd_i18n:/Lotus/Types/Items/ShipDecos/Vignettes/Enemies/TeralystAFItem',
          rawName: '夜灵兆力使可动模型',
          rule: 'strip_suffix:可动模型'
        },
        { text: '（特殊）', source: 'site_word' }
      ]
    },
    'eidolon gantulyst (special)': {
      zh: '夜灵巨力使（特殊）',
      source: 'composed:eidolon+special:wfcd_i18n:/Lotus/Types/Items/ShipDecos/Vignettes/Enemies/TeralystBigAFItem',
      rawName: '夜灵巨力使可动模型',
      uniqueName: '/Lotus/Types/Items/ShipDecos/Vignettes/Enemies/TeralystBigAFItem',
      rule: 'strip_suffix:可动模型',
      zhSegments: [
        {
          text: '夜灵巨力使',
          source: 'wfcd_i18n:/Lotus/Types/Items/ShipDecos/Vignettes/Enemies/TeralystBigAFItem',
          rawName: '夜灵巨力使可动模型',
          rule: 'strip_suffix:可动模型'
        },
        { text: '（特殊）', source: 'site_word' }
      ]
    },
    'eidolon hydrolyst (special)': {
      zh: '夜灵水力使（特殊）',
      source: 'composed:eidolon+special:wfcd_i18n:/Lotus/Types/Items/ShipDecos/Vignettes/Enemies/TeralystRainAFItem',
      rawName: '夜灵水力使可动模型',
      uniqueName: '/Lotus/Types/Items/ShipDecos/Vignettes/Enemies/TeralystRainAFItem',
      rule: 'strip_suffix:可动模型',
      zhSegments: [
        {
          text: '夜灵水力使',
          source: 'wfcd_i18n:/Lotus/Types/Items/ShipDecos/Vignettes/Enemies/TeralystRainAFItem',
          rawName: '夜灵水力使可动模型',
          rule: 'strip_suffix:可动模型'
        },
        { text: '（特殊）', source: 'site_word' }
      ]
    },
    
    'stalker': { zh: '追猎者', source: 'wfcd_i18n:/Lotus/Interface/Graphics/CustomUI/Backgrounds/StalkerBackground', rule: 'exact_match:i18n' },
    'shadow stalker': { zh: 'Shadow Stalker', source: 'en_fallback' },
    'protector stalker': { zh: '卫护追猎者', source: 'wfcd_i18n:/Lotus/Types/Items/ShipDecos/Plushies/PlushyProtectorStalker', rule: 'exact_match:i18n' },

    'profit-taker': { zh: '利润收割者', source: 'wfcd_worldstate:languages:/lotus/types/challenges/seasons/weeklyhard/seasonweeklyhardfriendsprofittaker', rule: 'exact_match:languages' }
  };

  const ACOLYTE_NAMES = {
    angst: { zh: '焦虑', source: 'wfcd_worldstate:languages:/lotus/language/game/burstcasteracolyte' },
    malice: { zh: '怨恨', source: 'wfcd_worldstate:languages:/lotus/language/game/heavyacolyte' },
    misery: { zh: '苦难', source: 'wfcd_worldstate:languages:/lotus/language/game/areacasteracolyte' },
    torment: { zh: '折磨', source: 'wfcd_worldstate:languages:/lotus/language/game/controlacolyte' },
    violence: { zh: '暴力', source: 'wfcd_worldstate:languages:/lotus/language/game/duellistacolyte' },
    mania: { zh: 'Mania', source: 'en_as_is:wfcd_worldstate:languages:/lotus/language/game/rogueacolyte' }
  };

  for (const em of dropsAll.enemyModTables || []) {
    const enemyName = em.enemyName;
    if (!enemyName || enemiesMap[enemyName]) continue;

    const lower = enemyName.toLowerCase().trim();

    if (SPECIAL_ENEMIES_ZH[lower]) {
      const spec = SPECIAL_ENEMIES_ZH[lower];
      enemiesMap[enemyName] = {
        nameZh: spec.zh,
        zhSource: spec.source,
        ...(spec.rawName ? { rawName: spec.rawName } : {}),
        ...(spec.uniqueName ? { uniqueName: spec.uniqueName } : {}),
        ...(spec.rule ? { rule: spec.rule } : {}),
        ...(spec.zhSegments ? { zhSegments: spec.zhSegments } : {})
      };
      continue;
    }

    const acolyteMatch = lower.match(/^(angst|malice|misery|torment|violence|mania)\s*\((level\s*\d+\s*-\s*\d+)\)$/i);
    if (acolyteMatch) {
      const baseKey = acolyteMatch[1].toLowerCase();
      const levelStr = acolyteMatch[2].replace(/level/i, '等级');
      const aco = ACOLYTE_NAMES[baseKey];
      enemiesMap[enemyName] = {
        nameZh: `${aco.zh} (${levelStr})`,
        zhSource: `composed:acolyte:${aco.source}`,
        rule: 'composed:acolyte',
        zhSegments: [
          { text: aco.zh, source: aco.source },
          { text: ` (${levelStr})`, source: 'site_word' }
        ]
      };
      continue;
    }

    // 歧义核对：Captain Vor 在 Sortie 为 "Vor 上尉"，在 Flavour 浮印为 "沃尔上尉"
    // 按 Codex 决定第 6 项：歧义（一个英文名对应多个不同中文）就不用，列入待拍板，保留英文
    if (lower === 'captain vor') {
      enemiesMap[enemyName] = {
        nameZh: enemyName,
        zhSource: 'en_fallback',
        ambiguity: {
          candidates: [
            { zh: 'Vor 上尉', source: 'wfcd_worldstate:sortieData:bosses:SORTIE_BOSS_VOR' },
            { zh: '沃尔上尉', source: 'de_export:ExportFlavour_zh:/Lotus/Types/StoreItems/AvatarImages/ImageGrineerCaptainVor' }
          ],
          reason: '存在多个不同中文译名（Vor 上尉 vs 沃尔上尉），按规范保守保留英文回退'
        }
      };
      continue;
    }

    if (sortieBossesByEn.has(lower)) {
      const boss = sortieBossesByEn.get(lower);
      if (t2sEnemyMap.has(boss.zh)) {
        const t2sEntry = t2sEnemyMap.get(boss.zh);
        enemiesMap[enemyName] = {
          nameZh: t2sEntry.simplified,
          zhRaw: t2sEntry.traditional,
          zhSource: `wfcd_worldstate:sortieData:bosses:${boss.key}`,
          zhTransform: 'traditional_to_simplified',
          rule: 'sortie_boss:t2s'
        };
        continue;
      }
      const isAsIs = boss.zh.toLowerCase() === boss.en.toLowerCase();
      if (!isAsIs && /[\u4e00-\u9fa5]/.test(boss.zh)) {
        enemiesMap[enemyName] = {
          nameZh: boss.zh,
          zhSource: `wfcd_worldstate:sortieData:bosses:${boss.key}`,
          rule: 'sortie_boss'
        };
        continue;
      }
    }

    // DE ExportFlavour Glyphs (strip_suffix:浮印)
    if (deFlavourGlyphs.has(lower)) {
      const glyphMatches = deFlavourGlyphs.get(lower);
      const cand = glyphMatches[0];
      if (cand && /[\u4e00-\u9fa5]/.test(cand.zhCandidate)) {
        enemiesMap[enemyName] = {
          nameZh: cand.zhCandidate,
          zhSource: `de_export:ExportFlavour_zh:${cand.uniqueName}`,
          rule: 'strip_suffix:浮印',
          rawName: cand.zhGlyph,
          uniqueName: cand.uniqueName
        };
        continue;
      }
    }

    if (languagesByEnValue.has(lower)) {
      const lang = languagesByEnValue.get(lower);
      const isAsIs = lang.zh.toLowerCase() === lang.en.toLowerCase();
      if (!isAsIs && /[\u4e00-\u9fa5]/.test(lang.zh)) {
        enemiesMap[enemyName] = {
          nameZh: lang.zh,
          zhSource: `wfcd_worldstate:languages:${lang.key}`,
          rule: 'exact_match:languages'
        };
        continue;
      } else if (isAsIs) {
        enemiesMap[enemyName] = {
          nameZh: lang.zh,
          zhSource: `en_as_is:wfcd_worldstate:languages:${lang.key}`,
          isAsIs: true
        };
        continue;
      }
    }

    enemiesMap[enemyName] = {
      nameZh: enemyName,
      zhSource: 'en_fallback'
    };
  }

  // ----------------------------------------------------
  // E. 构建 Bounties 映射
  // ----------------------------------------------------
  console.log('[build-zh-map] 正在构建赏金标题映射 (bounties)...');
  const bountiesMap = {};

  const allBounties = [
    ...(dropsAll.cetusBountyRewards || []),
    ...(dropsAll.solarisBountyRewards || []),
    ...(dropsAll.deimosRewards || []),
    ...(dropsAll.zarimanRewards || []),
    ...(dropsAll.entratiLabRewards || []),
    ...(dropsAll.hexRewards || [])
  ];

  for (const b of allBounties) {
    const title = b.bountyLevel;
    if (!title || bountiesMap[title]) continue;

    let zh = title;
    let source = 'en_fallback';
    let zhSegments = null;

    const levelPrefixMatch = title.match(/^Level\s+(\d+\s*-\s*\d+)\s+(.+)$/i);
    const levelStr = levelPrefixMatch ? `等级 ${levelPrefixMatch[1]} ` : '';
    const rest = levelPrefixMatch ? levelPrefixMatch[2] : title;

    if (rest === 'Cetus Bounty') {
      zh = `${levelStr}希图斯赏金`;
      source = 'composed:bounty:cetus';
      zhSegments = [
        { text: levelStr, source: 'site_word' },
        { text: '希图斯', source: 'wfcd_worldstate:languages:/lotus/types/gameplay/eidolon/resources/cetuswispitem' },
        { text: '赏金', source: 'site_word' }
      ];
    } else if (rest === 'Ghoul Bounty') {
      zh = `${levelStr}尸鬼赏金`;
      source = 'composed:bounty:ghoul';
      zhSegments = [
        { text: levelStr, source: 'site_word' },
        { text: '尸鬼', source: 'wfcd_worldstate:languages:/lotus/language/gamemodes/recurringghoulalert' },
        { text: '赏金', source: 'site_word' }
      ];
    } else if (rest === 'Plague Star') {
      zh = `${levelStr}瘟疫之星`;
      source = 'composed:bounty:plague_star';
      zhSegments = [
        { text: levelStr, source: 'site_word' },
        { text: '瘟疫之星', source: 'wfcd_worldstate:languages:/lotus/language/infestedplainsevent/infestedplainsbountyname' }
      ];
    } else if (rest === 'Orb Vallis Bounty') {
      zh = `${levelStr}奥布山谷赏金`;
      source = 'composed:bounty:orb_vallis';
      zhSegments = [
        { text: levelStr, source: 'site_word' },
        { text: '奥布山谷', source: 'wfcd_i18n:SolNode129' },
        { text: '赏金', source: 'site_word' }
      ];
    } else if (rest.startsWith('PROFIT-TAKER - PHASE')) {
      const phase = rest.replace('PROFIT-TAKER - PHASE', '').trim();
      if (/^[1-9]\d*$/.test(phase)) {
        zh = `${levelStr}利润收割者 - 阶段 ${phase}`;
        source = 'composed:bounty:profit_taker';
        zhSegments = [
          { text: levelStr, source: 'site_word' },
          { text: '利润收割者', source: 'wfcd_worldstate:languages:/lotus/types/challenges/seasons/weeklyhard/seasonweeklyhardfriendsprofittaker' },
          { text: ` - 阶段 ${phase}`, source: 'site_word' }
        ];
      } else {
        zh = title;
        source = 'en_fallback';
      }
    } else if (rest === 'Cambion Drift Bounty') {
      zh = `${levelStr}魔胎之境赏金`;
      source = 'composed:bounty:cambion_drift';
      zhSegments = [
        { text: levelStr, source: 'site_word' },
        { text: '魔胎之境', source: 'wfcd_worldstate:solNodes:SolNode229' },
        { text: '赏金', source: 'site_word' }
      ];
    } else if (rest === 'Isolation Vault') {
      zh = `${levelStr}隔离库`;
      source = 'composed:bounty:isolation_vault';
      zhSegments = [
        { text: levelStr, source: 'site_word' },
        { text: '隔离库', source: 'wfcd_i18n:/Lotus/Types/Items/MiscItems/PhotoboothTileDeimosBouncy' }
      ];
    } else if (rest === 'Zariman Bounty') {
      zh = `${levelStr}扎里曼赏金`;
      source = 'composed:bounty:zariman';
      zhSegments = [
        { text: levelStr, source: 'site_word' },
        { text: '扎里曼', source: 'wfcd_worldstate:solNodes:SolNode230' },
        { text: '赏金', source: 'site_word' }
      ];
    } else {
      zh = title;
      source = 'en_fallback';
    }

    bountiesMap[title] = {
      nameZh: zh,
      zhSource: source,
      ...(zhSegments ? { zhSegments } : {})
    };
  }

  // ----------------------------------------------------
  // F. 构建 特殊掉落来源 (transientSources) 映射
  // ----------------------------------------------------
  console.log('[build-zh-map] 正在构建特殊来源映射 (transientSources)...');
  const transientMap = {};

  const TRANSIENT_DEFS = {
    'Arbitrations': {
      zh: '仲裁',
      source: 'de_web:arbitrations-update-zh.html',
      rule: 'strip_suffix:任务',
      url: 'https://www.warframe.com/zh-hans/news/arbitrations-update',
      quote: '仲裁任务',
      derivation: '从官方页面标题“仲裁任务更新”或正文“仲裁任务”去除“任务”后缀派生为“仲裁”',
      aliases: ['Arbitrations'],
      zhSegments: [
        {
          text: '仲裁',
          source: 'de_web:arbitrations-update-zh.html',
          rule: 'strip_suffix:任务',
          raw: '仲裁任务'
        }
      ]
    },
    'Derelict Vault': { zh: 'Derelict Vault', source: 'en_fallback' },
    'Phorid Assassination': { zh: 'Phorid Assassination', source: 'en_fallback' },
    'Nightmare Mode Rewards': { zh: 'Nightmare Mode Rewards', source: 'en_fallback' },
    'Fomorian Sabotage': { zh: 'Fomorian Sabotage', source: 'en_fallback' },
    'Razorback': { zh: '利刃豺狼', source: 'wfcd_worldstate:languages:/lotus/language/menu/corpusrazorbackproject' },
    'Kuva Siphon': { zh: 'Kuva Siphon', source: 'en_fallback' },
    'Kuva Flood': { zh: 'Kuva Flood', source: 'en_fallback' },
    'Sortie (突击任务)': { zh: 'Sortie (突击任务)', source: 'en_fallback' }
  };

  for (const tr of dropsAll.transientRewards || []) {
    const objName = tr.objectiveName;
    if (!objName || transientMap[objName]) continue;

    if (TRANSIENT_DEFS[objName]) {
      const def = TRANSIENT_DEFS[objName];
      transientMap[objName] = {
        nameZh: def.zh,
        zhSource: def.source,
        ...(def.rule ? { rule: def.rule } : {}),
        ...(def.url ? { url: def.url } : {}),
        ...(def.quote ? { quote: def.quote } : {}),
        ...(def.derivation ? { derivation: def.derivation } : {}),
        ...(def.aliases ? { aliases: def.aliases } : {}),
        ...(def.zhSegments ? { zhSegments: def.zhSegments } : {})
      };
    } else {
      transientMap[objName] = { nameZh: objName, zhSource: 'en_fallback' };
    }
  }

  // ----------------------------------------------------
  // G. 构建 Items 映射 (含简略名系统性消除与核对)
  // ----------------------------------------------------
  console.log('[build-zh-map] 正在构建物品映射与简略名检测 (items)...');
  const itemsMap = {};
  const abbreviatedCorrections = [];

  const allItemNames = new Set();

  for (const r of relicsAll) {
    for (const rew of r.rewards || []) {
      if (rew.item?.name) allItemNames.add(rew.item.name);
    }
  }
  for (const dr of dropsAll.relics || []) {
    for (const rew of dr.rewards || []) {
      if (rew.itemName) allItemNames.add(rew.itemName);
    }
  }
  for (const planetNodes of Object.values(dropsAll.missionRewards || {})) {
    for (const nodeData of Object.values(planetNodes || {})) {
      const scanList = (list) => {
        if (!Array.isArray(list)) return;
        for (const item of list) {
          if (item.itemName) allItemNames.add(item.itemName);
          if (item.modName) allItemNames.add(item.modName);
        }
      };
      if (Array.isArray(nodeData.rewards)) scanList(nodeData.rewards);
      else if (nodeData.rewards) {
        for (const l of Object.values(nodeData.rewards)) scanList(l);
      }
    }
  }
  for (const b of allBounties) {
    for (const rotList of Object.values(b.rewards || {})) {
      if (Array.isArray(rotList)) {
        for (const it of rotList) {
          if (it.itemName) allItemNames.add(it.itemName);
          if (it.modName) allItemNames.add(it.modName);
        }
      }
    }
  }
  for (const tr of dropsAll.transientRewards || []) {
    if (Array.isArray(tr.rewards)) {
      for (const it of tr.rewards) {
        if (it.itemName) allItemNames.add(it.itemName);
        if (it.modName) allItemNames.add(it.modName);
      }
    }
  }
  for (const em of dropsAll.enemyModTables || []) {
    for (const m of em.mods || []) {
      if (m.modName) allItemNames.add(m.modName);
    }
  }

  // 基础资源与特殊条目官方译名
  const SPECIAL_KNOWN_ITEMS = {
    'endo': { zh: '内融核心', source: 'wfcd_worldstate:languages:/lotus/storeitems/upgrades/mods/fusionbundles/alertfusionbundlelarge' },
    'kuva': { zh: '赤毒', source: 'wfcd_i18n:/Lotus/Types/Items/MiscItems/Kuva' },
    'forma': { zh: 'Forma', source: 'wfcd_i18n:/Lotus/Types/Items/MiscItems/Forma' },
    'forma blueprint': { zh: 'Forma 蓝图', source: 'wfcd_worldstate:languages:/lotus/types/recipes/components/formablueprint' }
  };

  for (const rawItemName of allItemNames) {
    if (!rawItemName) continue;
    const cleanName = rawItemName.replace(/^\d+X\s+/i, '').trim();
    if (itemsMap[cleanName]) continue;

    const lower = cleanName.toLowerCase();

    // 1. 特殊已知条目
    if (SPECIAL_KNOWN_ITEMS[lower]) {
      itemsMap[cleanName] = {
        nameZh: SPECIAL_KNOWN_ITEMS[lower].zh,
        zhSource: SPECIAL_KNOWN_ITEMS[lower].source
      };
      continue;
    }

    // 现金匣 Credits Cache
    const creditCacheMatch = cleanName.match(/^([\d,]+)\s+Credits\s+Cache$/i);
    if (creditCacheMatch) {
      const amount = creditCacheMatch[1];
      itemsMap[cleanName] = {
        nameZh: `${amount} 现金匣`,
        zhSource: 'composed:credits_cache:wfcd_worldstate:languages:/lotus/storeitems/types/pickups/credits/1000credits',
        zhSegments: [
          { text: `${amount} `, source: 'original_en' },
          { text: '现金匣', source: 'wfcd_worldstate:languages:/lotus/storeitems/types/pickups/credits/1000credits' }
        ]
      };
      continue;
    }

    // 2. 匹配 WFCD 与 WFM 元数据（结合 itemMetaByEn 与 wfcdItemsByEnName）
    const itemMeta = itemMetaByEn.get(lower);
    const wfcdItem = wfcdItemsByEnName.get(lower);
    const uniqueName = itemMeta?.uniqueName || wfcdItem?.uniqueName;
    const wfcdRawZh = uniqueName ? i18nZh[uniqueName]?.name?.trim() : null;

    let wfmItem = itemMeta?.wfmSlug ? wfmBySlug.get(itemMeta.wfmSlug) : (wfmByEnName.get(lower) || (wfcdItem?.warframeMarket?.urlName ? wfmBySlug.get(wfcdItem.warframeMarket.urlName) : null));
    const wfmZh = wfmItem?.i18n?.['zh-hans']?.name?.trim();

    // 3. 简略名检测规则：
    // 若属于 Prime/武器/战甲部件与蓝图，且中文名不包含其父物品中文名，改用 WFM 完整名或 WFCD 父+部件拼接
    const partMatch = cleanName.match(COMPONENT_SUFFIX_REGEX);
    let isAbbreviated = false;
    let parentZh = null;
    let parentEn = null;
    let partType = null;
    let parentInfo = null;

    if (partMatch) {
      parentEn = cleanName.substring(0, partMatch.index).trim();
      partType = partMatch[1].trim();

      parentInfo = wfcdParentItemsByEn.get(parentEn.toLowerCase());
      if (parentInfo) {
        parentZh = parentInfo.zh;
      }

      if (wfcdRawZh && parentZh && !wfcdRawZh.includes(parentZh)) {
        isAbbreviated = true;
      }
    }

    if (isAbbreviated) {
      let correctedZh = null;
      let zhSource = null;
      let rule = null;
      let zhSegments = null;

      // 优先方案 A: 使用 warframe.market 的完整 zh-hans 名称
      if (wfmZh && (wfmZh.includes(parentZh) || wfmZh.length > wfcdRawZh.length)) {
        correctedZh = wfmZh;
        zhSource = `warframe_market:${wfmItem.slug}`;
        rule = 'wfm_full_name';
      }
      // 备选方案 B: 官方父物品 zh + 官方部件 zh
      else if (parentZh && parentInfo?.source) {
        const partDef = STANDARD_PART_SOURCES[partType.toLowerCase()];
        if (partDef) {
          const partZh = partDef.zh;
          correctedZh = `${parentZh} ${partZh}`;
          zhSource = `composed:parent+part:${partDef.source}`;
          rule = 'wfcd_parent_plus_part';
          zhSegments = [
            { text: parentZh, source: parentInfo.source },
            { text: ' ', source: 'original_en' },
            { text: partZh, source: partDef.source }
          ];
        }
      }

      if (correctedZh) {
        itemsMap[cleanName] = {
          nameZh: correctedZh,
          zhSource,
          ...(zhSegments ? { zhSegments } : {}),
          originalZh: wfcdRawZh,
          isAbbreviatedFixed: true,
          parentZh,
          partType
        };
        abbreviatedCorrections.push({
          enName: cleanName,
          originalZh: wfcdRawZh,
          correctedZh,
          parentEn,
          parentZh,
          partType,
          zhSource,
          rule
        });
        continue;
      }
    }

    // 4. 普通物品优先级判断：
    // 优先级 1: WFCD i18n
    if (wfcdRawZh) {
      itemsMap[cleanName] = {
        nameZh: wfcdRawZh,
        zhSource: `wfcd_i18n:${uniqueName}`
      };
      continue;
    }

    // 优先级 2: WFM
    if (wfmZh) {
      itemsMap[cleanName] = {
        nameZh: wfmZh,
        zhSource: `warframe_market:${wfmItem.slug}`
      };
      continue;
    }

    // 优先级 3: Languages
    if (languagesByEnValue.has(lower)) {
      const lang = languagesByEnValue.get(lower);
      itemsMap[cleanName] = {
        nameZh: lang.zh,
        zhSource: `wfcd_worldstate:languages:${lang.key}`
      };
      continue;
    }

    // 兜底: 保留英文
    itemsMap[cleanName] = {
      nameZh: cleanName,
      zhSource: 'en_fallback'
    };
  }

  console.log(`[build-zh-map] 物品映射完成: ${Object.keys(itemsMap).length} 条，修正简略名: ${abbreviatedCorrections.length} 条`);

  // ----------------------------------------------------
  // H. 组装并写入 config/zh-map.json
  // ----------------------------------------------------
  const masterZhMap = {
    meta: {
      generatedAt: new Date().toISOString(),
      rawDir,
      stats: {
        planetsCount: Object.keys(planetsMap).length,
        missionTypesCount: Object.keys(missionTypesMap).length,
        nodesCount: Object.keys(nodesMap).length,
        enemiesCount: Object.keys(enemiesMap).length,
        bountiesCount: Object.keys(bountiesMap).length,
        transientSourcesCount: Object.keys(transientMap).length,
        itemsCount: Object.keys(itemsMap).length,
        abbreviatedCorrectionsCount: abbreviatedCorrections.length
      }
    },
    planets: planetsMap,
    missionTypes: missionTypesMap,
    nodes: nodesMap,
    enemies: enemiesMap,
    bounties: bountiesMap,
    transientSources: transientMap,
    items: itemsMap,
    abbreviatedCorrections
  };

  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  const outPath = path.join(CONFIG_DIR, 'zh-map.json');
  fs.writeFileSync(outPath, JSON.stringify(masterZhMap, null, 2));

  console.log('--------------------------------------------------');
  console.log(`[build-zh-map] 映射文件成功生成: ${outPath}`);
  console.log(`- 星球数: ${masterZhMap.meta.stats.planetsCount}`);
  console.log(`- 任务类型数: ${masterZhMap.meta.stats.missionTypesCount}`);
  console.log(`- 节点数: ${masterZhMap.meta.stats.nodesCount}`);
  console.log(`- 敌人实体数: ${masterZhMap.meta.stats.enemiesCount}`);
  console.log(`- 赏金标题数: ${masterZhMap.meta.stats.bountiesCount}`);
  console.log(`- 特殊来源数: ${masterZhMap.meta.stats.transientSourcesCount}`);
  console.log(`- 物品总数: ${masterZhMap.meta.stats.itemsCount}`);
  console.log(`- 简略名修正数: ${masterZhMap.meta.stats.abbreviatedCorrectionsCount}`);
  console.log('--------------------------------------------------');

  return masterZhMap;
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  buildZhMap().catch(err => {
    console.error('[build-zh-map] 生成失败:', err);
    process.exit(1);
  });
}
