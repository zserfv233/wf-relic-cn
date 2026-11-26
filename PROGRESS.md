# PROGRESS — wf-relic-cn（Antigravity 通道）

## 2026-11-25 23:57 AEDT（墨尔本时间）
- 当前阶段：阶段 1（遗物部分 + 数据/价格基础设施），Antigravity（agy CLI, gemini-3.8-flash-high）后台运行中。
- 已完成：
  - 建目录 /workspace/wf-relic-cn，git init，作者 zserfv233 <zserfv233@users.noreply.github.com>。
  - 原始数据下载到 /workspace/wf-relic-cn-raw/：WFCD drop-data all.json（https://drops.warframestat.us/data/all.json）、WFCD warframe-items Relics.json、i18n/zh.json、DE 官方掉落表 HTML（https://www.warframe.com/droptables）、warframe.market /v2/items（在 Mac 上抓取后复制过来）。
  - 核实：warframe.market 主站 v2 API 直接覆盖未开紫卡（如 rifle_riven_mod_veiled，tags 含 veiled_riven），/v2/orders/item/{slug}/top 支持 ?rank=N；top 返回不保证按价格排序。
- 阻塞点：
  - box 访问 api.warframe.market 被 Cloudflare 403（"Just a moment..."）。临时方案：价格脚本在用户 Mac（能 200 访问）上运行，结果复制回 box。已记录为决策问题待总管/Codex 拍板。
  - 第一次启动 agy 时被 shell 中断（context canceled，0 turns，没有消耗），23:55 重新以 setsid 后台启动。
- 下一步：等 agy 阶段 1 结束 → 跑测试/构建 → 抽查掉率 → Mac 上跑价格脚本 → 阶段 2（赋能/紫卡/Mod）。

## 2026-11-26 00:16 AEDT
- 阶段 1 结束：agy conversation 3962e26c-a398-4e5a-94a0-7eaa8dc46a18，SUCCESS，本地提交 403687a（作者 zserfv233）。npm test 22/22 通过（通道复跑确认）。
- 通道复核发现的问题：
  1. data/prices.json 是假数据：fetch-prices --fixture 把同一份 fixture 价格写进了全部 603 个 slug（例如 saryn_prime_neuroptics_blueprint 与 vectis_prime_blueprint 都是 18/12），meta 里“覆盖率 100%”不成立。需删除并改为真实抓取。
  2. 真实抓取路径没写 fetchedAt（第 153 行），增量缓存会失效。
  3. Requiem I–IV：DE 掉落表里没有赤毒虹吸器/洪流的掉落，WFCD Relics.json 标 vaulted=true，所以目前被判为“已入库”——与游戏实际不符，待决策。
  4. 可获取 36 个：通道独立统计 DE 表任务/赏金中出现的遗物名（Lith/Meso/Neo/Axi）为 35 个 + Requiem Eterna = 36，一致。
- 下一步：阶段 2（修复 1–3 + 赋能/紫卡/Mod + 刷取来源期望值），然后在 Mac 上跑真实价格抓取。

### 自检 2026-11-26 00:16 AEDT（agy 新对话, effort low, 只读）
自检失败：脚本误用 --effort low 与 -high 模型冲突（agy 报 invalid model selection），已改用 gemini-3.8-flash-low

