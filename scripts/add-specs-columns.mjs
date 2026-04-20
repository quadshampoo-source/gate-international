// Add property-specs columns to public.projects and migrate bedrooms to TEXT.
// Supabase JS can't run arbitrary DDL — so this script prints the SQL to run
// manually in the Supabase SQL Editor, then verifies presence.
// Usage: node scripts/add-specs-columns.mjs
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
  alter column bedrooms type text using bedrooms::text,
  add column if not exists bathrooms text,
  add column if not exists property_type text,
  add column if not exists delivery_month integer,
  add column if not exists delivery_year integer,
  add column if not exists delivery_status text,
  add column if not exists options jsonb default '[]'::jsonb;`;

console.log('Run the following SQL in Supabase SQL Editor:\n');
console.log(SQL);
console.log('\n— Attempting to verify column presence now —\n');

const { data, error } = await supabase
  .from('projects')
  .select('bedrooms, bathrooms, property_type, delivery_month, delivery_year, delivery_status, options')
  .limit(1);

if (error) {
  console.log('columns: NOT PRESENT YET —', error.message);
} else {
  console.log('columns: PRESENT ✓');
  console.log('sample row:', data[0] || '(table empty for these cols)');
}
