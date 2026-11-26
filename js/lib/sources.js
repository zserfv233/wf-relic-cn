/**
 * 刷取来源处理与 PvP (武形秘仪 / Conclave) 过滤纯函数库
 */

/**
 * 判定一个掉落来源是否为 PvP (武形秘仪 / Conclave) 来源
 * 识别规则：
 * 1. gameMode 等于 "Conclave"
 * 2. 或 nameEn / node / gameMode / nameZh 中含有 "(Conclave)"、独立词 "Conclave" 或 "武形秘仪"
 * @param {Object} src - 来源对象
 * @returns {boolean}
 */
export function isPvpSource(src) {
  if (!src || typeof src !== 'object') return false;
  if (src.gameMode === 'Conclave') return true;

  const fields = [src.nameEn, src.node, src.gameMode, src.nameZh].filter(Boolean);
  for (const text of fields) {
    if (typeof text !== 'string') continue;
    if (text.includes('(Conclave)')) return true;
    if (/\bConclave\b/i.test(text)) return true;
    if (text.includes('武形秘仪')) return true;
  }

  return false;
}

/**
 * 刷取来源纯函数筛选
 * @param {Array<Object>} sources - 来源列表
 * @param {Object} options
 * @param {string} [options.type='all'] - 来源类型 ('all' | 'mission' | 'enemy' | 'bounty' | 'transient')
 * @param {string} [options.category='all'] - 奖励类别 ('all' | 'relic' | 'arcane' | 'riven' | 'mod')
 * @param {boolean} [options.pvpOnly=false] - 是否仅显示 PvP 来源 (默认 false，排除 PvP 来源；true 时仅保留 PvP 来源)
 * @param {boolean} [options.historicalOnly=false] - 是否仅显示历史活动来源 (默认 false，排除历史活动；true 时仅保留历史活动)
 * @returns {Array<Object>}
 */
export function filterSources(sources, { type = 'all', category = 'all', pvpOnly = false, historicalOnly = false } = {}) {
  if (!Array.isArray(sources)) return [];

  return sources.filter(s => {
    // 历史活动过滤 (Decision 8): 默认 (historicalOnly === false) 排除所有历史活动；开启时仅保留历史活动
    if (historicalOnly) {
      if (!s.historicalEvent) return false;
    } else {
      if (s.historicalEvent) return false;
    }

    // PvP 模式过滤：默认 (pvpOnly === false) 排除所有 PvP 来源；开启时仅保留 PvP 来源
    if (pvpOnly) {
      if (!s.isPvp) return false;
    } else {
      if (s.isPvp) return false;
    }

    // 来源类型过滤
    if (type !== 'all' && s.type !== type) {
      return false;
    }

    // 奖励分类过滤
    if (category !== 'all') {
      if (!s.rewards || !s.rewards.some(r => r.category === category)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * 切换历史活动筛选状态（与 PvP 筛选互斥）
 * @param {Object} state - 当前状态
 * @returns {{ sourceHistoricalOnly: boolean, sourcePvpOnly: boolean }}
 */
export function toggleHistoricalFilter(state = {}) {
  const nextHistorical = !state.sourceHistoricalOnly;
  return {
    ...state,
    sourceHistoricalOnly: nextHistorical,
    sourcePvpOnly: nextHistorical ? false : Boolean(state.sourcePvpOnly)
  };
}

/**
 * 切换 PvP 筛选状态（与历史活动筛选互斥）
 * @param {Object} state - 当前状态
 * @returns {{ sourceHistoricalOnly: boolean, sourcePvpOnly: boolean }}
 */
export function togglePvpFilter(state = {}) {
  const nextPvp = !state.sourcePvpOnly;
  return {
    ...state,
    sourcePvpOnly: nextPvp,
    sourceHistoricalOnly: nextPvp ? false : Boolean(state.sourceHistoricalOnly)
  };
}