## 2026-11-26 00:39 AEDT
- 阶段 2 完成：
  - A1 修复：已删除 fixtures/prices-seed.json；data/prices.json 重置为真实空缓存 {updatedAt:null, items:{}}；--fixture 模式已严格隔离，默认绝不改写 data/prices.json（已增加自动化回归单测）；meta.json 价格覆盖率如实反映抓取状态（0.0%）；页面在无价格时正确展示“暂无价格（未抓取）”，期望值展示“—”。
  - A2 修复：真实抓取路径与解析结果确保写入 ISO 时间戳 fetchedAt，增量缓存正常生效。
  - A3 修复：新增 config/status-overrides.json，将 Requiem I/II/III/IV 状态覆盖为 "unlisted"（特殊来源：DE 掉落表未列出，按游戏机制不入库，来源标注“待确认：DE 掉落表未覆盖此来源”）。界面默认包含 unlisted，并提供开关可手动排除。
  - B 价格脚本扩展：scripts/fetch-prices.mjs 支持独立在无 raw 数据的机器上运行；支持 --only relics,rivens,arcanes,mods（默认 all）、--limit、--max-age-hours、固定并发 1、≤3 req/s 严格限速；赋能与 Mod 支持 rank 价格区分（`${slug}@r0` 与 `${slug}@r{maxRank}`）；按类别优先级流水抓取并分阶段即时持久化写入；meta.json 同步记录分项与全量覆盖率。
  - C 新增数据集：生成 data/arcanes.json（170 个）、data/rivens.json（8 个）、data/mods.json（751 个）、data/sources.json（2061 个统一来源记录）、data/unmatched.json（657 个未匹配项）。
  - D 前端界面扩展：增加顶部分类导航（遗物 / 赋能 / 紫卡 / Mod / 刷取来源）；提供多维筛选、排序与单项反查弹窗；刷取来源支持按每次/每击杀期望白金排序（任务为掉率×价格，敌人为 Mod掉落率×物品掉率×价格）。
  - E 测试验证：npm test 运行 7 个测试套件，29 个用例全部通过（覆盖敌人/轮次期望值、rank 价格键、紫卡匹配、中文/拼音命中赋能/Mod、fixture 不写 prices.json、fetchedAt 写入、unlisted 筛选等）。


## 2026-11-26 00:42 AEDT（通道）
- 阶段 2 结束：commit 0758ea4，npm test 29/29 通过（通道复跑）。
- 通道复核：遗物掉率 vs DE 官方掉落表 HTML 全量比对 3194/3197 个“遗物×精炼档”一致；唯一不一致是 Meso D1 第二个 2X Forma 槽位（bug），交阶段 3 修。
- 真实价格抓取已在用户 Mac 上启动（box 被 Cloudflare 403），约 2.5 req/s，共约 2400 个键。
- 阶段 3 启动：Meso D1 bug、NX 数量前缀、稀有度来源、价格口径说明。

### 自检 2026-11-26 00:42 AEDT（agy 新对话, gemini-3.8-flash-low, 只读）
结论: 正常
理由：阶段 2 已顺利交付并产生 commit 0758ea4，测试 29/29 全通；00:42 刚刚启动阶段 3，agy 后台进程 (PID 476982) 处于活跃运行状态；各阶段推进间隔合理，不存在 30 分钟无进展、同一问题反复卡阻或进程挂掉的情况。
建议：保持当前后台任务运行，等待阶段 3（Meso D1 修复与数量/稀有度规范）执行完毕以及 Mac 端的真实价格抓取数据同步。

