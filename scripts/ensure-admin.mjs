// Ensure quadshampoo@gmail.com has role='admin' in public.profiles.
// Usage: node scripts/ensure-admin.mjs
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const envText = readFileSync(new URL('../.env.local', import.meta.url), 'utf-8');
envText.split('\n').forEach((line) => {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
});

const TARGET_EMAIL = 'quadshampoo@gmail.com';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// 1. Find the auth user by email.
const { data: usersPage, error: listErr } = await supabase.auth.admin.listUsers({ perPage: 200 });
if (listErr) {
  console.error('listUsers failed:', listErr);
  process.exit(1);
}
const authUser = usersPage.users.find((u) => (u.email || '').toLowerCase() === TARGET_EMAIL);
if (!authUser) {
  console.error(`No auth user found for ${TARGET_EMAIL}`);
  process.exit(1);
}
console.log(`auth.users id: ${authUser.id}`);

// 2. Check profiles row.
const { data: existing, error: selErr } = await supabase
  .from('profiles')
  .select('id, email, role')
  .eq('id', authUser.id)
  .maybeSingle();

if (selErr) {
  console.error('profiles select error:', selErr);
  if (selErr.code === '42P01' || /does not exist/i.test(selErr.message || '')) {
    console.error('→ `public.profiles` table does not exist yet. Run the schema migration first.');
    process.exit(2);
  }
  process.exit(1);
}

console.log('current profile row:', existing);

if (existing && existing.role === 'admin') {
  console.log('✓ Already admin — no change needed.');
  process.exit(0);
}

// 3. Upsert role='admin'.
const { data: updated, error: upErr } = await supabase
  .from('profiles')
  .upsert(
    { id: authUser.id, email: authUser.email, role: 'admin' },
    { onConflict: 'id' }
  )
  .select()
  .single();

if (upErr) {
  console.error('upsert failed:', upErr);
  process.exit(1);
}

console.log('✓ Updated to admin:', updated);
