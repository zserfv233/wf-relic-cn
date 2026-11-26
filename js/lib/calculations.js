/**
 * calculations.js - 期望白金值计算纯函数（阶段 M1 / M2 扩展）
 */

// 常量：低置信度最小卖家数（建议参数，非游戏规则）
export const LOW_CONFIDENCE_MIN_SELLERS = 3;

/**
 * 判断价格条目在指定模式与门槛下是否属于低置信度
 * @param {Object|null} entry 
 * @param {string} priceType 'sellMin' | 'buyMax'
 * @param {number} minSellers 门槛卖家数，默认 LOW_CONFIDENCE_MIN_SELLERS (3)
 * @returns {boolean}
 */
export function isPriceEntryLowConfidence(entry, priceType = 'sellMin', minSellers = LOW_CONFIDENCE_MIN_SELLERS) {
  if (!entry) return true;
  if (priceType === 'buyMax') {
    if (entry.buyMax === null || entry.buyMax === undefined) return true;
    if (entry.buyerCountUnverified || typeof entry.uniqueBuyers !== 'number') return true;
    return entry.uniqueBuyers < minSellers;
  }
  if (entry.sellMin === null || entry.sellMin === undefined) return true;
  if (entry.sellerCountUnverified || typeof entry.uniqueSellers !== 'number') return true;
  return entry.uniqueSellers < minSellers;
}

/**
 * 赋能满级合成所需 0 级数量
 * 公式：N(r) = (r + 1)(r + 2) / 2
 * 例如：Rank 5 -> 21 个，Rank 3 -> 10 个，Rank 0 -> 1 个
 * @param {number} r 赋能最大等级 (maxRank)
 * @returns {number|null} 若 r 非法或未知返回 null
 */
export function arcaneCopiesForRank(r) {
  if (typeof r !== 'number' || !Number.isInteger(r) || r < 0) return null;
  return ((r + 1) * (r + 2)) / 2;
}

/**
 * 判断物品是否为已确认的不可交易物（如 Forma Blueprint）
 * @param {Object} item 
 * @returns {boolean}
 */
export function isUntradeableItem(item) {
  if (!item || typeof item !== 'object') return false;
  if (item.untradeable === true) return true;
  const slug = item.marketSlug ?? item.slug;
  if (slug === 'forma_blueprint') return true;
  const name = item.baseName || item.itemName || item.name || '';
  if (name.includes('Forma Blueprint')) return true;
  return false;
}

/**
 * 获取物品对应的价格条目及派生分析字段
 * @param {string} slug 
 * @param {number|null} rank 等级 (0 或 maxRank)，无等级传 null
 * @param {Object} prices 
 * @returns {Object|null}
 */
