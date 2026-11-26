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
  getItemPrice,
  getPriceEntry,
  arcaneCopiesForRank,
  isUntradeableItem,
  arbitrationFirst8,
  arbitrationFirst8PricedPortion,
  formatPriceDisplay
} from './lib/calculations.js';
import { searchIndex } from './lib/search.js';
import { filterSources, toggleHistoricalFilter, togglePvpFilter } from './lib/sources.js';

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
  sourceHistoricalOnly: false,
  
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
  sourceHistoricalCallout: document.getElementById('source-historical-callout'),
  sourceHistoricalCalloutText: document.getElementById('source-historical-callout-text'),
  historicalFilterBtn: document.getElementById('historical-filter-btn'),
  
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
 * 格式化白金价格展示（无价格显示“暂无挂单”，倒挂隔离显示警告）
 */
function formatPlat(price, suffix = ' ☿', priceEntry = null) {
  return formatPriceDisplay(price, priceEntry, suffix);
}

/**
 * 格式化来源类型展示
 */
export function formatSourceType(type, isPvp = false) {
  if (isPvp) return 'PvP';
  switch (type) {
    case 'mission': return '星图任务';
    case 'enemy': return '敌人击杀';
    case 'bounty': return '平原赏金';
    case 'transient': return '特殊来源';
    case 'sortie': return '突击任务';
    default: return type || '未知';
  }
}

/**
 * 格式化稀有度展示
 */
