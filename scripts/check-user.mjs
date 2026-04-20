// Check if a given email exists in auth.users and public.profiles.
// Usage: node scripts/check-user.mjs <email>
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const envText = readFileSync(new URL('../.env.local', import.meta.url), 'utf-8');
envText.split('\n').forEach((line) => {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
});

const email = (process.argv[2] || '').toLowerCase().trim();
if (!email) {
  console.error('Usage: node scripts/check-user.mjs <email>');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const { data: page, error: listErr } = await supabase.auth.admin.listUsers({ perPage: 1000 });
if (listErr) {
  console.error('listUsers failed:', listErr);
  process.exit(1);
}

const authUser = page.users.find((u) => (u.email || '').toLowerCase() === email);
if (!authUser) {
  console.log(`auth.users: NOT FOUND for ${email}`);
} else {
  console.log(`auth.users: FOUND`);
  console.log(`  id:             ${authUser.id}`);
  console.log(`  email:          ${authUser.email}`);
  console.log(`  created_at:     ${authUser.created_at}`);
  console.log(`  last_sign_in:   ${authUser.last_sign_in_at || '—'}`);
  console.log(`  email_confirmed:${authUser.email_confirmed_at ? 'yes' : 'no'}`);
}

const { data: prof, error: profErr } = await supabase
  .from('profiles')
  .select('id, email, role, full_name, company, phone, created_at')
  .eq('email', email)
  .maybeSingle();

if (profErr) {
  console.log(`profiles:   ERROR — ${profErr.code || ''} ${profErr.message || ''}`);
} else if (!prof) {
  console.log(`profiles:   NO ROW for ${email}`);
} else {
  console.log(`profiles:   FOUND`);
  console.log(`  id:         ${prof.id}`);
  console.log(`  role:       ${prof.role}`);
  console.log(`  full_name:  ${prof.full_name || '—'}`);
  console.log(`  company:    ${prof.company || '—'}`);
  console.log(`  phone:      ${prof.phone || '—'}`);
  console.log(`  created_at: ${prof.created_at}`);
}
