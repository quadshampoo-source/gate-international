'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { currentProfile } from '@/lib/supabase/server';

async function requireAdmin() {
  const ctx = await currentProfile();
  if (!ctx || ctx.profile.role !== 'admin') redirect('/admin');
  return ctx;
}

function refreshPaths() {
  revalidatePath('/');
  revalidatePath('/[lang]', 'layout');
  revalidatePath('/admin/districts');
}

export async function updateDistrict(formData) {
  await requireAdmin();
  const slug = String(formData.get('slug') || '').trim();
  if (!slug) redirect('/admin/districts');

  const name = String(formData.get('name') || '').trim();
  const update = {
    name: name || null,
    name_ar: String(formData.get('name_ar') || '').trim() || null,
    name_zh: String(formData.get('name_zh') || '').trim() || null,
    city: String(formData.get('city') || 'Istanbul').trim() || 'Istanbul',
    image: String(formData.get('image') || '').trim() || null,
    sort_order: Number(formData.get('sort_order')) || 0,
    is_visible: formData.get('is_visible') === 'on',
  };

  const admin = supabaseAdmin();
  const { error } = await admin.from('districts').update(update).eq('slug', slug);
  if (error) {
    console.error('updateDistrict', error);
    redirect(`/admin/districts/${slug}?error=${encodeURIComponent(error.message)}`);
  }
  refreshPaths();
  redirect('/admin/districts?saved=1');
}

export async function toggleDistrictVisibility(formData) {
  await requireAdmin();
  const slug = String(formData.get('slug') || '').trim();
  const nextValue = formData.get('next') === '1';
  if (!slug) redirect('/admin/districts');

  const admin = supabaseAdmin();
  const { error } = await admin.from('districts').update({ is_visible: nextValue }).eq('slug', slug);
  if (error) console.error('toggleDistrictVisibility', error);
  refreshPaths();
  redirect('/admin/districts');
}
