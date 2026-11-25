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
 * @returns {Array<Object>}
 */
export function filterSources(sources, { type = 'all', category = 'all', pvpOnly = false } = {}) {
  if (!Array.isArray(sources)) return [];

  return sources.filter(s => {
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
