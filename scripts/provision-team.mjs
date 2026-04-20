// Provision team infra: verify public.team_members table + create team-photos storage bucket.
// Usage: node scripts/provision-team.mjs
// Prereq: run supabase/migration_team_members.sql in Supabase SQL Editor.
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

// 1. Verify table exists.
const { error: tableErr } = await supabase
  .from('team_members')
  .select('id')
  .limit(1);

if (tableErr) {
  console.error('✗ team_members table missing:', tableErr.message);
  console.error('→ Run supabase/migration_team_members.sql in Supabase SQL Editor first.');
  process.exit(2);
}
console.log('✓ team_members table present');

// 2. Create public storage bucket.
const bucketName = 'team-photos';
const { data: buckets } = await supabase.storage.listBuckets();
const exists = (buckets || []).some((b) => b.name === bucketName);

if (exists) {
  console.log(`✓ storage bucket "${bucketName}" already exists`);
} else {
  const { error } = await supabase.storage.createBucket(bucketName, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024, // 5 MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  });
  if (error) {
    console.error('✗ createBucket failed:', error.message);
    process.exit(1);
  }
  console.log(`✓ created public storage bucket "${bucketName}"`);
}

console.log('\nReady. Next: run `node scripts/seed-team.mjs` to insert placeholder members.');