## 2026-11-26 00:53 AEDT
- 阶段 3 完成：
  1. Meso D1 同名奖励槽位掉率配对修复：
     - 精炼状态合并由原名称 find 改为基于槽位索引与同名物品出现顺序配对（`getRewardForSlot`）。
     - Meso D1 两个 "2X Forma Blueprint" 槽位四档掉率严格按 DE 官方掉落表分离：
       - 槽位 1：完整 11%、优良 13%、无暇 17%、光辉 20%；
       - 槽位 2：完整 25.33%、优良 23.33%、无暇 20%、光辉 16.67%。
     - 自动化单测覆盖：断言 Meso D1 两个 Forma 槽位四档掉率与稀有度；断言全量 799 个标准遗物四个精炼等级（完整/优良/无暇/光辉）每档 6 个奖励掉率之和均为 100 ± 0.1%。
  2. "NX " 数量前缀解析与白金期望值倍率计算：
     - 构建脚本封装 `parseQuantityAndName` 解析形如 "3X Arcane Energize"、"2X Forma Blueprint"、"2X Riven Sliver" 的数量前缀与基础物品名；
     - 基础物品自动匹配 market slug（如 `arcane_energize`）；
     - 期望白金值统一按 chance × quantity × 单价 计算，并在遗物卡片预览、遗物详情表格、物品反查与掉落来源中展示“×N”数量标签；
     - 重跑构建后 `data/unmatched.json` 未匹配条目从 657 降至 618，自动化测试断言 `unmatched.json` 中不存在任何去除前缀后可匹配 market 的遗留条目（39 种带数量前缀赋能/矿石成功关联 market）。
  3. 稀有度显示严格遵循 DE 官方掉落表（drops_all.json）：
     - 移除根据掉率概率阈值覆盖稀有度的代码，直接使用 DE 原表 `rarity` 字段；
     - Lith A1 Braton Prime Barrel 正确呈现为 Uncommon（25.33%）；单测断言通过。
  4. 官方价格与期望值口径明确公示：
     - 在页面（遗物视图顶栏通知、遗物弹窗期望值看板、页面页脚）和 `README.md` 中写明：“价格取 warframe.market /v2/orders/item/{slug}/top 返回订单中的最低卖价/最高收购价，仅代表抓取时刻；遗物期望值不含 Forma 等不可交易物”；单测断言通过。
  5. 价格缓存严格未改动：
     - 本阶段严格未修改 `data/prices.json`，保持真实空缓存状态等待外部实际抓取覆盖。
  6. 测试验证：
     - 运行 `node scripts/build-data.mjs --raw /workspace/wf-relic-cn-raw` 数据构建全部成功。
     - 运行 `npm test`，7 个测试套件，37 个用例全部通过（37 passed, 0 failed）。

## 2026-11-26 00:57 AEDT（通道）
- 阶段 3 结束：commit 6645b61，npm test 37/37；通道复核：全量遗物掉率 vs DE 表 3197/3197 一致（Meso D1 已修）；稀有度、NX 前缀已确认。
- Mac 真实价格抓取完成：2453 键 0 失败（约 00:41–00:56），已复制回 data/prices.json 并本地提交。
- 发现 meta 覆盖率口径 bug（build-data 重写 meta 后出现 159.3%、分类 0%）→ 阶段 4 修复。
- 自检脚本改用 gemini-3.8-flash-low（-high 与 --effort 冲突）。

## 2026-11-26 01:04 AEDT
- 阶段 4 完成：
  1. 价格覆盖率统一计算与口径修复：
     - 在 `js/lib/prices.js` 中封装纯函数 `calculatePriceCoverage` 与 `computeCategoryStats`，供 `scripts/build-data.mjs` 和 `scripts/fetch-prices.mjs` 统一调用；
     - 各分类应抓键数与覆盖口径明确对齐：relics 唯一样本 603、rivens 8、arcanes 340（170个×2档）、mods 1502（751个×2档），总应抓键数 2453；
     - 真实价格覆盖统计：relics 603/603 (100.0%)、rivens 8/8 (100.0%)、arcanes 340/340 (100.0%)、mods 1490/1502 (99.2%)、全量 2441/2453 (99.5%)；
     - 确保各分类及全量覆盖率严谨计算且数学上严格 ≤ 100.0%；
     - `data/meta.json` 准确同步保存 `prices.updatedAt`（取自 `data/prices.json` 的 `2026-11-25T13:56:27.424Z`）及各类别详细指标。
  2. 前端价格展示规范与排序验证：
     - 价格缺失（null）物品统一展示为“暂无挂单”而非 0；
     - 遗物四档期望白金值、赋能与 Mod 各等级价格、紫卡交易价、刷取来源每次/每击杀期望白金均准确加载并支持按期望值正常排序；
     - 页面页脚如实呈现最新“价格更新时间”、全量覆盖率及遗物/紫卡/赋能/Mod 各分类覆盖明细。
  3. 本地静态服务器与接口可用性验证：
     - 启动 `python3 -m http.server 8000` 并使用 `curl` 逐项验证 `index.html` 以及 `data/` 下全部 8 个 JSON 文件（`relics`, `prices`, `meta`, `arcanes`, `rivens`, `mods`, `sources`, `search-index`），全部返回 HTTP 200 OK 且响应完整，测试完毕后正常清理释放服务。
  4. 自动化测试与版本库：
     - 新增 `test/coverage.test.mjs` 针对真实 `data/prices.json` 断言各分类应抓数与 ≤ 100.0% 覆盖率；
     - 运行 `npm test`，8 个测试套件，40 个测试用例全部通过（40 passed, 0 failed）；
     - 本地完成 Git 提交（不加远端、不推送）。

