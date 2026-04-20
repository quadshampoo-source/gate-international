'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { currentProfile } from '@/lib/supabase/server';
import { OFFICES, ALL_LANGUAGES } from '@/lib/team-constants';

const BUCKET = 'team-photos';
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
  const filename = `${crypto.randomUUID()}.${ext}`;
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

function parseMember(formData) {
  const languages = ALL_LANGUAGES.filter((l) => formData.get(`lang_${l}`) === 'on');
  const office = String(formData.get('office') || '').trim();
  if (!OFFICES.includes(office)) throw new Error(`invalid office: ${office}`);
  return {
    name: String(formData.get('name') || '').trim(),
    title_en: String(formData.get('title_en') || '').trim() || null,
    title_ar: String(formData.get('title_ar') || '').trim() || null,
    title_zh: String(formData.get('title_zh') || '').trim() || null,
    title_ru: String(formData.get('title_ru') || '').trim() || null,
    title_fa: String(formData.get('title_fa') || '').trim() || null,
    title_fr: String(formData.get('title_fr') || '').trim() || null,
    whatsapp_number: String(formData.get('whatsapp_number') || '').replace(/\D/g, '') || null,
    email: String(formData.get('email') || '').trim() || null,
    languages,
    office,
    sort_order: Number(formData.get('sort_order') || 0) || 0,
    active: formData.get('active') === 'on',
  };
}

export async function createMember(formData) {
  await requireAdmin();
  const admin = supabaseAdmin();
  let patch;
  try {
    patch = parseMember(formData);
    if (!patch.name) throw new Error('name required');
    const photoUrl = await uploadPhoto(admin, formData.get('photo'));
    if (photoUrl) patch.photo_url = photoUrl;
  } catch (e) {
    redirect(`/admin/team/new?error=${encodeURIComponent(e.message)}`);
  }

  const { error } = await admin.from('team_members').insert(patch);
  if (error) redirect(`/admin/team/new?error=${encodeURIComponent(error.message)}`);

  revalidatePath('/admin/team');
  revalidatePath('/[lang]/contact', 'page');
  redirect('/admin/team?saved=1');
}

export async function updateMember(formData) {
  await requireAdmin();
  const id = String(formData.get('id') || '');
  if (!id) redirect('/admin/team');

  const admin = supabaseAdmin();
  let patch;
  try {
    patch = parseMember(formData);
    const photoUrl = await uploadPhoto(admin, formData.get('photo'));
    if (photoUrl) patch.photo_url = photoUrl;
  } catch (e) {
    redirect(`/admin/team/${id}?error=${encodeURIComponent(e.message)}`);
  }

  const { error } = await admin.from('team_members').update(patch).eq('id', id);
  if (error) redirect(`/admin/team/${id}?error=${encodeURIComponent(error.message)}`);

  revalidatePath('/admin/team');
  revalidatePath('/[lang]/contact', 'page');
  redirect('/admin/team?saved=1');
}

export async function deleteMember(formData) {
  await requireAdmin();
  const id = String(formData.get('id') || '');
  if (!id) redirect('/admin/team');

  const admin = supabaseAdmin();
  const { error } = await admin.from('team_members').delete().eq('id', id);
  if (error) redirect(`/admin/team?error=${encodeURIComponent(error.message)}`);

  revalidatePath('/admin/team');
  revalidatePath('/[lang]/contact', 'page');
  redirect('/admin/team?removed=1');
}
