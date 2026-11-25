/**
 * calculations.js - 期望白金值计算纯函数
 */

/**
 * 计算单个精炼等级的期望白金值
 * 期望值 = Σ(单项掉率% / 100 * 价格)
 * @param {Array} rewards 遗物奖励列表，每项含 chances[refinement], marketSlug
 * @param {Object} prices 价格字典 { [slug]: { sellMin, buyMax, ... } }
 * @param {Object} options 配置项: priceType ('sellMin' | 'buyMax'), refinement ('intact' | 'exceptional' | 'flawless' | 'radiant')
 * @returns {Object} { expectedValue, missingPriceCount, breakdown }
 */
export function calculateExpectedValue(rewards = [], prices = {}, { priceType = 'sellMin', refinement = 'intact' } = {}) {
  let total = 0;
  let missingPriceCount = 0;
  const breakdown = [];

  for (const rew of rewards) {
    const chance = rew.chances ? (rew.chances[refinement] ?? 0) : 0;
    const slug = rew.marketSlug;
    const priceObj = slug ? prices[slug] : null;
    const price = priceObj ? priceObj[priceType] : null;

    if (typeof price === 'number' && price > 0) {
      const contribution = (chance / 100) * price;
      total += contribution;
      breakdown.push({
        name: rew.name,
        zhName: rew.zhName,
        rarity: rew.rarity,
        chance,
        price,
        contribution: Number(contribution.toFixed(4))
      });
    } else {
      missingPriceCount++;
      breakdown.push({
        name: rew.name,
        zhName: rew.zhName,
        rarity: rew.rarity,
        chance,
        price: 0,
        contribution: 0
      });
    }
  }

  return {
    expectedValue: Number(total.toFixed(2)),
    missingPriceCount,
    breakdown
  };
}

/**
 * 计算四个精炼等级的全部期望白金
 * @param {Array} rewards 
 * @param {Object} prices 
 * @param {Object} options 
 * @returns {Object} { intact, exceptional, flawless, radiant }
 */
export function calculateAllRefinementValues(rewards = [], prices = {}, { priceType = 'sellMin' } = {}) {
  const refinements = ['intact', 'exceptional', 'flawless', 'radiant'];
  const result = {};
  for (const ref of refinements) {
    result[ref] = calculateExpectedValue(rewards, prices, { priceType, refinement: ref });
  }
  return result;
}