export function formatRarity(rarity) {
  switch (rarity) {
    case 'Common': return '常见';
    case 'Uncommon': return '罕见';
    case 'Rare': return '稀有';
    case 'Legendary': return '传说';
    default: return rarity || '未知';
  }
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

  // 4. 排序 (使用 Raw 未取整值)
  list.sort((a, b) => {
    const valA = a._expValues;
    const valB = b._expValues;
    if (state.currentRelicSort === 'name_asc') {
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    }
    const key = state.currentRelicSort.replace('_desc', '');
    const aNum = valA[key]?.expectedValueRaw ?? valA[key]?.expectedValue ?? -1;
    const bNum = valB[key]?.expectedValueRaw ?? valB[key]?.expectedValue ?? -1;
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
    if (r.dataConflict) {
      badgeHtml = `<span class="badge" style="background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3);" title="${escapeHtml(r.dataConflictNote || '')}">⚠️ 资料冲突</span>`;
    } else if (r.unlisted) {
      badgeHtml = `<span class="badge badge-unlisted" title="${r.statusReason || ''}">特殊来源</span>`;
    } else if (r.conflict) {
      badgeHtml = `<span class="badge badge-conflict" title="${r.conflictNote || ''}">⚠️ 存疑</span>`;
    } else if (!r.vaulted) {
      badgeHtml = `<span class="badge badge-obtainable">可获取</span>`;
    } else {
      badgeHtml = `<span class="badge badge-vaulted">已入库</span>`;
    }

    const radData = r._expValues.radiant;
    const intData = r._expValues.intact;
    const expRadStr = radData?.unsupportedRefinement ? '不适用' : (radData?.expectedValue !== null ? `${radData.expectedValue} ☿` : '—');
    const expIntStr = intData?.unsupportedRefinement ? '不适用' : (intData?.expectedValue !== null ? `${intData.expectedValue} ☿` : '—');

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
          <span class="plat-label">单人单次开启期望 (光辉 / 完整):</span>
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
    const entry0 = getPriceEntry(arc.slug, 0, state.prices);
    const entryMax = getPriceEntry(arc.slug, arc.maxRank, state.prices);
    const price0 = getItemPrice(arc.slug, 0, state.prices, priceType);
    const priceMax = getItemPrice(arc.slug, arc.maxRank, state.prices, priceType);
    const N = arcaneCopiesForRank(arc.maxRank);
    const pMaxSell = getItemPrice(arc.slug, arc.maxRank, state.prices, 'sellMin');
    const pMaxBuy = getItemPrice(arc.slug, arc.maxRank, state.prices, 'buyMax');
    const perR0Sell = (N !== null && pMaxSell !== null) ? Number((pMaxSell / N).toFixed(2)) : null;
    const perR0Buy = (N !== null && pMaxBuy !== null) ? Number((pMaxBuy / N).toFixed(2)) : null;

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
            <span class="plat-badge" style="font-size: 0.95rem;">${formatPriceDisplay(price0, entry0)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; width: 100%;">
            <span class="plat-label">满级 (Rank ${arc.maxRank}) 价格:</span>
            <span class="plat-badge" style="font-size: 0.95rem; color: var(--gold-light);">${formatPriceDisplay(priceMax, entryMax)}</span>
          </div>
          <div style="font-size: 0.75rem; color: var(--cyan-primary); margin-top: 0.2rem; width: 100%;">
            满级折合每个 0 级 ≈ ${perR0Sell !== null ? `${perR0Sell} ☿` : '—'}（卖）/ ${perR0Buy !== null ? `${perR0Buy} ☿` : '—'}（买）
          </div>
          <div style="font-size: 0.7rem; color: var(--text-muted);">
            与直接卖 0 级是两种策略，未计凑齐成本与价差
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
    const rivenEntry = getPriceEntry(riv.slug, null, state.prices);
    const price = rivenEntry ? rivenEntry[priceType] : null;
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
          <span class="plat-badge">${formatPriceDisplay(price, rivenEntry)}</span>
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
    const entry0 = getPriceEntry(m.slug, 0, state.prices);
    const entryMax = getPriceEntry(m.slug, m.maxRank, state.prices);
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
            <span class="plat-badge" style="font-size: 0.95rem;">${formatPriceDisplay(p0, entry0)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; width: 100%;">
            <span class="plat-label">满级 (Rank ${m.maxRank}) 价格:</span>
            <span class="plat-badge" style="font-size: 0.95rem; color: var(--gold-light);">${formatPriceDisplay(pMax, entryMax)}</span>
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

  // 使用纯函数统一进行类型、奖励分类以及 PvP/历史活动模式过滤
  let list = filterSources(state.sources, {
    type: state.currentSourceType,
    category: state.currentSourceCat,
    pvpOnly: state.sourcePvpOnly,
    historicalOnly: state.sourceHistoricalOnly
  });

  // 更新 PvP 提示横幅
  if (elements.sourcePvpCallout && elements.sourcePvpCalloutText) {
    if (state.sourcePvpOnly) {
      elements.sourcePvpCalloutText.innerHTML = '⚔️ <strong>提示：</strong>当前仅显示 PvP（武形秘仪 / Conclave）来源，可再次点击「PvP」按钮返回常规掉落。';
      elements.sourcePvpCallout.classList.add('pvp-active-banner');
      elements.sourcePvpCallout.style.display = 'block';
    } else {
      elements.sourcePvpCalloutText.innerHTML = '💡 <strong>提示：</strong>当前页面不包含 PvP 来源，可点击「PvP」按钮查看。';
      elements.sourcePvpCallout.classList.remove('pvp-active-banner');
    }
  }

  // 更新历史活动提示横幅 (Decision 8)
  if (elements.sourceHistoricalCallout && elements.sourceHistoricalCalloutText) {
    if (state.sourceHistoricalOnly) {
      elements.sourceHistoricalCalloutText.innerHTML = '📜 <strong>历史活动；当前开放状态未确认</strong><br>官方公告信息：<a href="https://www.warframe.com/en/news/rappel-ten-zero" target="_blank" rel="noopener" style="color: var(--cyan-primary); text-decoration: underline;">Recall: Ten-Zero 官方公告</a>（原文：“The next phase of our 10-Year Anniversary begins July 19 with Recall: Ten-Zero!”、“leading up to TennoCon 2023 on August 26”、“only the third Mission in each weekly sequence will grant a new Reward”）。';
      elements.sourceHistoricalCallout.style.display = 'block';
      if (elements.historicalFilterBtn) elements.historicalFilterBtn.classList.add('active');
    } else {
      elements.sourceHistoricalCallout.style.display = 'none';
      if (elements.historicalFilterBtn) elements.historicalFilterBtn.classList.remove('active');
    }
  }

  // 3. 计算期望白金 (同时计算卖单与买单，分开展示)
  list.forEach(src => {
    if (src.type === 'enemy') {
      src._expSell = calculateEnemyExpectedValue(src.enemyModDropChance, src.rewards, state.prices, { priceType: 'sellMin' });
      src._expBuy = calculateEnemyExpectedValue(src.enemyModDropChance, src.rewards, state.prices, { priceType: 'buyMax' });
    } else {
      src._expSell = calculateSourceExpectedValue(src.rewards, state.prices, { priceType: 'sellMin' });
      src._expBuy = calculateSourceExpectedValue(src.rewards, state.prices, { priceType: 'buyMax' });
    }
  });

  // 4. 排序 (默认推荐使用 confident 未取整值，若无则使用 Raw 值；受污染来源退出收益排序)
  list.sort((a, b) => {
    if (a.contaminated && !b.contaminated) return 1;
    if (!a.contaminated && b.contaminated) return -1;

    const curA = state.currentPriceType === 'buyMax' ? a._expBuy : a._expSell;
    const curB = state.currentPriceType === 'buyMax' ? b._expBuy : b._expSell;
    const expA = curA?.expectedValueConfidentRaw ?? curA?.expectedValueRaw ?? -1;
    const expB = curB?.expectedValueConfidentRaw ?? curB?.expectedValueRaw ?? -1;
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
    const typeLabel = formatSourceType(src.type, src.isPvp);
    const badgeClass = src.isPvp ? 'badge-pvp' : '';
    const badgeStyle = src.isPvp ? '' : 'background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);';

    const sellExpVal = src._expSell.expectedValue;
    const sellExpStr = sellExpVal !== null ? `${sellExpVal} ☿` : '—';
    const sellConfVal = src._expSell.expectedValueConfident;
    const hasSellLowConf = src._expSell.lowConfidenceCount > 0;

    const buyExpVal = src._expBuy.expectedValue;
    const buyExpStr = buyExpVal !== null ? `${buyExpVal} ☿` : '—';
    const buyConfVal = src._expBuy.expectedValueConfident;
    const hasBuyLowConf = src._expBuy.lowConfidenceCount > 0;

    let subNote;
    if (isEnemy) {
      subNote = `Mod 掉率: ${src.enemyModDropChance}% · 每击杀期望`;
    } else if (src.type === 'bounty') {
      subNote = '单阶段单次发奖期望';
    } else if (src.rotation) {
      subNote = `单轮次单次发奖期望（抽一次 ${src.rotation} 轮奖励表）`;
    } else {
      subNote = '单次发奖期望';
    }

    let probBadge = '';
    if (src.contaminated) {
      probBadge = `<span class="badge" style="background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); font-size: 0.72rem;">⚠️ 数据污染（已退出收益排序）</span>`;
    } else if (src.roundingCompatible) {
      probBadge = `<span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); font-size: 0.72rem;" title="${escapeHtml(src.roundingNote || '')}">概率和 ${src.probabilitySum}%（舍入兼容）</span>`;
    } else if (src.probabilityCheck === 'over' || src.probabilityCheck === 'under') {
      probBadge = `<span class="badge" style="background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); font-size: 0.72rem;">概率和 ${src.probabilitySum}%（待核对）</span>`;
    }

    let incompleteBadge = '';
    const curExp = state.currentPriceType === 'buyMax' ? src._expBuy : src._expSell;
    if (curExp?.incomplete) {
      incompleteBadge = `<span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); font-size: 0.72rem;" title="存在缺价或低置信报价">「不完整估值」已计价概率 ${curExp.pricedProbability}%</span>`;
    }

    let lowConfBadge = '';
    if (hasSellLowConf) {
      lowConfBadge = `<span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); font-size: 0.72rem;" title="包含有效去重卖家不足 3 人的低置信挂单（warframe.market /top 接口每侧最多返回 5 条在线订单，仅为样本，不代表全市场卖家数）">「低置信」含 ${src._expSell.lowConfidenceCount} 项</span>`;
    }

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

        <div class="card-expected-value" style="flex-direction: column; align-items: flex-start; gap: 0.35rem;">
          <div style="font-size: 0.75rem; color: var(--text-muted);">${subNote}</div>
          <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
            <span class="plat-label">卖单参考收益:</span>
            <span class="plat-badge" style="font-size: 0.95rem;">
              ${sellExpStr}
              ${hasSellLowConf && sellConfVal !== null ? `<span style="font-size: 0.75rem; color: var(--cyan-primary); margin-left: 0.3rem;" title="排除稀疏卖单后的高置信值">(高置信: ${sellConfVal} ☿)</span>` : ''}
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
            <span class="plat-label">买单即时变现:</span>
            <span class="plat-badge" style="font-size: 0.9rem; color: var(--text-secondary);">${buyExpStr}</span>
          </div>
        </div>
        ${probBadge || incompleteBadge || lowConfBadge ? `<div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.4rem;">${probBadge}${incompleteBadge}${lowConfBadge}</div>` : ''}

        <div class="rewards-preview">
          ${src.rewards.slice(0, 3).map(r => `
            <div class="reward-preview-item">
              <span class="reward-name" title="${escapeHtml(r.itemZh || r.itemName)}">• ${escapeHtml(r.itemZh || r.itemName)}</span>
              <span style="color: var(--cyan-primary);">${r.chance !== null && r.chance !== undefined ? `${r.chance}%` : '-'}</span>
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
  if (relic.dataConflict) {
    badgeHtml = `<span class="badge" style="background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3);" title="${escapeHtml(relic.dataConflictNote || '')}">⚠️ 资料冲突</span>`;
  } else if (relic.unlisted) {
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
  if (relic.id === 'requiem_eterna' || relic.chanceOverride) {
    const override = relic.chanceOverride || {};
    alertBanner = `
      <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 6px; padding: 0.75rem 1rem; margin-bottom: 1rem; font-size: 0.85rem; color: #f87171;">
        <div style="margin-bottom: 0.35rem;"><strong>官方原文：</strong>"${escapeHtml(override.quote || "This Relic’s droptable only contains the 8 Requiem Mods (with equal chance for all), and cannot be refined with Void Traces.")}"（出处：<a href="${override.url || 'https://www.warframe.com/en/patch-notes/pc/42-0-0'}" target="_blank" style="color: var(--cyan-primary);">DE Update 42 更新说明</a>）</div>
        <div><strong>本站推导：</strong>${escapeHtml(override.derivation || '仅 8 项且等概率 ⇒ 每项 1/8 = 12.5%（推导，原文未直接写 12.5%）')}（DE 官方掉落表仍列 8 项各 9.50% 合计 76%，本站有效期望按 12.5% 计算）</div>
      </div>
    `;
  } else if (relic.dataConflict) {
    alertBanner = `
      <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 6px; padding: 0.75rem 1rem; margin-bottom: 1rem; font-size: 0.85rem; color: #f87171;">
        <strong>资料冲突：</strong>${escapeHtml(relic.dataConflictNote || 'DE 掉落表与更新说明冲突')}。<br>
        <span style="font-size: 0.8rem; color: var(--text-muted);">参考来源：<a href="https://www.warframe.com/droptables" target="_blank" style="color: var(--cyan-primary);">DE 官方掉落表</a>、<a href="https://www.warframe.com/en/patch-notes/pc/42-0-0" target="_blank" style="color: var(--cyan-primary);">DE Update 42 更新说明</a>。</span>
      </div>
    `;
  } else if (relic.unlisted) {
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
    const isUntrad = isUntradeableItem(rew);
    const priceEntry = slug ? getPriceEntry(slug, null, state.prices) : null;
    let priceCellHtml;
    if (isUntrad) {
      priceCellHtml = '<span style="color: var(--text-muted);">不可交易 (0 ☿)</span>';
    } else if (priceEntry?.crossedMarket) {
      priceCellHtml = formatPriceDisplay(null, priceEntry);
    } else {
      const sellPrice = priceEntry?.sellMin !== null && priceEntry?.sellMin !== undefined ? `${priceEntry.sellMin} ☿` : '<span style="color: var(--text-muted); font-size: 0.85em;">暂无挂单</span>';
      const buyPrice = priceEntry?.buyMax !== null && priceEntry?.buyMax !== undefined ? `${priceEntry.buyMax} ☿` : '<span style="color: var(--text-muted); font-size: 0.85em;">暂无挂单</span>';
      priceCellHtml = `${sellPrice} / <span style="font-size: 0.85rem; color: var(--text-muted);">${buyPrice}</span>`;
    }

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
          ${priceCellHtml}
        </td>
        <td>${rew.chances.intact !== null ? `${rew.chances.intact}%` : '不适用'}</td>
        <td>${rew.chances.exceptional !== null ? `${rew.chances.exceptional}%` : '不适用'}</td>
        <td>${rew.chances.flawless !== null ? `${rew.chances.flawless}%` : '不适用'}</td>
        <td style="font-weight: 600; color: var(--cyan-primary);">${rew.chances.radiant !== null ? `${rew.chances.radiant}%` : '不适用'}</td>
      </tr>
    `;
  }).join('');

  const formatExp = (expObj) => {
    if (!expObj) return '—';
    if (expObj.unsupportedRefinement) return '不适用';
    return expObj.expectedValue !== null ? `${expObj.expectedValue} ☿` : '—';
  };
  const missingIntact = expValues.intact.missingCount;
  const missingWarning = expValues.intact.incomplete 
    ? `<div class="dashboard-note warning-text">⚠️ 「不完整估值」遗物中有 ${missingIntact} 个可交易奖励暂无市场挂单，已计价概率合计 ${expValues.intact.pricedProbability}%。</div>`
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
        <span class="dashboard-title">四个精炼等级单人单次开启期望 (Σ 掉率 × 价格)</span>
        <span style="font-size: 0.85rem; color: var(--text-secondary);">
          当前基准：<strong style="color: var(--cyan-primary);">${priceType === 'sellMin' ? '最低卖价' : '最高收购价'}</strong>
        </span>
      </div>

      <div class="dashboard-grid">
        <div class="expected-card">
          <div class="expected-level">完整 (Intact)</div>
          <div class="expected-value-num">${formatExp(expValues.intact)}</div>
        </div>
        <div class="expected-card">
          <div class="expected-level">优良 (Exceptional)</div>
          <div class="expected-value-num">${formatExp(expValues.exceptional)}</div>
        </div>
        <div class="expected-card">
          <div class="expected-level">无暇 (Flawless)</div>
          <div class="expected-value-num">${formatExp(expValues.flawless)}</div>
        </div>
        <div class="expected-card highlight">
          <div class="expected-level">光辉 (Radiant) ★</div>
          <div class="expected-value-num">${formatExp(expValues.radiant)}</div>
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

  const priceEntry = item.marketSlug ? getPriceEntry(item.marketSlug, null, state.prices) : null;
  const sellMin = formatPriceDisplay(priceEntry?.sellMin, priceEntry);
  const buyMax = formatPriceDisplay(priceEntry?.buyMax, priceEntry);

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
      <td>${r.quantity > 1 ? `<span class="quantity-tag">×${r.quantity}</span>` : ''}${formatRarity(r.rarity)}</td>
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

  const entry0 = getPriceEntry(slug, 0, state.prices);
  const entryMax = getPriceEntry(slug, arc.maxRank, state.prices);
  const p0 = getItemPrice(slug, 0, state.prices, state.currentPriceType);
  const pMax = getItemPrice(slug, arc.maxRank, state.prices, state.currentPriceType);
  const N = arcaneCopiesForRank(arc.maxRank);
  const pMaxSell = getItemPrice(slug, arc.maxRank, state.prices, 'sellMin');
  const pMaxBuy = getItemPrice(slug, arc.maxRank, state.prices, 'buyMax');
  const perR0Sell = (N !== null && pMaxSell !== null) ? Number((pMaxSell / N).toFixed(2)) : null;
  const perR0Buy = (N !== null && pMaxBuy !== null) ? Number((pMaxBuy / N).toFixed(2)) : null;

  const sourcesRows = arc.dropSources.map(s => {
    let compChance = `${s.chance}%`;
    if (s.enemyModDropChance) {
      const comp = ((s.enemyModDropChance / 100) * (s.chance / 100) * 100).toFixed(4);
      compChance = `${s.chance}% × ${s.enemyModDropChance}% = <strong>${comp}%</strong>`;
    }

    return `
      <tr>
        <td><strong>${escapeHtml(s.nameZh || s.nameEn)}</strong></td>
        <td>${formatSourceType(s.sourceType)}</td>
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
        <div class="metric-val">${formatPriceDisplay(p0, entry0)}</div>
      </div>
      <div class="price-metric">
        <div class="metric-label">满级 (Rank ${arc.maxRank}) 价格</div>
        <div class="metric-val" style="color: var(--gold-light);">${formatPriceDisplay(pMax, entryMax)}</div>
      </div>
    </div>
    <div style="background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 6px; padding: 0.6rem 0.8rem; margin-top: 0.75rem; font-size: 0.82rem; color: var(--cyan-primary);">
      <strong>满级折合每个 0 级：</strong>≈ ${perR0Sell !== null ? `${perR0Sell} ☿` : '—'}（卖）/ ${perR0Buy !== null ? `${perR0Buy} ☿` : '—'}（买）
      <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">与直接卖 0 级是两种策略，未计凑齐成本与价差。</div>
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

  const rivenEntry = getPriceEntry(slug, null, state.prices);
  const price = rivenEntry ? rivenEntry[state.currentPriceType] : null;

  const sourcesRows = riv.dropSources.map(s => `
    <tr>
      <td><strong>${escapeHtml(s.nameZh || s.nameEn)}</strong></td>
      <td>${formatSourceType(s.sourceType)}</td>
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
        <div class="metric-val" style="color: #c084fc;">${formatPriceDisplay(price, rivenEntry)}</div>
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

  const entry0 = getPriceEntry(slug, 0, state.prices);
  const entryMax = getPriceEntry(slug, mod.maxRank, state.prices);
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
        <td>${formatSourceType(s.sourceType)}</td>
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
        <div class="metric-val">${formatPriceDisplay(p0, entry0)}</div>
      </div>
      <div class="price-metric">
        <div class="metric-label">满级 (Rank ${mod.maxRank}) 价格</div>
        <div class="metric-val" style="color: var(--gold-light);">${formatPriceDisplay(pMax, entryMax)}</div>
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
  const expSell = isEnemy 
    ? calculateEnemyExpectedValue(src.enemyModDropChance, src.rewards, state.prices, { priceType: 'sellMin' })
    : calculateSourceExpectedValue(src.rewards, state.prices, { priceType: 'sellMin' });
  const expBuy = isEnemy 
    ? calculateEnemyExpectedValue(src.enemyModDropChance, src.rewards, state.prices, { priceType: 'buyMax' })
    : calculateSourceExpectedValue(src.rewards, state.prices, { priceType: 'buyMax' });
  const expData = priceType === 'buyMax' ? expBuy : expSell;

  const rows = src.rewards.map(r => {
    const isUntrad = isUntradeableItem(r);
    const priceEntry = r.slug ? getPriceEntry(r.slug, 0, state.prices) : null;
    const price = isUntrad ? 0 : getItemPrice(r.slug, 0, state.prices, priceType);
    const q = r.quantity || 1;
    let contrib = '—';
    const isUnknownChance = r.chance === null || r.chance === undefined || !Number.isFinite(Number(r.chance));
    if (!isUnknownChance) {
      if (isUntrad) {
        contrib = '0.0000 ☿';
      } else if (price !== null && typeof price === 'number') {
        if (isEnemy) {
          contrib = `${(((src.enemyModDropChance / 100) * (r.chance / 100) * q * price)).toFixed(4)} ☿`;
        } else {
          contrib = `${(((r.chance / 100) * q * price)).toFixed(4)} ☿`;
        }
      }
    }

    let priceDisplay;
    if (isUntrad) {
      priceDisplay = '<span style="color: var(--text-muted);">不可交易 (0 ☿)</span>';
    } else {
      priceDisplay = formatPriceDisplay(price, priceEntry);
    }

    return `
      <tr>
        <td>
          <strong>${r.quantity > 1 ? `<span class="quantity-tag">×${r.quantity}</span>` : ''}${escapeHtml(r.itemZh || r.itemName)}</strong>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(r.itemName)}</div>
        </td>
        <td><span class="rarity-pill rarity-${r.rarity}">${formatRarity(r.rarity)}</span></td>
        <td>${!isUnknownChance ? `${r.chance}%` : '- (未知)'}</td>
        <td style="color: var(--plat-color);">${priceDisplay}</td>
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
      类型: ${formatSourceType(src.type, src.isPvp)} · ${src.planetZh ? `星球: ${src.planetZh}` : ''} ${isEnemy ? `· Mod 基础掉率: ${src.enemyModDropChance}%` : ''}
    </div>
  `;

  let modalTitle;
  if (isEnemy) {
    modalTitle = '每击杀期望';
  } else if (src.type === 'bounty') {
    modalTitle = '单阶段单次发奖期望';
  } else if (src.rotation) {
    modalTitle = `单轮次单次发奖期望（抽一次 ${src.rotation} 轮奖励表）`;
  } else {
    modalTitle = '单次发奖期望';
  }

  let probNotice = '';
  if (src.contaminated) {
    probNotice = `<div style="margin-top: 0.35rem; color: #f87171; font-size: 0.8rem;">⚠️ <strong>数据污染：</strong>上游数据存在异常或校验失败，该来源已强制退出收益排序，期望值记 null。</div>`;
  } else if (src.roundingCompatible) {
    probNotice = `<div style="margin-top: 0.25rem; color: #60a5fa; font-size: 0.8rem;">💡 <strong>舍入兼容说明：</strong>${escapeHtml(src.roundingNote || '')}</div>`;
  } else if (src.probabilityCheck === 'over' || src.probabilityCheck === 'under') {
    probNotice = `<div style="margin-top: 0.35rem; color: #f87171; font-size: 0.8rem;">⚠️ 概率和 ${src.probabilitySum}%（待核对）</div>`;
  }

  const boundaryFixNotice = src.boundaryFix
    ? `<div style="margin-top: 0.25rem; color: var(--cyan-primary); font-size: 0.8rem;">ℹ️ <strong>表头边界修正：</strong>依据 ${escapeHtml(src.boundaryFix.source)} 表头 "${escapeHtml(src.boundaryFix.header)}" 校验，已从原始 ${src.boundaryFix.originalCount} 项中截取所属 ${src.boundaryFix.keptCount} 项。</div>`
    : '';

  const incompleteNotice = (expSell.incomplete || expBuy.incomplete)
    ? `<div style="margin-top: 0.35rem; color: #fbbf24; font-size: 0.8rem;">⚠️ <strong>完整性提示：</strong>卖侧已计价 ${expSell.pricedProbability}%${expSell.incomplete ? ' (不完整)' : ' (完整)'} · 买侧已计价 ${expBuy.pricedProbability}%${expBuy.incomplete ? ' (不完整)' : ' (完整)'}</div>`
    : '';

  const rotationPatternNotice = src.rotationPattern
    ? `<div style="margin-top: 0.25rem; color: var(--gold-light);">💡 轮次规律：${escapeHtml(src.rotationPattern)}</div>`
    : '';

  const dedupeNotice = src.dedupeNote
    ? `<div style="margin-top: 0.25rem; color: var(--cyan-primary);">ℹ️ 去重说明：${escapeHtml(src.dedupeNote)}</div>`
    : '';

  const historicalNotice = src.historicalEvent
    ? `<div style="background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-radius: 6px; padding: 0.75rem 1rem; margin-bottom: 1rem;">
        <div style="font-weight: 600; color: #facc15; font-size: 0.95rem; margin-bottom: 0.3rem;">📜 历史活动；当前开放状态未确认</div>
        <div style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.4;">
          官方公告信息：<a href="${escapeHtml(src.officialNoticeUrl || 'https://www.warframe.com/en/news/rappel-ten-zero')}" target="_blank" rel="noopener" style="color: var(--cyan-primary); text-decoration: underline;">Recall: Ten-Zero 官方公告</a><br>
          原文：“The next phase of our 10-Year Anniversary begins July 19 with Recall: Ten-Zero!”、“leading up to TennoCon 2023 on August 26”、“only the third Mission in each weekly sequence will grant a new Reward”
        </div>
      </div>`
    : '';

  // 仲裁前八轮已计价部分平均 (Codex Decision 9)
  let arbitrationBanner = '';
  if (src.id.includes('arbitrations_') || (src.nameEn && src.nameEn.startsWith('Arbitrations'))) {
    const arbA = state.sources.find(s => s.id === 'source_transient_arbitrations_a');
    const arbB = state.sources.find(s => s.id === 'source_transient_arbitrations_b');
    const arbC = state.sources.find(s => s.id === 'source_transient_arbitrations_c');
    if (arbA && arbB && arbC) {
      const eASell = calculateSourceExpectedValue(arbA.rewards, state.prices, { priceType: 'sellMin' });
      const eBSell = calculateSourceExpectedValue(arbB.rewards, state.prices, { priceType: 'sellMin' });
      const eCSell = calculateSourceExpectedValue(arbC.rewards, state.prices, { priceType: 'sellMin' });

      const eABuy = calculateSourceExpectedValue(arbA.rewards, state.prices, { priceType: 'buyMax' });
      const eBBuy = calculateSourceExpectedValue(arbB.rewards, state.prices, { priceType: 'buyMax' });
      const eCBuy = calculateSourceExpectedValue(arbC.rewards, state.prices, { priceType: 'buyMax' });

      const portionSell = arbitrationFirst8PricedPortion(eASell, eBSell, eCSell);
      const portionBuy = arbitrationFirst8PricedPortion(eABuy, eBBuy, eCBuy);

      if (portionSell.structuralDataInsufficient || portionBuy.structuralDataInsufficient) {
        arbitrationBanner = `
          <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 6px; padding: 0.75rem 1rem; margin-bottom: 1rem;">
            <div style="font-weight: 600; color: #f87171; font-size: 0.95rem;">⚖️ 仲裁前八轮已计价部分平均（发奖序列 AABBCCCC…）</div>
            <div style="font-size: 0.8rem; color: #fca5a5; margin-top: 0.25rem;">⚠️ 结构数据不足（某轮表缺失、数据受污染或掉落概率未知），停止显示有效平均。</div>
          </div>
        `;
      } else {
        const sellAvgText = portionSell.knownContribution !== null ? `${portionSell.knownContribution.toFixed(2)} ☿` : '—';
        const buyAvgText = portionBuy.knownContribution !== null ? `${portionBuy.knownContribution.toFixed(2)} ☿` : '—';
        const sellConfText = portionSell.knownConfidentContribution !== null && portionSell.knownConfidentContribution !== portionSell.knownContribution
          ? `<span style="font-size: 0.8rem; color: var(--cyan-primary);">(高置信: ${portionSell.knownConfidentContribution.toFixed(2)} ☿)</span>`
          : '';

        arbitrationBanner = `
          <div style="background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 6px; padding: 0.75rem 1rem; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap;">
              <span style="font-weight: 600; color: #c084fc; font-size: 0.95rem;">⚖️ 仲裁前八轮已计价部分平均（发奖序列 AABBCCCC…）</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.75rem; margin-bottom: 0.5rem;">
              <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 4px; padding: 0.4rem 0.6rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 0.8rem; color: #34d399; font-weight: 600;">卖单已计价平均: <strong>${sellAvgText}</strong> ${sellConfText}</span>
                  ${portionSell.incomplete ? '<span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); font-size: 0.7rem;">不完整</span>' : '<span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 0.7rem;">完整</span>'}
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
                  已计价 ${portionSell.pricedProbability}% · 缺价 ${portionSell.missingProbability}% · 不可交易 ${portionSell.untradeableProbability}%
                </div>
              </div>
              <div style="background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 4px; padding: 0.4rem 0.6rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 0.8rem; color: #60a5fa; font-weight: 600;">买单已计价平均: <strong>${buyAvgText}</strong></span>
                  ${portionBuy.incomplete ? '<span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); font-size: 0.7rem;">不完整</span>' : '<span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; font-size: 0.7rem;">完整</span>'}
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
                  已计价 ${portionBuy.pricedProbability}% · 缺价 ${portionBuy.missingProbability}% · 不可交易 ${portionBuy.untradeableProbability}%
                </div>
              </div>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.4;">
              说明：按 <code>(2A+2B+4C)/8</code> 加权各轮已定价项贡献；若任一轮缺价，完整期望值保留为 null（不以 0 充数）。仲裁第 4 轮后持续给 C 轮奖励；发奖轮数 N≥4 通式为 <code>[2A+2B+(N−4)C]/N</code>。
            </div>
          </div>
        `;
      }
    }
  }

  // 缺价物品清单 (Decision 3 & 11 两侧独立)
  let missingItemsSection = '';
  const currentMissing = priceType === 'buyMax' ? expBuy.missingItems : expSell.missingItems;
  const otherMissing = priceType === 'buyMax' ? expSell.missingItems : expBuy.missingItems;
  const currentSideName = priceType === 'buyMax' ? '买单' : '卖单';
  const otherSideName = priceType === 'buyMax' ? '卖单' : '买单';
  const currentMissingProb = priceType === 'buyMax' ? expBuy.missingProbability : expSell.missingProbability;

  if ((expSell.missingItems && expSell.missingItems.length > 0) || (expBuy.missingItems && expBuy.missingItems.length > 0)) {
    missingItemsSection = `
      <div id="missing-items-section" style="margin-top: 1rem; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 6px; padding: 0.75rem 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; flex-wrap: wrap;">
          <span style="font-weight: 600; color: #fbbf24; font-size: 0.9rem;">
            ⚠️ 缺价/未估值物品清单（${currentSideName}侧缺 ${currentMissing.length} 项，缺价掉率合计 ${currentMissingProb}%；${otherSideName}侧缺 ${otherMissing.length} 项）
          </span>
        </div>
        <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.5rem;">
          说明：Endo、现金包、赤毒、倒挂隔离报价等无有效市价项目保持未估值状态，不代表无用途或价值为 0 ☿。
        </div>
        <div style="max-height: 180px; overflow-y: auto;">
          <table style="width: 100%; font-size: 0.8rem; border-collapse: collapse;">
            <thead>
              <tr style="color: var(--text-muted); text-align: left; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                <th style="padding: 0.25rem 0.5rem;">物品名称</th>
                <th style="padding: 0.25rem 0.5rem;">数量</th>
                <th style="padding: 0.25rem 0.5rem;">掉落几率</th>
                <th style="padding: 0.25rem 0.5rem;">缺价侧别</th>
              </tr>
            </thead>
            <tbody>
              ${currentMissing.map(m => {
                const missingInOther = otherMissing.some(o => o.name === m.name);
                const sideTag = missingInOther ? '卖/买两侧皆缺' : `仅${currentSideName}侧缺`;
                return `
                <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                  <td style="padding: 0.25rem 0.5rem; color: var(--text-primary);">${escapeHtml(m.zhName || m.name)} <span style="font-size: 0.72rem; color: var(--text-muted);">(${escapeHtml(m.name)})</span></td>
                  <td style="padding: 0.25rem 0.5rem; color: var(--text-secondary);">${m.quantity > 1 ? `×${m.quantity}` : '1'}</td>
                  <td style="padding: 0.25rem 0.5rem; color: var(--cyan-primary);">${m.chance}%</td>
                  <td style="padding: 0.25rem 0.5rem; color: #fbbf24; font-size: 0.75rem;">${sideTag}</td>
                </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  elements.modalBodyContent.innerHTML = `
    ${historicalNotice}
    ${arbitrationBanner}
    <div class="expected-dashboard" style="margin-top: 0;">
      <div style="font-size: 0.85rem; font-weight: 600; color: var(--gold-light); margin-bottom: 0.6rem;">${modalTitle}</div>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
        <div style="flex: 1; min-width: 220px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 6px; padding: 0.6rem 0.8rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 0.8rem; color: #34d399; font-weight: 600;">卖单参考收益</div>
            ${expSell.incomplete ? '<span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); font-size: 0.7rem;">不完整估值</span>' : '<span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 0.7rem;">完整估值</span>'}
          </div>
          <div style="font-size: 1.25rem; font-weight: 700; color: var(--gold-light); margin-top: 0.2rem;">
            ${expSell.expectedValue !== null ? `${expSell.expectedValue} ☿` : '—'}
            ${expSell.lowConfidenceCount > 0 && expSell.expectedValueConfident !== null ? `<span style="font-size: 0.8rem; color: var(--cyan-primary); font-weight: normal; margin-left: 0.35rem;" title="排除稀疏卖单后的高置信估值">(高置信: ${expSell.expectedValueConfident} ☿)</span>` : ''}
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.3rem;">
            ${expSell.incomplete
              ? `已计价覆盖率 ${expSell.pricedProbability}% · 缺价 ${expSell.missingProbability}% (${expSell.missingCount} 项)`
              : '已计价覆盖率 100%'}
          </div>
        </div>
        <div style="flex: 1; min-width: 220px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.25); border-radius: 6px; padding: 0.6rem 0.8rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 0.8rem; color: #60a5fa; font-weight: 600;">买单即时变现收益</div>
            ${expBuy.incomplete ? '<span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); font-size: 0.7rem;">不完整估值</span>' : '<span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; font-size: 0.7rem;">完整估值</span>'}
          </div>
          <div style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-top: 0.2rem;">
            ${expBuy.expectedValue !== null ? `${expBuy.expectedValue} ☿` : '—'}
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.3rem;">
            ${expBuy.incomplete
              ? `已计价覆盖率 ${expBuy.pricedProbability}% · 缺价 ${expBuy.missingProbability}% (${expBuy.missingCount} 项)`
              : '已计价覆盖率 100%'}
          </div>
        </div>
      </div>
      <div style="font-size: 0.8rem; color: var(--text-muted);">
        公式：${isEnemy ? `Mod掉率(${src.enemyModDropChance}%) × Σ(几率% × 数量 × 单价)` : `Σ(几率% × 数量 × 单价)`}。赋能与 Mod 按 0 级掉落价格计入。
        ${rotationPatternNotice}
        ${dedupeNotice}
        ${boundaryFixNotice}
        ${probNotice}
        ${incompleteNotice}
        ${expSell.lowConfidenceCount > 0 ? `<div style="margin-top: 0.25rem; color: #fbbf24;">⚠️ 卖单中包含 ${expSell.lowConfidenceCount} 项低置信挂单（有效去重卖家少于 3 人），高置信收益估算为 ${expSell.expectedValueConfident !== null ? `${expSell.expectedValueConfident} ☿` : '—'}。</div>` : ''}
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
    ${missingItemsSection}
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

  // PvP 切换按钮 (点击只看 PvP 来源，再点回到非 PvP 视图；与历史活动互斥)
  if (elements.pvpFilterBtn) {
    elements.pvpFilterBtn.addEventListener('click', () => {
      const updated = togglePvpFilter(state);
      state.sourcePvpOnly = updated.sourcePvpOnly;
      state.sourceHistoricalOnly = updated.sourceHistoricalOnly;
      elements.pvpFilterBtn.classList.toggle('active', state.sourcePvpOnly);
      elements.pvpFilterBtn.classList.toggle('pvp-active', state.sourcePvpOnly);
      if (elements.historicalFilterBtn) {
        elements.historicalFilterBtn.classList.toggle('active', state.sourceHistoricalOnly);
      }
      renderCurrentView();
    });
  }

  // 历史活动切换按钮 (点击只看历史活动来源，再点回到默认视图；与 PvP 互斥)
  if (elements.historicalFilterBtn) {
    elements.historicalFilterBtn.addEventListener('click', () => {
      const updated = toggleHistoricalFilter(state);
      state.sourceHistoricalOnly = updated.sourceHistoricalOnly;
      state.sourcePvpOnly = updated.sourcePvpOnly;
      elements.historicalFilterBtn.classList.toggle('active', state.sourceHistoricalOnly);
      if (elements.pvpFilterBtn) {
        elements.pvpFilterBtn.classList.toggle('active', state.sourcePvpOnly);
        elements.pvpFilterBtn.classList.toggle('pvp-active', state.sourcePvpOnly);
      }
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
