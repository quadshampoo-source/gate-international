'use server';

import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function register(formData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  const full_name = String(formData.get('full_name') || '').trim();
  const company = String(formData.get('company') || '').trim();
  const phone = String(formData.get('phone') || '').trim();

  if (!email || !password || !full_name) {
    redirect('/admin/register?error=missing');
  }
  if (password.length < 8) {
    redirect('/admin/register?error=short');
  }

  const admin = supabaseAdmin();

  // Create the user with email confirmed so they can sign in immediately.
  // Role on the profile row defaults to 'pending' — they still cannot access
  // admin tools until the superadmin approves them.
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, company, phone },
  });

  if (error) {
    redirect(`/admin/register?error=${encodeURIComponent(error.message)}`);
  }

  // Trigger should insert the profile row. Upsert defensively in case the
  // trigger hasn't run yet or metadata didn't flow through.
  if (data?.user?.id) {
    await admin
      .from('profiles')
      .upsert(
        { id: data.user.id, email, full_name, company, phone, role: 'pending' },
        { onConflict: 'id' }
      );
  }

  redirect('/admin/register?success=1');
}
