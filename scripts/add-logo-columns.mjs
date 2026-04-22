// Add logo_url + logo_alt to public.site_settings so the admin can manage
// the site logo. Supabase JS can't run DDL — prints the SQL to paste into
// the SQL Editor, then verifies the columns exist.
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

const SQL = `alter table public.site_settings
  add column if not exists logo_url text,
  add column if not exists logo_alt text;`;

console.log('Run this SQL in the Supabase SQL Editor:\n');
console.log(SQL);
console.log('\n— Verifying columns —\n');

const { data, error } = await supabase
  .from('site_settings')
  .select('id, active_theme, logo_url, logo_alt')
  .eq('id', 1)
  .single();

if (error) {
  console.log('logo columns: NOT PRESENT YET —', error.message);
} else {
  console.log('logo columns: PRESENT ✓');
  console.log('current row:', data);
}