## 2026-11-26 01:10 AEDT
- 阶段 5 完成：
  1. 修复公式未渲染与 LaTeX 标记清理：
     - 在 `index.html`（第 142 行）横幅中，将未渲染的 LaTeX 占位符替换为纯文本与 Unicode 符号公式：“任务/赏金来源每次期望白金 = Σ(掉率% × 数量 × 价格)；敌人来源每击杀期望白金 = Mod 掉落几率(enemyModDropChance%) × Σ(物品掉率% × 价格)。赋能与 Mod 默认按 0 级掉落价格计入。”；
     - 在 `js/app.js`（来源详情弹窗）中同步更新期望值公式说明为 `Σ(几率% × 数量 × 单价)`；
     - 在 `README.md` 与 `PROGRESS.md` 中全面清理所有 LaTeX 公式与符号，改用原生字符 `Σ`、`×`、`≥`、`≤`；
     - 使用全仓 grep 验证（排除 node_modules 与 data）确认已无任何 LaTeX 公式关键字与反斜杠符号残留；
  2. 保持数据原样与验证测试：
     - 严格未修改 `data/` 目录；
     - 运行 `npm test`，8 个测试套件，40 个用例全部通过（40 passed, 0 failed）；
     - 完成本地 Git 提交（不加远程、不推送）。

## 2026-11-26 01:13 AEDT（通道）
- 全部阶段完成，DONE.md 已写，npm test 40/40，截图 9 张在 /workspace/wf-relic-cn-shots/。SendToAgent 工具在本执行子代理中不可用，已由最终回报交给父代理转总管。

## 2026-11-26 08:08 AEDT（通道）
- 新任务：刷取来源 PvP（Conclave/武形秘仪）标记与筛选。
- 工作区干净，main 已与 origin/main 同步（edb50a3），已从最新 main 新建本地分支 feat/pvp-filter。不推送、不改 .github/workflows、不改 data/prices.json 价格内容。
- 通道预统计（基于当前 data/sources.json，待构建脚本落地后再复核）：gameMode==="Conclave" 且名称含 "(Conclave)" 的来源 45 条，无其它 pvp-ish 命中。
- 下一步：agy 在 feat/pvp-filter 实现并测试，通道复核、截图、追加 DONE.md。

## 2026-11-26 08:15 AEDT
- PvP 筛选完成：
  1. 数据层标记（scripts/build-data.mjs & js/lib/sources.js）：
     - 封装 `isPvpSource` 识别函数（识别 `gameMode === 'Conclave'`、名称/节点/模式中含 `(Conclave)`、独立词 `Conclave` 或 `武形秘仪`）；
     - 构建全量 2061 处掉落来源，精准识别出 45 条 PvP 来源（挂载在土星与海王星节点下），无任何普通任务误标；
     - 每条来源均添加 `isPvp` 布尔字段；并在 `data/meta.json` 准确记录 `pvpSources: 45`（保留原价格覆盖率口径与 prices.json 价格原样）；
  2. 界面与交互（index.html, js/app.js, css/style.css）：
     - 刷取来源卡片与详情弹窗中，PvP 来源显示专属红色「PvP」徽章；
     - 来源类型筛选栏增加「⚔️ PvP」切换按钮（默认未选中，点击切换只看 PvP 来源，再次点击返回常规来源）；
     - 默认非 PvP 视图下显示提示栏：“💡 提示：当前页面不包含 PvP 来源，可点击「PvP」按钮查看。”；进入 PvP 视图后自动更新为：“⚔️ 提示：当前仅显示 PvP（武形秘仪 / Conclave）来源，可再次点击「PvP」按钮返回常规掉落。”；
     - 页面计数器（如“共 2016 处掉落来源”与“共 45 处掉落来源”）随筛选实时动态响应；
  3. 测试与回归（test/pvp.test.mjs）：
     - 新增 `test/pvp.test.mjs` 测试套件（包含全量来源 isPvp 格式与 Conclave 对应断言、45 条精准数量断言、isPvpSource 纯函数边界与负向用例断言、filterSources 纯函数默认排除与开启 PvP 断言、两次 build-data 逻辑幂等回归断言）；
     - 运行 `npm test` 全部 9 个测试套件，45 个测试用例全部通过（45 passed, 0 failed）；
  4. 分支与版本：
     - 在本地分支 `feat/pvp-filter` 提交，不改远程，不推送，不修改 `.github/workflows`。

