/**
 * js/app.js - 前端全功能交互主控制器（阶段 2 扩充）
 * 包含：遗物 / 赋能 / 紫卡 / Mod / 刷取来源 五大模块
 * 原生 ES Module，无外部构建依赖
 */

import {
  calculateExpectedValue,
  calculateAllRefinementValues,
  calculateSourceExpectedValue,
  calculateEnemyExpectedValue,
  getItemPrice
} from './lib/calculations.js';
import { searchIndex } from './lib/search.js';
import { filterSources } from './lib/sources.js';

// 应用全局状态
const state = {
  meta: null,
  relics: [],
  items: {},
  arcanes: [],
  rivens: [],
  mods: [],
  sources: [],
  prices: {},
  searchIndexData: [],
  
  // 当前活动视图
  activeView: 'relics', // 'relics' | 'arcanes' | 'rivens' | 'mods' | 'sources'
  
  // 遗物视图参数
  currentMode: 'obtainable',
  includeUnlisted: true, // A3: 默认在可获取中包含特殊来源安魂遗物
  currentTier: 'all',
  currentRelicSort: 'radiant_desc',
  
  // 赋能与 Mod 视图参数
  currentArcaneSort: 'max_desc',
  currentModSort: 'max_desc',
  currentModRarity: 'all',
  
  // 来源视图参数
  currentSourceCat: 'all',
  currentSourceType: 'all',
  currentSourceSort: 'exp_desc',
  sourcePvpOnly: false,
  
  // 价格基准模式
  currentPriceType: 'sellMin', // 'sellMin' | 'buyMax'
  
  // 活动弹窗
  activeModal: null // { type: 'relic'|'item'|'arcane'|'riven'|'mod'|'source', id: string }
};

