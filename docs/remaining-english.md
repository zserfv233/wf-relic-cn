# wf-relic-cn 汉化覆盖率与剩余英文统计报告

> 生成时间：2026-11-26T01:26:17.940Z  
> 数据来源：本地原始资料 `/workspace/wf-relic-cn-raw`（WFCD warframe-items, warframe-worldstate-data, warframe.market v2, DE 官方掉落表）  
> 统计口径说明：  
> - **已汉化**：在官方资料库或权威数据中查找到确切中文译名（含依官方术语规范拼成的合成标题）。  
> - **资料原样英文**：上游官方资料库原样保留英文的内容（如 solNodes 中「Galatea (海王星)」的英文节点名部分、未英汉对照的固有模式等）。允许保留且计入规范。  
> - **无中文资料保留英文**：上游全部本地原始资料均无中文对应项的内容（如未命名的特殊敌人、无官方译名之掉落项等）。严格遵守硬性约束绝不自行翻译，保留英文。

## 1. 各类别汉化覆盖率总表

| 实体类别 | 已汉化 | 资料原样英文 | 无中文资料保留英文 | 类别总数 | 汉化率 (纯中文) | 规范覆盖率 (含原样) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| 遗物 (Relics) | 800 | 0 | 0 | 800 | 100.0% | 100.0% |
| 物品 (Items) | 598 | 0 | 9 | 607 | 98.5% | 98.5% |
| 赋能 (Arcanes) | 170 | 0 | 0 | 170 | 100.0% | 100.0% |
| 紫卡 (Rivens) | 8 | 0 | 0 | 8 | 100.0% | 100.0% |
| Mod (Mods) | 771 | 0 | 1 | 772 | 99.9% | 99.9% |
| 掉落来源 (Sources) | 1265 | 14 | 1115 | 2394 | 52.8% | 53.4% |
| 星球 (Planets) | 27 | 0 | 1 | 28 | 96.4% | 96.4% |
| 任务类型 (Mission Types) | 18 | 2 | 13 | 33 | 54.5% | 60.6% |
| 节点 (Nodes) | 0 | 435 | 0 | 435 | 0.0% | 100.0% |
| 敌人 (Enemies) | 25 | 14 | 880 | 919 | 2.7% | 4.2% |
| 赏金标题 (Bounties) | 35 | 0 | 15 | 50 | 70.0% | 70.0% |
| 特殊来源 (Transient Sources) | 1 | 0 | 52 | 53 | 1.9% | 1.9% |
| **总计 (Grand Total)** | **3718** | **465** | **2086** | **6269** | **59.3%** | **66.7%** |

## 2. 简略名系统性消除统计

- **修正简略名总数**：451 条
- **消除规则**：对 Prime/武器/战甲部件与蓝图，若 WFCD 中文名过于简略（不包含其父物品中文名），改用 warframe.market 完整 zh-hans 名称；若市场无完整名，则采用 WFCD 父物品官方中文名 + 官方部件名拼接（`composed:parent+part`）。

### 前 30 条简略名修正清单示例

| 序号 | 英文全名 | 原始简略中文 | 修正后中文名 | 父物品官方中文名 | 来源标注 (zhSource) | 采用规则 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Akstiletto Prime Barrel | 枪管 | **史提托双枪 Prime 枪管** | 史提托双枪 Prime | `warframe_market:akstiletto_prime_barrel` | wfm_full_name |
| 2 | Fragor Prime Head | 锤头 | **重击巨锤 Prime 锤头** | 重击巨锤 Prime | `warframe_market:fragor_prime_head` | wfm_full_name |
| 3 | Dual Kamas Prime Handle | 握柄 | **双短柄战镰 Prime 握柄** | 双短柄战镰 Prime | `warframe_market:dual_kamas_prime_handle` | wfm_full_name |
| 4 | Braton Prime Stock | 枪托 | **布莱顿 Prime 枪托** | 布莱顿 Prime | `warframe_market:braton_prime_stock` | wfm_full_name |
| 5 | Paris Prime Grip | 弓身 | **帕里斯 Prime 弓身** | 帕里斯 Prime | `warframe_market:paris_prime_grip` | wfm_full_name |
| 6 | Stradavar Prime Receiver | 枪机 | **斯特拉迪瓦 Prime 枪机** | 斯特拉迪瓦 Prime | `warframe_market:stradavar_prime_receiver` | wfm_full_name |
| 7 | Pangolin Prime Blade | 刀刃 | **鲮鲤剑 Prime 刀刃** | 鲮鲤剑 Prime | `warframe_market:pangolin_prime_blade` | wfm_full_name |
| 8 | Zhuge Prime String | 弓弦 | **诸葛连弩 Prime 弓弦** | 诸葛连弩 Prime | `warframe_market:zhuge_prime_string` | wfm_full_name |
| 9 | Burston Prime Receiver | 枪机 | **伯斯顿 Prime 枪机** | 伯斯顿 Prime | `warframe_market:burston_prime_receiver` | wfm_full_name |
| 10 | Akbolto Prime Receiver | 枪机 | **螺钉双枪 Prime 枪机** | 螺钉双枪 Prime | `warframe_market:akbolto_prime_receiver` | wfm_full_name |
| 11 | Helios Prime Systems | 系统 | **赫利俄斯 Prime 系统** | 赫利俄斯 Prime | `warframe_market:helios_prime_systems` | wfm_full_name |
| 12 | Kogake Prime Boot | 靴子 | **科加基 Prime 靴子** | 科加基 Prime | `warframe_market:kogake_prime_boot` | wfm_full_name |
| 13 | Karyst Prime Handle | 握柄 | **凯洛斯特 Prime 握柄** | 凯洛斯特 Prime | `warframe_market:karyst_prime_handle` | wfm_full_name |
| 14 | Zakti Prime Receiver | 枪机 | **毒芽 Prime 枪机** | 毒芽 Prime | `warframe_market:zakti_prime_receiver` | wfm_full_name |
| 15 | Baza Prime Receiver | 枪机 | **苍鹰 Prime 枪机** | 苍鹰 Prime | `warframe_market:baza_prime_receiver` | wfm_full_name |
| 16 | Sybaris Prime Stock | 枪托 | **席芭莉丝 Prime 枪托** | 席芭莉丝 Prime | `warframe_market:sybaris_prime_stock` | wfm_full_name |
| 17 | Afuris Prime Receiver | 枪机 | **盗贼双枪 Prime 枪机** | 盗贼双枪 Prime | `warframe_market:afuris_prime_receiver` | wfm_full_name |
| 18 | Scourge Prime Blade | 刀刃 | **祸根 Prime 刀刃** | 祸根 Prime | `warframe_market:scourge_prime_blade` | wfm_full_name |
| 19 | Fang Prime Handle | 握柄 | **狼牙 Prime 握柄** | 狼牙 Prime | `warframe_market:fang_prime_handle` | wfm_full_name |
| 20 | Braton Prime Barrel | 枪管 | **布莱顿 Prime 枪管** | 布莱顿 Prime | `warframe_market:braton_prime_barrel` | wfm_full_name |
| 21 | Acceltra Prime Stock | 枪托 | **迅发电浆炮 Prime 枪托** | 迅发电浆炮 Prime | `warframe_market:acceltra_prime_stock` | wfm_full_name |
| 22 | Paris Prime Lower Limb | 下弓臂 | **帕里斯 Prime 下弓臂** | 帕里斯 Prime | `warframe_market:paris_prime_lower_limb` | wfm_full_name |
| 23 | Cobra & Crane Prime Hilt | 握柄 | **眼镜蛇 & 鹤 Prime 握柄** | 眼镜蛇 & 鹤 Prime | `warframe_market:cobra_and_crane_prime_hilt` | wfm_full_name |
| 24 | Larkspur Prime Receiver | 枪机 | **翠雀 Prime 枪机** | 翠雀 Prime | `warframe_market:larkspur_prime_receiver` | wfm_full_name |
| 25 | Bronco Prime Receiver | 枪机 | **野马 Prime 枪机** | 野马 Prime | `warframe_market:bronco_prime_receiver` | wfm_full_name |
| 26 | Lex Prime Receiver | 枪机 | **雷克斯 Prime 枪机** | 雷克斯 Prime | `warframe_market:lex_prime_receiver` | wfm_full_name |
| 27 | Lex Prime Barrel | 枪管 | **雷克斯 Prime 枪管** | 雷克斯 Prime | `warframe_market:lex_prime_barrel` | wfm_full_name |
| 28 | Kompressa Prime Receiver | 枪机 | **卡帕压力枪 Prime 枪机** | 卡帕压力枪 Prime | `warframe_market:kompressa_prime_receiver` | wfm_full_name |
| 29 | Cedo Prime Stock | 枪托 | **塞多 Prime 枪托** | 塞多 Prime | `warframe_market:cedo_prime_stock` | wfm_full_name |
| 30 | Daikyu Prime String | 弓弦 | **大久和弓 Prime 弓弦** | 大久和弓 Prime | `warframe_market:daikyu_prime_string` | wfm_full_name |

## 3. 本站界面词与结构词白名单说明 (SITE_WORDS)

在 `composed:*` 规则生成的组合译名中，所有中文游戏实体名称均严格来自本地原始资料（WFCD i18n、warframe.market 或 WFCD worldstate），每一段中文都在资料中逐字对应并在 `zhSegments` 中记录精确出处。
对于非专有名词的修饰成分与结构符号，脚本定义了显式受控白名单 `SITE_WORDS`：
- **受控文案词**：`等级`、`赏金`、`阶段`、`轮次`、`特殊`、`奖励`
- **结构与标点符号**：空格、横杠（` - `）、圆括号（`(`、`)`、`（`、`）`）、中括号（`[`、`]`）、数字、英文原名节点/模式/属性前缀（如 `Caches`、`Extra`、`Resource`、`Level`、`Dark Refractory, `）
- **无出处整条回退**：若某个组合规则中的任何中文段落在原始资料与 `SITE_WORDS` 中均无逐字出处（例如「赤毒洪流」「暗影追猎者」「噩梦模式」「巨人战舰破坏」「奥秘隔离库」「英择谛实验室」「WF1999 赏金」），一律严格整条回退为英文，绝不自行拼接或编造。

## 4. 待 Codex 拍板事项 (Pending Codex Decision)

1. **繁体任务类型保留**：上游 `wfcd-worldstate-zh/solNodes.json` 及 `missionTypes.json` 包含部分官方繁体条目（如「捕獲」「移動防禦」「刺殺」「防禦」「殲滅」「間諜」「破壞」「攔截」）。按硬性约束不做私自简繁替换，标记 `zhSource: traditional:...`。
2. **星图节点英文名**：上游 `solNodes.json` 中节点名格式多为「Galatea (海王星)」，即英文节点名 + 中文星球。本站保留原样英文并计入「资料原样英文」。
3. **特殊来源与未开紫卡模式**：如「Arbitrations」「Sanctuary Onslaught」「The Circuit」在原始资料任务类型与语言包中无单一对应模式名，按规则保留英文。

## 5. 剩余英文详细清单 (按类别列出每一条)