export function getPriceEntry(slug, rank = null, prices = {}) {
  if (!slug || typeof slug !== 'string' || !prices) return null;

  let key = slug;

  // 1. 若请求了具体等级 (rank !== null)，严禁回退到基础 slug
  if (rank !== null && rank !== undefined) {
    key = `${slug}@r${rank}`;
    if (!prices[key]) {
      return null;
    }
  } else {
    // 2. 无等级请求：
    // 紫卡契约（见 docs/wfm-subtype.md）：只认 ${slug}@unrevealed，旧键或无 subtype 键一律返回 null，彻底废除回退
    if (slug.includes('riven')) {
      const unrevealedKey = `${slug}@unrevealed`;
      if (prices[unrevealedKey]) {
        key = unrevealedKey;
      } else {
        return null;
      }
    } else {
      if (prices[slug]) {
        key = slug;
      } else {
        return null;
      }
    }
  }

  const rawItem = prices[key];
  if (!rawItem || typeof rawItem !== 'object') return null;

  // 带版本号的缓存字段契约 (priceSchemaVersion: 2)
  // 新格式优先读取明确存在的 raw 字段 (区分字段不存在与明确 null)
  // 旧格式从原 sellMin/buyMax 派生
  const isV2OrHasExplicitRaw = rawItem.priceSchemaVersion >= 2 
    || Object.prototype.hasOwnProperty.call(rawItem, 'rawSellMin') 
    || Object.prototype.hasOwnProperty.call(rawItem, 'rawBuyMax');

  let rawSellMin = null;
  let rawBuyMax = null;

  if (isV2OrHasExplicitRaw) {
    rawSellMin = (typeof rawItem.rawSellMin === 'number' && Number.isFinite(rawItem.rawSellMin) && rawItem.rawSellMin >= 0) ? rawItem.rawSellMin : null;
    rawBuyMax = (typeof rawItem.rawBuyMax === 'number' && Number.isFinite(rawItem.rawBuyMax) && rawItem.rawBuyMax >= 0) ? rawItem.rawBuyMax : null;
  } else {
    rawSellMin = (typeof rawItem.sellMin === 'number' && Number.isFinite(rawItem.sellMin) && rawItem.sellMin >= 0) ? rawItem.sellMin : null;
    rawBuyMax = (typeof rawItem.buyMax === 'number' && Number.isFinite(rawItem.buyMax) && rawItem.buyMax >= 0) ? rawItem.buyMax : null;
  }

  const sellCount = typeof rawItem.sellCount === 'number' ? rawItem.sellCount : (Array.isArray(rawItem.sellSamples) ? rawItem.sellSamples.length : 0);
  const buyCount = typeof rawItem.buyCount === 'number' ? rawItem.buyCount : (Array.isArray(rawItem.buySamples) ? rawItem.buySamples.length : 0);

  // 倒挂报价隔离 (Codex 1126c 第 7 项)
  // 严格 rawBuyMax > rawSellMin 才倒挂，相等不算
  const isCrossed = (rawSellMin !== null && rawBuyMax !== null && rawBuyMax > rawSellMin);
  const crossedMarket = isCrossed;
  const crossedMarketReason = isCrossed
    ? `报价倒挂：最高收购价 (${rawBuyMax} ☿) 高于最低卖价 (${rawSellMin} ☿)，两侧有效价格已隔离为缺价`
    : null;

  let sellMin = null;
  let buyMax = null;
  if (crossedMarket) {
    sellMin = null;
    buyMax = null;
  } else {
    if (isV2OrHasExplicitRaw) {
      sellMin = (typeof rawItem.sellMin === 'number' && Number.isFinite(rawItem.sellMin) && rawItem.sellMin >= 0)
        ? rawItem.sellMin
        : (rawItem.singleSided === 'buy' ? null : rawSellMin);
      buyMax = (typeof rawItem.buyMax === 'number' && Number.isFinite(rawItem.buyMax) && rawItem.buyMax >= 0)
        ? rawItem.buyMax
        : (rawItem.singleSided === 'sell' ? null : rawBuyMax);
    } else {
      sellMin = rawSellMin;
      buyMax = rawBuyMax;
    }
  }

  // sellRobust: 最低 min(3, n) 个卖单价格的中位数（n<3 时等于现有逻辑 sellMin 但标低置信）
  let sellRobust = null;
  let robustUnavailable = false;
  if (crossedMarket) {
    sellRobust = null;
  } else if (rawItem.sellRobust !== undefined && rawItem.sellRobust !== null) {
    sellRobust = rawItem.sellRobust;
  } else {
    robustUnavailable = true;
    sellRobust = sellMin;
  }

  // 低置信判定：判定用 uniqueSellers（按稳定用户 ID 去重）；
  // 旧缓存没有 uniqueSellers 时标 sellerCountUnverified: true，不能凭 sellCount 认定达标（即视为低置信）。
  // 买侧用 uniqueBuyers 独立判定。
  const hasUniqueSellers = typeof rawItem.uniqueSellers === 'number';
  const sellerCountUnverified = !hasUniqueSellers;
  const uniqueSellers = hasUniqueSellers ? rawItem.uniqueSellers : null;

  const hasUniqueBuyers = typeof rawItem.uniqueBuyers === 'number';
  const buyerCountUnverified = !hasUniqueBuyers;
  const uniqueBuyers = hasUniqueBuyers ? rawItem.uniqueBuyers : null;

  const lowConfidence = sellMin === null || sellerCountUnverified || uniqueSellers < LOW_CONFIDENCE_MIN_SELLERS;
  const buyLowConfidence = buyMax === null || buyerCountUnverified || uniqueBuyers < LOW_CONFIDENCE_MIN_SELLERS;
  // noBuyOrders 不能由隔离后的 buyMax=null 推导，反映真实买单数量与 rawBuyMax 状态
  const noBuyOrders = buyCount === 0 || rawBuyMax === null;

  return {
    ...rawItem,
    priceSchemaVersion: rawItem.priceSchemaVersion || 2,
    key,
    sellMin,
    buyMax,
    rawSellMin,
    rawBuyMax,
    crossedMarket,
    crossedMarketReason,
    sellCount,
    buyCount,
    uniqueSellers,
    uniqueBuyers,
    sellerCountUnverified,
    buyerCountUnverified,
    sellRobust,
    robustUnavailable,
    lowConfidence,
    buyLowConfidence,
    noBuyOrders
  };
}

