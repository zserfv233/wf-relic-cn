import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  getPriceEntry,
  getItemPrice,
  formatPriceDisplay
} from '../js/lib/calculations.js';
import {
  filterSources,
  toggleHistoricalFilter,
  togglePvpFilter
} from '../js/lib/sources.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const prices = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/prices.json'), 'utf8'));
const sources = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/sources.json'), 'utf8'));

describe('Codex 1126b R3b 通道复核 4 处界面问题修正 (Round 3c Tests)', () => {

  // --------------------------------------------------------------------------
  // 问题 1: 「📜 历史活动」按钮切换逻辑与筛选纯函数
  // --------------------------------------------------------------------------
  describe('问题 1: 「📜 历史活动」按钮切换与筛选状态纯函数', () => {
    it('toggleHistoricalFilter 与 togglePvpFilter 状态切换互斥且可自如恢复默认', () => {
      // 初始默认状态
      let state = { sourceHistoricalOnly: false, sourcePvpOnly: false };

      // 1. 点一下历史活动：开启历史活动，PvP 保持关闭
      state = toggleHistoricalFilter(state);
      assert.strictEqual(state.sourceHistoricalOnly, true);
      assert.strictEqual(state.sourcePvpOnly, false);

      // 2. 再点一下历史活动：恢复默认关闭
      state = toggleHistoricalFilter(state);
      assert.strictEqual(state.sourceHistoricalOnly, false);
      assert.strictEqual(state.sourcePvpOnly, false);

      // 3. 开启 PvP
      state = togglePvpFilter(state);
      assert.strictEqual(state.sourcePvpOnly, true);
      assert.strictEqual(state.sourceHistoricalOnly, false);

      // 4. 在开启 PvP 时点击历史活动：互斥生效，开启历史活动，强制关闭 PvP
      state = toggleHistoricalFilter(state);
      assert.strictEqual(state.sourceHistoricalOnly, true);
      assert.strictEqual(state.sourcePvpOnly, false);

      // 5. 在开启历史活动时点击 PvP：互斥生效，开启 PvP，强制关闭历史活动
      state = togglePvpFilter(state);
      assert.strictEqual(state.sourcePvpOnly, true);
      assert.strictEqual(state.sourceHistoricalOnly, false);

      // 6. 再次点击 PvP：恢复默认关闭
      state = togglePvpFilter(state);
      assert.strictEqual(state.sourcePvpOnly, false);
      assert.strictEqual(state.sourceHistoricalOnly, false);
    });

    it('filterSources 结合 toggle 状态：默认排除历史活动，开启时只看历史活动，且不进普通排序', () => {
      const tenZeroSources = sources.filter(s => s.historicalEvent);
      assert.ok(tenZeroSources.length >= 5, '必须存在至少 5 个历史活动来源');

      // 默认状态 (historicalOnly: false, pvpOnly: false)
      const defaultList = filterSources(sources, { historicalOnly: false, pvpOnly: false });
      assert.strictEqual(
        defaultList.some(s => s.historicalEvent),
        false,
        '默认列表必须排除所有历史活动'
      );
      assert.strictEqual(
        defaultList.some(s => s.isPvp),
        false,
        '默认列表必须排除所有 PvP 来源'
      );

      // 切换到历史活动模式 (historicalOnly: true, pvpOnly: false)
      const histList = filterSources(sources, { historicalOnly: true, pvpOnly: false });
      assert.strictEqual(histList.length, tenZeroSources.length);
      assert.ok(histList.every(s => s.historicalEvent === true));
    });

    it('js/app.js 包含 historicalFilterBtn 点击事件绑定与互斥切换处理', () => {
      const appJs = fs.readFileSync(path.join(rootDir, 'js/app.js'), 'utf8');
      assert.ok(appJs.includes('elements.historicalFilterBtn.addEventListener'), 'app.js 必须监听 historicalFilterBtn 的 click 事件');
      assert.ok(appJs.includes('toggleHistoricalFilter'), 'app.js 必须使用 toggleHistoricalFilter 纯函数');
      assert.ok(appJs.includes('togglePvpFilter'), 'app.js 必须使用 togglePvpFilter 纯函数');
    });
  });

  // --------------------------------------------------------------------------
  // 问题 2: 来源弹窗公式与规律提示不重复显示
  // --------------------------------------------------------------------------
  describe('问题 2: 来源弹窗提示去重', () => {
    it('openSourceModal 内部仅保留一份“公式 / 轮次规律 / 完整性提示”（仅在卡片内）', () => {
      const appJs = fs.readFileSync(path.join(rootDir, 'js/app.js'), 'utf8');
      
      // 提取 openSourceModal 函数代码块
      const modalMatch = appJs.match(/export function openSourceModal[\s\S]*?elements\.detailModal\.classList\.add\('active'\);/);
      assert.ok(modalMatch, '必须找到 openSourceModal 实现');
      const modalCode = modalMatch[0];

      // 检查公式文案出现次数
      const formulaOccurrences = modalCode.match(/公式：\$\{isEnemy \?/g) || [];
      assert.strictEqual(
        formulaOccurrences.length,
        1,
        `openSourceModal 中公式提示只能出现 1 次（卡片内），实际出现 ${formulaOccurrences.length} 次`
      );

      // 检查 rotationPatternNotice 出现次数
      const rotationNoticeOccurrences = modalCode.match(/\$\{rotationPatternNotice\}/g) || [];
      assert.strictEqual(
        rotationNoticeOccurrences.length,
        1,
        `openSourceModal 中 rotationPatternNotice 只能出现 1 次，实际出现 ${rotationNoticeOccurrences.length} 次`
      );

      // 检查 incompleteNotice 出现次数
      const incompleteOccurrences = modalCode.match(/\$\{incompleteNotice\}/g) || [];
      assert.strictEqual(
        incompleteOccurrences.length,
        1,
        `openSourceModal 中 incompleteNotice 只能出现 1 次，实际出现 ${incompleteOccurrences.length} 次`
      );
    });
  });

  // --------------------------------------------------------------------------
  // 问题 3: 倒挂报价在物品/赋能/Mod/遗物弹窗中提示与 noBuyOrders 修正
  // --------------------------------------------------------------------------
  describe('问题 3: 倒挂报价隔离提示与 noBuyOrders 正确判定', () => {
    it('倒挂报价条目的 noBuyOrders 必须为 false（保留原始买单存在性判定）', () => {
      // 1. 模拟买卖倒挂但买单存在的条目 (buyMax 10 > sellMin 5, buyCount 1)
      const mockItems = {
        'crossed_with_buy@r0': { sellMin: 5, buyMax: 10, sellCount: 2, buyCount: 1, uniqueBuyers: 1 },
        'crossed_no_buy@r0': { sellMin: 5, buyMax: null, sellCount: 2, buyCount: 0 }
      };

      const crossedWithBuy = getPriceEntry('crossed_with_buy', 0, mockItems);
      assert.strictEqual(crossedWithBuy.crossedMarket, true);
      assert.strictEqual(crossedWithBuy.sellMin, null, '倒挂有效卖价置 null');
      assert.strictEqual(crossedWithBuy.buyMax, null, '倒挂有效买价置 null');
      assert.strictEqual(crossedWithBuy.rawSellMin, 5);
      assert.strictEqual(crossedWithBuy.rawBuyMax, 10);
      assert.strictEqual(crossedWithBuy.noBuyOrders, false, '有买单的倒挂条目 noBuyOrders 必须为 false');

      const crossedNoBuy = getPriceEntry('crossed_no_buy', 0, mockItems);
      assert.strictEqual(crossedNoBuy.crossedMarket, false);
      assert.strictEqual(crossedNoBuy.noBuyOrders, true, '无买单条目 noBuyOrders 为 true');
    });

    it('真实缓存样本 arcane_reaper@r0: 若实际倒挂则断言 crossedMarket: true 且 noBuyOrders: false', () => {
      const reaperRaw = prices.items && prices.items['arcane_reaper@r0'];
      if (reaperRaw && typeof reaperRaw === 'object') {
        const rawSell = (reaperRaw.rawSellMin !== undefined && reaperRaw.rawSellMin !== null) ? reaperRaw.rawSellMin : reaperRaw.sellMin;
        const rawBuy = (reaperRaw.rawBuyMax !== undefined && reaperRaw.rawBuyMax !== null) ? reaperRaw.rawBuyMax : reaperRaw.buyMax;
        if (typeof rawSell === 'number' && typeof rawBuy === 'number' && rawBuy > rawSell) {
          const reaper = getPriceEntry('arcane_reaper', 0, prices.items);
          assert.strictEqual(reaper.crossedMarket, true);
          assert.strictEqual(reaper.rawSellMin, rawSell);
          assert.strictEqual(reaper.rawBuyMax, rawBuy);
          assert.strictEqual(reaper.sellMin, null);
          assert.strictEqual(reaper.buyMax, null);
          assert.strictEqual(
            reaper.noBuyOrders,
            false,
            'arcane_reaper@r0 具有收购价，严禁因倒挂隔离被标记为 noBuyOrders: true'
          );
        }
      }
    });

    it('formatPriceDisplay 纯函数：倒挂报价输出与来源弹窗一致的警告与 title，有效价仍为 null', () => {
      const mockItems = {
        'arcane_reaper@r0': { sellMin: 15, buyMax: 72, sellCount: 1, buyCount: 2 }
      };
      const reaper = getPriceEntry('arcane_reaper', 0, mockItems);
      const displayHtml = formatPriceDisplay(reaper.sellMin, reaper);

      assert.ok(displayHtml.includes('⚠️ 倒挂隔离 (卖 15 / 买 72)'), '必须显示倒挂隔离文本');
      assert.ok(displayHtml.includes('title='), '必须包含 title 提示');
      assert.ok(displayHtml.includes('报价倒挂：最高收购价 (72 ☿) 高于最低卖价 (15 ☿)'), 'title 必须包含 crossedMarketReason');
      assert.ok(displayHtml.includes('#fbbf24'), '必须使用黄色警告高亮');

      // 正常有价条目
      const normalHtml = formatPriceDisplay(25, { crossedMarket: false });
      assert.strictEqual(normalHtml, '25 ☿');

      // 无价条目（未倒挂）
      const emptyHtml = formatPriceDisplay(null, { crossedMarket: false });
      assert.ok(emptyHtml.includes('暂无挂单'));
    });

    it('js/app.js 中所有对应弹窗与卡片（物品、赋能、Mod、遗物奖励行、紫卡）均调用 formatPriceDisplay', () => {
      const appJs = fs.readFileSync(path.join(rootDir, 'js/app.js'), 'utf8');

      // 赋能弹窗
      assert.ok(appJs.includes('openArcaneModal'), '必须包含 openArcaneModal');
      // 遗物弹窗奖励行
      assert.ok(appJs.includes('openRelicModal'), '必须包含 openRelicModal');
      // 物品弹窗
      assert.ok(appJs.includes('openItemModal'), '必须包含 openItemModal');
      // 紫卡弹窗
      assert.ok(appJs.includes('openRivenModal'), '必须包含 openRivenModal');
      // Mod 弹窗
      assert.ok(appJs.includes('openModModal'), '必须包含 openModModal');

      // 校验各弹窗均应用 formatPriceDisplay 处理倒挂隔离
      const occurrences = (appJs.match(/formatPriceDisplay/g) || []).length;
      assert.ok(occurrences >= 10, `app.js 中 formatPriceDisplay 调用次数应 >= 10，实际为 ${occurrences}`);
    });
  });

  // --------------------------------------------------------------------------
  // 问题 4: 界面文案与数据中彻底消除本机路径 /workspace/
  // --------------------------------------------------------------------------
  describe('问题 4: 界面文案与数据消除本机路径 /workspace/', () => {
    it('全仓库用户可见文件（index.html、js/*.js、js/lib/*.js、data/*.json）严禁包含 "/workspace/"', () => {
      const targetPaths = [];

      // 1. index.html
      targetPaths.push(path.join(rootDir, 'index.html'));

      // 2. js/ 与 js/lib/
      const jsFiles = fs.readdirSync(path.join(rootDir, 'js')).filter(f => f.endsWith('.js'));
      for (const f of jsFiles) {
        targetPaths.push(path.join(rootDir, 'js', f));
      }
      const jsLibFiles = fs.readdirSync(path.join(rootDir, 'js/lib')).filter(f => f.endsWith('.js'));
      for (const f of jsLibFiles) {
        targetPaths.push(path.join(rootDir, 'js/lib', f));
      }

      // 3. data/*.json
      const dataFiles = fs.readdirSync(path.join(rootDir, 'data')).filter(f => f.endsWith('.json'));
      for (const f of dataFiles) {
        targetPaths.push(path.join(rootDir, 'data', f));
      }

      const violations = [];
      for (const filePath of targetPaths) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('/workspace/')) {
          violations.push(path.relative(rootDir, filePath));
        }
      }

      assert.deepStrictEqual(
        violations,
        [],
        `以下用户可见文件仍泄露本机路径 /workspace/:\n${violations.join('\n')}`
      );
    });

    it('data/sources.json 中 Recall: Ten-Zero 来源严禁包含 officialArchiveLocal 字段', () => {
      const tenZeroSources = sources.filter(s => s.eventGroup === 'recall_ten_zero');
      assert.strictEqual(tenZeroSources.length, 5);
      for (const s of tenZeroSources) {
        assert.strictEqual('officialArchiveLocal' in s, false, `来源 ${s.id} 严禁包含 officialArchiveLocal`);
      }
    });
  });
});
