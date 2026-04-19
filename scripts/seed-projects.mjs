// Seed the Supabase `projects` table from the static PROJECTS list.
// Usage: node scripts/seed-projects.mjs
// Needs: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local

import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

// Load .env.local manually (this script runs outside Next.js).
const envText = readFileSync(new URL('../.env.local', import.meta.url), 'utf-8');
envText.split('\n').forEach((line) => {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
});

const { PROJECTS } = await import('../src/lib/projects.js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const rows = PROJECTS.map((p, i) => ({
  id: p.id,
  sort_index: i,
  name: p.name,
  name_ar: p.nameAr ?? null,
  name_zh: p.nameZh ?? null,
  district: p.district,
  district_ar: p.districtAr ?? null,
  district_zh: p.districtZh ?? null,
  sub_district: p.subDistrict ?? null,
  developer: p.developer ?? null,
  architect: p.architect ?? null,
  price_usd: p.priceUsd ?? null,
  bedrooms: p.bedrooms ?? null,
  area: p.area ?? null,
  typology: p.typology ?? null,
  market: p.market ?? null,
  view: p.view ?? null,
  delivery: p.delivery ?? null,
  status: p.status ?? null,
  category: p.category ?? null,
  metro: !!p.metro,
  img: p.img ?? '',
  vimeo_id: p.vimeoId ?? '',
  total_units: p.totalUnits ?? null,
  blocks: p.blocks ?? null,
  land_area: p.landArea ?? null,
  unit_types: p.unitTypes ?? null,
  payment_plan: p.paymentPlan ?? null,
  price_table: p.priceTable ?? null,
  distances: p.distances ?? null,
  reasons: p.reasons ?? null,
  china_score: p.chinaScore ?? null,
  arab_score: p.arabScore ?? null,
}));

console.log(`Upserting ${rows.length} projects…`);
const { error, count } = await supabase.from('projects').upsert(rows, { onConflict: 'id', count: 'exact' });
if (error) {
  console.error('Seed failed:', error);
  process.exit(1);
}
console.log(`✓ Upserted ${count ?? rows.length} rows.`);
