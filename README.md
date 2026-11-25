# Warframe 遗物与掉落查询平台 (wf-relic-cn)

一个纯静态、全中文界面的 Warframe 遗物与掉落查询工具。支持直接部署于 GitHub Pages（纯原生 HTML + 原生 ES Module JS + CSS，纯相对路径，无后端服务，无前端构建框架）。

---

## 🌟 核心特性

- **纯静态与零运行时构建**：无 Webpack/Vite 捆绑开销，基于原生浏览器 ES Modules 和现代 CSS 变量驱动。
- **全中文界面与多维即时搜索**：
  - 支持中文全名、英文原名、拼音全拼（如 `shiren`）、拼音首字母（如 `sr`）、英文首字母缩写（如 `aps` 对应 Ash Prime Systems，`tpsb` / `tpsbp` 对应 Trinity Prime Systems Blueprint）。
  - 拼音数据在构建阶段通过 `pinyin-pro` 预计算注入索引，前端无需加载庞大的拼音字典。
- **四档精炼掉率与期望白金计算**：
  - 完整 (Intact)、优良 (Exceptional)、无暇 (Flawless)、光辉 (Radiant) 四档掉率严格提取自 DE 官方掉落表。
  - 期望白金值 = $\sum(\text{单项掉率} \times \text{单价})$，默认基于市场【最低卖价】，可无缝切换为【最高收购价】。
  - 若物品在市场缺价，自动以 0 白金计入并清晰提示缺价数量。
  - **价格与期望值口径**：价格取 warframe.market /v2/orders/item/{slug}/top 返回订单中的最低卖价/最高收购价，仅代表抓取时刻；遗物期望值不含 Forma 等不可交易物。
  - 支持数量前缀（如 `3X`、`2X`）与掉落几率结合计算（$\text{单项掉率} \times \text{数量} \times \text{单价}$）。
- **入库状态多源核对与冲突标记**：
  - **主判定依据**：直接检索 DE 官方掉落表现存任务与各赏金轮次是否有该遗物掉落。
  - **二次比对**：与 WFCD warframe-items 的 `vaulted` 字段进行双向校验，状态不一致时标记黄色存疑徽章并在详情页展开说明。
- **双向反查体系**：
  - 点击任意奖励物品，即刻进入物品反查视图，查看该物品在所有遗物中的稀有度、四档掉率，以及在星图任务/赏金中的直接掉落节点与轮次。
- **URL Hash 深度链接**：支持 `#relic=axi_a1` 或 `#item=nikana_prime_blueprint`，方便直接分享与收藏。

---

## 🚀 本地预览

无需安装任何构建工具，直接启动静态 HTTP 服务器：

```bash
# 方式 1: 使用 Python 3
python3 -m http.server 8000

# 方式 2: 使用 npx http-server
npx http-server -p 8000 -c-1
```

在浏览器中打开 `http://localhost:8000` 即可使用。

---

## 🔄 数据更新指南

本项目所有核心数据存放于 `data/` 目录：
- `data/relics.json`: 遗物全量数据与物品反查表
- `data/search-index.json`: 预构建多维度模糊检索索引
- `data/prices.json`: warframe.market 订单价格缓存
- `data/meta.json`: 数据版本、来源 URL、统计与价格覆盖率

### 步骤 1：构建遗物与掉落基础数据

```bash
# 方案 A: 使用本地已有原始数据目录
node scripts/build-data.mjs --raw /workspace/wf-relic-cn-raw

# 方案 B: 自动从官方与开源库在线下载最新数据至 data/raw 并构建
node scripts/build-data.mjs --download
```

### 步骤 2：抓取 Warframe.Market 市场价格

> **注意**：部分网络环境下直接访问 `api.warframe.market` 可能会受到 Cloudflare 质询拦截。价格抓取脚本应在可正常直连 API 的环境中执行。
> 价格取 warframe.market /v2/orders/item/{slug}/top 返回订单中的最低卖价/最高收购价，仅代表抓取时刻；遗物期望值不含 Forma 等不可交易物。

```bash
# 抓取未缓存或已过期的物品价格（默认跳过 24 小时内抓取项，限速 ≤ 3 req/s）
node scripts/fetch-prices.mjs

# 常用参数:
# --limit 50         限制本次最多抓取的数量
# --max-age-hours 12 自定义缓存有效期（小时）
# --dry-run          仅预览待抓取的 slug 列表
```

---

## 🧪 单元测试

使用 Node.js 原生测试运行器（`node --test`）：

```bash
npm test
```

测试套件覆盖：
1. **期望值计算**：公式验证、最低卖价/最高买价模式切换、缺价物品统计。
2. **精炼掉率提取**：以真实 Axi A1 为基准，断言稀有奖励（侍刃 Prime 蓝图）完整掉率 2%、光辉 10%，以及罕见/常见掉率。
3. **搜索与拼音匹配**：覆盖中文名、英文名、拼音全拼、拼音首字母、英文缩写匹配。
4. **入库状态与冲突检测**：验证全量 800 个遗物、36 个可获取遗物、764 个入库遗物与 2 个冲突项。
5. **乱序价格解析**：以乱序订单 Fixture 验证在线/游戏内玩家最低卖价与最高收购价提取。
6. **请求限速器**：验证请求间隔严格满足 $\ge 350\text{ms}$。

---

## 📚 数据来源清单

| 数据源名称 | 描述 | 官方 / 开源地址 |
| :--- | :--- | :--- |
| **DE 官方掉落表** | Digital Extremes 发布的掉落概率全表 | [https://www.warframe.com/droptables](https://www.warframe.com/droptables) |
| **WFCD warframe-drop-data** | WFCD 维护的官方掉落表 JSON 解析库 | [https://drops.warframestat.us/data/all.json](https://drops.warframestat.us/data/all.json) |
| **WFCD warframe-items** | 遗物元数据、uniqueName 与市场映射 | [WFCD/warframe-items Relics.json](https://raw.githubusercontent.com/WFCD/warframe-items/master/data/json/Relics.json) |
| **WFCD i18n zh** | 游戏本体简中文本对应库 | [WFCD/warframe-items zh.json](https://raw.githubusercontent.com/WFCD/warframe-items/master/data/json/i18n/zh.json) |
| **Warframe.Market API v2** | 玩家间实时买卖白金挂单数据 | [https://api.warframe.market/v2](https://api.warframe.market/v2) |

---

## 📄 许可声明

- 本项目代码遵循 MIT License。
- 第三方代码与开源库声明详见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。
- Warframe 以及 Digital Extremes 是 Digital Extremes Ltd. 的商标或注册商标。
