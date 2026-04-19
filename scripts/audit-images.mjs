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

const { data, error } = await supabase
  .from('projects')
  .select('id, district, sub_district, img')
  .order('sort_index');
if (error) { console.error(error); process.exit(1); }

const missing = data.filter((p) => !p.img || !p.img.trim());
console.log('TOTAL:', data.length);
console.log('WITH IMAGE:', data.length - missing.length);
console.log('MISSING:', missing.length);
if (missing.length) {
  console.log('\nMissing list:');
  missing.forEach((p) => console.log(`  - ${p.id} (${p.district}${p.sub_district ? '/' + p.sub_district : ''})`));
}

// Uniqueness check
const urls = data.filter((p) => p.img).map((p) => p.img);
const seen = new Map();
for (const u of urls) seen.set(u, (seen.get(u) || 0) + 1);
const dupes = [...seen.entries()].filter(([_, n]) => n > 1);
console.log(`\nUNIQUE URLs: ${seen.size} of ${urls.length}`);
if (dupes.length) {
  console.log('Duplicate URLs:');
  dupes.forEach(([u, n]) => console.log(`  ×${n}  ${u.substring(0, 80)}…`));
}
