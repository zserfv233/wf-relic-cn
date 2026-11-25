#!/usr/bin/env node
/**
 * scripts/build-data.mjs
 * 纯静态 Warframe 遗物与掉落数据构建脚本
 * Node 24 原生 ESM，仅依赖 pinyin-pro（MIT）
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pinyin } from 'pinyin-pro';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

// 纪元中文对照表（根据 WFCD zh.json 及 Warframe 官方简中标准译名）
const TIER_ZH_MAP = {
  Lith: '古纪',
  Meso: '前纪',
  Neo: '中纪',
  Axi: '后纪',
  Requiem: '安魂',
  Vanguard: '先锋'
};

// 远程数据源 URL
const REMOTE_URLS = {
  drops_all: 'https://drops.warframestat.us/data/all.json',
  relics: 'https://raw.githubusercontent.com/WFCD/warframe-items/master/data/json/Relics.json',
  zh: 'https://raw.githubusercontent.com/WFCD/warframe-items/master/data/json/i18n/zh.json',
  wfm_items_v2: 'https://api.warframe.market/v2/items'
};

// 通用部件单字列表（WFCD zh.json 中武器制作配方部件通常只有此类单字，缺乏武器主体名）
const GENERIC_COMPONENT_NAMES = new Set([
  '枪管', '枪机', '枪托', '握柄', '连接器', '锤头', '弓身', '弓弦', '弓臂',
  '上弓臂', '下弓臂', '刀刃', '刀身', '护手', '枪刃', '靴子', '系统', '机体',
  '头部', '握把', '外壳', '饰物', '枪套', '剑刃', '短柄', '握套'
]);

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

  // 默认原始数据搜索路径
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

    // 全拼
    try {
      const pyArr = pinyin(zhLower, { toneType: 'none', type: 'array' });
      if (pyArr && pyArr.length > 0) {
        const fullPy = pyArr.join('');
        tokens.add(fullPy);
        tokens.add(fullPy.replace(/\s+/g, ''));
      }

      // 拼音首字母
      const pyFirst = pinyin(zhLower, { pattern: 'first', toneType: 'none', type: 'array' });
      if (pyFirst && pyFirst.length > 0) {
        const firstLetters = pyFirst.join('');
        tokens.add(firstLetters);
        tokens.add(firstLetters.replace(/\s+/g, ''));
      }
    } catch {
      // 容错
    }
  }

  return Array.from(tokens).filter(Boolean);
}

/**
 * 递归扫描掉落表中的物品掉落
 */
function scanDroptables(dropsAll) {
  const droppingRelics = new Set();
  const directDrops = new Map(); // itemName -> Array of { place, rotation, chance, rarity }

  function addDirectDrop(itemName, drop) {
    if (!itemName) return;
    if (!directDrops.has(itemName)) directDrops.set(itemName, []);
    directDrops.get(itemName).push(drop);
  }

  function checkRelicItem(itemName) {
    if (!itemName || typeof itemName !== 'string') return;
    const m = itemName.match(/\b(Lith|Meso|Neo|Axi|Requiem|Vanguard)\s+([A-Za-z0-9]+)\s+Relic\b/i);
    if (m) {
      const key = `${m[1]} ${m[2]}`.toUpperCase();
      droppingRelics.add(key);
    }
  }

  // 1. 扫描 missionRewards
  const mr = dropsAll.missionRewards || {};
  for (const [planet, nodes] of Object.entries(mr)) {
    for (const [node, nodeData] of Object.entries(nodes || {})) {
      const gameMode = nodeData.gameMode || '';
      const place = `${planet} - ${node} (${gameMode})`;
      const rews = nodeData.rewards;

      if (Array.isArray(rews)) {
        for (const item of rews) {
          checkRelicItem(item.itemName);
          addDirectDrop(item.itemName, { place, rotation: item.rotation || null, chance: item.chance, rarity: item.rarity });
        }
      } else if (rews && typeof rews === 'object') {
        for (const [rot, list] of Object.entries(rews)) {
          if (Array.isArray(list)) {
            for (const item of list) {
              checkRelicItem(item.itemName);
              addDirectDrop(item.itemName, { place, rotation: rot, chance: item.chance, rarity: item.rarity });
            }
          }
        }
      }
    }
  }

  // 2. 扫描 transientRewards 及各赏金表
  const otherTables = [
    'transientRewards', 'cetusBountyRewards', 'solarisBountyRewards',
    'deimosRewards', 'zarimanRewards', 'entratiLabRewards', 'hexRewards',
    'keyRewards', 'sortieRewards'
  ];

  for (const tbl of otherTables) {
    const tableData = dropsAll[tbl];
    if (!tableData) continue;

    function walk(obj, label) {
      if (!obj) return;
      if (Array.isArray(obj)) {
        for (const item of obj) {
          if (item && typeof item === 'object') {
            if (typeof item.itemName === 'string') {
              checkRelicItem(item.itemName);
              addDirectDrop(item.itemName, { place: label, rotation: item.rotation || null, chance: item.chance, rarity: item.rarity });
            }
            walk(item, label);
          }
        }
      } else if (typeof obj === 'object') {
        for (const [k, v] of Object.entries(obj)) {
          walk(v, label ? `${label} - ${k}` : k);
        }
      }
    }

    walk(tableData, tbl);
  }

  return { droppingRelics, directDrops };
}

