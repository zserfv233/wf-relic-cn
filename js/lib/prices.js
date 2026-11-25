/**
 * prices.js - 订单与价格数据解析纯函数（阶段 2 扩展）
 */

/**
 * 解析 Warframe.Market v2 orders/top 响应数据
 * @param {Object} ordersData API 返回的原始数据或 fixture
 * @param {Object} options 配置项:
 *   - onlineOnly: 默认 true, 优先在线/游戏内玩家
 *   - targetRank: 目标等级 (0 或 maxRank)，若传入则严格筛选 o.rank === targetRank 的挂单
 *   - slug: 物品 market slug
 * @returns {Object} { sellMin, buyMax, sellCount, buyCount, rank, source, fetchedAt }
 */
export function parseOrdersTop(ordersData, { onlineOnly = true, targetRank = null, slug = '' } = {}) {
  const sellOrders = ordersData?.data?.sell ?? ordersData?.sell ?? [];
  const buyOrders = ordersData?.data?.buy ?? ordersData?.buy ?? [];

  // 1. 等级过滤（针对有等级的赋能与 Mod）
  const matchesRank = (order) => {
    if (targetRank === null || targetRank === undefined) return true;
    if (order.rank === undefined || order.rank === null) return true;
    return order.rank === targetRank;
  };

  const isOnline = (order) => {
    if (!onlineOnly) return true;
    const status = order?.user?.status;
    if (!status) return true; // fixture 或简易数据无 status 时保留
    return status === 'ingame' || status === 'online';
  };

  // 筛选等级匹配的挂单
  const rankFilteredSell = sellOrders.filter(matchesRank);
  const rankFilteredBuy = buyOrders.filter(matchesRank);

  // 筛选在线挂单
  let filteredSell = rankFilteredSell.filter(isOnline);
  if (filteredSell.length === 0 && rankFilteredSell.length > 0) {
    filteredSell = rankFilteredSell; // 全部离线时的降级回退
  }

  let filteredBuy = rankFilteredBuy.filter(isOnline);
  if (filteredBuy.length === 0 && rankFilteredBuy.length > 0) {
    filteredBuy = rankFilteredBuy;
  }

  const sellPrices = filteredSell
    .map(o => o.platinum)
    .filter(p => typeof p === 'number' && !isNaN(p) && p >= 0);

  const buyPrices = filteredBuy
    .map(o => o.platinum)
    .filter(p => typeof p === 'number' && !isNaN(p) && p >= 0);

  const sourceUrl = slug 
    ? (targetRank !== null ? `warframe.market v2 /orders/item/${slug}/top?rank=${targetRank}` : `warframe.market v2 /orders/item/${slug}/top`)
    : 'warframe.market v2 /orders/item/{slug}/top';

  return {
    sellMin: sellPrices.length > 0 ? Math.min(...sellPrices) : null,
    buyMax: buyPrices.length > 0 ? Math.max(...buyPrices) : null,
    sellCount: sellPrices.length,
    buyCount: buyPrices.length,
    rank: targetRank,
    source: sourceUrl,
    fetchedAt: new Date().toISOString()
  };
}

/**
 * 辅助：计算单个分类的覆盖统计
 * @param {Array<string>} targetKeys 
 * @param {Object} priceItems 
 * @returns {Object} { pricedCount, totalCount, coverage }
 */
export function computeCategoryStats(targetKeys = [], priceItems = {}) {
  const uniqueKeys = Array.from(new Set(targetKeys));
  let priced = 0;
  for (const k of uniqueKeys) {
    const item = priceItems[k];
    if (item && (item.sellMin !== null || item.buyMax !== null)) {
      priced++;
    }
  }
  const total = uniqueKeys.length;
  // 覆盖率不得超过 100%
  const clampedPriced = Math.min(priced, total);
  const coverage = total > 0 ? Math.min(100, (clampedPriced / total) * 100).toFixed(1) + '%' : '0.0%';
  return { pricedCount: clampedPriced, totalCount: total, coverage };
}

/**
 * 统一计算价格覆盖率 (relics, rivens, arcanes, mods)
 * @param {Object} pricesJson { updatedAt, items: {} }
 * @param {Object} datasets 包含各类数据集 { relics, rivens, arcanes, mods } 或已抽取的 keys
 * @returns {Object} { updatedAt, pricedCount, totalCount, coverage, categories: { relics, rivens, arcanes, mods } }
 */
export function calculatePriceCoverage(pricesJson = {}, datasets = {}) {
  const priceItems = pricesJson?.items || {};

  // 1. Relics: 遗物奖励里有 marketSlug 的唯一 slug
  let relicSlugs = [];
  if (datasets.relicSlugs) {
    relicSlugs = Array.from(new Set(datasets.relicSlugs));
  } else if (datasets.relics) {
    const slugs = new Set();
    for (const r of datasets.relics) {
      for (const rew of r.rewards || []) {
        if (rew.marketSlug) slugs.add(rew.marketSlug);
      }
    }
    relicSlugs = Array.from(slugs);
  }

  // 2. Rivens: 8 个未开紫卡 slug
  let rivenSlugs = [];
  if (datasets.rivenSlugs) {
    rivenSlugs = datasets.rivenSlugs;
  } else if (datasets.rivens) {
    rivenSlugs = datasets.rivens.map(r => r.slug || r.id);
  }

  // 3. Arcanes: slug@r0 与 slug@rN (N 为 maxRank, maxRank > 0 时有 2 个键)
  let arcaneKeys = [];
  if (datasets.arcaneKeys) {
    arcaneKeys = datasets.arcaneKeys;
  } else if (datasets.arcanes) {
    for (const a of datasets.arcanes) {
      const maxRank = a.maxRank ?? 5;
      if (maxRank > 0) {
        arcaneKeys.push(`${a.slug}@r0`);
        arcaneKeys.push(`${a.slug}@r${maxRank}`);
      } else {
        arcaneKeys.push(a.slug);
      }
    }
  }

  // 4. Mods: slug@r0 与 slug@rN (N 为 maxRank, maxRank > 0 时有 2 个键)
  let modKeys = [];
  if (datasets.modKeys) {
    modKeys = datasets.modKeys;
  } else if (datasets.mods) {
    for (const m of datasets.mods) {
      const maxRank = m.maxRank ?? 3;
      if (maxRank > 0) {
        modKeys.push(`${m.slug}@r0`);
        modKeys.push(`${m.slug}@r${maxRank}`);
      } else {
        modKeys.push(m.slug);
      }
    }
  }

  const relicsStats = computeCategoryStats(relicSlugs, priceItems);
  const rivensStats = computeCategoryStats(rivenSlugs, priceItems);
  const arcanesStats = computeCategoryStats(arcaneKeys, priceItems);
  const modsStats = computeCategoryStats(modKeys, priceItems);

  const totalCount = relicsStats.totalCount + rivensStats.totalCount + arcanesStats.totalCount + modsStats.totalCount;
  const totalPriced = relicsStats.pricedCount + rivensStats.pricedCount + arcanesStats.pricedCount + modsStats.pricedCount;
  const totalCoverage = totalCount > 0 ? Math.min(100, (totalPriced / totalCount) * 100).toFixed(1) + '%' : '0.0%';

  return {
    updatedAt: pricesJson?.updatedAt || null,
    pricedCount: totalPriced,
    totalCount,
    coverage: totalCoverage,
    categories: {
      relics: relicsStats,
      rivens: rivensStats,
      arcanes: arcanesStats,
      mods: modsStats
    }
  };
}
