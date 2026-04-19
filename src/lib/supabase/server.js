import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}

export async function currentUser() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// Returns the full user + profile (role, project assignments).
// `role` defaults to 'pending' if no profile row exists yet.
// A user whose email matches ADMIN_EMAIL env is always treated as admin.
export async function currentProfile() {
  const user = await currentUser();
  if (!user) return null;
  const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
  const isEnvAdmin = adminEmail && user.email?.toLowerCase() === adminEmail;

  const admin = supabaseAdmin();
  const { data: row } = await admin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const profile = row || {
    id: user.id,
    email: user.email,
    full_name: '',
    company: '',
    phone: '',
    role: isEnvAdmin ? 'admin' : 'pending',
  };

  if (isEnvAdmin) profile.role = 'admin';

  let assignedProjectIds = [];
  if (profile.role === 'editor') {
    const { data: assigns } = await admin
      .from('editor_projects')
      .select('project_id')
      .eq('user_id', user.id);
    assignedProjectIds = (assigns || []).map((r) => r.project_id);
  }

  return { user, profile, assignedProjectIds };
}

export function isAdmin(user) {
  if (!user) return false;
  return user.email?.toLowerCase() === (process.env.ADMIN_EMAIL || '').toLowerCase();
}
