// Add RU/FA/FR name + district columns to public.projects.
// Supabase JS can't run arbitrary DDL — so we print the SQL to run manually
// AND verify presence afterwards if you rerun this script.
// Usage: node scripts/add-language-columns.mjs
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

const SQL = `alter table public.projects
  add column if not exists name_ru text,
  add column if not exists name_fa text,
  add column if not exists name_fr text,
  add column if not exists district_ru text,
  add column if not exists district_fa text,
  add column if not exists district_fr text;`;

console.log('Run the following SQL in Supabase SQL Editor:\n');
console.log(SQL);
console.log('\n— Attempting to verify column presence now —\n');

const { data, error } = await supabase.from('projects').select('name_ru, name_fa, name_fr, district_ru, district_fa, district_fr').limit(1);
if (error) {
  console.log('columns: NOT PRESENT YET —', error.message);
} else {
  console.log('columns: PRESENT ✓');
  console.log('sample row:', data[0] || '(table empty for these cols)');
}
