/**
 * prices.js - 订单与价格数据解析纯函数
 */

/**
 * 解析 Warframe.Market v2 orders/top 响应数据
 * @param {Object} ordersData API 返回的原始数据或 fixture
 * @param {Object} options 配置项: onlineOnly (默认 true, 优先在线/游戏内玩家，若无则使用全部)
 * @returns {Object} { sellMin, buyMax, sellCount, buyCount, fetchedAt }
 */
export function parseOrdersTop(ordersData, { onlineOnly = true } = {}) {
  const sellOrders = ordersData?.data?.sell ?? ordersData?.sell ?? [];
  const buyOrders = ordersData?.data?.buy ?? ordersData?.buy ?? [];

  const isOnline = (order) => {
    if (!onlineOnly) return true;
    const status = order?.user?.status;
    if (!status) return true; // fixture 或简易数据无 status 时保留
    return status === 'ingame' || status === 'online';
  };

  let filteredSell = sellOrders.filter(isOnline);
  if (filteredSell.length === 0 && sellOrders.length > 0) {
    filteredSell = sellOrders; // 全部离线时的降级回退
  }

  let filteredBuy = buyOrders.filter(isOnline);
  if (filteredBuy.length === 0 && buyOrders.length > 0) {
    filteredBuy = buyOrders;
  }

  const sellPrices = filteredSell
    .map(o => o.platinum)
    .filter(p => typeof p === 'number' && !isNaN(p) && p >= 0);

  const buyPrices = filteredBuy
    .map(o => o.platinum)
    .filter(p => typeof p === 'number' && !isNaN(p) && p >= 0);

  return {
    sellMin: sellPrices.length > 0 ? Math.min(...sellPrices) : null,
    buyMax: buyPrices.length > 0 ? Math.max(...buyPrices) : null,
    sellCount: sellPrices.length,
    buyCount: buyPrices.length,
    fetchedAt: new Date().toISOString()
  };
}
