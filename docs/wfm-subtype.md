# Warframe.Market Subtype 契约核实与解析规则

核实日期：2026-11-26

## 1. 官方依据与已核实事实
- **WFM 官方 Data Models**（https://42bytes.notion.site/Data-Models-65e9ab01868c4dcca6ba499e68a04ac9）：
  - Item 模型定义了 `subtypes []string`（字段注释为 "Item subtypes."）。
- **本地 WFM /v2/items 快照**（`/workspace/wf-relic-cn-raw/wfm_items_v2.json`）：
  - 8 个 `*_riven_mod_veiled` 物品的 `subtypes` 数组均为 `["unrevealed", "revealed"]`。
- **WFM 官方 v2 API 文档**（https://42bytes.notion.site/WFM-Api-v2-Documentation-5d987e4aa2f74b55a80db1a09932459d）：
  - 基址为 `/v2/`，限速为 3 req/s，支持 `Language: zh-hans` 请求头。

## 2. 第三方转述（非官方契约）
- Rust `warframe_market` crate 中关于 `get_orders_item_top` 的注释说明：
  - `/top` 接口每侧最多返回 5 条在线订单（"top 5 buy and top 5 sell orders … exclusively from online users"）。
  - `subtype` 参数控制基于订单子类型字段的过滤（"subtype string - controls the filtering of orders based on item subtype field."）。

## 3. 未确认事项
- 订单对象缺失 `subtype` 字段时的明确服务端语义未获官方契约确认。
- 服务端是否严格保证只返回匹配所请求 `subtype` 的订单未获官方保证。

## 4. 本站采取的保守解析契约
为杜绝将类型不明或已开紫卡的价格带入未开紫卡收益计算：
1. **严格子类型匹配（`matchesSubtype`）**：
   - 当调用方请求了 `subtype` 时，只接受订单对象中 `subtype` 字段明确存在且与请求值严格相等（`order.subtype === subtype`）的订单。
   - 订单缺少 `subtype` 字段、字段为 null/undefined 或值不相等时，一律严格排除。
2. **写回实际子类型**：
   - 解析结果中的 `subtype` 字段必须记录被接受订单的实际 `subtype`（仅当全部被接受订单子类型一致时记录），严禁直接用请求参数回填。
3. **废除无子类型基础键回退**：
   - 价格读取路径（`getPriceEntry`）与覆盖率计算（`computeCategoryStats` / `calculatePriceCoverage`）彻底废除对紫卡无 subtype 基础键（如 `rifle_riven_mod_veiled`）的回退。
   - 紫卡只认 `${slug}@unrevealed` 键；若缓存中不存在该键，则严格返回 `null`（按缺价处理），不假称价格存在。
4. **低置信度按去重卖家核验**：
   - 判定使用价格有效且在线订单的去重卖家数 `uniqueSellers`（优先使用稳定用户 ID `o.user.id` 去重）。
   - 旧缓存缺少 `uniqueSellers` 时标记 `sellerCountUnverified: true`，不可仅凭 `sellCount` 判定置信度，一律归入低置信。