// DOM 元素缓存
const elements = {
  // Stats
  statTotalRelics: document.getElementById('stat-total-relics'),
  statTotalArcanes: document.getElementById('stat-total-arcanes'),
  statTotalRivens: document.getElementById('stat-total-rivens'),
  statTotalMods: document.getElementById('stat-total-mods'),
  statTotalSources: document.getElementById('stat-total-sources'),
  statPriceCoverage: document.getElementById('stat-price-coverage'),
  
  // Nav
  mainNav: document.getElementById('main-nav'),
  
  // Search
  searchInput: document.getElementById('search-input'),
  searchClearBtn: document.getElementById('search-clear-btn'),
  searchDropdown: document.getElementById('search-dropdown'),
  
  // Controls
  modeTabs: document.getElementById('mode-tabs'),
  sourceCatTabs: document.getElementById('source-cat-tabs'),
  tierFilters: document.getElementById('tier-filters'),
  sourceTypeFilters: document.getElementById('source-type-filters'),
  modRarityFilters: document.getElementById('mod-rarity-filters'),
  sortSelect: document.getElementById('sort-select'),
  priceModeToggle: document.getElementById('price-mode-toggle'),
  priceModeLabel: document.getElementById('price-mode-label'),
  unlistedToggle: document.getElementById('unlisted-toggle'),
  filterResultCount: document.getElementById('filter-result-count'),
  formulaCallout: document.getElementById('formula-callout'),
  sourcePvpCallout: document.getElementById('source-pvp-callout'),
  sourcePvpCalloutText: document.getElementById('source-pvp-callout-text'),
  pvpFilterBtn: document.getElementById('pvp-filter-btn'),
  
  // Content Grid
  gridView: document.getElementById('grid-view'),
  
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
 * 格式化白金价格展示（无价格显示“暂无挂单”）
 */
function formatPlat(price, suffix = ' ☿') {
  if (price === null || price === undefined) return '<span style="color: var(--text-muted); font-size: 0.85em;">暂无挂单</span>';
  return `${price}${suffix}`;
}

/**
 * 初始化数据加载
 */
async function init() {
  try {
    const [metaRes, pricesRes, relicsRes, arcanesRes, rivensRes, modsRes, sourcesRes, searchIndexRes] = await Promise.all([
      fetch('./data/meta.json').then(r => r.json()),
      fetch('./data/prices.json').then(r => r.json()).catch(() => ({ items: {} })),
      fetch('./data/relics.json').then(r => r.json()),
      fetch('./data/arcanes.json').then(r => r.json()).catch(() => []),
      fetch('./data/rivens.json').then(r => r.json()).catch(() => []),
      fetch('./data/mods.json').then(r => r.json()).catch(() => []),
      fetch('./data/sources.json').then(r => r.json()).catch(() => []),
      fetch('./data/search-index.json').then(r => r.json())
    ]);

    state.meta = metaRes;
    state.prices = pricesRes.items || {};
    state.relics = relicsRes.relics || [];
    state.items = relicsRes.items || {};
    state.arcanes = arcanesRes;
    state.rivens = rivensRes;
    state.mods = modsRes;
    state.sources = sourcesRes;
    state.searchIndexData = searchIndexRes || [];

    updateStatsBar();
    updateFooterInfo();
    setupEventListeners();
    updateSortDropdownOptions();
    handleHashRouting();
    renderCurrentView();
  } catch (err) {
    console.error('加载数据失败:', err);
    elements.gridView.innerHTML = `
      <div class="empty-state">
        <h3 style="color: #ef4444;">数据加载失败</h3>
        <p>未能成功获取数据，请检查网络连接或确认数据构建已完成。</p>
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
  elements.statTotalArcanes.textContent = s.totalArcanes || state.arcanes.length;
  elements.statTotalRivens.textContent = s.totalRivens || state.rivens.length;
  elements.statTotalMods.textContent = s.totalMods || state.mods.length;
  elements.statTotalSources.textContent = s.totalSources || state.sources.length;
  elements.statPriceCoverage.textContent = state.meta.prices?.coverage || '0.0%';
}

/**
 * 更新页脚元数据
 */
function updateFooterInfo() {
  if (!state.meta) return;
  elements.footerDataTime.textContent = formatDateTime(state.meta.builtAt);
  elements.footerPriceTime.textContent = formatDateTime(state.meta.prices?.updatedAt);
  const p = state.meta.prices || {};
  elements.footerPriceCoverage.textContent = `${p.pricedCount || 0} / ${p.totalCount || 0} 项已抓取 (${p.coverage || '0.0%'})`;

  const catsEl = document.getElementById('footer-price-categories');
  if (catsEl && p.categories) {
    const c = p.categories;
    const catList = [
      c.relics ? `遗物奖励: ${c.relics.pricedCount}/${c.relics.totalCount} (${c.relics.coverage})` : null,
      c.rivens ? `未开紫卡: ${c.rivens.pricedCount}/${c.rivens.totalCount} (${c.rivens.coverage})` : null,
      c.arcanes ? `赋能: ${c.arcanes.pricedCount}/${c.arcanes.totalCount} (${c.arcanes.coverage})` : null,
      c.mods ? `掉落Mod: ${c.mods.pricedCount}/${c.mods.totalCount} (${c.mods.coverage})` : null
    ].filter(Boolean);
    catsEl.innerHTML = catList.map(item => `<div>• ${item}</div>`).join('');
  }
}

/**
 * 切换主导航视图
 */
function switchView(viewName) {
  state.activeView = viewName;

  // 更新导航按钮激活状态
  elements.mainNav.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
  });

  // 控制各视图专属过滤工具栏的显隐
  document.querySelectorAll('.view-control').forEach(el => {
    el.style.display = 'none';
  });

  if (viewName === 'relics') {
    document.querySelectorAll('.view-relics').forEach(el => el.style.display = '');
  } else if (viewName === 'sources') {
    document.querySelectorAll('.view-sources').forEach(el => el.style.display = '');
  } else if (viewName === 'mods') {
    document.querySelectorAll('.view-mods').forEach(el => el.style.display = '');
  }

  updateSortDropdownOptions();
  renderCurrentView();
}

/**
 * 动态更新排序下拉菜单选项
 */
function updateSortDropdownOptions() {
  let optionsHtml = '';
  if (state.activeView === 'relics') {
    optionsHtml = `
      <option value="radiant_desc">期望白金: 光辉 (高到低)</option>
      <option value="intact_desc">期望白金: 完整 (高到低)</option>
      <option value="exceptional_desc">期望白金: 优良 (高到低)</option>
      <option value="flawless_desc">期望白金: 无暇 (高到低)</option>
      <option value="name_asc">名称: A-Z 顺序</option>
    `;
    elements.sortSelect.value = state.currentRelicSort;
  } else if (state.activeView === 'arcanes' || state.activeView === 'mods') {
    optionsHtml = `
      <option value="max_desc">满级价格: 高到低</option>
      <option value="r0_desc">0级价格: 高到低</option>
      <option value="name_asc">名称: A-Z 顺序</option>
      <option value="sources_desc">掉落来源数: 多到少</option>
    `;
    elements.sortSelect.value = state.activeView === 'arcanes' ? state.currentArcaneSort : state.currentModSort;
  } else if (state.activeView === 'rivens') {
    optionsHtml = `
      <option value="price_desc">市场价格: 高到低</option>
      <option value="name_asc">名称: A-Z 顺序</option>
    `;
  } else if (state.activeView === 'sources') {
    optionsHtml = `
      <option value="exp_desc">每次/每击杀期望白金: 高到低</option>
      <option value="items_desc">掉落物品数: 多到少</option>
      <option value="name_asc">名称: A-Z 顺序</option>
    `;
    elements.sortSelect.value = state.currentSourceSort;
  }
  elements.sortSelect.innerHTML = optionsHtml;
}

/**
 * 统一渲染当前视图内容
 */
function renderCurrentView() {
  switch (state.activeView) {
    case 'relics':
      renderRelicsView();
      break;
    case 'arcanes':
      renderArcanesView();
      break;
    case 'rivens':
      renderRivensView();
      break;
    case 'mods':
      renderModsView();
      break;
    case 'sources':
      renderSourcesView();
      break;
  }
}

/* ==========================================================================
   1. 遗物视图 (Relics View)
   ========================================================================== */
function renderRelicsView() {
  const priceType = state.currentPriceType;

  // 1. 过滤可获取模式 (包含 A3 unlisted 逻辑)
  let list = state.relics.filter(r => {
    if (state.currentMode === 'obtainable') {
      if (r.unlisted) {
        return state.includeUnlisted;
      }
      return !r.vaulted;
    }
    return true;
  });

  // 2. 纪元过滤
  if (state.currentTier !== 'all') {
    list = list.filter(r => r.tier === state.currentTier);
  }

  // 3. 计算期望白金
  list.forEach(r => {
    r._expValues = calculateAllRefinementValues(r.rewards, state.prices, { priceType });
  });

  // 4. 排序
  list.sort((a, b) => {
    const valA = a._expValues;
    const valB = b._expValues;
    if (state.currentRelicSort === 'name_asc') {
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    }
    const key = state.currentRelicSort.replace('_desc', '');
    const aNum = valA[key]?.expectedValue ?? -1;
    const bNum = valB[key]?.expectedValue ?? -1;
    return bNum - aNum;
  });

  elements.filterResultCount.textContent = `显示 ${list.length} 个遗物`;

  if (list.length === 0) {
    elements.gridView.innerHTML = `
      <div class="empty-state">
        <h3>未找到符合条件的遗物</h3>
        <p>尝试切换纪元或选择“全部遗物”。</p>
      </div>
    `;
    return;
  }

  const cardsHtml = list.map(r => {
    let badgeHtml = '';
    if (r.unlisted) {
      badgeHtml = `<span class="badge badge-unlisted" title="${r.statusReason || ''}">特殊来源</span>`;
    } else if (r.conflict) {
      badgeHtml = `<span class="badge badge-conflict" title="${r.conflictNote || ''}">⚠️ 存疑</span>`;
    } else if (!r.vaulted) {
      badgeHtml = `<span class="badge badge-obtainable">可获取</span>`;
    } else {
      badgeHtml = `<span class="badge badge-vaulted">已入库</span>`;
    }

    const expRad = r._expValues.radiant.expectedValue;
    const expInt = r._expValues.intact.expectedValue;
    const expRadStr = expRad !== null ? `${expRad} ☿` : '—';
    const expIntStr = expInt !== null ? `${expInt} ☿` : '—';

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
            ${expRadStr} / ${expIntStr}
          </span>
        </div>

        <div class="rewards-preview">
          ${rareReward ? `
            <div class="reward-preview-item reward-preview-rare">
              <span class="reward-name" title="${escapeHtml(rareReward.zhName)}">★ ${rareReward.quantity > 1 ? `<span class="quantity-tag">×${rareReward.quantity}</span>` : ''}${escapeHtml(rareReward.zhName)}</span>
              <span>${rareReward.chances.radiant}%</span>
            </div>
          ` : ''}
          ${uncRewards.slice(0, 2).map(u => `
            <div class="reward-preview-item reward-preview-uncommon">
              <span class="reward-name" title="${escapeHtml(u.zhName)}">◆ ${u.quantity > 1 ? `<span class="quantity-tag">×${u.quantity}</span>` : ''}${escapeHtml(u.zhName)}</span>
              <span>${u.chances.radiant}%</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  elements.gridView.innerHTML = cardsHtml;

  elements.gridView.querySelectorAll('.relic-card').forEach(card => {
    card.addEventListener('click', () => {
      openRelicModal(card.getAttribute('data-relic-id'));
    });
  });
}

/* ==========================================================================
   2. 赋能视图 (Arcanes View)
   ========================================================================== */
function renderArcanesView() {
  const priceType = state.currentPriceType;
  let list = [...state.arcanes];

  // 排序
  list.sort((a, b) => {
    const pMaxA = getItemPrice(a.slug, a.maxRank, state.prices, priceType) ?? -1;
    const pMaxB = getItemPrice(b.slug, b.maxRank, state.prices, priceType) ?? -1;
    const p0A = getItemPrice(a.slug, 0, state.prices, priceType) ?? -1;
    const p0B = getItemPrice(b.slug, 0, state.prices, priceType) ?? -1;

    if (state.currentArcaneSort === 'max_desc') return pMaxB - pMaxA;
    if (state.currentArcaneSort === 'r0_desc') return p0B - p0A;
    if (state.currentArcaneSort === 'sources_desc') return b.dropSources.length - a.dropSources.length;
    return a.name.localeCompare(b.name);
  });

  elements.filterResultCount.textContent = `共 ${list.length} 个赋能`;

  elements.gridView.innerHTML = list.map(arc => {
    const price0 = getItemPrice(arc.slug, 0, state.prices, priceType);
    const priceMax = getItemPrice(arc.slug, arc.maxRank, state.prices, priceType);

    return `
      <div class="relic-card" data-arcane-id="${arc.slug}">
        <div class="card-header">
          <div class="relic-title-area">
            <span class="relic-zh-name">${escapeHtml(arc.zhName)}</span>
            <span class="relic-en-name">${escapeHtml(arc.name)}</span>
          </div>
          <span class="badge" style="background: rgba(234, 179, 8, 0.15); color: #fbbf24; border: 1px solid rgba(234, 179, 8, 0.3);">
            最高 Rank ${arc.maxRank}
          </span>
        </div>

        <div class="card-expected-value" style="flex-direction: column; align-items: flex-start; gap: 0.35rem;">
          <div style="display: flex; justify-content: space-between; width: 100%;">
            <span class="plat-label">0 级参考价格:</span>
            <span class="plat-badge" style="font-size: 0.95rem;">${formatPlat(price0)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; width: 100%;">
            <span class="plat-label">满级 (Rank ${arc.maxRank}) 价格:</span>
            <span class="plat-badge" style="font-size: 0.95rem; color: var(--gold-light);">${formatPlat(priceMax)}</span>
          </div>
        </div>

        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">
          📍 包含 <strong>${arc.dropSources.length}</strong> 处直接掉落来源
        </div>
      </div>
    `;
  }).join('');

  elements.gridView.querySelectorAll('[data-arcane-id]').forEach(card => {
    card.addEventListener('click', () => {
      openArcaneModal(card.getAttribute('data-arcane-id'));
    });
  });
}

/* ==========================================================================
   3. 未开紫卡视图 (Rivens View)
   ========================================================================== */
function renderRivensView() {
  const priceType = state.currentPriceType;
  let list = [...state.rivens];

  list.sort((a, b) => {
    const pA = getItemPrice(a.slug, null, state.prices, priceType) ?? -1;
    const pB = getItemPrice(b.slug, null, state.prices, priceType) ?? -1;
    return pB - pA;
  });

  elements.filterResultCount.textContent = `共 ${list.length} 种未开紫卡类型`;

  elements.gridView.innerHTML = list.map(riv => {
    const price = getItemPrice(riv.slug, null, state.prices, priceType);
    const topSources = riv.dropSources.slice(0, 3);

    return `
      <div class="relic-card" data-riven-id="${riv.slug}">
        <div class="card-header">
          <div class="relic-title-area">
            <span class="relic-zh-name">${escapeHtml(riv.zhName)}</span>
            <span class="relic-en-name">${escapeHtml(riv.name)}</span>
          </div>
          <span class="badge" style="background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3);">
            未开紫卡
          </span>
        </div>

        <div class="card-expected-value">
          <span class="plat-label">市场交易价:</span>
          <span class="plat-badge">${formatPlat(price)}</span>
        </div>

        <div class="rewards-preview">
          ${topSources.map(s => `
            <div class="reward-preview-item" style="color: var(--text-secondary);">
              <span class="reward-name" title="${escapeHtml(s.nameZh || s.nameEn)}">📍 ${escapeHtml(s.nameZh || s.nameEn)}</span>
              <span style="color: var(--cyan-primary);">${s.chance}%</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  elements.gridView.querySelectorAll('[data-riven-id]').forEach(card => {
    card.addEventListener('click', () => {
      openRivenModal(card.getAttribute('data-riven-id'));
    });
  });
}

/* ==========================================================================
   4. Mod 视图 (Mods View)
   ========================================================================== */
function renderModsView() {
  const priceType = state.currentPriceType;
  let list = [...state.mods];

  // 稀有度过滤
  if (state.currentModRarity !== 'all') {
    const rLower = state.currentModRarity.toLowerCase();
    list = list.filter(m => m.tags?.some(t => t.toLowerCase() === rLower));
  }

  // 排序
  list.sort((a, b) => {
    const pMaxA = getItemPrice(a.slug, a.maxRank, state.prices, priceType) ?? -1;
    const pMaxB = getItemPrice(b.slug, b.maxRank, state.prices, priceType) ?? -1;
    const p0A = getItemPrice(a.slug, 0, state.prices, priceType) ?? -1;
    const p0B = getItemPrice(b.slug, 0, state.prices, priceType) ?? -1;

    if (state.currentModSort === 'max_desc') return pMaxB - pMaxA;
    if (state.currentModSort === 'r0_desc') return p0B - p0A;
    if (state.currentModSort === 'sources_desc') return b.dropSources.length - a.dropSources.length;
    return a.name.localeCompare(b.name);
  });

  elements.filterResultCount.textContent = `共 ${list.length} 个具备掉落来源的 Mod`;

  // 渲染前 100 个卡片，其余支持分页或按需滚动
  const displayList = list.slice(0, 100);

  elements.gridView.innerHTML = displayList.map(m => {
    const p0 = getItemPrice(m.slug, 0, state.prices, priceType);
    const pMax = getItemPrice(m.slug, m.maxRank, state.prices, priceType);

    return `
      <div class="relic-card" data-mod-id="${m.slug}">
        <div class="card-header">
          <div class="relic-title-area">
            <span class="relic-zh-name">${escapeHtml(m.zhName)}</span>
            <span class="relic-en-name">${escapeHtml(m.name)}</span>
          </div>
          <span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3);">
            Rank ${m.maxRank}
          </span>
        </div>

        <div class="card-expected-value" style="flex-direction: column; align-items: flex-start; gap: 0.35rem;">
          <div style="display: flex; justify-content: space-between; width: 100%;">
            <span class="plat-label">0 级参考价格:</span>
            <span class="plat-badge" style="font-size: 0.95rem;">${formatPlat(p0)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; width: 100%;">
            <span class="plat-label">满级 (Rank ${m.maxRank}) 价格:</span>
            <span class="plat-badge" style="font-size: 0.95rem; color: var(--gold-light);">${formatPlat(pMax)}</span>
          </div>
        </div>

        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">
          📍 包含 <strong>${m.dropSources.length}</strong> 处掉落来源（敌人/任务）
        </div>
      </div>
    `;
  }).join('');

  elements.gridView.querySelectorAll('[data-mod-id]').forEach(card => {
    card.addEventListener('click', () => {
      openModModal(card.getAttribute('data-mod-id'));
    });
  });
}

/* ==========================================================================
   5. 刷取来源视图 (Drop Sources View)
   ========================================================================== */
function renderSourcesView() {
  const priceType = state.currentPriceType;

  // 使用纯函数统一进行类型、奖励分类以及 PvP 模式过滤
  let list = filterSources(state.sources, {
    type: state.currentSourceType,
    category: state.currentSourceCat,
    pvpOnly: state.sourcePvpOnly
  });

  // 更新 PvP 提示横幅
  if (elements.sourcePvpCallout && elements.sourcePvpCalloutText) {
    if (state.sourcePvpOnly) {
      elements.sourcePvpCalloutText.innerHTML = '⚔️ <strong>提示：</strong>当前仅显示 PvP（武形秘仪 / Conclave）来源，可再次点击「PvP」按钮返回常规掉落。';
      elements.sourcePvpCallout.classList.add('pvp-active-banner');
    } else {
      elements.sourcePvpCalloutText.innerHTML = '💡 <strong>提示：</strong>当前页面不包含 PvP 来源，可点击「PvP」按钮查看。';
      elements.sourcePvpCallout.classList.remove('pvp-active-banner');
    }
  }

  // 3. 计算期望白金
  list.forEach(src => {
    if (src.type === 'enemy') {
      src._exp = calculateEnemyExpectedValue(src.enemyModDropChance, src.rewards, state.prices, { priceType });
    } else {
      src._exp = calculateSourceExpectedValue(src.rewards, state.prices, { priceType });
    }
  });

  // 4. 排序
  list.sort((a, b) => {
    const expA = a._exp?.expectedValue ?? -1;
    const expB = b._exp?.expectedValue ?? -1;
    if (state.currentSourceSort === 'exp_desc') {
      if (expB !== expA) return expB - expA;
      return b.rewards.length - a.rewards.length;
    } else if (state.currentSourceSort === 'items_desc') {
      return b.rewards.length - a.rewards.length;
    }
    return (a.nameZh || a.nameEn).localeCompare(b.nameZh || b.nameEn);
  });

  elements.filterResultCount.textContent = `共 ${list.length} 处掉落来源`;

  // 渲染前 80 个高期望来源
  const displayList = list.slice(0, 80);

  elements.gridView.innerHTML = displayList.map(src => {
    const isEnemy = src.type === 'enemy';
    const typeLabel = src.isPvp ? 'PvP' : (isEnemy ? '敌人击杀' : (src.type === 'mission' ? '星图任务' : (src.type === 'bounty' ? '平原赏金' : '特殊/密室')));
    const badgeClass = src.isPvp ? 'badge-pvp' : '';
    const badgeStyle = src.isPvp ? '' : 'background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);';
    const expVal = src._exp.expectedValue;
    const expStr = expVal !== null ? `${expVal} ☿` : '—';
    const subNote = isEnemy 
      ? `Mod 掉率: ${src.enemyModDropChance}% · 每击杀期望` 
      : `${src.rotation ? `轮次 ${src.rotation} · ` : ''}单次通关期望`;

    return `
      <div class="relic-card" data-source-id="${src.id}">
        <div class="card-header">
          <div class="relic-title-area">
            <span class="relic-zh-name">${escapeHtml(src.nameZh || src.nameEn)}</span>
            <span class="relic-en-name">${escapeHtml(src.nameEn)}</span>
          </div>
          <span class="badge ${badgeClass}" style="${badgeStyle}">
            ${typeLabel}
          </span>
        </div>

        <div class="card-expected-value">
          <span class="plat-label">${subNote}:</span>
          <span class="plat-badge">${expStr}</span>
        </div>

        <div class="rewards-preview">
          ${src.rewards.slice(0, 3).map(r => `
            <div class="reward-preview-item">
              <span class="reward-name" title="${escapeHtml(r.itemZh || r.itemName)}">• ${escapeHtml(r.itemZh || r.itemName)}</span>
              <span style="color: var(--cyan-primary);">${r.chance}%</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  elements.gridView.querySelectorAll('[data-source-id]').forEach(card => {
    card.addEventListener('click', () => {
      openSourceModal(card.getAttribute('data-source-id'));
    });
  });
}

/* ==========================================================================
   Modals (遗物/物品/赋能/紫卡/Mod/来源 弹窗详情)
   ========================================================================== */

/**
 * 打开遗物弹窗
 */
export function openRelicModal(relicId) {
  const relic = state.relics.find(r => r.id === relicId);
  if (!relic) return;

  window.location.hash = `relic=${relic.id}`;
  state.activeModal = { type: 'relic', id: relic.id };

  const priceType = state.currentPriceType;
  const expValues = calculateAllRefinementValues(relic.rewards, state.prices, { priceType });

  let badgeHtml = '';
  if (relic.unlisted) {
    badgeHtml = `<span class="badge badge-unlisted" title="${relic.statusReason}">特殊来源 (永不入库)</span>`;
  } else if (relic.conflict) {
    badgeHtml = `<span class="badge badge-conflict" title="${relic.conflictNote}">⚠️ 状态存疑</span>`;
  } else if (!relic.vaulted) {
    badgeHtml = `<span class="badge badge-obtainable">可获取</span>`;
  } else {
    badgeHtml = `<span class="badge badge-vaulted">已入库</span>`;
  }

  elements.modalHeaderContent.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
      <h2 style="font-size: 1.4rem; color: var(--gold-light);">${escapeHtml(relic.zhName)}</h2>
      <span style="color: var(--text-muted); font-size: 1rem;">(${escapeHtml(relic.name)})</span>
      ${badgeHtml}
    </div>
    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">
      纪元: <strong>${relic.tierZh} (${relic.tier})</strong> · 中文来源: ${relic.zhSource}
    </div>
  `;

  let alertBanner = '';
  if (relic.unlisted) {
    alertBanner = `
      <div style="background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.4); border-radius: 6px; padding: 0.75rem 1rem; margin-bottom: 1rem; font-size: 0.85rem; color: #d8b4fe;">
        <strong>机制说明：</strong>${relic.statusReason}。来源认定：${relic.statusSource}。
      </div>
    `;
  } else if (relic.conflict) {
    alertBanner = `
      <div style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 6px; padding: 0.75rem 1rem; margin-bottom: 1rem; font-size: 0.85rem; color: #fbbf24;">
        <strong>入库状态冲突：</strong>${relic.conflictNote}。主判定依据为 DE 官方当前掉落表。
      </div>
    `;
  }

  const rowsHtml = relic.rewards.map(rew => {
    const slug = rew.marketSlug;
    const priceData = slug ? state.prices[slug] : null;
    const sellPrice = priceData?.sellMin !== null && priceData?.sellMin !== undefined ? `${priceData.sellMin} ☿` : '<span style="color: var(--text-muted);">暂无挂单</span>';
    const buyPrice = priceData?.buyMax !== null && priceData?.buyMax !== undefined ? `${priceData.buyMax} ☿` : '<span style="color: var(--text-muted);">暂无挂单</span>';

    return `
      <tr>
        <td>
          <span class="rarity-pill rarity-${rew.rarity}">
            ${rew.rarity === 'Rare' ? '稀有 (金)' : (rew.rarity === 'Uncommon' ? '罕见 (银)' : '常见 (铜)')}
          </span>
        </td>
        <td>
          <div class="item-link" data-item-slug="${slug || rew.name}">
            ${rew.quantity > 1 ? `<span class="quantity-tag">×${rew.quantity}</span>` : ''}${escapeHtml(rew.zhName)}
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

  const formatExp = (num) => num !== null ? `${num} ☿` : '—';
  const missingIntact = expValues.intact.missingPriceCount;
  const missingWarning = missingIntact > 0 
    ? `<div class="dashboard-note warning-text">⚠️ 遗物中有 ${missingIntact} 个奖励物品暂无市场挂单，按 0 白金计入。</div>`
    : '';

  elements.modalBodyContent.innerHTML = `
    ${alertBanner}

    <div style="overflow-x: auto;">
      <table class="rewards-table">
        <thead>
          <tr>
            <th>稀有度</th>
            <th>奖励物品 (点击查看反查)</th>
            <th>单价 (最低卖 / 最高买)</th>
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
          当前基准：<strong style="color: var(--cyan-primary);">${priceType === 'sellMin' ? '最低卖价' : '最高收购价'}</strong>
        </span>
      </div>

      <div class="dashboard-grid">
        <div class="expected-card">
          <div class="expected-level">完整 (Intact)</div>
          <div class="expected-value-num">${formatExp(expValues.intact.expectedValue)}</div>
        </div>
        <div class="expected-card">
          <div class="expected-level">优良 (Exceptional)</div>
          <div class="expected-value-num">${formatExp(expValues.exceptional.expectedValue)}</div>
        </div>
        <div class="expected-card">
          <div class="expected-level">无暇 (Flawless)</div>
          <div class="expected-value-num">${formatExp(expValues.flawless.expectedValue)}</div>
        </div>
        <div class="expected-card highlight">
          <div class="expected-level">光辉 (Radiant) ★</div>
          <div class="expected-value-num">${formatExp(expValues.radiant.expectedValue)}</div>
        </div>
      </div>

      ${missingWarning}
      <div class="dashboard-note" style="margin-top: 0.75rem; font-size: 0.8rem; color: var(--text-muted);">
        💡 价格取 warframe.market /v2/orders/item/{slug}/top 返回订单中的最低卖价/最高收购价，仅代表抓取时刻；遗物期望值不含 Forma 等不可交易物。
      </div>
    </div>
  `;

  elements.modalBodyContent.querySelectorAll('.item-link').forEach(link => {
    link.addEventListener('click', () => {
      openItemModal(link.getAttribute('data-item-slug'));
    });
  });

  elements.detailModal.classList.add('active');
}

/**
 * 打开物品弹窗
 */
export function openItemModal(itemKey) {
  const item = state.items[itemKey];
  if (!item) return;

  window.location.hash = `item=${encodeURIComponent(itemKey)}`;
  state.activeModal = { type: 'item', id: itemKey };

  const priceData = item.marketSlug ? state.prices[item.marketSlug] : null;
  const sellMin = priceData?.sellMin !== null && priceData?.sellMin !== undefined ? `${priceData.sellMin} ☿` : '暂无挂单';
  const buyMax = priceData?.buyMax !== null && priceData?.buyMax !== undefined ? `${priceData.buyMax} ☿` : '暂无挂单';

  elements.modalHeaderContent.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
      <h2 style="font-size: 1.4rem; color: var(--gold-light);">${escapeHtml(item.zhName)}</h2>
      <span style="color: var(--text-muted); font-size: 1rem;">(${escapeHtml(item.name)})</span>
    </div>
    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">
      中文译名来源: ${item.zhSource} ${item.marketSlug ? `· Market Slug: <code>${item.marketSlug}</code>` : ''}
    </div>
  `;

  const relicRows = (item.relics || []).map(r => `
    <tr>
      <td>
        <a class="item-link relic-nav-link" data-relic-id="${r.relicId}">
          ${escapeHtml(r.relicZhName)} (${escapeHtml(r.relicName)})
        </a>
      </td>
      <td>${r.tierZh} (${r.tier})</td>
      <td>
        <span class="badge ${r.unlisted ? 'badge-unlisted' : (!r.vaulted ? 'badge-obtainable' : 'badge-vaulted')}">
          ${r.unlisted ? '特殊来源' : (!r.vaulted ? '可获取' : '已入库')}
        </span>
      </td>
      <td>${r.quantity > 1 ? `<span class="quantity-tag">×${r.quantity}</span>` : ''}${r.rarity}</td>
      <td>${r.chances.intact}%</td>
      <td>${r.chances.radiant}%</td>
    </tr>
  `).join('');

  elements.modalBodyContent.innerHTML = `
    <div class="item-price-box">
      <div class="price-metric">
        <div class="metric-label">当前最低卖价</div>
        <div class="metric-val">${sellMin}</div>
      </div>
      <div class="price-metric">
        <div class="metric-label">当前最高收购价</div>
        <div class="metric-val" style="color: var(--gold-light);">${buyMax}</div>
      </div>
    </div>

    <h4 style="color: var(--text-primary); font-size: 1rem; margin: 1rem 0 0.5rem 0;">
      📦 所在遗物列表 (${item.relics ? item.relics.length : 0} 个)
    </h4>
    <div style="overflow-x: auto;">
      <table class="rewards-table">
        <thead>
          <tr>
            <th>遗物名称 (点击查看)</th>
            <th>纪元</th>
            <th>状态</th>
            <th>稀有度</th>
            <th>完整</th>
            <th>光辉</th>
          </tr>
        </thead>
        <tbody>
          ${relicRows || '<tr><td colspan="6" style="text-align: center;">暂无遗物包含此物品</td></tr>'}
        </tbody>
      </table>
    </div>
  `;

  elements.modalBodyContent.querySelectorAll('.relic-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      openRelicModal(link.getAttribute('data-relic-id'));
    });
  });

  elements.detailModal.classList.add('active');
}

/**
 * 打开赋能弹窗
 */
export function openArcaneModal(slug) {
  const arc = state.arcanes.find(a => a.slug === slug);
  if (!arc) return;

  window.location.hash = `arcane=${encodeURIComponent(slug)}`;
  state.activeModal = { type: 'arcane', id: slug };

  const p0 = getItemPrice(slug, 0, state.prices, state.currentPriceType);
  const pMax = getItemPrice(slug, arc.maxRank, state.prices, state.currentPriceType);

  const sourcesRows = arc.dropSources.map(s => {
    let compChance = `${s.chance}%`;
    if (s.enemyModDropChance) {
      const comp = ((s.enemyModDropChance / 100) * (s.chance / 100) * 100).toFixed(4);
      compChance = `${s.chance}% × ${s.enemyModDropChance}% = <strong>${comp}%</strong>`;
    }

    return `
      <tr>
        <td><strong>${escapeHtml(s.nameZh || s.nameEn)}</strong></td>
        <td>${s.sourceType}</td>
        <td>${s.rotation ? `轮次 ${s.rotation}` : '-'}</td>
        <td style="color: var(--cyan-primary);">${s.quantity > 1 ? `<span class="quantity-tag">×${s.quantity}</span> ` : ''}${compChance}</td>
      </tr>
    `;
  }).join('');

  elements.modalHeaderContent.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
      <h2 style="font-size: 1.4rem; color: var(--gold-light);">${escapeHtml(arc.zhName)}</h2>
      <span style="color: var(--text-muted); font-size: 1rem;">(${escapeHtml(arc.name)})</span>
    </div>
    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">
      最高等级: Rank ${arc.maxRank} · Market Slug: <code>${arc.slug}</code>
    </div>
  `;

  elements.modalBodyContent.innerHTML = `
    <div class="item-price-box">
      <div class="price-metric">
        <div class="metric-label">0 级参考价格</div>
        <div class="metric-val">${formatPlat(p0)}</div>
      </div>
      <div class="price-metric">
        <div class="metric-label">满级 (Rank ${arc.maxRank}) 价格</div>
        <div class="metric-val" style="color: var(--gold-light);">${formatPlat(pMax)}</div>
      </div>
    </div>

    <h4 style="color: var(--text-primary); font-size: 1rem; margin: 1rem 0 0.5rem 0;">
      🎯 掉落来源 (${arc.dropSources.length} 处)
    </h4>
    <div style="overflow-x: auto;">
      <table class="rewards-table">
        <thead>
          <tr>
            <th>来源名称</th>
            <th>类型</th>
            <th>轮次</th>
            <th>掉落概率 (综合)</th>
          </tr>
        </thead>
        <tbody>
          ${sourcesRows || '<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">DE 掉落表中未收录该赋能的直接掉落（可能源自商城、活动或商人兑换）</td></tr>'}
        </tbody>
      </table>
    </div>
  `;

  elements.detailModal.classList.add('active');
}

/**
 * 打开未开紫卡弹窗
 */
export function openRivenModal(slug) {
  const riv = state.rivens.find(r => r.slug === slug);
  if (!riv) return;

  window.location.hash = `riven=${encodeURIComponent(slug)}`;
  state.activeModal = { type: 'riven', id: slug };

  const price = getItemPrice(slug, null, state.prices, state.currentPriceType);

  const sourcesRows = riv.dropSources.map(s => `
    <tr>
      <td><strong>${escapeHtml(s.nameZh || s.nameEn)}</strong></td>
      <td>${s.sourceType}</td>
      <td style="color: var(--cyan-primary);">${s.chance}%</td>
    </tr>
  `).join('');

  elements.modalHeaderContent.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
      <h2 style="font-size: 1.4rem; color: #c084fc;">${escapeHtml(riv.zhName)}</h2>
      <span style="color: var(--text-muted); font-size: 1rem;">(${escapeHtml(riv.name)})</span>
    </div>
    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">
      分类: 未开紫卡 (Veiled Riven) · Market Slug: <code>${riv.slug}</code>
    </div>
  `;

  elements.modalBodyContent.innerHTML = `
    <div class="item-price-box">
      <div class="price-metric">
        <div class="metric-label">当前参考市场价格</div>
        <div class="metric-val" style="color: #c084fc;">${formatPlat(price)}</div>
      </div>
    </div>

    <h4 style="color: var(--text-primary); font-size: 1rem; margin: 1rem 0 0.5rem 0;">
      🎯 掉落来源 (${riv.dropSources.length} 处)
    </h4>
    <div style="overflow-x: auto;">
      <table class="rewards-table">
        <thead>
          <tr>
            <th>来源名称</th>
            <th>类型</th>
            <th>掉落概率</th>
          </tr>
        </thead>
        <tbody>
          ${sourcesRows || '<tr><td colspan="3" style="text-align: center;">暂无掉落来源</td></tr>'}
        </tbody>
      </table>
    </div>
  `;

  elements.detailModal.classList.add('active');
}

/**
 * 打开 Mod 弹窗
 */
export function openModModal(slug) {
  const mod = state.mods.find(m => m.slug === slug);
  if (!mod) return;

  window.location.hash = `mod=${encodeURIComponent(slug)}`;
  state.activeModal = { type: 'mod', id: slug };

  const p0 = getItemPrice(slug, 0, state.prices, state.currentPriceType);
  const pMax = getItemPrice(slug, mod.maxRank, state.prices, state.currentPriceType);

  const sourcesRows = mod.dropSources.slice(0, 50).map(s => {
    let compChance = `${s.chance}%`;
    if (s.enemyModDropChance) {
      const comp = ((s.enemyModDropChance / 100) * (s.chance / 100) * 100).toFixed(4);
      compChance = `${s.chance}% × ${s.enemyModDropChance}% = <strong>${comp}%</strong>`;
    }

    return `
      <tr>
        <td><strong>${escapeHtml(s.nameZh || s.nameEn)}</strong></td>
        <td>${s.sourceType}</td>
        <td>${s.rotation ? `轮次 ${s.rotation}` : '-'}</td>
        <td style="color: var(--cyan-primary);">${s.quantity > 1 ? `<span class="quantity-tag">×${s.quantity}</span> ` : ''}${compChance}</td>
      </tr>
    `;
  }).join('');

  elements.modalHeaderContent.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
      <h2 style="font-size: 1.4rem; color: #60a5fa;">${escapeHtml(mod.zhName)}</h2>
      <span style="color: var(--text-muted); font-size: 1rem;">(${escapeHtml(mod.name)})</span>
    </div>
    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">
      最高等级: Rank ${mod.maxRank} · Market Slug: <code>${mod.slug}</code>
    </div>
  `;

  elements.modalBodyContent.innerHTML = `
    <div class="item-price-box">
      <div class="price-metric">
        <div class="metric-label">0 级参考价格</div>
        <div class="metric-val">${formatPlat(p0)}</div>
      </div>
      <div class="price-metric">
        <div class="metric-label">满级 (Rank ${mod.maxRank}) 价格</div>
        <div class="metric-val" style="color: var(--gold-light);">${formatPlat(pMax)}</div>
      </div>
    </div>

    <h4 style="color: var(--text-primary); font-size: 1rem; margin: 1rem 0 0.5rem 0;">
      🎯 掉落来源 (${mod.dropSources.length} 处)
    </h4>
    <div style="overflow-x: auto; max-height: 400px;">
      <table class="rewards-table">
        <thead>
          <tr>
            <th>来源名称</th>
            <th>类型</th>
            <th>轮次</th>
            <th>掉落概率 (综合)</th>
          </tr>
        </thead>
        <tbody>
          ${sourcesRows}
        </tbody>
      </table>
    </div>
  `;

  elements.detailModal.classList.add('active');
}

/**
 * 打开刷取来源弹窗
 */
export function openSourceModal(sourceId) {
  const src = state.sources.find(s => s.id === sourceId);
  if (!src) return;

  window.location.hash = `source=${encodeURIComponent(sourceId)}`;
  state.activeModal = { type: 'source', id: sourceId };

  const isEnemy = src.type === 'enemy';
  const priceType = state.currentPriceType;
  const expData = isEnemy 
    ? calculateEnemyExpectedValue(src.enemyModDropChance, src.rewards, state.prices, { priceType })
    : calculateSourceExpectedValue(src.rewards, state.prices, { priceType });

  const rows = src.rewards.map(r => {
    const price = getItemPrice(r.slug, 0, state.prices, priceType);
    const q = r.quantity || 1;
    let contrib = '—';
    if (price !== null && typeof price === 'number') {
      if (isEnemy) {
        contrib = `${(((src.enemyModDropChance / 100) * (r.chance / 100) * q * price)).toFixed(4)} ☿`;
      } else {
        contrib = `${(((r.chance / 100) * q * price)).toFixed(4)} ☿`;
      }
    }

    return `
      <tr>
        <td>
          <strong>${r.quantity > 1 ? `<span class="quantity-tag">×${r.quantity}</span>` : ''}${escapeHtml(r.itemZh || r.itemName)}</strong>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(r.itemName)}</div>
        </td>
        <td><span class="rarity-pill rarity-${r.rarity}">${r.rarity}</span></td>
        <td>${r.chance}%</td>
        <td style="color: var(--plat-color);">${formatPlat(price)}</td>
        <td style="font-weight: 600; color: var(--gold-light);">${contrib}</td>
      </tr>
    `;
  }).join('');

  elements.modalHeaderContent.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
      <h2 style="font-size: 1.3rem; color: var(--gold-light);">${escapeHtml(src.nameZh || src.nameEn)}</h2>
      ${src.isPvp ? '<span class="badge badge-pvp">PvP</span>' : ''}
    </div>
    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">
      类型: ${src.type} · ${src.planetZh ? `星球: ${src.planetZh}` : ''} ${isEnemy ? `· Mod 基础掉率: ${src.enemyModDropChance}%` : ''}
    </div>
  `;

  elements.modalBodyContent.innerHTML = `
    <div class="expected-dashboard" style="margin-top: 0;">
      <div class="dashboard-header">
        <span class="dashboard-title">${isEnemy ? '每击杀期望白金' : '每次通关期望白金'}</span>
        <span class="expected-value-num">${expData.expectedValue !== null ? `${expData.expectedValue} ☿` : '—'}</span>
      </div>
      <div style="font-size: 0.8rem; color: var(--text-muted);">
        公式：${isEnemy ? `Mod掉率(${src.enemyModDropChance}%) × Σ(几率% × 数量 × 单价)` : `Σ(几率% × 数量 × 单价)`}。赋能与 Mod 按 0 级掉落价格计入。
      </div>
    </div>

    <h4 style="color: var(--text-primary); font-size: 1rem; margin: 1.25rem 0 0.5rem 0;">
      📋 奖励列表 (${src.rewards.length} 项)
    </h4>
    <div style="overflow-x: auto; max-height: 400px;">
      <table class="rewards-table">
        <thead>
          <tr>
            <th>物品名称</th>
            <th>稀有度</th>
            <th>单项掉率</th>
            <th>0级单价</th>
            <th>白金贡献期望</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;

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
 * 全局搜索输入与下拉候选
 */
function handleSearchInput(e) {
  const query = e.target.value.trim();
  elements.searchClearBtn.style.display = query ? 'block' : 'none';

  if (!query) {
    elements.searchDropdown.classList.remove('active');
    elements.searchDropdown.innerHTML = '';
    return;
  }

  const results = searchIndex(query, state.searchIndexData, { limit: 15 });
  if (results.length === 0) {
    elements.searchDropdown.innerHTML = `
      <div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
        未找到匹配结果
      </div>
    `;
    elements.searchDropdown.classList.add('active');
    return;
  }

  const tagMap = {
    relic: { text: '遗物', cls: 'tag-relic' },
    item: { text: '遗物物品', cls: 'tag-item' },
    arcane: { text: '赋能', cls: 'tag-arcane' },
    mod: { text: 'Mod', cls: 'tag-mod' },
    riven: { text: '紫卡', cls: 'tag-riven' },
    source: { text: '来源', cls: 'tag-source' }
  };

  elements.searchDropdown.innerHTML = results.map(item => {
    const metaTag = tagMap[item.type] || { text: '条目', cls: 'tag-item' };
    return `
      <div class="search-item-candidate" data-type="${item.type}" data-id="${item.id}">
        <div class="candidate-info">
          <span class="candidate-title">${escapeHtml(item.zhName || item.name)}</span>
          <span class="candidate-sub">${escapeHtml(item.name)}</span>
        </div>
        <span class="candidate-tag ${metaTag.cls}">${metaTag.text}</span>
      </div>
    `;
  }).join('');

  elements.searchDropdown.classList.add('active');

  elements.searchDropdown.querySelectorAll('.search-item-candidate').forEach(cand => {
    cand.addEventListener('click', () => {
      const type = cand.getAttribute('data-type');
      const id = cand.getAttribute('data-id');
      elements.searchDropdown.classList.remove('active');
      elements.searchInput.value = '';
      elements.searchClearBtn.style.display = 'none';

      if (type === 'relic') openRelicModal(id);
      else if (type === 'arcane') openArcaneModal(id);
      else if (type === 'riven') openRivenModal(id);
      else if (type === 'mod') openModModal(id);
      else if (type === 'source') openSourceModal(id);
      else openItemModal(id);
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
  const view = params.get('view');
  if (view) switchView(view);

  const relicId = params.get('relic');
  const itemId = params.get('item');
  const arcaneId = params.get('arcane');
  const rivenId = params.get('riven');
  const modId = params.get('mod');
  const sourceId = params.get('source');

  if (relicId) openRelicModal(relicId);
  else if (itemId) openItemModal(itemId);
  else if (arcaneId) openArcaneModal(arcaneId);
  else if (rivenId) openRivenModal(rivenId);
  else if (modId) openModModal(modId);
  else if (sourceId) openSourceModal(sourceId);
}

/**
 * 设置各类事件监听
 */
function setupEventListeners() {
  // 顶部分类导航切换
  elements.mainNav.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchView(btn.getAttribute('data-view'));
    });
  });

  // 遗物模式切换
  elements.modeTabs.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      elements.modeTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentMode = btn.getAttribute('data-mode');
      renderCurrentView();
    });
  });

  // A3: 特殊来源安魂遗物开关
  elements.unlistedToggle.addEventListener('change', (e) => {
    state.includeUnlisted = e.target.checked;
    renderCurrentView();
  });

  // 来源奖励分类切换
  elements.sourceCatTabs.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      elements.sourceCatTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentSourceCat = btn.getAttribute('data-scat');
      renderCurrentView();
    });
  });

  // 遗物纪元筛选
  elements.tierFilters.querySelectorAll('.tier-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      elements.tierFilters.querySelectorAll('.tier-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentTier = btn.getAttribute('data-tier');
      renderCurrentView();
    });
  });

  // 来源类型筛选
  elements.sourceTypeFilters.querySelectorAll('.tier-btn[data-stype]').forEach(btn => {
    btn.addEventListener('click', () => {
      elements.sourceTypeFilters.querySelectorAll('.tier-btn[data-stype]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentSourceType = btn.getAttribute('data-stype');
      renderCurrentView();
    });
  });

  // PvP 切换按钮 (点击只看 PvP 来源，再点回到非 PvP 视图)
  if (elements.pvpFilterBtn) {
    elements.pvpFilterBtn.addEventListener('click', () => {
      state.sourcePvpOnly = !state.sourcePvpOnly;
      elements.pvpFilterBtn.classList.toggle('active', state.sourcePvpOnly);
      elements.pvpFilterBtn.classList.toggle('pvp-active', state.sourcePvpOnly);
      renderCurrentView();
    });
  }

  // Mod 稀有度筛选
  elements.modRarityFilters.querySelectorAll('.tier-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      elements.modRarityFilters.querySelectorAll('.tier-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentModRarity = btn.getAttribute('data-mrarity');
      renderCurrentView();
    });
  });

  // 排序下拉
  elements.sortSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    if (state.activeView === 'relics') state.currentRelicSort = val;
    else if (state.activeView === 'arcanes') state.currentArcaneSort = val;
    else if (state.activeView === 'mods') state.currentModSort = val;
    else if (state.activeView === 'sources') state.currentSourceSort = val;
    renderCurrentView();
  });

  // 价格基准切换 (最低卖价 / 最高收购价)
  elements.priceModeToggle.addEventListener('change', (e) => {
    state.currentPriceType = e.target.checked ? 'buyMax' : 'sellMin';
    elements.priceModeLabel.textContent = e.target.checked ? '价格基准: 最高收购价' : '价格基准: 最低卖价';
    renderCurrentView();
    if (state.activeModal) {
      const { type, id } = state.activeModal;
      if (type === 'relic') openRelicModal(id);
      else if (type === 'arcane') openArcaneModal(id);
      else if (type === 'riven') openRivenModal(id);
      else if (type === 'mod') openModModal(id);
      else if (type === 'source') openSourceModal(id);
    }
  });

  // 搜索事件
  elements.searchInput.addEventListener('input', handleSearchInput);
  elements.searchClearBtn.addEventListener('click', () => {
    elements.searchInput.value = '';
    elements.searchClearBtn.style.display = 'none';
    elements.searchDropdown.classList.remove('active');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
      elements.searchDropdown.classList.remove('active');
    }
  });

  // 弹窗关闭事件
  elements.modalCloseBtn.addEventListener('click', closeModal);
  elements.detailModal.addEventListener('click', (e) => {
    if (e.target === elements.detailModal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (elements.searchDropdown.classList.contains('active')) {
        elements.searchDropdown.classList.remove('active');
      } else if (elements.detailModal.classList.contains('active')) {
        closeModal();
      }
    }
  });

  window.addEventListener('popstate', handleHashRouting);
}

/**
 * HTML 转义
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

document.addEventListener('DOMContentLoaded', init);