/**
 * 格式化物品白金价格展示（支持倒挂隔离提示与未挂单兜底）
 * @param {number|null} price - 有效白金价格
 * @param {Object|null} priceEntry - getPriceEntry 返回的价格条目
 * @param {string} [suffix=' ☿'] - 白金符号后缀
 * @returns {string} HTML 格式化字符串
 */
export function formatPriceDisplay(price, priceEntry = null, suffix = ' ☿') {
  if (priceEntry?.crossedMarket) {
    const reason = priceEntry.crossedMarketReason || '买价高于卖价，报价倒挂隔离';
    const escapedReason = String(reason).replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m]);
    return `<span style="color: #fbbf24; font-size: 0.85em;" title="${escapedReason}">⚠️ 倒挂隔离 (卖 ${priceEntry.rawSellMin} / 买 ${priceEntry.rawBuyMax})</span>`;
  }
  if (price === null || price === undefined) {
    return '<span style="color: var(--text-muted); font-size: 0.85em;">暂无挂单</span>';
  }
  return `${price}${suffix}`;
}

/**
 * 获取物品在指定精炼/等级下的有效单价
 * @param {string} slug 
 * @param {number|null} rank 等级 (0 或 maxRank)，无等级传 null
 * @param {Object} prices 
 * @param {string} priceType 'sellMin' | 'buyMax'
 * @returns {number|null}
 */
export function getItemPrice(slug, rank = null, prices = {}, priceType = 'sellMin') {
  const entry = getPriceEntry(slug, rank, prices);
  if (!entry) return null;
  const p = entry[priceType];
  if (typeof p === 'number' && Number.isFinite(p) && p >= 0) {
    return p;
  }
  return null;
}

/**
 * 计算单个精炼等级的遗物期望白金值
 * 期望值 = Σ(单项掉率% / 100 * quantity * 价格)
 * 若遗物中全部物品均无已知价格，返回 expectedValue: null
 * @param {Array} rewards 
 * @param {Object} prices 
 * @param {Object} options 
 * @returns {Object}
 */
