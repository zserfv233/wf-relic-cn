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

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatSourceType(type) {
  const map = {
    mission: '任务轮次',
    enemy: '敌人掉落',
    bounty: '赏金任务',
    transient: '特殊来源'
  };
  return map[type] || type || '-';
}

/**
 * 格式化掉落来源分组 HTML (Codex 1126c 第 8 项)
 * 区分普通来源与历史活动来源，默认折叠历史来源组
 */
export function renderDropSourcesGrouped(dropSources = [], {
  itemType = 'item',
  showRotation = false,
  emptyNormalText = '暂无直接掉落来源',
  limitNormal = Infinity,
  sources = []
} = {}) {
  const sourceById = new Map((sources || []).map(s => [s.id, s]));

  const normalSources = [];
  const historicalSources = [];
  const unknownSources = [];

  for (const s of dropSources) {
    const mainSrc = sourceById.get(s.sourceId);
    if (!mainSrc) {
      unknownSources.push(s);
    } else if (mainSrc.historicalEvent || s.historicalEvent) {
      historicalSources.push({ ...s, historicalEvent: true, officialNoticeUrl: mainSrc.officialNoticeUrl || s.officialNoticeUrl });
    } else {
      normalSources.push(s);
    }
  }

  const N = normalSources.length;
  const M = historicalSources.length;
  const U = unknownSources.length;
  const colCount = showRotation ? 4 : 3;

  const renderRow = (s, isHist = false, isUnk = false) => {
    let compChance = `${s.chance}%`;
    if (s.enemyModDropChance) {
      const comp = ((s.enemyModDropChance / 100) * (s.chance / 100) * 100).toFixed(4);
      compChance = `${s.chance}% × ${s.enemyModDropChance}% = <strong>${comp}%</strong>`;
    }

    const nameText = escapeHtml(s.nameZh || s.nameEn || s.sourceId || '未知来源');
    let nameHtml = `<a class="source-link" data-source-id="${escapeHtml(s.sourceId)}" style="cursor: pointer; text-decoration: underline; color: var(--text-primary);"><strong>${nameText}</strong></a>`;
    if (isHist) {
      nameHtml += ` <span class="badge badge-historical" style="margin-left: 0.35rem; font-size: 0.72rem; padding: 0.1rem 0.35rem; border-radius: 3px; background: rgba(234, 179, 8, 0.2); color: var(--gold-light); border: 1px solid rgba(234, 179, 8, 0.4);">历史活动</span>`;
    } else if (isUnk) {
      nameHtml += ` <span class="badge badge-unconfirmed" style="margin-left: 0.35rem; font-size: 0.72rem; padding: 0.1rem 0.35rem; border-radius: 3px; background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4);">来源状态未确认</span>`;
    }

    const rotTd = showRotation ? `<td>${s.rotation ? `轮次 ${s.rotation}` : '-'}</td>` : '';
    const qPrefix = (s.quantity && s.quantity > 1) ? `<span class="quantity-tag">×${s.quantity}</span> ` : '';

    return `
      <tr>
        <td>${nameHtml}</td>
        <td>${formatSourceType(s.sourceType)}</td>
        ${rotTd}
        <td style="color: var(--cyan-primary);">${qPrefix}${compChance}</td>
      </tr>
    `;
  };

  const displayNormals = normalSources.slice(0, limitNormal);
  let normalRows = displayNormals.map(s => renderRow(s, false, false)).join('');
  if (unknownSources.length > 0) {
    normalRows += unknownSources.map(s => renderRow(s, false, true)).join('');
  }

  let emptyNormalRow = '';
  if (N === 0 && U === 0) {
    if (M > 0) {
      emptyNormalRow = `<tr><td colspan="${colCount}" style="text-align: center; color: var(--text-muted);">未收录非历史直接掉落来源；另有 ${M} 处历史记录</td></tr>`;
    } else {
      emptyNormalRow = `<tr><td colspan="${colCount}" style="text-align: center; color: var(--text-muted);">${emptyNormalText}</td></tr>`;
    }
  }

  let html = `
    <h4 style="color: var(--text-primary); font-size: 1rem; margin: 1rem 0 0.5rem 0;">
      🎯 掉落来源（${N} 处，排除历史活动）${U > 0 ? ` <span style="font-size: 0.8rem; color: #f87171;">(含 ${U} 处状态未确认)</span>` : ''}
    </h4>
    <div style="overflow-x: auto;">
      <table class="rewards-table">
        <thead>
          <tr>
            <th>来源名称</th>
            <th>类型</th>
            ${showRotation ? '<th>轮次</th>' : ''}
            <th>掉落概率${itemType === 'arcane' || itemType === 'mod' ? ' (综合)' : ''}</th>
          </tr>
        </thead>
        <tbody>
          ${normalRows || emptyNormalRow}
        </tbody>
      </table>
    </div>
  `;

  if (M > 0) {
    const historicalRows = historicalSources.map(s => renderRow(s, true, false)).join('');
    html += `
      <details class="historical-sources-group" style="margin-top: 1rem; border: 1px solid rgba(234, 179, 8, 0.3); border-radius: 6px; padding: 0.5rem 0.75rem; background: rgba(234, 179, 8, 0.04);">
        <summary class="historical-sources-summary" style="cursor: pointer; font-weight: 600; color: var(--gold-light); font-size: 0.95rem; user-select: none;">
          📜 历史活动来源（${M} 处）
        </summary>
        <div class="historical-group-note" style="margin: 0.6rem 0; padding: 0.4rem 0.6rem; font-size: 0.8rem; color: var(--gold-light); background: rgba(234, 179, 8, 0.1); border-left: 3px solid var(--gold-light); border-radius: 4px;">
          ⚠️ 当前开放状态未确认。历史活动掉落可能已绝版或仅在特定复刻时开放。
        </div>
        <div style="overflow-x: auto; margin-top: 0.5rem;">
          <table class="rewards-table">
            <thead>
              <tr>
                <th>来源名称</th>
                <th>类型</th>
                ${showRotation ? '<th>轮次</th>' : ''}
                <th>掉落概率${itemType === 'arcane' || itemType === 'mod' ? ' (综合)' : ''}</th>
              </tr>
            </thead>
            <tbody>
              ${historicalRows}
            </tbody>
          </table>
        </div>
      </details>
    `;
  }

  return html;
}