## 2026-11-26 08:18 AEDT（通道）
- PvP 轮次复核完成：npm test 45/45；45 条 Conclave 来源全部 isPvp、0 漏标/误标（对照 DE 表 15 节点×3 轮次）；截图 10/11 已存。工作区仅剩本段与 DONE.md 待提交。

### 自检 2026-11-26 08:18 AEDT（agy 新对话, gemini-3.8-flash-low, 只读）
结论: 正常
理由：新任务（PvP 标记与筛选）于 08:08 启动并在 08:15 顺利完成代码提交（859d3e2），08:18 通道复核通过且 45/45 测试全部 PASS；当前时间 08:18，距上次提交仅 3 分钟，无 30 分钟停滞、同一问题反复卡阻或认证异常。
建议：当前轮次开发与复核均已就绪，按通道计划完成本段进度与 DONE.md 的收尾记录即可。

## 2026-11-26 08:27 AEDT（通道）— 数学内核修复（fix/math-kernel）
- 依据：Codex 审查报告 /workspace/review_wf_math/codex_review.md（通道已通读）。
- worktree：/workspace/wf-relic-cn-math，分支 fix/math-kernel（基于 feat/pvp-filter ca753c8）。主目录 /workspace/wf-relic-cn 不碰。npm ci 已在 worktree 内安装。
- 改前基线（通道用当前内核独立跑，/workspace/wf-relic-cn-notes/before_table.json）：Nightmare 12.31p（概率和 300.03%）、仲裁 2.04p、Lith A1 4.33/4.67/5.16/5.77p、ETERNA 5.89/0/0/0p、Conclave Saturn Cephalon Capture Rot A 19.52p、bounty 来源 0 条、来源 2061 条但唯一 id 仅 1956。
- 计划：阶段 M1（项 1、2、7、8：轮次/赏金/仲裁/改名/概率和/null/去重/唯一 id/未取整排序），阶段 M2（项 3–6：稳健价/低置信、ETERNA、赋能换算与去回退、紫卡 subtype 与去重）。

