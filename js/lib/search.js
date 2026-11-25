/**
 * search.js - 搜索与多维度匹配纯函数
 */

/**
 * 规范化字符串用于模糊比较（转小写、去多余空格）
 * @param {string} str 
 * @returns {string}
 */
export function normalizeQuery(str) {
  if (!str || typeof str !== 'string') return '';
  return str.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * 在预构建索引中搜索遗物与物品
 * 支持：中文名、英文名、拼音全拼、拼音首字母、英文首字母简称
 * @param {string} query 搜索词
 * @param {Array} index 预构建搜索索引列表
 * @param {Object} options 配置项: limit (默认 20)
 * @returns {Array} 匹配结果列表
 */
export function searchIndex(query, index = [], { limit = 20 } = {}) {
  const q = normalizeQuery(query);
  if (!q) return [];
  const qNoSpace = q.replace(/\s+/g, '');

  const matches = [];

  for (const entry of index) {
    let score = 0;

    const nameLower = (entry.name || '').toLowerCase();
    const zhLower = (entry.zhName || '').toLowerCase();
    const idLower = (entry.id || '').toLowerCase();

    // 1. 完全匹配最高分
    if (nameLower === q || zhLower === q || idLower === q) {
      score += 100;
    }
    // 2. 名字前缀匹配
    else if (nameLower.startsWith(q) || zhLower.startsWith(q) || idLower.startsWith(q)) {
      score += 60;
    }
    // 3. 名字子串匹配
    else if (nameLower.includes(q) || zhLower.includes(q) || idLower.includes(q)) {
      score += 40;
    }
    // 4. 无空格直接匹配
    else if (nameLower.replace(/\s+/g, '').includes(qNoSpace) || zhLower.replace(/\s+/g, '').includes(qNoSpace)) {
      score += 35;
    }

    // 5. 命中预构建搜索 tokens（含拼音全拼、拼音首字母、英文缩写等）
    if (entry.tokens && Array.isArray(entry.tokens)) {
      for (const token of entry.tokens) {
        const tokenLower = token.toLowerCase();
        if (tokenLower === q || tokenLower === qNoSpace) {
          score = Math.max(score, 50);
          break;
        } else if (tokenLower.startsWith(q) || tokenLower.startsWith(qNoSpace)) {
          score = Math.max(score, 30);
        } else if (tokenLower.includes(q) || tokenLower.includes(qNoSpace)) {
          score = Math.max(score, 15);
        }
      }
    }

    if (score > 0) {
      matches.push({
        entry,
        score
      });
    }
  }

  // 按得分降序排序，同分则遗物排在前面，再按名字排序
  matches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.entry.type !== b.entry.type) {
      return a.entry.type === 'relic' ? -1 : 1;
    }
    return a.entry.name.localeCompare(b.entry.name);
  });

  return matches.slice(0, limit).map(m => m.entry);
}
