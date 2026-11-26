# DONE — fix/math-decisions（Codex 1126 六项决议，Antigravity 通道）

- 状态：完成，通道独立复核通过（本地提交，未推送）。结束时间：2026-11-26 13:55 AEDT
- 分支 fix/math-decisions（worktree /workspace/wf-relic-cn-decisions，基于 feat/zh-localization 8372999，未 rebase）
- 实现提交：efb5988（agy Dec1，对话 11f2e78d-3041-4c5b-9adb-847529cc7029，4002 s，gemini-3.8-flash-high）
- npm test：75/75 通过；check-invariants-with-mutated-prices.mjs --raw：全部通过；data/prices.json 与 .github/workflows 未改动；未抓价
- flash-low 只读自检（13:5x）：结论 正常

## 通道独立复核（脚本在 /workspace/wf-relic-cn-notes/verify/）
1. Duviri：duviri_html.py 从 DE HTML 独立解析 Hard 表 11 项、99.99%，名称与掉率与 data/sources.json 逐项一致；boundaryFix {originalCount 62, keptCount 11}；rivens.json 中串入的 Duviri Hard 来源已移除。Normal Tier 1/3 各 150 项全为 0.67%（和 100.50%）标 roundingCompatible；其余 over 表 0 个被豁免。
2. 平均视图：dec_repo_vs_indep.mjs 用仓库纯函数复算，与 decisions_indep.py 一致——Nightmare 卖 A/B/C 4.0439/2.4649/5.802，AABC 4.088675；买 B=null ⇒ AABC null。仲裁卖 A/B/C 0.67/0.65/0.715，前八轮 0.6875（各轮均 incomplete，界面标「不完整估值」）；买 B=null ⇒ null。通式 N=10 校验 2.4 一致；null 传播正确。
3. 缺价资源：missingItems 掉率合计 = missingProbability（仲裁 A 9+9+9+7+44=78%），未设汇率、未写 0。
4. 低置信：LOW_CONFIDENCE_MIN_SELLERS=3，prices.js 从 calculations.js 同一常量导出；同一 user.id 三单 ⇒ uniqueSellers 1、lowConfidence；旧缓存无 uniqueSellers ⇒ sellerCountUnverified:true。
5. 紫卡：旧基础键（无 @unrevealed）getPriceEntry 返回 null；@unrevealed 键正常取价；matchesSubtype 排除缺 subtype 与 revealed 订单。当前缓存全部为旧键 ⇒ 紫卡全显示「暂无挂单」。
6. ETERNA：仅 requiem_eterna 有 effectiveChance；rawChance 9.5 / effectiveChance 12.5；完整 EV 7.75（独立 Σsell 62 ×12.5%=7.75；9.5% 时 5.89）；其余精炼档 null。引文已在 warframe.com Update 42 补丁说明中逐字核对存在。

## 截图（/workspace/wf-relic-cn-shots/ 与 docs-shots/）
36 Duviri Hard 边界修正 · 37 Tier 1 舍入兼容 · 38 仲裁前八轮平均 · 39 缺价物品清单 · 40/40b ETERNA 引文与 EV · 41 Nightmare 低置信提示 · 42 紫卡无价 · 43 紫卡列表

## 已知问题
- 遗物表「完整」列仍显示 DE 原始 9.5%，EV 按 12.5%（横幅已说明）。
- 来源弹窗的「不完整估值」提示只看卖侧；Nightmare A 买侧 incomplete（缺价 97.99%）仍显示 1.32 无提示。
- 来源名重复后缀「(Hard) (Hard)」（汉化轮遗留拼接）。
- npm test 会改写 meta.json builtAt 与 remaining-english.md 时间戳（已还原）。

## 待 Codex 拍板
- AABC 是否在界面对 Nightmare 等启用（目前只做纯函数，默认未启用）。
- Recall Ten-Zero Week 1–5 表（51 项）是否作为独立来源收录。
- 紫卡覆盖率降为 0（需按 @unrevealed 重新抓价，本轮不抓价）。
- 仲裁前八轮平均在各轮 incomplete 时是否显示已知部分（目前显示并标「不完整估值」）。

