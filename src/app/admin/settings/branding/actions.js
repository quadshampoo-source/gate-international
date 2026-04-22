'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { currentProfile } from '@/lib/supabase/server';

async function requireAdmin() {
  const ctx = await currentProfile();
  if (!ctx || ctx.profile.role !== 'admin') redirect('/admin');
}

export async function saveAltText(formData) {
  await requireAdmin();
  const alt = String(formData.get('logo_alt') || '').trim().slice(0, 200) || null;
  const admin = supabaseAdmin();
  const { error } = await admin
    .from('site_settings')
    .upsert({ id: 1, logo_alt: alt }, { onConflict: 'id' });
  if (error) {
    redirect(`/admin/settings/branding?error=${encodeURIComponent(error.message)}`);
  }
  revalidatePath('/');
  revalidatePath('/[lang]', 'layout');
  revalidatePath('/admin/settings/branding');
  redirect('/admin/settings/branding?saved=1');
}
