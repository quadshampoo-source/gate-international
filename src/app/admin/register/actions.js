'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendRegistrationNotice } from '@/lib/email';

async function baseUrl() {
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || 'https';
  return host ? `${proto}://${host}` : 'http://localhost:3000';
}

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

  const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
  if (adminEmail && email === adminEmail) {
    redirect('/admin/register?error=reserved');
  }

  const admin = supabaseAdmin();

  const { data: existingProfile } = await admin
    .from('profiles')
    .select('id, role')
    .eq('email', email)
    .maybeSingle();
  if (existingProfile && existingProfile.role && existingProfile.role !== 'pending') {
    redirect('/admin/register?error=exists');
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, company, phone },
  });

  if (error) {
    redirect(`/admin/register?error=${encodeURIComponent(error.message)}`);
  }

  if (data?.user?.id) {
    const { data: currentRow } = await admin
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle();
    const safeToWrite = !currentRow || !currentRow.role || currentRow.role === 'pending';
    if (safeToWrite) {
      await admin
        .from('profiles')
        .upsert(
          { id: data.user.id, email, full_name, company, phone, role: 'pending' },
          { onConflict: 'id' }
        );
    }
  }

  // Notify the admin of the new application.
  const adminTo = process.env.ADMIN_EMAIL || process.env.GMAIL_USER;
  if (adminTo) {
    const dashboardUrl = `${await baseUrl()}/admin/users`;
    await sendRegistrationNotice({
      adminTo,
      applicant: { email, full_name, company, phone },
      dashboardUrl,
    });
  }

  redirect('/admin/register?success=1');
}
