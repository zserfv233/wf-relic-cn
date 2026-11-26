import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getPriceEntry,
  calculateSourceExpectedValue,
  arbitrationFirst8PricedPortion,
  aabcAverage
} from '../js/lib/calculations.js';
import { filterSources } from '../js/lib/sources.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const CONFIG_DIR = path.join(ROOT_DIR, 'config');
const RAW_DIR = '/workspace/wf-relic-cn-raw';

describe('Codex 1126b 修正 (A1–A4) 与第 7–11 项测试套件 (Round 3b Tests)', () => {
  const zhMapPath = path.join(CONFIG_DIR, 'zh-map.json');
  const sourcesPath = path.join(DATA_DIR, 'sources.json');
  const searchIndexPath = path.join(DATA_DIR, 'search-index.json');
  const pricesPath = path.join(DATA_DIR, 'prices.json');

  const zhMap = JSON.parse(fs.readFileSync(zhMapPath, 'utf8'));
  const sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
  const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));
  const prices = JSON.parse(fs.readFileSync(pricesPath, 'utf8'));

  const rawLanguagesPath = path.join(RAW_DIR, 'wfcd-worldstate-zh/languages.json');
  const languagesZh = fs.existsSync(rawLanguagesPath) ? JSON.parse(fs.readFileSync(rawLanguagesPath, 'utf8')) : {};

  // --------------------------------------------------------------------------
  // A1: 来源显示名使用 DE 节点名
  // --------------------------------------------------------------------------
  it('A1: 来源显示名 nameZh 使用 DE 对齐节点名 (nodeZh)，未对齐节点保持原样，英文搜索仍能搜到', () => {
    // 1. 已对齐节点：Apollodorus 对应 DE 阿波罗多罗斯撞击坑
    const apollodorusA = sources.find(s => s.id === 'mission_mercury_apollodorus_a');
    assert.ok(apollodorusA, '必须存在 mission_mercury_apollodorus_a');
    assert.strictEqual(apollodorusA.node, 'Apollodorus');
    assert.strictEqual(apollodorusA.nodeZh, '阿波罗多罗斯撞击坑');
    assert.strictEqual(apollodorusA.nameZh, '水星 - 阿波罗多罗斯撞击坑 (生存) [轮次 A]');
    assert.strictEqual(apollodorusA.nameEn, 'Mercury - Apollodorus (Survival) [Rot A]');

    // 2. 未对齐节点或特殊节点：保持英文或原样
    const arbitrations = sources.find(s => s.id === 'source_transient_arbitrations_a');
    assert.ok(arbitrations, '必须存在 source_transient_arbitrations_a');
    assert.strictEqual(arbitrations.nameZh, '仲裁 [轮次 A]');

    // 3. 搜索索引必须包含英文原名与中文名，支持双语搜索
    const matchedByEn = searchIndex.filter(entry => 
      entry.tokens && entry.tokens.some(t => t.toLowerCase().includes('apollodorus'))
    );
    assert.ok(matchedByEn.length > 0, '搜索索引中必须能通过英文 "Apollodorus" 搜到条目');

    const matchedByZh = searchIndex.filter(entry => 
      entry.tokens && entry.tokens.some(t => t.includes('阿波罗多罗斯'))
    );
    assert.ok(matchedByZh.length > 0, '搜索索引中必须能通过中文 "阿波罗多罗斯" 搜到条目');
  });

  // --------------------------------------------------------------------------
  // A2: Executioner ×8 全部回退英文 en_fallback，保留待拍板 candidate
  // --------------------------------------------------------------------------
  it('A2: Executioner ×8 派生结果以“的”结尾全部回退英文，保留 candidate 且标 pendingDecision', () => {
    // 8 个在 DE ExportFlavour 拥有“…的浮印”的 Executioner
    const executioners = [
      'Executioner Zura',
      'Executioner Garesh',
      'Executioner Harkonar',
      'Executioner Reth',
      'Executioner Vay Molta',
      'Executioner Dok Thul',
      'Executioner Nok',
      'Executioner Gorth'
    ];

    for (const name of executioners) {
      const entry = zhMap.enemies?.[name];
      assert.ok(entry, `zhMap.enemies 必须包含 ${name}`);
      assert.strictEqual(entry.zhSource, 'en_fallback', `${name} 必须回退为 en_fallback`);
      assert.strictEqual(entry.nameZh, name, `${name} nameZh 必须为英文`);
      assert.strictEqual(entry.pendingDecision, true, `${name} 必须标为 pendingDecision`);
      assert.ok(entry.candidate, `${name} 必须保留 candidate 信息`);
      assert.ok(entry.candidate.zhCandidate.endsWith('的'), `${name} 候选词 (${entry.candidate.zhCandidate}) 必须以“的”结尾`);
      assert.ok(entry.candidate.zhSource, `${name} 必须记录 candidate 出处键`);
    }
  });

  // --------------------------------------------------------------------------
  // A3: Carrier 回退英文，exact_match 增加实体类别核对，Kubrow 保留并标注
  // --------------------------------------------------------------------------
  it('A3: Carrier 回退英文 (排除守护同名)，exact_match 排除 sentinels/pets/powersuits/warframes，Kubrow 标注“宠物同种”', () => {
    // 1. Carrier 回退
    const carrier = zhMap.enemies?.['Carrier'];
    assert.ok(carrier, 'zhMap.enemies 必须包含 Carrier');
    assert.strictEqual(carrier.zhSource, 'en_fallback', 'Carrier 必须回退为 en_fallback');
    assert.strictEqual(carrier.nameZh, 'Carrier');
    assert.strictEqual(carrier.rule, 'rejected_non_enemy_entity');
    assert.strictEqual(carrier.pendingDecision, true);
    assert.ok(carrier.candidate, 'Carrier 必须记录 candidate 信息');

    // 2. 实体类型检查：没有敌人使用 sentinels, powersuits 等非敌人物品键
    for (const [enName, enemy] of Object.entries(zhMap.enemies || {})) {
      if (enemy.zhSource && enemy.zhSource.startsWith('wfcd_worldstate:languages:')) {
        const langPath = enemy.zhSource.toLowerCase();
        assert.ok(
          !langPath.includes('/sentinels/') &&
          !langPath.includes('/powersuits/') &&
          !langPath.includes('/warframes/'),
          `敌人 ${enName} 错误引用了非敌人物品语言键: ${enemy.zhSource}`
        );
      }
    }

    // 3. Kubrow 保留但标注
    const kubrow = zhMap.enemies?.['Kubrow'];
    assert.ok(kubrow, 'zhMap.enemies 必须包含 Kubrow');
    assert.strictEqual(kubrow.nameZh, '库狛');
    assert.strictEqual(kubrow.annotation, '宠物同种');
    assert.strictEqual(kubrow.pendingDecision, true);
  });

  // --------------------------------------------------------------------------
  // A4: Stalker / Protector Stalker 回退英文，全部敌人中文严格等于出处或合法去后缀
  // --------------------------------------------------------------------------
  it('A4: Stalker 与 Protector Stalker 回退英文，全量敌人中文名严格等于出处原文或合法去后缀', () => {
    // 1. Stalker 回退英文
    const stalker = zhMap.enemies?.['Stalker'];
    assert.ok(stalker, 'zhMap.enemies 必须包含 Stalker');
    assert.strictEqual(stalker.zhSource, 'en_fallback');
    assert.strictEqual(stalker.nameZh, 'Stalker');
    assert.strictEqual(stalker.pendingDecision, true);
    assert.ok(stalker.candidate);

    const protStalker = zhMap.enemies?.['Protector Stalker'];
    assert.ok(protStalker, 'zhMap.enemies 必须包含 Protector Stalker');
    assert.strictEqual(protStalker.zhSource, 'en_fallback');
    assert.strictEqual(protStalker.nameZh, 'Protector Stalker');
    assert.strictEqual(protStalker.pendingDecision, true);
    assert.ok(protStalker.candidate);

    // 2. 全量敌人合法性断言
    for (const [enName, enemy] of Object.entries(zhMap.enemies || {})) {
      if (enemy.nameZh && /[\u4e00-\u9fa5]/.test(enemy.nameZh)) {
        if (enemy.rule && (enemy.rule === 'exact_match' || enemy.rule.startsWith('exact_match:'))) {
          // exact_match 必须严格等于出处原文
          let sourceText = enemy.rawName;
          if (!sourceText && enemy.zhSource.startsWith('wfcd_worldstate:languages:')) {
            const k = enemy.zhSource.replace('wfcd_worldstate:languages:', '');
            sourceText = languagesZh[k]?.value;
          }
          assert.strictEqual(
            enemy.nameZh,
            sourceText,
            `敌人 ${enName} 标为 exact_match，但 nameZh (${enemy.nameZh}) 与出处原文 (${sourceText}) 不符`
          );
        } else if (enemy.rule === 'strip_suffix:浮印') {
          assert.strictEqual(
            enemy.rawName.replace(/\s*浮印$/, '').trim(),
            enemy.nameZh,
            `敌人 ${enName} strip_suffix:浮印 rawName (${enemy.rawName}) 去掉后缀必须等于 nameZh (${enemy.nameZh})`
          );
        } else if (enemy.rule === 'strip_suffix:可动模型') {
          assert.ok(
            enName.startsWith('Eidolon '),
            `strip_suffix:可动模型 仅限三个夜灵，但 ${enName} 使用了该规则`
          );
          assert.strictEqual(enemy.rawName.replace(/\s*可动模型$/, '').trim(), enemy.nameZh.replace('（特殊）', '').trim());
        } else if (enemy.rule === 'sortieData' || enemy.rule === 'sortie_boss' || enemy.rule === 'sortie_boss:t2s' || enemy.zhTransform === 'traditional_to_simplified' || enemy.zhSegments) {
          // 已登记规则，允许
        } else {
          assert.fail(`敌人 ${enName} 具有未知规则: ${enemy.rule}`);
        }
      }
    }
  });

  // --------------------------------------------------------------------------
  // 第 7 项: AABC 默认不显示，撤掉泛化 AABC 提示，aabcAverage 纯函数保留
  // --------------------------------------------------------------------------
  it('第 7 项: AABC 默认不显示，撤掉未核实模式的泛化 AABC 提示，aabcAverage 纯函数保留', () => {
    // 1. 普通无限任务无 rotationPattern
    const apolloA = sources.find(s => s.id === 'mission_mercury_apollodorus_a');
    assert.ok(apolloA);
    assert.strictEqual(apolloA.rotationPattern, undefined);

    const xiniA = sources.find(s => s.id === 'mission_eris_xini_a');
    if (xiniA) {
      assert.strictEqual(xiniA.rotationPattern, undefined);
    }

    // 2. 仲裁保留专用轮次说明
    const arbA = sources.find(s => s.id === 'source_transient_arbitrations_a');
    assert.ok(arbA);
    assert.strictEqual(arbA.rotationPattern, '仲裁轮次通常为 AABBCCCC…（不套用 AABC）');

    // 3. aabcAverage 纯函数功能验证: aabcAverage(a, b, c) = (2A + B + C) / 4
    const avg = aabcAverage(10, 20, 40);
    assert.strictEqual(avg, (2 * 10 + 20 + 40) / 4); // 20
    assert.strictEqual(aabcAverage(null, 20, 40), null);
    assert.strictEqual(aabcAverage(10, null, 40), null);
    assert.strictEqual(aabcAverage(10, 20, null), null);
  });

  // --------------------------------------------------------------------------
  // 第 8 项: Recall: Ten-Zero 5 个独立来源，记录指纹，默认不进刷取列表
  // --------------------------------------------------------------------------
  it('第 8 项: Recall: Ten-Zero 单列 5 个独立历史活动来源，记录指纹与公告，默认不进刷取列表', () => {
    const tenZeroSources = sources.filter(s => s.eventGroup === 'recall_ten_zero');
    assert.strictEqual(tenZeroSources.length, 5, '必须独立解析出 5 个 Recall: Ten-Zero 来源');

    const expectedRowCounts = [10, 10, 10, 10, 11];
    let totalItems = 0;

    tenZeroSources.forEach((s, idx) => {
      const weekNum = idx + 1;
      assert.strictEqual(s.historicalEvent, true);
      assert.strictEqual(s.eventGroup, 'recall_ten_zero');
      assert.strictEqual(s.nameEn, `Recall: Ten-Zero Week ${weekNum}`);
      assert.strictEqual(s.nameZh, `Recall: Ten-Zero Week ${weekNum}`); // 未在受控模板中，保留英文
      assert.strictEqual(s.rewards.length, expectedRowCounts[idx]);
      totalItems += s.rewards.length;

      // 概率和 100%
      assert.strictEqual(s.probabilitySum, 100);
      assert.strictEqual(s.probabilityCheck, 'ok');

      // 指纹
      assert.ok(s.fingerprint, `Week ${weekNum} 必须有 fingerprint`);
      assert.strictEqual(s.fingerprint.rowCount, expectedRowCounts[idx]);
      assert.strictEqual(s.fingerprint.probabilitySum, 100);
      assert.ok(s.fingerprint.header.includes(`Recall: Ten-Zero Week ${weekNum}`));
    });

    assert.strictEqual(totalItems, 51, '5 个表总条目数应为 51');

    // filterSources 默认排除历史活动
    const normalList = filterSources(sources, { historicalOnly: false });
    assert.strictEqual(
      normalList.some(s => s.historicalEvent),
      false,
      '普通来源列表中严禁包含 historicalEvent: true 来源'
    );

    // filterSources historicalOnly: true 时仅包含历史活动
    const histList = filterSources(sources, { historicalOnly: true });
    assert.ok(histList.length >= 5);
    for (const hs of histList) {
      assert.strictEqual(hs.historicalEvent, true);
    }
  });

  // --------------------------------------------------------------------------
  // 第 9 项: 仲裁前八轮已计价部分平均
  // --------------------------------------------------------------------------
  it('第 9 项: 仲裁前八轮已计价部分平均，卖买两侧分别加权计算，完整 EV 严禁 ?? 0', () => {
    // 1. 结构测试与纯函数测试（用 fixture 数据断言公式）
    const mockExpA = {
      expectedValueRaw: 1.0,
      expectedValueConfidentRaw: 1.0,
      pricedProbability: 50.0,
      missingProbability: 40.0,
      untradeableProbability: 10.0,
      incomplete: true,
      missingItems: ['item_a']
    };
    const mockExpB = {
      expectedValueRaw: 2.0,
      expectedValueConfidentRaw: 2.0,
      pricedProbability: 60.0,
      missingProbability: 30.0,
      untradeableProbability: 10.0,
      incomplete: true,
      missingItems: ['item_b']
    };
    const mockExpC = {
      expectedValueRaw: 4.0,
      expectedValueConfidentRaw: 4.0,
      pricedProbability: 80.0,
      missingProbability: 10.0,
      untradeableProbability: 10.0,
      incomplete: true,
      missingItems: ['item_c']
    };

    const portion = arbitrationFirst8PricedPortion(mockExpA, mockExpB, mockExpC);
    assert.strictEqual(portion.structuralDataInsufficient, false);

    // 加权已知贡献: (2*1 + 2*2 + 4*4)/8 = (2 + 4 + 16)/8 = 22/8 = 2.75
    assert.strictEqual(portion.knownContribution, 2.75);
    // 加权 pricedProb: (2*50 + 2*60 + 4*80)/8 = (100 + 120 + 320)/8 = 540/8 = 67.5%
    assert.strictEqual(portion.pricedProbability, 67.5);
    // 加权 missingProb: (2*40 + 2*30 + 4*10)/8 = (80 + 60 + 40)/8 = 180/8 = 22.5%
    assert.strictEqual(portion.missingProbability, 22.5);
    // 加权 untradeableProb: (2*10 + 2*10 + 4*10)/8 = 10%
    assert.strictEqual(portion.untradeableProbability, 10.0);
    assert.strictEqual(portion.incomplete, true);
    assert.strictEqual(portion.completeExpectedValue, null);

    // 2. 结构数据不足断言
    const incompletePortion = arbitrationFirst8PricedPortion(null, mockExpB, mockExpC);
    assert.strictEqual(incompletePortion.structuralDataInsufficient, true);
    assert.strictEqual(incompletePortion.knownContribution, null);

    // 3. 基于当前 prices.json 计算的结构不变量断言
    const arbA = sources.find(s => s.id === 'source_transient_arbitrations_a');
    const arbB = sources.find(s => s.id === 'source_transient_arbitrations_b');
    const arbC = sources.find(s => s.id === 'source_transient_arbitrations_c');

    const eASell = calculateSourceExpectedValue(arbA.rewards, prices.items, { priceType: 'sellMin' });
    const eBSell = calculateSourceExpectedValue(arbB.rewards, prices.items, { priceType: 'sellMin' });
    const eCSell = calculateSourceExpectedValue(arbC.rewards, prices.items, { priceType: 'sellMin' });

    const portionSell = arbitrationFirst8PricedPortion(eASell, eBSell, eCSell);
    assert.strictEqual(portionSell.structuralDataInsufficient, false);
    assert.ok(typeof portionSell.knownContribution === 'number' && portionSell.knownContribution >= 0);
    assert.ok(portionSell.pricedProbability >= 0 && portionSell.pricedProbability <= 100);
    assert.strictEqual(portionSell.untradeableProbability, 3.0);
    assert.strictEqual(portionSell.completeExpectedValue, null); // 包含缺价项时完整 EV 必须为 null

    // 在未变异的标准价格缓存下，验证精确数值 (sell: 0.84375, 22.375%; buy: 0, 0%)
    if (prices.items['adaptation@r0'] && prices.items['adaptation@r0'].sellMin === 5) {
      assert.strictEqual(portionSell.knownContribution, 0.84375);
      assert.strictEqual(portionSell.pricedProbability, 22.375);
      assert.strictEqual(portionSell.missingProbability, 74.625);
    }

    const eABuy = calculateSourceExpectedValue(arbA.rewards, prices.items, { priceType: 'buyMax' });
    const eBBuy = calculateSourceExpectedValue(arbB.rewards, prices.items, { priceType: 'buyMax' });
    const eCBuy = calculateSourceExpectedValue(arbC.rewards, prices.items, { priceType: 'buyMax' });
    const portionBuy = arbitrationFirst8PricedPortion(eABuy, eBBuy, eCBuy);

    assert.strictEqual(portionBuy.structuralDataInsufficient, false);
    assert.strictEqual(portionBuy.untradeableProbability, 3.0);
    assert.strictEqual(portionBuy.completeExpectedValue, null);
    if (prices.items['adaptation@r0'] && prices.items['adaptation@r0'].sellMin === 5) {
      assert.strictEqual(portionBuy.knownContribution, 0);
      assert.strictEqual(portionBuy.pricedProbability, 0);
      assert.strictEqual(portionBuy.missingProbability, 97.0);
    }
  });

  // --------------------------------------------------------------------------
  // 第 10 项: 倒挂报价隔离 (buyMax > sellMin)
  // --------------------------------------------------------------------------
  it('第 10 项: 倒挂报价严格隔离，有效价置 null，原始数据保留，全站统一遵循', () => {
    // 1. 模拟数据单元测试（固定 fixture）
    const mockItems = {
      'normal_item@r0': { sellMin: 10, buyMax: 5, sellCount: 3, buyCount: 2 },
      'crossed_item@r0': { sellMin: 5, buyMax: 10, sellCount: 1, buyCount: 1 },
      'equal_item@r0': { sellMin: 10, buyMax: 10, sellCount: 2, buyCount: 2 },
      'null_buy@r0': { sellMin: 15, buyMax: null, sellCount: 5, buyCount: 0 }
    };

    const normal = getPriceEntry('normal_item', 0, mockItems);
    assert.strictEqual(normal.sellMin, 10);
    assert.strictEqual(normal.buyMax, 5);
    assert.strictEqual(normal.crossedMarket, false);

    const crossed = getPriceEntry('crossed_item', 0, mockItems);
    assert.strictEqual(crossed.sellMin, null, '倒挂条目有效卖价必须置 null');
    assert.strictEqual(crossed.buyMax, null, '倒挂条目有效买价必须置 null');
    assert.strictEqual(crossed.sellRobust, null);
    assert.strictEqual(crossed.crossedMarket, true);
    assert.strictEqual(crossed.rawSellMin, 5);
    assert.strictEqual(crossed.rawBuyMax, 10);
    assert.ok(crossed.crossedMarketReason.includes('高于最低卖价') && crossed.crossedMarketReason.includes('10 ☿'));

    const equal = getPriceEntry('equal_item', 0, mockItems);
    assert.strictEqual(equal.crossedMarket, false);

    const nullBuy = getPriceEntry('null_buy', 0, mockItems);
    assert.strictEqual(nullBuy.crossedMarket, false);

    // 2. 价格缓存不变量：所有 buyMax > sellMin 的条目，getPriceEntry 必须返回 crossedMarket: true 且有效价为 null
    const crossedKeys = [];
    const crossedBaseSlugs = new Set();

    for (const [key, entry] of Object.entries(prices.items || {})) {
      if (entry && typeof entry.sellMin === 'number' && typeof entry.buyMax === 'number' && entry.buyMax > entry.sellMin) {
        crossedKeys.push(key);
        crossedBaseSlugs.add(key.split('@')[0]);

        const [slug, suffix] = key.split('@');
        const rank = (suffix && suffix.startsWith('r')) ? parseInt(suffix.slice(1), 10) : null;
        const pe = getPriceEntry(slug, rank, prices.items);
        assert.strictEqual(pe.crossedMarket, true, `倒挂条目 ${key} 必须标记 crossedMarket: true`);
        assert.strictEqual(pe.sellMin, null, `倒挂条目 ${key} 有效 sellMin 必须为 null`);
        assert.strictEqual(pe.buyMax, null, `倒挂条目 ${key} 有效 buyMax 必须为 null`);
      }
    }

    // 3. 在标准未变异 prices.json 缓存下，验证精确键数与样本 arcane_reaper@r0 (sell 15, buy 72)
    if (prices.items['arcane_reaper@r0'] && prices.items['arcane_reaper@r0'].sellMin === 15 && prices.items['arcane_reaper@r0'].buyMax === 72) {
      assert.strictEqual(crossedKeys.length, 53, `真实缓存中倒挂键数应为 53 (实际 ${crossedKeys.length})`);
      assert.strictEqual(crossedBaseSlugs.size, 52, `真实缓存中倒挂基础 slug 数应为 52 (实际 ${crossedBaseSlugs.size})`);

      const reaperEntry = getPriceEntry('arcane_reaper', 0, prices.items);
      assert.strictEqual(reaperEntry.crossedMarket, true);
      assert.strictEqual(reaperEntry.sellMin, null);
      assert.strictEqual(reaperEntry.buyMax, null);
      assert.strictEqual(reaperEntry.rawSellMin, 15);
      assert.strictEqual(reaperEntry.rawBuyMax, 72);
    }
  });

  // --------------------------------------------------------------------------
  // 第 11 项: (Hard) (Hard) 去重与买卖双卡片
  // --------------------------------------------------------------------------
  it('第 11 项: 来源名称中消除 (Hard) (Hard) 重复，保留原 node 与 id 不变，正常后缀不受影响', () => {
    // 1. 全量扫描所有来源，绝无任何 (Hard) (Hard)
    for (const src of sources) {
      assert.ok(!src.nameEn.includes('(Hard) (Hard)'), `来源 ${src.id} nameEn 包含重复 (Hard)`);
      assert.ok(!src.nameZh.includes('(Hard) (Hard)'), `来源 ${src.id} nameZh 包含重复 (Hard)`);
    }

    // 2. 检查 6 个原 Duviri Hard 来源
    const duviriT1Hard = sources.find(s => s.id === 'mission_duviri_endless_tier_1_hard');
    assert.ok(duviriT1Hard);
    assert.strictEqual(duviriT1Hard.nameEn, 'Duviri - Endless: Tier 1 (Hard)');
    assert.strictEqual(duviriT1Hard.nameZh, '双衍王境 - Endless: Tier 1 (Hard)');
    assert.strictEqual(duviriT1Hard.node, 'Endless: Tier 1 (Hard)'); // 保留原 node 键不变

    const duviriRepeatedHard = sources.find(s => s.id === 'mission_duviri_endless_repeated_rewards_hard');
    assert.ok(duviriRepeatedHard);
    assert.strictEqual(duviriRepeatedHard.nameEn, 'Duviri - Endless: Repeated Rewards (Hard)');
    assert.strictEqual(duviriRepeatedHard.nameZh, '双衍王境 - Endless: Repeated Rewards (Hard)');

    // 3. 正常包含 Caches / Extra 等后缀的不受误伤
    const cachesSrc = sources.find(s => s.id.includes('caches'));
    if (cachesSrc) {
      assert.ok(cachesSrc.nameEn.includes('(Caches)'));
    }
  });

  // --------------------------------------------------------------------------
  // 紫卡 subtype 严格匹配不回退
  // --------------------------------------------------------------------------
  it('紫卡 subtype 严格匹配：带 @unrevealed 严格对应，不回退无 subtype 基础键', () => {
    const unrevealedKeys = Object.keys(prices.items || {}).filter(k => k.endsWith('@unrevealed'));
    if (prices.items['rifle_riven_mod_veiled@unrevealed']) {
      assert.strictEqual(unrevealedKeys.length, 8, 'prices.json 中应包含 8 种未开紫卡 @unrevealed 键');
    }

    for (const k of unrevealedKeys) {
      const slug = k.replace('@unrevealed', '');
      const entry = getPriceEntry(slug, null, prices.items);
      assert.ok(entry, `紫卡 ${slug} 必须能取到 entry`);
      // 如果未倒挂，则其 sellMin/buyMax 应来自 @unrevealed
      const raw = prices.items[k];
      if (raw.buyMax <= raw.sellMin || raw.sellMin === null || raw.buyMax === null) {
        assert.strictEqual(entry.sellMin, raw.sellMin);
      }
    }
  });
});