/**
 * 主构建逻辑
 */
async function build() {
  const { rawDir, shouldDownload } = parseArgs();

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

  let wfmItems = null;
  const wfmBySlug = new Map();
  if (fs.existsSync(wfmPath)) {
    try {
      wfmItems = JSON.parse(fs.readFileSync(wfmPath, 'utf8'));
      const list = wfmItems.data || (Array.isArray(wfmItems) ? wfmItems : []);
      for (const item of list) {
        if (item.slug) wfmBySlug.set(item.slug, item);
      }
      console.log(`[build] 已加载 warframe.market 数据 (条目数: ${wfmBySlug.size})`);
    } catch (err) {
      console.warn(`[build] 解析 wfm_items_v2.json 出错，使用降级策略:`, err.message);
    }
  } else {
    console.log(`[build] wfm_items_v2.json 不存在，降级使用 WFCD zh 翻译。`);
  }

  // 1. 扫描当前可获取遗物与直接任务掉落
  const { droppingRelics, directDrops } = scanDroptables(dropsAll);
  console.log(`[build] DE 掉落表现存掉落遗物种类: ${droppingRelics.size}`);

  // 2. 整理 WFCD Relics.json 数据，按 base relic 分组
  const relicsMetaMap = new Map();
  for (const r of relicsJson) {
    if (!r.rewards || r.rewards.length === 0) continue;

    // 解析出 tier 与 relicName
    const m = r.name?.match(/^(\S+)\s+(.*?)\s+(Intact|Exceptional|Flawless|Radiant)$/i);
    let tier = null;
    let relicName = null;
    let state = null;

    if (m) {
      tier = m[1];
      relicName = m[2];
      state = m[3].toLowerCase();
    } else {
      const mEterna = r.name?.match(/^Requiem\s+Eterna\b/i);
      if (mEterna) {
        tier = 'Requiem';
        relicName = 'ETERNA';
        state = 'intact';
      } else {
        continue;
      }
    }

    const key = `${tier.toUpperCase()}_${relicName.toUpperCase()}`;
    if (!relicsMetaMap.has(key)) {
      relicsMetaMap.set(key, {
        tier,
        relicName,
        states: {},
        wfcdVaulted: r.vaulted !== false,
        uniqueName: r.uniqueName,
        marketInfo: r.marketInfo
      });
    }

    const group = relicsMetaMap.get(key);
    group.states[state] = r;
    if (r.uniqueName && (!group.uniqueName || state === 'intact')) {
      group.uniqueName = r.uniqueName;
    }
    if (r.vaulted !== undefined) {
      group.wfcdVaulted = r.vaulted !== false;
    }
  }

  // 3. 从 drops_all.relics 汇总遗物四档掉率
  const dropsRelicsMap = new Map();
  for (const dr of dropsAll.relics) {
    if (!dr.relicName) continue; // 忽略无名称残缺项
    const tier = dr.tier;
    const relicName = dr.relicName;
    const state = (dr.state || 'Intact').toLowerCase();
    const key = `${tier.toUpperCase()}_${relicName.toUpperCase()}`;

    if (!dropsRelicsMap.has(key)) {
      dropsRelicsMap.set(key, {
        tier,
        relicName,
        states: {}
      });
    }
    dropsRelicsMap.get(key).states[state] = dr.rewards || [];
  }

  console.log(`[build] 汇总到有效遗物类型数: ${dropsRelicsMap.size}`);

  // 4. 构建遗物主列表及奖励物品反查字典
  const relicsResult = [];
  const itemsResult = {}; // itemKey -> itemObj

  let obtainableCount = 0;
  let vaultedCount = 0;
  let conflictCount = 0;

  for (const [key, dropsRelic] of dropsRelicsMap.entries()) {
    const tier = dropsRelic.tier;
    const relicName = dropsRelic.relicName;
    const tierZh = TIER_ZH_MAP[tier] || tier;

    // ID 格式: axi_a1, requiem_eterna, vanguard_c1
    const relicId = `${tier.toLowerCase()}_${relicName.toLowerCase()}`;
    const relicDisplayName = `${tier} ${relicName}`;

    // 入库状态判定：主判定 = 是否出现在 DE 掉落表当前的任务/赏金奖励里
    const isObtainableInDrops = droppingRelics.has(`${tier} ${relicName}`.toUpperCase());
    const vaulted = !isObtainableInDrops;
    const vaultedSource = 'de_droptables';

    // WFCD 对应元数据
    const wfcdMeta = relicsMetaMap.get(key);
    const wfcdVaulted = wfcdMeta ? wfcdMeta.wfcdVaulted : true;
    const conflict = vaulted !== wfcdVaulted;

    if (vaulted) vaultedCount++;
    else obtainableCount++;
    if (conflict) conflictCount++;

    let conflictNote = null;
    if (conflict) {
      conflictNote = vaulted
        ? 'DE当前掉落表未见该遗物，但WFCD标记为未入库'
        : 'DE当前掉落表现存该遗物，但WFCD标记为已入库';
    }

    // 中文名解析：WFCD zh.json 中对应 uniqueName 的名字
    let zhName = null;
    let zhSource = 'wfcd_i18n';
    if (wfcdMeta?.uniqueName && zhJson[wfcdMeta.uniqueName]?.name) {
      zhName = zhJson[wfcdMeta.uniqueName].name.trim();
    } else {
      zhName = `${tierZh} ${relicName} 遗物`;
      zhSource = 'generated';
    }

    // 解析奖励列表与各精炼等级掉率
    const intactRewards = dropsRelic.states['intact'] || [];
    const exceptionalRewards = dropsRelic.states['exceptional'] || [];
    const flawlessRewards = dropsRelic.states['flawless'] || [];
    const radiantRewards = dropsRelic.states['radiant'] || [];

    // 获取 Relics.json 中 intact 档作为物品唯一名/marketSlug的对照来源
    const wfcdIntactRewards = wfcdMeta?.states['intact']?.rewards || [];
    const wfcdItemMap = new Map();
    for (const rew of wfcdIntactRewards) {
      if (rew.item?.name) {
        wfcdItemMap.set(rew.item.name, rew.item);
      }
    }

    const processedRewards = [];

    for (const rew of intactRewards) {
      const itemName = rew.itemName;
      const wfcdItem = wfcdItemMap.get(itemName);
      const uniqueName = wfcdItem?.uniqueName;
      const marketSlug = wfcdItem?.warframeMarket?.urlName || null;

      // 提取四档掉率
      const excRew = exceptionalRewards.find(x => x.itemName === itemName);
      const flaRew = flawlessRewards.find(x => x.itemName === itemName);
      const radRew = radiantRewards.find(x => x.itemName === itemName);

      const chances = {
        intact: rew.chance ?? 0,
        exceptional: excRew ? excRew.chance : null,
        flawless: flaRew ? flaRew.chance : null,
        radiant: radRew ? radRew.chance : null
      };

      // 规范稀有度（根据 Intact 完整掉率划归标准 Common/Uncommon/Rare）
      let rarity = rew.rarity || 'Common';
      if (chances.intact <= 3) {
        rarity = 'Rare';
      } else if (chances.intact <= 15) {
        rarity = 'Uncommon';
      } else {
        rarity = 'Common';
      }

      // 中文名解析优先级：
      // 1. WFCD i18n zh（按 uniqueName），若名称仅为通用部件字（如"枪管"）且有 market 翻译，则采纳 market 完整名称；
      // 2. warframe.market zh-hans（按 slug）；
      // 3. 英文原名
      let itemZhName = null;
      let itemZhSource = null;

      const wfcdRawZh = uniqueName ? zhJson[uniqueName]?.name?.trim() : null;
      const wfmItem = marketSlug ? wfmBySlug.get(marketSlug) : null;
      const wfmZh = wfmItem?.i18n?.['zh-hans']?.name?.trim();

      if (wfcdRawZh && !GENERIC_COMPONENT_NAMES.has(wfcdRawZh)) {
        itemZhName = wfcdRawZh;
        itemZhSource = 'wfcd_i18n';
      } else if (wfmZh) {
        itemZhName = wfmZh;
        itemZhSource = 'warframe_market';
      } else if (wfcdRawZh) {
        itemZhName = wfcdRawZh;
        itemZhSource = 'wfcd_i18n';
      } else {
        itemZhName = itemName;
        itemZhSource = 'en_fallback';
      }

      processedRewards.push({
        name: itemName,
        zhName: itemZhName,
        zhSource: itemZhSource,
        rarity,
        marketSlug,
        chances
      });

      // 填充物品反查表
      const itemKey = marketSlug || itemName;
      if (!itemsResult[itemKey]) {
        itemsResult[itemKey] = {
          name: itemName,
          zhName: itemZhName,
          zhSource: itemZhSource,
          marketSlug,
          relics: [],
          directDrops: directDrops.get(itemName) || []
        };
      }

      itemsResult[itemKey].relics.push({
        relicId,
        relicName: relicDisplayName,
        relicZhName: zhName,
        tier,
        tierZh,
        vaulted,
        conflict,
        rarity,
        chances
      });
    }

    relicsResult.push({
      id: relicId,
      tier,
      tierZh,
      name: relicDisplayName,
      zhName,
      zhSource,
      vaulted,
      vaultedSource,
      wfcdVaulted,
      conflict,
      conflictNote,
      rewards: processedRewards
    });
  }

  // 排序遗物（按 Tier 顺序，再按遗物字母编号）
  const tierOrder = { Lith: 1, Meso: 2, Neo: 3, Axi: 4, Requiem: 5, Vanguard: 6 };
  relicsResult.sort((a, b) => {
    const tA = tierOrder[a.tier] || 99;
    const tB = tierOrder[b.tier] || 99;
    if (tA !== tB) return tA - tB;
    return a.name.localeCompare(b.name, undefined, { numeric: true });
  });

  // 5. 构建预计算搜索索引
  const searchIndex = [];

  // 添加遗物条目
  for (const r of relicsResult) {
    const tokens = generateTokens(r.name, r.zhName);
    // 额外添加常用遗物简称 tokens，如 "a1", "axi a1", "后纪 a1"
    const m = r.name.match(/\b([A-Za-z]+)\s+([A-Za-z0-9]+)\b/);
    if (m) {
      tokens.push(m[2].toLowerCase());
      tokens.push(`${r.tierZh} ${m[2]}`.toLowerCase());
      tokens.push(`${r.tierZh}${m[2]}`.toLowerCase());
    }

    searchIndex.push({
      id: r.id,
      type: 'relic',
      name: r.name,
      zhName: r.zhName,
      tier: r.tier,
      tierZh: r.tierZh,
      vaulted: r.vaulted,
      tokens: Array.from(new Set(tokens))
    });
  }

  // 添加物品条目
  for (const [key, item] of Object.entries(itemsResult)) {
    const tokens = generateTokens(item.name, item.zhName);
    if (item.marketSlug) tokens.push(item.marketSlug.toLowerCase());

    searchIndex.push({
      id: key,
      type: 'item',
      name: item.name,
      zhName: item.zhName,
      marketSlug: item.marketSlug,
      tokens: Array.from(new Set(tokens))
    });
  }

  // 6. 生成 meta.json
  const meta = {
    version: '1.0.0',
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
      conflictRelics: conflictCount,
      totalRewardItems: Object.keys(itemsResult).length
    },
    prices: {
      updatedAt: null,
      pricedCount: 0,
      totalCount: Object.keys(itemsResult).length,
      coverage: '0.0%'
    }
  };

  // 保留可能已存在的 prices 统计
  const existingMetaPath = path.join(DATA_DIR, 'meta.json');
  if (fs.existsSync(existingMetaPath)) {
    try {
      const oldMeta = JSON.parse(fs.readFileSync(existingMetaPath, 'utf8'));
      if (oldMeta.prices && oldMeta.prices.updatedAt) {
        meta.prices = oldMeta.prices;
      }
    } catch {}
  }

  // 7. 写入产物文件
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, 'relics.json'), JSON.stringify({ relics: relicsResult, items: itemsResult }, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'search-index.json'), JSON.stringify(searchIndex));
  fs.writeFileSync(path.join(DATA_DIR, 'meta.json'), JSON.stringify(meta, null, 2));

  console.log('--------------------------------------------------');
  console.log(`[build] 数据构建成功完成！`);
  console.log(`- 遗物总数: ${relicsResult.length}`);
  console.log(`- 当前可获取数: ${obtainableCount}`);
  console.log(`- 已入库数: ${vaultedCount}`);
  console.log(`- 入库状态冲突数: ${conflictCount}`);
  console.log(`- 唯一奖励物品数: ${Object.keys(itemsResult).length}`);
  console.log(`- 搜索索引条目数: ${searchIndex.length}`);
  console.log(`- 产物写入目录: ${DATA_DIR}`);
  console.log('--------------------------------------------------');
}

build().catch(err => {
  console.error('[build] 构建失败:', err);
  process.exit(1);
});
