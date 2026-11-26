#!/usr/bin/env node
/**
 * scripts/check-invariants-with-mutated-prices.mjs
 * 
 * 变异价格副本不变量复核脚本：
 * 1. 将当前仓库复制到 os.tmpdir() 临时目录；
 * 2. 在临时目录中变异 data/prices.json（删除约 60 条价格、卖价×1.3+2、买价×0.8、sellCount 改为 1-5）；
 * 3. 透传 --raw 参数重新执行 build-data.mjs 重建临时数据；
 * 4. 运行 node --test 验证全量 62 个测试用例在变异价格环境下全部通过（验证断言皆为不变量，无实时行情依赖）；
 * 5. 彻底清理临时目录，退出码反映测试结果；
 * 6. 严禁改写真实仓库内的任何文件。
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// 解析 CLI 参数
const args = process.argv.slice(2);
let rawPath = process.env.WF_RAW_DIR || '/workspace/wf-relic-cn-raw';
const rawIndex = args.indexOf('--raw');
if (rawIndex !== -1 && args[rawIndex + 1]) {
  rawPath = path.resolve(args[rawIndex + 1]);
}

const pristinePricesPath = path.join(ROOT_DIR, 'data', 'prices.json');
const pristinePricesStatBefore = fs.statSync(pristinePricesPath);

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wf-mutated-prices-'));
console.log(`[check-invariants] 创建临时测试目录: ${tempDir}`);

let exitCode = 0;

try {
  // 1. 复制仓库必要目录与文件至临时目录
  const itemsToCopy = ['data', 'js', 'scripts', 'test', 'fixtures', 'config', 'package.json', 'README.md', 'index.html', 'css'];
  for (const item of itemsToCopy) {
    const src = path.join(ROOT_DIR, item);
    const dest = path.join(tempDir, item);
    if (fs.existsSync(src)) {
      fs.cpSync(src, dest, { recursive: true });
    }
  }

  // 软链接 node_modules（避免巨量小文件拷贝）
  const nodeModulesSrc = path.join(ROOT_DIR, 'node_modules');
  const nodeModulesDest = path.join(tempDir, 'node_modules');
  if (fs.existsSync(nodeModulesSrc)) {
    fs.symlinkSync(nodeModulesSrc, nodeModulesDest, 'junction');
  }

  // 2. 变异临时 prices.json 价格
  const tempPricesPath = path.join(tempDir, 'data', 'prices.json');
  assertFileExists(tempPricesPath);
  const pricesData = JSON.parse(fs.readFileSync(tempPricesPath, 'utf8'));

  const items = pricesData.items || {};
  const keys = Object.keys(items);
  const deleteCount = Math.min(60, keys.length);

  // 随机/均匀挑选约 60 个条目删除
  for (let i = 0; i < deleteCount; i++) {
    delete items[keys[i]];
  }

  // 其余卖价×1.3+2、买价×0.8、sellCount 改成 1–5
  for (let i = deleteCount; i < keys.length; i++) {
    const entry = items[keys[i]];
    if (entry && typeof entry === 'object') {
      if (typeof entry.sellMin === 'number') {
        entry.sellMin = Number((entry.sellMin * 1.3 + 2).toFixed(2));
      }
      if (typeof entry.buyMax === 'number') {
        entry.buyMax = Number((entry.buyMax * 0.8).toFixed(2));
      }
      entry.sellCount = (i % 5) + 1; // 1-5
      if (typeof entry.buyCount === 'number') {
        entry.buyCount = i % 4; // 0-3
      }
    }
  }

  fs.writeFileSync(tempPricesPath, JSON.stringify(pricesData, null, 2), 'utf8');
  console.log(`[check-invariants] 已成功在临时副本中变异 prices.json（删除了 ${deleteCount} 个条目，其余价格已缩放偏移）`);

  // 3. 在临时目录中重新执行 build-data.mjs
  const buildArgs = ['scripts/build-data.mjs'];
  if (fs.existsSync(rawPath)) {
    buildArgs.push('--raw', rawPath);
  }
  console.log(`[check-invariants] 执行 build-data.mjs 重建临时数据...`);
  execFileSync(process.execPath, buildArgs, {
    cwd: tempDir,
    stdio: 'inherit'
  });

  // 4. 在临时目录中执行 node --test
  console.log(`[check-invariants] 执行 node --test 验证全部不变量测试套件...`);
  execFileSync(process.execPath, ['--test'], {
    cwd: tempDir,
    stdio: 'inherit'
  });

  console.log('\n==================================================');
  console.log('✓ 变异价格不变量验证全部通过！');
  console.log('==================================================\n');
} catch (err) {
  console.error('\n==================================================');
  console.error('✗ 变异价格不变量验证失败:', err.message);
  console.error('==================================================\n');
  exitCode = err.status || 1;
} finally {
  // 5. 清理临时目录
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log(`[check-invariants] 临时测试目录已清理完毕: ${tempDir}`);
  } catch (cleanErr) {
    console.warn(`[check-invariants] 清理临时目录失败:`, cleanErr.message);
  }

  // 6. 确认真实 data/prices.json 绝未受写操作
  const pristinePricesStatAfter = fs.statSync(pristinePricesPath);
  if (pristinePricesStatBefore.mtimeMs !== pristinePricesStatAfter.mtimeMs ||
      pristinePricesStatBefore.size !== pristinePricesStatAfter.size) {
    console.error('CRITICAL ERROR: 真实 data/prices.json 发生了修改！');
    process.exit(2);
  }
}

process.exit(exitCode);

function assertFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`文件不存在: ${filePath}`);
  }
}
