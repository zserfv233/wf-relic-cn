/**
 * prices.js - 订单与价格数据解析纯函数（阶段 2 / M2 扩展）
 */

// 常量：低置信度最小卖家数（建议参数，非游戏规则）
export const LOW_CONFIDENCE_MIN_SELLERS = 3;

/**
 * 解析 Warframe.Market v2 orders/top 响应数据
 * @param {Object} ordersData API 返回的原始数据或 fixture
 * @param {Object} options 配置项:
 *   - onlineOnly: 默认 true, 优先在线/游戏内玩家
 *   - targetRank: 目标等级 (0 或 maxRank)，若传入则严格筛选 o.rank === targetRank 的挂单
 *   - slug: 物品 market slug
 *   - subtype: 紫卡等子类型 (如 'unrevealed')
 * @returns {Object}
 */
export function parseOrdersTop(ordersData, { onlineOnly = true, targetRank = null, slug = '', subtype = null } = {}) {
  const sellOrders = ordersData?.data?.sell ?? ordersData?.sell ?? [];
  const buyOrders = ordersData?.data?.buy ?? ordersData?.buy ?? [];

  // 1. 等级过滤（针对有等级的赋能与 Mod）
  const matchesRank = (order) => {
    if (targetRank === null || targetRank === undefined) return true;
    if (order.rank === undefined || order.rank === null) return true;
    return order.rank === targetRank;
  };

  const matchesSubtype = (order) => {
    if (!subtype) return true;
    if (!order.subtype) return true;
    return order.subtype === subtype;
  };

  const isOnline = (order) => {
    if (!onlineOnly) return true;
    const status = order?.user?.status;
    if (!status) return true; // fixture 或简易数据无 status 时保留
    return status === 'ingame' || status === 'online';
  };

  // 筛选等级与 subtype 匹配的挂单
  const rankFilteredSell = sellOrders.filter(matchesRank).filter(matchesSubtype);
  const rankFilteredBuy = buyOrders.filter(matchesRank).filter(matchesSubtype);

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
    .filter(p => typeof p === 'number' && Number.isFinite(p) && p >= 0);

  const buyPrices = filteredBuy
    .map(o => o.platinum)
    .filter(p => typeof p === 'number' && Number.isFinite(p) && p >= 0);

  const sortedSellPrices = sellPrices.slice().sort((a, b) => a - b);
  const sortedBuyPrices = buyPrices.slice().sort((a, b) => b - a);

  const sellMin = sortedSellPrices.length > 0 ? sortedSellPrices[0] : null;
  const buyMax = sortedBuyPrices.length > 0 ? sortedBuyPrices[0] : null;

  const n = sortedSellPrices.length;
  let sellRobust = null;
  if (n === 0) {
    sellRobust = null;
  } else if (n < 3) {
    sellRobust = sellMin;
  } else {
    // 最低 min(3, n) 个卖单价格的中位数
    const lowest3 = sortedSellPrices.slice(0, 3);
    sellRobust = lowest3[1];
  }

  const uniqueSellers = new Set(filteredSell.map(o => o?.user?.ingameName || o?.user?.id).filter(Boolean)).size;
  const uniqueBuyers = new Set(filteredBuy.map(o => o?.user?.ingameName || o?.user?.id).filter(Boolean)).size;

  const perTrade = filteredSell[0]?.per_trade || filteredSell[0]?.perTrade || null;
  const orderSubtype = subtype || filteredSell[0]?.subtype || ordersData?.subtype || null;

  const sourceUrl = slug 
    ? (targetRank !== null ? `warframe.market v2 /orders/item/${slug}/top?rank=${targetRank}` : `warframe.market v2 /orders/item/${slug}/top`)
    : 'warframe.market v2 /orders/item/{slug}/top';

  return {
    sellMin,
    buyMax,
    sellCount: n,
    buyCount: sortedBuyPrices.length,
    sellRobust,
    robustUnavailable: false,
    lowConfidence: n < LOW_CONFIDENCE_MIN_SELLERS || sellMin === null,
    noBuyOrders: sortedBuyPrices.length === 0 || buyMax === null,
    uniqueSellers,
    uniqueBuyers,
    sellSamples: sortedSellPrices,
    buySamples: sortedBuyPrices,
    subtype: orderSubtype,
    perTrade,
    rank: targetRank,
    source: sourceUrl,
    fetchedAt: new Date().toISOString()
  };
}

/**
 * 辅助：计算单个分类的覆盖统计
 * @param {Array<string>} targetKeys 
 * @param {Object} priceItems 
 * @param {Object} options
 * @returns {Object} { pricedCount, totalCount, coverage }
 */
export function computeCategoryStats(targetKeys = [], priceItems = {}, { category = '' } = {}) {
  const uniqueKeys = Array.from(new Set(targetKeys));
  let priced = 0;
  for (const k of uniqueKeys) {
    let item = priceItems[k];
    if (!item && (category === 'rivens' || k.includes('riven'))) {
      item = priceItems[`${k}@unrevealed`] || priceItems[k];
    }
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
  const rivensStats = computeCategoryStats(rivenSlugs, priceItems, { category: 'rivens' });
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
