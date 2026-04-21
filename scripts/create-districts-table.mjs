// Create the `districts` table and seed it from distinct project districts.
// Supabase JS can't run CREATE TABLE DDL directly — print the SQL, then
// verify presence by selecting from it afterwards.
// Usage: node scripts/create-districts-table.mjs
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

const SQL = `create table if not exists public.districts (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  name_ar text,
  name_zh text,
  slug text not null unique,
  city text default 'Istanbul',
  image text,
  sort_order integer default 0,
  is_visible boolean default true,
  created_at timestamptz default now()
);

insert into public.districts (name, slug, city, sort_order)
select distinct
  district,
  lower(
    regexp_replace(
      translate(district,
        'şŞıİöÖüÜçÇğĞ',
        'sSiIoOuUcCgG'
      ),
      '[^a-z0-9]+', '-', 'g'
    )
  ),
  case
    when district = 'Bodrum' then 'Bodrum'
    when district = 'Bursa' then 'Bursa'
    else 'Istanbul'
  end,
  row_number() over (order by district)
from public.projects
where district is not null and district <> ''
on conflict (name) do nothing;`;

console.log('Run this SQL in the Supabase SQL Editor:\n');
console.log(SQL);
console.log('\n— Verifying table presence —\n');

const { data, error } = await supabase
  .from('districts')
  .select('name, slug, city, is_visible, image')
  .order('sort_order', { ascending: true });

if (error) {
  console.log('districts table: NOT PRESENT YET —', error.message);
} else {
  console.log(`districts table: PRESENT ✓  (${data.length} rows)`);
  data.slice(0, 10).forEach((d) => console.log(`  ${d.name.padEnd(20)} ${d.slug.padEnd(20)} ${d.city.padEnd(10)} ${d.image ? 'has img' : 'no img'}`));
  if (data.length > 10) console.log(`  …and ${data.length - 10} more`);
}
