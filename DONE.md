# DONE — fix/drop-tables（R7：Update drop tables 定时任务失败修复）

- 状态：完成，通道独立复核通过。结束时间：2026-11-26 23:30 AEDT。仅本地提交，未推送；**未改 .github/workflows**（不需要改）；未改前端（js/、css/、index.html）；未抓价，data/prices.json 与 data/ 相对 cdabf6e 无改动。
- 提交（作者 zserfv233）：6a93050（修复）、本 DONE/PROGRESS 提交。agy R7：22:53–23:22（1757 s）。

## 失败原因
- run 45811008052（schedule，11:29Z=22:29 AEDT，共 17 秒）：checkout 的是 **f088b4b**（R6 合并之前），“Download raw sources and rebuild data/” 成功，失败在“Run tests”，之后“Commit updated data”被跳过。
- 日志关键行：`✖ renderDropSourcesGrouped: 普通与历史来源分组…（普通组标题必须声明排除历史活动）`、`✖ renderDropSourcesGrouped: 仅有历史来源时提示…`、`✖ 汉化覆盖率不变量…`、`✖ 重建后保留验证…`。其中后两项是 R6 已修的无 raw 问题（f088b4b 上存在）。
- 在 cdabf6e（含 R6）上用 /tmp 副本复现后，剩下的真实根因：workflow 的 `node scripts/build-data.mjs --download --raw $RUNNER_TEMP/wf-raw` 只下载 4 个文件（drops_all、Relics、zh、wfm_items_v2），而 build-data.mjs 还读取 `de_droptables.html`（Duviri 表头 + Recall: Ten-Zero Week 1–5 历史来源）。CI 里没有它，5 个 `event_recall_ten_zero_week_*` 来源整体消失，relics/rivens/sources/unmatched/search-index 随之变化，round3b/round3c/round4 共 6 个测试（9 条 ✖）失败。不修的话，即使不失败也会把缺 Ten-Zero 的数据提交到线上。

## 修了什么
- scripts/build-data.mjs：下载清单改为导出的 `REMOTE_FILES`（文件名、地址、是否必需），加入 `https://www.warframe.com/droptables` → `de_droptables.html`（302 到 DE 的 CDN，fetch 自动跟随），**必需**，下载失败直接报错退出，不降级；wfm_items_v2 仍可降级。`REMOTE_URLS` 保留兼容。
- 新增 test/download_manifest.test.mjs（清单内容、源码静态覆盖检查、有 raw 时仅用清单里 5 个文件重建到临时目录并断言 sources id 集合与仓库一致，含 5 个 Ten-Zero 来源；缺 raw 时 skip）。
- 因为 workflow 只是调用 `--download`，**不用改 workflow**。

## 本地模拟（照 yml 顺序，在 /tmp 副本，不动 worktree）
1. `npm ci`：通过。
2. `node scripts/build-data.mjs --download --raw /tmp/wf-r7-raw2`：drops_all/Relics/zh/de_droptables.html 下载成功（de_droptables 4.28 MB）；**wfm_items_v2.json 从 box 返回 HTTP 403（Cloudflare），已记录，未绕过**，脚本按降级处理。（CI 上这个文件能下载成功，见 run 日志。）
3. 因 box 拿不到 wfm，把本地已有的 /workspace/wf-relic-cn-raw/wfm_items_v2.json 复制进临时 raw 后重建：relics/arcanes/rivens/mods/sources/unmatched/search-index/prices 与仓库内文件逐字节一致。（修复前同样步骤：5 个 Ten-Zero 来源消失，6 个测试失败。）
4. `npm test`，无 raw（ci-sim.sh 挂载隐藏）：142 个，131 通过、11 skip、0 失败；`WF_RAW_DIR=/nonexistent/xx`：同上。
5. 有 raw 的 worktree：142/142；check-invariants-with-mutated-prices 通过。
6. 提交步骤：重建结果与仓库一致，CI 上只会有 meta.json 的 builtAt 变化（既有行为，未改）。
没有写 data/prices.json，没有抓价。

## 已知问题 / 风险
- wfm_items_v2 在 CI 若某天也遇到 403，赋能/Mod 会降级为 0，测试会失败而不是提交坏数据（这是安全的失败方式，但会让每日任务失败）。
- 每次定时重建都会改 meta.json 的 builtAt，导致每天一个“rebuild drop tables”提交（既有行为）。
- 需要 Codex 拍板：无。