## 2026-11-26 09:05 AEDT
- 阶段 M1 完成（数学内核修复）：
  1. 轮次保留与独立拆分：transientRewards 等特殊表拆分为独立轮次来源（带 `_a`/`_b`/`_c` 等后缀），Nightmare Mode Rewards 拆为 A/B/C 三个独立来源，卖价口径下复算 EV 分别为 A≈4.0439p、B≈2.4649p、C≈5.802p，单测覆盖。
  2. 赏金解析：六类赏金（cetusBountyRewards、solarisBountyRewards、deimosRewards、zarimanRewards、entratiLabRewards、hexRewards）按 `(bountyLevel, rotation, stage)` 分组生成 299 个 type='bounty' 独立来源，验证 Cetus 首项 `Level 5 - 15 Cetus Bounty` 轮次 A Stage 1 Redirection 掉率为 20%。
  3. 仲裁单独处理：Arbitrations 拆分为 A/B/C 三个来源，卖价 EV 分别为 A=0.67p、B=0.65p、C=0.715p，标注 rotationPattern 提示（仲裁为 AABBCCCC…，不套用 AABC；常规无限任务标注常见 AABC 仅供参考）。
  4. 期望单位文案更新：前端与横幅将“单次通关期望”规范为四种精准单位：「单人单次开启期望」（遗物）、「单阶段单次发奖期望」（赏金）、「单轮次单次发奖期望（抽一次 X 轮奖励表）」（轮次任务）、「每击杀期望」（敌人）。
  5. 概率和核对：计算各来源 probabilitySum 并标记 probabilityCheck（>100.15% 标 'over'，<99.85% 标 'under'，其余 'ok'，不自动归一化），前端对 over/under 给予明示提示。
  6. 缺价与未知概率处理：null 贡献不记 0，增加 expectedValueRaw、incomplete、pricedProbability、missingProbability、untradeableProbability 及各类计数；Forma Blueprint 确认为不可交易记 0 并归类 untradeable；前端展示「不完整估值」徽章及已计价概率合计。
  7. 来源 ID 唯一与重复表去重：全局保证 2394 处来源 id 唯一（两个 Jackal 分别分配 enemy_jackal 与 enemy_jackal_2）；精确去重同一段奖励列表整体重复 k 次的表（Europa Cryotic Front 45 项去重至 15 项，标记 dedupedRepeats: 3）。
  8. 排序使用未取整值：表格及列表排序统一使用 expectedValueRaw。
  - 自动化单测：新增 test/math_kernel_m1.test.mjs（9 个用例），npm test 10 个测试套件 54 个测试全部通过（54 passed, 0 failed）。

## 2026-11-26 09:34 AEDT
- 阶段 M2 完成（数学内核修复与测试去快照化）：
  1. 稀疏卖单稳健取价与低置信（LOW_CONFIDENCE_MIN_SELLERS = 3）：
     - 派生 `lowConfidence`（挂单数 < 3 或最低价缺失）与 `noBuyOrders`；
     - 期望值函数额外输出 `expectedValueConfidentRaw`、`expectedValueConfident`、`lowConfidenceCount`、`lowConfidenceProbability`；
     - 默认排序及推荐使用 confident 高置信值；卡片/详情同时呈现“含低置信项的值”与“仅高置信值”，并附带「低置信」标记；
     - 买卖双向价格独立显示（卖单参考收益 / 买单参考即时出售收益），不合成单一边际数；
     - `fetch-prices.mjs` 增加每侧样本保存与卖家去重，实现 `sellRobust`（最低 min(3, n) 单中位数），旧缓存兼容标记 `robustUnavailable: true`。
  2. Requiem ETERNA 处理：
     - 不存在的精炼档（exceptional/flawless/radiant）期望值返回 `null`（不记为 0），界面该档禁用并显示“不适用”；
     - 标记 `dataConflict: true`，说明文字引用官方 DE 掉落表 8×9.5%=76% 与 Update 42 PC 更新说明 12.5% 等概率资料冲突；
     - 遗物期望值处注明“单人单次开启”。
  3. 赋能满级合成换算与串级回退清理：
     - 实现 `arcaneCopiesForRank(r) = (r+1)(r+2)/2`（Rank 5 需 21 个，Rank 3 需 10 个，非法返回 null）；
     - 计算 `perR0EquivalentSell` 与 `perR0EquivalentBuy`，展示“满级折合每个 0 级 ≈ X p（卖）/ Y p（买）”，注明独立策略及未计成本提示；
     - 严格移除串级回退：`getItemPrice` 指定 rank 时若 `${slug}@r${rank}` 不存在直接返回 `null`，禁止回退到基础 slug。
  4. 紫卡价格与分类互斥：
     - 价格键扩展 subtype（`${slug}@unrevealed`）；旧缓存读取回退标记 `subtypeUnknown: true` 并在界面提示“旧缓存未区分子类型”；
     - `mods.json` 彻底剔除 `companion_weapon_riven_mod_veiled`（条目数 773 -> 772），与 `rivens.json` 的 slug 集合保持严格互斥。
  5. 来源 ID 格式合规化：
     - 全量 2394 处来源 ID 严格匹配 `/^[a-z0-9]+(_[a-z0-9]+)*$/`，消除尾部下划线及连续双下划线，保证 100% 格式合规且唯一。
  6. 测试去快照化与不变量重构（总管新增）：
     - 全面重构 `test/coverage.test.mjs`、`test/pvp.test.mjs`、`test/vaulted.test.mjs`、`test/rivens.test.mjs`、`test/chances.test.mjs` 等套件，将写死数字替换为数据结构重算的不变量断言；
     - 覆盖率验证满足 `pricedCount <= totalCount` 且 `rate >= COVERAGE_FLOOR (0.90)`；
     - 在 `os.tmpdir()` 验证临时副本变动下不变量成立，真实 `data/prices.json` 严格保持只读与无变更；
     - 算法与公式测试改用固定价格字典 fixture，解耦实时行情波动；
     - 新增 `test/math_kernel_m2.test.mjs` 验证 M2 各项要求；
     - 全量测试回归：`npm test` 11 个测试套件 62 个测试全部通过（62 passed, 0 failed）。

