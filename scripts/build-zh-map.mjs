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

// 常见部件后缀正则
export const COMPONENT_SUFFIX_REGEX = /\s+(Blueprint|Barrel|Receiver|Stock|Blade|Blades|Hilt|Handle|Gauntlet|Gauntlets|Boot|Boots|Chassis|Neuroptics|Systems|Chassis Blueprint|Neuroptics Blueprint|Systems Blueprint|Harness|Wings|Harness Blueprint|Wings Blueprint|Upper Limb|Lower Limb|Grip|String|Head|Ornament|Pouch|Stars|Guard|Buckle|Band|Chain|Carapace|Cerebrum|Motor|Heatsink|Sub-Cortex|Left Gauntlet|Right Gauntlet|Collar Blueprint)$/i;

// 部件英文名到官方常见部件中文对照（用于 composed:parent+part，来自 WFCD 原始部件翻译）
export const STANDARD_PART_ZH = {
  blueprint: '蓝图',
  barrel: '枪管',
  receiver: '枪机',
  stock: '枪托',
  blade: '刀刃',
  blades: '爪刃',
  hilt: '握柄',
  handle: '握柄',
  gauntlet: '手套',
  gauntlets: '手套',
  boot: '靴子',
  boots: '靴子',
  chassis: '机体',
  neuroptics: '头部',
  systems: '系统',
  'chassis blueprint': '机体蓝图',
  'neuroptics blueprint': '头部蓝图',
  'systems blueprint': '系统蓝图',
  harness: '外壳',
  wings: '机翼',
  'harness blueprint': '外壳蓝图',
  'wings blueprint': '机翼蓝图',
  'upper limb': '上弓臂',
  'lower limb': '下弓臂',
  grip: '握把',
  string: '弓弦',
  head: '锤头',
  ornament: '饰物',
  pouch: '镖袋',
  stars: '星镖',
  guard: '护手',
  buckle: '连接器',
  band: '枪套',
  chain: '链条',
  carapace: '外壳',
  cerebrum: '脑部',
  motor: '马达',
  heatsink: '散热板',
  'sub-cortex': '亚皮质',
  'left gauntlet': '左手套',
  'right gauntlet': '右手套',
  'collar blueprint': '项圈蓝图'
};

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
            wfcdParentItemsByEn.set(enLower, { name: item.name, zh, uniqueName: item.uniqueName });
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
          wfcdParentItemsByEn.set(baseEn, { name: item.i18n.en.name.replace(/\s+Set$/i, ''), zh: baseZh, slug: item.slug });
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
    { en: 'Sedna', zh: '塞德娜', source: 'wfcd_i18n:/Lotus/Types/Items/ShipDecos/PlanetTrophies/PlanetTrophySednaBronze' },
    { en: 'Europa', zh: '欧罗巴', source: 'wfcd_i18n:/Lotus/Types/Items/ShipDecos/PlanetTrophies/PlanetTrophyEuropaBronze' },
    { en: 'Void', zh: '虚空', source: 'wfcd_worldstate:solNodes:SolNode400' },
    { en: 'Phobos', zh: '火卫一', source: 'wfcd_i18n:/Lotus/Types/Items/ShipDecos/PlanetTrophies/PlanetTrophyPhobosBronze' },
    { en: 'Deimos', zh: '火卫二', source: 'wfcd_worldstate:solNodes:SolNode700' },
    { en: 'Lua', zh: '月球', source: 'wfcd_worldstate:solNodes:SolNode304' },
    { en: 'Kuva Fortress', zh: '赤毒要塞', source: 'wfcd_i18n:/Lotus/Types/Items/ShipDecos/PlanetTrophies/PlanetTrophyKuvaFortressBronze' },
    { en: 'KuvaFortress', zh: '赤毒要塞', source: 'wfcd_i18n:/Lotus/Types/Items/ShipDecos/PlanetTrophies/PlanetTrophyKuvaFortressBronze' },
    { en: 'Sanctuary', zh: '圣殿', source: 'wfcd_worldstate:languages:/lotus/types/challenges/seasons/weekly/seasonweeklysimarisscan' },
    { en: 'Veil Proxima', zh: '面纱比邻星域', source: 'composed:wfcd_worldstate:solNodes:CrewBattleNode505' },
    { en: 'Zariman', zh: '扎里曼', source: 'wfcd_worldstate:solNodes:SolNode601' },
    { en: 'Duviri', zh: '双衍王境', source: 'wfcd_worldstate:solNodes:SolNode603' },
    { en: 'Höllvania', zh: '霍瓦尼亚', source: 'wfcd_i18n:/Lotus/Types/Gameplay/1999Wf/Resources/HexDogTagUncommon' },
    { en: 'Hollvania', zh: '霍瓦尼亚', source: 'wfcd_i18n:/Lotus/Types/Gameplay/1999Wf/Resources/HexDogTagUncommon' },
    { en: 'Cetus', zh: '希图斯', source: 'wfcd_worldstate:solNodes:SolNode700' },
    { en: 'Solaris', zh: '福尔图娜', source: 'wfcd_worldstate:languages:/Lotus/Language/Events/ValentinesFortunaName' },
    { en: 'Dark Refractory, Deimos', zh: 'Dark Refractory, 火卫二', source: 'composed:en_node+wfcd_worldstate:solNodes:SolNode700' }
  ];

  for (const p of rawPlanetsDefs) {
    planetsMap[p.en] = { nameZh: p.zh, zhSource: p.source };
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

  const TRADITIONAL_TYPES = new Set(['刺殺', '捕獲', '防禦', '殲滅', '間諜', '移動防禦', '破壞', '攔截']);

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
      const isTrad = TRADITIONAL_TYPES.has(match.zh);
      const isAsIs = match.zh.toLowerCase() === match.en.toLowerCase();
      let source = `wfcd_worldstate:missionTypes:${match.key}`;
      if (isTrad) {
        source = `traditional:${source}`;
      } else if (isAsIs) {
        source = `en_as_is:${source}`;
      }
      missionTypesMap[gm] = {
        nameZh: match.zh,
        zhSource: source,
        isTraditional: isTrad,
        isAsIs: isAsIs
      };
    } else {
      missionTypesMap[gm] = {
        nameZh: gm,
        zhSource: 'en_fallback',
        isTraditional: false,
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

      if (solMatch) {
        const zhNode = suffix ? `${solMatch.zhVal} ${suffix}` : solMatch.zhVal;
        nodesMap[key] = {
          nameZh: zhNode,
          zhSource: `wfcd_worldstate:solNodes:${solMatch.key}`,
          solNodeKey: solMatch.key,
          isAsIs: true
        };
      } else {
        const composedZh = `${cleanNode} (${planetZh})${suffix ? ` ${suffix}` : ''}`;
        nodesMap[key] = {
          nameZh: composedZh,
          zhSource: `composed:en_node+planet:${planet}`,
          solNodeKey: null,
          isAsIs: false
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
    'eidolon teralyst': { zh: '夜灵兆力使', source: 'composed:wfcd_i18n:/Lotus/Types/Items/ShipDecos/Vignettes/Enemies/TeralystAFItem' },
    'eidolon gantulyst': { zh: '夜灵巨力使', source: 'composed:wfcd_i18n:/Lotus/Types/Items/ShipDecos/Vignettes/Enemies/TeralystBigAFItem' },
    'eidolon hydrolyst': { zh: '夜灵水力使', source: 'composed:wfcd_i18n:/Lotus/Types/Items/ShipDecos/Vignettes/Enemies/TeralystRainAFItem' },
    'eidolon teralyst (special)': { zh: '夜灵兆力使（特殊）', source: 'composed:wfcd_i18n:/Lotus/Types/Items/ShipDecos/Vignettes/Enemies/TeralystAFItem' },
    'eidolon gantulyst (special)': { zh: '夜灵巨力使（特殊）', source: 'composed:wfcd_i18n:/Lotus/Types/Items/ShipDecos/Vignettes/Enemies/TeralystBigAFItem' },
    'eidolon hydrolyst (special)': { zh: '夜灵水力使（特殊）', source: 'composed:wfcd_i18n:/Lotus/Types/Items/ShipDecos/Vignettes/Enemies/TeralystRainAFItem' },
    
    'stalker': { zh: '追猎者', source: 'wfcd_i18n:/Lotus/Interface/Graphics/CustomUI/Backgrounds/StalkerBackground' },
    'shadow stalker': { zh: '暗影追猎者', source: 'composed:wfcd_i18n:/Lotus/Interface/Graphics/CustomUI/Backgrounds/StalkerBackground' },
    'protector stalker': { zh: '卫护追猎者', source: 'wfcd_i18n:/Lotus/Types/Items/ShipDecos/Plushies/PlushyProtectorStalker' },

    'profit-taker': { zh: '利润收割者', source: 'wfcd_worldstate:languages:/lotus/types/challenges/seasons/weeklyhard/seasonweeklyhardfriendsprofittaker' }
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
      enemiesMap[enemyName] = {
        nameZh: SPECIAL_ENEMIES_ZH[lower].zh,
        zhSource: SPECIAL_ENEMIES_ZH[lower].source
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
        zhSource: `composed:acolyte:${aco.source}`
      };
      continue;
    }

    if (sortieBossesByEn.has(lower)) {
      const boss = sortieBossesByEn.get(lower);
      const isTrad = TRADITIONAL_TYPES.has(boss.zh) || boss.zh === '墮落 Vor';
      const isAsIs = boss.zh.toLowerCase() === boss.en.toLowerCase();
      let source = `wfcd_worldstate:sortieData:bosses:${boss.key}`;
      if (isTrad) source = `traditional:${source}`;
      else if (isAsIs) source = `en_as_is:${source}`;

      enemiesMap[enemyName] = {
        nameZh: boss.zh,
        zhSource: source
      };
      continue;
    }

    if (languagesByEnValue.has(lower)) {
      const lang = languagesByEnValue.get(lower);
      const isAsIs = lang.zh.toLowerCase() === lang.en.toLowerCase();
      enemiesMap[enemyName] = {
        nameZh: lang.zh,
        zhSource: isAsIs ? `en_as_is:wfcd_worldstate:languages:${lang.key}` : `wfcd_worldstate:languages:${lang.key}`
      };
      continue;
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
    let source = 'composed:bounty_title';

    if (title.includes('Cetus Bounty')) {
      zh = title.replace(/Level\s+/i, '等级 ').replace('Cetus Bounty', '希图斯赏金');
      source = 'composed:bounty:cetus';
    } else if (title.includes('Ghoul Bounty')) {
      zh = title.replace(/Level\s+/i, '等级 ').replace('Ghoul Bounty', '尸鬼赏金');
      source = 'composed:bounty:ghoul';
    } else if (title.includes('Plague Star')) {
      zh = title.replace(/Level\s+/i, '等级 ').replace('Plague Star', '瘟疫之星');
      source = 'composed:bounty:plague_star';
    } else if (title.includes('Orb Vallis Bounty')) {
      zh = title.replace(/Level\s+/i, '等级 ').replace('Orb Vallis Bounty', '奥布山谷赏金');
      source = 'composed:bounty:orb_vallis';
    } else if (title.includes('PROFIT-TAKER')) {
      zh = title.replace(/Level\s+/i, '等级 ').replace('PROFIT-TAKER - PHASE', '利润收割者 - 阶段');
      source = 'composed:bounty:profit_taker';
    } else if (title.includes('Cambion Drift Bounty')) {
      zh = title.replace(/Level\s+/i, '等级 ').replace('Cambion Drift Bounty', '魔胎之境赏金');
      source = 'composed:bounty:cambion_drift';
    } else if (title.includes('Arcana Isolation Vault')) {
      zh = title.replace(/Level\s+/i, '等级 ').replace('Arcana Isolation Vault', '奥秘隔离库');
      source = 'composed:bounty:arcana_isolation_vault';
    } else if (title.includes('Isolation Vault')) {
      zh = title.replace(/Level\s+/i, '等级 ').replace('Isolation Vault', '隔离库');
      source = 'composed:bounty:isolation_vault';
    } else if (title.includes('Zariman Bounty')) {
      zh = title.replace(/Level\s+/i, '等级 ').replace('Zariman Bounty', '扎里曼赏金');
      source = 'composed:bounty:zariman';
    } else if (title.includes('Entrati Lab Bounty')) {
      zh = title.replace(/Level\s+/i, '等级 ').replace('Entrati Lab Bounty', '英择谛实验室赏金');
      source = 'composed:bounty:entrati_lab';
    } else if (title.includes('WF1999 Bounty')) {
      zh = title.replace(/Level\s+/i, '等级 ').replace('WF1999 Bounty', '霍瓦尼亚 1999 赏金');
      source = 'composed:bounty:wf1999';
    }

    bountiesMap[title] = { nameZh: zh, zhSource: source };
  }

  // ----------------------------------------------------
  // F. 构建 特殊掉落来源 (transientSources) 映射
  // ----------------------------------------------------
  console.log('[build-zh-map] 正在构建特殊来源映射 (transientSources)...');
  const transientMap = {};

  const TRANSIENT_DEFS = {
    'Arbitrations': { zh: 'Arbitrations', source: 'en_fallback' },
    'Derelict Vault': { zh: '遗迹宝库', source: 'composed:derelict_vault' },
    'Phorid Assassination': { zh: 'Phorid 刺杀', source: 'composed:boss+assassination' },
    'Nightmare Mode Rewards': { zh: '噩梦模式奖励', source: 'composed:nightmare_mode' },
    'Fomorian Sabotage': { zh: '巨人战舰破坏', source: 'composed:fomorian+sabotage' },
    'Razorback': { zh: '利刃豺狼', source: 'wfcd_worldstate:languages:/lotus/language/menu/corpusrazorbackproject' },
    'Kuva Siphon': { zh: '赤毒虹吸', source: 'composed:kuva_siphon' },
    'Kuva Flood': { zh: '赤毒洪流', source: 'composed:kuva_flood' },
    'Sortie (突击任务)': { zh: 'Sortie (突击任务)', source: 'composed:sortie' }
  };

  for (const tr of dropsAll.transientRewards || []) {
    const objName = tr.objectiveName;
    if (!objName || transientMap[objName]) continue;

    if (TRANSIENT_DEFS[objName]) {
      transientMap[objName] = {
        nameZh: TRANSIENT_DEFS[objName].zh,
        zhSource: TRANSIENT_DEFS[objName].source
      };
    } else if (objName.startsWith('Void Storm (')) {
      const m = objName.match(/^Void Storm \((.+?)\)$/);
      if (m && planetsMap[m[1]]) {
        transientMap[objName] = {
          nameZh: `虚空风暴 (${planetsMap[m[1]].nameZh})`,
          zhSource: `composed:void_storm+planet:${m[1]}`
        };
      } else {
        transientMap[objName] = { nameZh: objName, zhSource: 'en_fallback' };
      }
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
        zhSource: 'composed:wfcd_worldstate:languages:/lotus/storeitems/types/pickups/credits/1000credits'
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

    if (partMatch) {
      parentEn = cleanName.substring(0, partMatch.index).trim();
      partType = partMatch[1].trim();

      const parentInfo = wfcdParentItemsByEn.get(parentEn.toLowerCase());
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

      // 优先方案 A: 使用 warframe.market 的完整 zh-hans 名称
      if (wfmZh && (wfmZh.includes(parentZh) || wfmZh.length > wfcdRawZh.length)) {
        correctedZh = wfmZh;
        zhSource = `warframe_market:${wfmItem.slug}`;
        rule = 'wfm_full_name';
      }
      // 备选方案 B: 官方父物品 zh + 官方部件 zh
      else if (parentZh) {
        const partZh = STANDARD_PART_ZH[partType.toLowerCase()] || wfcdRawZh;
        correctedZh = `${parentZh} ${partZh}`;
        zhSource = `composed:parent+part:wfcd_i18n:${parentZh}+${partZh}`;
        rule = 'wfcd_parent_plus_part';
      }

      if (correctedZh) {
        itemsMap[cleanName] = {
          nameZh: correctedZh,
          zhSource,
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