export function calculateExpectedValue(rewards = [], prices = {}, { priceType = 'sellMin', refinement = 'intact', minSellers = LOW_CONFIDENCE_MIN_SELLERS } = {}) {
  // 检查该精炼档是否存在（如 Requiem ETERNA 的 exceptional/flawless/radiant 全为 null）
  const allChancesNull = rewards.length > 0 && rewards.every(rew => {
    const rawChance = rew.chances ? rew.chances[refinement] : rew.chance;
    return rawChance === null || rawChance === undefined || rawChance === '';
  });

  if (allChancesNull) {
    return {
      expectedValue: null,
      expectedValueRaw: null,
      expectedValueConfident: null,
      expectedValueConfidentRaw: null,
      unsupportedRefinement: true,
      notApplicable: true,
      incomplete: false,
      pricedProbability: 0,
      missingProbability: 0,
      untradeableProbability: 0,
      lowConfidenceCount: 0,
      lowConfidenceProbability: 0,
      unknownChanceCount: 0,
      pricedCount: 0,
      confidentPricedCount: 0,
      missingCount: 0,
      missingPriceCount: 0,
      untradeableCount: 0,
      breakdown: []
    };
  }

  let totalKnown = 0;
  let totalConfidentKnown = 0;
  let pricedCount = 0;
  let confidentPricedCount = 0;
  let missingCount = 0;
  let untradeableCount = 0;
  let unknownChanceCount = 0;
  let lowConfidenceCount = 0;
  let lowConfidenceProbability = 0;
  let pricedProbability = 0;
  let missingProbability = 0;
  let untradeableProbability = 0;
  const breakdown = [];

  for (const rew of rewards) {
    const rawChance = rew.chances ? rew.chances[refinement] : rew.chance;
    const name = rew.name || rew.itemName || '';
    const baseName = rew.baseName || name;
    const zhName = rew.zhName || rew.itemZh || name;
    const rarity = rew.rarity;
    const quantity = (typeof rew.quantity === 'number' && Number.isFinite(rew.quantity) && rew.quantity > 0)
      ? rew.quantity
      : 1;

    // 概率缺失或非法 -> unknownChance，贡献 null
    if (rawChance === null || rawChance === undefined || rawChance === '' || !Number.isFinite(Number(rawChance))) {
      unknownChanceCount++;
      breakdown.push({
        name,
        baseName,
        quantity,
        zhName,
        rarity,
        chance: null,
        price: null,
        contribution: null,
        status: 'unknownChance'
      });
      continue;
    }

    // ETERNA 等官方出处覆盖：若存在 effectiveChance，在 intact 档采用有效掉率计算 EV 与有效概率
    let effectiveChanceVal = Number(rawChance);
    if (refinement === 'intact' && typeof rew.effectiveChance === 'number' && Number.isFinite(rew.effectiveChance)) {
      effectiveChanceVal = rew.effectiveChance;
    }
    const chance = effectiveChanceVal;
    const slug = rew.marketSlug || rew.slug;

    // 已确认不可交易 (如 Forma Blueprint) -> 明确记 0，归类 'untradeable'
    if (isUntradeableItem(rew)) {
      untradeableCount++;
      untradeableProbability += chance;
      breakdown.push({
        name,
        baseName,
        quantity,
        zhName,
        rarity,
        chance,
        price: 0,
        contribution: 0,
        status: 'untradeable'
      });
      continue;
    }

    // 遗物奖励无等级，调用 rank = null
    const entry = getPriceEntry(slug, null, prices);
    const price = entry ? entry[priceType] : null;

    if (typeof price === 'number' && price > 0) {
      pricedCount++;
      pricedProbability += chance;
      const contribution = (chance / 100) * quantity * price;
      totalKnown += contribution;

      // 评估低置信度（按 uniqueSellers / uniqueBuyers）
      const isLowConf = isPriceEntryLowConfidence(entry, priceType, minSellers);

      if (isLowConf) {
        lowConfidenceCount++;
        lowConfidenceProbability += chance;
      } else {
        confidentPricedCount++;
        totalConfidentKnown += contribution;
      }

      breakdown.push({
        name,
        baseName,
        quantity,
        zhName,
        rarity,
        chance,
        price,
        contribution: Number(contribution.toFixed(4)),
        lowConfidence: isLowConf,
        status: isLowConf ? 'lowConfidence' : 'priced'
      });
    } else {
      // 价格缺失（可能可交易但无 slug、或缓存无价/无挂单）-> 贡献 null
      missingCount++;
      missingProbability += chance;
      breakdown.push({
        name,
        baseName,
        quantity,
        zhName,
        rarity,
        chance,
        price: null,
        contribution: null,
        status: 'missing'
      });
    }
  }

  const incomplete = (missingCount > 0 || unknownChanceCount > 0);
  const expectedValueRaw = pricedCount > 0 ? totalKnown : (missingCount === 0 && unknownChanceCount === 0 && untradeableCount > 0 ? 0 : null);
  const expectedValue = expectedValueRaw !== null ? Number(expectedValueRaw.toFixed(2)) : null;

  const expectedValueConfidentRaw = confidentPricedCount > 0
    ? totalConfidentKnown
    : (pricedCount === 0 && missingCount === 0 && unknownChanceCount === 0 && untradeableCount > 0 ? 0 : null);
  const expectedValueConfident = expectedValueConfidentRaw !== null ? Number(expectedValueConfidentRaw.toFixed(2)) : null;

  return {
    expectedValue,
    expectedValueRaw,
    expectedValueConfident,
    expectedValueConfidentRaw,
    lowConfidenceCount,
    lowConfidenceProbability: Number(lowConfidenceProbability.toFixed(4)),
    unsupportedRefinement: false,
    notApplicable: false,
    incomplete,
    pricedProbability: Number(pricedProbability.toFixed(4)),
    missingProbability: Number(missingProbability.toFixed(4)),
    untradeableProbability: Number(untradeableProbability.toFixed(4)),
    unknownChanceCount,
    pricedCount,
    confidentPricedCount,
    missingCount,
    missingPriceCount: missingCount, // 兼容现有测试与调用方
    untradeableCount,
    breakdown
  };
}

