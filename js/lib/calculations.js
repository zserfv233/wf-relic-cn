/**
 * calculations.js - 期望白金值计算纯函数（阶段 M1 / M2 扩展）
 */

// 常量：低置信度最小卖家数（建议参数，非游戏规则）
export const LOW_CONFIDENCE_MIN_SELLERS = 3;

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
  if (slug === null || slug === undefined) {
    const name = item.baseName || item.itemName || item.name || '';
    if (name.includes('Forma Blueprint')) return true;
  }
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
  let subtypeUnknown = false;

  // 1. 若请求了具体等级 (rank !== null)，严禁回退到基础 slug
  if (rank !== null && rank !== undefined) {
    key = `${slug}@r${rank}`;
    if (!prices[key]) {
      return null;
    }
  } else {
    // 2. 无等级请求：优先查找 @unrevealed (紫卡 subtype)，其次查找基础 slug
    const unrevealedKey = `${slug}@unrevealed`;
    if (prices[unrevealedKey]) {
      key = unrevealedKey;
    } else if (prices[slug]) {
      key = slug;
      if (slug.includes('riven')) {
        subtypeUnknown = true; // 旧缓存未区分子类型回退
      }
    } else {
      return null;
    }
  }

  const rawItem = prices[key];
  if (!rawItem || typeof rawItem !== 'object') return null;

  const sellCount = typeof rawItem.sellCount === 'number' ? rawItem.sellCount : 0;
  const buyCount = typeof rawItem.buyCount === 'number' ? rawItem.buyCount : 0;
  const sellMin = (typeof rawItem.sellMin === 'number' && Number.isFinite(rawItem.sellMin) && rawItem.sellMin >= 0) ? rawItem.sellMin : null;
  const buyMax = (typeof rawItem.buyMax === 'number' && Number.isFinite(rawItem.buyMax) && rawItem.buyMax >= 0) ? rawItem.buyMax : null;

  // sellRobust: 最低 min(3, n) 个卖单价格的中位数（n<3 时等于现有逻辑 sellMin 但标低置信）
  let sellRobust = null;
  let robustUnavailable = false;
  if (rawItem.sellRobust !== undefined) {
    sellRobust = rawItem.sellRobust;
  } else {
    robustUnavailable = true;
    sellRobust = sellMin;
  }

  // lowConfidence: sellCount < 3 (LOW_CONFIDENCE_MIN_SELLERS) 或 sellMin 为 null
  const lowConfidence = sellCount < LOW_CONFIDENCE_MIN_SELLERS || sellMin === null;
  const noBuyOrders = buyCount === 0 || buyMax === null;

  return {
    ...rawItem,
    key,
    sellMin,
    buyMax,
    sellCount,
    buyCount,
    sellRobust,
    robustUnavailable,
    lowConfidence,
    noBuyOrders,
    subtypeUnknown: rawItem.subtypeUnknown ?? subtypeUnknown
  };
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

    const chance = Number(rawChance);
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

      // 评估低置信度
      const isLowConf = priceType === 'buyMax'
        ? (entry.buyCount < minSellers || entry.buyMax === null)
        : (entry.sellCount < minSellers || entry.sellMin === null);

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
export function calculateSourceExpectedValue(rewards = [], prices = {}, { priceType = 'sellMin', minSellers = LOW_CONFIDENCE_MIN_SELLERS } = {}) {
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

      const isLowConf = priceType === 'buyMax'
        ? (entry.buyCount < minSellers || entry.buyMax === null)
        : (entry.sellCount < minSellers || entry.sellMin === null);

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
    totalItems: rewards.length
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

      const isLowConf = priceType === 'buyMax'
        ? (entry.buyCount < minSellers || entry.buyMax === null)
        : (entry.sellCount < minSellers || entry.sellMin === null);

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
    totalMods: mods.length
  };
}
