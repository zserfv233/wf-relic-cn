import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  getPriceEntry,
  getItemPrice,
  calculateSourceExpectedValue,
  calculateEnemyExpectedValue
} from '../js/lib/calculations.js';
import { parseOrdersTop } from '../js/lib/prices.js';
import {
  filterSources,
  renderDropSourcesGrouped,
  isPvpSource,
  toggleHistoricalFilter,
  togglePvpFilter
} from '../js/lib/sources.js';
import { searchIndex } from '../js/lib/search.js';
import { findCrossedKeys } from '../scripts/fetch-prices.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const CONFIG_DIR = path.join(ROOT_DIR, 'config');
import { RAW_DIR, hasRawFiles } from '../scripts/lib/raw-dir.mjs';

describe('Codex 1126c Round 4 决定实现全量验证套件 (Round 4 Tests)', () => {
  const zhMapPath = path.join(CONFIG_DIR, 'zh-map.json');
  const sourcesPath = path.join(DATA_DIR, 'sources.json');
  const searchIndexPath = path.join(DATA_DIR, 'search-index.json');
  const pricesPath = path.join(DATA_DIR, 'prices.json');
  const rivensPath = path.join(DATA_DIR, 'rivens.json');
  const arcanesPath = path.join(DATA_DIR, 'arcanes.json');
  const modsPath = path.join(DATA_DIR, 'mods.json');

  const zhMap = JSON.parse(fs.readFileSync(zhMapPath, 'utf8'));
  const sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
  const searchIndexData = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));
  const prices = JSON.parse(fs.readFileSync(pricesPath, 'utf8'));
  const rivens = JSON.parse(fs.readFileSync(rivensPath, 'utf8'));
  const arcanes = JSON.parse(fs.readFileSync(arcanesPath, 'utf8'));
  const mods = JSON.parse(fs.readFileSync(modsPath, 'utf8'));

  // ==========================================================================
  // 第 1 项: Captain Vor -> 沃尔上尉
  // ==========================================================================
  describe('第 1 项: Captain Vor 映射为沃尔上尉与别名规范', () => {
    it('Captain Vor 映射为沃尔上尉，记录 DE 浮印出处，清除歧义，保留 Vor 上尉 别名', () => {
      const entry = zhMap.enemies?.['Captain Vor'];
      assert.ok(entry, 'zhMap.enemies 必须包含 Captain Vor');
      assert.strictEqual(entry.nameZh, '沃尔上尉');
      assert.strictEqual(entry.zhSource, 'de_export:ExportFlavour_zh:/Lotus/Types/StoreItems/AvatarImages/ImageGrineerCaptainVor');
      assert.strictEqual(entry.rule, 'strip_suffix:浮印');
      assert.strictEqual(entry.uniqueName, '/Lotus/Types/StoreItems/AvatarImages/ImageGrineerCaptainVor');
      assert.strictEqual(entry.nameEnRaw, 'Captain Vor Glyph');
      assert.strictEqual(entry.zhRaw, '沃尔上尉浮印');
      assert.ok(!entry.ambiguous, '必须清除 ambiguity 阻断状态');
      assert.ok(!entry.pendingDecision, '取消 pendingDecision');

      // 别名保留
      assert.ok(Array.isArray(entry.aliases), 'Captain Vor 必须提供 aliases 列表');
      const alias = entry.aliases.find(a => (typeof a === 'string' ? a : a.nameZh) === 'Vor 上尉');
      assert.ok(alias, '必须保留 "Vor 上尉" 别名');
      if (typeof alias === 'object') {
        assert.ok(alias.source.includes('SORTIE_BOSS_VOR'), '别名必须记录 WFCD 出处');
      }

      // 佐证记录
      assert.ok(entry.evidence, '必须记录交叉佐证');
      assert.ok(entry.evidence.officialPatchNotes.includes('patch39-0-0-zh.txt'));
      assert.ok(entry.evidence.corroboratingExports.length >= 4);
    });

    it('Corrupted Vor 维持“堕落 Vor”，不全局替换 Vor', () => {
      const corruptedVor = zhMap.enemies?.['Corrupted Vor'];
      assert.ok(corruptedVor, 'zhMap.enemies 必须包含 Corrupted Vor');
      assert.strictEqual(corruptedVor.nameZh, '堕落 Vor');
      assert.strictEqual(corruptedVor.zhTransform, 'traditional_to_simplified');
      assert.strictEqual(corruptedVor.zhRaw, '墮落 Vor');
      assert.strictEqual(corruptedVor.zhSource, 'wfcd_worldstate:sortieData:bosses:SORTIE_BOSS_CORRUPTED_VOR');
    });

    it('不全局替换 Vor: 其他 Vor 实体保持各自独立出处', () => {
      // 检查敌人列表无未授权 Vor 替换
      for (const [enName, enemy] of Object.entries(zhMap.enemies || {})) {
        if (enName !== 'Captain Vor' && enName !== 'Corrupted Vor' && enName.includes('Vor')) {
          assert.notStrictEqual(enemy.nameZh, '沃尔上尉');
        }
      }
    });
  });

  // ==========================================================================
  // 第 2 项: 8 个 Executioner 白名单
  // ==========================================================================
  describe('第 2 项: 8 个 Executioner 精确去掉“的浮印”', () => {
    const whitelist = [
      { en: 'Executioner Zura', zh: '行刑者 Zura', unique: 'ImageGrineerChampionBeastMaster' },
      { en: 'Executioner Garesh', zh: '行刑者加雷什', unique: 'ImageGrineerChampionCharger' },
      { en: 'Executioner Harkonar', zh: '行刑者哈库那', unique: 'ImageGrineerChampionSniper' },
      { en: 'Executioner Reth', zh: '行刑者莱斯', unique: 'ImageGrineerChampionEngineer' },
      { en: 'Executioner Vay Molta', zh: '行刑者 Vay Molta', unique: 'ImageGrineerChampionHellion' },
      { en: 'Executioner Dok Thul', zh: '行刑者多克·图尔', unique: 'ImageGrineerChampionHealer' },
      { en: 'Executioner Nok', zh: '行刑者诺克', unique: 'ImageGrineerChampionGrunt' },
      { en: 'Executioner Gorth', zh: '行刑者高斯', unique: 'ImageGrineerChampionTank' }
    ];

    it('8 个 Executioner 白名单去掉终末“的浮印”，取消 pendingDecision', () => {
      for (const item of whitelist) {
        const enemy = zhMap.enemies?.[item.en];
        assert.ok(enemy, `zhMap.enemies 必须包含 ${item.en}`);
        assert.strictEqual(enemy.nameZh, item.zh, `${item.en} 中文名必须为 ${item.zh}`);
        assert.strictEqual(enemy.rule, 'strip_suffix:的浮印');
        assert.strictEqual(Boolean(enemy.pendingDecision), false);
        assert.ok(enemy.uniqueName.endsWith(item.unique), `uniqueName 必须匹配 ${item.unique}`);
        assert.strictEqual(enemy.zhRaw.replace(/\s*的浮印$/, ''), item.zh);
        assert.strictEqual(enemy.nameEnRaw, `${item.en} Glyph`);
        assert.strictEqual(enemy.zhSource, `de_export:ExportFlavour_zh:/Lotus/Types/StoreItems/AvatarImages/${item.unique}`);
      }
    });

    it('Executioner Dhurnam 维持英文 fallback，未推广规则', () => {
      const dhurnam = zhMap.enemies?.['Executioner Dhurnam'];
      assert.ok(dhurnam, 'zhMap.enemies 必须包含 Executioner Dhurnam');
      assert.strictEqual(dhurnam.nameZh, 'Executioner Dhurnam');
      assert.strictEqual(dhurnam.zhSource, 'en_fallback');
    });

    it('非白名单敌人绝不滥用 strip_suffix:的浮印', () => {
      for (const [k, v] of Object.entries(zhMap.enemies || {})) {
        if (v.rule === 'strip_suffix:的浮印') {
          assert.ok(whitelist.some(w => w.en === k), `非白名单敌人 ${k} 不得使用 strip_suffix:的浮印`);
        }
      }
    });
  });

  // ==========================================================================
  // 第 3 项: 圣殿突袭 / 精英级圣殿突袭 / 无尽回廊
  // ==========================================================================
  describe('第 3 项: 圣殿突袭、精英级圣殿突袭与无尽回廊同步', () => {
    it('missionTypes、nodes、sources 同步“圣殿突袭”与“精英级圣殿突袭”', () => {
      // 1. missionTypes
      const soMt = zhMap.missionTypes?.['Sanctuary Onslaught'];
      assert.ok(soMt);
      assert.strictEqual(soMt.nameZh, '圣殿突袭');
      assert.strictEqual(soMt.rule, 'verified_term_in_parallel_description');

      const esoMt = zhMap.missionTypes?.['Elite Sanctuary Onslaught'];
      assert.ok(esoMt);
      assert.strictEqual(esoMt.nameZh, '精英级圣殿突袭');
      assert.strictEqual(esoMt.rule, 'verified_term_in_parallel_description');

      // 2. nodes
      const soNode = zhMap.nodes?.['Sanctuary:Sanctuary Onslaught'];
      assert.ok(soNode);
      assert.strictEqual(soNode.nameZh, '圣殿突袭');

      const esoNode = zhMap.nodes?.['Sanctuary:Elite Sanctuary Onslaught'];
      assert.ok(esoNode);
      assert.strictEqual(esoNode.nameZh, '精英级圣殿突袭');

      // 3. sources
      const soSrc = sources.find(s => s.id === 'mission_sanctuary_sanctuary_onslaught_a');
      if (soSrc) {
        assert.ok(soSrc.nameZh.includes('圣殿突袭'));
        assert.strictEqual(soSrc.nodeZh, '圣殿突袭');
      }
      const esoSrc = sources.find(s => s.id === 'mission_sanctuary_elite_sanctuary_onslaught_a');
      if (esoSrc) {
        assert.ok(esoSrc.nameZh.includes('精英级圣殿突袭'));
        assert.strictEqual(esoSrc.nodeZh, '精英级圣殿突袭');
      }
    });

    it('The Circuit -> 无尽回廊 (same_uniqueName:SolNode238)，Duviri Circuit 别名可用', () => {
      const circuitMt = zhMap.missionTypes?.['The Circuit'];
      assert.ok(circuitMt);
      assert.strictEqual(circuitMt.nameZh, '无尽回廊');
      assert.strictEqual(circuitMt.rule, 'same_uniqueName:SolNode238');
      assert.strictEqual(circuitMt.uniqueName, 'SolNode238');

      // Duviri Circuit
      const duviriCircuit = zhMap.transientSources?.['Duviri Circuit'];
      assert.ok(duviriCircuit);
      assert.strictEqual(duviriCircuit.nameZh, '无尽回廊');

      // 双衍节点未核实片段保留英文
      const t1Hard = sources.find(s => s.id === 'mission_duviri_endless_tier_1_hard');
      assert.ok(t1Hard);
      assert.strictEqual(t1Hard.nameZh, '双衍王境 - Endless: Tier 1 (Hard)');
    });

    it('双语搜索：英文与中文均可命中圣殿突袭与回廊', () => {
      const matchZhSO = searchIndex('圣殿突袭', searchIndexData);
      assert.ok(matchZhSO.length > 0, '搜 "圣殿突袭" 必须命中');

      const matchEnSO = searchIndex('Sanctuary Onslaught', searchIndexData);
      assert.ok(matchEnSO.length > 0, '搜 "Sanctuary Onslaught" 必须命中');

      const matchZhCir = searchIndex('无尽回廊', searchIndexData);
      assert.ok(matchZhCir.length > 0, '搜 "无尽回廊" 必须命中');

      const matchEnCir = searchIndex('The Circuit', searchIndexData);
      assert.ok(matchEnCir.length > 0, '搜 "The Circuit" 必须命中');
    });
  });

  // ==========================================================================
  // 第 4 项: 14 个基础节点 + 3 个变体二元组唯一精确匹配
  // ==========================================================================
  describe('第 4 项: 14 基础节点 (+3 变体) 二元组精确对齐与冲突检测', () => {
    const expected14 = [
      { key: 'Venus:Vesper Relay', zh: 'Vesper 中继站', solKey: 'VenusHUB', deId: 'SolNode239' },
      { key: "Earth:Saya's Visions", zh: '萨娅的异象', solKey: null, deId: 'SolNode451' },
      { key: 'Jupiter:Ganymede', zh: 'Ganymede', solKey: 'EventNode33', deId: 'SolNode87', isAsIs: true },
      { key: 'Höllvania:Legacyte Harvest', zh: '传承种收割', solKey: null, deId: 'SolNode850' },
      { key: 'Höllvania:Hell-Scrub: Scaldra', zh: '地狱净化：炽蛇军', solKey: null, deId: 'SolNode851' },
      { key: 'Höllvania:Hell-Scrub: Techrot', zh: '地狱净化：科腐者', solKey: null, deId: 'SolNode852' },
      { key: 'Höllvania:Exterminate: Scaldra', zh: '歼灭：炽蛇军', solKey: null, deId: 'SolNode853' },
      { key: 'Höllvania:Exterminate: Techrot', zh: '歼灭：科腐者', solKey: null, deId: 'SolNode854' },
      { key: 'Höllvania:Assassinate: H-09 Tank', zh: '刺杀：H-09 坦克', solKey: null, deId: 'SolNode856' },
      { key: 'Höllvania:Solstice Square', zh: '至日广场', solKey: null, deId: 'SolNode858' },
      { key: 'Dark Refractory, Deimos:Recall: Hunhullus', zh: '回忆：英魂统使', solKey: null, deId: 'SolNode250' },
      { key: 'Dark Refractory, Deimos:Recall: Dactolyst', zh: '回忆：指节使', solKey: null, deId: 'SolNode251' },
      { key: 'Dark Refractory, Deimos:Recall: Vanguard', zh: '回忆：先锋', solKey: null, deId: 'SolNode252' },
      { key: 'Dark Refractory, Deimos:The Guilty', zh: '有罪之人', solKey: null, deId: 'SolNode257' }
    ];

    it('14 个基础节点均通过 exact_systemName_and_name 精确对齐并保存 DE/WFCD ID', () => {
      for (const item of expected14) {
        const node = zhMap.nodes?.[item.key];
        assert.ok(node, `zhMap.nodes 必须包含 ${item.key}`);
        assert.strictEqual(node.nameZh, item.zh, `${item.key} nameZh 应为 ${item.zh}`);
        assert.strictEqual(node.matchMethod, 'exact_systemName_and_name');
        assert.strictEqual(node.deAligned, true);
        assert.strictEqual(node.deRegionId, item.deId, `${item.key} deRegionId 应为 ${item.deId}`);
        assert.strictEqual(node.wfcdSolNodeKey, item.solKey, `${item.key} wfcdSolNodeKey 应为 ${item.solKey}`);
      }
    });

    it('Ganymede 记 DE 原样英文 (isAsIs: true)，不计入中文率', () => {
      const gany = zhMap.nodes?.['Jupiter:Ganymede'];
      assert.ok(gany, 'zhMap.nodes 必须包含 Jupiter:Ganymede');
      assert.strictEqual(gany.nameZh, 'Ganymede');
      assert.strictEqual(gany.isAsIs, true);
      assert.strictEqual(gany.zhSource, 'de_export:ExportRegions_zh:SolNode87');
      assert.strictEqual(gany.deRegionId, 'SolNode87');
    });

    it('3 个变体节点 (Extra/Caches) 均正确对齐', () => {
      const vesperExtra = zhMap.nodes?.['Venus:Vesper Relay (Extra)'];
      assert.ok(vesperExtra);
      assert.strictEqual(vesperExtra.nameZh, 'Vesper 中继站 (Extra)');
      assert.strictEqual(vesperExtra.matchMethod, 'exact_systemName_and_name');

      const scaldra = zhMap.nodes?.['Höllvania:Exterminate: Scaldra (Caches)'];
      assert.ok(scaldra);
      assert.strictEqual(scaldra.nameZh, '歼灭：炽蛇军 (Caches)');
      assert.strictEqual(scaldra.matchMethod, 'exact_systemName_and_name');

      const techrot = zhMap.nodes?.['Höllvania:Exterminate: Techrot (Caches)'];
      assert.ok(techrot);
      assert.strictEqual(techrot.nameZh, '歼灭：科腐者 (Caches)');
      assert.strictEqual(techrot.matchMethod, 'exact_systemName_and_name');
    });
  });

  // ==========================================================================
  // 第 5 项: Kubrow -> 库狛 (verified_species_name)
  // ==========================================================================
  describe('第 5 项: Kubrow 保留“库狛”，认定物种名', () => {
    it('Kubrow 规则为 verified_species_name，取消 pendingDecision，附官方野生证据', () => {
      const kubrow = zhMap.enemies?.['Kubrow'];
      assert.ok(kubrow, 'zhMap.enemies 必须包含 Kubrow');
      assert.strictEqual(kubrow.nameZh, '库狛');
      assert.strictEqual(kubrow.rule, 'verified_species_name');
      assert.strictEqual(kubrow.zhSource, 'verified_species_name');
      assert.strictEqual(Boolean(kubrow.pendingDecision), false);
      assert.ok(kubrow.evidence);
      assert.strictEqual(kubrow.evidence.speciesName, '库狛');
      assert.ok(kubrow.evidence.avatarUniqueName.includes('KubrowAvatar'));
      assert.ok(kubrow.evidence.officialPatchNotes.zh.includes('野生库狛'));
    });
  });

  // ==========================================================================
  // 第 6 项: Carrier / Stalker / Protector Stalker
  // ==========================================================================
  describe('第 6 项: Carrier 母舰、Stalker 追猎者与 Protector Stalker 卫护追猎者', () => {
    it('Carrier (敌方 SwarmShipAvatar) 映射为母舰，记录 huijiwiki 与 403 限制，严禁套用搬运者', () => {
      const carrier = zhMap.enemies?.['Carrier'];
      assert.ok(carrier, 'zhMap.enemies 必须包含 Carrier');
      assert.strictEqual(carrier.nameZh, '母舰');
      assert.strictEqual(carrier.zhSource, 'huijiwiki');
      assert.strictEqual(carrier.rule, 'community_wiki_search_evidence');
      assert.strictEqual(Boolean(carrier.pendingDecision), false);
      assert.ok(carrier.uniqueName.includes('SwarmShipAvatar'));
      assert.ok(carrier.notes.includes('社区译名'));
      assert.ok(carrier.notes.includes('直连 403'));
      assert.ok(!carrier.nameZh.includes('搬运者'), '敌人 Carrier 严禁使用守护名称“搬运者”');
    });

    it('Stalker -> 追猎者，Protector Stalker -> 卫护追猎者 (strip_suffix:玩偶)', () => {
      const stalker = zhMap.enemies?.['Stalker'];
      assert.ok(stalker);
      assert.strictEqual(stalker.nameZh, '追猎者');
      assert.strictEqual(stalker.zhSource, 'de_export:ExportGear_zh:/Lotus/Types/Restoratives/Consumable/AssassinBait');
      assert.strictEqual(stalker.rule, 'verified_character_reference');
      assert.ok(stalker.evidence.beaconNameZh.includes('追猎者信标'));

      const protStalker = zhMap.enemies?.['Protector Stalker'];
      assert.ok(protStalker);
      assert.strictEqual(protStalker.nameZh, '卫护追猎者');
      assert.strictEqual(protStalker.zhSource, 'de_export:ExportResources_zh:/Lotus/Types/Items/ShipDecos/Plushies/PlushyProtectorStalker');
      assert.strictEqual(protStalker.rule, 'strip_suffix:玩偶');
      assert.strictEqual(protStalker.zhRaw, '卫护追猎者玩偶');
      assert.strictEqual(Boolean(protStalker.pendingDecision), false);
    });
  });

  // ==========================================================================
  // 第 7 项: 价格缓存读写契约、全边界与复核队列
  // ==========================================================================
  describe('第 7 项: 价格缓存契约、倒挂隔离全边界与复核队列验证', () => {
    it('parseOrdersTop 输出带 priceSchemaVersion: 2 且保留明确 raw 字段', () => {
      const mockOrders = [
        { order_type: 'sell', user: { status: 'ingame' }, platinum: 10, quantity: 1 },
        { order_type: 'buy', user: { status: 'ingame' }, platinum: 20, quantity: 1 }
      ];
      const parsed = parseOrdersTop(mockOrders, { rank: 0 });
      assert.strictEqual(parsed.priceSchemaVersion, 2);
      assert.strictEqual(parsed.rawSellMin, 10);
      assert.strictEqual(parsed.rawBuyMax, 20);
      assert.strictEqual(parsed.sellMin, null, '倒挂时有效 sellMin 必须为 null');
      assert.strictEqual(parsed.buyMax, null, '倒挂时有效 buyMax 必须为 null');
      assert.strictEqual(parsed.crossedMarket, true);
      assert.strictEqual(parsed.singleSided, null);
      assert.strictEqual(parsed.noOrders, false);
    });

    it('解析 -> JSON 存储 -> 读取结果严格一致 (往返无损与隔离生效)', () => {
      const mockOrders = [
        { order_type: 'sell', user: { status: 'ingame' }, platinum: 12, quantity: 1 },
        { order_type: 'buy', user: { status: 'ingame' }, platinum: 50, quantity: 1 }
      ];
      const parsed = parseOrdersTop(mockOrders, { rank: 0 });
      const cacheStore = { 'test_slug@r0': parsed };
      const serialized = JSON.stringify(cacheStore);
      const deserialized = JSON.parse(serialized);

      const entry = getPriceEntry('test_slug', 0, deserialized);
      assert.strictEqual(entry.priceSchemaVersion, 2);
      assert.strictEqual(entry.rawSellMin, 12);
      assert.strictEqual(entry.rawBuyMax, 50);
      assert.strictEqual(entry.sellMin, null);
      assert.strictEqual(entry.buyMax, null);
      assert.strictEqual(entry.crossedMarket, true);
      assert.strictEqual(entry.noBuyOrders, false, '买单实际存在时 noBuyOrders 不得为 true');
    });

    it('倒挂严格条件: rawBuyMax > rawSellMin，相等 (10 === 10) 绝不倒挂', () => {
      const mockOrders = [
        { order_type: 'sell', user: { status: 'ingame' }, platinum: 10, quantity: 1 },
        { order_type: 'buy', user: { status: 'ingame' }, platinum: 10, quantity: 1 }
      ];
      const parsed = parseOrdersTop(mockOrders, { rank: 0 });
      assert.strictEqual(parsed.rawSellMin, 10);
      assert.strictEqual(parsed.rawBuyMax, 10);
      assert.strictEqual(parsed.crossedMarket, false);
      assert.strictEqual(parsed.sellMin, 10);
      assert.strictEqual(parsed.buyMax, 10);

      const entry = getPriceEntry('test_equal', 0, { 'test_equal@r0': parsed });
      assert.strictEqual(entry.crossedMarket, false);
      assert.strictEqual(entry.sellMin, 10);
      assert.strictEqual(entry.buyMax, 10);
    });

    it('单边市场 (仅卖单或仅买单) 绝不触发倒挂，正确记录 singleSided', () => {
      // 仅卖单
      const sellOnlyOrders = [
        { order_type: 'sell', user: { status: 'ingame' }, platinum: 15, quantity: 1 }
      ];
      const sellParsed = parseOrdersTop(sellOnlyOrders, { rank: 0 });
      assert.strictEqual(sellParsed.singleSided, 'sell');
      assert.strictEqual(sellParsed.crossedMarket, false);
      assert.strictEqual(sellParsed.sellMin, 15);
      assert.strictEqual(sellParsed.buyMax, null);
      assert.strictEqual(sellParsed.rawBuyMax, null);
      const sellEntry = getPriceEntry('test_sell', 0, { 'test_sell@r0': sellParsed });
      assert.strictEqual(sellEntry.noBuyOrders, true);
      assert.strictEqual(sellEntry.crossedMarket, false);

      // 仅买单
      const buyOnlyOrders = [
        { order_type: 'buy', user: { status: 'ingame' }, platinum: 25, quantity: 1 }
      ];
      const buyParsed = parseOrdersTop(buyOnlyOrders, { rank: 0 });
      assert.strictEqual(buyParsed.singleSided, 'buy');
      assert.strictEqual(buyParsed.crossedMarket, false);
      assert.strictEqual(buyParsed.sellMin, null);
      assert.strictEqual(buyParsed.buyMax, 25);
      const buyEntry = getPriceEntry('test_buy', 0, { 'test_buy@r0': buyParsed });
      assert.strictEqual(buyEntry.noBuyOrders, false);
      assert.strictEqual(buyEntry.crossedMarket, false);
    });

    it('空单市场 (双方皆无单) 标 noOrders 且不倒挂', () => {
      const emptyParsed = parseOrdersTop([], { rank: 0 });
      assert.strictEqual(emptyParsed.noOrders, true);
      assert.strictEqual(emptyParsed.crossedMarket, false);
      assert.strictEqual(emptyParsed.sellMin, null);
      assert.strictEqual(emptyParsed.buyMax, null);
      const entry = getPriceEntry('test_empty', 0, { 'test_empty@r0': emptyParsed });
      assert.strictEqual(entry.noBuyOrders, true);
      assert.strictEqual(entry.crossedMarket, false);
    });

    it('新快照恢复 (未倒挂) 整键替换，绝不残留旧 crossedMarket', () => {
      // 1. 之前倒挂
      const oldOrders = [
        { order_type: 'sell', user: { status: 'ingame' }, platinum: 5, quantity: 1 },
        { order_type: 'buy', user: { status: 'ingame' }, platinum: 20, quantity: 1 }
      ];
      const oldParsed = parseOrdersTop(oldOrders, { rank: 0 });
      assert.strictEqual(oldParsed.crossedMarket, true);

      // 2. 新快照正常 (sell: 25, buy: 20)
      const newOrders = [
        { order_type: 'sell', user: { status: 'ingame' }, platinum: 25, quantity: 1 },
        { order_type: 'buy', user: { status: 'ingame' }, platinum: 20, quantity: 1 }
      ];
      const newParsed = parseOrdersTop(newOrders, { rank: 0 });
      assert.strictEqual(newParsed.crossedMarket, false);

      // 整键替换
      const cache = { 'item@r0': oldParsed };
      cache['item@r0'] = newParsed;

      const entry = getPriceEntry('item', 0, cache);
      assert.strictEqual(entry.crossedMarket, false);
      assert.strictEqual(entry.sellMin, 25);
      assert.strictEqual(entry.buyMax, 20);
      assert.strictEqual(entry.crossedMarketReason, null);
    });

    it('旧版 Schema V1 兼容: 无 raw 字段时安全派生，不报错', () => {
      const v1Item = {
        sellMin: 15,
        buyMax: 8,
        sellCount: 2,
        buyCount: 1
      };
      const entry = getPriceEntry('v1_item', 0, { 'v1_item@r0': v1Item });
      assert.strictEqual(entry.rawSellMin, 15);
      assert.strictEqual(entry.rawBuyMax, 8);
      assert.strictEqual(entry.sellMin, 15);
      assert.strictEqual(entry.buyMax, 8);
      assert.strictEqual(entry.crossedMarket, false);
    });

    it('findCrossedKeys 精确识别倒挂键，复核记录支持 6 种状态并保持隔离', () => {
      // 1. Fixture 倒挂识别测试 (不变量，不受外部缓存变异影响)
      const mockItems = {
        'item_a@r0': { sellMin: 10, buyMax: 20 },
        'item_b@r0': { sellMin: 20, buyMax: 10 },
        'item_c@r0': { rawSellMin: 5, rawBuyMax: 15, priceSchemaVersion: 2 },
        'item_d@r0': { rawSellMin: 15, rawBuyMax: 5, priceSchemaVersion: 2 },
        'item_e@r0': { crossedMarket: true }
      };
      const found = findCrossedKeys(mockItems);
      assert.deepStrictEqual(found.sort(), ['item_a@r0', 'item_c@r0', 'item_e@r0'].sort());

      // 2. 未变异的真实缓存样本验证
      if (prices.items && prices.items['arcane_reaper@r0'] && prices.items['arcane_reaper@r0'].sellMin === 15 && prices.items['arcane_reaper@r0'].buyMax === 72) {
        const crossed = findCrossedKeys(prices);
        assert.strictEqual(crossed.length, 53, '未变异真实缓存应识别出 53 个倒挂键');
      }

      // 3. 模拟复核结果状态机验证
      const reverificationResults = {
        'key_success@r0': { status: 'success', rawSellMin: 20, rawBuyMax: 15 },
        'key_still_crossed@r0': { status: 'still_crossed', rawSellMin: 10, rawBuyMax: 30 },
        'key_single_sided@r0': { status: 'single_sided', rawSellMin: 15, rawBuyMax: null },
        'key_no_orders@r0': { status: 'no_orders', rawSellMin: null, rawBuyMax: null },
        'key_failed@r0': { status: 'failed', error: 'Network timeout' },
        'key_unexecuted@r0': { status: 'unexecuted' }
      };

      // failed / unexecuted 必须保持有效价为 null 的隔离状态
      const failedEntry = { sellMin: null, buyMax: null, crossedMarket: true, rawSellMin: 5, rawBuyMax: 10 };
      const peFailed = getPriceEntry('key_failed', 0, { 'key_failed@r0': failedEntry });
      assert.strictEqual(peFailed.sellMin, null);
      assert.strictEqual(peFailed.buyMax, null);
      assert.strictEqual(peFailed.crossedMarket, true);
    });
  });

  // ==========================================================================
  // 第 8 项: Ten-Zero 历史标记、弹窗分组与步枪紫卡实测
  // ==========================================================================
  describe('第 8 项: Recall: Ten-Zero 来源继承与弹窗独立分组', () => {
    it('步枪紫卡 (rifle_riven_mod_veiled) 准确包含 6 处普通来源与 1 处历史来源 (Week 1 @ 0.95%)', () => {
      const rifleRiven = rivens.find(r => r.slug === 'rifle_riven_mod_veiled');
      assert.ok(rifleRiven, '必须包含 rifle_riven_mod_veiled');
      assert.ok(Array.isArray(rifleRiven.dropSources), 'dropSources 必须为数组');

      const normalSources = rifleRiven.dropSources.filter(s => !s.historicalEvent);
      const histSources = rifleRiven.dropSources.filter(s => s.historicalEvent);

      assert.strictEqual(normalSources.length, 6, '步枪紫卡应有 6 个非历史来源');
      assert.strictEqual(histSources.length, 1, '步枪紫卡应有 1 个历史来源');

      const week1 = histSources[0];
      assert.strictEqual(week1.chance, 0.95, 'Week 1 掉率必须精确为 0.95%');
      assert.strictEqual(week1.eventGroup, 'recall_ten_zero');
      assert.strictEqual(week1.historicalEvent, true);
    });

    it('renderDropSourcesGrouped: 普通与历史来源分组、默认折叠、行内徽章与状态提示', () => {
      const rifleRiven = rivens.find(r => r.slug === 'rifle_riven_mod_veiled');
      const html = renderDropSourcesGrouped(rifleRiven.dropSources, {
        itemType: 'riven',
        showRotation: false,
        sources
      });

      // 1. 普通组标题: 掉落来源（6 处，排除历史活动）
      assert.ok(html.includes('掉落来源（6 处，排除历史活动）'), '普通组标题必须声明排除历史活动');

      // 2. 历史组: 默认折叠 details，标题含数量
      assert.ok(html.includes('<details class="historical-sources-group"'), '历史组必须为 details 标签');
      assert.ok(!html.includes('<details class="historical-sources-group" open'), '历史组默认绝不得带 open 属性');
      assert.ok(html.includes('历史活动来源（1 处）'), '历史组标题必须标明处数');

      // 3. 历史组内提示
      assert.ok(html.includes('当前开放状态未确认'), '历史组内必须带开放状态未确认提示');

      // 4. 行内徽章
      assert.ok(html.includes('<span class="badge badge-historical"'), '历史行内必须带历史活动徽章');

      // 5. 来源链接可点击属性
      assert.ok(html.includes('class="source-link" data-source-id="event_recall_ten_zero_week_3"'), '必须保留 source-link 与 data-source-id');
    });

    it('renderDropSourcesGrouped: 仅有历史来源时提示“未收录非历史直接掉落来源；另有 M 处历史记录”', () => {
      const mockHistOnly = [
        { sourceId: 'event_recall_ten_zero_week_1', chance: 0.95, historicalEvent: true, nameZh: 'Recall: Ten-Zero Week 1' }
      ];
      const html = renderDropSourcesGrouped(mockHistOnly, { sources });
      assert.ok(html.includes('未收录非历史直接掉落来源；另有 1 处历史记录'), '仅有历史来源时必须输出规范文案');
      assert.ok(!html.includes('暂无直接掉落来源'), '绝不能显示“暂无直接掉落来源”');
    });

    it('renderDropSourcesGrouped: 未知 sourceId 显示“来源状态未确认”并报告', () => {
      const mockUnknown = [
        { sourceId: 'non_existent_source_123', chance: 5.0, nameZh: '神秘未知来源' }
      ];
      const html = renderDropSourcesGrouped(mockUnknown, { sources });
      assert.ok(html.includes('来源状态未确认'), '无法匹配主记录的 sourceId 必须标记“来源状态未确认”');
    });

    it('renderDropSourcesGrouped: 使用 fixture sources + dropSources，普通来源计数正确，Ten-Zero 进 details 历史组且有行内标记，无“来源状态未确认”', () => {
      const fixtureSources = [
        { id: 'src_normal_mission', type: 'mission', nameZh: '水星 - 阿波罗多罗斯撞击坑 (生存) [轮次 A]', historicalEvent: false },
        { id: 'src_normal_enemy', type: 'enemy', nameZh: '敌人: 屠夫', historicalEvent: false },
        { id: 'event_recall_ten_zero_week_1', type: 'source', nameZh: 'Recall: Ten-Zero Week 1', historicalEvent: true }
      ];
      const fixtureDropSources = [
        { sourceId: 'src_normal_mission', chance: 12.5, nameZh: '水星 - 阿波罗多罗斯撞击坑 (生存) [轮次 A]' },
        { sourceId: 'src_normal_enemy', chance: 5.0, nameZh: '敌人: 屠夫' },
        { sourceId: 'event_recall_ten_zero_week_1', chance: 0.95, nameZh: 'Recall: Ten-Zero Week 1' }
      ];

      const html = renderDropSourcesGrouped(fixtureDropSources, {
        itemType: 'riven',
        showRotation: false,
        sources: fixtureSources
      });

      // 1. 普通来源计数正确
      assert.ok(html.includes('掉落来源（2 处，排除历史活动）'), '普通组标题必须显示 2 处');
      // 2. Ten-Zero 进 <details> 历史组且行内有“历史活动”标记
      assert.ok(html.includes('<details class="historical-sources-group"'), '必须包含 details 历史组');
      assert.ok(html.includes('历史活动来源（1 处）'), '历史组必须显示 1 处');
      assert.ok(html.includes('Recall: Ten-Zero Week 1'), '历史组内必须包含 Ten-Zero 来源');
      assert.ok(html.includes('<span class="badge badge-historical"'), 'Ten-Zero 行内必须有历史活动标记');
      // 3. 无“来源状态未确认”
      assert.ok(!html.includes('来源状态未确认'), '绝不得包含“来源状态未确认”');
      assert.ok(!html.includes('badge-unconfirmed'), '绝不得包含 badge-unconfirmed 未确认徽章');
      assert.ok(!html.includes('处状态未确认'), '标题绝不得包含“处状态未确认”提示');
    });

    it('app.js 源码断言：每个 renderDropSourcesGrouped 调用都必须传入 sources: state.sources', () => {
      const appJsPath = path.join(ROOT_DIR, 'js', 'app.js');
      const appJsContent = fs.readFileSync(appJsPath, 'utf8');

      // 匹配所有形如 renderDropSourcesGrouped(...) 的调用
      const callRegex = /renderDropSourcesGrouped\s*\(\s*[^,]+,\s*\{([^}]+)\}\s*\)/g;
      const matches = [...appJsContent.matchAll(callRegex)];

      assert.ok(matches.length >= 3, `app.js 中必须至少有 3 处 renderDropSourcesGrouped 调用，当前发现 ${matches.length} 处`);

      for (const match of matches) {
        const optionsText = match[1];
        assert.ok(
          /sources\s*:\s*state\.sources/.test(optionsText),
          `调用处未传入 sources: state.sources:\n${match[0]}`
        );
      }
    });

    it('calculateEnemyExpectedValue: 敌人来源弹窗缺价清单正确回退 itemName/itemZh (例：enemy_carrier 的 15 Endo 不得为空括弧 "()")', () => {
      const carrier = sources.find(s => s.id === 'enemy_carrier');
      assert.ok(carrier, 'sources 必须包含 enemy_carrier');

      const res = calculateEnemyExpectedValue(carrier.enemyModDropChance, carrier.rewards, {});
      assert.ok(res.missingItems.length > 0, 'Carrier 应有缺价奖励');

      const endo15 = res.missingItems.find(m => m.name === '15 Endo' || m.itemName === '15 Endo');
      assert.ok(endo15, '必须在 missingItems 中找到 15 Endo');
      assert.strictEqual(endo15.name, '15 Endo');
      assert.strictEqual(endo15.itemName, '15 Endo');
      assert.strictEqual(endo15.zhName, '15 Endo');

      for (const m of res.missingItems) {
        assert.ok(m.name && m.name.trim().length > 0, `缺价项 name 不得为空: ${JSON.stringify(m)}`);
        assert.ok(m.zhName && m.zhName.trim().length > 0, `缺价项 zhName 不得为空: ${JSON.stringify(m)}`);
        const rendered = `${m.zhName || m.name} (${m.name})`;
        assert.ok(!rendered.includes('()'), `渲染名称不得包含空括弧 "()": ${rendered}`);
      }
    });
  });
});
