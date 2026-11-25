/**
 * calculations.js - 期望白金值计算纯函数（阶段 2 扩展）
 */

/**
 * 获取物品在指定精炼/等级下的有效单价
 * @param {string} slug 
 * @param {number|null} rank 等级 (0 或 maxRank)，无等级传 null
 * @param {Object} prices 
 * @param {string} priceType 'sellMin' | 'buyMax'
 * @returns {number|null}
 */
export function getItemPrice(slug, rank = null, prices = {}, priceType = 'sellMin') {
  if (!slug || !prices) return null;

  // 1. 优先查找 rank 键，例如 `${slug}@r0`
  if (rank !== null && rank !== undefined) {
    const rankKey = `${slug}@r${rank}`;
    if (prices[rankKey] && typeof prices[rankKey][priceType] === 'number') {
      return prices[rankKey][priceType];
    }
  }

  // 2. 回退到基础 slug
  if (prices[slug] && typeof prices[slug][priceType] === 'number') {
    return prices[slug][priceType];
  }

  return null;
}

/**
 * 计算单个精炼等级的遗物期望白金值
 * 期望值 = Σ(单项掉率% / 100 * 价格)
 * 若遗物中全部物品均无价格，返回 expectedValue: null
 * @param {Array} rewards 
 * @param {Object} prices 
 * @param {Object} options 
 * @returns {Object} { expectedValue, missingPriceCount, pricedCount, breakdown }
 */
export function calculateExpectedValue(rewards = [], prices = {}, { priceType = 'sellMin', refinement = 'intact' } = {}) {
  let total = 0;
  let missingPriceCount = 0;
  let pricedCount = 0;
  const breakdown = [];

  for (const rew of rewards) {
    const chance = rew.chances ? (rew.chances[refinement] ?? 0) : (rew.chance ?? 0);
    const quantity = rew.quantity || 1;
    const slug = rew.marketSlug || rew.slug;
    const price = getItemPrice(slug, 0, prices, priceType);

    if (typeof price === 'number' && price > 0) {
      pricedCount++;
      const contribution = (chance / 100) * quantity * price;
      total += contribution;
      breakdown.push({
        name: rew.name || rew.itemName,
        baseName: rew.baseName,
        quantity,
        zhName: rew.zhName || rew.itemZh || rew.name,
        rarity: rew.rarity,
        chance,
        price,
        contribution: Number(contribution.toFixed(4))
      });
    } else {
      missingPriceCount++;
      breakdown.push({
        name: rew.name || rew.itemName,
        baseName: rew.baseName,
        quantity,
        zhName: rew.zhName || rew.itemZh || rew.name,
        rarity: rew.rarity,
        chance,
        price: null,
        contribution: 0
      });
    }
  }

  // 全部无价时返回 null，前端显示 "—"
  const expectedValue = pricedCount > 0 ? Number(total.toFixed(2)) : null;

  return {
    expectedValue,
    missingPriceCount,
    pricedCount,
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
 * 每次期望白金 = Σ (物品掉率% / 100 * 价格)
 * 赋能/Mod 默认使用 0 级掉落价格
 * @param {Array} rewards 来源内的奖励列表 [{ itemName, slug, chance, category }]
 * @param {Object} prices 
 * @param {Object} options 
 * @returns {Object} { expectedValue, pricedCount, missingCount, totalItems }
 */
export function calculateSourceExpectedValue(rewards = [], prices = {}, { priceType = 'sellMin' } = {}) {
  let total = 0;
  let pricedCount = 0;
  let missingCount = 0;

  for (const item of rewards) {
    const chance = typeof item.chance === 'number' ? item.chance : parseFloat(item.chance || 0);
    const quantity = item.quantity || 1;
    const slug = item.slug;
    // 赋能/Mod 掉落均为 0 级
    const price = getItemPrice(slug, 0, prices, priceType);

    if (typeof price === 'number' && price > 0) {
      pricedCount++;
      total += (chance / 100) * quantity * price;
    } else {
      missingCount++;
    }
  }

  return {
    expectedValue: pricedCount > 0 ? Number(total.toFixed(2)) : null,
    pricedCount,
    missingCount,
    totalItems: rewards.length
  };
}

/**
 * 敌人击杀来源期望白金计算
 * DE 官方公式: 每击杀期望白金 = Mod 掉落几率(enemyModDropChance%) × Σ 物品几率(chance%) × 价格
 * @param {number|string} enemyModDropChance 例如 3.0 或 "100.00"
 * @param {Array} mods 敌人掉落 mod 列表 [{ modName, slug, chance }]
 * @param {Object} prices 
 * @param {Object} options 
 * @returns {Object} { expectedValue, compositeChance, pricedCount, missingCount }
 */
export function calculateEnemyExpectedValue(enemyModDropChance, mods = [], prices = {}, { priceType = 'sellMin' } = {}) {
  const modDropRate = typeof enemyModDropChance === 'number' ? enemyModDropChance : parseFloat(enemyModDropChance || 0);
  let subTotal = 0;
  let pricedCount = 0;
  let missingCount = 0;

  for (const item of mods) {
    const chance = typeof item.chance === 'number' ? item.chance : parseFloat(item.chance || 0);
    const quantity = item.quantity || 1;
    const slug = item.slug;
    const price = getItemPrice(slug, 0, prices, priceType);

    if (typeof price === 'number' && price > 0) {
      pricedCount++;
      // chance 为百分比
      subTotal += (chance / 100) * quantity * price;
    } else {
      missingCount++;
    }
  }

  const expectedValue = pricedCount > 0 ? Number(((modDropRate / 100) * subTotal).toFixed(4)) : null;

  return {
    expectedValue,
    enemyModDropChance: modDropRate,
    pricedCount,
    missingCount,
    totalMods: mods.length
  };
}