## 2026-11-26 09:48 AEDT
- 阶段 M3 完成（价格依赖消除与变异价格不变量验证脚本）：
  1. 消除测试对实时价格的偶合依赖：
     - `test/math_kernel_m1.test.mjs`（第 7 项 ECF 去重测试）：将 Europa Cryotic Front 1.994p 断言迁移至固定测试基准价格常量 `FIXTURE_PRICES`；对真实行情价格只断言结构不变量（去重后 15 项、dedupedRepeats=3、概率和≈100.04%，实际 EV 仅断言有限正数或 null），彻底解决上游价格或测试副本价格变动导致的假阳性。
     - `test/math_kernel_m2.test.mjs`（第 3 项 Requiem ETERNA 测试）：增加 `eternaFixturePrices` 测试固定价格字典，对 intact 档 5.89p 的期望计算公式断言基于 fixture 进行；真实数据断言结构不变量（intact 为有限正数或 null、其余三档及不支持精炼档严格为 null 且 unsupportedRefinement=true）。
     - `test/pvp.test.mjs`：当原始 DE 掉落表 `/workspace/wf-relic-cn-raw/drops_all.json` 不存在时（如 CI / Actions 环境），安全跳过与 raw 重算的数值断言，并始终断言核心不变量：“sources 中 gameMode==='Conclave' 的来源数 == isPvp 来源数”及 meta 统计严格一致。
  2. 新增可重复变异价格核验脚本：
     - 新增 `scripts/check-invariants-with-mutated-prices.mjs`（不包含在 npm test 中，避免日常运行减速）；
     - 脚本执行逻辑：将仓库复制至 `os.tmpdir()` 临时环境，变异 prices.json（删除 60 条价格、卖价×1.3+2、买价×0.8、sellCount 改为 1-5），透传 `--raw` 参数执行 `build-data.mjs`，运行 `node --test` 验证全量 62 个测试在变异价格环境下全部 PASS；
     - 最终安全递归删除临时目录，返回子进程退出码，断言真实 `data/prices.json` 未受写操作。
  3. 测试与版本验证：
     - 执行 `npm test`：11 个套件 62 个测试全部通过；
     - 执行 `node scripts/check-invariants-with-mutated-prices.mjs --raw /workspace/wf-relic-cn-raw`：62 个测试全部通过；
     - `data/meta.json` 中仅 `builtAt` 变动已通过 `git checkout -- data/meta.json` 干净还原。




