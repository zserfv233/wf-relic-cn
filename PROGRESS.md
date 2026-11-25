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
  - B 价格脚本扩展：scripts/fetch-prices.mjs 支持独立在无 raw 数据的机器上运行；支持 --only relics,rivens,arcanes,mods（默认 all）、--limit、--max-age-hours、固定并发 1、≤3 req/s 严格限速；赋能与 Mod 支持 rank 价格区分（${slug}@r0 与 ${slug}@r{maxRank}）；按类别优先级流水抓取并分阶段即时持久化写入；meta.json 同步记录分项与全量覆盖率。
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
     - 期望白金值统一按 $\text{chance} \times \text{quantity} \times \text{单价}$ 计算，并在遗物卡片预览、遗物详情表格、物品反查与掉落来源中展示“×N”数量标签；
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