---

# DONE — wf-relic-cn（Antigravity 通道）

- 状态：完成，可验收（本地提交，未推送、未配置远程）。
- 结束时间（墨尔本）：2026-11-26 01:13 AEDT
- 目录：/workspace/wf-relic-cn （git 分支 master，作者 zserfv233 <zserfv233@users.noreply.github.com>，最新 commit d6f2bf7 + DONE）
- 本地预览：`cd /workspace/wf-relic-cn && python3 -m http.server 8000` → http://localhost:8000/index.html （纯静态，相对路径，可直接部署 GitHub Pages）
- 截图：/workspace/wf-relic-cn-shots/（同时拷贝在仓库 docs-shots/）
  01 物品搜索 · 02 可获取遗物按光辉期望值排序 · 03 遗物详情（四档掉率+价格+四档期望值）· 04 全部遗物(含已入库标记) · 05 赋能(按满级价排序) · 06 未开紫卡 · 07 Mod(0级/满级价) · 08 刷取来源按每次期望白金排序 · 09 来源详情
- Antigravity：agy CLI，模型 gemini-3.8-flash-high，conversation_id 3962e26c-a398-4e5a-94a0-7eaa8dc46a18（阶段1–5 全部续接同一对话）；自检用 gemini-3.8-flash-low 新对话。

## 测试
- `npm test`（node --test）：40/40 通过（通道复跑，2026-11-26 01:13 AEDT）。覆盖：期望值、精炼掉率（Axi A1 Intact 稀有 2%/Radiant 10%、Meso D1 双 Forma 槽位、所有遗物每档掉率和≈100）、搜索（中/英/全拼/首字母/简称，赋能与 Mod 各一例）、入库/unlisted 筛选、价格 min/max 乱序、rank 过滤、fetchedAt、fixture 不写 data/prices.json、限速、敌人/轮次来源期望值、NX 数量前缀、覆盖率≤100%。
- 页面无 JS 报错（playwright-core + 系统 google-chrome 截图时记录 pageerror/console error 均为空）。

