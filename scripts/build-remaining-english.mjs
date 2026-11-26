#!/usr/bin/env node
/**
 * scripts/build-remaining-english.mjs
 * Warframe 全站汉化剩余英文统计与清单生成脚本
 * 严格按照分类统计：已汉化 / 资料原样英文 / 无中文资料保留英文 / 总数
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
    { id: 'nodes', name: '节点 (Nodes)', list: Object.entries(zhMap.nodes || {}).map(([key, v]) => ({ key, ...v })), getName: n => n.key, getZh: n => n.nameZh, getSource: n => n.zhSource, isAsIs: n => n.isAsIs },
    { id: 'enemies', name: '敌人 (Enemies)', list: Object.entries(zhMap.enemies || {}).map(([en, v]) => ({ en, ...v })), getName: e => e.en, getZh: e => e.nameZh, getSource: e => e.zhSource },
    { id: 'bounties', name: '赏金标题 (Bounties)', list: Object.entries(zhMap.bounties || {}).map(([en, v]) => ({ en, ...v })), getName: b => b.en, getZh: b => b.nameZh, getSource: b => b.zhSource },
    { id: 'transientSources', name: '特殊来源 (Transient Sources)', list: Object.entries(zhMap.transientSources || {}).map(([en, v]) => ({ en, ...v })), getName: t => t.en, getZh: t => t.nameZh, getSource: t => t.zhSource }
  ];

  const tableSummary = [];
  const remainingEntries = [];

  let grandTotal = 0;
  let grandTranslated = 0;
  let grandAsIs = 0;
  let grandFallback = 0;

  for (const cat of categories) {
    let translatedCount = 0;
    let asIsCount = 0;
    let fallbackCount = 0;

    for (const item of cat.list) {
      const en = cat.getName(item);
      const zh = cat.getZh(item);
      const src = cat.getSource(item) || '';
      const isAsIs = (cat.isAsIs && cat.isAsIs(item)) || src.startsWith('en_as_is');

      if (src.startsWith('en_fallback') || zh === en) {
        if (isAsIs) {
          asIsCount++;
          remainingEntries.push({
            category: cat.name,
            enName: en,
            type: '资料原样英文',
            reason: `上游官方资料库中文版原样保留英文 (source: ${src || 'solNodes/worldstate'})`
          });
        } else {
          fallbackCount++;
          remainingEntries.push({
            category: cat.name,
            enName: en,
            type: '无中文资料保留英文',
            reason: `本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: ${src})`
          });
        }
      } else if (isAsIs) {
        asIsCount++;
        remainingEntries.push({
          category: cat.name,
          enName: en,
          type: '资料原样英文',
          reason: `节点/任务原样保留英文，已拼接入中文星球/类型 (source: ${src})`
        });
      } else {
        translatedCount++;
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
    `> 数据来源：本地原始资料 \`/workspace/wf-relic-cn-raw\`（WFCD warframe-items, warframe-worldstate-data, warframe.market v2, DE 官方掉落表）  `,
    `> 统计口径说明：  `,
    `> - **已汉化**：在官方资料库或权威数据中查找到确切中文译名（含依官方术语规范拼成的合成标题）。  `,
    `> - **资料原样英文**：上游官方资料库原样保留英文的内容（如 solNodes 中「Galatea (海王星)」的英文节点名部分、未英汉对照的固有模式等）。允许保留且计入规范。  `,
    `> - **无中文资料保留英文**：上游全部本地原始资料均无中文对应项的内容（如未命名的特殊敌人、无官方译名之掉落项等）。严格遵守硬性约束绝不自行翻译，保留英文。`,
    '',
    '## 1. 各类别汉化覆盖率总表',
    '',
    '| 实体类别 | 已汉化 | 资料原样英文 | 无中文资料保留英文 | 类别总数 | 汉化率 (纯中文) | 规范覆盖率 (含原样) |',
    '| :--- | :---: | :---: | :---: | :---: | :---: | :---: |'
  ];

  for (const s of tableSummary) {
    lines.push(`| ${s.category} | ${s.translated} | ${s.asIs} | ${s.fallback} | ${s.total} | ${s.rate} | ${s.effectiveRate} |`);
  }
  lines.push(`| **总计 (Grand Total)** | **${grandTranslated}** | **${grandAsIs}** | **${grandFallback}** | **${grandTotal}** | **${grandRate}** | **${grandEffectiveRate}** |`);

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
  lines.push('## 3. 待 Codex 拍板事项 (Pending Codex Decision)');
  lines.push('');
  lines.push('1. **繁体任务类型保留**：上游 `wfcd-worldstate-zh/solNodes.json` 及 `missionTypes.json` 包含部分官方繁体条目（如「捕獲」「移動防禦」「刺殺」「防禦」「殲滅」「間諜」「破壞」「攔截」）。按硬性约束不做私自简繁替换，标记 `zhSource: traditional:...`。');
  lines.push('2. **星图节点英文名**：上游 `solNodes.json` 中节点名格式多为「Galatea (海王星)」，即英文节点名 + 中文星球。本站保留原样英文并计入「资料原样英文」。');
  lines.push('3. **特殊来源与未开紫卡模式**：如「Arbitrations」「Sanctuary Onslaught」「The Circuit」在原始资料任务类型与语言包中无单一对应模式名，按规则保留英文。');

  lines.push('');
  lines.push('## 4. 剩余英文详细清单 (按类别列出每一条)');
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
  return { outPath, tableSummary, grandSummary, totalRemaining: remainingEntries.length, grandRate, grandEffectiveRate };
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  generateRemainingEnglishDocs();
}
