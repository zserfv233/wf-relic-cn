import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RAW_DIR, hasRawFiles } from '../scripts/lib/raw-dir.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const CONFIG_DIR = path.join(ROOT_DIR, 'config');

describe('哨兵 Carrier Prime 部件与敌方 Carrier 汉化断言 (Carrier Prime Parts)', () => {
  const relicsPath = path.join(DATA_DIR, 'relics.json');
  const zhMapPath = path.join(CONFIG_DIR, 'zh-map.json');

  assert.ok(fs.existsSync(relicsPath), 'data/relics.json 必须存在');
  assert.ok(fs.existsSync(zhMapPath), 'config/zh-map.json 必须存在');

  const relicsData = JSON.parse(fs.readFileSync(relicsPath, 'utf8')).relics;
  const zhMap = JSON.parse(fs.readFileSync(zhMapPath, 'utf8'));

  it('Carrier Prime 系统/外壳/头部 与 DE ExportResources_zh 一致，enemies.Carrier 仍为“母舰”且仅绑定 SwarmShipAvatar', (t) => {
    if (!hasRawFiles('de-export/ExportResources_zh.json')) {
      t.skip('缺少原始资料 (de-export/ExportResources_zh.json)，跳过 Carrier Prime 部件官方对比测试');
      return;
    }

    const exportResourcesPath = path.join(RAW_DIR, 'de-export/ExportResources_zh.json');
    const rawContent = JSON.parse(fs.readFileSync(exportResourcesPath, 'utf8').replace(/[\r\n\t]/g, ' '));
    const items = rawContent.ExportResources || rawContent;

    const deItemsMap = new Map();
    for (const item of items) {
      if (item.uniqueName) {
        deItemsMap.set(item.uniqueName, item);
      }
    }

    // 从 data/relics.json 提取 Carrier Prime 部件中文名
    const dataParts = {};
    for (const r of relicsData) {
      for (const rew of r.rewards || []) {
        if (rew.name && rew.name.startsWith('Carrier Prime ')) {
          dataParts[rew.name] = rew.zhName;
        }
      }
    }

    // 断言 PrimeCarrierSystems/Carapace/Cerebrum 的 name 分别等于 data 里 Carrier Prime Systems/Carapace/Cerebrum 的中文名
    const deSystems = deItemsMap.get('/Lotus/Types/Recipes/Weapons/WeaponParts/PrimeCarrierSystems');
    const deCarapace = deItemsMap.get('/Lotus/Types/Recipes/Weapons/WeaponParts/PrimeCarrierCarapace');
    const deCerebrum = deItemsMap.get('/Lotus/Types/Recipes/Weapons/WeaponParts/PrimeCarrierCerebrum');

    assert.ok(deSystems, 'ExportResources_zh 中必须存在 PrimeCarrierSystems');
    assert.ok(deCarapace, 'ExportResources_zh 中必须存在 PrimeCarrierCarapace');
    assert.ok(deCerebrum, 'ExportResources_zh 中必须存在 PrimeCarrierCerebrum');

    assert.strictEqual(
      dataParts['Carrier Prime Systems'],
      deSystems.name,
      'Carrier Prime Systems 中文名必须与 DE ExportResources_zh 一致'
    );
    assert.strictEqual(
      dataParts['Carrier Prime Carapace'],
      deCarapace.name,
      'Carrier Prime Carapace 中文名必须与 DE ExportResources_zh 一致'
    );
    assert.strictEqual(
      dataParts['Carrier Prime Cerebrum'],
      deCerebrum.name,
      'Carrier Prime Cerebrum 中文名必须与 DE ExportResources_zh 一致'
    );

    // 断言 zh-map 里 enemies.Carrier 仍为「母舰」且 uniqueName 只绑定 SwarmShipAvatar
    const carrierEnemy = zhMap.enemies?.['Carrier'];
    assert.ok(carrierEnemy, 'config/zh-map.json enemies 必须包含 Carrier');
    assert.strictEqual(carrierEnemy.nameZh, '母舰', 'enemies.Carrier 必须保留为“母舰”');
    assert.strictEqual(
      carrierEnemy.uniqueName,
      '/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/SwarmShipAvatar',
      'enemies.Carrier 的 uniqueName 必须只绑定 SwarmShipAvatar'
    );
  });
});