/**
 * 计算四个精炼等级的全部期望白金
 */
export function calculateAllRefinementValues(rewards = [], prices = {}, { priceType = 'sellMin', minSellers = LOW_CONFIDENCE_MIN_SELLERS } = {}) {
  const refinements = ['intact', 'exceptional', 'flawless', 'radiant'];
  const result = {};
  for (const ref of refinements) {
    result[ref] = calculateExpectedValue(rewards, prices, { priceType, refinement: ref, minSellers });
  }
  return result;
}

/**
 * 任务/轮次/赏金来源期望白金计算
 * 每次期望白金 = Σ (物品掉率% / 100 * quantity * 价格)
 * 赋能/Mod 默认使用 0 级掉落价格
 * @param {Array} rewards 来源内的奖励列表 [{ itemName, slug, chance, category }]
 * @param {Object} prices 
 * @param {Object} options 
 * @returns {Object}
 */
export function calculateSourceExpectedValue(rewards = [], prices = {}, { priceType = 'sellMin', minSellers = LOW_CONFIDENCE_MIN_SELLERS, contaminated = false } = {}) {
  if (contaminated || rewards?.contaminated) {
    return {
      expectedValue: null,
      expectedValueRaw: null,
      expectedValueConfident: null,
      expectedValueConfidentRaw: null,
      contaminated: true,
      lowConfidenceCount: 0,
      lowConfidenceProbability: 0,
      incomplete: true,
      pricedProbability: 0,
      missingProbability: 0,
      untradeableProbability: 0,
      unknownChanceCount: 0,
      pricedCount: 0,
      confidentPricedCount: 0,
      missingCount: 0,
      untradeableCount: 0,
      totalItems: rewards ? rewards.length : 0,
      missingItems: []
    };
  }

  let totalKnown = 0;
  let totalConfidentKnown = 0;
  let pricedCount = 0;
  let confidentPricedCount = 0;
  let missingCount = 0;
  let untradeableCount = 0;
  let unknownChanceCount = 0;
  let lowConfidenceCount = 0;
  let lowConfidenceProbability = 0;
  let pricedProbability = 0;
  let missingProbability = 0;
  let untradeableProbability = 0;
  const missingItems = [];

  for (const item of rewards) {
    const rawChance = item.chance;

    if (rawChance === null || rawChance === undefined || rawChance === '' || !Number.isFinite(Number(rawChance))) {
      unknownChanceCount++;
      continue;
    }

    const chance = Number(rawChance);
    const quantity = (typeof item.quantity === 'number' && Number.isFinite(item.quantity) && item.quantity > 0)
      ? item.quantity
      : 1;

    if (isUntradeableItem(item)) {
      untradeableCount++;
      untradeableProbability += chance;
      continue;
    }

    const slug = item.slug;
    let rank = null;
    if (prices && prices[`${slug}@r0`]) {
      rank = 0;
    } else if (item.maxRank && item.maxRank > 0) {
      rank = 0;
    } else if ((item.category === 'mod' || item.category === 'arcane') && !prices[slug]) {
      rank = 0;
    }

    const entry = getPriceEntry(slug, rank, prices);
    const price = entry ? entry[priceType] : null;

    if (typeof price === 'number' && price > 0) {
      pricedCount++;
      pricedProbability += chance;
      const contribution = (chance / 100) * quantity * price;
      totalKnown += contribution;

      const isLowConf = isPriceEntryLowConfidence(entry, priceType, minSellers);

      if (isLowConf) {
        lowConfidenceCount++;
        lowConfidenceProbability += chance;
      } else {
        confidentPricedCount++;
        totalConfidentKnown += contribution;
      }
    } else {
      missingCount++;
      missingProbability += chance;
      missingItems.push({
        name: item.itemName || item.modName || item.name || '',
        itemName: item.itemName || item.modName || item.name || '',
        baseName: item.baseName || item.name || '',
        zhName: item.itemZh || item.zhName || item.itemName || '',
        quantity,
        chance,
        rarity: item.rarity || 'Common',
        slug: item.slug || null
      });
    }
  }

  const incomplete = (missingCount > 0 || unknownChanceCount > 0);
  const expectedValueRaw = pricedCount > 0 ? totalKnown : (missingCount === 0 && unknownChanceCount === 0 && untradeableCount > 0 ? 0 : null);
  const expectedValue = expectedValueRaw !== null ? Number(expectedValueRaw.toFixed(2)) : null;

  const expectedValueConfidentRaw = confidentPricedCount > 0
    ? totalConfidentKnown
    : (pricedCount === 0 && missingCount === 0 && unknownChanceCount === 0 && untradeableCount > 0 ? 0 : null);
  const expectedValueConfident = expectedValueConfidentRaw !== null ? Number(expectedValueConfidentRaw.toFixed(2)) : null;

  return {
    expectedValue,
    expectedValueRaw,
    expectedValueConfident,
    expectedValueConfidentRaw,
    lowConfidenceCount,
    lowConfidenceProbability: Number(lowConfidenceProbability.toFixed(4)),
    incomplete,
    pricedProbability: Number(pricedProbability.toFixed(4)),
    missingProbability: Number(missingProbability.toFixed(4)),
    untradeableProbability: Number(untradeableProbability.toFixed(4)),
    unknownChanceCount,
    pricedCount,
    confidentPricedCount,
    missingCount,
    untradeableCount,
    totalItems: rewards.length,
    missingItems
  };
}

