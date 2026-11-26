import fs from 'node:fs';
import path from 'node:path';

export const RAW_DIR = process.env.WF_RAW_DIR || '/workspace/wf-relic-cn-raw';

export function hasRawFiles(...relPaths) {
  if (!RAW_DIR || !fs.existsSync(RAW_DIR)) return false;
  for (const relPath of relPaths) {
    const fullPath = path.join(RAW_DIR, relPath);
    if (!fs.existsSync(fullPath)) {
      return false;
    }
  }
  return true;
}
