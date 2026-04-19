// Replaces every project whose `img` still points at source.unsplash.com
// (deprecated endpoint) with a working, unique image URL.
//
// Strategy:
//   1. First assign direct `images.unsplash.com/photo-<id>` URLs from a
//      large curated pool of photos, themed by region, skipping any ID
//      already in use on another project.
//   2. When the curated pool is exhausted, fall back to
//      `https://picsum.photos/seed/<project-id>/1600/1000` — these always
//      resolve and remain unique (seeded by project id).
//
// Usage: node scripts/replace-broken-images.mjs

import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const envText = readFileSync(new URL('../.env.local', import.meta.url), 'utf-8');
envText.split('\n').forEach((line) => {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// Extra curated Unsplash photo IDs beyond the ~30 already used in existing data.
// These are kept in broad visual buckets.
const EXTRA = {
  istanbul_skyscraper: [
    '1519922639192-e73293ca430e', '1541394919145-5dd2d1b4f5b5',
    '1578662996442-48f60103fc96', '1558981806-ec527fa84c39',
    '1541890091-30d2fa93a8bb',    '1580587771525-78b9dba3b914',
    '1519817650390-64a93db51149', '1559563458-527698bf5295',
    '1541432599828-a92bedc09f1f', '1565351635-bd39b45ad9e1',
  ],
  bosphorus_waterfront: [
    '1606047220748-1a7a63bca7be', '1608648562-ddd5d8eb2ddc',
    '1571939228382-b2f2b585ce15', '1566073771259-6a8506099945',
    '1606047196583-08a7e1e1ae06', '1594212699903-ec8a3eca50f5',
  ],
  galata_historic: [
    '1542622321-5f8d7e9c21ea', '1523731407965-2430cd12f5e4',
    '1541963463532-d68292c34b19',
  ],
  modern_residential: [
    '1522708323590-d24dbb6b0267', '1540518614846-7eded433c457',
    '1501183638710-841dd1904471', '1600585153490-76fb20a32601',
  ],
  forest_green: [
    '1540541338287-41700207dee6', '1534237710431-e2fc698436d0',
    '1572976236091-f2775a62d10e', '1516455590571-18256e5bb9ff',
  ],
  aegean_coastal: [
    '1504387432042-8aca549e4729', '1530521954074-e64f6810b32d',
    '1519046904884-53103b34b206', '1459535653751-d571815e906b',
    '1564078516393-cf04bd966897', '1573823517018-a9e14ef9a4fa',
    '1507525428034-b723cf961d3e', '1540541338287-41700207dee6',
    '1580587771525-78b9dba3b914',
  ],
};

function themeFor(p) {
  const d = (p.district || '').toLowerCase();
  const sd = (p.sub_district || '').toLowerCase();
  if (d === 'bodrum') return 'aegean_coastal';
  if (d === 'bursa') {
    if (sd === 'mudanya') return 'aegean_coastal';
    return 'modern_residential';
  }
  if (d === 'göktürk' || (d === 'ataşehir' && /forest|green/i.test(p.view || ''))) {
    return 'forest_green';
  }
  if (d === 'ataşehir') return 'modern_residential';
  if (d === 'güneşli') return 'modern_residential';
  if (d === 'beşiktaş' || d === 'üsküdar') return 'bosphorus_waterfront';
  if (d === 'beyoğlu') {
    const id = p.id || '';
    if (/galata|pera|cihangir|taksim/.test(id + sd)) return 'galata_historic';
    return 'bosphorus_waterfront';
  }
  if (d === 'maslak' || d === 'levent') return 'istanbul_skyscraper';
  if (d === 'kağıthane') return 'modern_residential';
  if (d === 'şişli') return 'modern_residential';
  if (d === 'sariyer') {
    if (/forest|green/i.test(p.view || '')) return 'forest_green';
    return 'istanbul_skyscraper';
  }
  return 'modern_residential';
}

const directUrl = (id) => `https://images.unsplash.com/photo-${id}?w=1600&q=80`;
const picsumUrl = (seed) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/1600/1000`;

async function main() {
  const { data, error } = await supabase
    .from('projects')
    .select('id, district, sub_district, view, img')
    .order('sort_index');
  if (error) { console.error(error); process.exit(1); }

  // Track every direct photo ID already used so we never duplicate.
  const used = new Set();
  for (const p of data) {
    if (!p.img) continue;
    const m = p.img.match(/photo-([0-9]+-[0-9a-f]+)/);
    if (m) used.add(m[1]);
  }

  // Targets: any project currently on source.unsplash.com.
  const targets = data.filter((p) => p.img?.includes('source.unsplash.com'));
  console.log(`${targets.length} projects to replace.`);

  const cursor = {};
  for (const k of Object.keys(EXTRA)) cursor[k] = 0;

  const updates = [];
  for (const p of targets) {
    const theme = themeFor(p);
    const pool = EXTRA[theme] || EXTRA.modern_residential;
    let chosen = null;
    // Try the theme pool first.
    for (let i = 0; i < pool.length; i++) {
      const idx = (cursor[theme] + i) % pool.length;
      const cand = pool[idx];
      if (!used.has(cand)) {
        chosen = directUrl(cand);
        used.add(cand);
        cursor[theme] = idx + 1;
        break;
      }
    }
    // Then any other pool.
    if (!chosen) {
      outer: for (const k of Object.keys(EXTRA)) {
        for (const cand of EXTRA[k]) {
          if (!used.has(cand)) { chosen = directUrl(cand); used.add(cand); break outer; }
        }
      }
    }
    // Last resort: picsum seeded on project id (always unique + always loads).
    if (!chosen) chosen = picsumUrl(p.id);

    updates.push({ id: p.id, img: chosen, theme });
  }

  console.log(`Applying ${updates.length} updates…`);
  let ok = 0;
  for (const u of updates) {
    const { error } = await supabase.from('projects').update({ img: u.img }).eq('id', u.id);
    if (error) console.error(`  ✗ ${u.id}: ${error.message}`);
    else { console.log(`  ✓ ${u.id.padEnd(36)}  [${u.theme}]`); ok++; }
  }
  console.log(`\nDone. ${ok}/${updates.length} updated.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
