import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isSiteWord } from '../scripts/build-zh-map.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const CONFIG_DIR = path.join(ROOT_DIR, 'config');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');
const RAW_DIR = '/workspace/wf-relic-cn-raw';

const hasRaw = fs.existsSync(RAW_DIR) && fs.existsSync(path.join(RAW_DIR, 'de-export/ExportRegions_zh.json'));

describe('Codex 1126b 第 1–6 项汉化规范与不变量测试 (Localization Round 3 Tests)', () => {
  const t2sWordsPath = path.join(CONFIG_DIR, 't2s-words.json');
  const zhMapPath = path.join(CONFIG_DIR, 'zh-map.json');
  const metaPath = path.join(DATA_DIR, 'meta.json');
  const relicsPath = path.join(DATA_DIR, 'relics.json');
  const sourcesPath = path.join(DATA_DIR, 'sources.json');
  const modsPath = path.join(DATA_DIR, 'mods.json');
  const arcanesPath = path.join(DATA_DIR, 'arcanes.json');
  const rivensPath = path.join(DATA_DIR, 'rivens.json');
  const searchIndexPath = path.join(DATA_DIR, 'search-index.json');
  const remainingDocPath = path.join(DOCS_DIR, 'remaining-english.md');

  assert.ok(fs.existsSync(t2sWordsPath), 'config/t2s-words.json 必须存在');
  assert.ok(fs.existsSync(zhMapPath), 'config/zh-map.json 必须存在');
  assert.ok(fs.existsSync(remainingDocPath), 'docs/remaining-english.md 必须存在');

  const t2sData = JSON.parse(fs.readFileSync(t2sWordsPath, 'utf8'));
  const t2sWords = t2sData.entries || t2sData;
  const zhMap = JSON.parse(fs.readFileSync(zhMapPath, 'utf8'));
  const metaData = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const relicsData = JSON.parse(fs.readFileSync(relicsPath, 'utf8'));
  const sourcesData = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
  const modsData = JSON.parse(fs.readFileSync(modsPath, 'utf8'));
  const arcanesData = JSON.parse(fs.readFileSync(arcanesPath, 'utf8'));
  const rivensData = JSON.parse(fs.readFileSync(rivensPath, 'utf8'));
  const searchIndexData = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));
  const remainingDocContent = fs.readFileSync(remainingDocPath, 'utf8');

  it('第 1 项：繁体→简体转换严格按表执行，全站生成产物中无转换表繁体词，转换条目记录 zhRaw 与 transform', () => {
    assert.ok(t2sWords.length >= 14, `t2s-words.json 应包含至少 14 条规范词条 (实际 ${t2sWords.length})`);

    const tradWords = t2sWords.map(w => w.traditional);

    // 1. 检查各生成数据产物文件，确保不含表中任何繁体词
    const dataFilesToCheck = [
      { name: 'relics.json', content: JSON.stringify(relicsData) },
      { name: 'sources.json', content: JSON.stringify(sourcesData) },
      { name: 'mods.json', content: JSON.stringify(modsData) },
      { name: 'arcanes.json', content: JSON.stringify(arcanesData) },
      { name: 'rivens.json', content: JSON.stringify(rivensData) },
      { name: 'search-index.json', content: JSON.stringify(searchIndexData) }
    ];

    for (const df of dataFilesToCheck) {
      for (const trad of tradWords) {
        assert.ok(
          !df.content.includes(trad),
          `生成文件 ${df.name} 中绝不可再包含繁体词 "${trad}"`
        );
      }
    }

    // 2. 检查 zh-map 中所有显示名 nameZh 不含表中任何繁体词
    for (const [cat, map] of Object.entries(zhMap)) {
      if (typeof map !== 'object' || cat === 'meta' || cat === 'abbreviatedCorrections') continue;
      for (const [key, item] of Object.entries(map)) {
        if (item.nameZh) {
          for (const trad of tradWords) {
            assert.ok(
              !item.nameZh.includes(trad),
              `zh-map[${cat}][${key}].nameZh ("${item.nameZh}") 不得包含繁体词 "${trad}"`
            );
          }
        }
      }
    }

    // 3. 检查转换条目记录 zhRaw 与 zhTransform
    const convertedMissionTypes = Object.values(zhMap.missionTypes || {}).filter(m => m.zhTransform === 'traditional_to_simplified');
    assert.ok(convertedMissionTypes.length === 8, `任务类型中应有 8 条繁简转换记录 (实际 ${convertedMissionTypes.length})`);
    for (const m of convertedMissionTypes) {
      assert.ok(m.zhRaw, `转换任务类型 ${m.en} 必须保存 zhRaw`);
      assert.strictEqual(m.zhTransform, 'traditional_to_simplified');
    }

    const corruptedVor = zhMap.enemies?.['Corrupted Vor'];
    assert.ok(corruptedVor, 'zhMap.enemies 必须包含 Corrupted Vor');
    assert.strictEqual(corruptedVor.nameZh, '堕落 Vor');
    assert.strictEqual(corruptedVor.zhRaw, '墮落 Vor');
    assert.strictEqual(corruptedVor.zhTransform, 'traditional_to_simplified');
  });

  it('第 2 项：节点名按 SolNode ID 精确对齐 DE ExportRegions，SolNode94 对齐阿波罗多罗斯撞击坑，未对齐保留英文并分类统计', (t) => {
    if (!hasRaw) {
      t.skip('本地原始资料不存在，跳过 DE 节点对齐测试');
      return;
    }

    // 1. SolNode94 精确对齐
    const apollodorusNode = zhMap.nodes?.['Mercury:Apollodorus'];
    assert.ok(apollodorusNode, 'zhMap.nodes 必须包含 Mercury:Apollodorus');
    assert.strictEqual(apollodorusNode.nameZh, '阿波罗多罗斯撞击坑');
    assert.strictEqual(apollodorusNode.zhSource, 'de_export:ExportRegions_zh:SolNode94');
    assert.strictEqual(apollodorusNode.deAligned, true);

    // 2. 统计各分类节点条数，不写死硬编码，断言各子集划分无缝覆盖总数
    let deAlignedCount = 0;
    let asIsCount = 0;
    let fallbackCount = 0;
    const allNodes = Object.values(zhMap.nodes || {});

    for (const n of allNodes) {
      if (n.deAligned || (n.zhSource && n.zhSource.startsWith('de_export:'))) {
        deAlignedCount++;
      } else if (n.isAsIs) {
        asIsCount++;
      } else {
        fallbackCount++;
      }
    }

    assert.strictEqual(deAlignedCount + asIsCount + fallbackCount, allNodes.length, '节点分类之和必须严格等于节点总数');
    assert.ok(deAlignedCount >= 200, `DE 对齐节点数应 >= 200 (实际 ${deAlignedCount})`);
    assert.ok(asIsCount >= 150, `上游原样英文节点数应 >= 150 (实际 ${asIsCount})`);
    assert.ok(fallbackCount >= 50, `本站回退英文节点数应 >= 50 (实际 ${fallbackCount})`);

    // 3. 校验 DE 对齐的双重一致性（英文 name/systemName 必须与掉落表一致）
    const deRegionsZhRaw = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'de-export/ExportRegions_zh.json'), 'utf8').replace(/[\r\n\t]/g, ' '));
    const deRegionsEnRaw = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'de-export/ExportRegions_en.json'), 'utf8').replace(/[\r\n\t]/g, ' '));
    const deZhMap = new Map((deRegionsZhRaw.ExportRegions || deRegionsZhRaw).map(r => [r.uniqueName, r]));
    const deEnMap = new Map((deRegionsEnRaw.ExportRegions || deRegionsEnRaw).map(r => [r.uniqueName, r]));

    for (const n of allNodes) {
      if (n.deAligned && n.solNodeKey) {
        const zhRec = deZhMap.get(n.solNodeKey);
        const enRec = deEnMap.get(n.solNodeKey);
        assert.ok(zhRec, `对齐节点 ${n.solNodeKey} 在 DE ExportRegions_zh 中必须存在`);
        assert.ok(enRec, `对齐节点 ${n.solNodeKey} 在 DE ExportRegions_en 中必须存在`);
        assert.ok(n.nameZh.startsWith(zhRec.name), `节点 ${n.solNodeKey} nameZh (${n.nameZh}) 应包含 DE 记录 (${zhRec.name})`);
      }
    }
  });

  it('第 3 项：Solaris→索拉里斯、Arbitrations→仲裁精确实体映射，证据链完整，来源分类文案修正为特殊来源', () => {
    // 1. Solaris 映射与佐证
    const solarisPlanet = zhMap.planets?.['Solaris'];
    assert.ok(solarisPlanet, 'zhMap.planets 必须包含 Solaris');
    assert.strictEqual(solarisPlanet.nameZh, '索拉里斯');
    assert.ok(solarisPlanet.zhSource.startsWith('decision:codex_1126b_item3:solaris'));
    assert.ok(solarisPlanet.evidence, 'Solaris 必须附带佐证说明');
    assert.ok(solarisPlanet.evidence.decision.includes('Codex 1126b 第 3 项决定'));
    assert.ok(solarisPlanet.evidence.flavourQuote.includes('索拉里斯工艺奖浮印'));
    assert.ok(solarisPlanet.evidence.i18nQuote.includes('索拉里斯人'));

    // 2. Arbitrations 映射与出处
    const arbitrations = zhMap.transientSources?.['Arbitrations'];
    assert.ok(arbitrations, 'zhMap.transientSources 必须包含 Arbitrations');
    assert.strictEqual(arbitrations.nameZh, '仲裁');
    assert.strictEqual(arbitrations.zhSource, 'de_web:arbitrations-update-zh.html');
    assert.strictEqual(arbitrations.rule, 'strip_suffix:任务');

    // 3. 前端界面标签文案为「特殊来源」
    const appJsContent = fs.readFileSync(path.join(ROOT_DIR, 'js/app.js'), 'utf8');
    const indexHtmlContent = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
    assert.ok(!appJsContent.includes('特殊/密室'), 'app.js 不得再出现「特殊/密室」');
    assert.ok(appJsContent.includes('特殊来源'), 'app.js 必须使用「特殊来源」');
    assert.ok(indexHtmlContent.includes('特殊来源'), 'index.html 必须使用「特殊来源」');
  });

  it('第 4 项：拼接名称受控模板白名单校验，仅允许六词与六模板，随机重组与越界中文一律拒绝', () => {
    // 正例断言：六个整词单独放行
    const allowedWords = ['等级', '赏金', '阶段', '轮次', '特殊', '奖励'];
    for (const w of allowedWords) {
      assert.strictEqual(isSiteWord(w), true, `单词 "${w}" 必须放行`);
    }

    // 正例断言：合法模板
    assert.strictEqual(isSiteWord('等级 5-15'), true);
    assert.strictEqual(isSiteWord('等级 100'), true);
    assert.strictEqual(isSiteWord('等级 0 - 100'), true);
    assert.strictEqual(isSiteWord('阶段 1'), true);
    assert.strictEqual(isSiteWord('阶段 5'), true);
    assert.strictEqual(isSiteWord('[轮次 A]'), true);
    assert.strictEqual(isSiteWord('[轮次 B]'), true);
    assert.strictEqual(isSiteWord('[轮次 C]'), true);
    assert.strictEqual(isSiteWord('（特殊）'), true);
    assert.strictEqual(isSiteWord('(特殊)'), true);

    // 反例断言：随机重组六词汉字必须被拒
    const scrambled = ['奖等', '金赏', '阶次', '轮阶', '殊特', '励奖', '级等', '次轮', '特奖', '殊级'];
    for (const s of scrambled) {
      assert.strictEqual(isSiteWord(s), false, `随机重组词 "${s}" 必须被拒绝`);
    }

    // 反例断言：不合模板的阶段表达整段被拒
    assert.strictEqual(isSiteWord('Stage 4 of 5'), false);
    assert.strictEqual(isSiteWord('Final Stage'), false);
    assert.strictEqual(isSiteWord('Stage 3 of 4, and Stage 3 of 5'), false);
    assert.strictEqual(isSiteWord('阶段 4 of 5'), false);
    assert.strictEqual(isSiteWord('阶段 3 of 4'), false);

    // 反例断言：不在受控范围内的中文词必须被拒
    assert.strictEqual(isSiteWord('巨人战舰'), false);
    assert.strictEqual(isSiteWord('奥秘隔离库'), false);
    assert.strictEqual(isSiteWord('英择谛实验室'), false);
    assert.strictEqual(isSiteWord('噩梦模式'), false);
    assert.strictEqual(isSiteWord('暗影追猎者'), false);
  });

  it('第 5 项：Eidolon 夜灵三傻只允许兆力使/巨力使/水力使，精确记录 rawName、uniqueName 与 strip_suffix:可动模型，不得推广', () => {
    const eidolons = [
      { en: 'Eidolon Teralyst', zh: '夜灵兆力使', key: 'TeralystAFItem' },
      { en: 'Eidolon Gantulyst', zh: '夜灵巨力使', key: 'TeralystBigAFItem' },
      { en: 'Eidolon Hydrolyst', zh: '夜灵水力使', key: 'TeralystRainAFItem' }
    ];

    for (const e of eidolons) {
      const entry = zhMap.enemies?.[e.en];
      assert.ok(entry, `zhMap.enemies 必须包含 ${e.en}`);
      assert.strictEqual(entry.nameZh, e.zh);
      assert.strictEqual(entry.rule, 'strip_suffix:可动模型');
      assert.ok(entry.uniqueName.endsWith(e.key), `uniqueName 应以 ${e.key} 结尾`);
      assert.strictEqual(entry.rawName, `${e.zh}可动模型`);

      // Special 变种
      const specialEntry = zhMap.enemies?.[`${e.en} (Special)`];
      assert.ok(specialEntry, `zhMap.enemies 必须包含 ${e.en} (Special)`);
      assert.strictEqual(specialEntry.nameZh, `${e.zh}（特殊）`);
      assert.strictEqual(specialEntry.rule, 'strip_suffix:可动模型');
      assert.strictEqual(specialEntry.zhSegments?.[1]?.source, 'site_word');
      assert.strictEqual(specialEntry.zhSegments?.[1]?.text, '（特殊）');
    }

    // 断言其他敌人或物品绝无 strip_suffix:可动模型 规则滥用
    for (const [enKey, enemy] of Object.entries(zhMap.enemies || {})) {
      if (!enKey.startsWith('Eidolon ')) {
        assert.notStrictEqual(enemy.rule, 'strip_suffix:可动模型', `非 Eidolon 敌人 ${enKey} 不得使用 strip_suffix:可动模型`);
      }
    }
  });

  it('第 6 项：敌人中文名全部有机械可回查出处与规则，Captain Vor 歧义拒用保持 fallback，随机抽查原始文件匹配', (t) => {
    if (!hasRaw) {
      t.skip('本地原始资料不存在，跳过敌人出处抽查测试');
      return;
    }

    const enemiesMap = zhMap.enemies || {};
    const deFlavourZhRaw = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'de-export/ExportFlavour_zh.json'), 'utf8').replace(/[\r\n\t]/g, ' '));
    const deFlavourZhMap = new Map((deFlavourZhRaw.ExportFlavour || deFlavourZhRaw).map(f => [f.uniqueName, f]));

    // 1. Captain Vor 歧义断言：必须保留英文 en_fallback
    const captainVor = enemiesMap['Captain Vor'];
    assert.ok(captainVor, 'zhMap.enemies 必须包含 Captain Vor');
    assert.strictEqual(captainVor.zhSource, 'en_fallback', 'Captain Vor 存在 Sortie "Vor 上尉" 与 Flavour "沃尔上尉" 歧义，必须为 en_fallback');
    assert.strictEqual(captainVor.nameZh, 'Captain Vor');

    // 2. 所有中文敌人必须带出处与规则（A2-A4 回退 11 个敌人后，规范汉化敌人为 26 个）
    const chineseEnemies = Object.entries(enemiesMap).filter(([, v]) => v.nameZh && /[\u4e00-\u9fa5]/.test(v.nameZh));
    assert.ok(chineseEnemies.length >= 25, `汉化敌人总数应 >= 25 (实际 ${chineseEnemies.length})`);

    for (const [enName, item] of chineseEnemies) {
      assert.ok(item.zhSource, `敌人 ${enName} 必须有 zhSource`);
      assert.ok(item.rule || item.zhSegments || item.zhTransform, `敌人 ${enName} 必须有 rule、zhSegments 或 zhTransform`);
    }

    // 3. 随机动态抽样核查 (至少 5 个中文敌人，验证中文存在于对应源文件)
    const sampled = chineseEnemies.filter(([, v]) => v.zhSource.startsWith('de_export:ExportFlavour_zh:'));
    assert.ok(sampled.length >= 5, `DE Flavour 抽取的敌人应 >= 5 (实际 ${sampled.length})`);

    for (const [enName, item] of sampled.slice(0, 5)) {
      const uniqueName = item.zhSource.replace('de_export:ExportFlavour_zh:', '');
      const flavourZh = deFlavourZhMap.get(uniqueName);
      assert.ok(flavourZh, `敌人 ${enName} 引用的 Flavour 条目 ${uniqueName} 必须在 ExportFlavour_zh 中存在`);
      assert.ok(
        flavourZh.name.includes(item.nameZh),
        `敌人 ${enName} 的中文名 "${item.nameZh}" 必须包含在原始 Flavour 文本 "${flavourZh.name}" 中`
      );
    }
  });

  it('覆盖率与双口径统计：remaining-english.md 与 meta.json 同时包含中文率与可追溯率两个指标', () => {
    // 1. meta.localization 校验
    const stats = metaData.localization?.stats;
    assert.ok(stats, 'meta.localization.stats 必须存在');

    for (const [catKey, catVal] of Object.entries(stats)) {
      assert.ok(catVal.coverage, `分类 ${catKey} 必须包含 coverage (中文率)`);
      assert.ok(catVal.effectiveCoverage, `分类 ${catKey} 必须包含 effectiveCoverage (可追溯率)`);
      assert.ok(catVal.totalCount >= catVal.translatedCount + catVal.asIsCount, `${catKey} totalCount 必须 >= translated + asIs`);
    }

    // 2. remaining-english.md 文本核查
    assert.ok(remainingDocContent.includes('中文率'), 'remaining-english.md 必须包含「中文率」');
    assert.ok(remainingDocContent.includes('可追溯率'), 'remaining-english.md 必须包含「可追溯率」');
    assert.ok(remainingDocContent.includes('星图节点覆盖率细分'), 'remaining-english.md 必须包含「星图节点覆盖率细分」');
  });
});
