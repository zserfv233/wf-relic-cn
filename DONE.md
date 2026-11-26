# DONE — fix/ci-tests（R6：价格自动更新 CI 测试失败修复）

- 状态：完成，通道独立复核通过。结束时间：2026-11-26 22:35 AEDT。仅本地提交，未推送；**未改 .github/workflows**（不需要改）；未抓价，data/prices.json 相对 f088b4b 无改动。
- 提交（作者 zserfv233）：854d140（抓价脚本 meta 口径）、b55d957（无 raw 时 skip + Carrier Prime 测试）、3d1f18e（圣殿等来源名去重并重建数据）、751580c（价格相关断言改为自洽不变量）、本 DONE/PROGRESS 提交。
- agy：R6 20:52–21:41（2971 s），R6b 21:51–22:21。

## 测试结果
| 环境 | 结果 |
|---|---|
| 有 raw，当前缓存 | 139/139 通过 |
| 无 raw（unshare 挂载命名空间用空 tmpfs 盖住 raw，原目录不动；ci-sim.sh） | 129 通过、10 skip、0 失败 |
| 无 raw（WF_RAW_DIR=/nonexistent/xx） | 129 通过、10 skip、0 失败 |
| check-invariants-with-mutated-prices | 通过 |
| 新价格缓存场景 A/B（/tmp 副本随机改 100 个键，含倒挂↔正常互换，保留 arcane_reaper=15/72、adaptation=5，再用 fixture 模式触发 meta 重算） | 有/无 raw 都全过 |
| 新价格缓存场景 C（fixture 覆盖 120 键+30 个缺价） | 有/无 raw 都全过（修前同场景 3 失败） |
新价格缓存没法真取：run 45792593580 没有 artifact，日志里没有价格数据，所以用副本构造。

## 3 个失败怎么修的
1. pricedCount 2416 vs 2424：根因是 fetch-prices.mjs 更新 meta 时把 cacheKey（`xxx@unrevealed`）当紫卡 slug 传给 calculatePriceCoverage，函数内又追加一次 `@unrevealed`，8 个紫卡全部查不到价，meta 少算 8 个。选“改脚本”而不是放宽测试：脚本改用与测试相同的口径（新增导出函数 buildMetaPrices，从 data/*.json 读数据集算覆盖率），测试保持严格不变量；理由是 meta 本来就该由唯一口径生成，放宽测试会掩盖真实缺陷。同时 meta 路径改为跟随 --out 目录，fixture 运行不再改真实 data/meta.json。基线复现：旧脚本 fixture 跑完紫卡 0/8、meta 与重算差 7。新增回归测试 test/fetch_meta_consistency.test.mjs。workflow 调用 `node scripts/fetch-prices.mjs --max-age-hours 5`（无 --out，默认 data/prices.json），行为不变，所以不用改 workflow。
2. 汉化重建测试缺 raw：改为按所需文件是否存在 skip（新增 scripts/lib/raw-dir.mjs，支持 WF_RAW_DIR）；pvp 重建测试原先只判断目录存在，目录为空时失败，也改成判断文件。有 raw 时断言强度不变。
3. Corrupted Ancient exact_match 出处原文 undefined：没有 raw 时跳过“出处原文严格相等”这一项，其余仍断言；有 raw 时仍严格比对。
4. 额外发现并修复（复核时的新价格场景暴露）：round3b/round4 里有 3 处用 arcane_reaper=15/72 或 adaptation=5 当哨兵判断“缓存没变”，再断言快照常数（倒挂键数 53、仲裁 0.84375），真实新缓存里哨兵键没变、其他键变了就会失败。已改成独立重算口径的自洽断言，并保留固定 fixture 的精确数值断言。

## Carrier Prime 部件
没有改名。「搬运者 Prime 系统/外壳/头部/蓝图」与 DE ExportResources_zh（PrimeCarrierSystems/Carapace/Cerebrum）、ExportSentinels_zh（PrimeCarrierPowerSuit=搬运者 Prime，CarrierPowerSuit=搬运者）和 warframe.market zh-hans（含蓝图）三方一致；哨兵 Carrier 官方中文名就是「搬运者」。Codex 定的「母舰」只绑定敌人 SwarmShipAvatar，两者不冲突（test/carrier_prime.test.mjs 锁定，缺 raw 时 skip）。

## 圣殿重复：14 个来源修复前 → 修复后
规则：括号里的模式名已完整包含在节点英文名中时，中英文名都省略「(模式)」；Hard 去重逻辑不变；其余来源名称不变。完整对照表：/workspace/wf-relic-cn-notes/r6-sanctuary-before-after.md。
- 圣殿 - 圣殿突袭 (圣殿突袭) [轮次 A/B/C] → 圣殿 - 圣殿突袭 [轮次 A/B/C]
- 圣殿 - 精英级圣殿突袭 (圣殿突袭) [轮次 A/B/C] → 圣殿 - 精英级圣殿突袭 [轮次 A/B/C]
- 双衍王境 - 无尽回廊 (无尽回廊) [轮次 A/B/C] → 双衍王境 - 无尽回廊 [轮次 A/B/C]
- 霍瓦尼亚 - 传承种收割 (Legacyte Harvest) [轮次 A/B/C] → 霍瓦尼亚 - 传承种收割 [轮次 A/B/C]
- 霍瓦尼亚 - 歼灭：炽蛇军/科腐者 (歼灭) → 霍瓦尼亚 - 歼灭：炽蛇军/科腐者
英文名同步（如 Sanctuary - Sanctuary Onslaught (Sanctuary Onslaught) [Rot A] → Sanctuary - Sanctuary Onslaught [Rot A]）；mods/arcanes/unmatched/search-index 里引用旧名的 place 已同步，无旧名残留。来源 id 未变。

## 已知问题
- 圣殿之外另 8 个来源（霍瓦尼亚传承种收割、歼灭）也按同一规则去重了，范围比总管举例大，已在对照表列出。
- 无 raw 时有 10 个测试 skip（均依赖本地原始资料），CI 上这部分只有有 raw 的本地环境才会跑。
