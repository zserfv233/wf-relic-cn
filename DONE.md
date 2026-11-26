# DONE — fix/ci-zh-rebuild（R8：CI 重建后汉化变差）

- 状态：完成，通道独立复核通过。结束时间：2026-11-27 00:05 AEDT。仅本地提交，未推送；**未改 .github/workflows**；未改前端；未抓价；data/ 相对 af95b27 无改动；测试下限未放宽。
- 提交（作者 zserfv233）：0aa20e5（修复）、本 DONE/PROGRESS 提交。agy R8：23:33–23:52（1171 s）。

## 根因与证据
- `build-data.mjs --download` 请求 `https://api.warframe.market/v2/items` 时只带 User-Agent。WFM API v2 的 i18n 默认只返回 `en`，要简体中文必须带 `Language: zh-hans` 请求头（WFM Api v2 官方文档 “Language Header”：默认 en）。CI 拿到的文件没有 `i18n['zh-hans']`，build-data 里依赖 wfm 中文名的回退全部失效。config/zh-map.json 是被用上的（CI 日志“已成功读取中文映射表 config/zh-map.json (物品数: 2264)”），问题不在它。
- 证据 1：run 45819556829 日志 `已保存 wfm_items_v2.json (1.56 MB)`、`条目数: 3893`。box 上的 raw 副本是 en + zh-hans（3893 条全带 zh-hans，原样 2.39 MB）；把 zh-hans 去掉后紧凑序列化正好 1,640,469 B = 1.56 MiB，与 CI 一致。
- 证据 2：用这份仅 en 版本加另外 4 个下载文件，在隐藏 raw 的环境下重建并测试，精确复现 CI 的两个失败：`arcanes 汉化率 (72.4%) 低于保守下限 90%`、`紫卡中文名 (rifle riven mod) 应包含 步枪裂罅`。
- box 访问 api.warframe.market 仍是 HTTP 403（Cloudflare），已记录，未绕过；所以 CI 实际返回的内容是根据日志大小和条目数推断的。

## 修了什么
- scripts/build-data.mjs：wfm_items_v2 下载带 `Language: zh-hans`（其余文件不变）；新增导出 `validateWfmItems`，下载成功后检查带 zh-hans 名称的条目比例 ≥ 95%，不够就报错退出，不会把缺中文的数据写进去再重建提交（HTTP 失败时原有的降级行为不变）。仅 en 版本会被拒：“比例 (0.00%) 低于 95%，缺少 zh-hans，可能未带 Language 头”。
- test/download_manifest.test.mjs：请求头断言；validateWfmItems 的仅 en / en+zh / 空数据用例；有 raw 时的回归哨兵（去掉 zh-hans 重建 → 赋能汉化率 < 90%；完整副本重建 → 与仓库 data/ 深相等）。
- 选“让 --download 拿到公开中文资料”而不是把译名落进 zh-map 快照：wfm zh-hans 本来就是这些名字的 zhSource（warframe_market:<slug>），改一个请求头就和本地构建同源，不需要复制几百条译名，也不会和上游更新脱节。两种做法没有需要 Codex 拍板的重大取舍。

## 模拟 CI（raw 目录用 unshare 挂载命名空间完全隐藏，原目录不动）
1. `build-data.mjs --download`：drops_all、Relics、zh、de_droptables.html 下载成功；wfm 从 box 403 → 跳过。
2. wfm 用 box 副本补上（en + zh-hans，就是带 Language: zh-hans 时 API 返回的形式，3893 条与 CI 条目数一致）。
3. 只用这 5 个文件重建：relics/arcanes/rivens/mods/sources/unmatched/search-index/prices 与仓库逐字节一致，meta.json 除 builtAt 外一致。
4. 隐藏 raw 的 npm test：144 个，132 通过、12 skip、0 失败；WF_RAW_DIR 指向不存在的路径时结果相同。
5. 有 raw：144/144；check-invariants-with-mutated-prices 通过。

## 已知风险
- 修复是否生效要看合并后 CI 的实际下载：日志里 wfm_items_v2.json 应该是约 2.3–2.4 MB，并且不报 zh-hans 校验错误。
- 需要 Codex 拍板：无。
