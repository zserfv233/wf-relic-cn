#!/usr/bin/env node
/**
 * scripts/fetch-prices.mjs
 * 从 warframe.market 公开 API v2 获取遗物奖励物品当前价格
 * Node 18+ 原生 ESM fetch，零依赖
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RateLimiter, fetchWithRetry } from '../js/lib/rate-limiter.js';
import { parseOrdersTop } from '../js/lib/prices.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

const API_BASE = 'https://api.warframe.market/v2';
const USER_AGENT = 'wf-relic-cn (personal, non-commercial)';

/**
 * 解析命令行参数
 */
function parseArgs() {
  const args = process.argv.slice(2);
  let limit = Infinity;
  let maxAgeHours = 24;
  let onlyRelics = true;
  let fixturePath = null;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit' && args[i + 1]) {
      limit = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--max-age-hours' && args[i + 1]) {
      maxAgeHours = parseFloat(args[i + 1]);
      i++;
    } else if (args[i] === '--fixture' && args[i + 1]) {
      fixturePath = path.resolve(args[i + 1]);
      i++;
    } else if (args[i] === '--dry-run') {
      dryRun = true;
    }
  }

  return { limit, maxAgeHours, onlyRelics, fixturePath, dryRun };
}

async function main() {
  const { limit, maxAgeHours, fixturePath, dryRun } = parseArgs();

  const relicsDataPath = path.join(DATA_DIR, 'relics.json');
  const pricesPath = path.join(DATA_DIR, 'prices.json');
  const metaPath = path.join(DATA_DIR, 'meta.json');

  if (!fs.existsSync(relicsDataPath)) {
    throw new Error('未找到 data/relics.json，请先运行 node scripts/build-data.mjs 生成基础数据！');
  }

  const { relics, items } = JSON.parse(fs.readFileSync(relicsDataPath, 'utf8'));

  // 收集所有遗物奖励的唯一 market slug
  const slugsToFetch = new Set();
  for (const r of relics) {
    for (const rew of r.rewards || []) {
      if (rew.marketSlug) {
        slugsToFetch.add(rew.marketSlug);
      }
    }
  }

  console.log(`[prices] 遗物奖励中包含的唯一 market slug 总数: ${slugsToFetch.size}`);

  // 读取现有 prices.json 缓存
  let priceCache = { updatedAt: null, items: {} };
  if (fs.existsSync(pricesPath)) {
    try {
      priceCache = JSON.parse(fs.readFileSync(pricesPath, 'utf8'));
      if (!priceCache.items) priceCache.items = {};
    } catch {}
  }

  const now = Date.now();
  const maxAgeMs = maxAgeHours * 60 * 60 * 1000;

  // 筛选需要更新的 slug
  const queue = [];
  for (const slug of slugsToFetch) {
    const cached = priceCache.items[slug];
    if (cached && cached.fetchedAt) {
      const fetchedTime = new Date(cached.fetchedAt).getTime();
      if (now - fetchedTime < maxAgeMs) {
        continue; // 24小时内抓取过，跳过
      }
    }
    queue.push(slug);
    if (queue.length >= limit) break;
  }

  console.log(`[prices] 待抓取更新数量 (跳过 ${maxAgeHours} 小时内已抓取项): ${queue.length}`);

  if (dryRun) {
    console.log(`[prices] --dry-run 模式，显示前 10 个待抓取 slug:`, queue.slice(0, 10));
    return;
  }

  // 若提供了 fixture，用于离线模拟测试
  if (fixturePath && fs.existsSync(fixturePath)) {
    console.log(`[prices] 使用离线 Fixture 模拟测试: ${fixturePath}`);
    const fixtureData = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
    const parsed = parseOrdersTop(fixtureData);

    for (const slug of queue) {
      priceCache.items[slug] = {
        ...parsed,
        fetchedAt: new Date().toISOString()
      };
    }
  } else if (queue.length > 0) {
    // 实例化限速器（严格 ≤ 3 req/s，间隔 350ms）
    const rateLimiter = new RateLimiter(350);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < queue.length; i++) {
      const slug = queue[i];
      const url = `${API_BASE}/orders/item/${encodeURIComponent(slug)}/top`;

      try {
        const res = await fetchWithRetry(url, {
          headers: { 'User-Agent': USER_AGENT }
        }, {
          maxRetries: 3,
          baseDelayMs: 1000,
          rateLimiter
        });

        if (res.status === 404) {
          // 该物品在 market 上暂无挂单或不存在
          priceCache.items[slug] = {
            sellMin: null,
            buyMax: null,
            sellCount: 0,
            buyCount: 0,
            fetchedAt: new Date().toISOString()
          };
          successCount++;
        } else if (res.ok) {
          const json = await res.json();
          const parsed = parseOrdersTop(json);
          priceCache.items[slug] = parsed;
          successCount++;
        } else {
          console.warn(`[prices] [${i + 1}/${queue.length}] 请求 ${slug} 失败 (HTTP ${res.status})`);
          failCount++;
        }
      } catch (err) {
        console.warn(`[prices] [${i + 1}/${queue.length}] 抓取 ${slug} 异常:`, err.message);
        failCount++;
      }

      if ((i + 1) % 50 === 0 || i === queue.length - 1) {
        console.log(`[prices] 进度: ${i + 1}/${queue.length} (成功: ${successCount}, 失败: ${failCount})`);
      }
    }
  }

  priceCache.updatedAt = new Date().toISOString();
  fs.writeFileSync(pricesPath, JSON.stringify(priceCache, null, 2));
  console.log(`[prices] 价格数据已写入 ${pricesPath}`);

  // 计算覆盖率并写入 data/meta.json
  const totalSlugsCount = slugsToFetch.size;
  let pricedCount = 0;
  for (const slug of slugsToFetch) {
    const item = priceCache.items[slug];
    if (item && (item.sellMin !== null || item.buyMax !== null)) {
      pricedCount++;
    }
  }

  const coveragePercent = totalSlugsCount > 0 ? ((pricedCount / totalSlugsCount) * 100).toFixed(1) + '%' : '0.0%';

  if (fs.existsSync(metaPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    meta.prices = {
      updatedAt: priceCache.updatedAt,
      pricedCount,
      totalCount: totalSlugsCount,
      coverage: coveragePercent
    };
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
    console.log(`[prices] 元数据 meta.json 已更新: 价格覆盖率 ${pricedCount}/${totalSlugsCount} (${coveragePercent})`);
  }
}

main().catch(err => {
  console.error('[prices] 执行失败:', err);
  process.exit(1);
});
