#!/usr/bin/env node
/**
 * scripts/fetch-prices.mjs
 * 从 warframe.market 公开 API v2 抓取遗物奖励、未开紫卡、赋能与 Mod 价格
 * Node 18+ 原生 ESM fetch，零依赖，支持独立机器运行
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RateLimiter, fetchWithRetry } from '../js/lib/rate-limiter.js';
import { parseOrdersTop, calculatePriceCoverage, computeCategoryStats } from '../js/lib/prices.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

const API_BASE = 'https://api.warframe.market/v2';
const USER_AGENT = 'wf-relic-cn (personal, non-commercial)';

/**
 * 查找缓存中所有倒挂键 (Codex 1126c 第 7 项)
 */
export function findCrossedKeys(items = {}) {
  const targetItems = items.items || items;
  const crossedKeys = [];
  for (const [key, item] of Object.entries(targetItems)) {
    if (!item || typeof item !== 'object') continue;
    const isV2 = item.priceSchemaVersion >= 2 || Object.prototype.hasOwnProperty.call(item, 'rawSellMin') || Object.prototype.hasOwnProperty.call(item, 'rawBuyMax');
    const rawSell = isV2 ? item.rawSellMin : item.sellMin;
    const rawBuy = isV2 ? item.rawBuyMax : item.buyMax;
    if (typeof rawSell === 'number' && typeof rawBuy === 'number' && rawBuy > rawSell) {
      crossedKeys.push(key);
    } else if (item.crossedMarket) {
      crossedKeys.push(key);
    }
  }
  return crossedKeys;
}

export function buildMetaPrices(priceCache, dataDir = DATA_DIR) {
  const relicsPath = path.join(dataDir, 'relics.json');
  const rivensPath = path.join(dataDir, 'rivens.json');
  const arcanesPath = path.join(dataDir, 'arcanes.json');
  const modsPath = path.join(dataDir, 'mods.json');

  const relicsData = JSON.parse(fs.readFileSync(relicsPath, 'utf8')).relics;
  const rivensData = JSON.parse(fs.readFileSync(rivensPath, 'utf8'));
  const arcanesData = JSON.parse(fs.readFileSync(arcanesPath, 'utf8'));
  const modsData = JSON.parse(fs.readFileSync(modsPath, 'utf8'));

  return calculatePriceCoverage(priceCache, {
    relics: relicsData,
    rivens: rivensData,
    arcanes: arcanesData,
    mods: modsData
  });
}

/**
 * 解析命令行参数
 */
export function parseArgs(rawArgs = process.argv.slice(2)) {
  let limit = Infinity;
  let maxAgeHours = 24;
  let onlyCategories = ['relics', 'rivens', 'arcanes', 'mods'];
  let fixturePath = null;
  let outPath = null;
  let dryRun = false;

  for (let i = 0; i < rawArgs.length; i++) {
    if (rawArgs[i] === '--limit' && rawArgs[i + 1]) {
      limit = parseInt(rawArgs[i + 1], 10);
      i++;
    } else if (rawArgs[i] === '--max-age-hours' && rawArgs[i + 1]) {
      maxAgeHours = parseFloat(rawArgs[i + 1]);
      i++;
    } else if (rawArgs[i] === '--only' && rawArgs[i + 1]) {
      onlyCategories = rawArgs[i + 1].split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      i++;
    } else if (rawArgs[i] === '--fixture' && rawArgs[i + 1]) {
      fixturePath = path.resolve(rawArgs[i + 1]);
      i++;
    } else if (rawArgs[i] === '--out' && rawArgs[i + 1]) {
      outPath = path.resolve(rawArgs[i + 1]);
      i++;
    } else if (rawArgs[i] === '--dry-run') {
      dryRun = true;
    }
  }

  // A1: fixture 模式默认绝不能改写 data/prices.json！
  // 仅当用户显式传入 --out <path> 时才允许写入目标文件
  if (!outPath) {
    if (fixturePath) {
      outPath = null; // fixture 模式下不写入正式 prices.json
    } else {
      outPath = path.join(DATA_DIR, 'prices.json');
    }
  }

  return { limit, maxAgeHours, onlyCategories, fixturePath, outPath, dryRun };
}

