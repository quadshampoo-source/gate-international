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

// zorlu-twin kept its original img, but levent-skyline shares the same URL.
// Give levent-skyline a fresh unique image.
const REPLACEMENT =
  'https://source.unsplash.com/1600x1000/?istanbul,modern,skyscraper,night&sig=9001';

const { error } = await supabase
  .from('projects')
  .update({ img: REPLACEMENT })
  .eq('id', 'levent-skyline');

if (error) { console.error(error); process.exit(1); }
console.log('✓ levent-skyline image updated to a unique URL.');