/**
 * 敌人击杀来源期望白金计算
 * DE 官方公式: 每击杀期望白金 = Mod 掉落几率(enemyModDropChance%) × Σ (物品几率% / 100 * quantity * 价格)
 * @param {number|string} enemyModDropChance 例如 3.0 或 "100.00"
 * @param {Array} mods 敌人掉落 mod 列表 [{ modName, slug, chance }]
 * @param {Object} prices 
 * @param {Object} options 
 * @returns {Object}
 */
export function calculateEnemyExpectedValue(enemyModDropChance, mods = [], prices = {}, { priceType = 'sellMin', minSellers = LOW_CONFIDENCE_MIN_SELLERS } = {}) {
  const modDropRate = typeof enemyModDropChance === 'number'
    ? enemyModDropChance
    : (Number.isFinite(parseFloat(enemyModDropChance)) ? parseFloat(enemyModDropChance) : 0);

  let subTotalKnown = 0;
  let subTotalConfidentKnown = 0;
  let pricedCount = 0;
  let confidentPricedCount = 0;
  let missingCount = 0;
  let untradeableCount = 0;
  let unknownChanceCount = 0;
  let lowConfidenceCount = 0;
  let lowConfidenceProbability = 0;
  let pricedProbability = 0;
  let missingProbability = 0;
  let untradeableProbability = 0;
  const missingItems = [];

  for (const item of mods) {
    const rawChance = item.chance;

    if (rawChance === null || rawChance === undefined || rawChance === '' || !Number.isFinite(Number(rawChance))) {
      unknownChanceCount++;
      continue;
    }

    const chance = Number(rawChance);
    const quantity = (typeof item.quantity === 'number' && Number.isFinite(item.quantity) && item.quantity > 0)
      ? item.quantity
      : 1;

    if (isUntradeableItem(item)) {
      untradeableCount++;
      untradeableProbability += chance;
      continue;
    }

    const slug = item.slug;
    let rank = null;
    if (prices && prices[`${slug}@r0`]) {
      rank = 0;
    } else if (item.maxRank && item.maxRank > 0) {
      rank = 0;
    } else if ((item.category === 'mod' || item.category === 'arcane') && !prices[slug]) {
      rank = 0;
    }
    const entry = getPriceEntry(slug, rank, prices);
    const price = entry ? entry[priceType] : null;

    if (typeof price === 'number' && price > 0) {
      pricedCount++;
      pricedProbability += chance;
      const contribution = (chance / 100) * quantity * price;
      subTotalKnown += contribution;

      const isLowConf = isPriceEntryLowConfidence(entry, priceType, minSellers);

      if (isLowConf) {
        lowConfidenceCount++;
        lowConfidenceProbability += chance;
      } else {
        confidentPricedCount++;
        subTotalConfidentKnown += contribution;
      }
    } else {
      missingCount++;
      missingProbability += chance;
      missingItems.push({
        name: item.modName || item.name || '',
        itemName: item.modName || item.name || '',
        baseName: item.baseName || item.name || '',
        zhName: item.modZh || item.zhName || item.modName || '',
        quantity,
        chance,
        rarity: item.rarity || 'Common',
        slug: item.slug || null
      });
    }
  }

  const incomplete = (missingCount > 0 || unknownChanceCount > 0);
  const expectedValueRaw = pricedCount > 0 ? (modDropRate / 100) * subTotalKnown : (missingCount === 0 && unknownChanceCount === 0 && untradeableCount > 0 ? 0 : null);
  const expectedValue = expectedValueRaw !== null ? Number(expectedValueRaw.toFixed(4)) : null;

  const expectedValueConfidentRaw = confidentPricedCount > 0
    ? (modDropRate / 100) * subTotalConfidentKnown
    : (pricedCount === 0 && missingCount === 0 && unknownChanceCount === 0 && untradeableCount > 0 ? 0 : null);
  const expectedValueConfident = expectedValueConfidentRaw !== null ? Number(expectedValueConfidentRaw.toFixed(4)) : null;

  return {
    expectedValue,
    expectedValueRaw,
    expectedValueConfident,
    expectedValueConfidentRaw,
    lowConfidenceCount,
    lowConfidenceProbability: Number(lowConfidenceProbability.toFixed(4)),
    incomplete,
    pricedProbability: Number(pricedProbability.toFixed(4)),
    missingProbability: Number(missingProbability.toFixed(4)),
    untradeableProbability: Number(untradeableProbability.toFixed(4)),
    unknownChanceCount,
    enemyModDropChance: modDropRate,
    pricedCount,
    confidentPricedCount,
    missingCount,
    untradeableCount,
    totalMods: mods.length,
    missingItems
  };
}

