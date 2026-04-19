// Assigns themed Unsplash placeholder images to projects that have img=''.
//
// Strategy:
//   - For Istanbul districts we know photos of, use curated Unsplash photo IDs.
//   - For everything else (and when the curated pool is exhausted) we fall
//     back to `https://source.unsplash.com/1600x1000/?<keywords>&sig=<N>`
//     which resolves to a random Unsplash photo matching the keywords and
//     gives us URL-level uniqueness via `sig`.
//
// Usage: node scripts/apply-placeholder-images.mjs

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

// Curated, verified Unsplash photo IDs by theme. These render reliably.
const CURATED = {
  istanbul_skyscraper: [
    '1524231757912-21f4fe3a7200', '1545324418-cc1a3fa10c00',
    '1600607687939-ce8a6c25118c', '1600210492493-0946911123ea',
    '1545241047-6083a3684587',    '1554995207-c18c203602cb',
    '1502672023488-70e25813eb80', '1600210491892-03d54c0aaf87',
  ],
  bosphorus_waterfront: [
    '1613977257363-707ba9348227', '1613490493576-7fde63acd811',
    '1600596542815-ffad4c1539a9', '1600585154084-4e5fe7c39198',
    '1567496898669-ee935f5f647a', '1605276374104-dee2a0ed3cd6',
    '1605114412043-7baeebed25b9', '1576941089067-2de3c901e126',
    '1600585154340-be6161a56a0c', '1615529182904-14819c35db37',
    '1600607687920-4e2a09cf159d',
  ],
  galata_historic: [
    '1600566753190-17f0baa2a6c3', '1600566753086-00f18fe6ba68',
    '1600566753376-12c8ab7fb75b', '1600566753051-6057f5bf1f64',
    '1600607687644-c7171b42498f',
  ],
  modern_residential: [
    '1600585154526-990dced4db0d', '1615875605825-5eb9bb5d52ac',
    '1600585154363-67eb9e2e2099', '1556909114-f6e7ad7d3136',
  ],
  forest_green: [
    '1564013799919-ab600027ffc6', '1502005229762-cf1b2da7c5d6',
    '1493809842364-78817add7ffb',
  ],
  aegean_coastal: [
    '1518548419970-58e3b4079ab2',
  ],
};

// Keyword queries for source.unsplash.com fallback, per theme.
const QUERY = {
  istanbul_skyscraper: 'istanbul,modern,skyscraper,night',
  bosphorus_waterfront: 'istanbul,bosphorus,luxury,waterfront',
  galata_historic: 'istanbul,galata,tower,historic',
  modern_residential: 'istanbul,luxury,apartment,city',
  forest_green: 'istanbul,forest,green,residence',
  aegean_coastal: 'bodrum,aegean,luxury,villa',
  aegean_yalikavak: 'bodrum,yalikavak,aegean,villa,luxury',
  aegean_turkbuku: 'turkbuku,bodrum,beach,resort',
  aegean_golkoy: 'bodrum,hillside,villa,sea',
  aegean_turgutreis: 'aegean,coast,sunset,resort',
  aegean_torba: 'bodrum,bay,luxury,beach',
  aegean_misc: 'bodrum,white,villa,mediterranean',
  commercial_district: 'istanbul,business,commercial,district',
  asian_modern: 'istanbul,asian,side,modern,residential',
};

function themeFor(p) {
  const d = (p.district || '').toLowerCase();
  const sd = (p.sub_district || '').toLowerCase();
  if (d === 'bodrum') {
    if (sd === 'yalıkavak') return 'aegean_yalikavak';
    if (sd === 'göltürkbükü') return 'aegean_turkbuku';
    if (sd === 'gölköy') return 'aegean_golkoy';
    if (sd === 'turgutreis') return 'aegean_turgutreis';
    if (sd === 'torba') return 'aegean_torba';
    return 'aegean_misc';
  }
  if (d === 'göktürk') return 'forest_green';
  if (d === 'sariyer' && /forest|green/i.test(p.view || '')) return 'forest_green';
  if (d === 'ataşehir') return 'asian_modern';
  if (d === 'güneşli') return 'commercial_district';
  if (d === 'beşiktaş' || d === 'üsküdar') return 'bosphorus_waterfront';
  if (d === 'beyoğlu') {
    const id = p.id || '';
    if (/galata|pera|cihangir|taksim/.test(id + sd)) return 'galata_historic';
    return 'bosphorus_waterfront';
  }
  if (d === 'maslak' || d === 'levent') return 'istanbul_skyscraper';
  if (d === 'kağıthane') return 'modern_residential';
  if (d === 'şişli') return 'modern_residential';
  if (d === 'sariyer') return 'istanbul_skyscraper';
  return 'modern_residential';
}

const directUrl = (id) => `https://images.unsplash.com/photo-${id}?w=1600&q=80`;
const fallbackUrl = (theme, sig) =>
  `https://source.unsplash.com/1600x1000/?${encodeURIComponent(QUERY[theme] || 'luxury,apartment')}&sig=${sig}`;

async function main() {
  const { data, error } = await supabase
    .from('projects')
    .select('id, district, sub_district, view, img')
    .order('sort_index');
  if (error) { console.error(error); process.exit(1); }

  const missing = data.filter((p) => !p.img || !p.img.trim());
  console.log(`${missing.length} projects missing images.`);

  // Track used curated IDs so each photo is used at most once across the whole
  // portfolio (including the 30 projects that already had images).
  const used = new Set();
  for (const p of data) {
    if (!p.img) continue;
    const m = p.img.match(/photo-([0-9]+-[0-9a-f]+)/);
    if (m) used.add(m[1]);
  }

  const curatedCursor = {};
  for (const k of Object.keys(CURATED)) curatedCursor[k] = 0;

  const updates = [];
  let sigCounter = 1000;
  for (const p of missing) {
    const theme = themeFor(p);
    let chosen = null;

    // 1. Try the curated pool matching the theme.
    const curatedKey = Object.keys(CURATED).find((k) => theme.startsWith(k.split('_')[0])) || (CURATED[theme] ? theme : null);
    const curatedPool = curatedKey ? CURATED[curatedKey] : null;
    if (curatedPool) {
      for (let i = 0; i < curatedPool.length; i++) {
        const idx = (curatedCursor[curatedKey] + i) % curatedPool.length;
        const cand = curatedPool[idx];
        if (!used.has(cand)) {
          chosen = directUrl(cand);
          used.add(cand);
          curatedCursor[curatedKey] = idx + 1;
          break;
        }
      }
    }

    // 2. Fall back to source.unsplash.com with a unique sig (keyword-matched).
    if (!chosen) {
      sigCounter += 1;
      chosen = fallbackUrl(theme, sigCounter);
    }

    updates.push({ id: p.id, img: chosen, theme });
  }

  console.log(`Applying ${updates.length} updates…`);
  let ok = 0, fail = 0;
  for (const u of updates) {
    const { error } = await supabase.from('projects').update({ img: u.img }).eq('id', u.id);
    if (error) { console.error(`  ✗ ${u.id}: ${error.message}`); fail++; }
    else { console.log(`  ✓ ${u.id.padEnd(36)}  [${u.theme}]`); ok++; }
  }
  console.log(`\nDone. ${ok} updated, ${fail} failed.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