| 序号 | 类别 | 英文名称 | 属性分类 | 原因 / 来源说明 |
| :---: | :--- | :--- | :---: | :--- |
| 1 | 物品 (Items) | `Lohk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: wfcd_i18n:/Lotus/Upgrades/Mods/Immortal/ImmortalOneMod) |
| 2 | 物品 (Items) | `Xata` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: wfcd_i18n:/Lotus/Upgrades/Mods/Immortal/ImmortalTwoMod) |
| 3 | 物品 (Items) | `Jahu` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: wfcd_i18n:/Lotus/Upgrades/Mods/Immortal/ImmortalThreeMod) |
| 4 | 物品 (Items) | `Vome` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: wfcd_i18n:/Lotus/Upgrades/Mods/Immortal/ImmortalFourMod) |
| 5 | 物品 (Items) | `Ris` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: wfcd_i18n:/Lotus/Upgrades/Mods/Immortal/ImmortalFiveMod) |
| 6 | 物品 (Items) | `Fass` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: wfcd_i18n:/Lotus/Upgrades/Mods/Immortal/ImmortalSixMod) |
| 7 | 物品 (Items) | `Netra` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: wfcd_i18n:/Lotus/Upgrades/Mods/Immortal/ImmortalSevenMod) |
| 8 | 物品 (Items) | `Khra` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: wfcd_i18n:/Lotus/Upgrades/Mods/Immortal/ImmortalEightMod) |
| 9 | 物品 (Items) | `Exilus Weapon Adapter Blueprint` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: wfcd_worldstate:languages:/Lotus/StoreItems/Types/Recipes/Components/WeaponUtilityUnlockerBlueprint) |
| 10 | Mod (Mods) | `Lightning Dash` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: wfcd_i18n:/Lotus/Upgrades/Focus/Power/Active/DashElectricityFocusUpgrade) |
| 11 | 掉落来源 (Sources) | `Enemy: Scaldra Screamer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 12 | 掉落来源 (Sources) | `Enemy: Scaldra Ti-92` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 13 | 掉落来源 (Sources) | `Enemy: H-09 Efervon Tank` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 14 | 掉落来源 (Sources) | `Enemy: H-09 Apex` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 15 | 掉落来源 (Sources) | `Enemy: Lyon Allard` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 16 | 掉落来源 (Sources) | `Enemy: Marie Leroux` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 17 | 掉落来源 (Sources) | `Enemy: Techrot Obsolyte` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 18 | 掉落来源 (Sources) | `Enemy: Techrot Babau` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 19 | 掉落来源 (Sources) | `Enemy: Techrot Skuzzi` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 20 | 掉落来源 (Sources) | `Enemy: Techrot Galliflex` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 21 | 掉落来源 (Sources) | `Enemy: Techrot Volatile Galliflex` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 22 | 掉落来源 (Sources) | `Enemy: Techrot Matmas` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 23 | 掉落来源 (Sources) | `Enemy: Techrot Scaart` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 24 | 掉落来源 (Sources) | `Enemy: Scaldra Flayer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 25 | 掉落来源 (Sources) | `Enemy: Scaldra Dedicant` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 26 | 掉落来源 (Sources) | `Enemy: Scaldra Eradicator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 27 | 掉落来源 (Sources) | `Enemy: Scaldra Jaeger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 28 | 掉落来源 (Sources) | `Enemy: Scaldra Barbican` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 29 | 掉落来源 (Sources) | `Enemy: The Sergeant` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 30 | 掉落来源 (Sources) | `Enemy: Vem Tabook` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 31 | 掉落来源 (Sources) | `Enemy: Leekter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 32 | 掉落来源 (Sources) | `Enemy: Shik Tal` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 33 | 掉落来源 (Sources) | `Enemy: Executioner Zura` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 34 | 掉落来源 (Sources) | `Enemy: Executioner Garesh` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 35 | 掉落来源 (Sources) | `Enemy: Executioner Harkonar` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 36 | 掉落来源 (Sources) | `Enemy: Executioner Reth` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 37 | 掉落来源 (Sources) | `Enemy: Executioner Dhurnam` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 38 | 掉落来源 (Sources) | `Enemy: Executioner Vay Molta` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 39 | 掉落来源 (Sources) | `Enemy: Executioner Dok Thul` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 40 | 掉落来源 (Sources) | `Enemy: Executioner Nok` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 41 | 掉落来源 (Sources) | `Enemy: Executioner Gorth` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 42 | 掉落来源 (Sources) | `Enemy: Amalgam Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 43 | 掉落来源 (Sources) | `Enemy: Amalgam Kucumatz` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 44 | 掉落来源 (Sources) | `Enemy: Demolyst Machinist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 45 | 掉落来源 (Sources) | `Enemy: Demolyst Heqet` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 46 | 掉落来源 (Sources) | `Enemy: Amalgam Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 47 | 掉落来源 (Sources) | `Enemy: Demolyst Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 48 | 掉落来源 (Sources) | `Enemy: Amalgam Satyr` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 49 | 掉落来源 (Sources) | `Enemy: Demolyst Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 50 | 掉落来源 (Sources) | `Enemy: Amalgam Alkonost` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 51 | 掉落来源 (Sources) | `Enemy: Amalgam Machinist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 52 | 掉落来源 (Sources) | `Enemy: Demolyst Satyr` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 53 | 掉落来源 (Sources) | `Enemy: Amalgam Heqet` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 54 | 掉落来源 (Sources) | `Enemy: Vapos Tech` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 55 | 掉落来源 (Sources) | `Enemy: Vapos Sapping Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 56 | 掉落来源 (Sources) | `Enemy: Vapos Elite Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 57 | 掉落来源 (Sources) | `Enemy: Vapos Tech Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 58 | 掉落来源 (Sources) | `Enemy: Vapos Elite Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 59 | 掉落来源 (Sources) | `Enemy: Vapos Nullifier Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 60 | 掉落来源 (Sources) | `Enemy: Vapos Detron Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 61 | 掉落来源 (Sources) | `Enemy: Vapos Sniper Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 62 | 掉落来源 (Sources) | `Enemy: Vapos Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 63 | 掉落来源 (Sources) | `Enemy: Vapos Anti Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 64 | 掉落来源 (Sources) | `Enemy: Vapos Prod Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 65 | 掉落来源 (Sources) | `Enemy: Vapos Nullifier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 66 | 掉落来源 (Sources) | `Enemy: Vapos Railgun Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 67 | 掉落来源 (Sources) | `Enemy: Vapos Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 68 | 掉落来源 (Sources) | `Enemy: Vapos Bioengineer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 69 | 掉落来源 (Sources) | `Enemy: Vapos Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 70 | 掉落来源 (Sources) | `Enemy: Vapos Shockwave Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 71 | 掉落来源 (Sources) | `Enemy: Vapos Detron Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 72 | 掉落来源 (Sources) | `Enemy: Vapos Sniper Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 73 | 掉落来源 (Sources) | `Enemy: Vapos Oxium Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 74 | 掉落来源 (Sources) | `Enemy: Vapos Fusion Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 75 | 掉落来源 (Sources) | `Enemy: Amalgam Cinder Machinist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 76 | 掉落来源 (Sources) | `Enemy: Amalgam Arca Kucumatz` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 77 | 掉落来源 (Sources) | `Enemy: Amalgam Arca Heqet` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 78 | 掉落来源 (Sources) | `Enemy: Amalgam Phase Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 79 | 掉落来源 (Sources) | `Enemy: Amalgam Swarm Satyr` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 80 | 掉落来源 (Sources) | `Enemy: Vapos Aquila` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 81 | 掉落来源 (Sources) | `Enemy: Taro Ranger Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 82 | 掉落来源 (Sources) | `Enemy: Optio` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 83 | 掉落来源 (Sources) | `Enemy: Taro Zerca` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 84 | 掉落来源 (Sources) | `Enemy: Taro Vambac` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 85 | 掉落来源 (Sources) | `Enemy: Taro Numon` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 86 | 掉落来源 (Sources) | `Enemy: Tarask Bursa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 87 | 掉落来源 (Sources) | `Enemy: Taro Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 88 | 掉落来源 (Sources) | `Enemy: Taro Disc Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 89 | 掉落来源 (Sources) | `Enemy: Taro Elite Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 90 | 掉落来源 (Sources) | `Enemy: Taro Stropha Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 91 | 掉落来源 (Sources) | `Enemy: Taro Nullifier Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 92 | 掉落来源 (Sources) | `Enemy: Axio Nullifier Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 93 | 掉落来源 (Sources) | `Enemy: Vorac Nullifier Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 94 | 掉落来源 (Sources) | `Enemy: Taro Railgun Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 95 | 掉落来源 (Sources) | `Enemy: Taro Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 96 | 掉落来源 (Sources) | `Enemy: Taro Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 97 | 掉落来源 (Sources) | `Enemy: Taro Shockwave Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 98 | 掉落来源 (Sources) | `Enemy: Taro Detron Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 99 | 掉落来源 (Sources) | `Enemy: Taro Pilot` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 100 | 掉落来源 (Sources) | `Enemy: Aurax Actinic` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 101 | 掉落来源 (Sources) | `Enemy: Aurax Vertec` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 102 | 掉落来源 (Sources) | `Enemy: Taro Tech` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 103 | 掉落来源 (Sources) | `Enemy: Aurax Atloc Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 104 | 掉落来源 (Sources) | `Enemy: Aurax Culveri Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 105 | 掉落来源 (Sources) | `Enemy: Aurax Polaris Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 106 | 掉落来源 (Sources) | `Enemy: Aurax Baculus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 107 | 掉落来源 (Sources) | `Enemy: Taro Engineer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 108 | 掉落来源 (Sources) | `Enemy: Orm Zerca` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 109 | 掉落来源 (Sources) | `Enemy: Orm Vambac` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 110 | 掉落来源 (Sources) | `Enemy: Orm Numon` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 111 | 掉落来源 (Sources) | `Enemy: Orm Ranger Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 112 | 掉落来源 (Sources) | `Enemy: Orm Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 113 | 掉落来源 (Sources) | `Enemy: Orm Disc Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 114 | 掉落来源 (Sources) | `Enemy: Orm Elite Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 115 | 掉落来源 (Sources) | `Enemy: Orm Stropha Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 116 | 掉落来源 (Sources) | `Enemy: Orm Stropha Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 117 | 掉落来源 (Sources) | `Enemy: Orm Nullifier Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 118 | 掉落来源 (Sources) | `Enemy: Orm Nullifier Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 119 | 掉落来源 (Sources) | `Enemy: Orm Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 120 | 掉落来源 (Sources) | `Enemy: Orm Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 121 | 掉落来源 (Sources) | `Enemy: Orm Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 122 | 掉落来源 (Sources) | `Enemy: Orm Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 123 | 掉落来源 (Sources) | `Enemy: Orm Detron Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 124 | 掉落来源 (Sources) | `Enemy: Orm Detron Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 125 | 掉落来源 (Sources) | `Enemy: Orm Pilot` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 126 | 掉落来源 (Sources) | `Enemy: Orm Railgun Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 127 | 掉落来源 (Sources) | `Enemy: Orm Railgun Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 128 | 掉落来源 (Sources) | `Enemy: Orm Shockwave Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 129 | 掉落来源 (Sources) | `Enemy: Orm Tech` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 130 | 掉落来源 (Sources) | `Enemy: Orm Tech` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 131 | 掉落来源 (Sources) | `Enemy: Orm Engineer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 132 | 掉落来源 (Sources) | `Enemy: Taro Secura Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 133 | 掉落来源 (Sources) | `Enemy: Axio Zerca` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 134 | 掉落来源 (Sources) | `Enemy: Axio Vambac` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 135 | 掉落来源 (Sources) | `Enemy: Axio Numon` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 136 | 掉落来源 (Sources) | `Enemy: Axio Ranger Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 137 | 掉落来源 (Sources) | `Enemy: Axio Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 138 | 掉落来源 (Sources) | `Enemy: Axio Disc Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 139 | 掉落来源 (Sources) | `Enemy: Axio Elite Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 140 | 掉落来源 (Sources) | `Enemy: Axio Stropha Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 141 | 掉落来源 (Sources) | `Enemy: Axio Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 142 | 掉落来源 (Sources) | `Enemy: Axio Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 143 | 掉落来源 (Sources) | `Enemy: Axio Detron Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 144 | 掉落来源 (Sources) | `Enemy: Axio Pilot` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 145 | 掉落来源 (Sources) | `Enemy: Axio Railgun Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 146 | 掉落来源 (Sources) | `Enemy: Axio Shockwave Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 147 | 掉落来源 (Sources) | `Enemy: Axio Tech` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 148 | 掉落来源 (Sources) | `Enemy: Axio Engineer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 149 | 掉落来源 (Sources) | `Enemy: Vorac Zerca` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 150 | 掉落来源 (Sources) | `Enemy: Vorac Vambac` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 151 | 掉落来源 (Sources) | `Enemy: Vorac Numon` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 152 | 掉落来源 (Sources) | `Enemy: Vorac Ranger Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 153 | 掉落来源 (Sources) | `Enemy: Vorac Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 154 | 掉落来源 (Sources) | `Enemy: Vorac Disc Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 155 | 掉落来源 (Sources) | `Enemy: Vorac Elite Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 156 | 掉落来源 (Sources) | `Enemy: Vorac Stropha Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 157 | 掉落来源 (Sources) | `Enemy: Vorac Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 158 | 掉落来源 (Sources) | `Enemy: Vorac Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 159 | 掉落来源 (Sources) | `Enemy: Vorac Detron Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 160 | 掉落来源 (Sources) | `Enemy: Vorac Pilot` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 161 | 掉落来源 (Sources) | `Enemy: Vorac Railgun Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 162 | 掉落来源 (Sources) | `Enemy: Vorac Shockwave Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 163 | 掉落来源 (Sources) | `Enemy: Vorac Tech` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 164 | 掉落来源 (Sources) | `Enemy: Vorac Engineer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 165 | 掉落来源 (Sources) | `Enemy: Demolisher Bonewidow` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 166 | 掉落来源 (Sources) | `Enemy: Demolisher Voidrig` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 167 | 掉落来源 (Sources) | `Enemy: Tamm` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 168 | 掉落来源 (Sources) | `Enemy: Tusk Thumper Doma` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 169 | 掉落来源 (Sources) | `Enemy: Tusk Thumper Bull` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 170 | 掉落来源 (Sources) | `Enemy: Tusk Thumper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 171 | 掉落来源 (Sources) | `Enemy: Leaping Thrasher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 172 | 掉落来源 (Sources) | `Enemy: Zealot Proselytizer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 173 | 掉落来源 (Sources) | `Enemy: Zealot Herald` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 174 | 掉落来源 (Sources) | `Enemy: Zealot Baptizer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 175 | 掉落来源 (Sources) | `Enemy: Juno Sapper Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 176 | 掉落来源 (Sources) | `Enemy: Brachiolyst Disperser` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 177 | 掉落来源 (Sources) | `Enemy: Ved Xol` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 178 | 掉落来源 (Sources) | `Enemy: Nako Xol` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 179 | 掉落来源 (Sources) | `Enemy: Pelna Cade` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 180 | 掉落来源 (Sources) | `Enemy: Lockjaw & Sol` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 181 | 掉落来源 (Sources) | `Enemy: Jad Teran` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 182 | 掉落来源 (Sources) | `Enemy: Azoth` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 183 | 掉落来源 (Sources) | `Enemy: Raptor Rx` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 184 | 掉落来源 (Sources) | `Enemy: Auditor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 185 | 掉落来源 (Sources) | `Enemy: Jen Dro` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 186 | 掉落来源 (Sources) | `Enemy: Derim Zahn` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 187 | 掉落来源 (Sources) | `Enemy: M-W.A.M.` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 188 | 掉落来源 (Sources) | `Enemy: Tia Mayn` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 189 | 掉落来源 (Sources) | `Enemy: Armis Ulta` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 190 | 掉落来源 (Sources) | `Enemy: Dru Pesfor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 191 | 掉落来源 (Sources) | `Enemy: Rana Del` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 192 | 掉落来源 (Sources) | `Enemy: 002-Er` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 193 | 掉落来源 (Sources) | `Enemy: Machinist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 194 | 掉落来源 (Sources) | `Enemy: Carrion Charger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 195 | 掉落来源 (Sources) | `Enemy: Arbitration Shield Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 196 | 掉落来源 (Sources) | `Enemy: Corrupted Drahk Master` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 197 | 掉落来源 (Sources) | `Enemy: Corrupted Drahk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 198 | 掉落来源 (Sources) | `Enemy: Corrupted Power Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 199 | 掉落来源 (Sources) | `Enemy: Derivator Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 200 | 掉落来源 (Sources) | `Enemy: Demolisher Devourer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 201 | 掉落来源 (Sources) | `Enemy: Demolisher Expired` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 202 | 掉落来源 (Sources) | `Enemy: Demolisher Boiler` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 203 | 掉落来源 (Sources) | `Enemy: Demolisher Machinist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 204 | 掉落来源 (Sources) | `Enemy: Demolisher Bailiff` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 205 | 掉落来源 (Sources) | `Enemy: Demolisher Hyena` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 206 | 掉落来源 (Sources) | `Enemy: Demolisher Thrasher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 207 | 掉落来源 (Sources) | `Enemy: Demolisher Juggernaut` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 208 | 掉落来源 (Sources) | `Enemy: Demolisher Anti Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 209 | 掉落来源 (Sources) | `Enemy: Demolisher Heavy Gunner` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 210 | 掉落来源 (Sources) | `Enemy: Demolisher Nox` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 211 | 掉落来源 (Sources) | `Enemy: Demolisher Charger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 212 | 掉落来源 (Sources) | `Enemy: Demolisher Bursa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 213 | 掉落来源 (Sources) | `Enemy: Demolisher Kuva Guardian` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 214 | 掉落来源 (Sources) | `Enemy: Tusk Elite Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 215 | 掉落来源 (Sources) | `Enemy: Tusk Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 216 | 掉落来源 (Sources) | `Enemy: Tusk Napalm` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 217 | 掉落来源 (Sources) | `Enemy: Tusk Heavy Gunner` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 218 | 掉落来源 (Sources) | `Enemy: Tusk Bombard` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 219 | 掉落来源 (Sources) | `Enemy: Tusk Reaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 220 | 掉落来源 (Sources) | `Enemy: Tusk Hellion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 221 | 掉落来源 (Sources) | `Enemy: Tusk Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 222 | 掉落来源 (Sources) | `Enemy: Tusk Shield Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 223 | 掉落来源 (Sources) | `Enemy: Tusk Trooper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 224 | 掉落来源 (Sources) | `Enemy: Tusk Seeker` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 225 | 掉落来源 (Sources) | `Enemy: Tusk Roller` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 226 | 掉落来源 (Sources) | `Enemy: Tusk Flameblade` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 227 | 掉落来源 (Sources) | `Enemy: Tusk Butcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 228 | 掉落来源 (Sources) | `Enemy: Tusk Shield Dargyn` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 229 | 掉落来源 (Sources) | `Enemy: Tusk Shield Dargyn` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 230 | 掉落来源 (Sources) | `Enemy: Tusk Dargyn` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 231 | 掉落来源 (Sources) | `Enemy: Tusk Dargyn` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 232 | 掉落来源 (Sources) | `Enemy: Tusk Ballista` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 233 | 掉落来源 (Sources) | `Enemy: Tusk Mortar Bombard` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 234 | 掉落来源 (Sources) | `Enemy: Tusk Predator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 235 | 掉落来源 (Sources) | `Enemy: Dargyn Pilot` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 236 | 掉落来源 (Sources) | `Enemy: Plains Commander` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 237 | 掉落来源 (Sources) | `Enemy: Aerial Commander` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 238 | 掉落来源 (Sources) | `Enemy: Tusk Command Dargyn` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 239 | 掉落来源 (Sources) | `Enemy: Recon Commander` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 240 | 掉落来源 (Sources) | `Enemy: Elite Shield Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 241 | 掉落来源 (Sources) | `Enemy: Erra` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 242 | 掉落来源 (Sources) | `Enemy: Knave Specter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 243 | 掉落来源 (Sources) | `Enemy: Feyarch Specter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 244 | 掉落来源 (Sources) | `Enemy: Orphid Specter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 245 | 掉落来源 (Sources) | `Enemy: Orphid Husks` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 246 | 掉落来源 (Sources) | `Enemy: Kuva Hyekka` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 247 | 掉落来源 (Sources) | `Enemy: Kuva Trokarian` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 248 | 掉落来源 (Sources) | `Enemy: Ancient Protector` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 249 | 掉落来源 (Sources) | `Enemy: Ancient Protector` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 250 | 掉落来源 (Sources) | `Enemy: Undying Flyer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 251 | 掉落来源 (Sources) | `Enemy: Nightwatch Reaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 252 | 掉落来源 (Sources) | `Enemy: Kuva Bailiff` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 253 | 掉落来源 (Sources) | `Enemy: Kuva Larvling` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 254 | 掉落来源 (Sources) | `Enemy: Ratel` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 255 | 掉落来源 (Sources) | `Enemy: Ratel` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 256 | 掉落来源 (Sources) | `Enemy: Minima Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 257 | 掉落来源 (Sources) | `Enemy: Nightwatch Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 258 | 掉落来源 (Sources) | `Enemy: Ember Specter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 259 | 掉落来源 (Sources) | `Enemy: Aerolyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 260 | 掉落来源 (Sources) | `Enemy: Brachiolyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 261 | 掉落来源 (Sources) | `Enemy: Summulyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 262 | 掉落来源 (Sources) | `Enemy: Tyro Conculyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 263 | 掉落来源 (Sources) | `Enemy: Ortholyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 264 | 掉落来源 (Sources) | `Enemy: Symbilyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 265 | 掉落来源 (Sources) | `Enemy: Juno Fog Comba` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 266 | 掉落来源 (Sources) | `Enemy: Juno Sap Comba` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 267 | 掉落来源 (Sources) | `Enemy: Juno Nul Comba` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 268 | 掉落来源 (Sources) | `Enemy: Juno Slo Comba` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 269 | 掉落来源 (Sources) | `Enemy: Juno Elite Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 270 | 掉落来源 (Sources) | `Enemy: Juno Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 271 | 掉落来源 (Sources) | `Enemy: Juno Nullifier Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 272 | 掉落来源 (Sources) | `Enemy: Juno Sniper Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 273 | 掉落来源 (Sources) | `Enemy: Juno Tech` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 274 | 掉落来源 (Sources) | `Enemy: Juno Malleus Machinist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 275 | 掉落来源 (Sources) | `Enemy: Juno Dera Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 276 | 掉落来源 (Sources) | `Enemy: Juno Disc Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 277 | 掉落来源 (Sources) | `Enemy: Juno Geminex Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 278 | 掉落来源 (Sources) | `Enemy: Juno Glaxion Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 279 | 掉落来源 (Sources) | `Enemy: Juno Jactus Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 280 | 掉落来源 (Sources) | `Enemy: Juno Oxium Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 281 | 掉落来源 (Sources) | `Enemy: Juno Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 282 | 掉落来源 (Sources) | `Enemy: Test Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 283 | 掉落来源 (Sources) | `Enemy: Terra Jackal` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 284 | 掉落来源 (Sources) | `Enemy: Eidolon Vomvalyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 285 | 掉落来源 (Sources) | `Enemy: Zealoid Prelate` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 286 | 掉落来源 (Sources) | `Enemy: Saturn Six Fugitive` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 287 | 掉落来源 (Sources) | `Enemy: Wolf Of Saturn Six` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 288 | 掉落来源 (Sources) | `Enemy: Void Angel` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 289 | 掉落来源 (Sources) | `Enemy: Ravenous Void Angel` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 290 | 掉落来源 (Sources) | `Enemy: Guardsman` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: en_as_is:wfcd_worldstate:languages:/lotus/types/game/library/targets/research7target) |
| 291 | 掉落来源 (Sources) | `Enemy: Muzureh Entrati Coffer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 292 | 掉落来源 (Sources) | `Enemy: Thalmin Entrati Coffer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 293 | 掉落来源 (Sources) | `Enemy: Elementa Arcocanid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 294 | 掉落来源 (Sources) | `Enemy: Elementa Culverin` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 295 | 掉落来源 (Sources) | `Enemy: Shuffling Fragment` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 296 | 掉落来源 (Sources) | `Enemy: Lumbering Fragment` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 297 | 掉落来源 (Sources) | `Enemy: Mocking Whisper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 298 | 掉落来源 (Sources) | `Enemy: Scathing Whisper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 299 | 掉落来源 (Sources) | `Enemy: Rupturing Fragment` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 300 | 掉落来源 (Sources) | `Enemy: The Anatomizer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 301 | 掉落来源 (Sources) | `Enemy: Rogue Bonewidow` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 302 | 掉落来源 (Sources) | `Enemy: Rogue Arcocanid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 303 | 掉落来源 (Sources) | `Enemy: Rogue Culverin` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 304 | 掉落来源 (Sources) | `Enemy: Rogue Voidrig` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 305 | 掉落来源 (Sources) | `Enemy: The Fragmented Suzerain` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 306 | 掉落来源 (Sources) | `Enemy: The Hollow Vein` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 307 | 掉落来源 (Sources) | `Enemy: The Severed Warden` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 308 | 掉落来源 (Sources) | `Enemy: Hurling Fragment` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 309 | 掉落来源 (Sources) | `Enemy: Infested Oni` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 310 | 掉落来源 (Sources) | `Enemy: Arcane Boiler` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 311 | 掉落来源 (Sources) | `Enemy: Nauseous Void Shade` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 312 | 掉落来源 (Sources) | `Enemy: Void Shade` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 313 | 掉落来源 (Sources) | `Enemy: Alad V` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: en_as_is:wfcd_worldstate:sortieData:bosses:SORTIE_BOSS_ALAD) |
| 314 | 掉落来源 (Sources) | `Enemy: Attack Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 315 | 掉落来源 (Sources) | `Enemy: Attack Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 316 | 掉落来源 (Sources) | `Enemy: Ambulas` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: en_as_is:wfcd_worldstate:sortieData:bosses:SORTIE_BOSS_AMBULAS) |
| 317 | 掉落来源 (Sources) | `Enemy: Remech Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 318 | 掉落来源 (Sources) | `Enemy: Mutalist Osprey Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 319 | 掉落来源 (Sources) | `Enemy: Nox` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 320 | 掉落来源 (Sources) | `Enemy: Drover Bursa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 321 | 掉落来源 (Sources) | `Enemy: Datalyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 322 | 掉落来源 (Sources) | `Enemy: Nemes` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 323 | 掉落来源 (Sources) | `Enemy: Corvette` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 324 | 掉落来源 (Sources) | `Enemy: Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 325 | 掉落来源 (Sources) | `Enemy: Quanta Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 326 | 掉落来源 (Sources) | `Enemy: Penta Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 327 | 掉落来源 (Sources) | `Enemy: Frigate` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 328 | 掉落来源 (Sources) | `Enemy: Uncommon Corpus Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 329 | 掉落来源 (Sources) | `Enemy: Lynx` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 330 | 掉落来源 (Sources) | `Enemy: Gox` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 331 | 掉落来源 (Sources) | `Enemy: Cannon Battery` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 332 | 掉落来源 (Sources) | `Enemy: Cannon Battery` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 333 | 掉落来源 (Sources) | `Enemy: Cannon Battery` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 334 | 掉落来源 (Sources) | `Enemy: Locust Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 335 | 掉落来源 (Sources) | `Enemy: Corrupted Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 336 | 掉落来源 (Sources) | `Enemy: Corrupted Heavy Gunner` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 337 | 掉落来源 (Sources) | `Enemy: Corrupted Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 338 | 掉落来源 (Sources) | `Enemy: Corrupted Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 339 | 掉落来源 (Sources) | `Enemy: Corpus Power Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 340 | 掉落来源 (Sources) | `Enemy: Corpus Power Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 341 | 掉落来源 (Sources) | `Enemy: Corpus Tech` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 342 | 掉落来源 (Sources) | `Enemy: Sapping Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 343 | 掉落来源 (Sources) | `Enemy: Isolator Bursa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 344 | 掉落来源 (Sources) | `Enemy: Hemocyte` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 345 | 掉落来源 (Sources) | `Enemy: Elite Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 346 | 掉落来源 (Sources) | `Enemy: Elite Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 347 | 掉落来源 (Sources) | `Enemy: Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 348 | 掉落来源 (Sources) | `Enemy: Elite Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 349 | 掉落来源 (Sources) | `Enemy: Kavat` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 350 | 掉落来源 (Sources) | `Enemy: Kuva Elite Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 351 | 掉落来源 (Sources) | `Enemy: Kuva Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 352 | 掉落来源 (Sources) | `Enemy: Kuva Drahk Master` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 353 | 掉落来源 (Sources) | `Enemy: Kuva Napalm` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 354 | 掉落来源 (Sources) | `Enemy: Kuva Heavy Gunner` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 355 | 掉落来源 (Sources) | `Enemy: Kuva Bombard` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 356 | 掉落来源 (Sources) | `Enemy: Kuva Hyekka Master` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 357 | 掉落来源 (Sources) | `Enemy: Kuva Scorch` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 358 | 掉落来源 (Sources) | `Enemy: Kuva Hellion Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 359 | 掉落来源 (Sources) | `Enemy: Kuva Hellion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 360 | 掉落来源 (Sources) | `Enemy: Kuva Drahk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 361 | 掉落来源 (Sources) | `Enemy: Kuva Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 362 | 掉落来源 (Sources) | `Enemy: Kuva Shield Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 363 | 掉落来源 (Sources) | `Enemy: Kuva Trooper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 364 | 掉落来源 (Sources) | `Enemy: Kuva Seeker` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 365 | 掉落来源 (Sources) | `Enemy: Kuva Roller` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 366 | 掉落来源 (Sources) | `Enemy: Kuva Flameblade` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 367 | 掉落来源 (Sources) | `Enemy: Kuva Butcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 368 | 掉落来源 (Sources) | `Enemy: Kuva Powerclaw` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 369 | 掉落来源 (Sources) | `Enemy: Kuva Ballista` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 370 | 掉落来源 (Sources) | `Enemy: Kuva Power Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 371 | 掉落来源 (Sources) | `Enemy: Kuva Scorpion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 372 | 掉落来源 (Sources) | `Enemy: Draga` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 373 | 掉落来源 (Sources) | `Enemy: Fusion Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 374 | 掉落来源 (Sources) | `Enemy: Ghoul Devourer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 375 | 掉落来源 (Sources) | `Enemy: Ghoul Auger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 376 | 掉落来源 (Sources) | `Enemy: Ghoul Auger Alpha` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 377 | 掉落来源 (Sources) | `Enemy: Ghoul Expired` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 378 | 掉落来源 (Sources) | `Enemy: Ghoul Rictus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 379 | 掉落来源 (Sources) | `Enemy: Ghoul Rictus Alpha` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 380 | 掉落来源 (Sources) | `Enemy: Lephantis` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: en_as_is:wfcd_worldstate:sortieData:bosses:SORTIE_BOSS_LEPHANTIS) |
| 381 | 掉落来源 (Sources) | `Enemy: Infested Corpus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 382 | 掉落来源 (Sources) | `Enemy: Ancient Infested` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 383 | 掉落来源 (Sources) | `Enemy: Infested Grineer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 384 | 掉落来源 (Sources) | `Enemy: Artificer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 385 | 掉落来源 (Sources) | `Enemy: Carabus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 386 | 掉落来源 (Sources) | `Enemy: Drahk Master` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 387 | 掉落来源 (Sources) | `Enemy: Arid Butcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 388 | 掉落来源 (Sources) | `Enemy: Frontier Butcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 389 | 掉落来源 (Sources) | `Enemy: Napalm` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 390 | 掉落来源 (Sources) | `Enemy: Heavy Gunner` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 391 | 掉落来源 (Sources) | `Enemy: Arid Heavy Gunner` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 392 | 掉落来源 (Sources) | `Enemy: Bombard` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 393 | 掉落来源 (Sources) | `Enemy: Hyekka Master` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 394 | 掉落来源 (Sources) | `Enemy: Frontier Bailiff` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 395 | 掉落来源 (Sources) | `Enemy: Bailiff` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 396 | 掉落来源 (Sources) | `Enemy: Bailiff` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 397 | 掉落来源 (Sources) | `Enemy: Hyekka` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 398 | 掉落来源 (Sources) | `Enemy: Ogma` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 399 | 掉落来源 (Sources) | `Enemy: Bailiff Defector` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 400 | 掉落来源 (Sources) | `Enemy: Elite Arid Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 401 | 掉落来源 (Sources) | `Enemy: Elite Frontier Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 402 | 掉落来源 (Sources) | `Enemy: Arid Eviscerator` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: en_as_is:wfcd_worldstate:languages:/lotus/types/game/library/targets/research3target) |
| 403 | 掉落来源 (Sources) | `Enemy: Frontier Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 404 | 掉落来源 (Sources) | `Enemy: Scorch` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: en_as_is:wfcd_worldstate:languages:/lotus/storeitems/upgrades/mods/pistol/dualstat/fireeventpistolmod) |
| 405 | 掉落来源 (Sources) | `Enemy: Kuva Dargyn` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 406 | 掉落来源 (Sources) | `Enemy: Frontier Heavy Gunner` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 407 | 掉落来源 (Sources) | `Enemy: Hellion Power Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 408 | 掉落来源 (Sources) | `Enemy: Hellion Power Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 409 | 掉落来源 (Sources) | `Enemy: Arid Hellion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 410 | 掉落来源 (Sources) | `Enemy: Frontier Hellion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 411 | 掉落来源 (Sources) | `Enemy: Sprag` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 412 | 掉落来源 (Sources) | `Enemy: Hellion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 413 | 掉落来源 (Sources) | `Enemy: Ven'Kra Tel` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 414 | 掉落来源 (Sources) | `Enemy: Drahk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 415 | 掉落来源 (Sources) | `Enemy: Lancer` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: en_as_is:wfcd_worldstate:languages:/lotus/types/game/library/targets/research1target) |
| 416 | 掉落来源 (Sources) | `Enemy: Shield Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 417 | 掉落来源 (Sources) | `Enemy: Trooper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 418 | 掉落来源 (Sources) | `Enemy: Lancer Dreg` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 419 | 掉落来源 (Sources) | `Enemy: Commander` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 420 | 掉落来源 (Sources) | `Enemy: Common Grineer Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 421 | 掉落来源 (Sources) | `Enemy: Uncommon Grineer Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 422 | 掉落来源 (Sources) | `Enemy: Manic Bombard` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 423 | 掉落来源 (Sources) | `Enemy: Arid Seeker` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 424 | 掉落来源 (Sources) | `Enemy: Frontier Seeker` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 425 | 掉落来源 (Sources) | `Enemy: Zeplen` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 426 | 掉落来源 (Sources) | `Enemy: Shield-Hellion Dargyn` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 427 | 掉落来源 (Sources) | `Enemy: Hellion Dargyn` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 428 | 掉落来源 (Sources) | `Enemy: Hellion Dargyn` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 429 | 掉落来源 (Sources) | `Enemy: Seeker` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: en_as_is:wfcd_worldstate:languages:/lotus/storeitems/upgrades/mods/pistol/beginner/weaponpuncturedepthmodbeginner) |
| 430 | 掉落来源 (Sources) | `Enemy: Frontier Regulator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 431 | 掉落来源 (Sources) | `Enemy: Regulator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 432 | 掉落来源 (Sources) | `Enemy: Arid Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 433 | 掉落来源 (Sources) | `Enemy: Frontier Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 434 | 掉落来源 (Sources) | `Enemy: Roller` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 435 | 掉落来源 (Sources) | `Enemy: Roller Sentry` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 436 | 掉落来源 (Sources) | `Enemy: Kuva Guardian` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 437 | 掉落来源 (Sources) | `Enemy: Flameblade` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 438 | 掉落来源 (Sources) | `Enemy: Butcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 439 | 掉落来源 (Sources) | `Enemy: Powerfist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 440 | 掉落来源 (Sources) | `Enemy: Shield Dargyn` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 441 | 掉落来源 (Sources) | `Enemy: Arid Trooper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 442 | 掉落来源 (Sources) | `Enemy: Frontier Trooper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 443 | 掉落来源 (Sources) | `Enemy: Dargyn` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 444 | 掉落来源 (Sources) | `Enemy: Ballista` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 445 | 掉落来源 (Sources) | `Enemy: Dreg` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 446 | 掉落来源 (Sources) | `Enemy: Dreg` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 447 | 掉落来源 (Sources) | `Enemy: Cannon Battery` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 448 | 掉落来源 (Sources) | `Enemy: Cannon Battery` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 449 | 掉落来源 (Sources) | `Enemy: Temporal Dreg` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 450 | 掉落来源 (Sources) | `Enemy: Grineer Power Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 451 | 掉落来源 (Sources) | `Enemy: Hunhow` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 452 | 掉落来源 (Sources) | `Enemy: Hyena Th` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 453 | 掉落来源 (Sources) | `Enemy: Hyena Ng` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 454 | 掉落来源 (Sources) | `Enemy: Hyena Pb` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 455 | 掉落来源 (Sources) | `Enemy: Hyena Ln2` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 456 | 掉落来源 (Sources) | `Enemy: Brood Mother` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 457 | 掉落来源 (Sources) | `Enemy: Brood Mother` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 458 | 掉落来源 (Sources) | `Enemy: Ancient Disruptor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 459 | 掉落来源 (Sources) | `Enemy: Ancient Healer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 460 | 掉落来源 (Sources) | `Enemy: Boiler` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 461 | 掉落来源 (Sources) | `Enemy: Venin Mutalist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 462 | 掉落来源 (Sources) | `Enemy: Nauseous Crawler` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 463 | 掉落来源 (Sources) | `Enemy: Nauseous Crawler` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 464 | 掉落来源 (Sources) | `Enemy: Lobber Crawler` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 465 | 掉落来源 (Sources) | `Enemy: Leaper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 466 | 掉落来源 (Sources) | `Enemy: Leaper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 467 | 掉落来源 (Sources) | `Enemy: Electric Crawler` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 468 | 掉落来源 (Sources) | `Enemy: Electric Crawler` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 469 | 掉落来源 (Sources) | `Enemy: Crawler` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 470 | 掉落来源 (Sources) | `Enemy: Charger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 471 | 掉落来源 (Sources) | `Enemy: Infested Mesa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 472 | 掉落来源 (Sources) | `Enemy: Tar Mutalist Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 473 | 掉落来源 (Sources) | `Enemy: Tar Mutalist Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 474 | 掉落来源 (Sources) | `Enemy: Swarm Mutalist Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 475 | 掉落来源 (Sources) | `Enemy: Swarm Mutalist Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 476 | 掉落来源 (Sources) | `Enemy: Toxic Crawler` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 477 | 掉落来源 (Sources) | `Enemy: Toxic Crawler` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 478 | 掉落来源 (Sources) | `Enemy: Attack Mutalist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 479 | 掉落来源 (Sources) | `Enemy: Mutalist Lightning Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 480 | 掉落来源 (Sources) | `Enemy: Mutalist Toxic Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 481 | 掉落来源 (Sources) | `Enemy: Mutalist Cannon Battery` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 482 | 掉落来源 (Sources) | `Enemy: Volatile Runner` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 483 | 掉落来源 (Sources) | `Enemy: Toxic Ancient` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 484 | 掉落来源 (Sources) | `Enemy: Darek Draga` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 485 | 掉落来源 (Sources) | `Enemy: J3 Jordas Golem` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 486 | 掉落来源 (Sources) | `Enemy: Juggernaut Behemoth` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 487 | 掉落来源 (Sources) | `Enemy: Juggernaut` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 488 | 掉落来源 (Sources) | `Enemy: Juggernaut` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 489 | 掉落来源 (Sources) | `Enemy: Jack O'Naut` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 490 | 掉落来源 (Sources) | `Enemy: Jordas Golem` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 491 | 掉落来源 (Sources) | `Enemy: Kela De Thaym` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: en_as_is:wfcd_worldstate:sortieData:bosses:SORTIE_BOSS_KELA) |
| 492 | 掉落来源 (Sources) | `Enemy: Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 493 | 掉落来源 (Sources) | `Enemy: Anti Moa` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: en_as_is:wfcd_worldstate:languages:/lotus/types/game/library/targets/research2target) |
| 494 | 掉落来源 (Sources) | `Enemy: Leech Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 495 | 掉落来源 (Sources) | `Enemy: Lt Lech Kril` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 496 | 掉落来源 (Sources) | `Enemy: Scorpion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 497 | 掉落来源 (Sources) | `Enemy: Grineer Manic` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 498 | 掉落来源 (Sources) | `Enemy: Grineer Manic` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 499 | 掉落来源 (Sources) | `Enemy: Prod Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 500 | 掉落来源 (Sources) | `Enemy: Mine Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 501 | 掉落来源 (Sources) | `Enemy: Mine Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 502 | 掉落来源 (Sources) | `Enemy: Nul Comba` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 503 | 掉落来源 (Sources) | `Enemy: Nul Comba` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 504 | 掉落来源 (Sources) | `Enemy: Nul Scrambus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 505 | 掉落来源 (Sources) | `Enemy: Sap Comba` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 506 | 掉落来源 (Sources) | `Enemy: Sap Comba` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 507 | 掉落来源 (Sources) | `Enemy: Sap Scrambus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 508 | 掉落来源 (Sources) | `Enemy: Slo Comba` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 509 | 掉落来源 (Sources) | `Enemy: Slo Comba` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 510 | 掉落来源 (Sources) | `Enemy: Slo Scrambus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 511 | 掉落来源 (Sources) | `Enemy: Fog Comba` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 512 | 掉落来源 (Sources) | `Enemy: Fog Comba` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 513 | 掉落来源 (Sources) | `Enemy: Fog Scrambus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 514 | 掉落来源 (Sources) | `Enemy: Nullifier Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 515 | 掉落来源 (Sources) | `Enemy: Corrupted Butcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 516 | 掉落来源 (Sources) | `Enemy: Corrupted Bombard` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 517 | 掉落来源 (Sources) | `Enemy: Orokin Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 518 | 掉落来源 (Sources) | `Enemy: Orokin Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 519 | 掉落来源 (Sources) | `Enemy: Corrupted Nullifier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 520 | 掉落来源 (Sources) | `Enemy: Phorid` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: en_as_is:wfcd_worldstate:sortieData:bosses:SORTIE_BOSS_PHORID) |
| 521 | 掉落来源 (Sources) | `Enemy: Denial Bursa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 522 | 掉落来源 (Sources) | `Enemy: Courier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 523 | 掉落来源 (Sources) | `Enemy: Turret` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 524 | 掉落来源 (Sources) | `Enemy: Railgun Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 525 | 掉落来源 (Sources) | `Enemy: Raptor Mt` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 526 | 掉落来源 (Sources) | `Enemy: Raptor Rv` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 527 | 掉落来源 (Sources) | `Enemy: Raptor Ns` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 528 | 掉落来源 (Sources) | `Enemy: Rare Corpus Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 529 | 掉落来源 (Sources) | `Enemy: Rare Corpus Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 530 | 掉落来源 (Sources) | `Enemy: Forgotten Grineer Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 531 | 掉落来源 (Sources) | `Enemy: Rare Grineer Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 532 | 掉落来源 (Sources) | `Enemy: Rare Grineer Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 533 | 掉落来源 (Sources) | `Enemy: Rare Orokin Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 534 | 掉落来源 (Sources) | `Enemy: Rare Orokin Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 535 | 掉落来源 (Sources) | `Enemy: Rare Orokin Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 536 | 掉落来源 (Sources) | `Enemy: Crewman` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: en_as_is:wfcd_worldstate:languages:/lotus/types/game/library/targets/research5target) |
| 537 | 掉落来源 (Sources) | `Enemy: Kuva Jester` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 538 | 掉落来源 (Sources) | `Enemy: Scavenger Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 539 | 掉落来源 (Sources) | `Enemy: Scavenger Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 540 | 掉落来源 (Sources) | `Enemy: Drekar Butcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 541 | 掉落来源 (Sources) | `Enemy: Drekar Elite Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 542 | 掉落来源 (Sources) | `Enemy: Drekar Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 543 | 掉落来源 (Sources) | `Enemy: Drekar Heavy Gunner` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 544 | 掉落来源 (Sources) | `Enemy: Drekar Scorpion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 545 | 掉落来源 (Sources) | `Enemy: Drekar Ballista` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 546 | 掉落来源 (Sources) | `Enemy: Drekar Seeker` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 547 | 掉落来源 (Sources) | `Enemy: Drekar Hellion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 548 | 掉落来源 (Sources) | `Enemy: Drekar Manic` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 549 | 掉落来源 (Sources) | `Enemy: Drekar Manic Bombard` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 550 | 掉落来源 (Sources) | `Enemy: Drekar Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 551 | 掉落来源 (Sources) | `Enemy: Drekar Trooper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 552 | 掉落来源 (Sources) | `Enemy: Sensor Regulator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 553 | 掉落来源 (Sources) | `Enemy: Orokin Spectator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 554 | 掉落来源 (Sources) | `Enemy: Conculyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 555 | 掉落来源 (Sources) | `Enemy: Battalyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 556 | 掉落来源 (Sources) | `Enemy: Decaying Conculyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 557 | 掉落来源 (Sources) | `Enemy: Decaying Battalyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 558 | 掉落来源 (Sources) | `Enemy: Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 559 | 掉落来源 (Sources) | `Enemy: Shock Draga` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 560 | 掉落来源 (Sources) | `Enemy: Shockwave Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 561 | 掉落来源 (Sources) | `Enemy: Detron Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 562 | 掉落来源 (Sources) | `Enemy: Sniper Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 563 | 掉落来源 (Sources) | `Enemy: Shadow Stalker` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 564 | 掉落来源 (Sources) | `Enemy: Latcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 565 | 掉落来源 (Sources) | `Enemy: Oxium Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 566 | 掉落来源 (Sources) | `Enemy: Tenno Specter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 567 | 掉落来源 (Sources) | `Enemy: Mutalist Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 568 | 掉落来源 (Sources) | `Enemy: Tyl Regor` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: en_as_is:wfcd_worldstate:sortieData:bosses:SORTIE_BOSS_TYL) |
| 569 | 掉落来源 (Sources) | `Enemy: Reinforced Corpus Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 570 | 掉落来源 (Sources) | `Enemy: Reinforced Grineer Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 571 | 掉落来源 (Sources) | `Enemy: Reinforced Grineer Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 572 | 掉落来源 (Sources) | `Enemy: Reinforced Orokin Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 573 | 掉落来源 (Sources) | `Enemy: Reinforced Orokin Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 574 | 掉落来源 (Sources) | `Enemy: Vay Hek Terra Frame` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 575 | 掉落来源 (Sources) | `Enemy: Rathuum Broadcaster` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 576 | 掉落来源 (Sources) | `Enemy: Corpus Warden` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 577 | 掉落来源 (Sources) | `Enemy: Corrupted Warden` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 578 | 掉落来源 (Sources) | `Enemy: Grineer Warden` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 579 | 掉落来源 (Sources) | `Enemy: Sikula` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 580 | 掉落来源 (Sources) | `Enemy: Deimos Therid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 581 | 掉落来源 (Sources) | `Enemy: Deimos Leaping Thrasher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 582 | 掉落来源 (Sources) | `Enemy: Deimos Carnis` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 583 | 掉落来源 (Sources) | `Enemy: Deimos Carnis` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 584 | 掉落来源 (Sources) | `Enemy: Deimos Carnis Rex` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 585 | 掉落来源 (Sources) | `Enemy: Deimos Jugulus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 586 | 掉落来源 (Sources) | `Enemy: Deimos Jugulus Rex` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 587 | 掉落来源 (Sources) | `Enemy: Deimos Mutalist Osprey Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 588 | 掉落来源 (Sources) | `Enemy: Deimos Saxum Rex` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 589 | 掉落来源 (Sources) | `Enemy: Deimos Saxum Rex` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 590 | 掉落来源 (Sources) | `Enemy: Latrox Une` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 591 | 掉落来源 (Sources) | `Enemy: Deimos Brood Mother` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 592 | 掉落来源 (Sources) | `Enemy: Polyp-Hog Juggernaut` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 593 | 掉落来源 (Sources) | `Enemy: Lancer Survivor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 594 | 掉落来源 (Sources) | `Enemy: Trooper Survivor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 595 | 掉落来源 (Sources) | `Enemy: Deimos Ancient Healer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 596 | 掉落来源 (Sources) | `Enemy: Deimos Venin Mutalist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 597 | 掉落来源 (Sources) | `Enemy: Deimos Saxum` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 598 | 掉落来源 (Sources) | `Enemy: Deimos Saxum` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 599 | 掉落来源 (Sources) | `Enemy: Deimos Undying Flyer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 600 | 掉落来源 (Sources) | `Enemy: Deimos Tendril Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 601 | 掉落来源 (Sources) | `Enemy: Deimos Juggernaut` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 602 | 掉落来源 (Sources) | `Enemy: Deimos Leaper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 603 | 掉落来源 (Sources) | `Enemy: Deimos Leaper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 604 | 掉落来源 (Sources) | `Enemy: Deimos Runner` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 605 | 掉落来源 (Sources) | `Enemy: Garv` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 606 | 掉落来源 (Sources) | `Enemy: Deimos Swarm Mutalist Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 607 | 掉落来源 (Sources) | `Enemy: Deimos Charger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 608 | 掉落来源 (Sources) | `Enemy: Basal Diploid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 609 | 掉落来源 (Sources) | `Enemy: Basal Diploid Rex` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 610 | 掉落来源 (Sources) | `Enemy: Feral Diploid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 611 | 掉落来源 (Sources) | `Enemy: Feral Diploid Rex` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 612 | 掉落来源 (Sources) | `Enemy: The Unseeing Herald` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 613 | 掉落来源 (Sources) | `Enemy: Janus Captain Vor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 614 | 掉落来源 (Sources) | `Enemy: Jarka Lar` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 615 | 掉落来源 (Sources) | `Enemy: Jade Mockery` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 616 | 掉落来源 (Sources) | `Enemy: Elite Bladeswarm Basilisk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 617 | 掉落来源 (Sources) | `Enemy: Ryoku` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 618 | 掉落来源 (Sources) | `Enemy: Bladeswarm Crewship` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 619 | 掉落来源 (Sources) | `Enemy: Bladeswarm Power Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 620 | 掉落来源 (Sources) | `Enemy: Bladeswarm Scrambus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 621 | 掉落来源 (Sources) | `Enemy: Bladeswarm Bailiff` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 622 | 掉落来源 (Sources) | `Enemy: Bladeswarm Outrider` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 623 | 掉落来源 (Sources) | `Enemy: Bladeswarm Cannon Battery` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 624 | 掉落来源 (Sources) | `Enemy: Bladeswarm Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 625 | 掉落来源 (Sources) | `Enemy: Bladeswarm Ramsled` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 626 | 掉落来源 (Sources) | `Enemy: Bladeswarm Basilisk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 627 | 掉落来源 (Sources) | `Enemy: Bladeswarm Derivator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 628 | 掉落来源 (Sources) | `Enemy: Bladeswarm Roller Sentry` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 629 | 掉落来源 (Sources) | `Enemy: Bladeswarm Sniper Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 630 | 掉落来源 (Sources) | `Enemy: Bladeswarm Gox` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 631 | 掉落来源 (Sources) | `Enemy: Bladeswarm Dreg` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 632 | 掉落来源 (Sources) | `Enemy: Ryoku Shadow Clone Master` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 633 | 掉落来源 (Sources) | `Enemy: Bladeswarm Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 634 | 掉落来源 (Sources) | `Enemy: Elite Bladeswarm Weaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 635 | 掉落来源 (Sources) | `Enemy: Bladeswarm Weaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 636 | 掉落来源 (Sources) | `Enemy: Ravenous Golden Maw` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 637 | 掉落来源 (Sources) | `Enemy: Bloodfrenzy Sister` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 638 | 掉落来源 (Sources) | `Enemy: Orm Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 639 | 掉落来源 (Sources) | `Enemy: Elite Bursa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 640 | 掉落来源 (Sources) | `Enemy: Corpus Mining Turret` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 641 | 掉落来源 (Sources) | `Enemy: Orm Nemes` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 642 | 掉落来源 (Sources) | `Enemy: Comet Shredder Captain` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 643 | 掉落来源 (Sources) | `Enemy: Exo Carabus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 644 | 掉落来源 (Sources) | `Enemy: Corpus Cargo Ship` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 645 | 掉落来源 (Sources) | `Enemy: Mawbound Director` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 646 | 掉落来源 (Sources) | `Enemy: Vena` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 647 | 掉落来源 (Sources) | `Enemy: Bloodfrenzy Trencher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 648 | 掉落来源 (Sources) | `Enemy: Bloodfrenzy Trencher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 649 | 掉落来源 (Sources) | `Enemy: Bloodfrenzy Expired` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 650 | 掉落来源 (Sources) | `Enemy: Vena` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 651 | 掉落来源 (Sources) | `Enemy: Bloodfrenzy Hyena` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 652 | 掉落来源 (Sources) | `Enemy: Bloodfrenzy Orm Gox` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 653 | 掉落来源 (Sources) | `Enemy: Bloodfrenzy Bailiff` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 654 | 掉落来源 (Sources) | `Enemy: Bloodfrenzy Vertec` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 655 | 掉落来源 (Sources) | `Enemy: Bloodfrenzy Powerclaw` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 656 | 掉落来源 (Sources) | `Enemy: Bloodfrenzy Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 657 | 掉落来源 (Sources) | `Enemy: Bloodfrenzy Ramsled` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 658 | 掉落来源 (Sources) | `Enemy: Bloodfrenzy Raptor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 659 | 掉落来源 (Sources) | `Enemy: Bloodfrenzy Machinist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 660 | 掉落来源 (Sources) | `Enemy: Bloodfrenzy Exo Cutter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 661 | 掉落来源 (Sources) | `Enemy: Bloodfrenzy Dreg` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 662 | 掉落来源 (Sources) | `Enemy: Bloodfrenzy Elite Outrider` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 663 | 掉落来源 (Sources) | `Enemy: Bloodfrenzy Harpi` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 664 | 掉落来源 (Sources) | `Enemy: Bloodfrenzy Gox` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 665 | 掉落来源 (Sources) | `Enemy: Bloodfrenzy Optio` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 666 | 掉落来源 (Sources) | `Enemy: Ancient Undying Flyer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 667 | 掉落来源 (Sources) | `Enemy: Ancient Maggot` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 668 | 掉落来源 (Sources) | `Enemy: Ancient Mutalist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 669 | 掉落来源 (Sources) | `Enemy: Asteroid Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 670 | 掉落来源 (Sources) | `Enemy: Narmer Mite` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 671 | 掉落来源 (Sources) | `Enemy: Narmer Butcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 672 | 掉落来源 (Sources) | `Enemy: Narmer Flameblade` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 673 | 掉落来源 (Sources) | `Enemy: Narmer Bombard` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 674 | 掉落来源 (Sources) | `Enemy: Narmer Commander` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 675 | 掉落来源 (Sources) | `Enemy: Narmer Observation Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 676 | 掉落来源 (Sources) | `Enemy: Narmer Power Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 677 | 掉落来源 (Sources) | `Enemy: Narmer Detron Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 678 | 掉落来源 (Sources) | `Enemy: Narmer Dera Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 679 | 掉落来源 (Sources) | `Enemy: Narmer Disc Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 680 | 掉落来源 (Sources) | `Enemy: Narmer Elite Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 681 | 掉落来源 (Sources) | `Enemy: Narmer Geminex Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 682 | 掉落来源 (Sources) | `Enemy: Narmer Glaxion Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 683 | 掉落来源 (Sources) | `Enemy: Narmer Jailer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 684 | 掉落来源 (Sources) | `Enemy: Narmer Leech Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 685 | 掉落来源 (Sources) | `Enemy: Narmer Mine Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 686 | 掉落来源 (Sources) | `Enemy: Narmer Mine Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 687 | 掉落来源 (Sources) | `Enemy: Narmer Nullifier Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 688 | 掉落来源 (Sources) | `Enemy: Narmer Nullifier Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 689 | 掉落来源 (Sources) | `Enemy: Narmer Prod Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 690 | 掉落来源 (Sources) | `Enemy: Narmer Detron Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 691 | 掉落来源 (Sources) | `Enemy: Narmer Sapping Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 692 | 掉落来源 (Sources) | `Enemy: Narmer Scavenger Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 693 | 掉落来源 (Sources) | `Enemy: Narmer Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 694 | 掉落来源 (Sources) | `Enemy: Narmer Shockwave Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 695 | 掉落来源 (Sources) | `Enemy: Narmer Sniper Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 696 | 掉落来源 (Sources) | `Enemy: Narmer Sniper Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 697 | 掉落来源 (Sources) | `Enemy: Narmer Oxium Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 698 | 掉落来源 (Sources) | `Enemy: Narmer Corpus Tech` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 699 | 掉落来源 (Sources) | `Enemy: Narmer Tech Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 700 | 掉落来源 (Sources) | `Enemy: Narmer Crewman Warden` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 701 | 掉落来源 (Sources) | `Enemy: Narmer Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 702 | 掉落来源 (Sources) | `Enemy: Narmer Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 703 | 掉落来源 (Sources) | `Enemy: Narmer Sensolyst Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 704 | 掉落来源 (Sources) | `Enemy: Narmer Demolisher Expired` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 705 | 掉落来源 (Sources) | `Enemy: Narmer Demolisher Bailiff` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 706 | 掉落来源 (Sources) | `Enemy: Narmer Demolisher Gunner` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 707 | 掉落来源 (Sources) | `Enemy: Narmer Elite Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 708 | 掉落来源 (Sources) | `Enemy: Narmer Elite Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 709 | 掉落来源 (Sources) | `Enemy: Narmer Ballista` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 710 | 掉落来源 (Sources) | `Enemy: Narmer Scorch` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 711 | 掉落来源 (Sources) | `Enemy: Narmer Gunner Warden` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 712 | 掉落来源 (Sources) | `Enemy: Narmer Heavy Gunner` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 713 | 掉落来源 (Sources) | `Enemy: Narmer Napalm` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 714 | 掉落来源 (Sources) | `Enemy: Narmer Hellion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 715 | 掉落来源 (Sources) | `Enemy: Narmer Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 716 | 掉落来源 (Sources) | `Enemy: Narmer Scorpion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 717 | 掉落来源 (Sources) | `Enemy: Narmer Machinist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 718 | 掉落来源 (Sources) | `Enemy: Narmer Seeker` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 719 | 掉落来源 (Sources) | `Enemy: Narmer Powerfist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 720 | 掉落来源 (Sources) | `Enemy: Narmer Regulator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 721 | 掉落来源 (Sources) | `Enemy: Narmer Shield Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 722 | 掉落来源 (Sources) | `Enemy: Narmer Trooper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 723 | 掉落来源 (Sources) | `Enemy: Narmer Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 724 | 掉落来源 (Sources) | `Enemy: Narmer Tech` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 725 | 掉落来源 (Sources) | `Enemy: Narmer Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 726 | 掉落来源 (Sources) | `Enemy: Narmer Thumper Doma` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 727 | 掉落来源 (Sources) | `Enemy: Narmer Thumper Bull` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 728 | 掉落来源 (Sources) | `Enemy: Narmer Thumper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 729 | 掉落来源 (Sources) | `Enemy: Narmer Coildrive` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 730 | 掉落来源 (Sources) | `Enemy: Typholyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 731 | 掉落来源 (Sources) | `Enemy: Breacher Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 732 | 掉落来源 (Sources) | `Enemy: Striker Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 733 | 掉落来源 (Sources) | `Enemy: Shield Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 734 | 掉落来源 (Sources) | `Enemy: Scrofa Armaments Director` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 735 | 掉落来源 (Sources) | `Enemy: Scrofa Drover Bursa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 736 | 掉落来源 (Sources) | `Enemy: Scrofa Joro Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 737 | 掉落来源 (Sources) | `Enemy: Scrofa Demolition Director` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 738 | 掉落来源 (Sources) | `Enemy: Scrofa Strike Director` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 739 | 掉落来源 (Sources) | `Enemy: Scrofa Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 740 | 掉落来源 (Sources) | `Enemy: Scrofa Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 741 | 掉落来源 (Sources) | `Enemy: Scrofa Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 742 | 掉落来源 (Sources) | `Enemy: Scrofa Attack Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 743 | 掉落来源 (Sources) | `Enemy: Scrofa Obviator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 744 | 掉落来源 (Sources) | `Enemy: Scrofa Provisor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 745 | 掉落来源 (Sources) | `Enemy: Scrofa Provisor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 746 | 掉落来源 (Sources) | `Enemy: Scrofa Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 747 | 掉落来源 (Sources) | `Enemy: Scrofa Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 748 | 掉落来源 (Sources) | `Enemy: Scrofa Elite Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 749 | 掉落来源 (Sources) | `Enemy: Syzygy Attack Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 750 | 掉落来源 (Sources) | `Enemy: Syzygy Light Trencher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 751 | 掉落来源 (Sources) | `Enemy: Syzygy Light Trencher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 752 | 掉落来源 (Sources) | `Enemy: Syzygy Mite Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 753 | 掉落来源 (Sources) | `Enemy: Syzygy Shockwave Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 754 | 掉落来源 (Sources) | `Enemy: Syzygy Denial Bursa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 755 | 掉落来源 (Sources) | `Enemy: Syzygy Sniper Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 756 | 掉落来源 (Sources) | `Enemy: Syzygy Sniper Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 757 | 掉落来源 (Sources) | `Enemy: Syzygy Prod Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 758 | 掉落来源 (Sources) | `Enemy: Syzygy Prod Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 759 | 掉落来源 (Sources) | `Enemy: Scrofa Legionary` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 760 | 掉落来源 (Sources) | `Enemy: Scrofa Legionary` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 761 | 掉落来源 (Sources) | `Enemy: Scrofa Research Chief` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 762 | 掉落来源 (Sources) | `Enemy: Scrofa Laser Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 763 | 掉落来源 (Sources) | `Enemy: Scrofa Laser Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 764 | 掉落来源 (Sources) | `Enemy: Scrofa Heavy Trencher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 765 | 掉落来源 (Sources) | `Enemy: Scrofa Heavy Trencher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 766 | 掉落来源 (Sources) | `Enemy: Scrofa Light Trencher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 767 | 掉落来源 (Sources) | `Enemy: Scrofa Light Trencher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 768 | 掉落来源 (Sources) | `Enemy: Scrofa Mine Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 769 | 掉落来源 (Sources) | `Enemy: Scrofa Mite Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 770 | 掉落来源 (Sources) | `Enemy: Scrofa Lythrum Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 771 | 掉落来源 (Sources) | `Enemy: Scrofa Latro Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 772 | 掉落来源 (Sources) | `Enemy: Scrofa Railgun Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 773 | 掉落来源 (Sources) | `Enemy: Scrofa Railgun Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 774 | 掉落来源 (Sources) | `Enemy: Scrofa Grenadier Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 775 | 掉落来源 (Sources) | `Enemy: Scrofa Shockwave Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 776 | 掉落来源 (Sources) | `Enemy: Scrofa Plasmor Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 777 | 掉落来源 (Sources) | `Enemy: Scrofa Plasmor Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 778 | 掉落来源 (Sources) | `Enemy: Scrofa Sniper Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 779 | 掉落来源 (Sources) | `Enemy: Scrofa Sniper Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 780 | 掉落来源 (Sources) | `Enemy: Scrofa Decoy Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 781 | 掉落来源 (Sources) | `Enemy: Scrofa Energy Chief` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 782 | 掉落来源 (Sources) | `Enemy: Pyr Captain` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 783 | 掉落来源 (Sources) | `Enemy: Glacik Commander` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 784 | 掉落来源 (Sources) | `Enemy: Lektro Commander` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 785 | 掉落来源 (Sources) | `Enemy: Blite Captain` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 786 | 掉落来源 (Sources) | `Enemy: Taro Crewship` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 787 | 掉落来源 (Sources) | `Enemy: Taro Crewship` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 788 | 掉落来源 (Sources) | `Enemy: Elite Taro Basilisk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 789 | 掉落来源 (Sources) | `Enemy: Taro Basilisk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 790 | 掉落来源 (Sources) | `Enemy: Elite Orm Basilisk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 791 | 掉落来源 (Sources) | `Enemy: Orm Basilisk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 792 | 掉落来源 (Sources) | `Enemy: Orm Basilisk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 793 | 掉落来源 (Sources) | `Enemy: Orm Gox` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 794 | 掉落来源 (Sources) | `Enemy: Elite Orm Harpi` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 795 | 掉落来源 (Sources) | `Enemy: Elite Orm Harpi` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 796 | 掉落来源 (Sources) | `Enemy: Orm Harpi` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 797 | 掉落来源 (Sources) | `Enemy: Orm Harpi` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 798 | 掉落来源 (Sources) | `Enemy: Elite Orm Weaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 799 | 掉落来源 (Sources) | `Enemy: Elite Orm Weaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 800 | 掉落来源 (Sources) | `Enemy: Orm Weaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 801 | 掉落来源 (Sources) | `Enemy: Orm Weaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 802 | 掉落来源 (Sources) | `Enemy: Elite Taro Harpi` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 803 | 掉落来源 (Sources) | `Enemy: Taro Harpi` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 804 | 掉落来源 (Sources) | `Enemy: Elite Axio Basilisk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 805 | 掉落来源 (Sources) | `Enemy: Axio Basilisk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 806 | 掉落来源 (Sources) | `Enemy: Axio Gox` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 807 | 掉落来源 (Sources) | `Enemy: Elite Axio Harpi` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 808 | 掉落来源 (Sources) | `Enemy: Axio Harpi` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 809 | 掉落来源 (Sources) | `Enemy: Elite Axio Weaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 810 | 掉落来源 (Sources) | `Enemy: Axio Weaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 811 | 掉落来源 (Sources) | `Enemy: Elite Taro Weaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 812 | 掉落来源 (Sources) | `Enemy: Taro Weaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 813 | 掉落来源 (Sources) | `Enemy: Elite Vorac Basilisk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 814 | 掉落来源 (Sources) | `Enemy: Vorac Basilisk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 815 | 掉落来源 (Sources) | `Enemy: Vorac Gox` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 816 | 掉落来源 (Sources) | `Enemy: Elite Vorac Harpi` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 817 | 掉落来源 (Sources) | `Enemy: Vorac Harpi` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 818 | 掉落来源 (Sources) | `Enemy: Elite Vorac Weaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 819 | 掉落来源 (Sources) | `Enemy: Vorac Weaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 820 | 掉落来源 (Sources) | `Enemy: Comet Shard` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 821 | 掉落来源 (Sources) | `Enemy: Corpus Ramsled` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 822 | 掉落来源 (Sources) | `Enemy: Corpus Ramsled` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 823 | 掉落来源 (Sources) | `Enemy: Exo Raider` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 824 | 掉落来源 (Sources) | `Enemy: Exo Raider` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 825 | 掉落来源 (Sources) | `Enemy: Exo Raider Carver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 826 | 掉落来源 (Sources) | `Enemy: Exo Raider Carver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 827 | 掉落来源 (Sources) | `Enemy: Exo Raider Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 828 | 掉落来源 (Sources) | `Enemy: Exo Raider Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 829 | 掉落来源 (Sources) | `Enemy: Kosma Raider` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 830 | 掉落来源 (Sources) | `Enemy: Kosma Raider Carver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 831 | 掉落来源 (Sources) | `Enemy: Gyre Raider` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 832 | 掉落来源 (Sources) | `Enemy: Gyre Raider Carver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 833 | 掉落来源 (Sources) | `Enemy: Gyre Raider Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 834 | 掉落来源 (Sources) | `Enemy: Kosma Raider Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 835 | 掉落来源 (Sources) | `Enemy: Exo Gokstad Officer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 836 | 掉落来源 (Sources) | `Enemy: Exo Gokstad Officer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 837 | 掉落来源 (Sources) | `Enemy: Kosma Gokstad Officer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 838 | 掉落来源 (Sources) | `Enemy: Gyre Gokstad Officer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 839 | 掉落来源 (Sources) | `Enemy: Kosma Butcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 840 | 掉落来源 (Sources) | `Enemy: Exo Butcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 841 | 掉落来源 (Sources) | `Enemy: Exo Butcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 842 | 掉落来源 (Sources) | `Enemy: Exo Elite Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 843 | 掉落来源 (Sources) | `Enemy: Exo Elite Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 844 | 掉落来源 (Sources) | `Enemy: Exo Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 845 | 掉落来源 (Sources) | `Enemy: Exo Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 846 | 掉落来源 (Sources) | `Enemy: Exo Supressor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 847 | 掉落来源 (Sources) | `Enemy: Kosma Elite Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 848 | 掉落来源 (Sources) | `Enemy: Kosma Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 849 | 掉落来源 (Sources) | `Enemy: Gyre Butcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 850 | 掉落来源 (Sources) | `Enemy: Gyre Elite Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 851 | 掉落来源 (Sources) | `Enemy: Gyre Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 852 | 掉落来源 (Sources) | `Enemy: Gyre Supressor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 853 | 掉落来源 (Sources) | `Enemy: Kosma Supressor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 854 | 掉落来源 (Sources) | `Enemy: Elite Kosma Flak` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 855 | 掉落来源 (Sources) | `Enemy: Kosma Flak` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 856 | 掉落来源 (Sources) | `Enemy: Elite Exo Flak` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 857 | 掉落来源 (Sources) | `Enemy: Elite Exo Flak` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 858 | 掉落来源 (Sources) | `Enemy: Exo Flak` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 859 | 掉落来源 (Sources) | `Enemy: Elite Exo Taktis` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 860 | 掉落来源 (Sources) | `Enemy: Elite Exo Taktis` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 861 | 掉落来源 (Sources) | `Enemy: Exo Taktis` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 862 | 掉落来源 (Sources) | `Enemy: Elite Exo Outrider` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 863 | 掉落来源 (Sources) | `Enemy: Exo Outrider` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 864 | 掉落来源 (Sources) | `Enemy: Exo Outrider` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 865 | 掉落来源 (Sources) | `Enemy: Elite Exo Cutter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 866 | 掉落来源 (Sources) | `Enemy: Elite Exo Cutter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 867 | 掉落来源 (Sources) | `Enemy: Exo Cutter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 868 | 掉落来源 (Sources) | `Enemy: Exo Cutter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 869 | 掉落来源 (Sources) | `Enemy: Elite Kosma Taktis` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 870 | 掉落来源 (Sources) | `Enemy: Kosma Taktis` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 871 | 掉落来源 (Sources) | `Enemy: Elite Kosma Outrider` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 872 | 掉落来源 (Sources) | `Enemy: Kosma Outrider` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 873 | 掉落来源 (Sources) | `Enemy: Elite Kosma Cutter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 874 | 掉落来源 (Sources) | `Enemy: Kosma Cutter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 875 | 掉落来源 (Sources) | `Enemy: Elite Gyre Flak` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 876 | 掉落来源 (Sources) | `Enemy: Gyre Flak` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 877 | 掉落来源 (Sources) | `Enemy: Elite Gyre Taktis` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 878 | 掉落来源 (Sources) | `Enemy: Gyre Taktis` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 879 | 掉落来源 (Sources) | `Enemy: Elite Gyre Outrider` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 880 | 掉落来源 (Sources) | `Enemy: Gyre Outrider` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 881 | 掉落来源 (Sources) | `Enemy: Elite Gyre Cutter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 882 | 掉落来源 (Sources) | `Enemy: Gyre Cutter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 883 | 掉落来源 (Sources) | `Enemy: Kuva Lich Agor Rok (Level 0 - 69)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 884 | 掉落来源 (Sources) | `Enemy: Kuva Lich Agor Rok (Level 70 - 79)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 885 | 掉落来源 (Sources) | `Enemy: Kuva Lich Agor Rok (Level 80 - 100)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 886 | 掉落来源 (Sources) | `Enemy: Exo Gokstad Pilot` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 887 | 掉落来源 (Sources) | `Enemy: Kosma Gokstad Pilot` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 888 | 掉落来源 (Sources) | `Enemy: Gyre Gokstad Pilot` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 889 | 掉落来源 (Sources) | `Enemy: Kosma Ramsled` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 890 | 掉落来源 (Sources) | `Enemy: Exo Roller Sentry` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 891 | 掉落来源 (Sources) | `Enemy: Exo Roller Sentry` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 892 | 掉落来源 (Sources) | `Enemy: Gyre Roller Sentry` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 893 | 掉落来源 (Sources) | `Enemy: Kosma Roller Sentry` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 894 | 掉落来源 (Sources) | `Enemy: Anu Brachiolyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 895 | 掉落来源 (Sources) | `Enemy: Anu Mantalyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 896 | 掉落来源 (Sources) | `Enemy: Anu Pyrolyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 897 | 掉落来源 (Sources) | `Enemy: Anu Symbilyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 898 | 掉落来源 (Sources) | `Enemy: Ionyx` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 899 | 掉落来源 (Sources) | `Enemy: Gyrix` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 900 | 掉落来源 (Sources) | `Enemy: Splintrix` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 901 | 掉落来源 (Sources) | `Enemy: Mimic` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 902 | 掉落来源 (Sources) | `Enemy: Nascent Membroid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 903 | 掉落来源 (Sources) | `Enemy: Mature Membroid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 904 | 掉落来源 (Sources) | `Enemy: Apex Membroid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 905 | 掉落来源 (Sources) | `Enemy: Juvenile Membroid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 906 | 掉落来源 (Sources) | `Enemy: Observation Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 907 | 掉落来源 (Sources) | `Enemy: Coolant Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 908 | 掉落来源 (Sources) | `Enemy: Scyto Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 909 | 掉落来源 (Sources) | `Enemy: Special Duty Coildrive` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 910 | 掉落来源 (Sources) | `Enemy: Thermic Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 911 | 掉落来源 (Sources) | `Enemy: Mite Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 912 | 掉落来源 (Sources) | `Enemy: Terra Ambulas` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 913 | 掉落来源 (Sources) | `Enemy: Terra Manker` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 914 | 掉落来源 (Sources) | `Enemy: Terra Manker` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 915 | 掉落来源 (Sources) | `Enemy: Armaments Director` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 916 | 掉落来源 (Sources) | `Enemy: Vivisect Director` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 917 | 掉落来源 (Sources) | `Enemy: Sentient Research Director` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 918 | 掉落来源 (Sources) | `Enemy: Vallis Surveillance Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 919 | 掉落来源 (Sources) | `Enemy: Terra Detron Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 920 | 掉落来源 (Sources) | `Enemy: Terra Attack Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 921 | 掉落来源 (Sources) | `Enemy: Terra Attack Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 922 | 掉落来源 (Sources) | `Enemy: Terra Research Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 923 | 掉落来源 (Sources) | `Enemy: Terra Elite Provisor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 924 | 掉落来源 (Sources) | `Enemy: Terra Provisor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 925 | 掉落来源 (Sources) | `Enemy: Terra Provisor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 926 | 掉落来源 (Sources) | `Enemy: Terra Elite Overtaker` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 927 | 掉落来源 (Sources) | `Enemy: Terra Overtaker` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 928 | 掉落来源 (Sources) | `Enemy: Terra Overtaker` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 929 | 掉落来源 (Sources) | `Enemy: Terra Jailer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 930 | 掉落来源 (Sources) | `Enemy: Terra Cestra Manker` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 931 | 掉落来源 (Sources) | `Enemy: Terra Raptor Sx` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 932 | 掉落来源 (Sources) | `Enemy: Terra Elite Raptor Sx` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 933 | 掉落来源 (Sources) | `Enemy: Terra Elite Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 934 | 掉落来源 (Sources) | `Enemy: Terra Elite Trencher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 935 | 掉落来源 (Sources) | `Enemy: Icemire Hyena` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 936 | 掉落来源 (Sources) | `Enemy: Rabbleback Hyena` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 937 | 掉落来源 (Sources) | `Enemy: Gyre Hyena` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 938 | 掉落来源 (Sources) | `Enemy: Cinderthresh Hyena` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 939 | 掉落来源 (Sources) | `Enemy: Terra Embattor Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 940 | 掉落来源 (Sources) | `Enemy: Terra Elite Embattor Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 941 | 掉落来源 (Sources) | `Enemy: Terra Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 942 | 掉落来源 (Sources) | `Enemy: Terra Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 943 | 掉落来源 (Sources) | `Enemy: Terra Anti Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 944 | 掉落来源 (Sources) | `Enemy: Terra Anti Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 945 | 掉落来源 (Sources) | `Enemy: Terra Nullifier Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 946 | 掉落来源 (Sources) | `Enemy: Terra Railgun Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 947 | 掉落来源 (Sources) | `Enemy: Terra Railgun Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 948 | 掉落来源 (Sources) | `Enemy: Terra Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 949 | 掉落来源 (Sources) | `Enemy: Terra Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 950 | 掉落来源 (Sources) | `Enemy: Terra Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 951 | 掉落来源 (Sources) | `Enemy: Terra Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 952 | 掉落来源 (Sources) | `Enemy: Terra Shockwave Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 953 | 掉落来源 (Sources) | `Enemy: Terra Shockwave Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 954 | 掉落来源 (Sources) | `Enemy: Terra Trencher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 955 | 掉落来源 (Sources) | `Enemy: Terra Trencher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 956 | 掉落来源 (Sources) | `Enemy: Terra Plasmor Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 957 | 掉落来源 (Sources) | `Enemy: Terra Plasmor Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 958 | 掉落来源 (Sources) | `Enemy: Terra Sniper Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 959 | 掉落来源 (Sources) | `Enemy: Terra Sniper Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 960 | 掉落来源 (Sources) | `Enemy: Terra Oxium Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 961 | 掉落来源 (Sources) | `Enemy: Terra Oxium Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 962 | 掉落来源 (Sources) | `Enemy: Corpus Trencher Target` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 963 | 掉落来源 (Sources) | `Enemy: Corpus Cestra Target` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 964 | 掉落来源 (Sources) | `Enemy: Corpus Supra Target` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 965 | 掉落来源 (Sources) | `Enemy: Corpus Sniper Target` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 966 | 掉落来源 (Sources) | `Enemy: Coildrive` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 967 | 掉落来源 (Sources) | `Enemy: Kyta Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 968 | 掉落来源 (Sources) | `Enemy: Chroma` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: en_as_is:wfcd_worldstate:languages:/lotus/powersuits/dragon/dragon) |
| 969 | 掉落来源 (Sources) | `Enemy: Anarch Grineer Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 970 | 掉落来源 (Sources) | `Enemy: Commandeered Ash Prime` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 971 | 掉落来源 (Sources) | `Enemy: Commandeered Caliban Prime` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 972 | 掉落来源 (Sources) | `Enemy: Equisitus Hoard` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 973 | 掉落来源 (Sources) | `Enemy: Commandeered Ember Prime` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 974 | 掉落来源 (Sources) | `Enemy: Commandeered Ember Prime` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 975 | 掉落来源 (Sources) | `Enemy: Commandeered Mesa Prime` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 976 | 掉落来源 (Sources) | `Enemy: Commandeered Protea Prime` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 977 | 掉落来源 (Sources) | `Enemy: Commandeered Protea Prime` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 978 | 掉落来源 (Sources) | `Enemy: Anarch Grineer Trapper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 979 | 掉落来源 (Sources) | `Enemy: Anarch Arcus Lustratus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 980 | 掉落来源 (Sources) | `Enemy: Anarch Arcus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 981 | 掉落来源 (Sources) | `Enemy: Anarch Libritor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 982 | 掉落来源 (Sources) | `Enemy: Anarch Capsarii` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 983 | 掉落来源 (Sources) | `Enemy: Anarch Tenebra` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 984 | 掉落来源 (Sources) | `Enemy: Anarch Gladius` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 985 | 掉落来源 (Sources) | `Enemy: Archimedean Itzam` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 986 | 掉落来源 (Sources) | `Enemy: Commandeered Trinity Prime` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 987 | 掉落来源 (Sources) | `Enemy: Commandeered Volt Prime` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 988 | 掉落来源 (Sources) | `Enemy: Narmer Scyto Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 989 | 掉落来源 (Sources) | `Enemy: Rogg-417` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 990 | 掉落来源 (Sources) | `Enemy: Thrax Centurion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 991 | 掉落来源 (Sources) | `Enemy: Thrax Legatus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 992 | 掉落来源 (Sources) | `Enemy: Primm` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 993 | 掉落来源 (Sources) | `Enemy: Verd-Ie` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 994 | 掉落来源 (Sources) | `Enemy: Molted Cask` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 995 | 掉落来源 (Sources) | `Enemy: Ancient Molted Cask` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 996 | 掉落来源 (Sources) | `Enemy: Exploiter Orb` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 997 | 掉落来源 (Sources) | `Enemy: Orb Vallis - Temple of Profit Enemies` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 998 | 掉落来源 (Sources) | `Enemy: Orb Vallis - Enrichment Labs Enemies` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 999 | 掉落来源 (Sources) | `Enemy: Orb Vallis - Spaceport Enemies` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1000 | 掉落来源 (Sources) | `Enemy: Sister Of Parvos (Ascension Mode Steel Path)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1001 | 掉落来源 (Sources) | `Enemy: Sister Of Parvos (Ascension Mode)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1002 | 掉落来源 (Sources) | `Enemy: Necramech (Tier 1)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1003 | 掉落来源 (Sources) | `Enemy: Necramech (Tier 2)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1004 | 掉落来源 (Sources) | `Enemy: Necramech (Tier 3)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1005 | 掉落来源 (Sources) | `Level 30 - 40 Arcana Isolation Vault [Rot A] (Stage 1)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1006 | 掉落来源 (Sources) | `Level 30 - 40 Arcana Isolation Vault [Rot A] (Stage 2, Stage 3 of 4, and Stage 3 of 5)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1007 | 掉落来源 (Sources) | `Level 30 - 40 Arcana Isolation Vault [Rot A] (Stage 4 of 5)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1008 | 掉落来源 (Sources) | `Level 30 - 40 Arcana Isolation Vault [Rot A] (Final Stage)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1009 | 掉落来源 (Sources) | `Level 30 - 40 Arcana Isolation Vault [Rot B] (Stage 1)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1010 | 掉落来源 (Sources) | `Level 30 - 40 Arcana Isolation Vault [Rot B] (Stage 2, Stage 3 of 4, and Stage 3 of 5)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1011 | 掉落来源 (Sources) | `Level 30 - 40 Arcana Isolation Vault [Rot B] (Stage 4 of 5)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1012 | 掉落来源 (Sources) | `Level 30 - 40 Arcana Isolation Vault [Rot B] (Final Stage)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1013 | 掉落来源 (Sources) | `Level 30 - 40 Arcana Isolation Vault [Rot C] (Stage 1)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1014 | 掉落来源 (Sources) | `Level 30 - 40 Arcana Isolation Vault [Rot C] (Stage 2, Stage 3 of 4, and Stage 3 of 5)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1015 | 掉落来源 (Sources) | `Level 30 - 40 Arcana Isolation Vault [Rot C] (Stage 4 of 5)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1016 | 掉落来源 (Sources) | `Level 30 - 40 Arcana Isolation Vault [Rot C] (Final Stage)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1017 | 掉落来源 (Sources) | `Level 40 - 50 Arcana Isolation Vault [Rot A] (Stage 1)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1018 | 掉落来源 (Sources) | `Level 40 - 50 Arcana Isolation Vault [Rot A] (Stage 2, Stage 3 of 4, and Stage 3 of 5)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1019 | 掉落来源 (Sources) | `Level 40 - 50 Arcana Isolation Vault [Rot A] (Stage 4 of 5)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1020 | 掉落来源 (Sources) | `Level 40 - 50 Arcana Isolation Vault [Rot A] (Final Stage)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1021 | 掉落来源 (Sources) | `Level 40 - 50 Arcana Isolation Vault [Rot B] (Stage 1)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1022 | 掉落来源 (Sources) | `Level 40 - 50 Arcana Isolation Vault [Rot B] (Stage 2, Stage 3 of 4, and Stage 3 of 5)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1023 | 掉落来源 (Sources) | `Level 40 - 50 Arcana Isolation Vault [Rot B] (Stage 4 of 5)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1024 | 掉落来源 (Sources) | `Level 40 - 50 Arcana Isolation Vault [Rot B] (Final Stage)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1025 | 掉落来源 (Sources) | `Level 40 - 50 Arcana Isolation Vault [Rot C] (Stage 1)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1026 | 掉落来源 (Sources) | `Level 40 - 50 Arcana Isolation Vault [Rot C] (Stage 2, Stage 3 of 4, and Stage 3 of 5)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1027 | 掉落来源 (Sources) | `Level 40 - 50 Arcana Isolation Vault [Rot C] (Stage 4 of 5)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1028 | 掉落来源 (Sources) | `Level 40 - 50 Arcana Isolation Vault [Rot C] (Final Stage)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1029 | 掉落来源 (Sources) | `Level 50 - 60 Arcana Isolation Vault [Rot A] (Stage 1)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1030 | 掉落来源 (Sources) | `Level 50 - 60 Arcana Isolation Vault [Rot A] (Stage 2, Stage 3 of 4, and Stage 3 of 5)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1031 | 掉落来源 (Sources) | `Level 50 - 60 Arcana Isolation Vault [Rot A] (Stage 4 of 5)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1032 | 掉落来源 (Sources) | `Level 50 - 60 Arcana Isolation Vault [Rot A] (Final Stage)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1033 | 掉落来源 (Sources) | `Level 50 - 60 Arcana Isolation Vault [Rot B] (Stage 1)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1034 | 掉落来源 (Sources) | `Level 50 - 60 Arcana Isolation Vault [Rot B] (Stage 2, Stage 3 of 4, and Stage 3 of 5)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1035 | 掉落来源 (Sources) | `Level 50 - 60 Arcana Isolation Vault [Rot B] (Stage 4 of 5)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1036 | 掉落来源 (Sources) | `Level 50 - 60 Arcana Isolation Vault [Rot B] (Final Stage)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1037 | 掉落来源 (Sources) | `Level 50 - 60 Arcana Isolation Vault [Rot C] (Stage 1)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1038 | 掉落来源 (Sources) | `Level 50 - 60 Arcana Isolation Vault [Rot C] (Stage 2, Stage 3 of 4, and Stage 3 of 5)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1039 | 掉落来源 (Sources) | `Level 50 - 60 Arcana Isolation Vault [Rot C] (Stage 4 of 5)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1040 | 掉落来源 (Sources) | `Level 50 - 60 Arcana Isolation Vault [Rot C] (Final Stage)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1041 | 掉落来源 (Sources) | `Level  55 - 60 Entrati Lab Bounty [Rot C] (Final stage)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1042 | 掉落来源 (Sources) | `Level  65 - 70 Entrati Lab Bounty [Rot C] (Final stage)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1043 | 掉落来源 (Sources) | `Level  75 - 80 Entrati Lab Bounty [Rot C] (Final stage)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1044 | 掉落来源 (Sources) | `Level  95 - 100 Entrati Lab Bounty [Rot C] (Final stage)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1045 | 掉落来源 (Sources) | `Level  115 - 120 Entrati Lab Bounty [Rot C] (Final stage)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1046 | 掉落来源 (Sources) | `Level  55 - 60 WF1999 Bounty [Rot C] (Final stage)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1047 | 掉落来源 (Sources) | `Level  65 - 70 WF1999 Bounty [Rot C] (Final stage)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1048 | 掉落来源 (Sources) | `Level  75 - 80 WF1999 Bounty [Rot C] (Final stage)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1049 | 掉落来源 (Sources) | `Level  85 - 90 WF1999 Bounty [Rot C] (Final stage)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1050 | 掉落来源 (Sources) | `Level  95 - 100 WF1999 Bounty [Rot C] (Final stage)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1051 | 掉落来源 (Sources) | `Level  105 - 110 WF1999 Bounty [Rot C] (Final stage)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1052 | 掉落来源 (Sources) | `Level  115 - 120 WF1999 Bounty [Rot C] (Final stage)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1053 | 掉落来源 (Sources) | `Arbitrations [Rot A]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1054 | 掉落来源 (Sources) | `Arbitrations [Rot B]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1055 | 掉落来源 (Sources) | `Arbitrations [Rot C]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1056 | 掉落来源 (Sources) | `Derelict Vault` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1057 | 掉落来源 (Sources) | `Phorid Assassination` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1058 | 掉落来源 (Sources) | `Nightmare Mode Rewards [Rot A]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1059 | 掉落来源 (Sources) | `Nightmare Mode Rewards [Rot B]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1060 | 掉落来源 (Sources) | `Nightmare Mode Rewards [Rot C]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1061 | 掉落来源 (Sources) | `Fomorian Sabotage` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1062 | 掉落来源 (Sources) | `Kuva Siphon` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1063 | 掉落来源 (Sources) | `Kuva Flood` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1064 | 掉落来源 (Sources) | `Hallowed Flame Mission Caches [Rot A]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1065 | 掉落来源 (Sources) | `Hallowed Flame Mission Caches [Rot B]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1066 | 掉落来源 (Sources) | `Hallowed Flame Mission Caches [Rot C]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1067 | 掉落来源 (Sources) | `Hallowed Flame Endurance Caches [Rot A]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1068 | 掉落来源 (Sources) | `Hallowed Flame Endurance Caches [Rot B]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1069 | 掉落来源 (Sources) | `Hallowed Flame Endurance Caches [Rot C]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1070 | 掉落来源 (Sources) | `Granum Void [Rot A]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1071 | 掉落来源 (Sources) | `Granum Void [Rot B]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1072 | 掉落来源 (Sources) | `Granum Void [Rot C]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1073 | 掉落来源 (Sources) | `Extended Granum Void [Rot A]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1074 | 掉落来源 (Sources) | `Extended Granum Void [Rot B]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1075 | 掉落来源 (Sources) | `Extended Granum Void [Rot C]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1076 | 掉落来源 (Sources) | `Nightmare Granum Void [Rot A]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1077 | 掉落来源 (Sources) | `Nightmare Granum Void [Rot B]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1078 | 掉落来源 (Sources) | `Nightmare Granum Void [Rot C]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1079 | 掉落来源 (Sources) | `Void Storm (Earth)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1080 | 掉落来源 (Sources) | `Void Storm (Venus)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1081 | 掉落来源 (Sources) | `Void Storm (Saturn)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1082 | 掉落来源 (Sources) | `Void Storm (Neptune)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1083 | 掉落来源 (Sources) | `Void Storm (Pluto)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1084 | 掉落来源 (Sources) | `Void Storm (Veil Proxima)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1085 | 掉落来源 (Sources) | `Duviri Full Experience` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1086 | 掉落来源 (Sources) | `Duviri Circuit` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1087 | 掉落来源 (Sources) | `Duviri Static Undercroft Portal` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1088 | 掉落来源 (Sources) | `Duviri Static Undercroft Portal (Steel Path)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1089 | 掉落来源 (Sources) | `Deep Archimedea Silver Rewards` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1090 | 掉落来源 (Sources) | `Deep Archimedea Gold Rewards` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1091 | 掉落来源 (Sources) | `Deep Archimedea Legendary Rewards` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1092 | 掉落来源 (Sources) | `Faceoff: Single Squad [Rot A]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1093 | 掉落来源 (Sources) | `Faceoff: Single Squad [Rot B]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1094 | 掉落来源 (Sources) | `Faceoff: Single Squad (Steel Path) [Rot A]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1095 | 掉落来源 (Sources) | `Faceoff: Single Squad (Steel Path) [Rot B]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1096 | 掉落来源 (Sources) | `Faceoff: Squad VS Squad [Rot A]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1097 | 掉落来源 (Sources) | `Faceoff: Squad VS Squad [Rot B]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1098 | 掉落来源 (Sources) | `Faceoff: Squad VS Squad (Winner)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1099 | 掉落来源 (Sources) | `Faceoff: Squad VS Squad (Steel Path) [Rot A]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1100 | 掉落来源 (Sources) | `Faceoff: Squad VS Squad (Steel Path) [Rot B]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1101 | 掉落来源 (Sources) | `Faceoff: Squad VS Squad (Steel Path Winner)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1102 | 掉落来源 (Sources) | `Temporal Archimedea Silver Rewards` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1103 | 掉落来源 (Sources) | `Temporal Archimedea Gold Rewards` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1104 | 掉落来源 (Sources) | `Temporal Archimedea Legendary Rewards` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1105 | 掉落来源 (Sources) | `Duviri Murmur Invasion Rewards [Rot A]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1106 | 掉落来源 (Sources) | `Duviri Murmur Invasion Rewards [Rot B]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1107 | 掉落来源 (Sources) | `Duviri Murmur Invasion Rewards (Steel Path) [Rot A]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1108 | 掉落来源 (Sources) | `Duviri Murmur Invasion Rewards (Steel Path) [Rot B]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1109 | 掉落来源 (Sources) | `Nokko: Critter Liberation Rewards [Rot A]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1110 | 掉落来源 (Sources) | `Nokko: Critter Liberation Rewards [Rot B]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1111 | 掉落来源 (Sources) | `Nokko: Critter Liberation Rewards [Rot C]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1112 | 掉落来源 (Sources) | `Nokko: Corporate Restructuring Rewards [Rot A]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1113 | 掉落来源 (Sources) | `Nokko: Corporate Restructuring Rewards [Rot B]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1114 | 掉落来源 (Sources) | `Nokko: Corporate Restructuring Rewards [Rot C]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1115 | 掉落来源 (Sources) | `Nokko: Weed The Gardens Rewards [Rot A]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1116 | 掉落来源 (Sources) | `Nokko: Weed The Gardens Rewards [Rot B]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1117 | 掉落来源 (Sources) | `Nokko: Weed The Gardens Rewards [Rot C]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1118 | 掉落来源 (Sources) | `Nokko: Critter Liberation Rewards (Steel Path) [Rot A]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1119 | 掉落来源 (Sources) | `Nokko: Critter Liberation Rewards (Steel Path) [Rot B]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1120 | 掉落来源 (Sources) | `Nokko: Critter Liberation Rewards (Steel Path) [Rot C]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1121 | 掉落来源 (Sources) | `Nokko: Corporate Restructuring (Steel Path) [Rot A]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1122 | 掉落来源 (Sources) | `Nokko: Corporate Restructuring (Steel Path) [Rot B]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1123 | 掉落来源 (Sources) | `Nokko: Corporate Restructuring (Steel Path) [Rot C]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1124 | 掉落来源 (Sources) | `Nokko: Weed The Gardens Rewards (Steel Path) [Rot A]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1125 | 掉落来源 (Sources) | `Nokko: Weed The Gardens Rewards (Steel Path) [Rot B]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1126 | 掉落来源 (Sources) | `Nokko: Weed The Gardens Rewards (Steel Path) [Rot C]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1127 | 掉落来源 (Sources) | `The Descendia: Infernum 20 Triple Arcane Rewards` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1128 | 掉落来源 (Sources) | `The Descendia: Infernum 6 and 13 Arcane Rewards (Steel Path)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1129 | 掉落来源 (Sources) | `The Descendia: Common Rewards (Steel Path)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1130 | 掉落来源 (Sources) | `The Descendia: Rare Rewards (Steel Path)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1131 | 掉落来源 (Sources) | `The Descendia: Uncommon Rewards (Steel Path)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1132 | 掉落来源 (Sources) | `The Descendia: Steel Essence Rewards (Steel Path)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1133 | 掉落来源 (Sources) | `The Descendia: Infernum 20 Triple Arcane Rewards (Steel Path)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1134 | 掉落来源 (Sources) | `The Descendia: Roathe` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1135 | 掉落来源 (Sources) | `The Icebind: Crested Frozen Chests [Rot A]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1136 | 掉落来源 (Sources) | `The Icebind: Crested Frozen Chests [Rot B]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1137 | 掉落来源 (Sources) | `The Icebind: Frozen Chests [Rot A]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1138 | 掉落来源 (Sources) | `The Icebind: Frozen Chests [Rot B]` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1139 | 掉落来源 (Sources) | `Sortie (突击任务)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: composed:sortie) |
| 1140 | 星球 (Planets) | `Solaris` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1141 | 任务类型 (Mission Types) | `Caches` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1142 | 任务类型 (Mission Types) | `Skirmish` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1143 | 任务类型 (Mission Types) | `Follie's Hunt` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1144 | 任务类型 (Mission Types) | `Shrine Defense` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1145 | 任务类型 (Mission Types) | `Pursuit` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1146 | 任务类型 (Mission Types) | `Ascension` | 资料原样英文 | 上游官方资料库中文版原样保留英文 (source: en_as_is:wfcd_worldstate:missionTypes:MT_ASCENSION) |
| 1147 | 任务类型 (Mission Types) | `Arena` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1148 | 任务类型 (Mission Types) | `Rush` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1149 | 任务类型 (Mission Types) | `Sanctuary Onslaught` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1150 | 任务类型 (Mission Types) | `Void Armageddon` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1151 | 任务类型 (Mission Types) | `The Circuit` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1152 | 任务类型 (Mission Types) | `Normal` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1153 | 任务类型 (Mission Types) | `Hard` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1154 | 任务类型 (Mission Types) | `Legacyte Harvest` | 资料原样英文 | 上游官方资料库中文版原样保留英文 (source: en_as_is:wfcd_worldstate:missionTypes:MT_ENDLESS_CAPTURE) |
| 1155 | 任务类型 (Mission Types) | `The Perita Rebellion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1156 | 节点 (Nodes) | `Mercury:Apollodorus` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode94) |
| 1157 | 节点 (Nodes) | `Mercury:Lares` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode130) |
| 1158 | 节点 (Nodes) | `Mercury:Caloris` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode119) |
| 1159 | 节点 (Nodes) | `Mercury:Elion` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode12) |
| 1160 | 节点 (Nodes) | `Mercury:Terminus (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode28) |
| 1161 | 节点 (Nodes) | `Mercury:Tolstoj` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode108) |
| 1162 | 节点 (Nodes) | `Mercury:Neruda (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode221) |
| 1163 | 节点 (Nodes) | `Mercury:Caduceus` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode901) |
| 1164 | 节点 (Nodes) | `Mercury:Odin` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode224) |
| 1165 | 节点 (Nodes) | `Mercury:Suisei` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode225) |
| 1166 | 节点 (Nodes) | `Venus:Bifrost Echo` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode503) |
| 1167 | 节点 (Nodes) | `Venus:Bifrost Echo (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode503) |
| 1168 | 节点 (Nodes) | `Venus:Bifrost Echo (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode503) |
| 1169 | 节点 (Nodes) | `Venus:Beacon Shield Ring` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode511) |
| 1170 | 节点 (Nodes) | `Venus:Beacon Shield Ring (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode511) |
| 1171 | 节点 (Nodes) | `Venus:Beacon Shield Ring (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode511) |
| 1172 | 节点 (Nodes) | `Venus:Orvin-Haarc` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode512) |
| 1173 | 节点 (Nodes) | `Venus:Orvin-Haarc (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode512) |
| 1174 | 节点 (Nodes) | `Venus:Orvin-Haarc (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode512) |
| 1175 | 节点 (Nodes) | `Venus:Vesper Strait` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode513) |
| 1176 | 节点 (Nodes) | `Venus:Vesper Strait (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode513) |
| 1177 | 节点 (Nodes) | `Venus:Vesper Strait (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode513) |
| 1178 | 节点 (Nodes) | `Venus:Luckless Expanse` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode515) |
| 1179 | 节点 (Nodes) | `Venus:Luckless Expanse (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode515) |
| 1180 | 节点 (Nodes) | `Venus:Luckless Expanse (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode515) |
| 1181 | 节点 (Nodes) | `Venus:Falling Glory` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode514) |
| 1182 | 节点 (Nodes) | `Venus:Falling Glory (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode514) |
| 1183 | 节点 (Nodes) | `Venus:Falling Glory (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode514) |
| 1184 | 节点 (Nodes) | `Venus:V Prime` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode123) |
| 1185 | 节点 (Nodes) | `Venus:Ishtar (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode61) |
| 1186 | 节点 (Nodes) | `Venus:Vesper` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode71) |
| 1187 | 节点 (Nodes) | `Venus:Cytherean` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode23) |
| 1188 | 节点 (Nodes) | `Venus:Linea` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode109) |
| 1189 | 节点 (Nodes) | `Venus:Fossa` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode104) |
| 1190 | 节点 (Nodes) | `Venus:Unda` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode66) |
| 1191 | 节点 (Nodes) | `Venus:Malva` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode1) |
| 1192 | 节点 (Nodes) | `Venus:Venera` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode107) |
| 1193 | 节点 (Nodes) | `Venus:Tessera` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode22) |
| 1194 | 节点 (Nodes) | `Venus:Kiliken` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode101) |
| 1195 | 节点 (Nodes) | `Venus:Romula` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode0) |
| 1196 | 节点 (Nodes) | `Venus:Vesper Relay` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:VenusHUB) |
| 1197 | 节点 (Nodes) | `Venus:Vesper Relay (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:VenusHUB) |
| 1198 | 节点 (Nodes) | `Venus:Montes` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode902) |
| 1199 | 节点 (Nodes) | `Earth:Mantle` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode63) |
| 1200 | 节点 (Nodes) | `Earth:Cambria` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode79) |
| 1201 | 节点 (Nodes) | `Earth:Everest` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode39) |
| 1202 | 节点 (Nodes) | `Earth:Pacific` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode15) |
| 1203 | 节点 (Nodes) | `Earth:Lith` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode26) |
| 1204 | 节点 (Nodes) | `Earth:Sover Strait` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode502) |
| 1205 | 节点 (Nodes) | `Earth:Sover Strait (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode502) |
| 1206 | 节点 (Nodes) | `Earth:Sover Strait (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode502) |
| 1207 | 节点 (Nodes) | `Earth:Iota Temple` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode509) |
| 1208 | 节点 (Nodes) | `Earth:Iota Temple (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode509) |
| 1209 | 节点 (Nodes) | `Earth:Iota Temple (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode509) |
| 1210 | 节点 (Nodes) | `Earth:Gaia` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode85) |
| 1211 | 节点 (Nodes) | `Earth:Cervantes (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode75) |
| 1212 | 节点 (Nodes) | `Earth:Oro` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode24) |
| 1213 | 节点 (Nodes) | `Earth:Coba` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode2) |
| 1214 | 节点 (Nodes) | `Earth:Erpo` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode903) |
| 1215 | 节点 (Nodes) | `Earth:Tikal` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode3) |
| 1216 | 节点 (Nodes) | `Earth:Ogal Cluster` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode518) |
| 1217 | 节点 (Nodes) | `Earth:Ogal Cluster (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode518) |
| 1218 | 节点 (Nodes) | `Earth:Ogal Cluster (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode518) |
| 1219 | 节点 (Nodes) | `Earth:Korm's Belt` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode519) |
| 1220 | 节点 (Nodes) | `Earth:Korm's Belt (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode519) |
| 1221 | 节点 (Nodes) | `Earth:Korm's Belt (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode519) |
| 1222 | 节点 (Nodes) | `Earth:Bendar Cluster` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode522) |
| 1223 | 节点 (Nodes) | `Earth:Bendar Cluster (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode522) |
| 1224 | 节点 (Nodes) | `Earth:Bendar Cluster (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode522) |
| 1225 | 节点 (Nodes) | `Earth:Saya's Visions` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Earth) |
| 1226 | 节点 (Nodes) | `Mars:Arcadia` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode35) |
| 1227 | 节点 (Nodes) | `Mars:Olympus` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode30) |
| 1228 | 节点 (Nodes) | `Mars:Spear` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode46) |
| 1229 | 节点 (Nodes) | `Mars:Alator` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode106) |
| 1230 | 节点 (Nodes) | `Mars:Arval` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode41) |
| 1231 | 节点 (Nodes) | `Mars:Augustus` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode16) |
| 1232 | 节点 (Nodes) | `Mars:Ara` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode45) |
| 1233 | 节点 (Nodes) | `Mars:Martialis` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode36) |
| 1234 | 节点 (Nodes) | `Mars:Kadesh` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode8) |
| 1235 | 节点 (Nodes) | `Mars:War` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode99) |
| 1236 | 节点 (Nodes) | `Mars:Gradivus (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode65) |
| 1237 | 节点 (Nodes) | `Mars:Wahiba` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode9) |
| 1238 | 节点 (Nodes) | `Mars:Quirinus` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode115) |
| 1239 | 节点 (Nodes) | `Mars:Syrtis` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode904) |
| 1240 | 节点 (Nodes) | `Mars:Tyana Pass` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode450) |
| 1241 | 节点 (Nodes) | `Jupiter:Ganymede` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:EventNode33) |
| 1242 | 节点 (Nodes) | `Jupiter:Adrastea (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode88) |
| 1243 | 节点 (Nodes) | `Jupiter:Amalthea` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode97) |
| 1244 | 节点 (Nodes) | `Jupiter:Metis` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode126) |
| 1245 | 节点 (Nodes) | `Jupiter:Io` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode125) |
| 1246 | 节点 (Nodes) | `Jupiter:Elara` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode100) |
| 1247 | 节点 (Nodes) | `Jupiter:Callisto` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode25) |
| 1248 | 节点 (Nodes) | `Jupiter:Carpo (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode121) |
| 1249 | 节点 (Nodes) | `Jupiter:Themisto` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode53) |
| 1250 | 节点 (Nodes) | `Jupiter:The Ropalolyst` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode740) |
| 1251 | 节点 (Nodes) | `Jupiter:The Ropalolyst (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode740) |
| 1252 | 节点 (Nodes) | `Jupiter:Sinai` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode4) |
| 1253 | 节点 (Nodes) | `Jupiter:Ananke` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode73) |
| 1254 | 节点 (Nodes) | `Jupiter:Galilea` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode905) |
| 1255 | 节点 (Nodes) | `Jupiter:Cameria` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode5) |
| 1256 | 节点 (Nodes) | `Saturn:Helene` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode42) |
| 1257 | 节点 (Nodes) | `Saturn:Titan` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode96) |
| 1258 | 节点 (Nodes) | `Saturn:Dione` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode67) |
| 1259 | 节点 (Nodes) | `Saturn:Mordo Cluster` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode501) |
| 1260 | 节点 (Nodes) | `Saturn:Mordo Cluster (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode501) |
| 1261 | 节点 (Nodes) | `Saturn:Mordo Cluster (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode501) |
| 1262 | 节点 (Nodes) | `Saturn:Kasio's Rest` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode530) |
| 1263 | 节点 (Nodes) | `Saturn:Kasio's Rest (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode530) |
| 1264 | 节点 (Nodes) | `Saturn:Kasio's Rest (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode530) |
| 1265 | 节点 (Nodes) | `Saturn:Nodo Gap` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode533) |
| 1266 | 节点 (Nodes) | `Saturn:Nodo Gap (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode533) |
| 1267 | 节点 (Nodes) | `Saturn:Nodo Gap (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode533) |
| 1268 | 节点 (Nodes) | `Saturn:Lupal Pass` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode534) |
| 1269 | 节点 (Nodes) | `Saturn:Lupal Pass (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode534) |
| 1270 | 节点 (Nodes) | `Saturn:Lupal Pass (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode534) |
| 1271 | 节点 (Nodes) | `Saturn:Vand Cluster` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode535) |
| 1272 | 节点 (Nodes) | `Saturn:Vand Cluster (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode535) |
| 1273 | 节点 (Nodes) | `Saturn:Vand Cluster (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode535) |
| 1274 | 节点 (Nodes) | `Saturn:Mimas` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode44) |
| 1275 | 节点 (Nodes) | `Saturn:Tethys` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode32) |
| 1276 | 节点 (Nodes) | `Saturn:Phoebe` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode80) |
| 1277 | 节点 (Nodes) | `Saturn:Rhea` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode18) |
| 1278 | 节点 (Nodes) | `Saturn:Pallene (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode37) |
| 1279 | 节点 (Nodes) | `Saturn:Aegaeon` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode86) |
| 1280 | 节点 (Nodes) | `Saturn:Cassini` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode70) |
| 1281 | 节点 (Nodes) | `Saturn:Anthe` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode31) |
| 1282 | 节点 (Nodes) | `Saturn:Numa` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode50) |
| 1283 | 节点 (Nodes) | `Saturn:Calypso (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode82) |
| 1284 | 节点 (Nodes) | `Saturn:Pandora` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode906) |
| 1285 | 节点 (Nodes) | `Saturn:Cephalon Capture` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Saturn) |
| 1286 | 节点 (Nodes) | `Saturn:Cephalon Capture (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Saturn) |
| 1287 | 节点 (Nodes) | `Saturn:Team Annihilation` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Saturn) |
| 1288 | 节点 (Nodes) | `Saturn:Team Annihilation (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Saturn) |
| 1289 | 节点 (Nodes) | `Saturn:Annihilation` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Saturn) |
| 1290 | 节点 (Nodes) | `Saturn:Annihilation (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Saturn) |
| 1291 | 节点 (Nodes) | `Saturn:Lunaro Arena` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Saturn) |
| 1292 | 节点 (Nodes) | `Saturn:Lunaro Arena (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Saturn) |
| 1293 | 节点 (Nodes) | `Saturn:Piscinas` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode13) |
| 1294 | 节点 (Nodes) | `Saturn:Caracol` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode12) |
| 1295 | 节点 (Nodes) | `Saturn:Variant Cephalon Capture` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Saturn) |
| 1296 | 节点 (Nodes) | `Saturn:Variant Cephalon Capture (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Saturn) |
| 1297 | 节点 (Nodes) | `Saturn:Variant Team Annihilation` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Saturn) |
| 1298 | 节点 (Nodes) | `Saturn:Variant Team Annihilation (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Saturn) |
| 1299 | 节点 (Nodes) | `Saturn:Variant Annihilation` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Saturn) |
| 1300 | 节点 (Nodes) | `Saturn:Variant Annihilation (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Saturn) |
| 1301 | 节点 (Nodes) | `Uranus:Ariel` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode33) |
| 1302 | 节点 (Nodes) | `Uranus:Titania` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode105) |
| 1303 | 节点 (Nodes) | `Uranus:Umbriel` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode64) |
| 1304 | 节点 (Nodes) | `Uranus:Miranda` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode90) |
| 1305 | 节点 (Nodes) | `Uranus:Ophelia` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode69) |
| 1306 | 节点 (Nodes) | `Uranus:Portia (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode52) |
| 1307 | 节点 (Nodes) | `Uranus:Desdemona (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode98) |
| 1308 | 节点 (Nodes) | `Uranus:Cupid` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode77) |
| 1309 | 节点 (Nodes) | `Uranus:Rosalind` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode9) |
| 1310 | 节点 (Nodes) | `Uranus:Bianca` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode13) |
| 1311 | 节点 (Nodes) | `Uranus:Prospero (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode40) |
| 1312 | 节点 (Nodes) | `Uranus:Mab` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode116) |
| 1313 | 节点 (Nodes) | `Uranus:Setebos (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode112) |
| 1314 | 节点 (Nodes) | `Uranus:Caliban` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode60) |
| 1315 | 节点 (Nodes) | `Uranus:Ur` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode16) |
| 1316 | 节点 (Nodes) | `Uranus:Stephano` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode122) |
| 1317 | 节点 (Nodes) | `Uranus:Trinculo` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode124) |
| 1318 | 节点 (Nodes) | `Uranus:Caelus` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode907) |
| 1319 | 节点 (Nodes) | `Uranus:Assur` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode17) |
| 1320 | 节点 (Nodes) | `Uranus:Brutus` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode723) |
| 1321 | 节点 (Nodes) | `Uranus:The Kuva Wytch` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Uranus) |
| 1322 | 节点 (Nodes) | `Uranus:The Kuva Wytch (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Uranus) |
| 1323 | 节点 (Nodes) | `Uranus:Scoria's Angel` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Uranus) |
| 1324 | 节点 (Nodes) | `Uranus:Scoria's Angel (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Uranus) |
| 1325 | 节点 (Nodes) | `Neptune:Thalassa (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode95) |
| 1326 | 节点 (Nodes) | `Neptune:Galatea` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode1) |
| 1327 | 节点 (Nodes) | `Neptune:Proteus` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode17) |
| 1328 | 节点 (Nodes) | `Neptune:Triton` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode78) |
| 1329 | 节点 (Nodes) | `Neptune:Despina` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode6) |
| 1330 | 节点 (Nodes) | `Neptune:Arva Vector` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode504) |
| 1331 | 节点 (Nodes) | `Neptune:Arva Vector (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode504) |
| 1332 | 节点 (Nodes) | `Neptune:Arva Vector (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode504) |
| 1333 | 节点 (Nodes) | `Neptune:Nu-Gua Mines` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode516) |
| 1334 | 节点 (Nodes) | `Neptune:Nu-Gua Mines (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode516) |
| 1335 | 节点 (Nodes) | `Neptune:Nu-Gua Mines (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode516) |
| 1336 | 节点 (Nodes) | `Neptune:Enkidu Ice Drifts` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode521) |
| 1337 | 节点 (Nodes) | `Neptune:Enkidu Ice Drifts (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode521) |
| 1338 | 节点 (Nodes) | `Neptune:Enkidu Ice Drifts (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode521) |
| 1339 | 节点 (Nodes) | `Neptune:Mammon's Prospect` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode523) |
| 1340 | 节点 (Nodes) | `Neptune:Mammon's Prospect (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode523) |
| 1341 | 节点 (Nodes) | `Neptune:Mammon's Prospect (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode523) |
| 1342 | 节点 (Nodes) | `Neptune:Sovereign Grasp` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode524) |
| 1343 | 节点 (Nodes) | `Neptune:Sovereign Grasp (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode524) |
| 1344 | 节点 (Nodes) | `Neptune:Sovereign Grasp (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode524) |
| 1345 | 节点 (Nodes) | `Neptune:Brom Cluster` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode525) |
| 1346 | 节点 (Nodes) | `Neptune:Brom Cluster (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode525) |
| 1347 | 节点 (Nodes) | `Neptune:Brom Cluster (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode525) |
| 1348 | 节点 (Nodes) | `Neptune:Halimede (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode120) |
| 1349 | 节点 (Nodes) | `Neptune:Salacia` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode908) |
| 1350 | 节点 (Nodes) | `Neptune:Psamathe` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode127) |
| 1351 | 节点 (Nodes) | `Neptune:Laomedeia` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode118) |
| 1352 | 节点 (Nodes) | `Neptune:Nereid` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode84) |
| 1353 | 节点 (Nodes) | `Neptune:Yursa` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode20) |
| 1354 | 节点 (Nodes) | `Neptune:Kelashin` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode21) |
| 1355 | 节点 (Nodes) | `Neptune:Cephalon Capture` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Neptune) |
| 1356 | 节点 (Nodes) | `Neptune:The Index: Endurance (Low Risk)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Neptune) |
| 1357 | 节点 (Nodes) | `Neptune:The Index: Endurance (Medium Risk)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Neptune) |
| 1358 | 节点 (Nodes) | `Neptune:The Index: Endurance (High Risk)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Neptune) |
| 1359 | 节点 (Nodes) | `Neptune:The Index: Endurance` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Neptune) |
| 1360 | 节点 (Nodes) | `Pluto:Outer Terminus` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode72) |
| 1361 | 节点 (Nodes) | `Pluto:Regna` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode48) |
| 1362 | 节点 (Nodes) | `Pluto:Charon (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode92) |
| 1363 | 节点 (Nodes) | `Pluto:Hydra` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode76) |
| 1364 | 节点 (Nodes) | `Pluto:Hades` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode51) |
| 1365 | 节点 (Nodes) | `Pluto:Cypress (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode56) |
| 1366 | 节点 (Nodes) | `Pluto:Cerberus` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode43) |
| 1367 | 节点 (Nodes) | `Pluto:Palus` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode81) |
| 1368 | 节点 (Nodes) | `Pluto:Sechura` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode24) |
| 1369 | 节点 (Nodes) | `Pluto:Oceanum` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode102) |
| 1370 | 节点 (Nodes) | `Pluto:Hieracon` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode25) |
| 1371 | 节点 (Nodes) | `Pluto:Corb` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:EventNode8) |
| 1372 | 节点 (Nodes) | `Pluto:Khufu Envoy` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode526) |
| 1373 | 节点 (Nodes) | `Pluto:Khufu Envoy (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode526) |
| 1374 | 节点 (Nodes) | `Pluto:Khufu Envoy (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode526) |
| 1375 | 节点 (Nodes) | `Pluto:Seven Sirens` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode527) |
| 1376 | 节点 (Nodes) | `Pluto:Seven Sirens (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode527) |
| 1377 | 节点 (Nodes) | `Pluto:Seven Sirens (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode527) |
| 1378 | 节点 (Nodes) | `Pluto:Obol Crossing` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode528) |
| 1379 | 节点 (Nodes) | `Pluto:Obol Crossing (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode528) |
| 1380 | 节点 (Nodes) | `Pluto:Obol Crossing (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode528) |
| 1381 | 节点 (Nodes) | `Pluto:Fenton's Field` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode531) |
| 1382 | 节点 (Nodes) | `Pluto:Fenton's Field (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode531) |
| 1383 | 节点 (Nodes) | `Pluto:Fenton's Field (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode531) |
| 1384 | 节点 (Nodes) | `Pluto:Profit Margin` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode529) |
| 1385 | 节点 (Nodes) | `Pluto:Profit Margin (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode529) |
| 1386 | 节点 (Nodes) | `Pluto:Profit Margin (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode529) |
| 1387 | 节点 (Nodes) | `Pluto:Peregrine Axis` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode536) |
| 1388 | 节点 (Nodes) | `Pluto:Peregrine Axis (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode536) |
| 1389 | 节点 (Nodes) | `Pluto:Peregrine Axis (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode536) |
| 1390 | 节点 (Nodes) | `Ceres:Olla` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode136) |
| 1391 | 节点 (Nodes) | `Ceres:Thon (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode135) |
| 1392 | 节点 (Nodes) | `Ceres:Bode` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode132) |
| 1393 | 节点 (Nodes) | `Ceres:Varro` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode134) |
| 1394 | 节点 (Nodes) | `Ceres:Lex` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode139) |
| 1395 | 节点 (Nodes) | `Ceres:Ker (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode141) |
| 1396 | 节点 (Nodes) | `Ceres:Nuovo` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode137) |
| 1397 | 节点 (Nodes) | `Ceres:Hapke` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode142) |
| 1398 | 节点 (Nodes) | `Ceres:Exta` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode144) |
| 1399 | 节点 (Nodes) | `Ceres:Exta (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode144) |
| 1400 | 节点 (Nodes) | `Ceres:Casta` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode149) |
| 1401 | 节点 (Nodes) | `Ceres:Cinxia` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode147) |
| 1402 | 节点 (Nodes) | `Ceres:Egeria` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode145) |
| 1403 | 节点 (Nodes) | `Ceres:Draco` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode146) |
| 1404 | 节点 (Nodes) | `Ceres:Gabii` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode23) |
| 1405 | 节点 (Nodes) | `Ceres:Seimeni` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode22) |
| 1406 | 节点 (Nodes) | `Eris:Cyath` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode156) |
| 1407 | 节点 (Nodes) | `Eris:Cosis` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode155) |
| 1408 | 节点 (Nodes) | `Eris:Candiru (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode154) |
| 1409 | 节点 (Nodes) | `Eris:Brugia` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode153) |
| 1410 | 节点 (Nodes) | `Eris:Lepis (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode159) |
| 1411 | 节点 (Nodes) | `Eris:Kala-Azar` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode164) |
| 1412 | 节点 (Nodes) | `Eris:Hymeno` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode161) |
| 1413 | 节点 (Nodes) | `Eris:Isos` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode162) |
| 1414 | 节点 (Nodes) | `Eris:Gnathos` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode158) |
| 1415 | 节点 (Nodes) | `Eris:Sporid` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode165) |
| 1416 | 节点 (Nodes) | `Eris:Ixodes` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode163) |
| 1417 | 节点 (Nodes) | `Eris:Phalan` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode168) |
| 1418 | 节点 (Nodes) | `Eris:Oestrus` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode167) |
| 1419 | 节点 (Nodes) | `Eris:Ranova` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode170) |
| 1420 | 节点 (Nodes) | `Eris:Psoro (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode169) |
| 1421 | 节点 (Nodes) | `Eris:Nimus` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode166) |
| 1422 | 节点 (Nodes) | `Eris:Akkad` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode18) |
| 1423 | 节点 (Nodes) | `Eris:Sparga` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode174) |
| 1424 | 节点 (Nodes) | `Eris:Xini` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode172) |
| 1425 | 节点 (Nodes) | `Eris:Viver (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode176) |
| 1426 | 节点 (Nodes) | `Eris:Zabala` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode19) |
| 1427 | 节点 (Nodes) | `Eris:Naeglar (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode175) |
| 1428 | 节点 (Nodes) | `Sedna:Kappa` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode177) |
| 1429 | 节点 (Nodes) | `Sedna:Rusalka (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode184) |
| 1430 | 节点 (Nodes) | `Sedna:Camenae` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode182) |
| 1431 | 节点 (Nodes) | `Sedna:Vodyanoi` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode183) |
| 1432 | 节点 (Nodes) | `Sedna:Undine` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode180) |
| 1433 | 节点 (Nodes) | `Sedna:Jengu` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode179) |
| 1434 | 节点 (Nodes) | `Sedna:Nakki` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode190) |
| 1435 | 节点 (Nodes) | `Sedna:Berehynia` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode185) |
| 1436 | 节点 (Nodes) | `Sedna:Tikoloshe` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode192) |
| 1437 | 节点 (Nodes) | `Sedna:Selkie` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode187) |
| 1438 | 节点 (Nodes) | `Sedna:Phithale (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode186) |
| 1439 | 节点 (Nodes) | `Sedna:Kelpie` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode188) |
| 1440 | 节点 (Nodes) | `Sedna:Naga` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode189) |
| 1441 | 节点 (Nodes) | `Sedna:Yam` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode199) |
| 1442 | 节点 (Nodes) | `Sedna:Merrow` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode193) |
| 1443 | 节点 (Nodes) | `Sedna:Hydron` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode195) |
| 1444 | 节点 (Nodes) | `Sedna:Scylla` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode198) |
| 1445 | 节点 (Nodes) | `Sedna:Yemaja` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode202) |
| 1446 | 节点 (Nodes) | `Sedna:Amarna` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode14) |
| 1447 | 节点 (Nodes) | `Sedna:Veles` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode200) |
| 1448 | 节点 (Nodes) | `Sedna:Sangeru` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode15) |
| 1449 | 节点 (Nodes) | `Europa:Abaddon` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode203) |
| 1450 | 节点 (Nodes) | `Europa:Gamygyn` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode207) |
| 1451 | 节点 (Nodes) | `Europa:Eligor` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode206) |
| 1452 | 节点 (Nodes) | `Europa:Lillith` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode208) |
| 1453 | 节点 (Nodes) | `Europa:Naamah` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode210) |
| 1454 | 节点 (Nodes) | `Europa:Valefor` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode216) |
| 1455 | 节点 (Nodes) | `Europa:Ose` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode211) |
| 1456 | 节点 (Nodes) | `Europa:Valac` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode215) |
| 1457 | 节点 (Nodes) | `Europa:Shax` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode213) |
| 1458 | 节点 (Nodes) | `Europa:Paimon` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode212) |
| 1459 | 节点 (Nodes) | `Europa:Orias` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode217) |
| 1460 | 节点 (Nodes) | `Europa:Zagan` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode218) |
| 1461 | 节点 (Nodes) | `Europa:Larzac` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode6) |
| 1462 | 节点 (Nodes) | `Europa:Cryotic Front` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Europa) |
| 1463 | 节点 (Nodes) | `Europa:Beleth` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode219) |
| 1464 | 节点 (Nodes) | `Europa:Cholistan` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode7) |
| 1465 | 节点 (Nodes) | `Void:Teshub` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode400) |
| 1466 | 节点 (Nodes) | `Void:Hepit` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode401) |
| 1467 | 节点 (Nodes) | `Void:Taranis` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode402) |
| 1468 | 节点 (Nodes) | `Void:Tiwaz` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode403) |
| 1469 | 节点 (Nodes) | `Void:Stribog` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode404) |
| 1470 | 节点 (Nodes) | `Void:Stribog (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode404) |
| 1471 | 节点 (Nodes) | `Void:Ani` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode405) |
| 1472 | 节点 (Nodes) | `Void:Ukko` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode406) |
| 1473 | 节点 (Nodes) | `Void:Oxomoco` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode407) |
| 1474 | 节点 (Nodes) | `Void:Belenus` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode408) |
| 1475 | 节点 (Nodes) | `Void:Mot` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode409) |
| 1476 | 节点 (Nodes) | `Void:Aten` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode410) |
| 1477 | 节点 (Nodes) | `Void:Marduk` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode411) |
| 1478 | 节点 (Nodes) | `Void:Marduk (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode411) |
| 1479 | 节点 (Nodes) | `Void:Mithra` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode412) |
| 1480 | 节点 (Nodes) | `Phobos:Limtoc` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SettlementNode6) |
| 1481 | 节点 (Nodes) | `Phobos:Grildrig` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SettlementNode5) |
| 1482 | 节点 (Nodes) | `Phobos:Stickney` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SettlementNode3) |
| 1483 | 节点 (Nodes) | `Phobos:Skyresh` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SettlementNode2) |
| 1484 | 节点 (Nodes) | `Phobos:Drunlo` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SettlementNode4) |
| 1485 | 节点 (Nodes) | `Phobos:Monolith` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SettlementNode12) |
| 1486 | 节点 (Nodes) | `Phobos:Kepler` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SettlementNode10) |
| 1487 | 节点 (Nodes) | `Phobos:Gulliver` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SettlementNode11) |
| 1488 | 节点 (Nodes) | `Phobos:Shklovsky` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SettlementNode14) |
| 1489 | 节点 (Nodes) | `Phobos:Wendell` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SettlementNode16) |
| 1490 | 节点 (Nodes) | `Phobos:Todd` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SettlementNode19) |
| 1491 | 节点 (Nodes) | `Phobos:Flimnap` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SettlementNode17) |
| 1492 | 节点 (Nodes) | `Phobos:Memphis` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode10) |
| 1493 | 节点 (Nodes) | `Phobos:Iliad` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SettlementNode20) |
| 1494 | 节点 (Nodes) | `Phobos:Opik` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SettlementNode18) |
| 1495 | 节点 (Nodes) | `Phobos:Zeugma` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:ClanNode11) |
| 1496 | 节点 (Nodes) | `Deimos:Hyf` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode707) |
| 1497 | 节点 (Nodes) | `Deimos:Formido (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode710) |
| 1498 | 节点 (Nodes) | `Deimos:Terrorem` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode711) |
| 1499 | 节点 (Nodes) | `Deimos:Magnacidium` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode712) |
| 1500 | 节点 (Nodes) | `Deimos:Effervo` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode715) |
| 1501 | 节点 (Nodes) | `Deimos:Nex` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode716) |
| 1502 | 节点 (Nodes) | `Deimos:Persto` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode717) |
| 1503 | 节点 (Nodes) | `Deimos:Cambire` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode718) |
| 1504 | 节点 (Nodes) | `Deimos:Munio` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode719) |
| 1505 | 节点 (Nodes) | `Deimos:Armatus` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode721) |
| 1506 | 节点 (Nodes) | `Lua:Plato (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode300) |
| 1507 | 节点 (Nodes) | `Lua:Pavlov` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode306) |
| 1508 | 节点 (Nodes) | `Lua:Tycho` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode302) |
| 1509 | 节点 (Nodes) | `Lua:StöFler` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode305) |
| 1510 | 节点 (Nodes) | `Lua:Copernicus` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode304) |
| 1511 | 节点 (Nodes) | `Lua:Zeipel` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode307) |
| 1512 | 节点 (Nodes) | `Lua:Apollo` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode308) |
| 1513 | 节点 (Nodes) | `Lua:Yuvarium` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode309) |
| 1514 | 节点 (Nodes) | `Lua:Yuvarium (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode309) |
| 1515 | 节点 (Nodes) | `Lua:Circulus` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode310) |
| 1516 | 节点 (Nodes) | `Lua:Circulus (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode310) |
| 1517 | 节点 (Nodes) | `Kuva Fortress:Nabuk` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode742) |
| 1518 | 节点 (Nodes) | `Kuva Fortress:Taveuni` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode744) |
| 1519 | 节点 (Nodes) | `Kuva Fortress:Tamu` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode745) |
| 1520 | 节点 (Nodes) | `Kuva Fortress:Dakata (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:SolNode746) |
| 1521 | 节点 (Nodes) | `Kuva Fortress:Pago` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode747) |
| 1522 | 节点 (Nodes) | `Kuva Fortress:Garus` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode748) |
| 1523 | 节点 (Nodes) | `Sanctuary:Sanctuary Onslaught` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Sanctuary) |
| 1524 | 节点 (Nodes) | `Sanctuary:Elite Sanctuary Onslaught` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Sanctuary) |
| 1525 | 节点 (Nodes) | `Veil Proxima:Flexa` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode553) |
| 1526 | 节点 (Nodes) | `Veil Proxima:Flexa (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode553) |
| 1527 | 节点 (Nodes) | `Veil Proxima:Flexa (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode553) |
| 1528 | 节点 (Nodes) | `Veil Proxima:H-2 Cloud` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode554) |
| 1529 | 节点 (Nodes) | `Veil Proxima:H-2 Cloud (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode554) |
| 1530 | 节点 (Nodes) | `Veil Proxima:H-2 Cloud (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode554) |
| 1531 | 节点 (Nodes) | `Veil Proxima:R-9 Cloud` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode555) |
| 1532 | 节点 (Nodes) | `Veil Proxima:R-9 Cloud (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode555) |
| 1533 | 节点 (Nodes) | `Veil Proxima:R-9 Cloud (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode555) |
| 1534 | 节点 (Nodes) | `Veil Proxima:Nsu Grid` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode550) |
| 1535 | 节点 (Nodes) | `Veil Proxima:Nsu Grid (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode550) |
| 1536 | 节点 (Nodes) | `Veil Proxima:Nsu Grid (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode550) |
| 1537 | 节点 (Nodes) | `Veil Proxima:Calabash` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode538) |
| 1538 | 节点 (Nodes) | `Veil Proxima:Calabash (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode538) |
| 1539 | 节点 (Nodes) | `Veil Proxima:Calabash (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode538) |
| 1540 | 节点 (Nodes) | `Veil Proxima:Numina` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode539) |
| 1541 | 节点 (Nodes) | `Veil Proxima:Numina (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode539) |
| 1542 | 节点 (Nodes) | `Veil Proxima:Numina (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode539) |
| 1543 | 节点 (Nodes) | `Veil Proxima:Arc Silver` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode540) |
| 1544 | 节点 (Nodes) | `Veil Proxima:Arc Silver (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode540) |
| 1545 | 节点 (Nodes) | `Veil Proxima:Arc Silver (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode540) |
| 1546 | 节点 (Nodes) | `Veil Proxima:Erato` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode541) |
| 1547 | 节点 (Nodes) | `Veil Proxima:Erato (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode541) |
| 1548 | 节点 (Nodes) | `Veil Proxima:Erato (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode541) |
| 1549 | 节点 (Nodes) | `Veil Proxima:Lu-Yan` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:CrewBattleNode542) |
| 1550 | 节点 (Nodes) | `Veil Proxima:Lu-Yan (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode542) |
| 1551 | 节点 (Nodes) | `Veil Proxima:Lu-Yan (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:solNode+suffix:CrewBattleNode542) |
| 1552 | 节点 (Nodes) | `Veil Proxima:Sabmir Cloud` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Veil Proxima) |
| 1553 | 节点 (Nodes) | `Veil Proxima:Sabmir Cloud (Extra)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Veil Proxima) |
| 1554 | 节点 (Nodes) | `Veil Proxima:Sabmir Cloud (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Veil Proxima) |
| 1555 | 节点 (Nodes) | `Zariman:Everview Arc` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode230) |
| 1556 | 节点 (Nodes) | `Zariman:Halako Perimeter` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode231) |
| 1557 | 节点 (Nodes) | `Zariman:Tuvul Commons` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode232) |
| 1558 | 节点 (Nodes) | `Zariman:Oro Works` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode233) |
| 1559 | 节点 (Nodes) | `Zariman:The Greenway` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode235) |
| 1560 | 节点 (Nodes) | `Duviri:The Circuit` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: wfcd_worldstate:solNodes:SolNode238) |
| 1561 | 节点 (Nodes) | `Duviri:Endless: Tier 1` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Duviri) |
| 1562 | 节点 (Nodes) | `Duviri:Endless: Tier 3` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Duviri) |
| 1563 | 节点 (Nodes) | `Duviri:Endless: Tier 4` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Duviri) |
| 1564 | 节点 (Nodes) | `Duviri:Endless: Tier 6` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Duviri) |
| 1565 | 节点 (Nodes) | `Duviri:Endless: Tier 9` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Duviri) |
| 1566 | 节点 (Nodes) | `Duviri:Endless: Repeated Rewards` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Duviri) |
| 1567 | 节点 (Nodes) | `Duviri:Endless: Tier 1 (Hard)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Duviri) |
| 1568 | 节点 (Nodes) | `Duviri:Endless: Tier 2` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Duviri) |
| 1569 | 节点 (Nodes) | `Duviri:Endless: Tier 3 (Hard)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Duviri) |
| 1570 | 节点 (Nodes) | `Duviri:Endless: Tier 4 (Hard)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Duviri) |
| 1571 | 节点 (Nodes) | `Duviri:Endless: Tier 6 (Hard)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Duviri) |
| 1572 | 节点 (Nodes) | `Duviri:Endless: Tier 7` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Duviri) |
| 1573 | 节点 (Nodes) | `Duviri:Endless: Tier 8` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Duviri) |
| 1574 | 节点 (Nodes) | `Duviri:Endless: Tier 9 (Hard)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Duviri) |
| 1575 | 节点 (Nodes) | `Duviri:Endless: Repeated Rewards (Hard)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Duviri) |
| 1576 | 节点 (Nodes) | `Höllvania:Legacyte Harvest` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Höllvania) |
| 1577 | 节点 (Nodes) | `Höllvania:Hell-Scrub: Scaldra` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Höllvania) |
| 1578 | 节点 (Nodes) | `Höllvania:Hell-Scrub: Techrot` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Höllvania) |
| 1579 | 节点 (Nodes) | `Höllvania:Exterminate: Scaldra` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Höllvania) |
| 1580 | 节点 (Nodes) | `Höllvania:Exterminate: Scaldra (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Höllvania) |
| 1581 | 节点 (Nodes) | `Höllvania:Exterminate: Techrot` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Höllvania) |
| 1582 | 节点 (Nodes) | `Höllvania:Exterminate: Techrot (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Höllvania) |
| 1583 | 节点 (Nodes) | `Höllvania:Assassinate: H-09 Tank` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Höllvania) |
| 1584 | 节点 (Nodes) | `Höllvania:Solstice Square` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Höllvania) |
| 1585 | 节点 (Nodes) | `Höllvania:Antivirus Bounty` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Höllvania) |
| 1586 | 节点 (Nodes) | `Höllvania:Antivirus Bounty (Caches)` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Höllvania) |
| 1587 | 节点 (Nodes) | `Dark Refractory, Deimos:Recall: Hunhullus` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Dark Refractory, Deimos) |
| 1588 | 节点 (Nodes) | `Dark Refractory, Deimos:Recall: Dactolyst` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Dark Refractory, Deimos) |
| 1589 | 节点 (Nodes) | `Dark Refractory, Deimos:Recall: Vanguard` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Dark Refractory, Deimos) |
| 1590 | 节点 (Nodes) | `Dark Refractory, Deimos:The Guilty` | 资料原样英文 | 节点/任务原样保留英文，已拼接入中文星球/类型 (source: composed:en_node+planet:Dark Refractory, Deimos) |
| 1591 | 敌人 (Enemies) | `Scaldra Screamer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1592 | 敌人 (Enemies) | `Scaldra Ti-92` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1593 | 敌人 (Enemies) | `H-09 Efervon Tank` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1594 | 敌人 (Enemies) | `H-09 Apex` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1595 | 敌人 (Enemies) | `Lyon Allard` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1596 | 敌人 (Enemies) | `Marie Leroux` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1597 | 敌人 (Enemies) | `Techrot Obsolyte` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1598 | 敌人 (Enemies) | `Techrot Babau` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1599 | 敌人 (Enemies) | `Techrot Skuzzi` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1600 | 敌人 (Enemies) | `Techrot Galliflex` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1601 | 敌人 (Enemies) | `Techrot Volatile Galliflex` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1602 | 敌人 (Enemies) | `Techrot Matmas` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1603 | 敌人 (Enemies) | `Techrot Scaart` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1604 | 敌人 (Enemies) | `Scaldra Flayer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1605 | 敌人 (Enemies) | `Scaldra Dedicant` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1606 | 敌人 (Enemies) | `Scaldra Eradicator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1607 | 敌人 (Enemies) | `Scaldra Jaeger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1608 | 敌人 (Enemies) | `Scaldra Barbican` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1609 | 敌人 (Enemies) | `The Sergeant` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1610 | 敌人 (Enemies) | `Vem Tabook` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1611 | 敌人 (Enemies) | `Leekter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1612 | 敌人 (Enemies) | `Shik Tal` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1613 | 敌人 (Enemies) | `Executioner Zura` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1614 | 敌人 (Enemies) | `Executioner Garesh` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1615 | 敌人 (Enemies) | `Executioner Harkonar` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1616 | 敌人 (Enemies) | `Executioner Reth` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1617 | 敌人 (Enemies) | `Executioner Dhurnam` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1618 | 敌人 (Enemies) | `Executioner Vay Molta` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1619 | 敌人 (Enemies) | `Executioner Dok Thul` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1620 | 敌人 (Enemies) | `Executioner Nok` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1621 | 敌人 (Enemies) | `Executioner Gorth` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1622 | 敌人 (Enemies) | `Amalgam Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1623 | 敌人 (Enemies) | `Amalgam Kucumatz` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1624 | 敌人 (Enemies) | `Demolyst Machinist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1625 | 敌人 (Enemies) | `Demolyst Heqet` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1626 | 敌人 (Enemies) | `Amalgam Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1627 | 敌人 (Enemies) | `Demolyst Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1628 | 敌人 (Enemies) | `Amalgam Satyr` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1629 | 敌人 (Enemies) | `Demolyst Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1630 | 敌人 (Enemies) | `Amalgam Alkonost` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1631 | 敌人 (Enemies) | `Amalgam Machinist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1632 | 敌人 (Enemies) | `Demolyst Satyr` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1633 | 敌人 (Enemies) | `Amalgam Heqet` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1634 | 敌人 (Enemies) | `Vapos Tech` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1635 | 敌人 (Enemies) | `Vapos Sapping Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1636 | 敌人 (Enemies) | `Vapos Elite Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1637 | 敌人 (Enemies) | `Vapos Tech Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1638 | 敌人 (Enemies) | `Vapos Elite Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1639 | 敌人 (Enemies) | `Vapos Nullifier Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1640 | 敌人 (Enemies) | `Vapos Detron Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1641 | 敌人 (Enemies) | `Vapos Sniper Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1642 | 敌人 (Enemies) | `Vapos Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1643 | 敌人 (Enemies) | `Vapos Anti Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1644 | 敌人 (Enemies) | `Vapos Prod Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1645 | 敌人 (Enemies) | `Vapos Nullifier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1646 | 敌人 (Enemies) | `Vapos Railgun Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1647 | 敌人 (Enemies) | `Vapos Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1648 | 敌人 (Enemies) | `Vapos Bioengineer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1649 | 敌人 (Enemies) | `Vapos Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1650 | 敌人 (Enemies) | `Vapos Shockwave Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1651 | 敌人 (Enemies) | `Vapos Detron Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1652 | 敌人 (Enemies) | `Vapos Sniper Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1653 | 敌人 (Enemies) | `Vapos Oxium Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1654 | 敌人 (Enemies) | `Vapos Fusion Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1655 | 敌人 (Enemies) | `Amalgam Cinder Machinist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1656 | 敌人 (Enemies) | `Amalgam Arca Kucumatz` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1657 | 敌人 (Enemies) | `Amalgam Arca Heqet` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1658 | 敌人 (Enemies) | `Amalgam Phase Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1659 | 敌人 (Enemies) | `Amalgam Swarm Satyr` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1660 | 敌人 (Enemies) | `Vapos Aquila` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1661 | 敌人 (Enemies) | `Taro Ranger Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1662 | 敌人 (Enemies) | `Optio` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1663 | 敌人 (Enemies) | `Taro Zerca` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1664 | 敌人 (Enemies) | `Taro Vambac` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1665 | 敌人 (Enemies) | `Taro Numon` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1666 | 敌人 (Enemies) | `Tarask Bursa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1667 | 敌人 (Enemies) | `Taro Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1668 | 敌人 (Enemies) | `Taro Disc Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1669 | 敌人 (Enemies) | `Taro Elite Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1670 | 敌人 (Enemies) | `Taro Stropha Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1671 | 敌人 (Enemies) | `Taro Nullifier Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1672 | 敌人 (Enemies) | `Axio Nullifier Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1673 | 敌人 (Enemies) | `Vorac Nullifier Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1674 | 敌人 (Enemies) | `Taro Railgun Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1675 | 敌人 (Enemies) | `Taro Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1676 | 敌人 (Enemies) | `Taro Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1677 | 敌人 (Enemies) | `Taro Shockwave Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1678 | 敌人 (Enemies) | `Taro Detron Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1679 | 敌人 (Enemies) | `Taro Pilot` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1680 | 敌人 (Enemies) | `Aurax Actinic` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1681 | 敌人 (Enemies) | `Aurax Vertec` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1682 | 敌人 (Enemies) | `Taro Tech` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1683 | 敌人 (Enemies) | `Aurax Atloc Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1684 | 敌人 (Enemies) | `Aurax Culveri Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1685 | 敌人 (Enemies) | `Aurax Polaris Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1686 | 敌人 (Enemies) | `Aurax Baculus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1687 | 敌人 (Enemies) | `Taro Engineer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1688 | 敌人 (Enemies) | `Orm Zerca` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1689 | 敌人 (Enemies) | `Orm Vambac` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1690 | 敌人 (Enemies) | `Orm Numon` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1691 | 敌人 (Enemies) | `Orm Ranger Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1692 | 敌人 (Enemies) | `Orm Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1693 | 敌人 (Enemies) | `Orm Disc Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1694 | 敌人 (Enemies) | `Orm Elite Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1695 | 敌人 (Enemies) | `Orm Stropha Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1696 | 敌人 (Enemies) | `Orm Nullifier Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1697 | 敌人 (Enemies) | `Orm Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1698 | 敌人 (Enemies) | `Orm Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1699 | 敌人 (Enemies) | `Orm Detron Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1700 | 敌人 (Enemies) | `Orm Pilot` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1701 | 敌人 (Enemies) | `Orm Railgun Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1702 | 敌人 (Enemies) | `Orm Shockwave Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1703 | 敌人 (Enemies) | `Orm Tech` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1704 | 敌人 (Enemies) | `Orm Engineer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1705 | 敌人 (Enemies) | `Taro Secura Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1706 | 敌人 (Enemies) | `Axio Zerca` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1707 | 敌人 (Enemies) | `Axio Vambac` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1708 | 敌人 (Enemies) | `Axio Numon` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1709 | 敌人 (Enemies) | `Axio Ranger Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1710 | 敌人 (Enemies) | `Axio Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1711 | 敌人 (Enemies) | `Axio Disc Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1712 | 敌人 (Enemies) | `Axio Elite Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1713 | 敌人 (Enemies) | `Axio Stropha Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1714 | 敌人 (Enemies) | `Axio Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1715 | 敌人 (Enemies) | `Axio Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1716 | 敌人 (Enemies) | `Axio Detron Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1717 | 敌人 (Enemies) | `Axio Pilot` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1718 | 敌人 (Enemies) | `Axio Railgun Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1719 | 敌人 (Enemies) | `Axio Shockwave Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1720 | 敌人 (Enemies) | `Axio Tech` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1721 | 敌人 (Enemies) | `Axio Engineer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1722 | 敌人 (Enemies) | `Vorac Zerca` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1723 | 敌人 (Enemies) | `Vorac Vambac` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1724 | 敌人 (Enemies) | `Vorac Numon` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1725 | 敌人 (Enemies) | `Vorac Ranger Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1726 | 敌人 (Enemies) | `Vorac Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1727 | 敌人 (Enemies) | `Vorac Disc Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1728 | 敌人 (Enemies) | `Vorac Elite Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1729 | 敌人 (Enemies) | `Vorac Stropha Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1730 | 敌人 (Enemies) | `Vorac Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1731 | 敌人 (Enemies) | `Vorac Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1732 | 敌人 (Enemies) | `Vorac Detron Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1733 | 敌人 (Enemies) | `Vorac Pilot` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1734 | 敌人 (Enemies) | `Vorac Railgun Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1735 | 敌人 (Enemies) | `Vorac Shockwave Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1736 | 敌人 (Enemies) | `Vorac Tech` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1737 | 敌人 (Enemies) | `Vorac Engineer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1738 | 敌人 (Enemies) | `Demolisher Bonewidow` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1739 | 敌人 (Enemies) | `Demolisher Voidrig` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1740 | 敌人 (Enemies) | `Tamm` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1741 | 敌人 (Enemies) | `Tusk Thumper Doma` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1742 | 敌人 (Enemies) | `Tusk Thumper Bull` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1743 | 敌人 (Enemies) | `Tusk Thumper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1744 | 敌人 (Enemies) | `Leaping Thrasher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1745 | 敌人 (Enemies) | `Zealot Proselytizer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1746 | 敌人 (Enemies) | `Zealot Herald` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1747 | 敌人 (Enemies) | `Zealot Baptizer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1748 | 敌人 (Enemies) | `Juno Sapper Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1749 | 敌人 (Enemies) | `Brachiolyst Disperser` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1750 | 敌人 (Enemies) | `Ved Xol` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1751 | 敌人 (Enemies) | `Nako Xol` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1752 | 敌人 (Enemies) | `Pelna Cade` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1753 | 敌人 (Enemies) | `Lockjaw & Sol` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1754 | 敌人 (Enemies) | `Jad Teran` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1755 | 敌人 (Enemies) | `Azoth` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1756 | 敌人 (Enemies) | `Raptor Rx` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1757 | 敌人 (Enemies) | `Auditor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1758 | 敌人 (Enemies) | `Jen Dro` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1759 | 敌人 (Enemies) | `Derim Zahn` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1760 | 敌人 (Enemies) | `M-W.A.M.` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1761 | 敌人 (Enemies) | `Tia Mayn` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1762 | 敌人 (Enemies) | `Armis Ulta` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1763 | 敌人 (Enemies) | `Dru Pesfor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1764 | 敌人 (Enemies) | `Rana Del` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1765 | 敌人 (Enemies) | `002-Er` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1766 | 敌人 (Enemies) | `Machinist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1767 | 敌人 (Enemies) | `Carrion Charger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1768 | 敌人 (Enemies) | `Arbitration Shield Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1769 | 敌人 (Enemies) | `Corrupted Drahk Master` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1770 | 敌人 (Enemies) | `Corrupted Drahk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1771 | 敌人 (Enemies) | `Corrupted Power Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1772 | 敌人 (Enemies) | `Derivator Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1773 | 敌人 (Enemies) | `Demolisher Devourer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1774 | 敌人 (Enemies) | `Demolisher Expired` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1775 | 敌人 (Enemies) | `Demolisher Boiler` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1776 | 敌人 (Enemies) | `Demolisher Machinist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1777 | 敌人 (Enemies) | `Demolisher Bailiff` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1778 | 敌人 (Enemies) | `Demolisher Hyena` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1779 | 敌人 (Enemies) | `Demolisher Thrasher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1780 | 敌人 (Enemies) | `Demolisher Juggernaut` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1781 | 敌人 (Enemies) | `Demolisher Anti Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1782 | 敌人 (Enemies) | `Demolisher Heavy Gunner` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1783 | 敌人 (Enemies) | `Demolisher Nox` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1784 | 敌人 (Enemies) | `Demolisher Charger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1785 | 敌人 (Enemies) | `Demolisher Bursa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1786 | 敌人 (Enemies) | `Demolisher Kuva Guardian` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1787 | 敌人 (Enemies) | `Tusk Elite Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1788 | 敌人 (Enemies) | `Tusk Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1789 | 敌人 (Enemies) | `Tusk Napalm` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1790 | 敌人 (Enemies) | `Tusk Heavy Gunner` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1791 | 敌人 (Enemies) | `Tusk Bombard` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1792 | 敌人 (Enemies) | `Tusk Reaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1793 | 敌人 (Enemies) | `Tusk Hellion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1794 | 敌人 (Enemies) | `Tusk Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1795 | 敌人 (Enemies) | `Tusk Shield Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1796 | 敌人 (Enemies) | `Tusk Trooper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1797 | 敌人 (Enemies) | `Tusk Seeker` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1798 | 敌人 (Enemies) | `Tusk Roller` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1799 | 敌人 (Enemies) | `Tusk Flameblade` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1800 | 敌人 (Enemies) | `Tusk Butcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1801 | 敌人 (Enemies) | `Tusk Shield Dargyn` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1802 | 敌人 (Enemies) | `Tusk Dargyn` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1803 | 敌人 (Enemies) | `Tusk Ballista` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1804 | 敌人 (Enemies) | `Tusk Mortar Bombard` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1805 | 敌人 (Enemies) | `Tusk Predator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1806 | 敌人 (Enemies) | `Dargyn Pilot` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1807 | 敌人 (Enemies) | `Plains Commander` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1808 | 敌人 (Enemies) | `Aerial Commander` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1809 | 敌人 (Enemies) | `Tusk Command Dargyn` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1810 | 敌人 (Enemies) | `Recon Commander` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1811 | 敌人 (Enemies) | `Elite Shield Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1812 | 敌人 (Enemies) | `Erra` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1813 | 敌人 (Enemies) | `Knave Specter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1814 | 敌人 (Enemies) | `Feyarch Specter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1815 | 敌人 (Enemies) | `Orphid Specter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1816 | 敌人 (Enemies) | `Orphid Husks` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1817 | 敌人 (Enemies) | `Kuva Hyekka` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1818 | 敌人 (Enemies) | `Kuva Trokarian` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1819 | 敌人 (Enemies) | `Ancient Protector` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1820 | 敌人 (Enemies) | `Undying Flyer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1821 | 敌人 (Enemies) | `Nightwatch Reaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1822 | 敌人 (Enemies) | `Kuva Bailiff` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1823 | 敌人 (Enemies) | `Kuva Larvling` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1824 | 敌人 (Enemies) | `Ratel` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1825 | 敌人 (Enemies) | `Minima Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1826 | 敌人 (Enemies) | `Nightwatch Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1827 | 敌人 (Enemies) | `Ember Specter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1828 | 敌人 (Enemies) | `Aerolyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1829 | 敌人 (Enemies) | `Brachiolyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1830 | 敌人 (Enemies) | `Summulyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1831 | 敌人 (Enemies) | `Tyro Conculyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1832 | 敌人 (Enemies) | `Ortholyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1833 | 敌人 (Enemies) | `Symbilyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1834 | 敌人 (Enemies) | `Juno Fog Comba` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1835 | 敌人 (Enemies) | `Juno Sap Comba` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1836 | 敌人 (Enemies) | `Juno Nul Comba` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1837 | 敌人 (Enemies) | `Juno Slo Comba` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1838 | 敌人 (Enemies) | `Juno Elite Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1839 | 敌人 (Enemies) | `Juno Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1840 | 敌人 (Enemies) | `Juno Nullifier Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1841 | 敌人 (Enemies) | `Juno Sniper Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1842 | 敌人 (Enemies) | `Juno Tech` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1843 | 敌人 (Enemies) | `Juno Malleus Machinist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1844 | 敌人 (Enemies) | `Juno Dera Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1845 | 敌人 (Enemies) | `Juno Disc Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1846 | 敌人 (Enemies) | `Juno Geminex Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1847 | 敌人 (Enemies) | `Juno Glaxion Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1848 | 敌人 (Enemies) | `Juno Jactus Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1849 | 敌人 (Enemies) | `Juno Oxium Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1850 | 敌人 (Enemies) | `Juno Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1851 | 敌人 (Enemies) | `Test Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1852 | 敌人 (Enemies) | `Terra Jackal` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1853 | 敌人 (Enemies) | `Eidolon Vomvalyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1854 | 敌人 (Enemies) | `Zealoid Prelate` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1855 | 敌人 (Enemies) | `Saturn Six Fugitive` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1856 | 敌人 (Enemies) | `Wolf Of Saturn Six` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1857 | 敌人 (Enemies) | `Void Angel` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1858 | 敌人 (Enemies) | `Ravenous Void Angel` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1859 | 敌人 (Enemies) | `Guardsman` | 资料原样英文 | 上游官方资料库中文版原样保留英文 (source: en_as_is:wfcd_worldstate:languages:/lotus/types/game/library/targets/research7target) |
| 1860 | 敌人 (Enemies) | `Muzureh Entrati Coffer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1861 | 敌人 (Enemies) | `Thalmin Entrati Coffer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1862 | 敌人 (Enemies) | `Elementa Arcocanid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1863 | 敌人 (Enemies) | `Elementa Culverin` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1864 | 敌人 (Enemies) | `Shuffling Fragment` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1865 | 敌人 (Enemies) | `Lumbering Fragment` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1866 | 敌人 (Enemies) | `Mocking Whisper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1867 | 敌人 (Enemies) | `Scathing Whisper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1868 | 敌人 (Enemies) | `Rupturing Fragment` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1869 | 敌人 (Enemies) | `The Anatomizer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1870 | 敌人 (Enemies) | `Rogue Bonewidow` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1871 | 敌人 (Enemies) | `Rogue Arcocanid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1872 | 敌人 (Enemies) | `Rogue Culverin` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1873 | 敌人 (Enemies) | `Rogue Voidrig` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1874 | 敌人 (Enemies) | `The Fragmented Suzerain` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1875 | 敌人 (Enemies) | `The Hollow Vein` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1876 | 敌人 (Enemies) | `The Severed Warden` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1877 | 敌人 (Enemies) | `Hurling Fragment` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1878 | 敌人 (Enemies) | `Infested Oni` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1879 | 敌人 (Enemies) | `Arcane Boiler` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1880 | 敌人 (Enemies) | `Nauseous Void Shade` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1881 | 敌人 (Enemies) | `Void Shade` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1882 | 敌人 (Enemies) | `Alad V` | 资料原样英文 | 上游官方资料库中文版原样保留英文 (source: en_as_is:wfcd_worldstate:sortieData:bosses:SORTIE_BOSS_ALAD) |
| 1883 | 敌人 (Enemies) | `Attack Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1884 | 敌人 (Enemies) | `Ambulas` | 资料原样英文 | 上游官方资料库中文版原样保留英文 (source: en_as_is:wfcd_worldstate:sortieData:bosses:SORTIE_BOSS_AMBULAS) |
| 1885 | 敌人 (Enemies) | `Remech Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1886 | 敌人 (Enemies) | `Mutalist Osprey Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1887 | 敌人 (Enemies) | `Nox` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1888 | 敌人 (Enemies) | `Drover Bursa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1889 | 敌人 (Enemies) | `Datalyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1890 | 敌人 (Enemies) | `Nemes` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1891 | 敌人 (Enemies) | `Corvette` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1892 | 敌人 (Enemies) | `Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1893 | 敌人 (Enemies) | `Quanta Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1894 | 敌人 (Enemies) | `Penta Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1895 | 敌人 (Enemies) | `Frigate` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1896 | 敌人 (Enemies) | `Uncommon Corpus Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1897 | 敌人 (Enemies) | `Lynx` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1898 | 敌人 (Enemies) | `Gox` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1899 | 敌人 (Enemies) | `Cannon Battery` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1900 | 敌人 (Enemies) | `Locust Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1901 | 敌人 (Enemies) | `Corrupted Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1902 | 敌人 (Enemies) | `Corrupted Heavy Gunner` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1903 | 敌人 (Enemies) | `Corrupted Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1904 | 敌人 (Enemies) | `Corrupted Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1905 | 敌人 (Enemies) | `Corpus Power Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1906 | 敌人 (Enemies) | `Corpus Tech` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1907 | 敌人 (Enemies) | `Sapping Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1908 | 敌人 (Enemies) | `Isolator Bursa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1909 | 敌人 (Enemies) | `Hemocyte` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1910 | 敌人 (Enemies) | `Elite Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1911 | 敌人 (Enemies) | `Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1912 | 敌人 (Enemies) | `Elite Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1913 | 敌人 (Enemies) | `Kavat` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1914 | 敌人 (Enemies) | `Kuva Elite Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1915 | 敌人 (Enemies) | `Kuva Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1916 | 敌人 (Enemies) | `Kuva Drahk Master` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1917 | 敌人 (Enemies) | `Kuva Napalm` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1918 | 敌人 (Enemies) | `Kuva Heavy Gunner` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1919 | 敌人 (Enemies) | `Kuva Bombard` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1920 | 敌人 (Enemies) | `Kuva Hyekka Master` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1921 | 敌人 (Enemies) | `Kuva Scorch` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1922 | 敌人 (Enemies) | `Kuva Hellion Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1923 | 敌人 (Enemies) | `Kuva Hellion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1924 | 敌人 (Enemies) | `Kuva Drahk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1925 | 敌人 (Enemies) | `Kuva Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1926 | 敌人 (Enemies) | `Kuva Shield Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1927 | 敌人 (Enemies) | `Kuva Trooper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1928 | 敌人 (Enemies) | `Kuva Seeker` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1929 | 敌人 (Enemies) | `Kuva Roller` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1930 | 敌人 (Enemies) | `Kuva Flameblade` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1931 | 敌人 (Enemies) | `Kuva Butcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1932 | 敌人 (Enemies) | `Kuva Powerclaw` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1933 | 敌人 (Enemies) | `Kuva Ballista` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1934 | 敌人 (Enemies) | `Kuva Power Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1935 | 敌人 (Enemies) | `Kuva Scorpion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1936 | 敌人 (Enemies) | `Draga` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1937 | 敌人 (Enemies) | `Fusion Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1938 | 敌人 (Enemies) | `Ghoul Devourer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1939 | 敌人 (Enemies) | `Ghoul Auger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1940 | 敌人 (Enemies) | `Ghoul Auger Alpha` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1941 | 敌人 (Enemies) | `Ghoul Expired` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1942 | 敌人 (Enemies) | `Ghoul Rictus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1943 | 敌人 (Enemies) | `Ghoul Rictus Alpha` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1944 | 敌人 (Enemies) | `Lephantis` | 资料原样英文 | 上游官方资料库中文版原样保留英文 (source: en_as_is:wfcd_worldstate:sortieData:bosses:SORTIE_BOSS_LEPHANTIS) |
| 1945 | 敌人 (Enemies) | `Infested Corpus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1946 | 敌人 (Enemies) | `Ancient Infested` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1947 | 敌人 (Enemies) | `Infested Grineer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1948 | 敌人 (Enemies) | `Artificer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1949 | 敌人 (Enemies) | `Carabus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1950 | 敌人 (Enemies) | `Drahk Master` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1951 | 敌人 (Enemies) | `Arid Butcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1952 | 敌人 (Enemies) | `Frontier Butcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1953 | 敌人 (Enemies) | `Napalm` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1954 | 敌人 (Enemies) | `Heavy Gunner` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1955 | 敌人 (Enemies) | `Arid Heavy Gunner` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1956 | 敌人 (Enemies) | `Bombard` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1957 | 敌人 (Enemies) | `Hyekka Master` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1958 | 敌人 (Enemies) | `Frontier Bailiff` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1959 | 敌人 (Enemies) | `Bailiff` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1960 | 敌人 (Enemies) | `Hyekka` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1961 | 敌人 (Enemies) | `Ogma` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1962 | 敌人 (Enemies) | `Bailiff Defector` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1963 | 敌人 (Enemies) | `Elite Arid Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1964 | 敌人 (Enemies) | `Elite Frontier Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1965 | 敌人 (Enemies) | `Arid Eviscerator` | 资料原样英文 | 上游官方资料库中文版原样保留英文 (source: en_as_is:wfcd_worldstate:languages:/lotus/types/game/library/targets/research3target) |
| 1966 | 敌人 (Enemies) | `Frontier Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1967 | 敌人 (Enemies) | `Scorch` | 资料原样英文 | 上游官方资料库中文版原样保留英文 (source: en_as_is:wfcd_worldstate:languages:/lotus/storeitems/upgrades/mods/pistol/dualstat/fireeventpistolmod) |
| 1968 | 敌人 (Enemies) | `Kuva Dargyn` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1969 | 敌人 (Enemies) | `Frontier Heavy Gunner` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1970 | 敌人 (Enemies) | `Hellion Power Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1971 | 敌人 (Enemies) | `Arid Hellion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1972 | 敌人 (Enemies) | `Frontier Hellion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1973 | 敌人 (Enemies) | `Sprag` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1974 | 敌人 (Enemies) | `Hellion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1975 | 敌人 (Enemies) | `Ven'Kra Tel` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1976 | 敌人 (Enemies) | `Drahk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1977 | 敌人 (Enemies) | `Lancer` | 资料原样英文 | 上游官方资料库中文版原样保留英文 (source: en_as_is:wfcd_worldstate:languages:/lotus/types/game/library/targets/research1target) |
| 1978 | 敌人 (Enemies) | `Shield Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1979 | 敌人 (Enemies) | `Trooper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1980 | 敌人 (Enemies) | `Lancer Dreg` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1981 | 敌人 (Enemies) | `Commander` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1982 | 敌人 (Enemies) | `Common Grineer Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1983 | 敌人 (Enemies) | `Uncommon Grineer Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1984 | 敌人 (Enemies) | `Manic Bombard` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1985 | 敌人 (Enemies) | `Arid Seeker` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1986 | 敌人 (Enemies) | `Frontier Seeker` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1987 | 敌人 (Enemies) | `Zeplen` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1988 | 敌人 (Enemies) | `Shield-Hellion Dargyn` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1989 | 敌人 (Enemies) | `Hellion Dargyn` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1990 | 敌人 (Enemies) | `Seeker` | 资料原样英文 | 上游官方资料库中文版原样保留英文 (source: en_as_is:wfcd_worldstate:languages:/lotus/storeitems/upgrades/mods/pistol/beginner/weaponpuncturedepthmodbeginner) |
| 1991 | 敌人 (Enemies) | `Frontier Regulator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1992 | 敌人 (Enemies) | `Regulator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1993 | 敌人 (Enemies) | `Arid Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1994 | 敌人 (Enemies) | `Frontier Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1995 | 敌人 (Enemies) | `Roller` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1996 | 敌人 (Enemies) | `Roller Sentry` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1997 | 敌人 (Enemies) | `Kuva Guardian` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1998 | 敌人 (Enemies) | `Flameblade` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 1999 | 敌人 (Enemies) | `Butcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2000 | 敌人 (Enemies) | `Powerfist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2001 | 敌人 (Enemies) | `Shield Dargyn` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2002 | 敌人 (Enemies) | `Arid Trooper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2003 | 敌人 (Enemies) | `Frontier Trooper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2004 | 敌人 (Enemies) | `Dargyn` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2005 | 敌人 (Enemies) | `Ballista` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2006 | 敌人 (Enemies) | `Dreg` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2007 | 敌人 (Enemies) | `Temporal Dreg` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2008 | 敌人 (Enemies) | `Grineer Power Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2009 | 敌人 (Enemies) | `Hunhow` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2010 | 敌人 (Enemies) | `Hyena Th` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2011 | 敌人 (Enemies) | `Hyena Ng` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2012 | 敌人 (Enemies) | `Hyena Pb` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2013 | 敌人 (Enemies) | `Hyena Ln2` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2014 | 敌人 (Enemies) | `Brood Mother` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2015 | 敌人 (Enemies) | `Ancient Disruptor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2016 | 敌人 (Enemies) | `Ancient Healer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2017 | 敌人 (Enemies) | `Boiler` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2018 | 敌人 (Enemies) | `Venin Mutalist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2019 | 敌人 (Enemies) | `Nauseous Crawler` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2020 | 敌人 (Enemies) | `Lobber Crawler` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2021 | 敌人 (Enemies) | `Leaper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2022 | 敌人 (Enemies) | `Electric Crawler` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2023 | 敌人 (Enemies) | `Crawler` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2024 | 敌人 (Enemies) | `Charger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2025 | 敌人 (Enemies) | `Infested Mesa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2026 | 敌人 (Enemies) | `Tar Mutalist Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2027 | 敌人 (Enemies) | `Swarm Mutalist Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2028 | 敌人 (Enemies) | `Toxic Crawler` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2029 | 敌人 (Enemies) | `Attack Mutalist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2030 | 敌人 (Enemies) | `Mutalist Lightning Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2031 | 敌人 (Enemies) | `Mutalist Toxic Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2032 | 敌人 (Enemies) | `Mutalist Cannon Battery` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2033 | 敌人 (Enemies) | `Volatile Runner` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2034 | 敌人 (Enemies) | `Toxic Ancient` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2035 | 敌人 (Enemies) | `Darek Draga` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2036 | 敌人 (Enemies) | `J3 Jordas Golem` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2037 | 敌人 (Enemies) | `Juggernaut Behemoth` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2038 | 敌人 (Enemies) | `Juggernaut` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2039 | 敌人 (Enemies) | `Jack O'Naut` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2040 | 敌人 (Enemies) | `Jordas Golem` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2041 | 敌人 (Enemies) | `Kela De Thaym` | 资料原样英文 | 上游官方资料库中文版原样保留英文 (source: en_as_is:wfcd_worldstate:sortieData:bosses:SORTIE_BOSS_KELA) |
| 2042 | 敌人 (Enemies) | `Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2043 | 敌人 (Enemies) | `Anti Moa` | 资料原样英文 | 上游官方资料库中文版原样保留英文 (source: en_as_is:wfcd_worldstate:languages:/lotus/types/game/library/targets/research2target) |
| 2044 | 敌人 (Enemies) | `Leech Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2045 | 敌人 (Enemies) | `Lt Lech Kril` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2046 | 敌人 (Enemies) | `Scorpion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2047 | 敌人 (Enemies) | `Grineer Manic` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2048 | 敌人 (Enemies) | `Prod Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2049 | 敌人 (Enemies) | `Mine Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2050 | 敌人 (Enemies) | `Nul Comba` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2051 | 敌人 (Enemies) | `Nul Scrambus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2052 | 敌人 (Enemies) | `Sap Comba` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2053 | 敌人 (Enemies) | `Sap Scrambus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2054 | 敌人 (Enemies) | `Slo Comba` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2055 | 敌人 (Enemies) | `Slo Scrambus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2056 | 敌人 (Enemies) | `Fog Comba` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2057 | 敌人 (Enemies) | `Fog Scrambus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2058 | 敌人 (Enemies) | `Nullifier Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2059 | 敌人 (Enemies) | `Corrupted Butcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2060 | 敌人 (Enemies) | `Corrupted Bombard` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2061 | 敌人 (Enemies) | `Orokin Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2062 | 敌人 (Enemies) | `Orokin Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2063 | 敌人 (Enemies) | `Corrupted Nullifier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2064 | 敌人 (Enemies) | `Phorid` | 资料原样英文 | 上游官方资料库中文版原样保留英文 (source: en_as_is:wfcd_worldstate:sortieData:bosses:SORTIE_BOSS_PHORID) |
| 2065 | 敌人 (Enemies) | `Denial Bursa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2066 | 敌人 (Enemies) | `Courier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2067 | 敌人 (Enemies) | `Turret` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2068 | 敌人 (Enemies) | `Railgun Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2069 | 敌人 (Enemies) | `Raptor Mt` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2070 | 敌人 (Enemies) | `Raptor Rv` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2071 | 敌人 (Enemies) | `Raptor Ns` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2072 | 敌人 (Enemies) | `Rare Corpus Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2073 | 敌人 (Enemies) | `Forgotten Grineer Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2074 | 敌人 (Enemies) | `Rare Grineer Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2075 | 敌人 (Enemies) | `Rare Orokin Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2076 | 敌人 (Enemies) | `Crewman` | 资料原样英文 | 上游官方资料库中文版原样保留英文 (source: en_as_is:wfcd_worldstate:languages:/lotus/types/game/library/targets/research5target) |
| 2077 | 敌人 (Enemies) | `Kuva Jester` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2078 | 敌人 (Enemies) | `Scavenger Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2079 | 敌人 (Enemies) | `Drekar Butcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2080 | 敌人 (Enemies) | `Drekar Elite Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2081 | 敌人 (Enemies) | `Drekar Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2082 | 敌人 (Enemies) | `Drekar Heavy Gunner` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2083 | 敌人 (Enemies) | `Drekar Scorpion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2084 | 敌人 (Enemies) | `Drekar Ballista` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2085 | 敌人 (Enemies) | `Drekar Seeker` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2086 | 敌人 (Enemies) | `Drekar Hellion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2087 | 敌人 (Enemies) | `Drekar Manic` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2088 | 敌人 (Enemies) | `Drekar Manic Bombard` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2089 | 敌人 (Enemies) | `Drekar Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2090 | 敌人 (Enemies) | `Drekar Trooper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2091 | 敌人 (Enemies) | `Sensor Regulator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2092 | 敌人 (Enemies) | `Orokin Spectator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2093 | 敌人 (Enemies) | `Conculyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2094 | 敌人 (Enemies) | `Battalyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2095 | 敌人 (Enemies) | `Decaying Conculyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2096 | 敌人 (Enemies) | `Decaying Battalyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2097 | 敌人 (Enemies) | `Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2098 | 敌人 (Enemies) | `Shock Draga` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2099 | 敌人 (Enemies) | `Shockwave Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2100 | 敌人 (Enemies) | `Detron Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2101 | 敌人 (Enemies) | `Sniper Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2102 | 敌人 (Enemies) | `Shadow Stalker` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2103 | 敌人 (Enemies) | `Latcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2104 | 敌人 (Enemies) | `Oxium Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2105 | 敌人 (Enemies) | `Tenno Specter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2106 | 敌人 (Enemies) | `Mutalist Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2107 | 敌人 (Enemies) | `Tyl Regor` | 资料原样英文 | 上游官方资料库中文版原样保留英文 (source: en_as_is:wfcd_worldstate:sortieData:bosses:SORTIE_BOSS_TYL) |
| 2108 | 敌人 (Enemies) | `Reinforced Corpus Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2109 | 敌人 (Enemies) | `Reinforced Grineer Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2110 | 敌人 (Enemies) | `Reinforced Orokin Storage Container` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2111 | 敌人 (Enemies) | `Vay Hek Terra Frame` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2112 | 敌人 (Enemies) | `Rathuum Broadcaster` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2113 | 敌人 (Enemies) | `Corpus Warden` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2114 | 敌人 (Enemies) | `Corrupted Warden` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2115 | 敌人 (Enemies) | `Grineer Warden` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2116 | 敌人 (Enemies) | `Sikula` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2117 | 敌人 (Enemies) | `Deimos Therid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2118 | 敌人 (Enemies) | `Deimos Leaping Thrasher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2119 | 敌人 (Enemies) | `Deimos Carnis` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2120 | 敌人 (Enemies) | `Deimos Carnis Rex` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2121 | 敌人 (Enemies) | `Deimos Jugulus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2122 | 敌人 (Enemies) | `Deimos Jugulus Rex` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2123 | 敌人 (Enemies) | `Deimos Mutalist Osprey Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2124 | 敌人 (Enemies) | `Deimos Saxum Rex` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2125 | 敌人 (Enemies) | `Latrox Une` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2126 | 敌人 (Enemies) | `Deimos Brood Mother` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2127 | 敌人 (Enemies) | `Polyp-Hog Juggernaut` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2128 | 敌人 (Enemies) | `Lancer Survivor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2129 | 敌人 (Enemies) | `Trooper Survivor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2130 | 敌人 (Enemies) | `Deimos Ancient Healer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2131 | 敌人 (Enemies) | `Deimos Venin Mutalist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2132 | 敌人 (Enemies) | `Deimos Saxum` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2133 | 敌人 (Enemies) | `Deimos Undying Flyer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2134 | 敌人 (Enemies) | `Deimos Tendril Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2135 | 敌人 (Enemies) | `Deimos Juggernaut` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2136 | 敌人 (Enemies) | `Deimos Leaper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2137 | 敌人 (Enemies) | `Deimos Runner` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2138 | 敌人 (Enemies) | `Garv` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2139 | 敌人 (Enemies) | `Deimos Swarm Mutalist Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2140 | 敌人 (Enemies) | `Deimos Charger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2141 | 敌人 (Enemies) | `Basal Diploid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2142 | 敌人 (Enemies) | `Basal Diploid Rex` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2143 | 敌人 (Enemies) | `Feral Diploid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2144 | 敌人 (Enemies) | `Feral Diploid Rex` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2145 | 敌人 (Enemies) | `The Unseeing Herald` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2146 | 敌人 (Enemies) | `Janus Captain Vor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2147 | 敌人 (Enemies) | `Jarka Lar` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2148 | 敌人 (Enemies) | `Jade Mockery` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2149 | 敌人 (Enemies) | `Elite Bladeswarm Basilisk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2150 | 敌人 (Enemies) | `Ryoku` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2151 | 敌人 (Enemies) | `Bladeswarm Crewship` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2152 | 敌人 (Enemies) | `Bladeswarm Power Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2153 | 敌人 (Enemies) | `Bladeswarm Scrambus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2154 | 敌人 (Enemies) | `Bladeswarm Bailiff` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2155 | 敌人 (Enemies) | `Bladeswarm Outrider` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2156 | 敌人 (Enemies) | `Bladeswarm Cannon Battery` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2157 | 敌人 (Enemies) | `Bladeswarm Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2158 | 敌人 (Enemies) | `Bladeswarm Ramsled` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2159 | 敌人 (Enemies) | `Bladeswarm Basilisk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2160 | 敌人 (Enemies) | `Bladeswarm Derivator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2161 | 敌人 (Enemies) | `Bladeswarm Roller Sentry` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2162 | 敌人 (Enemies) | `Bladeswarm Sniper Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2163 | 敌人 (Enemies) | `Bladeswarm Gox` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2164 | 敌人 (Enemies) | `Bladeswarm Dreg` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2165 | 敌人 (Enemies) | `Ryoku Shadow Clone Master` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2166 | 敌人 (Enemies) | `Bladeswarm Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2167 | 敌人 (Enemies) | `Elite Bladeswarm Weaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2168 | 敌人 (Enemies) | `Bladeswarm Weaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2169 | 敌人 (Enemies) | `Ravenous Golden Maw` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2170 | 敌人 (Enemies) | `Bloodfrenzy Sister` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2171 | 敌人 (Enemies) | `Orm Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2172 | 敌人 (Enemies) | `Elite Bursa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2173 | 敌人 (Enemies) | `Corpus Mining Turret` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2174 | 敌人 (Enemies) | `Orm Nemes` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2175 | 敌人 (Enemies) | `Comet Shredder Captain` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2176 | 敌人 (Enemies) | `Exo Carabus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2177 | 敌人 (Enemies) | `Corpus Cargo Ship` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2178 | 敌人 (Enemies) | `Mawbound Director` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2179 | 敌人 (Enemies) | `Vena` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2180 | 敌人 (Enemies) | `Bloodfrenzy Trencher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2181 | 敌人 (Enemies) | `Bloodfrenzy Expired` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2182 | 敌人 (Enemies) | `Bloodfrenzy Hyena` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2183 | 敌人 (Enemies) | `Bloodfrenzy Orm Gox` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2184 | 敌人 (Enemies) | `Bloodfrenzy Bailiff` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2185 | 敌人 (Enemies) | `Bloodfrenzy Vertec` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2186 | 敌人 (Enemies) | `Bloodfrenzy Powerclaw` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2187 | 敌人 (Enemies) | `Bloodfrenzy Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2188 | 敌人 (Enemies) | `Bloodfrenzy Ramsled` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2189 | 敌人 (Enemies) | `Bloodfrenzy Raptor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2190 | 敌人 (Enemies) | `Bloodfrenzy Machinist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2191 | 敌人 (Enemies) | `Bloodfrenzy Exo Cutter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2192 | 敌人 (Enemies) | `Bloodfrenzy Dreg` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2193 | 敌人 (Enemies) | `Bloodfrenzy Elite Outrider` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2194 | 敌人 (Enemies) | `Bloodfrenzy Harpi` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2195 | 敌人 (Enemies) | `Bloodfrenzy Gox` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2196 | 敌人 (Enemies) | `Bloodfrenzy Optio` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2197 | 敌人 (Enemies) | `Ancient Undying Flyer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2198 | 敌人 (Enemies) | `Ancient Maggot` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2199 | 敌人 (Enemies) | `Ancient Mutalist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2200 | 敌人 (Enemies) | `Asteroid Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2201 | 敌人 (Enemies) | `Narmer Mite` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2202 | 敌人 (Enemies) | `Narmer Butcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2203 | 敌人 (Enemies) | `Narmer Flameblade` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2204 | 敌人 (Enemies) | `Narmer Bombard` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2205 | 敌人 (Enemies) | `Narmer Commander` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2206 | 敌人 (Enemies) | `Narmer Observation Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2207 | 敌人 (Enemies) | `Narmer Power Carrier` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2208 | 敌人 (Enemies) | `Narmer Detron Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2209 | 敌人 (Enemies) | `Narmer Dera Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2210 | 敌人 (Enemies) | `Narmer Disc Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2211 | 敌人 (Enemies) | `Narmer Elite Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2212 | 敌人 (Enemies) | `Narmer Geminex Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2213 | 敌人 (Enemies) | `Narmer Glaxion Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2214 | 敌人 (Enemies) | `Narmer Jailer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2215 | 敌人 (Enemies) | `Narmer Leech Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2216 | 敌人 (Enemies) | `Narmer Mine Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2217 | 敌人 (Enemies) | `Narmer Nullifier Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2218 | 敌人 (Enemies) | `Narmer Nullifier Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2219 | 敌人 (Enemies) | `Narmer Prod Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2220 | 敌人 (Enemies) | `Narmer Detron Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2221 | 敌人 (Enemies) | `Narmer Sapping Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2222 | 敌人 (Enemies) | `Narmer Scavenger Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2223 | 敌人 (Enemies) | `Narmer Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2224 | 敌人 (Enemies) | `Narmer Shockwave Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2225 | 敌人 (Enemies) | `Narmer Sniper Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2226 | 敌人 (Enemies) | `Narmer Sniper Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2227 | 敌人 (Enemies) | `Narmer Oxium Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2228 | 敌人 (Enemies) | `Narmer Corpus Tech` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2229 | 敌人 (Enemies) | `Narmer Tech Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2230 | 敌人 (Enemies) | `Narmer Crewman Warden` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2231 | 敌人 (Enemies) | `Narmer Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2232 | 敌人 (Enemies) | `Narmer Sensolyst Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2233 | 敌人 (Enemies) | `Narmer Demolisher Expired` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2234 | 敌人 (Enemies) | `Narmer Demolisher Bailiff` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2235 | 敌人 (Enemies) | `Narmer Demolisher Gunner` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2236 | 敌人 (Enemies) | `Narmer Elite Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2237 | 敌人 (Enemies) | `Narmer Elite Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2238 | 敌人 (Enemies) | `Narmer Ballista` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2239 | 敌人 (Enemies) | `Narmer Scorch` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2240 | 敌人 (Enemies) | `Narmer Gunner Warden` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2241 | 敌人 (Enemies) | `Narmer Heavy Gunner` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2242 | 敌人 (Enemies) | `Narmer Napalm` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2243 | 敌人 (Enemies) | `Narmer Hellion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2244 | 敌人 (Enemies) | `Narmer Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2245 | 敌人 (Enemies) | `Narmer Scorpion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2246 | 敌人 (Enemies) | `Narmer Machinist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2247 | 敌人 (Enemies) | `Narmer Seeker` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2248 | 敌人 (Enemies) | `Narmer Powerfist` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2249 | 敌人 (Enemies) | `Narmer Regulator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2250 | 敌人 (Enemies) | `Narmer Shield Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2251 | 敌人 (Enemies) | `Narmer Trooper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2252 | 敌人 (Enemies) | `Narmer Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2253 | 敌人 (Enemies) | `Narmer Tech` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2254 | 敌人 (Enemies) | `Narmer Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2255 | 敌人 (Enemies) | `Narmer Thumper Doma` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2256 | 敌人 (Enemies) | `Narmer Thumper Bull` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2257 | 敌人 (Enemies) | `Narmer Thumper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2258 | 敌人 (Enemies) | `Narmer Coildrive` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2259 | 敌人 (Enemies) | `Typholyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2260 | 敌人 (Enemies) | `Breacher Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2261 | 敌人 (Enemies) | `Striker Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2262 | 敌人 (Enemies) | `Shield Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2263 | 敌人 (Enemies) | `Scrofa Armaments Director` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2264 | 敌人 (Enemies) | `Scrofa Drover Bursa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2265 | 敌人 (Enemies) | `Scrofa Joro Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2266 | 敌人 (Enemies) | `Scrofa Demolition Director` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2267 | 敌人 (Enemies) | `Scrofa Strike Director` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2268 | 敌人 (Enemies) | `Scrofa Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2269 | 敌人 (Enemies) | `Scrofa Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2270 | 敌人 (Enemies) | `Scrofa Attack Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2271 | 敌人 (Enemies) | `Scrofa Obviator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2272 | 敌人 (Enemies) | `Scrofa Provisor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2273 | 敌人 (Enemies) | `Scrofa Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2274 | 敌人 (Enemies) | `Scrofa Elite Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2275 | 敌人 (Enemies) | `Syzygy Attack Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2276 | 敌人 (Enemies) | `Syzygy Light Trencher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2277 | 敌人 (Enemies) | `Syzygy Mite Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2278 | 敌人 (Enemies) | `Syzygy Shockwave Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2279 | 敌人 (Enemies) | `Syzygy Denial Bursa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2280 | 敌人 (Enemies) | `Syzygy Sniper Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2281 | 敌人 (Enemies) | `Syzygy Prod Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2282 | 敌人 (Enemies) | `Scrofa Legionary` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2283 | 敌人 (Enemies) | `Scrofa Research Chief` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2284 | 敌人 (Enemies) | `Scrofa Laser Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2285 | 敌人 (Enemies) | `Scrofa Heavy Trencher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2286 | 敌人 (Enemies) | `Scrofa Light Trencher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2287 | 敌人 (Enemies) | `Scrofa Mine Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2288 | 敌人 (Enemies) | `Scrofa Mite Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2289 | 敌人 (Enemies) | `Scrofa Lythrum Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2290 | 敌人 (Enemies) | `Scrofa Latro Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2291 | 敌人 (Enemies) | `Scrofa Railgun Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2292 | 敌人 (Enemies) | `Scrofa Grenadier Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2293 | 敌人 (Enemies) | `Scrofa Shockwave Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2294 | 敌人 (Enemies) | `Scrofa Plasmor Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2295 | 敌人 (Enemies) | `Scrofa Sniper Ranger` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2296 | 敌人 (Enemies) | `Scrofa Decoy Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2297 | 敌人 (Enemies) | `Scrofa Energy Chief` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2298 | 敌人 (Enemies) | `Pyr Captain` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2299 | 敌人 (Enemies) | `Glacik Commander` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2300 | 敌人 (Enemies) | `Lektro Commander` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2301 | 敌人 (Enemies) | `Blite Captain` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2302 | 敌人 (Enemies) | `Taro Crewship` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2303 | 敌人 (Enemies) | `Elite Taro Basilisk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2304 | 敌人 (Enemies) | `Taro Basilisk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2305 | 敌人 (Enemies) | `Elite Orm Basilisk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2306 | 敌人 (Enemies) | `Orm Basilisk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2307 | 敌人 (Enemies) | `Orm Gox` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2308 | 敌人 (Enemies) | `Elite Orm Harpi` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2309 | 敌人 (Enemies) | `Orm Harpi` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2310 | 敌人 (Enemies) | `Elite Orm Weaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2311 | 敌人 (Enemies) | `Orm Weaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2312 | 敌人 (Enemies) | `Elite Taro Harpi` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2313 | 敌人 (Enemies) | `Taro Harpi` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2314 | 敌人 (Enemies) | `Elite Axio Basilisk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2315 | 敌人 (Enemies) | `Axio Basilisk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2316 | 敌人 (Enemies) | `Axio Gox` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2317 | 敌人 (Enemies) | `Elite Axio Harpi` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2318 | 敌人 (Enemies) | `Axio Harpi` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2319 | 敌人 (Enemies) | `Elite Axio Weaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2320 | 敌人 (Enemies) | `Axio Weaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2321 | 敌人 (Enemies) | `Elite Taro Weaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2322 | 敌人 (Enemies) | `Taro Weaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2323 | 敌人 (Enemies) | `Elite Vorac Basilisk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2324 | 敌人 (Enemies) | `Vorac Basilisk` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2325 | 敌人 (Enemies) | `Vorac Gox` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2326 | 敌人 (Enemies) | `Elite Vorac Harpi` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2327 | 敌人 (Enemies) | `Vorac Harpi` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2328 | 敌人 (Enemies) | `Elite Vorac Weaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2329 | 敌人 (Enemies) | `Vorac Weaver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2330 | 敌人 (Enemies) | `Comet Shard` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2331 | 敌人 (Enemies) | `Corpus Ramsled` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2332 | 敌人 (Enemies) | `Exo Raider` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2333 | 敌人 (Enemies) | `Exo Raider Carver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2334 | 敌人 (Enemies) | `Exo Raider Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2335 | 敌人 (Enemies) | `Kosma Raider` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2336 | 敌人 (Enemies) | `Kosma Raider Carver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2337 | 敌人 (Enemies) | `Gyre Raider` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2338 | 敌人 (Enemies) | `Gyre Raider Carver` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2339 | 敌人 (Enemies) | `Gyre Raider Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2340 | 敌人 (Enemies) | `Kosma Raider Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2341 | 敌人 (Enemies) | `Exo Gokstad Officer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2342 | 敌人 (Enemies) | `Kosma Gokstad Officer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2343 | 敌人 (Enemies) | `Gyre Gokstad Officer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2344 | 敌人 (Enemies) | `Kosma Butcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2345 | 敌人 (Enemies) | `Exo Butcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2346 | 敌人 (Enemies) | `Exo Elite Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2347 | 敌人 (Enemies) | `Exo Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2348 | 敌人 (Enemies) | `Exo Supressor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2349 | 敌人 (Enemies) | `Kosma Elite Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2350 | 敌人 (Enemies) | `Kosma Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2351 | 敌人 (Enemies) | `Gyre Butcher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2352 | 敌人 (Enemies) | `Gyre Elite Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2353 | 敌人 (Enemies) | `Gyre Eviscerator` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2354 | 敌人 (Enemies) | `Gyre Supressor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2355 | 敌人 (Enemies) | `Kosma Supressor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2356 | 敌人 (Enemies) | `Elite Kosma Flak` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2357 | 敌人 (Enemies) | `Kosma Flak` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2358 | 敌人 (Enemies) | `Elite Exo Flak` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2359 | 敌人 (Enemies) | `Exo Flak` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2360 | 敌人 (Enemies) | `Elite Exo Taktis` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2361 | 敌人 (Enemies) | `Exo Taktis` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2362 | 敌人 (Enemies) | `Elite Exo Outrider` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2363 | 敌人 (Enemies) | `Exo Outrider` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2364 | 敌人 (Enemies) | `Elite Exo Cutter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2365 | 敌人 (Enemies) | `Exo Cutter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2366 | 敌人 (Enemies) | `Elite Kosma Taktis` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2367 | 敌人 (Enemies) | `Kosma Taktis` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2368 | 敌人 (Enemies) | `Elite Kosma Outrider` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2369 | 敌人 (Enemies) | `Kosma Outrider` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2370 | 敌人 (Enemies) | `Elite Kosma Cutter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2371 | 敌人 (Enemies) | `Kosma Cutter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2372 | 敌人 (Enemies) | `Elite Gyre Flak` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2373 | 敌人 (Enemies) | `Gyre Flak` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2374 | 敌人 (Enemies) | `Elite Gyre Taktis` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2375 | 敌人 (Enemies) | `Gyre Taktis` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2376 | 敌人 (Enemies) | `Elite Gyre Outrider` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2377 | 敌人 (Enemies) | `Gyre Outrider` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2378 | 敌人 (Enemies) | `Elite Gyre Cutter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2379 | 敌人 (Enemies) | `Gyre Cutter` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2380 | 敌人 (Enemies) | `Kuva Lich Agor Rok (Level 0 - 69)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2381 | 敌人 (Enemies) | `Kuva Lich Agor Rok (Level 70 - 79)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2382 | 敌人 (Enemies) | `Kuva Lich Agor Rok (Level 80 - 100)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2383 | 敌人 (Enemies) | `Exo Gokstad Pilot` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2384 | 敌人 (Enemies) | `Kosma Gokstad Pilot` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2385 | 敌人 (Enemies) | `Gyre Gokstad Pilot` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2386 | 敌人 (Enemies) | `Kosma Ramsled` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2387 | 敌人 (Enemies) | `Exo Roller Sentry` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2388 | 敌人 (Enemies) | `Gyre Roller Sentry` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2389 | 敌人 (Enemies) | `Kosma Roller Sentry` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2390 | 敌人 (Enemies) | `Anu Brachiolyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2391 | 敌人 (Enemies) | `Anu Mantalyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2392 | 敌人 (Enemies) | `Anu Pyrolyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2393 | 敌人 (Enemies) | `Anu Symbilyst` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2394 | 敌人 (Enemies) | `Ionyx` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2395 | 敌人 (Enemies) | `Gyrix` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2396 | 敌人 (Enemies) | `Splintrix` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2397 | 敌人 (Enemies) | `Mimic` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2398 | 敌人 (Enemies) | `Nascent Membroid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2399 | 敌人 (Enemies) | `Mature Membroid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2400 | 敌人 (Enemies) | `Apex Membroid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2401 | 敌人 (Enemies) | `Juvenile Membroid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2402 | 敌人 (Enemies) | `Observation Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2403 | 敌人 (Enemies) | `Coolant Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2404 | 敌人 (Enemies) | `Scyto Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2405 | 敌人 (Enemies) | `Special Duty Coildrive` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2406 | 敌人 (Enemies) | `Thermic Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2407 | 敌人 (Enemies) | `Mite Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2408 | 敌人 (Enemies) | `Terra Ambulas` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2409 | 敌人 (Enemies) | `Terra Manker` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2410 | 敌人 (Enemies) | `Armaments Director` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2411 | 敌人 (Enemies) | `Vivisect Director` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2412 | 敌人 (Enemies) | `Sentient Research Director` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2413 | 敌人 (Enemies) | `Vallis Surveillance Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2414 | 敌人 (Enemies) | `Terra Detron Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2415 | 敌人 (Enemies) | `Terra Attack Drone` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2416 | 敌人 (Enemies) | `Terra Research Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2417 | 敌人 (Enemies) | `Terra Elite Provisor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2418 | 敌人 (Enemies) | `Terra Provisor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2419 | 敌人 (Enemies) | `Terra Elite Overtaker` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2420 | 敌人 (Enemies) | `Terra Overtaker` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2421 | 敌人 (Enemies) | `Terra Jailer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2422 | 敌人 (Enemies) | `Terra Cestra Manker` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2423 | 敌人 (Enemies) | `Terra Raptor Sx` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2424 | 敌人 (Enemies) | `Terra Elite Raptor Sx` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2425 | 敌人 (Enemies) | `Terra Elite Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2426 | 敌人 (Enemies) | `Terra Elite Trencher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2427 | 敌人 (Enemies) | `Icemire Hyena` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2428 | 敌人 (Enemies) | `Rabbleback Hyena` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2429 | 敌人 (Enemies) | `Gyre Hyena` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2430 | 敌人 (Enemies) | `Cinderthresh Hyena` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2431 | 敌人 (Enemies) | `Terra Embattor Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2432 | 敌人 (Enemies) | `Terra Elite Embattor Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2433 | 敌人 (Enemies) | `Terra Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2434 | 敌人 (Enemies) | `Terra Anti Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2435 | 敌人 (Enemies) | `Terra Nullifier Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2436 | 敌人 (Enemies) | `Terra Railgun Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2437 | 敌人 (Enemies) | `Terra Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2438 | 敌人 (Enemies) | `Terra Shield Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2439 | 敌人 (Enemies) | `Terra Shockwave Moa` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2440 | 敌人 (Enemies) | `Terra Trencher` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2441 | 敌人 (Enemies) | `Terra Plasmor Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2442 | 敌人 (Enemies) | `Terra Sniper Crewman` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2443 | 敌人 (Enemies) | `Terra Oxium Osprey` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2444 | 敌人 (Enemies) | `Corpus Trencher Target` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2445 | 敌人 (Enemies) | `Corpus Cestra Target` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2446 | 敌人 (Enemies) | `Corpus Supra Target` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2447 | 敌人 (Enemies) | `Corpus Sniper Target` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2448 | 敌人 (Enemies) | `Coildrive` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2449 | 敌人 (Enemies) | `Kyta Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2450 | 敌人 (Enemies) | `Chroma` | 资料原样英文 | 上游官方资料库中文版原样保留英文 (source: en_as_is:wfcd_worldstate:languages:/lotus/powersuits/dragon/dragon) |
| 2451 | 敌人 (Enemies) | `Anarch Grineer Lancer` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2452 | 敌人 (Enemies) | `Commandeered Ash Prime` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2453 | 敌人 (Enemies) | `Commandeered Caliban Prime` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2454 | 敌人 (Enemies) | `Equisitus Hoard` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2455 | 敌人 (Enemies) | `Commandeered Ember Prime` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2456 | 敌人 (Enemies) | `Commandeered Mesa Prime` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2457 | 敌人 (Enemies) | `Commandeered Protea Prime` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2458 | 敌人 (Enemies) | `Anarch Grineer Trapper` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2459 | 敌人 (Enemies) | `Anarch Arcus Lustratus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2460 | 敌人 (Enemies) | `Anarch Arcus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2461 | 敌人 (Enemies) | `Anarch Libritor` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2462 | 敌人 (Enemies) | `Anarch Capsarii` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2463 | 敌人 (Enemies) | `Anarch Tenebra` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2464 | 敌人 (Enemies) | `Anarch Gladius` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2465 | 敌人 (Enemies) | `Archimedean Itzam` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2466 | 敌人 (Enemies) | `Commandeered Trinity Prime` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2467 | 敌人 (Enemies) | `Commandeered Volt Prime` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2468 | 敌人 (Enemies) | `Narmer Scyto Raknoid` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2469 | 敌人 (Enemies) | `Rogg-417` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2470 | 敌人 (Enemies) | `Thrax Centurion` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2471 | 敌人 (Enemies) | `Thrax Legatus` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2472 | 敌人 (Enemies) | `Primm` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2473 | 敌人 (Enemies) | `Verd-Ie` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2474 | 敌人 (Enemies) | `Molted Cask` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2475 | 敌人 (Enemies) | `Ancient Molted Cask` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2476 | 敌人 (Enemies) | `Exploiter Orb` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2477 | 敌人 (Enemies) | `Orb Vallis - Temple of Profit Enemies` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2478 | 敌人 (Enemies) | `Orb Vallis - Enrichment Labs Enemies` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2479 | 敌人 (Enemies) | `Orb Vallis - Spaceport Enemies` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2480 | 敌人 (Enemies) | `Sister Of Parvos (Ascension Mode Steel Path)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2481 | 敌人 (Enemies) | `Sister Of Parvos (Ascension Mode)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2482 | 敌人 (Enemies) | `Necramech (Tier 1)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2483 | 敌人 (Enemies) | `Necramech (Tier 2)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2484 | 敌人 (Enemies) | `Necramech (Tier 3)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2485 | 赏金标题 (Bounties) | `Level 30 - 40 Arcana Isolation Vault` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2486 | 赏金标题 (Bounties) | `Level 40 - 50 Arcana Isolation Vault` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2487 | 赏金标题 (Bounties) | `Level 50 - 60 Arcana Isolation Vault` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2488 | 赏金标题 (Bounties) | `Level  55 - 60 Entrati Lab Bounty` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2489 | 赏金标题 (Bounties) | `Level  65 - 70 Entrati Lab Bounty` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2490 | 赏金标题 (Bounties) | `Level  75 - 80 Entrati Lab Bounty` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2491 | 赏金标题 (Bounties) | `Level  95 - 100 Entrati Lab Bounty` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2492 | 赏金标题 (Bounties) | `Level  115 - 120 Entrati Lab Bounty` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2493 | 赏金标题 (Bounties) | `Level  55 - 60 WF1999 Bounty` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2494 | 赏金标题 (Bounties) | `Level  65 - 70 WF1999 Bounty` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2495 | 赏金标题 (Bounties) | `Level  75 - 80 WF1999 Bounty` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2496 | 赏金标题 (Bounties) | `Level  85 - 90 WF1999 Bounty` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2497 | 赏金标题 (Bounties) | `Level  95 - 100 WF1999 Bounty` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2498 | 赏金标题 (Bounties) | `Level  105 - 110 WF1999 Bounty` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2499 | 赏金标题 (Bounties) | `Level  115 - 120 WF1999 Bounty` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2500 | 特殊来源 (Transient Sources) | `Arbitrations` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2501 | 特殊来源 (Transient Sources) | `Derelict Vault` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2502 | 特殊来源 (Transient Sources) | `Phorid Assassination` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2503 | 特殊来源 (Transient Sources) | `Nightmare Mode Rewards` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2504 | 特殊来源 (Transient Sources) | `Fomorian Sabotage` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2505 | 特殊来源 (Transient Sources) | `Kuva Siphon` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2506 | 特殊来源 (Transient Sources) | `Kuva Flood` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2507 | 特殊来源 (Transient Sources) | `Hallowed Flame Mission Caches` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2508 | 特殊来源 (Transient Sources) | `Hallowed Flame Endurance Caches` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2509 | 特殊来源 (Transient Sources) | `Granum Void` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2510 | 特殊来源 (Transient Sources) | `Extended Granum Void` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2511 | 特殊来源 (Transient Sources) | `Nightmare Granum Void` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2512 | 特殊来源 (Transient Sources) | `Void Storm (Earth)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2513 | 特殊来源 (Transient Sources) | `Void Storm (Venus)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2514 | 特殊来源 (Transient Sources) | `Void Storm (Saturn)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2515 | 特殊来源 (Transient Sources) | `Void Storm (Neptune)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2516 | 特殊来源 (Transient Sources) | `Void Storm (Pluto)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2517 | 特殊来源 (Transient Sources) | `Void Storm (Veil Proxima)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2518 | 特殊来源 (Transient Sources) | `Duviri Full Experience` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2519 | 特殊来源 (Transient Sources) | `Duviri Circuit` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2520 | 特殊来源 (Transient Sources) | `Duviri Static Undercroft Portal` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2521 | 特殊来源 (Transient Sources) | `Duviri Static Undercroft Portal (Steel Path)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2522 | 特殊来源 (Transient Sources) | `Deep Archimedea Silver Rewards` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2523 | 特殊来源 (Transient Sources) | `Deep Archimedea Gold Rewards` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2524 | 特殊来源 (Transient Sources) | `Deep Archimedea Legendary Rewards` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2525 | 特殊来源 (Transient Sources) | `Faceoff: Single Squad` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2526 | 特殊来源 (Transient Sources) | `Faceoff: Single Squad (Steel Path)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2527 | 特殊来源 (Transient Sources) | `Faceoff: Squad VS Squad` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2528 | 特殊来源 (Transient Sources) | `Faceoff: Squad VS Squad (Winner)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2529 | 特殊来源 (Transient Sources) | `Faceoff: Squad VS Squad (Steel Path)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2530 | 特殊来源 (Transient Sources) | `Faceoff: Squad VS Squad (Steel Path Winner)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2531 | 特殊来源 (Transient Sources) | `Temporal Archimedea Silver Rewards` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2532 | 特殊来源 (Transient Sources) | `Temporal Archimedea Gold Rewards` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2533 | 特殊来源 (Transient Sources) | `Temporal Archimedea Legendary Rewards` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2534 | 特殊来源 (Transient Sources) | `Duviri Murmur Invasion Rewards` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2535 | 特殊来源 (Transient Sources) | `Duviri Murmur Invasion Rewards (Steel Path)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2536 | 特殊来源 (Transient Sources) | `Nokko: Critter Liberation Rewards` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2537 | 特殊来源 (Transient Sources) | `Nokko: Corporate Restructuring Rewards` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2538 | 特殊来源 (Transient Sources) | `Nokko: Weed The Gardens Rewards` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2539 | 特殊来源 (Transient Sources) | `Nokko: Critter Liberation Rewards (Steel Path)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2540 | 特殊来源 (Transient Sources) | `Nokko: Corporate Restructuring (Steel Path)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2541 | 特殊来源 (Transient Sources) | `Nokko: Weed The Gardens Rewards (Steel Path)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2542 | 特殊来源 (Transient Sources) | `The Descendia: Infernum 20 Triple Arcane Rewards` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2543 | 特殊来源 (Transient Sources) | `The Descendia: Infernum 6 and 13 Arcane Rewards (Steel Path)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2544 | 特殊来源 (Transient Sources) | `The Descendia: Common Rewards (Steel Path)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2545 | 特殊来源 (Transient Sources) | `The Descendia: Rare Rewards (Steel Path)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2546 | 特殊来源 (Transient Sources) | `The Descendia: Uncommon Rewards (Steel Path)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2547 | 特殊来源 (Transient Sources) | `The Descendia: Steel Essence Rewards (Steel Path)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2548 | 特殊来源 (Transient Sources) | `The Descendia: Infernum 20 Triple Arcane Rewards (Steel Path)` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2549 | 特殊来源 (Transient Sources) | `The Descendia: Roathe` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2550 | 特殊来源 (Transient Sources) | `The Icebind: Crested Frozen Chests` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
| 2551 | 特殊来源 (Transient Sources) | `The Icebind: Frozen Chests` | 无中文资料保留英文 | 本地原始资料库中未检索到官方中文译名，按规范严格保留英文 (source: en_fallback) |
