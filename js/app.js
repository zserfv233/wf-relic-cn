/**
 * js/app.js - 前端交互主控制器
 * 原生 ES Module，无外部构建依赖
 */

import { calculateExpectedValue, calculateAllRefinementValues } from './lib/calculations.js';
import { searchIndex } from './lib/search.js';

// 应用全局状态
const state = {
  meta: null,
  relics: [],
  items: {},
  prices: {},
  searchIndexData: [],
  
  // 筛选与显示状态
  currentMode: 'obtainable', // 'obtainable' | 'all'
  currentTier: 'all',       // 'all' | 'Lith' | 'Meso' | 'Neo' | 'Axi' | 'Requiem' | 'Vanguard'
  currentSort: 'radiant_desc',
  currentPriceType: 'sellMin', // 'sellMin' | 'buyMax'
  
  // 弹窗状态
  activeModal: null // { type: 'relic'|'item', id: string }
};

// DOM 元素缓存
const elements = {
  // Stats
  statTotalRelics: document.getElementById('stat-total-relics'),
  statObtainable: document.getElementById('stat-obtainable'),
  statVaulted: document.getElementById('stat-vaulted'),
  statPriceCoverage: document.getElementById('stat-price-coverage'),
  
  // Search
  searchInput: document.getElementById('search-input'),
  searchClearBtn: document.getElementById('search-clear-btn'),
  searchDropdown: document.getElementById('search-dropdown'),
  
  // Controls
  modeTabs: document.getElementById('mode-tabs'),
  tierFilters: document.getElementById('tier-filters'),
  sortSelect: document.getElementById('sort-select'),
  priceModeToggle: document.getElementById('price-mode-toggle'),
  priceModeLabel: document.getElementById('price-mode-label'),
  filterResultCount: document.getElementById('filter-result-count'),
  
  // Relic Grid
  relicGrid: document.getElementById('relic-grid'),
  
  // Modal
  detailModal: document.getElementById('detail-modal'),
  modalHeaderContent: document.getElementById('modal-header-content'),
  modalBodyContent: document.getElementById('modal-body-content'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  
  // Footer
  footerDataTime: document.getElementById('footer-data-time'),
  footerPriceTime: document.getElementById('footer-price-time'),
  footerPriceCoverage: document.getElementById('footer-price-coverage')
};

/**
 * 格式化 ISO 日期时间
 */
function formatDateTime(isoStr) {
  if (!isoStr) return '暂无数据';
  try {
    const d = new Date(isoStr);
    return d.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch {
    return isoStr;
  }
}

/**
 * 初始化数据加载
 */
async function init() {
  try {
    const [metaRes, pricesRes, relicsRes, searchIndexRes] = await Promise.all([
      fetch('./data/meta.json').then(r => r.json()),
      fetch('./data/prices.json').then(r => r.json()).catch(() => ({ items: {} })),
      fetch('./data/relics.json').then(r => r.json()),
      fetch('./data/search-index.json').then(r => r.json())
    ]);

    state.meta = metaRes;
    state.prices = pricesRes.items || {};
    state.relics = relicsRes.relics || [];
    state.items = relicsRes.items || {};
    state.searchIndexData = searchIndexRes || [];

    updateStatsBar();
    updateFooterInfo();
    setupEventListeners();
    handleHashRouting();
    renderRelicGrid();
  } catch (err) {
    console.error('加载数据失败:', err);
    elements.relicGrid.innerHTML = `
      <div class="empty-state">
        <h3 style="color: #ef4444;">数据加载失败</h3>
        <p>未能成功获取遗物数据，请检查网络连接或确认数据构建已完成。</p>
        <p style="font-size: 0.8rem; margin-top: 0.5rem; color: #94a3b8;">错误详情: ${err.message}</p>
      </div>
    `;
  }
}

/**
 * 更新统计信息栏
 */
function updateStatsBar() {
  if (!state.meta) return;
  const s = state.meta.stats || {};
  elements.statTotalRelics.textContent = s.totalRelics || state.relics.length;
  elements.statObtainable.textContent = s.obtainableRelics || 0;
  elements.statVaulted.textContent = s.vaultedRelics || 0;
  elements.statPriceCoverage.textContent = state.meta.prices?.coverage || '0.0%';
}

/**
 * 更新页脚元数据
 */
function updateFooterInfo() {
  if (!state.meta) return;
  elements.footerDataTime.textContent = formatDateTime(state.meta.builtAt);
  elements.footerPriceTime.textContent = formatDateTime(state.meta.prices?.updatedAt);
  elements.footerPriceCoverage.textContent = `${state.meta.prices?.pricedCount || 0} / ${state.meta.prices?.totalCount || 0} (${state.meta.prices?.coverage || '0.0%'})`;
}

/**
 * 渲染遗物卡片网格
 */
function renderRelicGrid() {
  // 1. 过滤可获取模式
  let list = state.relics.filter(r => {
    if (state.currentMode === 'obtainable') {
      return !r.vaulted;
    }
    return true;
  });

  // 2. 纪元筛选
  if (state.currentTier !== 'all') {
    list = list.filter(r => r.tier === state.currentTier);
  }

  // 3. 计算期望白金值并附加到对象上进行排序
  const priceType = state.currentPriceType;
  list.forEach(r => {
    r._expValues = calculateAllRefinementValues(r.rewards, state.prices, { priceType });
  });

  // 4. 排序
  list.sort((a, b) => {
    if (state.currentSort === 'name_asc') {
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    } else if (state.currentSort === 'radiant_desc') {
      return b._expValues.radiant.expectedValue - a._expValues.radiant.expectedValue;
    } else if (state.currentSort === 'intact_desc') {
      return b._expValues.intact.expectedValue - a._expValues.intact.expectedValue;
    } else if (state.currentSort === 'exceptional_desc') {
      return b._expValues.exceptional.expectedValue - a._expValues.exceptional.expectedValue;
    } else if (state.currentSort === 'flawless_desc') {
      return b._expValues.flawless.expectedValue - a._expValues.flawless.expectedValue;
    }
    return 0;
  });

  // 更新计数提示
  elements.filterResultCount.textContent = `显示 ${list.length} 个遗物`;

  if (list.length === 0) {
    elements.relicGrid.innerHTML = `
      <div class="empty-state">
        <h3>未找到符合条件的遗物</h3>
        <p>尝试切换纪元或选择“全部遗物”查看已入库的遗物。</p>
      </div>
    `;
    return;
  }

  // 渲染 HTML
  const cardsHtml = list.map(r => {
    let badgeHtml = '';
    if (r.conflict) {
      badgeHtml = `<span class="badge badge-conflict" title="${r.conflictNote}">⚠️ 状态存疑</span>`;
    } else if (!r.vaulted) {
      badgeHtml = `<span class="badge badge-obtainable">可获取</span>`;
    } else {
      badgeHtml = `<span class="badge badge-vaulted">已入库</span>`;
    }

    const expRadiant = r._expValues.radiant.expectedValue;
    const expIntact = r._expValues.intact.expectedValue;

    // 预览稀有与罕见
    const rareReward = r.rewards.find(x => x.rarity === 'Rare');
    const uncRewards = r.rewards.filter(x => x.rarity === 'Uncommon');

    return `
      <div class="relic-card" data-relic-id="${r.id}">
        <div class="card-header">
          <div class="relic-title-area">
            <span class="relic-zh-name">${escapeHtml(r.zhName)}</span>
            <span class="relic-en-name">${escapeHtml(r.name)}</span>
          </div>
          <div>${badgeHtml}</div>
        </div>

        <div class="card-expected-value">
          <span class="plat-label">期望白金 (光辉 / 完整):</span>
          <span class="plat-badge">
            ${expRadiant} / ${expIntact} ☿
          </span>
        </div>

        <div class="rewards-preview">
          ${rareReward ? `
            <div class="reward-preview-item reward-preview-rare">
              <span class="reward-name" title="${escapeHtml(rareReward.zhName)}">★ ${escapeHtml(rareReward.zhName)}</span>
              <span>${rareReward.chances.radiant}%</span>
            </div>
          ` : ''}
          ${uncRewards.slice(0, 2).map(u => `
            <div class="reward-preview-item reward-preview-uncommon">
              <span class="reward-name" title="${escapeHtml(u.zhName)}">◆ ${escapeHtml(u.zhName)}</span>
              <span>${u.chances.radiant}%</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  elements.relicGrid.innerHTML = cardsHtml;

  // 绑定卡片点击
  elements.relicGrid.querySelectorAll('.relic-card').forEach(card => {
    card.addEventListener('click', () => {
      const relicId = card.getAttribute('data-relic-id');
      openRelicModal(relicId);
    });
  });
}

/**
 * 打开遗物详情弹窗
 */
export function openRelicModal(relicId) {
  const relic = state.relics.find(r => r.id === relicId);
  if (!relic) return;

  window.location.hash = `relic=${relic.id}`;
  state.activeModal = { type: 'relic', id: relic.id };

  const priceType = state.currentPriceType;
  const expValues = calculateAllRefinementValues(relic.rewards, state.prices, { priceType });

  let badgeHtml = '';
  if (relic.conflict) {
    badgeHtml = `<span class="badge badge-conflict" title="${relic.conflictNote}">⚠️ 入库状态冲突</span>`;
  } else if (!relic.vaulted) {
    badgeHtml = `<span class="badge badge-obtainable">当前可获取 (未入库)</span>`;
  } else {
    badgeHtml = `<span class="badge badge-vaulted">已入库 (Vaulted)</span>`;
  }

  // Modal 头部
  elements.modalHeaderContent.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
      <h2 style="font-size: 1.4rem; color: var(--gold-light);">${escapeHtml(relic.zhName)}</h2>
      <span style="color: var(--text-muted); font-size: 1rem;">(${escapeHtml(relic.name)})</span>
      ${badgeHtml}
    </div>
    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">
      纪元: <strong>${relic.tierZh} (${relic.tier})</strong> · 中文译名来源: ${relic.zhSource}
    </div>
  `;

  // 冲突提示条
  let conflictAlertHtml = '';
  if (relic.conflict) {
    conflictAlertHtml = `
      <div style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 6px; padding: 0.75rem 1rem; margin-bottom: 1rem; font-size: 0.85rem; color: #fbbf24;">
        <strong>入库状态说明：</strong>${relic.conflictNote}。主判定依据为 DE 官方当前掉落表。
      </div>
    `;
  }

  // 奖励表格
  const rowsHtml = relic.rewards.map(rew => {
    const slug = rew.marketSlug;
    const priceData = slug ? state.prices[slug] : null;
    const sellPrice = priceData?.sellMin !== null && priceData?.sellMin !== undefined ? `${priceData.sellMin} ☿` : '-';
    const buyPrice = priceData?.buyMax !== null && priceData?.buyMax !== undefined ? `${priceData.buyMax} ☿` : '-';

    return `
      <tr>
        <td>
          <span class="rarity-pill rarity-${rew.rarity}">
            ${rew.rarity === 'Rare' ? '稀有 (金)' : (rew.rarity === 'Uncommon' ? '罕见 (银)' : '常见 (铜)')}
          </span>
        </td>
        <td>
          <div class="item-link" data-item-slug="${slug || rew.name}">
            ${escapeHtml(rew.zhName)}
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">
            ${escapeHtml(rew.name)} · 来源: ${rew.zhSource}
          </div>
        </td>
        <td style="color: var(--plat-color); font-weight: 600;">
          ${sellPrice} / <span style="font-size: 0.85rem; color: var(--text-muted);">${buyPrice}</span>
        </td>
        <td>${rew.chances.intact !== null ? `${rew.chances.intact}%` : '-'}</td>
        <td>${rew.chances.exceptional !== null ? `${rew.chances.exceptional}%` : '-'}</td>
        <td>${rew.chances.flawless !== null ? `${rew.chances.flawless}%` : '-'}</td>
        <td style="font-weight: 600; color: var(--cyan-primary);">${rew.chances.radiant !== null ? `${rew.chances.radiant}%` : '-'}</td>
      </tr>
    `;
  }).join('');

  // 缺失价格检查
  const missingIntact = expValues.intact.missingPriceCount;
  const missingWarning = missingIntact > 0 
    ? `<div class="dashboard-note warning-text">⚠️ 遗物中有 ${missingIntact} 个奖励物品未录入市场价格，计算中按 0 白金计入。</div>`
    : '';

  // 期望白金面板
  const priceTypeChinese = priceType === 'sellMin' ? '最低卖价' : '最高收购价';

  elements.modalBodyContent.innerHTML = `
    ${conflictAlertHtml}
    
    <div style="overflow-x: auto;">
      <table class="rewards-table">
        <thead>
          <tr>
            <th>稀有度</th>
            <th>奖励物品 (点击查看掉落反查)</th>
            <th>单价 (最低卖/最高买)</th>
            <th>完整</th>
            <th>优良</th>
            <th>无暇</th>
            <th>光辉</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>

    <div class="expected-dashboard">
      <div class="dashboard-header">
        <span class="dashboard-title">四个精炼等级期望白金值 (Σ 掉率 × 价格)</span>
        <span style="font-size: 0.85rem; color: var(--text-secondary);">
          当前基准：<strong style="color: var(--cyan-primary);">${priceTypeChinese}</strong>
        </span>
      </div>
      
      <div class="dashboard-grid">
        <div class="expected-card">
          <div class="expected-level">完整 (Intact)</div>
          <div class="expected-value-num">${expValues.intact.expectedValue} ☿</div>
        </div>
        <div class="expected-card">
          <div class="expected-level">优良 (Exceptional)</div>
          <div class="expected-value-num">${expValues.exceptional.expectedValue} ☿</div>
        </div>
        <div class="expected-card">
          <div class="expected-level">无暇 (Flawless)</div>
          <div class="expected-value-num">${expValues.flawless.expectedValue} ☿</div>
        </div>
        <div class="expected-card highlight">
          <div class="expected-level">光辉 (Radiant) ★</div>
          <div class="expected-value-num">${expValues.radiant.expectedValue} ☿</div>
        </div>
      </div>

      <div class="dashboard-note">
        • 默认按玩家最常用参考的“最低卖价”加权计算，可在顶部切换为“最高收购价”。
      </div>
      ${missingWarning}
    </div>
  `;

  // 绑定物品点击反查
  elements.modalBodyContent.querySelectorAll('.item-link').forEach(link => {
    link.addEventListener('click', () => {
      const slug = link.getAttribute('data-item-slug');
      openItemModal(slug);
    });
  });

  elements.detailModal.classList.add('active');
}

/**
 * 打开物品详情弹窗（物品所在遗物反查与直接掉落来源）
 */
export function openItemModal(itemKey) {
  const item = state.items[itemKey];
  if (!item) return;

  window.location.hash = `item=${encodeURIComponent(itemKey)}`;
  state.activeModal = { type: 'item', id: itemKey };

  const priceData = item.marketSlug ? state.prices[item.marketSlug] : null;
  const sellMin = priceData?.sellMin ?? '暂无';
  const buyMax = priceData?.buyMax ?? '暂无';
  const sellCount = priceData?.sellCount ?? 0;
  const buyCount = priceData?.buyCount ?? 0;

  elements.modalHeaderContent.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
      <h2 style="font-size: 1.4rem; color: var(--gold-light);">${escapeHtml(item.zhName)}</h2>
      <span style="color: var(--text-muted); font-size: 1rem;">(${escapeHtml(item.name)})</span>
    </div>
    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">
      中文译名来源: ${item.zhSource} ${item.marketSlug ? `· Market Slug: <code>${item.marketSlug}</code>` : ''}
    </div>
  `;

  // 价格板块
  const priceBoxHtml = `
    <div class="item-price-box">
      <div class="price-metric">
        <div class="metric-label">当前最低卖价 (在售挂单)</div>
        <div class="metric-val">${sellMin} ${sellMin !== '暂无' ? '☿' : ''}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">有效卖家数: ${sellCount}</div>
      </div>
      <div class="price-metric">
        <div class="metric-label">当前最高收购价 (求购挂单)</div>
        <div class="metric-val" style="color: var(--gold-light);">${buyMax} ${buyMax !== '暂无' ? '☿' : ''}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">有效买家数: ${buyCount}</div>
      </div>
    </div>
  `;

  // 所在遗物反查表
  const relicRows = (item.relics || []).map(r => {
    let badgeHtml = '';
    if (r.conflict) {
      badgeHtml = `<span class="badge badge-conflict">存疑</span>`;
    } else if (!r.vaulted) {
      badgeHtml = `<span class="badge badge-obtainable">可获取</span>`;
    } else {
      badgeHtml = `<span class="badge badge-vaulted">已入库</span>`;
    }

    return `
      <tr>
        <td>
          <a class="item-link relic-nav-link" data-relic-id="${r.relicId}">
            ${escapeHtml(r.relicZhName)} (${escapeHtml(r.relicName)})
          </a>
        </td>
        <td>${r.tierZh} (${r.tier})</td>
        <td>${badgeHtml}</td>
        <td>
          <span class="rarity-pill rarity-${r.rarity}">
            ${r.rarity === 'Rare' ? '稀有' : (r.rarity === 'Uncommon' ? '罕见' : '常见')}
          </span>
        </td>
        <td>${r.chances.intact !== null ? `${r.chances.intact}%` : '-'}</td>
        <td>${r.chances.exceptional !== null ? `${r.chances.exceptional}%` : '-'}</td>
        <td>${r.chances.flawless !== null ? `${r.chances.flawless}%` : '-'}</td>
        <td style="font-weight: 600; color: var(--cyan-primary);">${r.chances.radiant !== null ? `${r.chances.radiant}%` : '-'}</td>
      </tr>
    `;
  }).join('');

  // 任务直接掉落来源
  let directDropsHtml = '';
  if (item.directDrops && item.directDrops.length > 0) {
    const listItems = item.directDrops.slice(0, 30).map(d => `
      <li class="direct-drop-item">
        <span>📍 ${escapeHtml(d.place)} ${d.rotation ? `· 轮次 <strong>${d.rotation}</strong>` : ''}</span>
        <span style="font-weight: 600; color: var(--cyan-primary);">${d.chance}% (${d.rarity})</span>
      </li>
    `).join('');

    directDropsHtml = `
      <div class="direct-drops-section">
        <h4 style="color: var(--text-primary); font-size: 1rem; margin-bottom: 0.5rem;">
          🎯 任务/赏金直接掉落来源 (${item.directDrops.length} 处)
        </h4>
        <ul class="direct-drop-list">
          ${listItems}
        </ul>
      </div>
    `;
  }

  elements.modalBodyContent.innerHTML = `
    ${priceBoxHtml}

    <h4 style="color: var(--text-primary); font-size: 1rem; margin-top: 1rem; margin-bottom: 0.5rem;">
      📦 所在遗物列表 (${item.relics ? item.relics.length : 0} 个)
    </h4>
    <div style="overflow-x: auto;">
      <table class="rewards-table">
        <thead>
          <tr>
            <th>遗物名称 (点击查看)</th>
            <th>纪元</th>
            <th>入库状态</th>
            <th>稀有度</th>
            <th>完整</th>
            <th>优良</th>
            <th>无暇</th>
            <th>光辉</th>
          </tr>
        </thead>
        <tbody>
          ${relicRows.length > 0 ? relicRows : '<tr><td colspan="8" style="text-align: center; color: var(--text-muted);">暂无遗物包含此物品</td></tr>'}
        </tbody>
      </table>
    </div>

    ${directDropsHtml}
  `;

  // 绑定从物品直接跳转到遗物详情
  elements.modalBodyContent.querySelectorAll('.relic-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const rId = link.getAttribute('data-relic-id');
      openRelicModal(rId);
    });
  });

  elements.detailModal.classList.add('active');
}

/**
 * 关闭弹窗
 */
function closeModal() {
  elements.detailModal.classList.remove('active');
  state.activeModal = null;
  history.pushState(null, '', window.location.pathname);
}

/**
 * 响应式搜索输入与下拉候选
 */
function handleSearchInput(e) {
  const query = e.target.value.trim();
  elements.searchClearBtn.style.display = query ? 'block' : 'none';

  if (!query) {
    elements.searchDropdown.classList.remove('active');
    elements.searchDropdown.innerHTML = '';
    return;
  }

  const results = searchIndex(query, state.searchIndexData, { limit: 12 });
  if (results.length === 0) {
    elements.searchDropdown.innerHTML = `
      <div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
        未找到匹配结果
      </div>
    `;
    elements.searchDropdown.classList.add('active');
    return;
  }

  const itemsHtml = results.map(item => {
    const isRelic = item.type === 'relic';
    const tagClass = isRelic ? 'tag-relic' : 'tag-item';
    const tagText = isRelic ? `遗物 · ${item.tierZh || item.tier}` : '物品';
    const subtitle = isRelic ? (item.vaulted ? '已入库' : '可获取') : (item.name || '');

    return `
      <div class="search-item-candidate" data-type="${item.type}" data-id="${item.id}">
        <div class="candidate-info">
          <span class="candidate-title">${escapeHtml(item.zhName || item.name)}</span>
          <span class="candidate-sub">${escapeHtml(item.name)} · ${subtitle}</span>
        </div>
        <span class="candidate-tag ${tagClass}">${tagText}</span>
      </div>
    `;
  }).join('');

  elements.searchDropdown.innerHTML = itemsHtml;
  elements.searchDropdown.classList.add('active');

  elements.searchDropdown.querySelectorAll('.search-item-candidate').forEach(cand => {
    cand.addEventListener('click', () => {
      const type = cand.getAttribute('data-type');
      const id = cand.getAttribute('data-id');
      elements.searchDropdown.classList.remove('active');
      elements.searchInput.value = '';
      elements.searchClearBtn.style.display = 'none';

      if (type === 'relic') {
        openRelicModal(id);
      } else {
        openItemModal(id);
      }
    });
  });
}

/**
 * URL Hash 路由处理
 */
function handleHashRouting() {
  const hash = window.location.hash.slice(1);
  if (!hash) return;

  const params = new URLSearchParams(hash);
  const relicId = params.get('relic');
  const itemId = params.get('item');

  if (relicId) {
    openRelicModal(relicId);
  } else if (itemId) {
    openItemModal(itemId);
  }
}

/**
 * 设置各类事件监听
 */
function setupEventListeners() {
  // 模式切换
  elements.modeTabs.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      elements.modeTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentMode = btn.getAttribute('data-mode');
      renderRelicGrid();
    });
  });

  // 纪元筛选
  elements.tierFilters.querySelectorAll('.tier-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      elements.tierFilters.querySelectorAll('.tier-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentTier = btn.getAttribute('data-tier');
      renderRelicGrid();
    });
  });

  // 排序下拉
  elements.sortSelect.addEventListener('change', (e) => {
    state.currentSort = e.target.value;
    renderRelicGrid();
  });

  // 价格基准切换
  elements.priceModeToggle.addEventListener('change', (e) => {
    state.currentPriceType = e.target.checked ? 'buyMax' : 'sellMin';
    elements.priceModeLabel.textContent = e.target.checked ? '计算基准: 最高收购价' : '计算基准: 最低卖价';
    renderRelicGrid();
    if (state.activeModal?.type === 'relic') {
      openRelicModal(state.activeModal.id);
    }
  });

  // 搜索输入
  elements.searchInput.addEventListener('input', handleSearchInput);
  elements.searchClearBtn.addEventListener('click', () => {
    elements.searchInput.value = '';
    elements.searchClearBtn.style.display = 'none';
    elements.searchDropdown.classList.remove('active');
  });

  // 点击外部关闭搜索下拉
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
      elements.searchDropdown.classList.remove('active');
    }
  });

  // 弹窗关闭
  elements.modalCloseBtn.addEventListener('click', closeModal);
  elements.detailModal.addEventListener('click', (e) => {
    if (e.target === elements.detailModal) {
      closeModal();
    }
  });

  // ESC 键关闭弹窗与搜索下拉
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (elements.searchDropdown.classList.contains('active')) {
        elements.searchDropdown.classList.remove('active');
      } else if (elements.detailModal.classList.contains('active')) {
        closeModal();
      }
    }
  });

  // 浏览器前进/后退
  window.addEventListener('popstate', handleHashRouting);
}

/**
 * 字符转义防止 XSS
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 启动应用
document.addEventListener('DOMContentLoaded', init);
