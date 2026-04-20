'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { currentProfile } from '@/lib/supabase/server';

const BUCKET = 'team-photos'; // reuse the team-photos bucket for client avatars too
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

async function requireAdmin() {
  const ctx = await currentProfile();
  if (!ctx || ctx.profile.role !== 'admin') throw new Error('forbidden');
  return ctx;
}

async function uploadPhoto(admin, file) {
  if (!file || typeof file === 'string' || file.size === 0) return null;
  if (file.size > MAX_SIZE) throw new Error('photo too large (max 5 MB)');
  if (!ALLOWED_TYPES.has(file.type)) throw new Error('photo must be JPEG, PNG or WebP');
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const filename = `testimonial-${crypto.randomUUID()}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const { error } = await admin.storage.from(BUCKET).upload(filename, buf, {
    contentType: file.type,
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) throw new Error(`upload failed: ${error.message}`);
  const { data } = admin.storage.from(BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}

function parseRow(formData) {
  return {
    name: String(formData.get('name') || '').trim(),
    role: String(formData.get('role') || '').trim() || null,
    quote: String(formData.get('quote') || '').trim(),
    lang: String(formData.get('lang') || '').trim() || null,
    sort_order: Number(formData.get('sort_order') || 0) || 0,
    active: formData.get('active') === 'on',
  };
}

export async function createTestimonial(formData) {
  await requireAdmin();
  const admin = supabaseAdmin();
  let patch;
  try {
    patch = parseRow(formData);
    if (!patch.name) throw new Error('name required');
    if (!patch.quote) throw new Error('quote required');
    const url = await uploadPhoto(admin, formData.get('photo'));
    if (url) patch.photo_url = url;
  } catch (e) {
    redirect(`/admin/testimonials/new?error=${encodeURIComponent(e.message)}`);
  }
  const { error } = await admin.from('testimonials').insert(patch);
  if (error) redirect(`/admin/testimonials/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath('/admin/testimonials');
  revalidatePath('/[lang]', 'page');
  revalidatePath('/[lang]/why-us', 'page');
  redirect('/admin/testimonials?saved=1');
}

export async function updateTestimonial(formData) {
  await requireAdmin();
  const id = String(formData.get('id') || '');
  if (!id) redirect('/admin/testimonials');
  const admin = supabaseAdmin();
  let patch;
  try {
    patch = parseRow(formData);
    const url = await uploadPhoto(admin, formData.get('photo'));
    if (url) patch.photo_url = url;
  } catch (e) {
    redirect(`/admin/testimonials/${id}?error=${encodeURIComponent(e.message)}`);
  }
  const { error } = await admin.from('testimonials').update(patch).eq('id', id);
  if (error) redirect(`/admin/testimonials/${id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath('/admin/testimonials');
  revalidatePath('/[lang]', 'page');
  revalidatePath('/[lang]/why-us', 'page');
  redirect('/admin/testimonials?saved=1');
}

export async function deleteTestimonial(formData) {
  await requireAdmin();
  const id = String(formData.get('id') || '');
  if (!id) redirect('/admin/testimonials');
  const admin = supabaseAdmin();
  const { error } = await admin.from('testimonials').delete().eq('id', id);
  if (error) redirect(`/admin/testimonials?error=${encodeURIComponent(error.message)}`);
  revalidatePath('/admin/testimonials');
  revalidatePath('/[lang]', 'page');
  revalidatePath('/[lang]/why-us', 'page');
  redirect('/admin/testimonials?removed=1');
}