/**
 * AABC 四轮平均参考期望纯函数
 * 公式：(2A + B + C) / 4
 * 任一输入为 null 或无效数值时返回 null（严格传播 null）
 * @param {number|null} a 轮次 A 未取整期望值
 * @param {number|null} b 轮次 B 未取整期望值
 * @param {number|null} c 轮次 C 未取整期望值
 * @returns {number|null}
 */
export function aabcAverage(a, b, c) {
  if (a === null || b === null || c === null || a === undefined || b === undefined || c === undefined) return null;
  if (typeof a !== 'number' || typeof b !== 'number' || typeof c !== 'number') return null;
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) return null;
  return (2 * a + b + c) / 4;
}

/**
 * 仲裁前 N 轮平均参考期望纯函数
 * 仲裁发奖序列为 AABBCCCC...，前四轮后持续给 C 轮
 * 公式：
 *   N >= 4: [2A + 2B + (N - 4)C] / N
 *   N < 4: 按前 N 轮 A, A, B, B 的前缀均值：
 *     N = 1: A
 *     N = 2: (A + A) / 2 = A
 *     N = 3: (2A + B) / 3
 * 任一所需输入为 null 或无效数值时返回 null（严格传播 null）
 * @param {number|null} a 轮次 A 未取整期望值
 * @param {number|null} b 轮次 B 未取整期望值
 * @param {number|null} c 轮次 C 未取整期望值
 * @param {number} n 发奖轮数 (正整数)
 * @returns {number|null}
 */
export function arbitrationFirstNAverage(a, b, c, n) {
  if (typeof n !== 'number' || !Number.isInteger(n) || n < 1) return null;
  if (n === 1 || n === 2) {
    if (a === null || a === undefined || typeof a !== 'number' || !Number.isFinite(a)) return null;
    return a;
  }
  if (n === 3) {
    if (a === null || b === null || a === undefined || b === undefined) return null;
    if (typeof a !== 'number' || typeof b !== 'number' || !Number.isFinite(a) || !Number.isFinite(b)) return null;
    return (2 * a + b) / 3;
  }
  // n >= 4: 需要 a, b, c 均已知
  if (a === null || b === null || c === null || a === undefined || b === undefined || c === undefined) return null;
  if (typeof a !== 'number' || typeof b !== 'number' || typeof c !== 'number') return null;
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) return null;
  return (2 * a + 2 * b + (n - 4) * c) / n;
}

