import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const envText = readFileSync(new URL('../.env.local', import.meta.url), 'utf-8');
envText.split('\n').forEach((line) => {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
});

const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const { data } = await s.from('projects').select('id, img');
const counts = { direct: 0, source: 0, picsum: 0, empty: 0, other: 0 };
const picsumList = [];
for (const p of data) {
  if (!p.img) counts.empty++;
  else if (p.img.includes('images.unsplash.com')) counts.direct++;
  else if (p.img.includes('source.unsplash.com')) counts.source++;
  else if (p.img.includes('picsum.photos')) { counts.picsum++; picsumList.push(p.id); }
  else counts.other++;
}
console.log('Breakdown:', counts);
if (picsumList.length) {
  console.log('\nPicsum fallback projects:');
  picsumList.forEach((id) => console.log('  - ' + id));
}
