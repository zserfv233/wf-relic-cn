#!/usr/bin/env node
/**
 * scripts/build-data.mjs
 * Warframe 遗物、赋能、紫卡、Mod 与掉落来源数据构建脚本（全站汉化版）
 * Node 24 原生 ESM，仅依赖 pinyin-pro（MIT）
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pinyin } from 'pinyin-pro';
import { calculatePriceCoverage } from '../js/lib/prices.js';
import { isPvpSource } from '../js/lib/sources.js';
import { buildZhMap } from './build-zh-map.mjs';
import { generateRemainingEnglishDocs } from './build-remaining-english.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const CONFIG_DIR = path.join(ROOT_DIR, 'config');

// 纪元中文对照表
const TIER_ZH_MAP = {
  Lith: '古纪',
  Meso: '前纪',
  Neo: '中纪',
  Axi: '后纪',
  Requiem: '安魂',
  Vanguard: '先锋'
};

// 星球中文对照表（回退）
const PLANET_ZH_MAP = {
  Mercury: '水星',
  Venus: '金星',
  Earth: '地球',
  Mars: '火星',
  Phobos: '火卫一',
  Ceres: '谷神星',
  Jupiter: '木星',
  Europa: '欧罗巴',
  Saturn: '土星',
  Uranus: '天王星',
  Neptune: '海王星',
  Pluto: '冥王星',
  Sedna: '赛德娜',
  Eris: '阋神星',
  Void: '虚空',
  Deimos: '火卫二',
  Lua: '月球',
  KuvaFortress: '赤毒要塞',
  'Kuva Fortress': '赤毒要塞',
  Duviri: '双衍王境',
  Zariman: '扎里曼',
  'Sanctum Anatomica': '解剖圣所',
  Hollvania: '霍瓦尼亚',
  Cetus: '希图斯',
  Solaris: 'Solaris'
};

// 任务模式常见对照（回退）
const GAMEMODE_ZH_MAP = {
  Survival: '生存',
  Defense: '防御',
  Interception: '拦截',
  Spy: '间谍',
  Disruption: '中断',
  Excavation: '挖掘',
  Extermination: '歼灭',
  Capture: '捕获',
  Defection: '叛逃',
  Sabotage: '破坏',
  'Mobile Defense': '移动防御',
  Rescue: '救援',
  Hijack: '劫持',
  Arena: '竞技场',
  Skirmish: '前哨战',
  Assassination: '刺杀'
};

// 远程数据源 URL
const REMOTE_URLS = {
  drops_all: 'https://drops.warframestat.us/data/all.json',
  relics: 'https://raw.githubusercontent.com/WFCD/warframe-items/master/data/json/Relics.json',
  zh: 'https://raw.githubusercontent.com/WFCD/warframe-items/master/data/json/i18n/zh.json',
  wfm_items_v2: 'https://api.warframe.market/v2/items'
};

// 通用部件单字列表
const GENERIC_COMPONENT_NAMES = new Set([
  '枪管', '枪机', '枪托', '握柄', '连接器', '锤头', '弓身', '弓弦', '弓臂',
  '上弓臂', '下弓臂', '刀刃', '刀身', '护手', '枪刃', '靴子', '系统', '机体',
  '头部', '握把', '外壳', '饰物', '枪套', '剑刃', '短柄', '握套', '手套', '爪刃', '拳套', '镖袋', '星镖', '链条'
]);

// DE 掉落表未开紫卡名称与 WFM slug 规范对应表
const VEILED_RIVEN_NAME_MAP = {
  'rifle riven mod': 'rifle_riven_mod_veiled',
  'pistol riven mod': 'pistol_riven_mod_veiled',
  'melee riven mod': 'melee_riven_mod_veiled',
  'shotgun riven mod': 'shotgun_riven_mod_veiled',
  'zaw riven mod': 'zaw_riven_mod_veiled',
  'kitgun riven mod': 'kitgun_riven_mod_veiled',
  'archgun riven mod': 'archgun_riven_mod_veiled',
  'companion weapon riven mod': 'companion_weapon_riven_mod_veiled'
};

/**
 * 解析物品数量前缀（如 "3X Arcane Energize" -> { quantity: 3, baseName: "Arcane Energize" }）
 */
export function parseQuantityAndName(rawName) {
  if (!rawName || typeof rawName !== 'string') return { quantity: 1, baseName: '' };
  const m = rawName.match(/^(\d+)X\s+(.+)$/i);
  if (m) {
    return {
      quantity: parseInt(m[1], 10),
      baseName: m[2].trim()
    };
  }
  return {
    quantity: 1,
    baseName: rawName.trim()
  };
}

/**
 * 计算汉化覆盖率统计纯函数
 */
export function computeZhStats(list) {
  const items = Array.isArray(list) ? list : Object.values(list || {});
  const totalCount = items.length;
  let translatedCount = 0;
  let traditionalCount = 0;
  let asIsCount = 0;
  let fallbackCount = 0;

  for (const it of items) {
    const src = it.zhSource || '';
    if (src.startsWith('traditional')) {
      traditionalCount++;
      translatedCount++;
    } else if (src.startsWith('en_as_is') || it.isAsIs) {
      asIsCount++;
    } else if (src === 'en_fallback' || src.startsWith('en_fallback') || it.zhName === it.name) {
      fallbackCount++;
    } else {
      translatedCount++;
    }
  }

  const coverage = totalCount > 0 ? `${((translatedCount / totalCount) * 100).toFixed(1)}%` : '0.0%';
  const effectiveCoverage = totalCount > 0 ? `${(((translatedCount + asIsCount) / totalCount) * 100).toFixed(1)}%` : '0.0%';

  return {
    totalCount,
    translatedCount,
    traditionalCount,
    asIsCount,
    fallbackCount,
    coverage,
    effectiveCoverage
  };
}

/**
 * 解析命令行参数
 */
function parseArgs() {
  const args = process.argv.slice(2);
  let rawDir = null;
  let shouldDownload = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--raw' && args[i + 1]) {
      rawDir = path.resolve(args[i + 1]);
      i++;
    } else if (args[i] === '--download') {
      shouldDownload = true;
    }
  }

  if (!rawDir) {
    const candidates = [
      '/workspace/wf-relic-cn-raw',
      path.join(DATA_DIR, 'raw'),
      path.join(ROOT_DIR, 'raw')
    ];
    for (const cand of candidates) {
      if (fs.existsSync(cand) && fs.existsSync(path.join(cand, 'drops_all.json'))) {
        rawDir = cand;
        break;
      }
    }
    if (!rawDir) rawDir = path.join(DATA_DIR, 'raw');
  }

  return { rawDir, shouldDownload };
}

/**
 * 从网络下载文件
 */
async function downloadFiles(targetDir) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`[download] 正在从官方/开源源下载原始数据到 ${targetDir}...`);

  for (const [key, url] of Object.entries(REMOTE_URLS)) {
    const fileName = key === 'relics' ? 'Relics.json' : `${key}.json`;
    const dest = path.join(targetDir, fileName);
    console.log(`[download] 下载 ${fileName} 来自 ${url}`);
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'wf-relic-cn (personal, non-commercial)' } });
      if (!res.ok) {
        if (key === 'wfm_items_v2') {
          console.warn(`[download] 警告: 下载 ${fileName} 失败 (HTTP ${res.status})，将使用降级策略。`);
          continue;
        }
        throw new Error(`下载失败: ${url} (HTTP ${res.status})`);
      }
      const data = await res.arrayBuffer();
      fs.writeFileSync(dest, Buffer.from(data));
      console.log(`[download] 已保存 ${fileName} (${(data.byteLength / 1024 / 1024).toFixed(2)} MB)`);
    } catch (err) {
      if (key === 'wfm_items_v2') {
        console.warn(`[download] 警告: 无法下载 ${fileName}: ${err.message}，将使用降级策略。`);
      } else {
        throw err;
      }
    }
  }
}

/**
 * 生成拼音和检索 tokens
 */
function generateTokens(name, zhName) {
  const tokens = new Set();

  if (name) {
    const enLower = name.toLowerCase().trim();
    tokens.add(enLower);
    tokens.add(enLower.replace(/\s+/g, ''));

    const words = enLower.split(/[^a-z0-9]+/i).filter(Boolean);
    if (words.length > 1) {
      const initials = words.map(w => w[0]).join('');
      tokens.add(initials);
      if (words[words.length - 1] === 'blueprint') {
        const withoutBp = words.slice(0, -1).map(w => w[0]).join('') + 'bp';
        tokens.add(withoutBp);
      }
    }
  }

  if (zhName) {
    const zhLower = zhName.toLowerCase().trim();
    tokens.add(zhLower);
    tokens.add(zhLower.replace(/\s+/g, ''));

    try {
      const pyArr = pinyin(zhLower, { toneType: 'none', type: 'array' });
      if (pyArr && pyArr.length > 0) {
        const fullPy = pyArr.join('');
        tokens.add(fullPy);
        tokens.add(fullPy.replace(/\s+/g, ''));
      }

      const pyFirst = pinyin(zhLower, { pattern: 'first', toneType: 'none', type: 'array' });
      if (pyFirst && pyFirst.length > 0) {
        const firstLetters = pyFirst.join('');
        tokens.add(firstLetters);
        tokens.add(firstLetters.replace(/\s+/g, ''));
      }
    } catch {}
  }

  return Array.from(tokens).filter(Boolean);
}

