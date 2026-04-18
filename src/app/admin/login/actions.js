'use server';

import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';

export async function login(formData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const next = String(formData.get('next') || '/admin');

  const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
  if (adminEmail && email.toLowerCase() !== adminEmail) {
    redirect(`/admin/login?error=unauthorized&next=${encodeURIComponent(next)}`);
  }

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
