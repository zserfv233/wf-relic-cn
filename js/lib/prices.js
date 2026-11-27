/**
 * prices.js - 订单与价格数据解析纯函数（阶段 2 / M2 扩展）
 */

import { LOW_CONFIDENCE_MIN_SELLERS } from './calculations.js';
export { LOW_CONFIDENCE_MIN_SELLERS };

// v3: 所有价格与样本均为单件白金；v2 混用了不同 perTrade 的交易总价。
export const PRICE_SCHEMA_VERSION = 3;

function orderUnitPrice(order) {
  const perTrade = order.perTrade ?? order.per_trade ?? 1;
  if (!Number.isInteger(perTrade) || perTrade < 1 || perTrade > 6) return null;
  if (typeof order.platinum !== 'number' || !Number.isFinite(order.platinum) || order.platinum < 0) return null;
  return order.platinum / perTrade;
}

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
export function parseOrdersTop(ordersData, { onlineOnly = true, targetRank = null, slug = '', subtype = null, targetSubtype = null } = {}) {
  let sellOrders = [];
  let buyOrders = [];
  if (Array.isArray(ordersData)) {
    sellOrders = ordersData.filter(o => o && (o.order_type === 'sell' || o.orderType === 'sell'));
    buyOrders = ordersData.filter(o => o && (o.order_type === 'buy' || o.orderType === 'buy'));
  } else {
    sellOrders = ordersData?.data?.sell ?? ordersData?.sell ?? [];
    buyOrders = ordersData?.data?.buy ?? ordersData?.buy ?? [];
  }
  const effectiveSubtype = subtype || targetSubtype;

  // 1. 等级过滤（针对有等级的赋能与 Mod）
  const matchesRank = (order) => {
    if (targetRank === null || targetRank === undefined) return true;
    if (order.rank === undefined || order.rank === null) return true;
    return order.rank === targetRank;
  };

  const matchesSubtype = (order) => {
    if (!effectiveSubtype) return true;
    // 请求了 subtype 时只接受订单 subtype 字段存在且严格相等的订单；缺字段或不等一律排除
    if (!order || typeof order !== 'object' || order.subtype === undefined || order.subtype === null) {
      return false;
    }
    return order.subtype === effectiveSubtype;
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

  const validSellOrders = filteredSell.filter(o => orderUnitPrice(o) !== null);
  const validBuyOrders = filteredBuy.filter(o => orderUnitPrice(o) !== null);

  // platinum 是交易总价，quantity 是库存；只能按每一单自己的 perTrade 折算。
  // https://docs.warframe.market/docs/data-models/#order
  const sellPrices = validSellOrders.map(orderUnitPrice);
  const buyPrices = validBuyOrders.map(orderUnitPrice);

  const sortedSellPrices = sellPrices.slice().sort((a, b) => a - b);
  const sortedBuyPrices = buyPrices.slice().sort((a, b) => b - a);

  const rawSellMin = sortedSellPrices.length > 0 ? sortedSellPrices[0] : null;
  const rawBuyMax = sortedBuyPrices.length > 0 ? sortedBuyPrices[0] : null;

  // 倒挂报价隔离 (Codex Decision 10)
  const isCrossed = (rawSellMin !== null && rawBuyMax !== null && rawBuyMax > rawSellMin);
  const crossedMarket = isCrossed;
  const crossedMarketReason = isCrossed
    ? `报价倒挂：最高收购价 (${rawBuyMax} ☿) 高于最低卖价 (${rawSellMin} ☿)，两侧有效价格已隔离为缺价`
    : null;

  const sellMin = crossedMarket ? null : rawSellMin;
  const buyMax = crossedMarket ? null : rawBuyMax;

  const n = sortedSellPrices.length;
  let sellRobust = null;
  if (crossedMarket || n === 0) {
    sellRobust = null;
  } else if (n < 3) {
    sellRobust = sellMin;
  } else {
    // 最低 min(3, n) 个卖单价格的中位数
    const lowest3 = sortedSellPrices.slice(0, 3);
    sellRobust = lowest3[1];
  }

  // 判定用 uniqueSellers（同 rank/subtype/在线、价格有效的订单优先按稳定用户 ID 去重）
  const uniqueSellers = new Set(validSellOrders.map(o => o?.user?.id || o?.user?.ingameName).filter(Boolean)).size;
  const uniqueBuyers = new Set(validBuyOrders.map(o => o?.user?.id || o?.user?.ingameName).filter(Boolean)).size;

  const perTrade = filteredSell[0]?.per_trade || filteredSell[0]?.perTrade || null;

  // 结果里的 subtype 写被接受订单的实际 subtype（不写请求值）
  let orderSubtype = null;
  const acceptedOrders = [...validSellOrders, ...validBuyOrders];
  if (acceptedOrders.length > 0) {
    const distinctSubtypes = new Set(acceptedOrders.map(o => o.subtype).filter(Boolean));
    if (distinctSubtypes.size === 1) {
      orderSubtype = Array.from(distinctSubtypes)[0];
    }
  }

  const sourceUrl = slug 
    ? (targetRank !== null ? `warframe.market v2 /orders/item/${slug}/top?rank=${targetRank}` : `warframe.market v2 /orders/item/${slug}/top`)
    : 'warframe.market v2 /orders/item/{slug}/top';

  const singleSided = (n > 0 && sortedBuyPrices.length === 0) ? 'sell' : (n === 0 && sortedBuyPrices.length > 0 ? 'buy' : null);
  const noOrders = n === 0 && sortedBuyPrices.length === 0;

  return {
    priceSchemaVersion: PRICE_SCHEMA_VERSION,
    priceUnit: 'platinum/item',
    // 保留每单总价和数量，避免只存排序后的价格而无法审计批量报价倒挂。
    rawOrderSamples: Object.fromEntries([
      ['sell', validSellOrders], ['buy', validBuyOrders]
    ].map(([side, orders]) => [side, orders.map(o => ({
      platinum: o.platinum,
      perTrade: o.perTrade ?? o.per_trade ?? 1,
      unitPrice: orderUnitPrice(o),
      rank: o.rank ?? null,
      subtype: o.subtype ?? null
    }))])),
    sellMin,
    buyMax,
    rawSellMin,
    rawBuyMax,
    rawSellRobust: (n === 0 ? null : (n < 3 ? rawSellMin : sortedSellPrices.slice(0, 3)[1])),
    crossedMarket,
    crossedMarketReason,
    singleSided,
    noOrders,
    sellCount: n,
    buyCount: sortedBuyPrices.length,
    sellRobust,
    robustUnavailable: false,
    lowConfidence: uniqueSellers < LOW_CONFIDENCE_MIN_SELLERS || sellMin === null,
    buyLowConfidence: uniqueBuyers < LOW_CONFIDENCE_MIN_SELLERS || buyMax === null,
    sellerCountUnverified: false,
    buyerCountUnverified: false,
    noBuyOrders: sortedBuyPrices.length === 0 || rawBuyMax === null,
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
    let item = null;
    if (category === 'rivens' || k.includes('riven')) {
      item = priceItems[`${k}@unrevealed`];
    } else {
      item = priceItems[k];
    }
    if (item) {
      const sell = item.sellMin;
      const buy = item.buyMax;
      const isCrossed = (typeof sell === 'number' && Number.isFinite(sell) && typeof buy === 'number' && Number.isFinite(buy) && buy > sell);
      if (!isCrossed && (sell !== null || buy !== null)) {
        priced++;
      }
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