## 通道复核（亲自核对）
- 遗物掉率：data/relics.json 对 DE 官方掉落表 HTML (https://www.warframe.com/droptables) 全量比对，3197 个“遗物×精炼档”全部一致（脚本 /workspace/wf-relic-cn-notes/verify/relic_vs_de.py；Requiem Eterna/I–IV 的 DE 表名大小写写法不同，不在 3197 内的 3 项为 DE 表缺项/命名差异）。阶段 1 曾发现 Meso D1 第二个 2X Forma 槽位串值，阶段 3 已修并复核。
- 可获取遗物：DE 表任务/赏金中出现的遗物名独立统计 = 35（Lith/Meso/Neo/Axi）+ Requiem Eterna = 36，与站点一致；另 Requiem I–IV 标 unlisted（见已知问题），页面“可获取”默认共 40。
- 掉落来源抽查：赋能 Arcane Energize 来源（Veil Proxima Erato Rot C 1.41%、Eidolon Hydrolyst(Special) 敌人表 5%，Mod 掉落几率 100）与 drops_all.json 原始一致；Saturn Cephalon Capture (Conclave) Rot A 来源期望 19.52p 用 data/prices.json 独立重算一致。
- 价格抽查（2026-11-26 约 00:58 在 Mac 上重抓 API 原始返回，对比抓取缓存 data/prices.json）：arcane_energize@r0 最低卖7/最高买5；@r5 140/100；rifle_riven_mod_veiled 10/9；ash_prime_systems_blueprint 13/6——4 项与 API 原始订单 min(sell)/max(buy) 完全一致。
- 未开紫卡：warframe.market v2 主站直接有 8 种 *_riven_mod_veiled 物品（tags 含 veiled_riven），无需替代来源（/v2/items 返回，见 data/ 与 wfm_items_v2.json）。
- 通道发现并让 Antigravity 修复的问题：假价格数据（fixture 写入）、fetchedAt 缺失、Requiem 误判入库、同名奖励槽位串值、NX 数量前缀、稀有度来源、meta 覆盖率口径(159%)、公式 LaTeX 未渲染。

## 数据来源
| 用途 | 来源 | 许可/说明 |
|---|---|---|
| 掉落表（遗物、任务、敌人、赏金…） | DE 官方 https://www.warframe.com/droptables ，经 WFCD warframe-drop-data 解析 JSON https://drops.warframestat.us/data/all.json | DE 官方数据（“非官方工具”声明已在页面）；WFCD 为 MIT |
| 遗物元数据/vaulted/market 映射 | WFCD warframe-items Relics.json https://raw.githubusercontent.com/WFCD/warframe-items/master/data/json/Relics.json | MIT（WFCD/warframe-items） |
| 中文名（主） | WFCD warframe-items i18n zh https://raw.githubusercontent.com/WFCD/warframe-items/master/data/json/i18n/zh.json （按 uniqueName） | 同上；每个名字记录 zhSource=wfcd_i18n |
| 中文名（补充） | warframe.market /v2/items 的 i18n['zh-hans'].name（zhSource=warframe_market；WFCD 对 Prime 部件只有“枪管/握柄”等通用词时采用） | warframe.market 公开 API |
| 价格 | warframe.market 公开 API v2 GET /v2/orders/item/{slug}/top（带 ?rank=N 取 0 级/满级），≤3 req/s，UA 标明个人非商业 | 仅代表抓取时刻；每条记录含 source/fetchedAt |
| 拼音 | pinyin-pro（构建期预计算） https://github.com/zh-lx/pinyin-pro | MIT |
| 参考 | https://github.com/Mersal108/relic-signal（MIT），声明见 THIRD_PARTY_NOTICES.md | 通道未逐行核对是否有代码被拷贝，Antigravity 称仅参考思路 |

## 价格覆盖率（data/meta.json，价格抓取时间 2026-11-25T13:56Z = 2026-11-26 00:56 AEDT / 悉尼时间 同）
- 总 2441/2453 键 = 99.5%：遗物奖励 603/603，未开紫卡 8/8，赋能 340/340（170 个×0级+满级），Mod 1490/1502（751×2；12 个键 market 无挂单，页面显示“暂无挂单”）。
- 不含：Forma 等不可交易物（按 0 计并提示）。

## 已知问题
1. box 访问 api.warframe.market 被 Cloudflare 403（curl、含浏览器 UA 均 403，2026-11-25）。价格由用户 Mac（可 200）运行 scripts/fetch-prices.mjs 抓取，再复制回 data/prices.json。GitHub Actions 工作流（.github/workflows/update-data.yml）里的 fetch-prices 在 GitHub 托管 runner 上是否会被 Cloudflare 拦截未验证；未启用推送。→ 需总管/Codex 决策：长期价格更新方式（Mac 定时 / Actions / 其他）。
2. Requiem I–IV：DE 掉落表无此来源、WFCD 标 vaulted，现按 config/status-overrides.json 设为 unlisted（“特殊来源：DE 掉落表未列出”），source 字段写“待确认”，没有可引用的官方 URL。
3. 入库状态冲突 2 个（Axi C13、Requiem Eterna：DE 表有掉落而 WFCD vaulted=true），以 DE 表为准并在页面标黄。入库判定=“是否出现在 DE 掉落表当前任务/赏金奖励中”，是推断，不是 DE 官方 vaulted 清单。
4. 掉落来源（节点、敌人、赏金）中文名大多没有（用英文原名+“轮次/敌人”前缀），中文名来源仅覆盖物品名。
5. 来源期望值口径：任务/赏金每次 = Σ(掉率×数量×价格)；敌人每击杀 = Mod 掉落几率×Σ(物品掉率×价格)；掉落物价格取 0 级最低卖价；用最低卖价会偏乐观（挂单价≠成交价）。Conclave 来源因个别 Mod（如 Soaring Strike 最低卖价 300p）排在期望榜前列，需人工判断。
6. 价格只取 /top 返回的各 5 条最低卖/最高买订单，未区分在线状态；Mod 未区分是否被 Mod 最大等级以外的 rank 订单；价格随时间变化，需定期重抓。
7. 未做：赋能“钢铁之路/Zariman/Duviri”按活动归类的专门页（目前按 DE 表的来源名/类型筛选，轮次 A/B/C 有显示）；紫卡仅 8 类未开紫卡价格，不含已开紫卡。
8. unmatched.json 618 项为 DE 表中无 market 对应物（资源、Endo、Credits 等），未逐条人工核对。

## 通道复核备注
Antigravity 自报结果均由通道复跑核对；其自报“Forma 在 market 不可交易”“relic-signal 仅参考思路”等说法未独立验证，已在上面标注。自检记录见 PROGRESS.md。

---

## 本轮：PvP（武形秘仪 / Conclave）筛选 — 2026-11-26 08:18 AEDT

- 分支：`feat/pvp-filter`（从最新 main `edb50a3` 切出，未推送、未改 `.github/workflows`、未改 `data/prices.json` 价格内容）
- 功能 commit：`859d3e2` feat: mark Conclave sources as PvP and filter them off the default sources view
  作者 zserfv233 <zserfv233@users.noreply.github.com>
- 测试：`npm test` **45/45 通过**（通道复跑，2026-11-26 08:18 AEDT）。新增 test/pvp.test.mjs：Conclave 全标 isPvp、其余为 false、数量 45、默认筛选排除 PvP、PvP 模式仅含 PvP、再次 build-data 后标记仍在。
- 标记数量与抽查（通道独立统计）：
  - data/sources.json 共 2061 条，全部有 isPvp 字段；isPvp=true **45** 条，false 2016 条。
  - 识别规则落地在 scripts/build-data.mjs + js/lib/sources.js（isPvpSource），不是只改生成 json。
  - 漏标 0 / 误标 0（对名称/节点/gameMode 含 Conclave 或武形秘仪 的交叉检查）。
  - 与 DE 掉落表 missionRewards 原始对照：15 个 gameMode=Conclave 的节点（土星 14 + 海王星 1）× 轮次 A/B/C = 45，一致。
  - 页面默认「共 2016 处」；点 PvP 后「共 45 处」，卡片有「PvP」徽章。
- 截图：/workspace/wf-relic-cn-shots/10_sources_default_no_pvp.png（含「当前页面不包含 PvP 来源，可点击「PvP」按钮查看。」）；/workspace/wf-relic-cn-shots/11_sources_pvp_only.png（仅 Conclave 来源 +「当前仅显示 PvP（武形秘仪 / Conclave）来源」）。仓库 docs-shots/ 有拷贝。截图时无页面 JS 报错。
- 价格覆盖率未被破坏：99.5%（2441/2453），updatedAt 仍为 2026-11-25T13:56:27.424Z。
- 已知问题：无新增功能性问题。npm test 里的 build-data 回归会改 meta.json 的 builtAt，通道已把该无意义脏改动恢复，未纳入提交。

## 2026-11-26 10:08 AEDT — 数学内核修复（fix/math-kernel，worktree /workspace/wf-relic-cn-math）
- 提交（均在 main 6ac4946 之上，作者 zserfv233）：bb6ccef（M1：轮次拆分、赏金 {A,B,C} 解析 299 个来源、仲裁拆分+轮次说明、单位改名、概率和核对、缺价/未知概率 null+「不完整估值」、id 唯一、整表去重、未取整排序）；c61ce01（M2：低置信 <3 卖家、默认按高置信排序、买卖分开显示、sellRobust 抓价脚本改动未运行、ETERNA 不适用档 null+资料冲突、赋能 N=(r+1)(r+2)/2 折算、去基础 slug 回退、紫卡 @unrevealed 键、mods/rivens 互斥、测试去快照化）；8625bd4（M3：去掉残留价格依赖断言、PvP 无 raw 时 skip、变异价格核验脚本）；本记录提交。
- 测试：npm test 62/62；变异价格副本 62/62；无 raw 61 pass + 1 skip。
- 前后对比（卖价口径）：Nightmare 12.31（三表混算，概率和 300.03%）→ A 4.0439 / B 2.4649 / C 5.8020；仲裁 2.04 → A 0.67 / B 0.65 / C 0.715（均不完整，已计价 21/22.5/30.5%）；Lith A1 4.33/4.67/5.16/5.77 不变；Conclave Saturn Cephalon Capture A 19.52 → 含低置信 19.5176 / 高置信 2.356（19 项稀疏卖单）；赏金 0 个 → 299 个，Cetus L5–15 A Stage1 0.20（已计价 20%）；ETERNA 5.89/0/0/0 → 5.89/null/null/null + 资料冲突。
- 截图：/workspace/wf-relic-cn-shots/12–22。
- 已知问题与待 Codex 拍板：见通道回报。

## 2026-11-26 11:24 AEDT — agy 汉化 Z1 结束（feat/zh-localization b7861b8，对话 f6aae698）
- 结果：npm test 69/69（通道复跑确认）；规范覆盖率 68.2%（敌人 4.4%、特殊来源 24.5%、任务类型 60.6% 偏低，WFCD i18n 不含敌人名，灰机 wiki 被 403）。
- 通道复核发现问题，已派 Z2 修正：无出处中文（赤毒洪流/暗影追猎者/噩梦模式奖励/巨人战舰破坏）、错字（塞德娜→资料为赛德娜）、Neuroptics 拼成「头部蓝图」44 条、zhSource 指向错误条目（Höllvania/Solaris/Deimos/Zariman/Duviri/Cetus）。
- agy 进程在提交后约 15 分钟才退出（空闲无 CPU），已记录。

## 2026-11-26 12:35 AEDT — agy 汉化 Z2 结束 + 通道复核（feat/zh-localization 0baf9a5）
- Z2 修正：赤毒洪流/暗影追猎者/噩梦模式奖励/巨人战舰破坏等无出处中文改回英文；塞德娜→赛德娜；44 条「头部蓝图」→「头部神经光元 蓝图」；zhSource 错指（Höllvania、Solaris→回英文、Deimos/Zariman/Duviri/Cetus）修正；composed 条目逐段 zhSegments + SITE_WORDS 白名单。agy 耗时约 63 分钟（11:24–12:27），前 50 分钟无文件改动但日志显示持续请求模型，已记录。
- 测试：npm test 70/70（通道复跑）。覆盖率（规范，含资料原样英文）总计 66.7%：遗物/赋能/紫卡 100%、物品 98.5%、Mod 99.2%、星球 96.4%、任务类型 93.9%、节点 100%（全为资料原样「英文节点名 (中文星球)」）、赏金 70%、敌人 4.2%、特殊来源 1.9%、来源 53.4%。
- 通道独立核验：zh_cjk_trace.py（每段中文须在本地资料逐字出现）→ 只剩「资料词+本站文案词」组合与「（特殊）」，无编造；zh_audit.py 出处逐条核对，剩余 7 条为嵌套键脚本误报，人工核对 sortieData.bosses 一致；22+4 条抽查全部一致（docs/zh-spotcheck-channel.txt）。
- 截图：/workspace/wf-relic-cn-shots/23–35（docs-shots/ 有拷贝），界面残留英文见 28/29/31。
- 已知问题：敌人与特殊来源大量英文（WFCD i18n 无敌人名，灰机 wiki 403）；繁体任务类型保留；npm test 会改写 docs/remaining-english.md 时间戳与 meta builtAt（已还原）。
