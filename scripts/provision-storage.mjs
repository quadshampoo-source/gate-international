// Provision all public Supabase Storage buckets this app uses.
// Idempotent: skips buckets that already exist.
// Usage: node scripts/provision-storage.mjs
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

const BUCKETS = [
  { name: 'team-photos', public: true, fileSizeLimit: 5 * 1024 * 1024, allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'] },
  { name: 'project-photos', public: true, fileSizeLimit: 10 * 1024 * 1024, allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'] },
];

const { data: existing } = await supabase.storage.listBuckets();
const have = new Set((existing || []).map((b) => b.name));

for (const cfg of BUCKETS) {
  if (have.has(cfg.name)) {
    console.log(`✓ ${cfg.name} — already exists`);
    continue;
  }
  const { error } = await supabase.storage.createBucket(cfg.name, {
    public: cfg.public,
    fileSizeLimit: cfg.fileSizeLimit,
    allowedMimeTypes: cfg.allowedMimeTypes,
  });
  if (error) console.error(`✗ ${cfg.name} — ${error.message}`);
  else console.log(`✓ ${cfg.name} — created`);
}
