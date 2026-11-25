#!/usr/bin/env node
/**
 * scripts/build-data.mjs
 * Warframe 遗物、赋能、紫卡、Mod 与掉落来源数据构建脚本（阶段 2）
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

// 星球中文对照表
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
  Sedna: '塞德娜',
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
  Solaris: '福尔图娜'
};

// 任务模式常见对照
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
  '头部', '握把', '外壳', '饰物', '枪套', '剑刃', '短柄', '握套'
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
    const m = itemName.match(/\b(Lith|Meso|Neo|Axi|Requiem|Vanguard)\s+([A-Za-z0-9]+)\s+Relic\b/i);
    if (m) {
      droppingRelics.add(`${m[1]} ${m[2]}`.toUpperCase());
    }
  }

  function addDirectDrop(itemName, drop) {
    if (!itemName) return;
    if (!directDrops.has(itemName)) directDrops.set(itemName, []);
    directDrops.get(itemName).push(drop);
  }

  // 2. 匹配 DE 物品名称到 WFM 物品
  function matchMarketItem(rawName) {
    if (!rawName || typeof rawName !== 'string') return null;
    const lower = rawName.toLowerCase().trim();

    // 1) 未开紫卡
    if (VEILED_RIVEN_NAME_MAP[lower]) {
      const slug = VEILED_RIVEN_NAME_MAP[lower];
      const item = wfmBySlug.get(slug);
      return { item, slug, category: 'riven' };
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
      return { item, slug: item.slug, category };
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
  for (const [planet, nodes] of Object.entries(mr)) {
    const planetZh = PLANET_ZH_MAP[planet] || planet;
    for (const [node, nodeData] of Object.entries(nodes || {})) {
      const gameMode = nodeData.gameMode || '';
      const modeZh = GAMEMODE_ZH_MAP[gameMode] || gameMode;
      const rews = nodeData.rewards;

      const processRewardList = (rewardList, rotation = null) => {
        const sourceId = `mission_${planet.toLowerCase()}_${node.toLowerCase()}${rotation ? `_${rotation.toLowerCase()}` : ''}`;
        const nameEn = `${planet} - ${node} (${gameMode})${rotation ? ` [Rot ${rotation}]` : ''}`;
        const nameZh = `${planetZh} - ${node} (${modeZh})${rotation ? ` [轮次 ${rotation}]` : ''}`;
        
        const processedRewards = [];
        for (const r of rewardList) {
          checkRelicItem(r.itemName);
          addDirectDrop(r.itemName, { place: nameEn, rotation, chance: r.chance, rarity: r.rarity });

          const matched = matchMarketItem(r.itemName);
          let itemZh = r.itemName;
          let slug = null;
          let category = 'other';

          if (matched) {
            slug = matched.slug;
            category = matched.category;
            itemZh = matched.item?.i18n?.['zh-hans']?.name || r.itemName;
          } else {
            recordUnmatched(r.itemName, nameEn);
          }

          processedRewards.push({
            itemName: r.itemName,
            itemZh,
            slug,
            category,
            chance: r.chance,
            rarity: r.rarity || 'Common'
          });
        }

        sourcesResult.push({
          id: sourceId,
          type: 'mission',
          nameEn,
          nameZh,
          planet,
          planetZh,
          node,
          gameMode,
          gameModeZh: modeZh,
          rotation,
          rewards: processedRewards
        });
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
    const dropChanceNum = typeof rawDropChance === 'number' ? rawDropChance : parseFloat(rawDropChance || 0);
    const sourceId = `enemy_${enemyName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
    const nameEn = `Enemy: ${enemyName}`;
    const nameZh = `敌人: ${enemyName}`;

    const processedMods = [];
    for (const m of em.mods || []) {
      const matched = matchMarketItem(m.modName);
      let itemZh = m.modName;
      let slug = null;
      let category = 'mod';

      if (matched) {
        slug = matched.slug;
        category = matched.category;
        itemZh = matched.item?.i18n?.['zh-hans']?.name || m.modName;
      } else {
        recordUnmatched(m.modName, nameEn);
      }

      processedMods.push({
        itemName: m.modName,
        itemZh,
        slug,
        category,
        chance: m.chance,
        rarity: m.rarity || 'Common'
      });
    }

    sourcesResult.push({
      id: sourceId,
      type: 'enemy',
      nameEn,
      nameZh,
      enemyName,
      enemyModDropChance: dropChanceNum,
      rewards: processedMods
    });
  }

  // C. 扫描其他赏金与特殊任务表
  const otherTables = [
    { key: 'cetusBountyRewards', type: 'bounty', label: 'Cetus Bounty (希图斯赏金)' },
    { key: 'solarisBountyRewards', type: 'bounty', label: 'Solaris Bounty (福尔图娜赏金)' },
    { key: 'deimosRewards', type: 'bounty', label: 'Deimos Bounty (火卫二赏金)' },
    { key: 'zarimanRewards', type: 'bounty', label: 'Zariman (扎里曼任务)' },
    { key: 'entratiLabRewards', type: 'bounty', label: 'Entrati Lab (阿尔布雷希特实验室)' },
    { key: 'hexRewards', type: 'bounty', label: 'Hex (霍瓦尼亚 1999)' },
    { key: 'transientRewards', type: 'transient', label: 'Transient (密室与特殊掉落)' },
    { key: 'sortieRewards', type: 'sortie', label: 'Sortie (突击任务)' }
  ];

  for (const tbl of otherTables) {
    const dataObj = dropsAll[tbl.key];
    if (!dataObj) continue;

    function walkBounty(obj, prefixEn) {
      if (!obj) return;
      if (Array.isArray(obj)) {
        const sourceId = `source_${tbl.type}_${prefixEn.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
        const processed = [];
        for (const item of obj) {
          if (!item || typeof item !== 'object') continue;
          
          // 如果该对象包含子 rewards 列表 (例如 transientRewards 中的 Arbitrations / Derelict Vault / Kuva Siphon)
          if (item.rewards && Array.isArray(item.rewards)) {
            const subLabel = item.objectiveName ? `${prefixEn} - ${item.objectiveName}` : prefixEn;
            walkBounty(item.rewards, subLabel);
            continue;
          }

          const itemName = item.itemName || item.modName;
          if (!itemName) continue;

          checkRelicItem(itemName);
          addDirectDrop(itemName, { place: prefixEn, rotation: item.rotation || null, chance: item.chance, rarity: item.rarity });

          const matched = matchMarketItem(itemName);
          let itemZh = itemName;
          let slug = null;
          let category = 'other';

          if (matched) {
            slug = matched.slug;
            category = matched.category;
            itemZh = matched.item?.i18n?.['zh-hans']?.name || itemName;
          } else {
            recordUnmatched(itemName, prefixEn);
          }

          processed.push({
            itemName,
            itemZh,
            slug,
            category,
            chance: item.chance,
            rarity: item.rarity || 'Common'
          });
        }

        if (processed.length > 0) {
          sourcesResult.push({
            id: sourceId,
            type: tbl.type,
            nameEn: prefixEn,
            nameZh: prefixEn,
            rewards: processed
          });
        }
      } else if (typeof obj === 'object') {
        for (const [k, v] of Object.entries(obj)) {
          walkBounty(v, `${prefixEn} - ${k}`);
        }
      }
    }

    walkBounty(dataObj, tbl.label);
  }

  console.log(`[build] 汇总全部掉落来源记录数: ${sourcesResult.length}`);

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
          rotation: src.rotation || null,
          chance: r.chance,
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
    rivensResult.push({
      id: slug,
      slug,
      name: wfmItem?.i18n?.en?.name || deName,
      zhName: wfmItem?.i18n?.['zh-hans']?.name || deName,
      zhSource: wfmItem?.i18n?.['zh-hans']?.name ? 'warframe_market' : 'de_name',
      tags: wfmItem?.tags || ['mod', 'riven_mod', 'veiled_riven'],
      dropSources
    });
  }

  // 整理赋能 (Arcanes)
  for (const item of wfmBySlug.values()) {
    if (item.tags?.includes('arcane_enhancement')) {
      const dropSources = slugSourcesMap.get(item.slug) || [];
      // 包含在 DE 掉落表或全部赋能
      arcanesResult.push({
        id: item.slug,
        slug: item.slug,
        name: item.i18n?.en?.name || item.slug,
        zhName: item.i18n?.['zh-hans']?.name || item.slug,
        zhSource: item.i18n?.['zh-hans']?.name ? 'warframe_market' : 'en_fallback',
        maxRank: item.maxRank ?? 5,
        tags: item.tags,
        dropSources
      });
    }
  }

  // 整理 Mod (只录入有掉落来源且具备 market slug 的 Mod)
  for (const item of wfmBySlug.values()) {
    if (item.tags?.includes('mod') && !item.tags?.includes('arcane_enhancement') && !item.tags?.includes('veiled_riven')) {
      const dropSources = slugSourcesMap.get(item.slug);
      if (dropSources && dropSources.length > 0) {
        modsResult.push({
          id: item.slug,
          slug: item.slug,
          name: item.i18n?.en?.name || item.slug,
          zhName: item.i18n?.['zh-hans']?.name || item.slug,
          zhSource: item.i18n?.['zh-hans']?.name ? 'warframe_market' : 'en_fallback',
          maxRank: item.maxRank ?? 3,
          tags: item.tags,
          dropSources
        });
      }
    }
  }

  console.log(`[build] 整理赋能条目: ${arcanesResult.length} (其中含掉落来源: ${arcanesResult.filter(a => a.dropSources.length > 0).length})`);
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
      vaulted = false; // 机制上可获取，不属于已入库
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
    
    // 冲突判定（排除已在 override 声明的特殊来源）
    const conflict = !unlisted && (vaulted !== wfcdVaulted);
    if (conflict) conflictCount++;

    let conflictNote = null;
    if (conflict) {
      conflictNote = vaulted
        ? 'DE当前掉落表未见该遗物，但WFCD标记为未入库'
        : 'DE当前掉落表现存该遗物，但WFCD标记为已入库';
    }

    let zhName = null;
    let zhSource = 'wfcd_i18n';
    if (wfcdMeta?.uniqueName && zhJson[wfcdMeta.uniqueName]?.name) {
      zhName = zhJson[wfcdMeta.uniqueName].name.trim();
    } else {
      zhName = `${tierZh} ${relicName} 遗物`;
      zhSource = 'generated';
    }

    const intactRewards = dropsRelic.states['intact'] || [];
    const exceptionalRewards = dropsRelic.states['exceptional'] || [];
    const flawlessRewards = dropsRelic.states['flawless'] || [];
    const radiantRewards = dropsRelic.states['radiant'] || [];

    const wfcdIntactRewards = wfcdMeta?.states['intact']?.rewards || [];
    const wfcdItemMap = new Map();
    for (const rew of wfcdIntactRewards) {
      if (rew.item?.name) wfcdItemMap.set(rew.item.name, rew.item);
    }

    const processedRewards = [];
    for (const rew of intactRewards) {
      const itemName = rew.itemName;
      const wfcdItem = wfcdItemMap.get(itemName);
      const uniqueName = wfcdItem?.uniqueName;
      const marketSlug = wfcdItem?.warframeMarket?.urlName || null;

      const excRew = exceptionalRewards.find(x => x.itemName === itemName);
      const flaRew = flawlessRewards.find(x => x.itemName === itemName);
      const radRew = radiantRewards.find(x => x.itemName === itemName);

      const chances = {
        intact: rew.chance ?? 0,
        exceptional: excRew ? excRew.chance : null,
        flawless: flaRew ? flaRew.chance : null,
        radiant: radRew ? radRew.chance : null
      };

      let rarity = rew.rarity || 'Common';
      if (chances.intact <= 3) rarity = 'Rare';
      else if (chances.intact <= 15) rarity = 'Uncommon';
      else rarity = 'Common';

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
        status,
        vaulted,
        unlisted,
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
      status,
      vaulted,
      unlisted,
      vaultedSource,
      statusReason,
      statusSource,
      wfcdVaulted,
      conflict,
      conflictNote,
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

  // 7. 生成 unmatched.json (未匹配项，不要猜)
  const unmatchedList = Array.from(unmatchedSet.entries()).map(([name, samplePlaces]) => ({
    name,
    samplePlaces
  }));
  unmatchedList.sort((a, b) => a.name.localeCompare(b.name));

  // 8. 生成 meta.json
  const existingMetaPath = path.join(DATA_DIR, 'meta.json');
  let oldPricesMeta = {
    updatedAt: null,
    pricedCount: 0,
    totalCount: 0,
    coverage: '0.0%',
    categories: {
      relics: { pricedCount: 0, totalCount: 603, coverage: '0.0%' },
      rivens: { pricedCount: 0, totalCount: 8, coverage: '0.0%' },
      arcanes: { pricedCount: 0, totalCount: arcanesResult.length, coverage: '0.0%' },
      mods: { pricedCount: 0, totalCount: modsResult.length, coverage: '0.0%' }
    }
  };

  // 仅在 prices.json 存在真实数据时计算覆盖率 (A1)
  const pricesPath = path.join(DATA_DIR, 'prices.json');
  if (fs.existsSync(pricesPath)) {
    try {
      const pc = JSON.parse(fs.readFileSync(pricesPath, 'utf8'));
      const items = pc.items || {};
      const realKeys = Object.keys(items);
      const pricedKeys = realKeys.filter(k => items[k]?.sellMin !== null || items[k]?.buyMax !== null);
      oldPricesMeta.updatedAt = pc.updatedAt;
      oldPricesMeta.pricedCount = pricedKeys.length;
      oldPricesMeta.totalCount = 603 + 8 + arcanesResult.length + modsResult.length;
      oldPricesMeta.coverage = oldPricesMeta.totalCount > 0 
        ? ((oldPricesMeta.pricedCount / oldPricesMeta.totalCount) * 100).toFixed(1) + '%' 
        : '0.0%';
    } catch {}
  }

  const meta = {
    version: '2.0.0',
    phase: 2,
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
      unmatchedCount: unmatchedList.length
    },
    prices: oldPricesMeta
  };

  // 9. 写入所有产物文件
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, 'relics.json'), JSON.stringify({ relics: relicsResult, items: itemsResult }, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'arcanes.json'), JSON.stringify(arcanesResult, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'rivens.json'), JSON.stringify(rivensResult, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'mods.json'), JSON.stringify(modsResult, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'sources.json'), JSON.stringify(sourcesResult));
  fs.writeFileSync(path.join(DATA_DIR, 'unmatched.json'), JSON.stringify(unmatchedList, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'search-index.json'), JSON.stringify(searchIndexData));
  fs.writeFileSync(path.join(DATA_DIR, 'meta.json'), JSON.stringify(meta, null, 2));

  console.log('--------------------------------------------------');
  console.log(`[build] 阶段 2 数据构建成功完成！`);
  console.log(`- 遗物总数: ${relicsResult.length} (可获取: ${obtainableCount}, 入库: ${vaultedCount}, 特殊未列出: ${unlistedCount}, 冲突: ${conflictCount})`);
  console.log(`- 赋能总数: ${arcanesResult.length}`);
  console.log(`- 未开紫卡数: ${rivensResult.length}`);
  console.log(`- 掉落 Mod 数: ${modsResult.length}`);
  console.log(`- 统一掉落来源数: ${sourcesResult.length}`);
  console.log(`- 未匹配项数: ${unmatchedList.length}`);
  console.log(`- 预构建搜索条目数: ${searchIndexData.length}`);
  console.log(`- 产物写入目录: ${DATA_DIR}`);
  console.log('--------------------------------------------------');
}

build().catch(err => {
  console.error('[build] 构建失败:', err);
  process.exit(1);
});
