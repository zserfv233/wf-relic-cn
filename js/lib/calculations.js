/**
 * calculations.js - 期望白金值计算纯函数（阶段 M1 扩展）
 */

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
 * 获取物品在指定精炼/等级下的有效单价
 * @param {string} slug 
 * @param {number|null} rank 等级 (0 或 maxRank)，无等级传 null
 * @param {Object} prices 
 * @param {string} priceType 'sellMin' | 'buyMax'
 * @returns {number|null}
 */
export function getItemPrice(slug, rank = null, prices = {}, priceType = 'sellMin') {
  if (!slug || typeof slug !== 'string' || !prices) return null;

  // 1. 优先查找 rank 键，例如 `${slug}@r0`
  if (rank !== null && rank !== undefined) {
    const rankKey = `${slug}@r${rank}`;
    const p = prices[rankKey]?.[priceType];
    if (typeof p === 'number' && Number.isFinite(p) && p >= 0) {
      return p;
    }
  }

  // 2. 回退到基础 slug
  const p = prices[slug]?.[priceType];
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
export function calculateExpectedValue(rewards = [], prices = {}, { priceType = 'sellMin', refinement = 'intact' } = {}) {
  let totalKnown = 0;
  let pricedCount = 0;
  let missingCount = 0;
  let untradeableCount = 0;
  let unknownChanceCount = 0;
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

    const price = getItemPrice(slug, 0, prices, priceType);

    if (typeof price === 'number' && price > 0) {
      pricedCount++;
      pricedProbability += chance;
      const contribution = (chance / 100) * quantity * price;
      totalKnown += contribution;
      breakdown.push({
        name,
        baseName,
        quantity,
        zhName,
        rarity,
        chance,
        price,
        contribution: Number(contribution.toFixed(4)),
        status: 'priced'
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

  return {
    expectedValue,
    expectedValueRaw,
    incomplete,
    pricedProbability: Number(pricedProbability.toFixed(4)),
    missingProbability: Number(missingProbability.toFixed(4)),
    untradeableProbability: Number(untradeableProbability.toFixed(4)),
    unknownChanceCount,
    pricedCount,
    missingCount,
    missingPriceCount: missingCount, // 兼容现有测试与调用方
    untradeableCount,
    breakdown
  };
}

/**
 * 计算四个精炼等级的全部期望白金
 */
export function calculateAllRefinementValues(rewards = [], prices = {}, { priceType = 'sellMin' } = {}) {
  const refinements = ['intact', 'exceptional', 'flawless', 'radiant'];
  const result = {};
  for (const ref of refinements) {
    result[ref] = calculateExpectedValue(rewards, prices, { priceType, refinement: ref });
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
export function calculateSourceExpectedValue(rewards = [], prices = {}, { priceType = 'sellMin' } = {}) {
  let totalKnown = 0;
  let pricedCount = 0;
  let missingCount = 0;
  let untradeableCount = 0;
  let unknownChanceCount = 0;
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
    const price = getItemPrice(slug, 0, prices, priceType);

    if (typeof price === 'number' && price > 0) {
      pricedCount++;
      pricedProbability += chance;
      totalKnown += (chance / 100) * quantity * price;
    } else {
      missingCount++;
      missingProbability += chance;
    }
  }

  const incomplete = (missingCount > 0 || unknownChanceCount > 0);
  const expectedValueRaw = pricedCount > 0 ? totalKnown : (missingCount === 0 && unknownChanceCount === 0 && untradeableCount > 0 ? 0 : null);
  const expectedValue = expectedValueRaw !== null ? Number(expectedValueRaw.toFixed(2)) : null;

  return {
    expectedValue,
    expectedValueRaw,
    incomplete,
    pricedProbability: Number(pricedProbability.toFixed(4)),
    missingProbability: Number(missingProbability.toFixed(4)),
    untradeableProbability: Number(untradeableProbability.toFixed(4)),
    unknownChanceCount,
    pricedCount,
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
export function calculateEnemyExpectedValue(enemyModDropChance, mods = [], prices = {}, { priceType = 'sellMin' } = {}) {
  const modDropRate = typeof enemyModDropChance === 'number'
    ? enemyModDropChance
    : (Number.isFinite(parseFloat(enemyModDropChance)) ? parseFloat(enemyModDropChance) : 0);

  let subTotalKnown = 0;
  let pricedCount = 0;
  let missingCount = 0;
  let untradeableCount = 0;
  let unknownChanceCount = 0;
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
    const price = getItemPrice(slug, 0, prices, priceType);

    if (typeof price === 'number' && price > 0) {
      pricedCount++;
      pricedProbability += chance;
      subTotalKnown += (chance / 100) * quantity * price;
    } else {
      missingCount++;
      missingProbability += chance;
    }
  }

  const incomplete = (missingCount > 0 || unknownChanceCount > 0);
  const expectedValueRaw = pricedCount > 0 ? (modDropRate / 100) * subTotalKnown : (missingCount === 0 && unknownChanceCount === 0 && untradeableCount > 0 ? 0 : null);
  const expectedValue = expectedValueRaw !== null ? Number(expectedValueRaw.toFixed(4)) : null;

  return {
    expectedValue,
    expectedValueRaw,
    incomplete,
    pricedProbability: Number(pricedProbability.toFixed(4)),
    missingProbability: Number(missingProbability.toFixed(4)),
    untradeableProbability: Number(untradeableProbability.toFixed(4)),
    unknownChanceCount,
    enemyModDropChance: modDropRate,
    pricedCount,
    missingCount,
    untradeableCount,
    totalMods: mods.length
  };
}
