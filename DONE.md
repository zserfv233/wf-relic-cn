# DONE — fix/round3-decisions 阶段 R4 + R5（Codex 1126c 8 项 + 复核修正）

- 状态：完成，通道独立复核通过。结束时间：2026-11-26 20:30 AEDT。仅本地提交，未推送；未改 .github/workflows；未抓价，data/prices.json 未改。
- 提交：a1e1b4c（R4，agy 18:27 启动、19:58 退出，实现 8 项）、b5b7d74（R5，agy 20:08–20:23，950 s，修复核发现的 2 处问题）。
- HEAD npm test 133/133；check-invariants-with-mutated-prices 通过。
- 覆盖率：中文率 63.3%，可追溯率 66.3%（3975 中文 + 185 上游原样英文 / 6275）；节点中文率 50.6%，可追溯率 89.9%。

## 通道独立复核（verify/r4_check.py、verify/r4_price_roundtrip.mjs、截图）
1–3. 敌人名：Captain Vor→沃尔上尉；8 个处决者去掉“的浮印”（Zura、Vay Molta 保留英文名部分），Dhurnam 仍 en_fallback；Corrupted Vor→堕落 Vor。均有 DE ExportFlavour 出处。
4. 14 个基础节点 + 3 个变体按 (systemName, name) 二元组唯一匹配 DE ExportRegions：独立核对 14 个二元组在 ExportRegions_en 中候选数都是 1，zh 侧 uniqueName 无重复；代码在候选数≠1 或 ID 内容不一致时 console.warn 并回退，不采用。round4 测试覆盖冲突分支。
5. Sanctuary Onslaught→圣殿突袭、Elite→精英级圣殿突袭、The Circuit→无尽回廊。
6. Carrier→母舰，zhSource=huijiwiki，只绑定 /Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/SwarmShipAvatar；全站无“搬运者”；Stalker、Protector Stalker 有 DE export 出处。
7. 价格缓存往返：倒挂 raw 15/72 写入再读出，sell/buy=null、raw 15/72、crossedMarket=true、noBuyOrders=false，均不变；相等价、只卖、只买、空盘、v1 旧缓存全部一致。
8. Ten-Zero historicalEvent：紫卡 40/40、赋能 705/705、Mod 9922/9922 条反向来源行都带这个字段，与 sources.json 无不一致。复核发现弹窗分组失效（见 R5），修复后紫卡弹窗显示“6 处，排除历史活动”，Ten-Zero 在折叠组里（截图 73/74）。

## R5 修正（复核发现、必须修）
- app.js 三处 renderDropSourcesGrouped 没有传 sources，所有来源都被标成“来源状态未确认”，历史组也不生效 → 已补传，加了测试。
- 敌人来源缺价清单读不到 itemName/itemZh，显示成“()” → 已补回退字段，加了测试（截图 72）。

## 截图
59–71（R4），72–75（R5 修复后）。64、68–70 是修复前拍的，留作对照。

## 已知问题
- 第 4 项冲突只 console.warn，没有写进持久的冲突记录文件。
- 母舰弹窗写着“买单侧缺 6 项”，清单里只列出两侧都缺的 2 项，只缺买价的项没有单独列出。
- pendingDecision 剩 Chroma（待 Codex 拍板）。