async function main() {
  const { limit, maxAgeHours, onlyCategories, fixturePath, outPath, dryRun } = parseArgs();

  const pricesDefaultPath = path.join(DATA_DIR, 'prices.json');
  const metaDir = outPath ? path.dirname(outPath) : DATA_DIR;
  const metaPath = path.join(metaDir, 'meta.json');

  // 读取现有 prices.json 缓存
  let priceCache = { updatedAt: null, items: {} };
  const readPath = outPath || pricesDefaultPath;
  if (fs.existsSync(readPath)) {
    try {
      priceCache = JSON.parse(fs.readFileSync(readPath, 'utf8'));
      if (!priceCache.items) priceCache.items = {};
    } catch {}
  }

  // Codex 1126c 第 7 项: 当前倒挂键强制复核队列与逐键记录
  const initialCrossedKeys = findCrossedKeys(priceCache.items);
  const forcedRecheckSet = new Set(initialCrossedKeys);
  const reverificationRecords = {};
  for (const k of initialCrossedKeys) {
    reverificationRecords[k] = {
      status: 'unexecuted',
      reason: '未被 --only 覆盖或因 --limit 限制未执行',
      checkedAt: null
    };
  }
  if (initialCrossedKeys.length > 0) {
    console.log(`[prices] 发现当前缓存包含 ${initialCrossedKeys.length} 个倒挂键，已加入强制复核队列 (跳过 TTL 检查)`);
  }

  // 1. 抓取优先级类别定义：遗物奖励 → 未开紫卡 → 赋能 → 掉落 Mod
  const categoriesDef = [
    {
      id: 'relics',
      name: '遗物奖励',
      dataFile: path.join(DATA_DIR, 'relics.json'),
      loadTasks: (data) => {
        const slugs = new Set();
        for (const r of data.relics || []) {
          for (const rew of r.rewards || []) {
            if (rew.marketSlug) slugs.add(rew.marketSlug);
          }
        }
        return Array.from(slugs).map(slug => ({
          category: 'relics',
          slug,
          rank: null,
          cacheKey: slug
        }));
      }
    },
    {
      id: 'rivens',
      name: '未开紫卡',
      dataFile: path.join(DATA_DIR, 'rivens.json'),
      loadTasks: (data) => {
        return (data || []).map(r => ({
          category: 'rivens',
          slug: r.slug,
          rank: null,
          subtype: 'unrevealed',
          cacheKey: `${r.slug}@unrevealed`
        }));
      }
    },
    {
      id: 'arcanes',
      name: '赋能',
      dataFile: path.join(DATA_DIR, 'arcanes.json'),
      loadTasks: (data) => {
        const tasks = [];
        for (const arc of data || []) {
          const maxRank = arc.maxRank ?? 5;
          if (maxRank > 0) {
            tasks.push({ category: 'arcanes', slug: arc.slug, rank: 0, cacheKey: `${arc.slug}@r0` });
            tasks.push({ category: 'arcanes', slug: arc.slug, rank: maxRank, cacheKey: `${arc.slug}@r${maxRank}` });
          } else {
            tasks.push({ category: 'arcanes', slug: arc.slug, rank: null, cacheKey: arc.slug });
          }
        }
        return tasks;
      }
    },
    {
      id: 'mods',
      name: 'Mod',
      dataFile: path.join(DATA_DIR, 'mods.json'),
      loadTasks: (data) => {
        const tasks = [];
        for (const m of data || []) {
          const maxRank = m.maxRank ?? 3;
          if (maxRank > 0) {
            tasks.push({ category: 'mods', slug: m.slug, rank: 0, cacheKey: `${m.slug}@r0` });
            tasks.push({ category: 'mods', slug: m.slug, rank: maxRank, cacheKey: `${m.slug}@r${maxRank}` });
          } else {
            tasks.push({ category: 'mods', slug: m.slug, rank: null, cacheKey: m.slug });
          }
        }
        return tasks;
      }
    }
  ];

  const now = Date.now();
  const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
  let remainingLimit = limit;
  const rateLimiter = new RateLimiter(350);

  const allCategoryKeys = {
    relics: [],
    rivens: [],
    arcanes: [],
    mods: []
  };

  console.log(`[prices] 启动抓取流程 (并发固定: 1, 限速: ≤3 req/s, 缓存有效期: ${maxAgeHours}h)`);
  if (fixturePath) {
    console.log(`[prices] 当前为 Fixture 测试模式: ${fixturePath}`);
    if (!outPath) console.log(`[prices] 注意: Fixture 模式未指定 --out，绝不会修改 data/prices.json！`);
  }

  // 提前预加载所有类别的所有待抓键，便于准确计算各类别覆盖率
  for (const cat of categoriesDef) {
    if (fs.existsSync(cat.dataFile)) {
      try {
        const dataObj = JSON.parse(fs.readFileSync(cat.dataFile, 'utf8'));
        const allCatTasks = cat.loadTasks(dataObj);
        allCategoryKeys[cat.id] = allCatTasks.map(t => t.cacheKey);
      } catch {}
    }
  }

  // 逐类别处理并即时写入
  for (const cat of categoriesDef) {
    if (!onlyCategories.includes(cat.id)) continue;
    if (!fs.existsSync(cat.dataFile)) {
      console.warn(`[prices] 缺少数据文件 ${cat.dataFile}，跳过类别 ${cat.name}`);
      continue;
    }

    const dataObj = JSON.parse(fs.readFileSync(cat.dataFile, 'utf8'));
    const allCatTasks = cat.loadTasks(dataObj);
    allCategoryKeys[cat.id] = allCatTasks.map(t => t.cacheKey);

    // 过滤出需要更新的任务
    const pendingTasks = [];
    for (const task of allCatTasks) {
      const isForced = forcedRecheckSet.has(task.cacheKey);
      const cached = priceCache.items[task.cacheKey];
      if (!isForced && cached && cached.fetchedAt) {
        const fetchedTime = new Date(cached.fetchedAt).getTime();
        if (now - fetchedTime < maxAgeMs) {
          continue; // 在有效期内，跳过
        }
      }
      pendingTasks.push({ ...task, isForcedRecheck: isForced });
      if (pendingTasks.length >= remainingLimit) break;
    }

    console.log(`\n==================================================`);
    console.log(`[prices] 类别【${cat.name} (${cat.id})】: 总键数 ${allCatTasks.length}, 待抓取更新数: ${pendingTasks.length}`);
    console.log(`==================================================`);

    if (dryRun) {
      console.log(`[prices] --dry-run 预览待抓取键 (前 5 项):`, pendingTasks.slice(0, 5).map(t => t.cacheKey));
      remainingLimit -= pendingTasks.length;
      continue;
    }

    let successCount = 0;
    let failCount = 0;
    let consecutiveFail = 0;
    const MAX_CONSECUTIVE_FAIL = 15; // 连续失败熔断：被拦截/封禁时立即停止，不继续请求、不写入

    for (let i = 0; i < pendingTasks.length; i++) {
      const task = pendingTasks[i];
      const { slug, rank, cacheKey, isForcedRecheck } = task;

      if (fixturePath && fs.existsSync(fixturePath)) {
        // 使用 fixture 数据解析
        const fixtureJson = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
        const parsed = parseOrdersTop(fixtureJson, { targetRank: rank, slug, subtype: task.subtype });
        // 新响应整键替换，不残留旧 crossedMarket
        priceCache.items[cacheKey] = {
          ...parsed,
          fetchedAt: new Date().toISOString()
        };
        successCount++;

        if (isForcedRecheck) {
          let revStatus = 'success';
          if (parsed.crossedMarket) {
            revStatus = 'still_crossed';
          } else if (parsed.noOrders) {
            revStatus = 'no_orders';
          } else if (parsed.singleSided) {
            revStatus = 'single_sided';
          }
          reverificationRecords[cacheKey] = {
            status: revStatus,
            checkedAt: new Date().toISOString(),
            crossedMarket: parsed.crossedMarket,
            sellMin: parsed.sellMin,
            buyMax: parsed.buyMax,
            rawSellMin: parsed.rawSellMin,
            rawBuyMax: parsed.rawBuyMax
          };
        }
      } else {
        // 真实网络抓取
        const queryParams = [];
        if (rank !== null) queryParams.push(`rank=${rank}`);
        if (task.subtype) queryParams.push(`subtype=${encodeURIComponent(task.subtype)}`);
        const queryParam = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
        const url = `${API_BASE}/orders/item/${encodeURIComponent(slug)}/top${queryParam}`;

        try {
          const res = await fetchWithRetry(url, {
            headers: { 'User-Agent': USER_AGENT }
          }, {
            maxRetries: 3,
            baseDelayMs: 1000,
            rateLimiter
          });

          if (res.status === 404) {
            if (isForcedRecheck) {
              // 404 不能未经核实就当空双边抹掉旧倒挂证据，原隔离继续有效
              priceCache.items[cacheKey] = {
                ...priceCache.items[cacheKey],
                lastAttemptAt: new Date().toISOString(),
                lastAttemptError: 'HTTP 404 (未核实接口契约，保持原倒挂隔离)'
              };
              reverificationRecords[cacheKey] = {
                status: 'failed',
                reason: 'HTTP 404 (保持隔离)',
                checkedAt: new Date().toISOString()
              };
            } else {
              priceCache.items[cacheKey] = {
                priceSchemaVersion: 2,
                sellMin: null,
                buyMax: null,
                rawSellMin: null,
                rawBuyMax: null,
                noOrders: true,
                sellCount: 0,
                buyCount: 0,
                rank,
                subtype: task.subtype || null,
                source: `warframe.market v2 /orders/item/${slug}/top${queryParam}`,
                fetchedAt: new Date().toISOString()
              };
            }
            successCount++;
            consecutiveFail = 0;
          } else if (res.ok) {
            const json = await res.json();
            const parsed = parseOrdersTop(json, { targetRank: rank, slug, subtype: task.subtype });
            // 新响应整键替换，不残留旧 crossedMarket
            priceCache.items[cacheKey] = {
              ...parsed,
              fetchedAt: new Date().toISOString()
            };
            successCount++;
            consecutiveFail = 0;

            if (isForcedRecheck) {
              let revStatus = 'success';
              if (parsed.crossedMarket) {
                revStatus = 'still_crossed';
              } else if (parsed.noOrders) {
                revStatus = 'no_orders';
              } else if (parsed.singleSided) {
                revStatus = 'single_sided';
              }
              reverificationRecords[cacheKey] = {
                status: revStatus,
                checkedAt: new Date().toISOString(),
                crossedMarket: parsed.crossedMarket,
                sellMin: parsed.sellMin,
                buyMax: parsed.buyMax,
                rawSellMin: parsed.rawSellMin,
                rawBuyMax: parsed.rawBuyMax
              };
            }
          } else {
            console.warn(`[prices] [${i + 1}/${pendingTasks.length}] 请求 ${cacheKey} 失败 (HTTP ${res.status})`);
            failCount++;
            consecutiveFail++;

            if (isForcedRecheck) {
              priceCache.items[cacheKey] = {
                ...priceCache.items[cacheKey],
                lastAttemptAt: new Date().toISOString(),
                lastAttemptError: `HTTP ${res.status}`
              };
              reverificationRecords[cacheKey] = {
                status: 'failed',
                reason: `HTTP ${res.status} (保持隔离)`,
                checkedAt: new Date().toISOString()
              };
            }
          }
        } catch (err) {
          console.warn(`[prices] [${i + 1}/${pendingTasks.length}] 抓取 ${cacheKey} 异常: ${err.message}`);
          failCount++;
          consecutiveFail++;

          if (isForcedRecheck) {
            priceCache.items[cacheKey] = {
              ...priceCache.items[cacheKey],
              lastAttemptAt: new Date().toISOString(),
              lastAttemptError: err.message
            };
            reverificationRecords[cacheKey] = {
              status: 'failed',
              reason: `${err.message} (保持隔离)`,
              checkedAt: new Date().toISOString()
            };
          }
        }
      }

      if (!fixturePath && consecutiveFail >= MAX_CONSECUTIVE_FAIL) {
        console.error(`[prices] 连续 ${consecutiveFail} 次请求失败（疑似被 Cloudflare 拦截或限流），熔断退出；本类别不写入，现有价格数据保持不变。`);
        process.exit(2);
      }

      if ((i + 1) % 25 === 0 || i === pendingTasks.length - 1) {
        console.log(`[prices] [${cat.name}] 进度: ${i + 1}/${pendingTasks.length} (成功: ${successCount}, 失败: ${failCount})`);
      }
    }

    remainingLimit -= pendingTasks.length;

    // 每完成一个类别就写一次 data/prices.json（中途中断也不丢）
    priceCache.updatedAt = new Date().toISOString();
    if (initialCrossedKeys.length > 0) {
      priceCache.crossedReverification = {
        checkedAt: new Date().toISOString(),
        totalCrossedKeys: initialCrossedKeys.length,
        executedCount: Object.values(reverificationRecords).filter(r => r.status !== 'unexecuted').length,
        results: reverificationRecords
      };
    }
    if (outPath) {
      fs.writeFileSync(outPath, JSON.stringify(priceCache, null, 2));
      console.log(`[prices] [${cat.name}] 完成，已同步写入价格文件: ${outPath}`);
    }

    // 更新 meta.json 中各类别与总覆盖率 (从真实数据集计算，统一口径)
    if (fs.existsSync(metaPath) && outPath && outPath.endsWith('prices.json')) {
      try {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        meta.prices = buildMetaPrices(priceCache, DATA_DIR);

        fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
      } catch (e) {
        console.warn(`[prices] 更新 meta.json 失败:`, e.message);
      }
    }

    if (remainingLimit <= 0) {
      console.log(`[prices] 达到 --limit 限制，停止后续类别抓取。`);
      break;
    }
  }

  console.log(`\n[prices] 价格处理任务全部结束！`);
}

// 仅在直接执行时调用 main
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch(err => {
    console.error('[prices] 执行失败:', err);
    process.exit(1);
  });
}