/**
 * 仲裁前八轮平均参考期望纯函数
 * 公式：[2A + 2B + 4C] / 8
 * 任一输入为 null 时返回 null
 * @param {number|null} a 轮次 A 未取整期望值
 * @param {number|null} b 轮次 B 未取整期望值
 * @param {number|null} c 轮次 C 未取整期望值
 * @returns {number|null}
 */
export function arbitrationFirst8(a, b, c) {
  return arbitrationFirstNAverage(a, b, c, 8);
}

/**
 * 仲裁前八轮已计价部分平均与覆盖率纯函数 (Decision 9)
 * 权重按 (2A + 2B + 4C) / 8 计算各轮已定价项贡献
 * 若某轮表缺失、污染或存在未知几率，标 structuralDataInsufficient: true，停止显示有效平均
 * 完整 EV (arbitrationFirst8) 仅在任一轮缺价时返回 null
 * @param {Object} expA calculateSourceExpectedValue 返回对象
 * @param {Object} expB calculateSourceExpectedValue 返回对象
 * @param {Object} expC calculateSourceExpectedValue 返回对象
 * @returns {Object}
 */
export function arbitrationFirst8PricedPortion(expA, expB, expC) {
  if (!expA || !expB || !expC ||
      expA.contaminated || expB.contaminated || expC.contaminated ||
      (expA.unknownChanceCount > 0) || (expB.unknownChanceCount > 0) || (expC.unknownChanceCount > 0) ||
      !Array.isArray(expA.missingItems) || !Array.isArray(expB.missingItems) || !Array.isArray(expC.missingItems)) {
    return {
      structuralDataInsufficient: true,
      reason: '结构数据不足（某轮表缺失、数据受污染或掉落概率未知）',
      knownContribution: null,
      knownContributionRaw: null,
      knownConfidentContribution: null,
      knownConfidentContributionRaw: null,
      completeExpectedValue: null,
      pricedProbability: 0,
      missingProbability: 0,
      untradeableProbability: 0,
      incomplete: true
    };
  }

  const knownA = expA.expectedValueRaw ?? 0;
  const knownB = expB.expectedValueRaw ?? 0;
  const knownC = expC.expectedValueRaw ?? 0;
  const knownRaw = (2 * knownA + 2 * knownB + 4 * knownC) / 8;

  const confA = expA.expectedValueConfidentRaw ?? 0;
  const confB = expB.expectedValueConfidentRaw ?? 0;
  const confC = expC.expectedValueConfidentRaw ?? 0;
  const confRaw = (2 * confA + 2 * confB + 4 * confC) / 8;

  const pricedProb = (2 * (expA.pricedProbability || 0) + 2 * (expB.pricedProbability || 0) + 4 * (expC.pricedProbability || 0)) / 8;
  const missingProb = (2 * (expA.missingProbability || 0) + 2 * (expB.missingProbability || 0) + 4 * (expC.missingProbability || 0)) / 8;
  const untradeableProb = (2 * (expA.untradeableProbability || 0) + 2 * (expB.untradeableProbability || 0) + 4 * (expC.untradeableProbability || 0)) / 8;

  const incomplete = Boolean(expA.incomplete || expB.incomplete || expC.incomplete);

  // 完整 EV：任一轮缺价 (incomplete === true) 时仍为 null，绝不能用 ?? 0 冒充
  const completeExpectedValue = incomplete ? null : arbitrationFirst8(expA.expectedValueRaw, expB.expectedValueRaw, expC.expectedValueRaw);

  return {
    structuralDataInsufficient: false,
    reason: null,
    knownContribution: Number(knownRaw.toFixed(5)),
    knownContributionRaw: knownRaw,
    knownConfidentContribution: Number(confRaw.toFixed(5)),
    knownConfidentContributionRaw: confRaw,
    completeExpectedValue,
    pricedProbability: Number(pricedProb.toFixed(3)),
    missingProbability: Number(missingProb.toFixed(3)),
    untradeableProbability: Number(untradeableProb.toFixed(3)),
    incomplete
  };
}
