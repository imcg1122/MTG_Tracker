// Lexicon freshness check — compares the app's built-in LEXICON against
// Scryfall's live keyword catalogs and reports anything Wizards has printed
// that the app doesn't define yet.
//
// Usage:  npm run lexicon:check
// Output: human-readable report + lexicon-report.json (consumed by CI)
//
// Scryfall catalogs are free, keyless, and update within days of new set
// releases: https://scryfall.com/docs/api/catalogs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = join(root, 'Prod', 'index.html');

const CATALOGS = [
  'https://api.scryfall.com/catalog/keyword-abilities',
  'https://api.scryfall.com/catalog/keyword-actions',
  'https://api.scryfall.com/catalog/ability-words',
];

// Terms we deliberately don't track (un-set jokes, ultra-obscure one-offs).
// Add to this list to silence a report entry permanently.
const IGNORED = new Set(['Aftermath', 'Adamant', 'Gotcha']);

function extractAppKeywords(html) {
  const start = html.indexOf('const LEXICON=[');
  const end = html.indexOf('];', start);
  const block = html.slice(start, end);
  const names = new Set();
  for (const m of block.matchAll(/name:'((?:[^'\\]|\\.)*)'/g)) {
    names.add(m[1].replace(/\\'/g, "'").toLowerCase());
  }
  return names;
}

const appKeywords = extractAppKeywords(readFileSync(indexPath, 'utf8'));
console.log(`App lexicon: ${appKeywords.size} terms\n`);

const missing = [];
for (const url of CATALOGS) {
  const res = await fetch(url, { headers: { 'User-Agent': 'MTGPlaymat-LexiconCheck/1.0 (play-mtg.com)' } });
  if (!res.ok) { console.error(`Fetch failed: ${url} → ${res.status}`); process.exit(1); }
  const { data } = await res.json();
  const catalog = url.split('/').pop();
  for (const term of data) {
    if (!appKeywords.has(term.toLowerCase()) && !IGNORED.has(term)) {
      missing.push({ term, catalog });
    }
  }
  await new Promise(r => setTimeout(r, 150)); // be polite to Scryfall
}

missing.sort((a, b) => a.term.localeCompare(b.term));
writeFileSync(join(root, 'lexicon-report.json'), JSON.stringify({ checkedAt: new Date().toISOString(), missingCount: missing.length, missing }, null, 2));

if (missing.length === 0) {
  console.log('Lexicon is up to date with Scryfall — nothing missing.');
} else {
  console.log(`${missing.length} keywords exist on Scryfall but not in the app lexicon:\n`);
  for (const { term, catalog } of missing) console.log(`  - ${term}  (${catalog})`);
  console.log('\nAdd entries to the LEXICON array in Prod/index.html, or silence them in IGNORED above.');
  console.log('Full details: lexicon-report.json');
}
