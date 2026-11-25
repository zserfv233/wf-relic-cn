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

