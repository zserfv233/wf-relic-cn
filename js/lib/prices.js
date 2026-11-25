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
