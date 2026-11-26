#!/usr/bin/env node
/**
 * scripts/build-remaining-english.mjs
 * Warframe 全站汉化剩余英文统计与清单生成脚本
 * 严格按照分类统计：中文条目数 (已汉化) / 上游原样英文 / 本站回退英文 / 类别总数
 * 输出双口径指标：中文率（纯中文）与可追溯率（中文 + 官方原样）
 * 输出规范文档 docs/remaining-english.md
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const CONFIG_DIR = path.join(ROOT_DIR, 'config');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');

export function generateRemainingEnglishDocs(options = {}) {
  const targetDataDir = options.dataDir || DATA_DIR;
  const relicsPath = path.join(targetDataDir, 'relics.json');
  const arcanesPath = path.join(targetDataDir, 'arcanes.json');
  const rivensPath = path.join(targetDataDir, 'rivens.json');
  const modsPath = path.join(targetDataDir, 'mods.json');
  const sourcesPath = path.join(targetDataDir, 'sources.json');
  const zhMapPath = options.zhMapPath || path.join(CONFIG_DIR, 'zh-map.json');

  if (!fs.existsSync(relicsPath) || !fs.existsSync(zhMapPath)) {
    throw new Error('必要数据文件缺失，请先运行 build-zh-map 与 build-data！');
  }

  const relicsData = JSON.parse(fs.readFileSync(relicsPath, 'utf8'));
  const arcanesData = fs.existsSync(arcanesPath) ? JSON.parse(fs.readFileSync(arcanesPath, 'utf8')) : [];
  const rivensData = fs.existsSync(rivensPath) ? JSON.parse(fs.readFileSync(rivensPath, 'utf8')) : [];
  const modsData = fs.existsSync(modsPath) ? JSON.parse(fs.readFileSync(modsPath, 'utf8')) : [];
  const sourcesData = fs.existsSync(sourcesPath) ? JSON.parse(fs.readFileSync(sourcesPath, 'utf8')) : [];
  const zhMap = JSON.parse(fs.readFileSync(zhMapPath, 'utf8'));

  const relicsList = relicsData.relics || [];
  const itemsList = Object.values(relicsData.items || {});

  // 分类统计与清单收集
  const categories = [
    { id: 'relics', name: '遗物 (Relics)', list: relicsList, getName: r => r.name, getZh: r => r.zhName, getSource: r => r.zhSource },
    { id: 'items', name: '物品 (Items)', list: itemsList, getName: i => i.name, getZh: i => i.zhName, getSource: i => i.zhSource },
    { id: 'arcanes', name: '赋能 (Arcanes)', list: arcanesData, getName: a => a.name, getZh: a => a.zhName, getSource: a => a.zhSource },
    { id: 'rivens', name: '紫卡 (Rivens)', list: rivensData, getName: r => r.name, getZh: r => r.zhName, getSource: r => r.zhSource },
    { id: 'mods', name: 'Mod (Mods)', list: modsData, getName: m => m.name, getZh: m => m.zhName, getSource: m => m.zhSource },
    { id: 'sources', name: '掉落来源 (Sources)', list: sourcesData, getName: s => s.nameEn, getZh: s => s.nameZh, getSource: s => s.zhSource },
    { id: 'planets', name: '星球 (Planets)', list: Object.entries(zhMap.planets || {}).map(([en, v]) => ({ en, ...v })), getName: p => p.en, getZh: p => p.nameZh, getSource: p => p.zhSource },
    { id: 'missionTypes', name: '任务类型 (Mission Types)', list: Object.entries(zhMap.missionTypes || {}).map(([en, v]) => ({ en, ...v })), getName: m => m.en, getZh: m => m.nameZh, getSource: m => m.zhSource, isAsIs: m => m.isAsIs },
    {
      id: 'nodes',
      name: '节点 (Nodes)',
      list: Object.entries(zhMap.nodes || {}).map(([key, v]) => ({ key, ...v })),
      getName: n => n.key,
      getZh: n => n.nameZh,
      getSource: n => n.zhSource,
      isAsIs: n => Boolean(n.isAsIs),
      isFallback: n => Boolean(n.fallback),
      isTranslated: n => Boolean(n.deAligned || (n.zhSource && n.zhSource.startsWith('de_export:')))
    },
    { id: 'enemies', name: '敌人 (Enemies)', list: Object.entries(zhMap.enemies || {}).map(([en, v]) => ({ en, ...v })), getName: e => e.en, getZh: e => e.nameZh, getSource: e => e.zhSource, isAsIs: e => e.isAsIs },
    { id: 'bounties', name: '赏金标题 (Bounties)', list: Object.entries(zhMap.bounties || {}).map(([en, v]) => ({ en, ...v })), getName: b => b.en, getZh: b => b.nameZh, getSource: b => b.zhSource },
    { id: 'transientSources', name: '特殊来源 (Transient Sources)', list: Object.entries(zhMap.transientSources || {}).map(([en, v]) => ({ en, ...v })), getName: t => t.en, getZh: t => t.nameZh, getSource: t => t.zhSource }
  ];

  const tableSummary = [];
  const remainingEntries = [];

  let grandTotal = 0;
  let grandTranslated = 0;
  let grandAsIs = 0;
  let grandFallback = 0;

  let deNodesCount = 0;
  let asIsNodesCount = 0;
  let fallbackNodesCount = 0;

  for (const cat of categories) {
    let translatedCount = 0;
    let asIsCount = 0;
    let fallbackCount = 0;

    for (const item of cat.list) {
      const en = cat.getName(item);
      const zh = cat.getZh(item);
      const src = cat.getSource(item) || '';
      const isAsIs = (cat.isAsIs && cat.isAsIs(item)) || src.startsWith('en_as_is');
      const isFallback = (cat.isFallback && cat.isFallback(item)) || src.startsWith('en_fallback');

      if (cat.id === 'nodes') {
        if (cat.isTranslated(item)) {
          translatedCount++;
          deNodesCount++;
        } else if (isAsIs) {
          asIsCount++;
          asIsNodesCount++;
          remainingEntries.push({
            category: cat.name,
            enName: en,
            type: '资料原样英文',
            reason: `DE ExportRegions 未覆盖，上游 WFCD 官方资料原样保留英文 (source: ${src})`
          });
        } else {
          fallbackCount++;
          fallbackNodesCount++;
          remainingEntries.push({
            category: cat.name,
            enName: en,
            type: '无中文资料保留英文',
            reason: `未匹配到 DE 或 WFCD 星图节点 ID，按规范保留英文 (source: ${src})`
          });
        }
      } else {
        if (isFallback) {
          fallbackCount++;
          remainingEntries.push({
            category: cat.name,
            enName: en,
            type: '无中文资料保留英文',
            reason: `本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: ${src})`
          });
        } else if (isAsIs) {
          asIsCount++;
          remainingEntries.push({
            category: cat.name,
            enName: en,
            type: '资料原样英文',
            reason: `上游官方资料库中文版原样保留英文 (source: ${src || 'worldstate'})`
          });
        } else if (zh === en) {
          fallbackCount++;
          remainingEntries.push({
            category: cat.name,
            enName: en,
            type: '无中文资料保留英文',
            reason: `本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: ${src})`
          });
        } else {
          translatedCount++;
        }
      }
    }

    const catTotal = cat.list.length;
    grandTotal += catTotal;
    grandTranslated += translatedCount;
    grandAsIs += asIsCount;
    grandFallback += fallbackCount;

    const rate = catTotal > 0 ? `${((translatedCount / catTotal) * 100).toFixed(1)}%` : '0.0%';
    const effectiveRate = catTotal > 0 ? `${(((translatedCount + asIsCount) / catTotal) * 100).toFixed(1)}%` : '0.0%';

    tableSummary.push({
      id: cat.id,
      category: cat.name,
      translated: translatedCount,
      asIs: asIsCount,
      fallback: fallbackCount,
      total: catTotal,
      rate,
      effectiveRate
    });
  }

  const grandRate = grandTotal > 0 ? `${((grandTranslated / grandTotal) * 100).toFixed(1)}%` : '0.0%';
  const grandEffectiveRate = grandTotal > 0 ? `${(((grandTranslated + grandAsIs) / grandTotal) * 100).toFixed(1)}%` : '0.0%';

  const grandSummary = {
    total: grandTotal,
    translated: grandTranslated,
    asIs: grandAsIs,
    fallback: grandFallback,
    rate: grandRate,
    effectiveRate: grandEffectiveRate
  };

  // 渲染 Markdown
  const lines = [
    '# wf-relic-cn 汉化覆盖率与剩余英文统计报告',
    '',
    `> 生成时间：${new Date().toISOString()}  `,
    `> 数据来源：本地原始资料 \`/workspace/wf-relic-cn-raw\`（DE 官方 ExportRegions/ExportFlavour、WFCD warframe-items、warframe-worldstate-data、warframe.market v2、DE 官方掉落表）  `,
    `> 统计口径说明：  `,
    `> - **中文率**：显示名含中文的条目 / 类别总数（确切具有中文译名的条目占比）。  `,
    `> - **可追溯率**：(中文条目 + 上游原样英文条目) / 类别总数（每一条均有可靠出处的条目占比）。  `,
    `> - **中文条目数**：在官方资料库或权威数据中查找到确切中文译名（含 DE 官方节点名、依术语规范拼成的合成标题、繁简转换规范词）。  `,
    `> - **上游原样英文**：上游官方资料库中文版原样保留英文的内容（如 solNodes 中「Galatea (海王星)」的英文节点名部分、未英汉对照的固有模式等）。允许保留且计入可追溯率。  `,
    `> - **本站回退英文**：上游全部本地原始资料均无中文对应项的内容（如未命名的特殊敌人、无官方译名之掉落项等）。严格遵守硬性约束绝不自行翻译，保留英文。  `,
    '',
    '## 1. 各类别汉化覆盖率总表',
    '',
    '| 实体类别 | 中文条目数 | 上游原样英文 | 本站回退英文 | 类别总数 | 中文率 | 可追溯率 |',
    '| :--- | :---: | :---: | :---: | :---: | :---: | :---: |'
  ];

  for (const s of tableSummary) {
    lines.push(`| ${s.category} | ${s.translated} | ${s.asIs} | ${s.fallback} | ${s.total} | ${s.rate} | ${s.effectiveRate} |`);
  }
  lines.push(`| **总计 (Grand Total)** | **${grandTranslated}** | **${grandAsIs}** | **${grandFallback}** | **${grandTotal}** | **${grandRate}** | **${grandEffectiveRate}** |`);

  lines.push('');
  lines.push('### 星图节点覆盖率细分 (Item 2 专项)');
  lines.push('');
  lines.push(`- **DE 官方中文对齐**：${deNodesCount} 条（占节点总数 ${(deNodesCount / (deNodesCount + asIsNodesCount + fallbackNodesCount) * 100).toFixed(1)}%），来源为 \`de_export:ExportRegions_zh:SolNodeXX\`，并经 en 记录 name/systemName 与掉落表双重校验。`);
  lines.push(`- **上游英文原样 (as-is)**：${asIsNodesCount} 条（占 ${(asIsNodesCount / (deNodesCount + asIsNodesCount + fallbackNodesCount) * 100).toFixed(1)}%），匹配到上游 WFCD solNodeKey 但 DE ExportRegions 未收录，原样保留英文。其中传统繁体星球名已通过整词表规范化为简体。`);
  lines.push(`- **本站回退英文 (fallback)**：${fallbackNodesCount} 条（占 ${(fallbackNodesCount / (deNodesCount + asIsNodesCount + fallbackNodesCount) * 100).toFixed(1)}%），上游资料库中无 SolNode ID 对应记录，保守回退为英文。`);
  lines.push(`- **节点总数**：${deNodesCount + asIsNodesCount + fallbackNodesCount} 条，节点可追溯率：${(((deNodesCount + asIsNodesCount) / (deNodesCount + asIsNodesCount + fallbackNodesCount)) * 100).toFixed(1)}%（中文率：${((deNodesCount / (deNodesCount + asIsNodesCount + fallbackNodesCount)) * 100).toFixed(1)}%）。`);

  lines.push('');
  lines.push('## 2. 简略名系统性消除统计');
  lines.push('');
  lines.push(`- **修正简略名总数**：${zhMap.abbreviatedCorrections?.length || 0} 条`);
  lines.push('- **消除规则**：对 Prime/武器/战甲部件与蓝图，若 WFCD 中文名过于简略（不包含其父物品中文名），改用 warframe.market 完整 zh-hans 名称；若市场无完整名，则采用 WFCD 父物品官方中文名 + 官方部件名拼接（`composed:parent+part`）。');
  lines.push('');
  lines.push('### 前 30 条简略名修正清单示例');
  lines.push('');
  lines.push('| 序号 | 英文全名 | 原始简略中文 | 修正后中文名 | 父物品官方中文名 | 来源标注 (zhSource) | 采用规则 |');
  lines.push('| :---: | :--- | :--- | :--- | :--- | :--- | :--- |');

  const sampleCorrections = (zhMap.abbreviatedCorrections || []).slice(0, 30);
  for (let idx = 0; idx < sampleCorrections.length; idx++) {
    const c = sampleCorrections[idx];
    lines.push(`| ${idx + 1} | ${c.enName} | ${c.originalZh} | **${c.correctedZh}** | ${c.parentZh} | \`${c.zhSource}\` | ${c.rule} |`);
  }

  lines.push('');
  lines.push('## 3. 本站界面词与结构模板白名单说明 (Item 4 专项)');
  lines.push('');
  lines.push('所有拼接译名严格遵循 Codex 1126b 第 4 项规则，摒弃逐字放行，实行**整词受控白名单 + 固定语法模板**校验：');
  lines.push('- **允许的六个整词**：`等级`、`赏金`、`阶段`、`轮次`、`特殊`、`奖励`');
  lines.push('- **允许的六种模板**：');
  lines.push('  1. `等级 {数值或区间}`（如「等级 5-15」）');
  lines.push('  2. `{有出处名称}赏金`（如「金流恐鸟赏金」）');
  lines.push('  3. `阶段 {正整数}`（如「阶段 1」；对于非模板形式如「Stage 4 of 5」「Final Stage」，严格全段保留英文）');
  lines.push('  4. `[轮次 {A/B/C}]`（如「[轮次 A]」）');
  lines.push('  5. `（特殊）`（如「夜灵兆力使（特殊）」）');
  lines.push('  6. `{有出处名称}奖励`（如「赏金奖励」）');
  lines.push('- **拒绝规则**：任何随机重组（如「奖等」「金赏」）或不在模板内的汉字组合均被拒绝。');

  lines.push('');
  lines.push('## 4. 待 Codex 拍板事项 (Pending Codex Decision)');
  lines.push('');
  lines.push('1. **Captain Vor 中文名歧义**：WFCD sortieData 中 boss 译名为「Vor 上尉」，而 DE ExportFlavour 中浮印译名为「沃尔上尉」。按第 6 项规则，遇到歧义保守放弃汉化，保留英文 fallback，待 Codex 拍板统一命名。');
  lines.push('2. **处决者浮印所有格「的」字**：DE ExportFlavour 中处决者浮印多形如「处决者 Nok 的浮印」，剥除「浮印」后缀后保留为「处决者 Nok 的」。本站严格执行 `strip_suffix:浮印`（或 `strip_suffix:的浮印`）规则，待 Codex 拍板是否统一去掉所有格「的」。');
  lines.push('3. **特殊来源与未开紫卡模式**：如「Sanctuary Onslaught」「The Circuit」在官方掉落表与本地资料中无单一对应模式名，按规则保留英文。');

  lines.push('');
  lines.push('## 5. 剩余英文详细清单 (按类别列出每一条)');
  lines.push('');
  lines.push('| 序号 | 类别 | 英文名称 | 属性分类 | 原因 / 来源说明 |');
  lines.push('| :---: | :--- | :--- | :---: | :--- |');

  for (let idx = 0; idx < remainingEntries.length; idx++) {
    const item = remainingEntries[idx];
    lines.push(`| ${idx + 1} | ${item.category} | \`${item.enName}\` | ${item.type} | ${item.reason} |`);
  }

  lines.push('');

  fs.mkdirSync(DOCS_DIR, { recursive: true });
  const outPath = path.join(DOCS_DIR, 'remaining-english.md');
  fs.writeFileSync(outPath, lines.join('\n'), 'utf8');

  console.log(`[build-remaining-english] 文档已生成: ${outPath} (剩余条目数: ${remainingEntries.length})`);
  return {
    outPath,
    tableSummary,
    grandSummary,
    totalRemaining: remainingEntries.length,
    grandRate,
    grandEffectiveRate,
    nodeBreakdown: {
      deNodesCount,
      asIsNodesCount,
      fallbackNodesCount,
      total: deNodesCount + asIsNodesCount + fallbackNodesCount
    }
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  generateRemainingEnglishDocs();
}
