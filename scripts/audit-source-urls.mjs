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

const { data } = await supabase.from('projects').select('id, name, district, sub_district, img').order('sort_index');
const src = data.filter((p) => p.img?.includes('source.unsplash.com'));
const direct = data.filter((p) => p.img?.includes('images.unsplash.com/photo-'));
console.log('TOTAL:', data.length);
console.log('source.unsplash.com (likely broken):', src.length);
console.log('images.unsplash.com/photo-… (direct):', direct.length);
console.log('\nProjects using source.unsplash.com:');
src.forEach((p) => console.log(`  ${p.id}  —  ${p.name}  [${p.district}${p.sub_district ? '/' + p.sub_district : ''}]`));
