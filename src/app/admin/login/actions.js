'use server';

import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';

export async function login(formData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const next = String(formData.get('next') || '/admin');

  // Authorization (admin vs editor vs pending) is enforced by the middleware
  // and per-page currentProfile() checks — not here. Gating the login form on
  // ADMIN_EMAIL used to reject every approved editor before Supabase even saw
  // their credentials, which broke the multi-user approval flow entirely.
  const supabase = await supabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/admin/login?error=invalid&next=${encodeURIComponent(next)}`);
  }

  redirect(next);
}

export async function logout() {
  const supabase = await supabaseServer();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
