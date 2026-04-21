// Backfill bedrooms/bathrooms/property_type/delivery + options for every
// project in public.projects. Deterministic per-id seeds so rerunning the
// same script produces the same values.
//
// Usage:
//   node scripts/fill-project-specs.mjs           (dry run — prints plan)
//   node scripts/fill-project-specs.mjs --apply   (writes to Supabase)
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const APPLY = process.argv.includes('--apply');

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

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashSeed(s) {
  let h = 0;
  for (let i = 0; i < String(s).length; i++) h = (h * 31 + String(s).charCodeAt(i)) | 0;
  return h >>> 0;
}

function bracketFor(priceUsd) {
  if (priceUsd < 300_000) return 'a';
  if (priceUsd < 600_000) return 'b';
  if (priceUsd < 1_000_000) return 'c';
  if (priceUsd < 3_000_000) return 'd';
  if (priceUsd < 8_000_000) return 'e';
  return 'f';
}

const BEDROOMS_BY_BRACKET = {
  a: ['Studio', '1'],
  b: ['1', '2'],
  c: ['2', '3'],
  d: ['3', '4'],
  e: ['4', '5'],
  f: ['5', '6+'],
};
const BATHROOMS_BY_BRACKET = {
  a: ['1'],
  b: ['1', '2'],
  c: ['2'],
  d: ['2', '3'],
  e: ['3', '4'],
  f: ['4', '5+'],
};
const BASE_SIZE_BY_BRACKET = { a: 45, b: 75, c: 105, d: 150, e: 220, f: 300 };

const LADDER_APT = ['Studio', '1+1', '2+1', '3+1', '3+1 Duplex', '4+1', '4+1 Duplex'];
const LADDER_VILLA = ['3+1', '4+1', '5+1', 'Villa'];
const LADDER_INVEST = ['Studio', '1+1', '2+1', 'Office', 'Shop'];
const LADDER_PENTHOUSE = ['3+1', '4+1', '5+1', 'Penthouse'];

function propertyTypeFor(category, priceUsd, rng) {
  const pick = (a) => a[Math.floor(rng() * a.length)];
  const c = String(category || '').toLowerCase();
  if (c === 'villa') return 'Villa';
  if (c === 'ultra-luxury') return pick(['Penthouse', 'Villa']);
  if (c === 'nature') return pick(['Villa', 'Apartment']);
  if (c === 'boutique' || c === 'premium' || c === 'investment') return 'Apartment';
  if (priceUsd >= 8_000_000) return pick(['Penthouse', 'Villa']);
  return 'Apartment';
}

function ladderFor(propertyType, category) {
  const c = String(category || '').toLowerCase();
  if (propertyType === 'Villa') return LADDER_VILLA;
  if (propertyType === 'Penthouse') return LADDER_PENTHOUSE;
  if (c === 'investment') return LADDER_INVEST;
  return LADDER_APT;
}

function deliveryFor(status, rng) {
  const s = String(status || '').toLowerCase();
  if (s === 'delivered') {
    return { month: null, year: null, status: 'DELIVERED' };
  }
  const yearPool = [2026, 2026, 2027, 2027, 2028];
  return {
    month: 1 + Math.floor(rng() * 12),
    year: yearPool[Math.floor(rng() * yearPool.length)],
    status: 'CONSTRUCTION',
  };
}

function round5(n) { return Math.max(5, Math.round(n / 5) * 5); }
function roundPrice(n) {
  if (n >= 1_000_000) return Math.round(n / 10_000) * 10_000;
  if (n >= 300_000) return Math.round(n / 5_000) * 5_000;
  return Math.round(n / 1_000) * 1_000;
}

function generateOptions({ basePrice, propertyType, category, bracket, rng }) {
  const ladder = ladderFor(propertyType, category);
  const c = String(category || '').toLowerCase();

  let count;
  if (c === 'ultra-luxury' || propertyType === 'Penthouse') count = 2 + Math.floor(rng() * 2);
  else if (c === 'villa' || propertyType === 'Villa') count = 2 + Math.floor(rng() * 2);
  else if (c === 'investment' || c === 'premium') count = 3 + Math.floor(rng() * 3);
  else count = 3 + Math.floor(rng() * 3);
  count = Math.max(2, Math.min(6, Math.min(count, ladder.length)));

  let startIdx;
  switch (bracket) {
    case 'a': startIdx = 0; break;
    case 'b': startIdx = 1; break;
    case 'c': startIdx = 2; break;
    case 'd': startIdx = 2; break;
    case 'e': startIdx = Math.max(0, ladder.length - count); break;
    default: startIdx = Math.max(0, ladder.length - count);
  }
  startIdx = Math.max(0, Math.min(startIdx, ladder.length - count));

  let size = BASE_SIZE_BY_BRACKET[bracket];
  let price = basePrice;
  const out = [];
  for (let i = 0; i < count; i++) {
    const type = ladder[startIdx + i];
    if (i > 0) {
      size += 25 + Math.floor(rng() * 16);
      const bumpPct = 30 + Math.floor(rng() * 21);
      price = price * (1 + bumpPct / 100);
    }
    out.push({
      type,
      size: String(round5(size)),
      price: String(roundPrice(price)),
    });
  }
  return out;
}

const { data: rows, error } = await supabase
  .from('projects')
  .select('id, name, district, price_usd, category, status')
  .order('sort_index', { ascending: true });

if (error) { console.error(error); process.exit(1); }

console.log(`Loaded ${rows.length} projects. Mode: ${APPLY ? 'APPLY' : 'DRY RUN'}\n`);

let ok = 0, fail = 0;
for (const p of rows) {
  const rng = mulberry32(hashSeed(p.id));
  const price = Number(p.price_usd) || 500_000;
  const bracket = bracketFor(price);
  const bedrooms = BEDROOMS_BY_BRACKET[bracket][Math.floor(rng() * BEDROOMS_BY_BRACKET[bracket].length)];
  const bathrooms = BATHROOMS_BY_BRACKET[bracket][Math.floor(rng() * BATHROOMS_BY_BRACKET[bracket].length)];
  const propertyType = propertyTypeFor(p.category, price, rng);
  const delivery = deliveryFor(p.status, rng);
  const options = generateOptions({ basePrice: price, propertyType, category: p.category, bracket, rng });

  const update = {
    bedrooms,
    bathrooms,
    property_type: propertyType,
    delivery_month: delivery.month,
    delivery_year: delivery.year,
    delivery_status: delivery.status,
    options,
  };

  const line = `${p.id.padEnd(36)} $${String(price).padStart(9)} ${bracket} | ${bedrooms.padEnd(6)} / ${bathrooms.padEnd(4)} | ${propertyType.padEnd(10)} | ${delivery.status === 'DELIVERED' ? 'DELIVERED     ' : `${String(delivery.month).padStart(2, '0')}/${delivery.year}`} | ${options.length} opts`;

  if (!APPLY) {
    console.log(line);
    ok++;
    continue;
  }

  const { error: uerr } = await supabase.from('projects').update(update).eq('id', p.id);
  if (uerr) {
    console.log(`FAIL ${p.id}: ${uerr.message}`);
    fail++;
  } else {
    console.log(line);
    ok++;
  }
}

console.log(`\n${APPLY ? 'Applied' : 'Planned'}: ${ok}  Failed: ${fail}`);
if (!APPLY) console.log('\nRerun with --apply to write to Supabase.');