/**
 * 主构建逻辑
 */
export async function build(customOptions = {}) {
  const cliArgs = parseArgs();
  const rawDir = customOptions.rawDir || cliArgs.rawDir;
  const targetDataDir = customOptions.dataDir || DATA_DIR;
  const shouldDownload = customOptions.shouldDownload !== undefined ? customOptions.shouldDownload : cliArgs.shouldDownload;

  if (shouldDownload) {
    await downloadFiles(rawDir);
  }

  console.log(`[build] 正在从 ${rawDir} 读取原始数据...`);

  const dropsAllPath = path.join(rawDir, 'drops_all.json');
  const relicsPath = path.join(rawDir, 'Relics.json');
  const zhPath = path.join(rawDir, 'zh.json');
  const wfmPath = path.join(rawDir, 'wfm_items_v2.json');

  if (!fs.existsSync(dropsAllPath) || !fs.existsSync(relicsPath) || !fs.existsSync(zhPath)) {
    throw new Error(`原始数据文件缺失！请确保 drops_all.json, Relics.json, zh.json 位于 ${rawDir}`);
  }

  const dropsAll = JSON.parse(fs.readFileSync(dropsAllPath, 'utf8'));
  const relicsJson = JSON.parse(fs.readFileSync(relicsPath, 'utf8'));
  const zhJson = JSON.parse(fs.readFileSync(zhPath, 'utf8'));

  // 读取 de_droptables.html 并解析 Duviri 钢铁重复奖励表头与 Recall: Ten-Zero 历史活动组 (Item 8)
  const htmlPath = path.join(rawDir, 'de_droptables.html');
  let duviriHtmlSteelRepeated = null;
  const recallTenZeroTables = [];
  if (fs.existsSync(htmlPath)) {
    try {
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      const headerRegex = /<th[^>]*>\s*(Duviri\/Endless:\s*Repeated Rewards\s*\(Hard\))\s*<\/th>/i;
      const match = headerRegex.exec(htmlContent);
      if (match) {
        const headerText = match[1];
        const afterHeader = htmlContent.slice(match.index + match[0].length);
        const sectionEndRegex = /<tr class="blank-row">|<th[^>]*>|<\/table>/i;
        const endMatch = sectionEndRegex.exec(afterHeader);
        const tableSlice = endMatch ? afterHeader.slice(0, endMatch.index) : afterHeader.slice(0, 5000);
        const rowRegex = /<tr>\s*<td[^>]*>(.*?)<\/td>\s*<td[^>]*>(?:(.*?)\s*\(([\d.]+)%\)|([\d.]+)%)\s*<\/td>\s*<\/tr>/gi;
        const items = [];
        let rowMatch;
        while ((rowMatch = rowRegex.exec(tableSlice)) !== null) {
          items.push({
            name: rowMatch[1].trim(),
            rarity: (rowMatch[2] || '').trim(),
            chance: parseFloat(rowMatch[3] || rowMatch[4])
          });
        }
        duviriHtmlSteelRepeated = { header: headerText, items };
      }

      // 解析 Recall: Ten-Zero Week 1..5 独立表 (Item 8)
      const recallRegex = /<tr><th[^>]*>\s*(Recall:\s*Ten-Zero\s*Week\s*(\d+))\s*<\/th><\/tr>/gi;
      let rMatch;
      while ((rMatch = recallRegex.exec(htmlContent)) !== null) {
        const headerText = rMatch[1].trim();
        const weekNum = parseInt(rMatch[2], 10);
        const afterHeader = htmlContent.slice(rMatch.index + rMatch[0].length);
        const endMatch = /<tr class="blank-row">|<th[^>]*>|<\/table>/i.exec(afterHeader);
        const tableSlice = endMatch ? afterHeader.slice(0, endMatch.index) : afterHeader;
        const rowRegex = /<tr>\s*<td[^>]*>(.*?)<\/td>\s*<td[^>]*>(?:(.*?)\s*\(([\d.]+)%\)|([\d.]+)%)\s*<\/td>\s*<\/tr>/gi;
        const items = [];
        let rowMatch;
        while ((rowMatch = rowRegex.exec(tableSlice)) !== null) {
          items.push({
            name: rowMatch[1].trim(),
            rarity: (rowMatch[2] || '').trim(),
            chance: parseFloat(rowMatch[3] || rowMatch[4])
          });
        }
        const chanceSum = Number(items.reduce((acc, it) => acc + (it.chance || 0), 0).toFixed(4));
        recallTenZeroTables.push({
          header: headerText,
          weekNum,
          items,
          chanceSum
        });
      }
    } catch (err) {
      console.warn('[build] 解析 de_droptables.html 失败:', err.message);
    }
  }

  // 读取 status-overrides.json (A3)
  const statusOverridesPath = path.join(CONFIG_DIR, 'status-overrides.json');
  let statusOverrides = { relics: {} };
  if (fs.existsSync(statusOverridesPath)) {
    try {
      statusOverrides = JSON.parse(fs.readFileSync(statusOverridesPath, 'utf8'));
    } catch (e) {
      console.warn('[build] 读取 status-overrides.json 出错:', e.message);
    }
  }

  // 加载或生成 config/zh-map.json
  const zhMapPath = path.join(CONFIG_DIR, 'zh-map.json');
  let zhMap = null;
  if (fs.existsSync(zhMapPath)) {
    try {
      zhMap = JSON.parse(fs.readFileSync(zhMapPath, 'utf8'));
      console.log(`[build] 已成功读取中文映射表 config/zh-map.json (物品数: ${Object.keys(zhMap.items || {}).length})`);
    } catch (e) {
      console.warn('[build] 读取 zh-map.json 出错，尝试重构:', e.message);
    }
  }

  if (!zhMap && fs.existsSync(rawDir)) {
    try {
      zhMap = await buildZhMap(rawDir);
    } catch (e) {
      console.warn('[build] 自动生成 zh-map.json 失败:', e.message);
    }
  }

  if (!zhMap) {
    zhMap = { planets: {}, missionTypes: {}, nodes: {}, enemies: {}, bounties: {}, transientSources: {}, items: {}, abbreviatedCorrections: [] };
  }

  function lookupItem(baseName, rawItemName = null) {
    if (!baseName) return { itemZh: '', zhSource: 'en_fallback' };
    const m = zhMap.items?.[baseName] || (rawItemName ? zhMap.items?.[rawItemName] : null);
    if (m) {
      return {
        itemZh: m.nameZh,
        zhSource: m.zhSource,
        ...(m.zhSegments ? { zhSegments: m.zhSegments } : {})
      };
    }
    return { itemZh: baseName, zhSource: 'en_fallback' };
  }

  // 构建 WFM 索引
  const wfmBySlug = new Map();
  const wfmByEnName = new Map();
  if (fs.existsSync(wfmPath)) {
    try {
      const wfmData = JSON.parse(fs.readFileSync(wfmPath, 'utf8'));
      const list = wfmData.data || (Array.isArray(wfmData) ? wfmData : []);
      for (const item of list) {
        if (item.slug) wfmBySlug.set(item.slug, item);
        if (item.i18n?.en?.name) {
          wfmByEnName.set(item.i18n.en.name.toLowerCase().trim(), item);
        }
      }
      console.log(`[build] 已加载 warframe.market 数据 (条目数: ${wfmBySlug.size})`);
    } catch (err) {
      console.warn(`[build] 解析 wfm_items_v2.json 出错:`, err.message);
    }
  }

  // 1. 扫描当前 DE 掉落表中的现存遗物
  const droppingRelics = new Set();
  const directDrops = new Map();

  function checkRelicItem(itemName) {
    if (!itemName || typeof itemName !== 'string') return;
    const { baseName } = parseQuantityAndName(itemName);
    const m = baseName.match(/\b(Lith|Meso|Neo|Axi|Requiem|Vanguard)\s+([A-Za-z0-9]+)\s+Relic\b/i);
    if (m) {
      droppingRelics.add(`${m[1]} ${m[2]}`.toUpperCase());
    }
  }

  function addDirectDrop(itemName, drop) {
    if (!itemName) return;
    if (!directDrops.has(itemName)) directDrops.set(itemName, []);
    directDrops.get(itemName).push(drop);

    const { baseName } = parseQuantityAndName(itemName);
    if (baseName && baseName !== itemName) {
      if (!directDrops.has(baseName)) directDrops.set(baseName, []);
      directDrops.get(baseName).push(drop);
    }
  }

  // 2. 匹配 DE 物品名称到 WFM 物品（支持去除 "NX " 数量前缀）
  function matchMarketItem(rawName) {
    if (!rawName || typeof rawName !== 'string') return null;
    const { quantity, baseName } = parseQuantityAndName(rawName);
    const lower = baseName.toLowerCase();

    // 1) 未开紫卡
    if (VEILED_RIVEN_NAME_MAP[lower]) {
      const slug = VEILED_RIVEN_NAME_MAP[lower];
      const item = wfmBySlug.get(slug);
      return { item, slug, category: 'riven', quantity, baseName };
    }

    // 2) 直接名称匹配
    let item = wfmByEnName.get(lower);
    if (!item && !lower.startsWith('arcane ')) {
      item = wfmByEnName.get('arcane ' + lower);
    }

    if (item) {
      let category = 'other';
      if (item.tags?.includes('arcane_enhancement')) category = 'arcane';
      else if (item.tags?.includes('mod')) category = 'mod';
      else if (item.tags?.includes('veiled_riven')) category = 'riven';
      else if (item.tags?.includes('prime')) category = 'relic';
      return { item, slug: item.slug, category, quantity, baseName };
    }

    return null;
  }

  // 3. 收集所有掉落来源统一进入 sources 列表
  const sourcesResult = [];
  const unmatchedSet = new Map(); // name -> Array of places

  function recordUnmatched(name, place) {
    if (!name) return;
    if (!unmatchedSet.has(name)) unmatchedSet.set(name, []);
    if (unmatchedSet.get(name).length < 5) {
      unmatchedSet.get(name).push(place);
    }
  }

  // A. 扫描 missionRewards
  const mr = dropsAll.missionRewards || {};
  const seenSourceIds = new Map();

  function sanitizeSourceId(id) {
    if (!id) return 'source';
    return String(id)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'source';
  }

  function registerUniqueSourceId(baseId) {
    const cleanBase = sanitizeSourceId(baseId);
    if (!seenSourceIds.has(cleanBase)) {
      seenSourceIds.set(cleanBase, 1);
      return cleanBase;
    }
    const next = seenSourceIds.get(cleanBase) + 1;
    seenSourceIds.set(cleanBase, next);
    return `${cleanBase}_${next}`;
  }

  // 严格检测上游同一段奖励列表 (名称+掉率+轮次相同) 整体重复 k 次
  function findExactRepeats(list) {
    if (!Array.isArray(list)) return null;
    const n = list.length;
    if (n <= 1) return null;
    for (let m = 2; m <= Math.floor(n / 2); m++) {
      if (n % m !== 0) continue;
      const k = n / m;
      let match = true;
      for (let i = 0; i < m; i++) {
        const base = list[i];
        for (let t = 1; t < k; t++) {
          const other = list[t * m + i];
          const nameA = base.itemName || base.modName;
          const nameB = other.itemName || other.modName;
          if (nameA !== nameB || base.chance !== other.chance || (base.rotation || null) !== (other.rotation || null)) {
            match = false;
            break;
          }
        }
        if (!match) break;
      }
      if (match) {
        return { k, m, singleBlock: list.slice(0, m) };
      }
    }
    return null;
  }

  const ENDLESS_GAME_MODES = new Set([
    'Survival', 'Defense', 'Interception', 'Excavation',
    'Defection', 'Infested Salvage', 'Sanctuary Onslaught',
    'Alchemy', 'Void Flood', 'Void Cascade', 'Void Armageddon', 'The Circuit'
  ]);

  for (const [planet, nodes] of Object.entries(mr)) {
    const planetMap = zhMap.planets?.[planet];
    const planetZh = planetMap?.nameZh || PLANET_ZH_MAP[planet] || planet;
    const planetZhSource = planetMap?.zhSource || 'composed:planet';

    for (const [node, nodeData] of Object.entries(nodes || {})) {
      const gameMode = nodeData.gameMode || '';
      const modeMap = zhMap.missionTypes?.[gameMode];
      const modeZh = modeMap?.nameZh || GAMEMODE_ZH_MAP[gameMode] || gameMode;
      const modeZhSource = modeMap?.zhSource || 'en_fallback';

      const nodeKey = `${planet}:${node}`;
      const nodeMap = zhMap.nodes?.[nodeKey];
      const nodeZh = nodeMap?.nameZh || `${node} (${planetZh})`;
      const nodeZhSource = nodeMap?.zhSource || 'composed:node';

      const rews = nodeData.rewards;

      const processRewardList = (rawRewardList, rotation = null) => {
        let rewardList = rawRewardList;
        let dedupedRepeats = null;
        let dedupeNote = null;
        let boundaryFix = null;
        let isContaminated = false;

        // Duviri 钢铁重复奖励跨表头串入修正 (Decision 1)
        if (planet === 'Duviri' && node === 'Endless: Repeated Rewards (Hard)') {
          let verified = false;
          if (duviriHtmlSteelRepeated && duviriHtmlSteelRepeated.items.length === 11 && rawRewardList.length >= 11) {
            let matchesFingerprint = true;
            for (let i = 0; i < 11; i++) {
              const jsonItem = rawRewardList[i];
              const htmlItem = duviriHtmlSteelRepeated.items[i];
              const jsonName = jsonItem.itemName || jsonItem.modName;
              if (jsonName !== htmlItem.name || Math.abs(Number(jsonItem.chance) - htmlItem.chance) > 0.001) {
                matchesFingerprint = false;
                break;
              }
            }
            if (matchesFingerprint) {
              verified = true;
              boundaryFix = {
                source: 'de_droptables.html',
                header: duviriHtmlSteelRepeated.header,
                originalCount: rawRewardList.length,
                keptCount: 11
              };
              rewardList = rawRewardList.slice(0, 11);
            }
          }

          if (!verified) {
            // 校验失败（或缺少 HTML 导致无法校验）：保留原数据，但强制 expectedValue 为 null、contaminated: true、退出收益排序
            rewardList = rawRewardList;
            isContaminated = true;
          }
        }

        const repeats = findExactRepeats(rewardList);
        if (repeats) {
          rewardList = repeats.singleBlock;
          dedupedRepeats = repeats.k;
          dedupeNote = `上游数据包含 ${repeats.k} 份完全相同的奖励列表 (${repeats.m} 项)，已去重为 1 份`;
        }

        const baseSourceId = `mission_${planet.toLowerCase()}_${node.toLowerCase()}${rotation ? `_${rotation.toLowerCase()}` : ''}`.replace(/[^a-z0-9_]+/g, '_');
        const sourceId = registerUniqueSourceId(baseSourceId);

        // A1 & B11: 拆分节点基础显示名与难度字段（不做全局字符串替换，保留原 node 键和来源 id 不变）
        const hasHardSuffix = /\s*\(Hard\)$/i.test(node);
        const isGameModeHard = /^Hard$/i.test((gameMode || '').trim());
        const isHardDuplicate = hasHardSuffix && isGameModeHard;
        const nodeBaseEn = isHardDuplicate ? node.replace(/\s*\(Hard\)$/i, '').trim() : node;

        const nameEn = isHardDuplicate
          ? `${planet} - ${nodeBaseEn} (${gameMode})${rotation ? ` [Rot ${rotation}]` : ''}`
          : `${planet} - ${node} (${gameMode})${rotation ? ` [Rot ${rotation}]` : ''}`;

        // A1: nodeZh 已是 DE 名时，nameZh 使用 nodeZh（如 水星 - 阿波罗多罗斯撞击坑 (生存) [轮次 A]）；未对齐节点保持原样
        const isDeAligned = Boolean(nodeMap?.deAligned || (nodeMap?.zhSource && nodeMap.zhSource.startsWith('de_export:ExportRegions_zh')));
        let nodeDisplayZh = node;
        if (isDeAligned && nodeMap?.nameZh) {
          nodeDisplayZh = nodeMap.nameZh;
        } else if (isHardDuplicate) {
          nodeDisplayZh = nodeBaseEn;
        }

        const nameZh = `${planetZh} - ${nodeDisplayZh} (${modeZh})${rotation ? ` [轮次 ${rotation}]` : ''}`;
        const sourceZhSource = nodeMap?.zhSource || 'composed:mission_rewards';
        
        const processedRewards = [];
        for (const r of rewardList) {
          checkRelicItem(r.itemName);
          addDirectDrop(r.itemName, { place: nameEn, rotation, chance: r.chance, rarity: r.rarity });

          const matched = matchMarketItem(r.itemName);
          const { quantity, baseName } = parseQuantityAndName(r.itemName);
          const itemLookup = lookupItem(baseName, r.itemName);

          let itemZh = itemLookup.itemZh;
          let itemZhSource = itemLookup.zhSource;
          let slug = null;
          let category = 'other';

          if (matched) {
            slug = matched.slug;
            category = matched.category;
            if (itemZhSource === 'en_fallback' && matched.item?.i18n?.['zh-hans']?.name) {
              itemZh = matched.item.i18n['zh-hans'].name;
              itemZhSource = `warframe_market:${matched.slug}`;
            }
          } else {
            recordUnmatched(r.itemName, nameEn);
          }

          processedRewards.push({
            itemName: r.itemName,
            baseName,
            quantity,
            itemZh,
            zhSource: itemZhSource,
            slug,
            category,
            chance: r.chance ?? null,
            rarity: r.rarity || 'Common',
            rotation: rotation || null
          });
        }

        const srcObj = {
          id: sourceId,
          type: 'mission',
          nameEn,
          nameZh,
          zhSource: sourceZhSource,
          planet,
          planetZh,
          planetZhSource,
          node,
          nodeZh,
          nodeZhSource,
          gameMode,
          gameModeZh: modeZh,
          gameModeZhSource: modeZhSource,
          rotation,
          rewards: processedRewards
        };

        if (boundaryFix) {
          srcObj.boundaryFix = boundaryFix;
          srcObj.contaminated = false;
        }
        if (isContaminated) {
          srcObj.contaminated = true;
          srcObj.expectedValue = null;
          srcObj.expectedValueRaw = null;
          srcObj.expectedValueConfident = null;
          srcObj.expectedValueConfidentRaw = null;
        }


        if (dedupedRepeats) {
          srcObj.dedupedRepeats = dedupedRepeats;
          srcObj.dedupeNote = dedupeNote;
        }

        sourcesResult.push(srcObj);
      };

      if (Array.isArray(rews)) {
        processRewardList(rews, null);
      } else if (rews && typeof rews === 'object') {
        for (const [rot, list] of Object.entries(rews)) {
          if (Array.isArray(list)) {
            processRewardList(list, rot);
          }
        }
      }
    }
  }

  // B. 扫描 enemyModTables
  for (const em of dropsAll.enemyModTables || []) {
    const enemyName = em.enemyName || 'Unknown Enemy';
    const rawDropChance = em.enemyModDropChance || em.ememyModDropChance || 0;
    const dropChanceNum = typeof rawDropChance === 'number'
      ? rawDropChance
      : (Number.isFinite(parseFloat(rawDropChance)) ? parseFloat(rawDropChance) : 0);
    const baseSourceId = `enemy_${enemyName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`.replace(/^_+|_+$/g, '');
    const sourceId = registerUniqueSourceId(baseSourceId);

    const enemyMapping = zhMap.enemies?.[enemyName];
    const enemyZh = enemyMapping?.nameZh || enemyName;
    const enemyZhSource = enemyMapping?.zhSource || 'en_fallback';

    const nameEn = `Enemy: ${enemyName}`;
    const nameZh = `敌人: ${enemyZh}`;
    const sourceZhSource = enemyZhSource.startsWith('en_') ? enemyZhSource : `composed:enemy:${enemyZhSource}`;

    let modsList = em.mods || [];
    let dedupedRepeats = null;
    let dedupeNote = null;
    const repeats = findExactRepeats(modsList);
    if (repeats) {
      modsList = repeats.singleBlock;
      dedupedRepeats = repeats.k;
      dedupeNote = `上游数据包含 ${repeats.k} 份完全相同的奖励列表 (${repeats.m} 项)，已去重为 1 份`;
    }

    const processedMods = [];
    for (const m of modsList) {
      const matched = matchMarketItem(m.modName);
      const { quantity, baseName } = parseQuantityAndName(m.modName);
      const itemLookup = lookupItem(baseName, m.modName);

      let itemZh = itemLookup.itemZh;
      let itemZhSource = itemLookup.zhSource;
      let slug = null;
      let category = 'mod';

      if (matched) {
        slug = matched.slug;
        category = matched.category;
        if (itemZhSource === 'en_fallback' && matched.item?.i18n?.['zh-hans']?.name) {
          itemZh = matched.item.i18n['zh-hans'].name;
          itemZhSource = `warframe_market:${matched.slug}`;
        }
      } else {
        recordUnmatched(m.modName, nameEn);
      }

      processedMods.push({
        itemName: m.modName,
        baseName,
        quantity,
        itemZh,
        zhSource: itemZhSource,
        slug,
        category,
        chance: m.chance ?? null,
        rarity: m.rarity || 'Common'
      });
    }

    const srcObj = {
      id: sourceId,
      type: 'enemy',
      nameEn,
      nameZh,
      zhSource: sourceZhSource,
      enemyName,
      enemyNameZh: enemyZh,
      enemyNameZhSource: enemyZhSource,
      enemyModDropChance: dropChanceNum,
      rewards: processedMods
    };

    if (dedupedRepeats) {
      srcObj.dedupedRepeats = dedupedRepeats;
      srcObj.dedupeNote = dedupeNote;
    }

    sourcesResult.push(srcObj);
  }

  // C. 扫描六类赏金
  const bountyTableDefs = [
    { key: 'cetusBountyRewards', label: 'Cetus Bounty (希图斯赏金)' },
    { key: 'solarisBountyRewards', label: 'Solaris Bounty (索拉里斯/奥布山谷赏金)' },
    { key: 'deimosRewards', label: 'Deimos Bounty (火卫二赏金)' },
    { key: 'zarimanRewards', label: 'Zariman (扎里曼任务)' },
    { key: 'entratiLabRewards', label: 'Entrati Lab (阿尔布雷希特实验室)' },
    { key: 'hexRewards', label: 'Hex (霍瓦尼亚 1999)' }
  ];

  for (const tbl of bountyTableDefs) {
    const list = dropsAll[tbl.key];
    if (!Array.isArray(list)) continue;

    for (const bounty of list) {
      const bountyLevel = bounty.bountyLevel || 'Unknown Bounty';
      const cleanLevel = bountyLevel.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

      const bountyMapping = zhMap.bounties?.[bountyLevel];
      const bountyZh = bountyMapping?.nameZh || bountyLevel;
      const bountyZhSource = bountyMapping?.zhSource || 'composed:bounty_title';

      for (const rot of ['A', 'B', 'C']) {
        const rotRewards = bounty.rewards?.[rot];
        if (!Array.isArray(rotRewards) || rotRewards.length === 0) continue;

        const stageMap = new Map();
        for (const item of rotRewards) {
          const stage = item.stage || 'Stage 1';
          if (!stageMap.has(stage)) stageMap.set(stage, []);
          stageMap.get(stage).push(item);
        }

        for (const [stage, stageItems] of stageMap.entries()) {
          const cleanStage = stage.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
          const stageMatch = stage.match(/^Stage\s+(\d+)$/i);
          const stageZh = stageMatch ? `阶段 ${stageMatch[1]}` : stage;
          const baseSourceId = `source_bounty_${cleanLevel}_${rot.toLowerCase()}_${cleanStage}`;
          const sourceId = registerUniqueSourceId(baseSourceId);

          const nameEn = `${bountyLevel} [Rot ${rot}] (${stage})`;
          const nameZh = `${bountyZh} [轮次 ${rot}] (${stageZh})`;
          const sourceZhSource = bountyZhSource;

          let itemsToProcess = stageItems;
          let dedupedRepeats = null;
          let dedupeNote = null;
          const repeats = findExactRepeats(stageItems);
          if (repeats) {
            itemsToProcess = repeats.singleBlock;
            dedupedRepeats = repeats.k;
            dedupeNote = `上游数据包含 ${repeats.k} 份完全相同的奖励列表 (${repeats.m} 项)，已去重为 1 份`;
          }

          const processed = [];
          for (const item of itemsToProcess) {
            const itemName = item.itemName || item.modName;
            if (!itemName) continue;

            checkRelicItem(itemName);
            addDirectDrop(itemName, { place: nameEn, rotation: rot, stage, chance: item.chance, rarity: item.rarity });

            const matched = matchMarketItem(itemName);
            const { quantity, baseName } = parseQuantityAndName(itemName);
            const itemLookup = lookupItem(baseName, itemName);

            let itemZh = itemLookup.itemZh;
            let itemZhSource = itemLookup.zhSource;
            let slug = null;
            let category = 'other';

            if (matched) {
              slug = matched.slug;
              category = matched.category;
              if (itemZhSource === 'en_fallback' && matched.item?.i18n?.['zh-hans']?.name) {
                itemZh = matched.item.i18n['zh-hans'].name;
                itemZhSource = `warframe_market:${matched.slug}`;
              }
            } else {
              recordUnmatched(itemName, nameEn);
            }

            processed.push({
              itemName,
              baseName,
              quantity,
              itemZh,
              zhSource: itemZhSource,
              slug,
              category,
              chance: item.chance ?? null,
              rarity: item.rarity || 'Common',
              stage,
              rotation: rot
            });
          }

          if (processed.length > 0) {
            const srcObj = {
              id: sourceId,
              type: 'bounty',
              nameEn,
              nameZh,
              zhSource: sourceZhSource,
              bountyLevel,
              bountyLevelZh: bountyZh,
              bountyLevelZhSource: bountyZhSource,
              rotation: rot,
              stage,
              rewards: processed
            };
            if (dedupedRepeats) {
              srcObj.dedupedRepeats = dedupedRepeats;
              srcObj.dedupeNote = dedupeNote;
            }
            sourcesResult.push(srcObj);
          }
        }
      }
    }
  }

  // D. 扫描 transientRewards
  for (const tr of dropsAll.transientRewards || []) {
    const objectiveName = tr.objectiveName || 'Transient Reward';
    const cleanObj = objectiveName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    const rawRewards = Array.isArray(tr.rewards) ? tr.rewards : [];
    if (rawRewards.length === 0) continue;

    const trMapping = zhMap.transientSources?.[objectiveName];
    const objZh = trMapping?.nameZh || objectiveName;
    const objZhSource = trMapping?.zhSource || 'en_fallback';

    const rots = Array.from(new Set(rawRewards.map(r => r.rotation).filter(Boolean)));

    if (rots.length > 0) {
      for (const rot of rots) {
        const rotRewards = rawRewards.filter(r => r.rotation === rot);
        const baseSourceId = `source_transient_${cleanObj}_${rot.toLowerCase()}`;
        const sourceId = registerUniqueSourceId(baseSourceId);
        const nameEn = `${objectiveName} [Rot ${rot}]`;
        const nameZh = `${objZh} [轮次 ${rot}]`;
        const sourceZhSource = objZhSource;

        let itemsToProcess = rotRewards;
        let dedupedRepeats = null;
        let dedupeNote = null;
        const repeats = findExactRepeats(rotRewards);
        if (repeats) {
          itemsToProcess = repeats.singleBlock;
          dedupedRepeats = repeats.k;
          dedupeNote = `上游数据包含 ${repeats.k} 份完全相同的奖励列表 (${repeats.m} 项)，已去重为 1 份`;
        }

        const processed = [];
        for (const item of itemsToProcess) {
          const itemName = item.itemName || item.modName;
          if (!itemName) continue;

          checkRelicItem(itemName);
          addDirectDrop(itemName, { place: nameEn, rotation: rot, chance: item.chance, rarity: item.rarity });

          const matched = matchMarketItem(itemName);
          const { quantity, baseName } = parseQuantityAndName(itemName);
          const itemLookup = lookupItem(baseName, itemName);

          let itemZh = itemLookup.itemZh;
          let itemZhSource = itemLookup.zhSource;
          let slug = null;
          let category = 'other';

          if (matched) {
            slug = matched.slug;
            category = matched.category;
            if (itemZhSource === 'en_fallback' && matched.item?.i18n?.['zh-hans']?.name) {
              itemZh = matched.item.i18n['zh-hans'].name;
              itemZhSource = `warframe_market:${matched.slug}`;
            }
          } else {
            recordUnmatched(itemName, nameEn);
          }

          processed.push({
            itemName,
            baseName,
            quantity,
            itemZh,
            zhSource: itemZhSource,
            slug,
            category,
            chance: item.chance ?? null,
            rarity: item.rarity || 'Common',
            rotation: rot,
            stage: item.stage || null
          });
        }

        if (processed.length > 0) {
          const srcObj = {
            id: sourceId,
            type: 'transient',
            nameEn,
            nameZh,
            zhSource: sourceZhSource,
            rotation: rot,
            rewards: processed
          };

          if (objectiveName === 'Arbitrations') {
            srcObj.rotationPattern = '仲裁轮次通常为 AABBCCCC…（不套用 AABC）';
          }
          if (dedupedRepeats) {
            srcObj.dedupedRepeats = dedupedRepeats;
            srcObj.dedupeNote = dedupeNote;
          }
          sourcesResult.push(srcObj);
        }
      }
    } else {
      const baseSourceId = `source_transient_${cleanObj}`;
      const sourceId = registerUniqueSourceId(baseSourceId);
      const nameEn = objectiveName;
      const nameZh = objZh;
      const sourceZhSource = objZhSource;

      let itemsToProcess = rawRewards;
      let dedupedRepeats = null;
      let dedupeNote = null;
      const repeats = findExactRepeats(rawRewards);
      if (repeats) {
        itemsToProcess = repeats.singleBlock;
        dedupedRepeats = repeats.k;
        dedupeNote = `上游数据包含 ${repeats.k} 份完全相同的奖励列表 (${repeats.m} 项)，已去重为 1 份`;
      }

      const processed = [];
      for (const item of itemsToProcess) {
        const itemName = item.itemName || item.modName;
        if (!itemName) continue;

        checkRelicItem(itemName);
        addDirectDrop(itemName, { place: nameEn, rotation: null, chance: item.chance, rarity: item.rarity });

        const matched = matchMarketItem(itemName);
        const { quantity, baseName } = parseQuantityAndName(itemName);
        const itemLookup = lookupItem(baseName, itemName);

        let itemZh = itemLookup.itemZh;
        let itemZhSource = itemLookup.zhSource;
        let slug = null;
        let category = 'other';

        if (matched) {
          slug = matched.slug;
          category = matched.category;
          if (itemZhSource === 'en_fallback' && matched.item?.i18n?.['zh-hans']?.name) {
            itemZh = matched.item.i18n['zh-hans'].name;
            itemZhSource = `warframe_market:${matched.slug}`;
          }
        } else {
          recordUnmatched(itemName, nameEn);
        }

        processed.push({
          itemName,
          baseName,
          quantity,
          itemZh,
          zhSource: itemZhSource,
          slug,
          category,
          chance: item.chance ?? null,
          rarity: item.rarity || 'Common',
          rotation: null,
          stage: item.stage || null
        });
      }

      if (processed.length > 0) {
        const srcObj = {
          id: sourceId,
          type: 'transient',
          nameEn,
          nameZh,
          zhSource: sourceZhSource,
          rewards: processed
        };
        if (dedupedRepeats) {
          srcObj.dedupedRepeats = dedupedRepeats;
          srcObj.dedupeNote = dedupeNote;
        }
        sourcesResult.push(srcObj);
      }
    }
  }

  // E. 收录 Recall: Ten-Zero 历史活动组（共 5 周独立来源，Codex Decision 8）
  for (const tbl of recallTenZeroTables) {
    const baseSourceId = `event_recall_ten_zero_week_${tbl.weekNum}`;
    const sourceId = registerUniqueSourceId(baseSourceId);
    const nameEn = tbl.header;
    const nameZh = tbl.header;
    const sourceZhSource = 'en_fallback';

    const processed = [];
    for (const item of tbl.items) {
      checkRelicItem(item.name);
      addDirectDrop(item.name, { place: nameEn, rotation: null, chance: item.chance, rarity: item.rarity });

      const matched = matchMarketItem(item.name);
      const { quantity, baseName } = parseQuantityAndName(item.name);
      const itemLookup = lookupItem(baseName, item.name);

      let itemZh = itemLookup.itemZh;
      let itemZhSource = itemLookup.zhSource;
      let slug = null;
      let category = 'other';

      if (matched) {
        slug = matched.slug;
        category = matched.category;
        if (itemZhSource === 'en_fallback' && matched.item?.i18n?.['zh-hans']?.name) {
          itemZh = matched.item.i18n['zh-hans'].name;
          itemZhSource = `warframe_market:${matched.slug}`;
        }
      } else {
        recordUnmatched(item.name, nameEn);
      }

      processed.push({
        itemName: item.name,
        baseName,
        quantity,
        itemZh,
        zhSource: itemZhSource,
        slug,
        category,
        chance: item.chance ?? null,
        rarity: item.rarity || 'Common',
        rotation: null,
        stage: null
      });
    }

    if (processed.length > 0) {
      const srcObj = {
        id: sourceId,
        type: 'transient',
        historicalEvent: true,
        eventGroup: 'recall_ten_zero',
        eventGroupName: 'Recall: Ten-Zero',
        eventGroupNameZh: 'Recall: Ten-Zero',
        officialNoticeUrl: 'https://www.warframe.com/en/news/rappel-ten-zero',
        officialNoticeQuote: 'The next phase of our 10-Year Anniversary begins July 19 with Recall: Ten-Zero! ... leading up to TennoCon 2023 on August 26 ... only the third Mission in each weekly sequence will grant a new Reward',
        nameEn,
        nameZh,
        zhSource: sourceZhSource,
        fingerprint: {
          header: tbl.header,
          rowCount: tbl.items.length,
          probabilitySum: tbl.chanceSum
        },
        rewards: processed
      };
      sourcesResult.push(srcObj);
    }
  }

  // E. 扫描 sortieRewards (突击任务)
  if (Array.isArray(dropsAll.sortieRewards) && dropsAll.sortieRewards.length > 0) {
    const baseSourceId = 'source_sortie_sortie';
    const sourceId = registerUniqueSourceId(baseSourceId);
    const nameEn = 'Sortie (突击任务)';
    const nameZh = 'Sortie (突击任务)';
    const sourceZhSource = 'composed:sortie';

    const processed = [];
    for (const item of dropsAll.sortieRewards) {
      const itemName = item.itemName || item.modName;
      if (!itemName) continue;

      checkRelicItem(itemName);
      addDirectDrop(itemName, { place: nameEn, rotation: null, chance: item.chance, rarity: item.rarity });

      const matched = matchMarketItem(itemName);
      const { quantity, baseName } = parseQuantityAndName(itemName);
      const itemLookup = lookupItem(baseName, itemName);

      let itemZh = itemLookup.itemZh;
      let itemZhSource = itemLookup.zhSource;
      let slug = null;
      let category = 'other';

      if (matched) {
        slug = matched.slug;
        category = matched.category;
        if (itemZhSource === 'en_fallback' && matched.item?.i18n?.['zh-hans']?.name) {
          itemZh = matched.item.i18n['zh-hans'].name;
          itemZhSource = `warframe_market:${matched.slug}`;
        }
      } else {
        recordUnmatched(itemName, nameEn);
      }

      processed.push({
        itemName,
        baseName,
        quantity,
        itemZh,
        zhSource: itemZhSource,
        slug,
        category,
        chance: item.chance ?? null,
        rarity: item.rarity || 'Common'
      });
    }

    if (processed.length > 0) {
      sourcesResult.push({
        id: sourceId,
        type: 'sortie',
        nameEn,
        nameZh,
        zhSource: sourceZhSource,
        rewards: processed
      });
    }
  }

  // 概率和核对与舍入兼容豁免
  for (const src of sourcesResult) {
    const sum = Number((src.rewards || []).reduce((acc, r) => {
      const c = typeof r.chance === 'number' ? r.chance : (parseFloat(r.chance) || 0);
      return acc + c;
    }, 0).toFixed(4));
    src.probabilitySum = sum;
    if (sum > 100.15) {
      src.probabilityCheck = 'over';
    } else if (sum < 99.85) {
      src.probabilityCheck = 'under';
    } else {
      src.probabilityCheck = 'ok';
    }

    // 普通难度 Tier 1/3（150×0.67%=100.50%）舍入兼容核验 (Decision 1)
    // 仅在行结构已核对（全部等概率且 N×0.005 >= 偏差）时豁免，不得普遍豁免超额表
    if (src.planet === 'Duviri' && (src.node === 'Endless: Tier 1' || src.node === 'Endless: Tier 3')) {
      const rews = src.rewards || [];
      const N = rews.length;
      if (N > 0) {
        const firstChance = rews[0].chance;
        const allEqual = rews.every(r => r.chance === firstChance);
        const deviation = Math.abs(sum - 100);
        const maxRoundingDeviation = Number((N * 0.005).toFixed(4)); // 两位小数舍入上限 (本例 150 * 0.005 = 0.75)
        if (allEqual && maxRoundingDeviation >= deviation) {
          src.roundingCompatible = true;
          src.roundingNote = `全部 ${N} 项等概率 (${firstChance}%)，两位小数最大舍入偏差 ${N}×0.005 = ${maxRoundingDeviation.toFixed(2)} 个百分点 ≥ ${deviation.toFixed(2)} 个百分点偏差，与逐项舍入兼容，保留原值不归一化`;
        }
      }
    }
  }

  // 标记每条来源的 isPvp 属性
  for (const src of sourcesResult) {
    src.isPvp = isPvpSource(src);
  }
  const pvpSourcesCount = sourcesResult.filter(s => s.isPvp).length;

  console.log(`[build] 汇总全部掉落来源记录数: ${sourcesResult.length} (其中 PvP 来源数: ${pvpSourcesCount})`);

  // 4. 构建赋能 (arcanes)、紫卡 (rivens)、Mod 数据集
  const arcanesResult = [];
  const rivensResult = [];
  const modsResult = [];

  // 反向索引：slug -> 所有来源列表
  const slugSourcesMap = new Map();
  for (const src of sourcesResult) {
    for (const r of src.rewards) {
      if (r.slug) {
        if (!slugSourcesMap.has(r.slug)) slugSourcesMap.set(r.slug, []);
        slugSourcesMap.get(r.slug).push({
          sourceId: src.id,
          sourceType: src.type,
          nameEn: src.nameEn,
          nameZh: src.nameZh,
          zhSource: src.zhSource,
          rotation: src.rotation || null,
          stage: src.stage || r.stage || null,
          bountyLevel: src.bountyLevel || null,
          chance: r.chance,
          quantity: r.quantity || 1,
          rarity: r.rarity,
          enemyModDropChance: src.enemyModDropChance ?? null
        });
      }
    }
  }

  // 整理紫卡 (Veiled Rivens)
  for (const [deName, slug] of Object.entries(VEILED_RIVEN_NAME_MAP)) {
    const wfmItem = wfmBySlug.get(slug);
    const dropSources = slugSourcesMap.get(slug) || [];
    const rivenMapping = zhMap.items?.[wfmItem?.i18n?.en?.name] || zhMap.items?.[deName];
    const rivenZh = rivenMapping?.nameZh || wfmItem?.i18n?.['zh-hans']?.name || deName;
    const rivenZhSource = rivenMapping?.zhSource || (wfmItem?.i18n?.['zh-hans']?.name ? `warframe_market:${slug}` : 'en_fallback');

    rivensResult.push({
      id: slug,
      slug,
      name: wfmItem?.i18n?.en?.name || deName,
      zhName: rivenZh,
      zhSource: rivenZhSource,
      tags: wfmItem?.tags || ['mod', 'riven_mod', 'veiled_riven'],
      dropSources
    });
  }

  // 整理赋能 (Arcanes)
  for (const item of wfmBySlug.values()) {
    if (item.tags?.includes('arcane_enhancement')) {
      const dropSources = slugSourcesMap.get(item.slug) || [];
      const arcMapping = zhMap.items?.[item.i18n?.en?.name] || zhMap.items?.[item.slug];
      const arcZh = arcMapping?.nameZh || item.i18n?.['zh-hans']?.name || item.slug;
      const arcZhSource = arcMapping?.zhSource || (item.i18n?.['zh-hans']?.name ? `warframe_market:${item.slug}` : 'en_fallback');

      arcanesResult.push({
        id: item.slug,
        slug: item.slug,
        name: item.i18n?.en?.name || item.slug,
        zhName: arcZh,
        zhSource: arcZhSource,
        maxRank: item.maxRank ?? 5,
        tags: item.tags,
        dropSources
      });
    }
  }

  // 整理 Mod
  const rivenSlugSet = new Set(rivensResult.map(r => r.slug));
  for (const item of wfmBySlug.values()) {
    const isVeiledRiven = rivenSlugSet.has(item.slug) ||
      item.tags?.includes('veiled_riven') ||
      item.tags?.includes('riven') ||
      item.tags?.includes('riven_mod') ||
      item.slug.includes('riven_mod_veiled');
    if (item.tags?.includes('mod') && !item.tags?.includes('arcane_enhancement') && !isVeiledRiven) {
      const dropSources = slugSourcesMap.get(item.slug);
      if (dropSources && dropSources.length > 0) {
        const modMapping = zhMap.items?.[item.i18n?.en?.name] || zhMap.items?.[item.slug];
        const modZh = modMapping?.nameZh || item.i18n?.['zh-hans']?.name || item.slug;
        const modZhSource = modMapping?.zhSource || (item.i18n?.['zh-hans']?.name ? `warframe_market:${item.slug}` : 'en_fallback');

        modsResult.push({
          id: item.slug,
          slug: item.slug,
          name: item.i18n?.en?.name || item.slug,
          zhName: modZh,
          zhSource: modZhSource,
          maxRank: item.maxRank ?? 3,
          tags: item.tags,
          dropSources
        });
      }
    }
  }

  console.log(`[build] 整理赋能条目: ${arcanesResult.length}`);
  console.log(`[build] 整理紫卡条目: ${rivensResult.length}`);
  console.log(`[build] 整理具掉落来源 Mod 条目: ${modsResult.length}`);

  // 5. 整理遗物数据 (含 A3: Requiem unlisted override)
  const relicsMetaMap = new Map();
  for (const r of relicsJson) {
    if (!r.rewards || r.rewards.length === 0) continue;
    const m = r.name?.match(/^(\S+)\s+(.*?)\s+(Intact|Exceptional|Flawless|Radiant)$/i);
    let tier = null, relicName = null, state = null;
    if (m) {
      tier = m[1]; relicName = m[2]; state = m[3].toLowerCase();
    } else if (r.name?.match(/^Requiem\s+Eterna\b/i)) {
      tier = 'Requiem'; relicName = 'ETERNA'; state = 'intact';
    } else {
      continue;
    }

    const key = `${tier.toUpperCase()}_${relicName.toUpperCase()}`;
    if (!relicsMetaMap.has(key)) {
      relicsMetaMap.set(key, {
        tier, relicName, states: {}, wfcdVaulted: r.vaulted !== false, uniqueName: r.uniqueName
      });
    }
    const group = relicsMetaMap.get(key);
    group.states[state] = r;
    if (r.uniqueName && (!group.uniqueName || state === 'intact')) group.uniqueName = r.uniqueName;
    if (r.vaulted !== undefined) group.wfcdVaulted = r.vaulted !== false;
  }

  const dropsRelicsMap = new Map();
  for (const dr of dropsAll.relics) {
    if (!dr.relicName) continue;
    const key = `${dr.tier.toUpperCase()}_${dr.relicName.toUpperCase()}`;
    if (!dropsRelicsMap.has(key)) dropsRelicsMap.set(key, { tier: dr.tier, relicName: dr.relicName, states: {} });
    dropsRelicsMap.get(key).states[(dr.state || 'Intact').toLowerCase()] = dr.rewards || [];
  }

  const relicsResult = [];
  const itemsResult = {};

  let obtainableCount = 0;
  let vaultedCount = 0;
  let unlistedCount = 0;
  let conflictCount = 0;

  for (const [key, dropsRelic] of dropsRelicsMap.entries()) {
    const tier = dropsRelic.tier;
    const relicName = dropsRelic.relicName;
    const tierZh = TIER_ZH_MAP[tier] || tier;
    const relicId = `${tier.toLowerCase()}_${relicName.toLowerCase()}`;
    const relicDisplayName = `${tier} ${relicName}`;

    // A3: 检查 status-overrides.json (Requiem I/II/III/IV)
    const override = statusOverrides.relics?.[relicId];

    let status = 'vaulted';
    let vaulted = true;
    let unlisted = false;
    let vaultedSource = 'de_droptables';
    let statusReason = null;
    let statusSource = null;

    const isObtainableInDrops = droppingRelics.has(`${tier} ${relicName}`.toUpperCase());

    if (override && override.status === 'unlisted') {
      status = 'unlisted';
      unlisted = true;
      vaulted = false;
      vaultedSource = override.source;
      statusReason = override.reason;
      statusSource = override.source;
      unlistedCount++;
      obtainableCount++;
    } else if (isObtainableInDrops) {
      status = 'obtainable';
      vaulted = false;
      vaultedSource = 'de_droptables';
      obtainableCount++;
    } else {
      status = 'vaulted';
      vaulted = true;
      vaultedSource = 'de_droptables';
      vaultedCount++;
    }

    const wfcdMeta = relicsMetaMap.get(key);
    const wfcdVaulted = wfcdMeta ? wfcdMeta.wfcdVaulted : true;
    
    // 冲突判定
    const conflict = !unlisted && (vaulted !== wfcdVaulted);
    if (conflict) conflictCount++;

    let conflictNote = null;
    if (conflict) {
      conflictNote = vaulted
        ? 'DE当前掉落表未见该遗物，但WFCD标记为未入库'
        : 'DE当前掉落表现存该遗物，但WFCD标记为已入库';
    }

    let zhName = null;
    let zhSource = null;
    if (wfcdMeta?.uniqueName && zhJson[wfcdMeta.uniqueName]?.name) {
      zhName = zhJson[wfcdMeta.uniqueName].name.trim();
      zhSource = `wfcd_i18n:${wfcdMeta.uniqueName}`;
    } else {
      zhName = `${tierZh} ${relicName} 遗物`;
      zhSource = 'composed:tier+relic';
    }

    const intactRewards = dropsRelic.states['intact'] || [];
    const exceptionalRewards = dropsRelic.states['exceptional'] || [];
    const flawlessRewards = dropsRelic.states['flawless'] || [];
    const radiantRewards = dropsRelic.states['radiant'] || [];

    const wfcdIntactRewards = wfcdMeta?.states['intact']?.rewards || [];

    function getRewardForSlot(targetList, itemName, slotIdx) {
      if (!targetList || targetList.length === 0) return null;
      if (targetList[slotIdx] && targetList[slotIdx].itemName === itemName) {
        return targetList[slotIdx];
      }
      let occurrence = 0;
      for (let i = 0; i < slotIdx; i++) {
        if (intactRewards[i]?.itemName === itemName) occurrence++;
      }
      const matches = targetList.filter(x => x.itemName === itemName);
      return matches[occurrence] || matches[0] || null;
    }

    const processedRewards = [];
    for (let slotIndex = 0; slotIndex < intactRewards.length; slotIndex++) {
      const rew = intactRewards[slotIndex];
      const itemName = rew.itemName;
      const { quantity, baseName } = parseQuantityAndName(itemName);

      const excRew = getRewardForSlot(exceptionalRewards, itemName, slotIndex);
      const flaRew = getRewardForSlot(flawlessRewards, itemName, slotIndex);
      const radRew = getRewardForSlot(radiantRewards, itemName, slotIndex);

      const chances = {
        intact: rew.chance ?? 0,
        exceptional: excRew ? excRew.chance : null,
        flawless: flaRew ? flaRew.chance : null,
        radiant: radRew ? radRew.chance : null
      };

      const rarity = rew.rarity || 'Common';

      let wfcdItem = null;
      if (wfcdIntactRewards[slotIndex] && (wfcdIntactRewards[slotIndex].item?.name === itemName || wfcdIntactRewards[slotIndex].item?.name === baseName)) {
        wfcdItem = wfcdIntactRewards[slotIndex].item;
      } else {
        let occurrence = 0;
        for (let i = 0; i < slotIndex; i++) {
          if (intactRewards[i]?.itemName === itemName) occurrence++;
        }
        const matches = wfcdIntactRewards.filter(x => x.item?.name === itemName || x.item?.name === baseName);
        wfcdItem = matches[occurrence]?.item || matches[0]?.item || null;
      }

      const uniqueName = wfcdItem?.uniqueName;
      let marketSlug = wfcdItem?.warframeMarket?.urlName || null;
      if (!marketSlug) {
        const marketMatch = matchMarketItem(baseName);
        if (marketMatch?.slug) {
          marketSlug = marketMatch.slug;
        }
      }

      let itemZhName = null;
      let itemZhSource = null;

      const itemLookup = lookupItem(baseName, itemName);
      if (itemLookup && itemLookup.zhSource !== 'en_fallback') {
        itemZhName = itemLookup.itemZh;
        itemZhSource = itemLookup.zhSource;
      } else {
        const wfcdRawZh = uniqueName ? zhJson[uniqueName]?.name?.trim() : null;
        const wfmItem = marketSlug ? wfmBySlug.get(marketSlug) : null;
        const wfmZh = wfmItem?.i18n?.['zh-hans']?.name?.trim();

        if (wfcdRawZh && !GENERIC_COMPONENT_NAMES.has(wfcdRawZh)) {
          itemZhName = wfcdRawZh;
          itemZhSource = uniqueName ? `wfcd_i18n:${uniqueName}` : 'wfcd_i18n';
        } else if (wfmZh) {
          itemZhName = wfmZh;
          itemZhSource = marketSlug ? `warframe_market:${marketSlug}` : 'warframe_market';
        } else if (wfcdRawZh) {
          itemZhName = wfcdRawZh;
          itemZhSource = uniqueName ? `wfcd_i18n:${uniqueName}` : 'wfcd_i18n';
        } else {
          itemZhName = baseName;
          itemZhSource = 'en_fallback';
        }
      }

      const rewardItem = {
        name: itemName,
        baseName,
        quantity,
        zhName: itemZhName,
        zhSource: itemZhSource,
        rarity,
        marketSlug,
        chances
      };

      if (relicId === 'requiem_eterna') {
        rewardItem.rawChance = 9.5;
        rewardItem.effectiveChance = 12.5;
        rewardItem.chanceOverride = {
          url: 'https://www.warframe.com/en/patch-notes/pc/42-0-0',
          verifiedOn: '2026-11-26',
          quote: "This Relic’s droptable only contains the 8 Requiem Mods (with equal chance for all), and cannot be refined with Void Traces.",
          derivation: '仅 8 项且等概率 ⇒ 每项 1/8 = 12.5%（推导，原文未直接写 12.5%）'
        };
      }

      processedRewards.push(rewardItem);

      const itemKey = marketSlug || baseName;
      if (!itemsResult[itemKey]) {
        itemsResult[itemKey] = {
          name: baseName,
          rawName: itemName,
          zhName: itemZhName,
          zhSource: itemZhSource,
          marketSlug,
          relics: [],
          directDrops: directDrops.get(itemName) || directDrops.get(baseName) || []
        };
      }

      itemsResult[itemKey].relics.push({
        relicId,
        relicName: relicDisplayName,
        relicZhName: zhName,
        tier,
        tierZh,
        status,
        vaulted,
        unlisted,
        conflict,
        rarity,
        quantity,
        chances
      });
    }

    const isEterna = relicId === 'requiem_eterna';
    const dataConflict = isEterna;
    const dataConflictNote = isEterna
      ? '资料冲突：DE 掉落表为 8 项×9.5%=76%，DE 更新说明为不可精炼、8 种等概率（12.5%）；本站按官方等概率规则推导 12.5% 计算有效期望并保留原始 9.5%'
      : null;
    const chanceOverride = isEterna
      ? {
          url: 'https://www.warframe.com/en/patch-notes/pc/42-0-0',
          verifiedOn: '2026-11-26',
          quote: "This Relic’s droptable only contains the 8 Requiem Mods (with equal chance for all), and cannot be refined with Void Traces.",
          derivation: '仅 8 项且等概率 ⇒ 每项 1/8 = 12.5%（推导，原文未直接写 12.5%）'
        }
      : null;

    relicsResult.push({
      id: relicId,
      tier,
      tierZh,
      name: relicDisplayName,
      zhName,
      zhSource,
      status,
      vaulted,
      unlisted,
      vaultedSource,
      statusReason,
      statusSource,
      wfcdVaulted,
      conflict,
      conflictNote,
      dataConflict,
      dataConflictNote,
      ...(chanceOverride ? { chanceOverride, rawProbabilitySum: 76, effectiveProbabilitySum: 100 } : {}),
      rewards: processedRewards
    });
  }

  const tierOrder = { Lith: 1, Meso: 2, Neo: 3, Axi: 4, Requiem: 5, Vanguard: 6 };
  relicsResult.sort((a, b) => {
    const tA = tierOrder[a.tier] || 99;
    const tB = tierOrder[b.tier] || 99;
    if (tA !== tB) return tA - tB;
    return a.name.localeCompare(b.name, undefined, { numeric: true });
  });

  // 6. 全面扩充多维预计算搜索索引 (search-index.json)
  const searchIndexData = [];

  // 遗物
  for (const r of relicsResult) {
    const tokens = generateTokens(r.name, r.zhName);
    const m = r.name.match(/\b([A-Za-z]+)\s+([A-Za-z0-9]+)\b/);
    if (m) {
      tokens.push(m[2].toLowerCase());
      tokens.push(`${r.tierZh} ${m[2]}`.toLowerCase());
      tokens.push(`${r.tierZh}${m[2]}`.toLowerCase());
    }
    searchIndexData.push({
      id: r.id,
      type: 'relic',
      name: r.name,
      zhName: r.zhName,
      tier: r.tier,
      tierZh: r.tierZh,
      status: r.status,
      vaulted: r.vaulted,
      unlisted: r.unlisted,
      tokens: Array.from(new Set(tokens))
    });
  }

  // 遗物奖励物品
  for (const [key, item] of Object.entries(itemsResult)) {
    const tokens = generateTokens(item.name, item.zhName);
    if (item.rawName && item.rawName !== item.name) {
      for (const t of generateTokens(item.rawName, null)) tokens.push(t);
    }
    if (item.marketSlug) tokens.push(item.marketSlug.toLowerCase());
    searchIndexData.push({
      id: key,
      type: 'item',
      name: item.name,
      zhName: item.zhName,
      marketSlug: item.marketSlug,
      tokens: Array.from(new Set(tokens))
    });
  }

  // 赋能
  for (const arc of arcanesResult) {
    const tokens = generateTokens(arc.name, arc.zhName);
    tokens.push(arc.slug.toLowerCase());
    searchIndexData.push({
      id: arc.slug,
      type: 'arcane',
      name: arc.name,
      zhName: arc.zhName,
      marketSlug: arc.slug,
      maxRank: arc.maxRank,
      tokens: Array.from(new Set(tokens))
    });
  }

  // 未开紫卡
  for (const riv of rivensResult) {
    const tokens = generateTokens(riv.name, riv.zhName);
    tokens.push(riv.slug.toLowerCase());
    tokens.push('紫卡');
    tokens.push('裂罅');
    tokens.push('riven');
    searchIndexData.push({
      id: riv.slug,
      type: 'riven',
      name: riv.name,
      zhName: riv.zhName,
      marketSlug: riv.slug,
      tokens: Array.from(new Set(tokens))
    });
  }

  // Mod
  for (const m of modsResult) {
    const tokens = generateTokens(m.name, m.zhName);
    tokens.push(m.slug.toLowerCase());
    searchIndexData.push({
      id: m.slug,
      type: 'mod',
      name: m.name,
      zhName: m.zhName,
      marketSlug: m.slug,
      maxRank: m.maxRank,
      tokens: Array.from(new Set(tokens))
    });
  }

  // 掉落来源 (Drop Sources) - 保证英文搜索可搜到 (如 Apollodorus)
  for (const src of sourcesResult) {
    const tokens = generateTokens(src.nameEn, src.nameZh);
    if (src.node) tokens.push(src.node.toLowerCase());
    if (src.planet) tokens.push(src.planet.toLowerCase());
    if (src.gameMode) tokens.push(src.gameMode.toLowerCase());
    searchIndexData.push({
      id: src.id,
      type: 'source',
      name: src.nameEn,
      zhName: src.nameZh,
      tokens: Array.from(new Set(tokens))
    });
  }

  // 7. 生成 unmatched.json (未匹配项，保持原口径)
  const unmatchedList = Array.from(unmatchedSet.entries()).map(([name, samplePlaces]) => ({
    name,
    samplePlaces
  }));
  unmatchedList.sort((a, b) => a.name.localeCompare(b.name));

  // 8. 生成 meta.json
  let pricesMeta = {
    updatedAt: null,
    pricedCount: 0,
    totalCount: 603 + 8 + (arcanesResult.length * 2) + (modsResult.length * 2),
    coverage: '0.0%',
    categories: {
      relics: { pricedCount: 0, totalCount: 603, coverage: '0.0%' },
      rivens: { pricedCount: 0, totalCount: 8, coverage: '0.0%' },
      arcanes: { pricedCount: 0, totalCount: arcanesResult.length * 2, coverage: '0.0%' },
      mods: { pricedCount: 0, totalCount: modsResult.length * 2, coverage: '0.0%' }
    }
  };

  const pricesPath = path.join(targetDataDir, 'prices.json');
  const actualPricesPath = fs.existsSync(pricesPath) ? pricesPath : path.join(DATA_DIR, 'prices.json');
  if (fs.existsSync(actualPricesPath)) {
    try {
      const pc = JSON.parse(fs.readFileSync(actualPricesPath, 'utf8'));
      pricesMeta = calculatePriceCoverage(pc, {
        relics: relicsResult,
        rivens: rivensResult,
        arcanes: arcanesResult,
        mods: modsResult
      });
    } catch (err) {
      console.warn('[build] 计算价格覆盖率出错:', err.message);
    }
  }

  // 9. 写入基础数据产物文件
  fs.mkdirSync(targetDataDir, { recursive: true });
  fs.writeFileSync(path.join(targetDataDir, 'relics.json'), JSON.stringify({ relics: relicsResult, items: itemsResult }, null, 2));
  fs.writeFileSync(path.join(targetDataDir, 'arcanes.json'), JSON.stringify(arcanesResult, null, 2));
  fs.writeFileSync(path.join(targetDataDir, 'rivens.json'), JSON.stringify(rivensResult, null, 2));
  fs.writeFileSync(path.join(targetDataDir, 'mods.json'), JSON.stringify(modsResult, null, 2));
  fs.writeFileSync(path.join(targetDataDir, 'sources.json'), JSON.stringify(sourcesResult));
  fs.writeFileSync(path.join(targetDataDir, 'unmatched.json'), JSON.stringify(unmatchedList, null, 2));
  fs.writeFileSync(path.join(targetDataDir, 'search-index.json'), JSON.stringify(searchIndexData));

  // 10. 自动生成剩余英文文档 docs/remaining-english.md 并对齐 localization 元数据
  let localizationMeta = {
    generatedAt: zhMap.meta?.generatedAt || new Date().toISOString(),
    stats: {},
    grandTotal: {},
    abbreviatedCorrectionsCount: zhMap.abbreviatedCorrections?.length || 0
  };

  try {
    const remainingReport = generateRemainingEnglishDocs({ dataDir: targetDataDir });
    const locStats = {};
    for (const cat of remainingReport.tableSummary) {
      locStats[cat.id] = {
        name: cat.category,
        totalCount: cat.total,
        translatedCount: cat.translated,
        asIsCount: cat.asIs,
        fallbackCount: cat.fallback,
        coverage: cat.rate,
        effectiveCoverage: cat.effectiveRate
      };
    }
    localizationMeta.stats = locStats;
    localizationMeta.grandTotal = remainingReport.grandSummary;
  } catch (err) {
    console.warn('[build] 生成 remaining-english.md 出错:', err.message);
  }

  const meta = {
    version: '2.0.0',
    phase: 4,
    builtAt: new Date().toISOString(),
    sources: {
      deDropData: REMOTE_URLS.drops_all,
      deDropTableOfficial: 'https://www.warframe.com/droptables',
      wfcdItemsRelics: REMOTE_URLS.relics,
      wfcdItemsZh: REMOTE_URLS.zh,
      wfmApi: 'https://api.warframe.market/v2'
    },
    stats: {
      totalRelics: relicsResult.length,
      obtainableRelics: obtainableCount,
      vaultedRelics: vaultedCount,
      unlistedRelics: unlistedCount,
      conflictRelics: conflictCount,
      totalRewardItems: Object.keys(itemsResult).length,
      totalArcanes: arcanesResult.length,
      totalRivens: rivensResult.length,
      totalMods: modsResult.length,
      totalSources: sourcesResult.length,
      bountySources: sourcesResult.filter(s => s.type === 'bounty').length,
      pvpSources: pvpSourcesCount,
      unmatchedCount: unmatchedList.length
    },
    pvpSources: pvpSourcesCount,
    prices: pricesMeta,
    localization: localizationMeta
  };

  fs.writeFileSync(path.join(targetDataDir, 'meta.json'), JSON.stringify(meta, null, 2));

  console.log('--------------------------------------------------');
  console.log(`[build] 全站汉化数据构建成功完成！`);
  console.log(`- 遗物总数: ${relicsResult.length}`);
  console.log(`- 赋能总数: ${arcanesResult.length}`);
  console.log(`- 未开紫卡数: ${rivensResult.length}`);
  console.log(`- 掉落 Mod 数: ${modsResult.length}`);
  console.log(`- 统一掉落来源数: ${sourcesResult.length}`);
  console.log(`- 未匹配项数: ${unmatchedList.length}`);
  console.log(`- 预构建搜索条目数: ${searchIndexData.length}`);
  console.log(`- 物品汉化覆盖率: ${localizationMeta.stats.items.coverage} (规范覆盖率: ${localizationMeta.stats.items.effectiveCoverage})`);
  console.log(`- 简略名修正数: ${localizationMeta.abbreviatedCorrectionsCount}`);
  console.log(`- 产物写入目录: ${targetDataDir}`);
  console.log('--------------------------------------------------');
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  build().catch(err => {
    console.error('[build] 构建失败:', err);
    process.exit(1);
  });
}