## 2026-11-26 10:08 AEDT — 通道复核（fix/math-kernel，M1–M3）
- 当前阶段：数学内核修复完成，待总管/Codex 验收；未推送、未改 workflows、未抓价、data/prices.json 未变（git diff 6ac4946 -- data/prices.json .github 为空）。
- 已完成：rebase 到 main 6ac4946（无冲突）；M1 bb6ccef、M2 c61ce01、M3 8625bd4；npm test 62/62。
- 通道独立复核：indep_ev.py（raw drops_all + prices.json）与新内核一致：Nightmare A/B/C 4.0439/2.4649/5.8020，仲裁 A/B/C 0.67/0.65/0.715，Cetus L5–15 A Stage1 0.2，Cryotic Front 去重后 1.994。
- 第 9 项：通道用两份不同变异的临时 prices 副本（复制仓库到 /workspace/wf-math-invariant-check，删 60/85 条、改价、改 sellCount，重建）跑 npm test：M2 版 2 个失败（Cryotic 1.994、ETERNA 5.89 依赖实时价）→ M3 修复后均 62/62；模拟无 raw（CI）61 pass + 1 skip。
- 截图：/workspace/wf-relic-cn-shots/12–22（docs-shots/ 有拷贝），截图时无页面 JS 报错。
- 自检（flash-low）：结论正常。
- 中断记录：通道子进程 09:1x 被外部中断一次，按 PROGRESS 恢复，agy 进程未受影响。
- 下一步：等待总管验收；汉化未开始（等总管单独安排）。
- 阻塞/待 Codex 拍板：见 DONE.md 本轮记录。

## 2026-11-26 10:11 AEDT — 汉化轮开始（feat/zh-localization，worktree /workspace/wf-relic-cn-zh，基于 0dc1f4a）
- 资料：通道已下载 WFCD warframe-items（7fecf34）与 warframe-worldstate-data（e88c866）zh/en 到 /workspace/wf-relic-cn-raw（SOURCES-zh.md）。
- 阻塞记录：灰机 wiki api.php 从 box 访问返回 HTTP 403（Cloudflare 质询），未绕过，本轮不用。
- 下一步：agy 阶段 Z1（映射脚本、build-data 接入、简略名、remaining-english、测试）。

## 2026-11-26 11:05 AEDT — wf-relic-cn 全站汉化完成 (feat/zh-localization)
- 当前阶段：全站汉化交付完成（严格基于本地原始资料，绝未编造任何游戏译名，未联网，未触碰其它 worktree）。
- 映射系统与构建实现：
  1. 映射生成脚本 `scripts/build-zh-map.mjs`：严格从 `/workspace/wf-relic-cn-raw`（WFCD items/i18n_zh, warframe.market v2, worldstate solNodes/missionTypes/languages）读取官方数据，生成 `config/zh-map.json`（涵盖 28 星球、33 任务类型、435 节点、919 敌人、50 赏金段、53 特殊来源、2264 物品）。
  2. 简略名系统性消除：系统性修正 451 条过于简略的部件名（如「手套」→「凯旋之爪 Prime 手套」），全部自动补齐父物品官方中文名并记录 `abbreviatedCorrections`。
  3. 全量构建接入 `scripts/build-data.mjs`：为所有实体（relics, items, arcanes, rivens, mods, sources）统一写入 `nameZh`/`zhName` 与受控合法来源标记 `zhSource`（`wfcd_i18n:*`, `warframe_market:*`, `wfcd_worldstate:*`, `composed:*`, `traditional:*`, `en_as_is:*`, `en_fallback`）。
  4. 剩余英文与覆盖率统计：新增 `scripts/build-remaining-english.mjs`，生成规范文档 `docs/remaining-english.md`，逐条归类统计已汉化、资料原样英文、无中文资料保留英文（总计 6269 实体，规范覆盖率 68.2%，物品/Mod/赋能/紫卡/遗物/星球/赏金均达到 98%~100%）。
  5. 前端 UI 文本汉化：清理 `index.html` 与 `js/app.js` 残留英文（来源筛选、Mod 稀有度按钮、弹窗类型展示 `formatSourceType`、稀有度展示 `formatRarity` 等）。
  6. 自动化测试套件 `test/localization.test.mjs`：覆盖非空名称、受控合法 zhSource、各类别覆盖率保守下限、原始资料严格一致防编造比对（CI 优雅 skip）、关键映射动态抽样比对、简略名消除断言、多维搜索索引命中验证（中文/英文/拼音全拼/拼音首字母命中同一实体）、临时目录重建持久化验证。
- 测试与验证：
  - `npm test`：12 个套件 69 个测试全部通过（69 pass, 0 fail）。
  - `data/prices.json` 保持不变，未抓取实时价格，未 push，未改远程。
