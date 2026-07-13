// Bumps the app version in all three required locations in one shot:
//   Prod/index.html  →  navigator.serviceWorker.register('./sw.js?v=XX')
//   Prod/index.html  →  const APP_VERSION='XX'
//   Prod/sw.js       →  const CACHE = 'mtg-playmat-vXX'
//
// Usage:
//   npm run bump          → increments by 1
//   npm run bump 105      → sets an explicit version
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = join(root, 'Prod', 'index.html');
const swPath = join(root, 'Prod', 'sw.js');

let index = readFileSync(indexPath, 'utf8');
let sw = readFileSync(swPath, 'utf8');

const current = index.match(/const APP_VERSION='(\d+)'/);
if (!current) { console.error('Could not find APP_VERSION in index.html'); process.exit(1); }

const next = process.argv[2] ? String(Number(process.argv[2])) : String(Number(current[1]) + 1);
if (!/^\d+$/.test(next)) { console.error(`Invalid version: ${process.argv[2]}`); process.exit(1); }

const before = { app: current[1] };
index = index.replace(/const APP_VERSION='\d+'/, `const APP_VERSION='${next}'`);
index = index.replace(/\.\/sw\.js\?v=\d+/, `./sw.js?v=${next}`);
sw = sw.replace(/const CACHE = 'mtg-playmat-v\d+'/, `const CACHE = 'mtg-playmat-v${next}'`);

// Verify all three landed before writing anything
const ok =
  index.includes(`const APP_VERSION='${next}'`) &&
  index.includes(`./sw.js?v=${next}`) &&
  sw.includes(`mtg-playmat-v${next}`);
if (!ok) { console.error('One or more version patterns not found — nothing written.'); process.exit(1); }

writeFileSync(indexPath, index);
writeFileSync(swPath, sw);
console.log(`Version bumped: v${before.app} → v${next} (APP_VERSION, sw.js?v, CACHE)`);
