'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { currentProfile } from '@/lib/supabase/server';

const PROJECT_BUCKET = 'project-photos';
const PROJECT_MAX_SIZE = 10 * 1024 * 1024;
const PROJECT_ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);

async function uploadProjectPhoto(admin, file) {
  if (!file || typeof file === 'string' || file.size === 0) return null;
  if (file.size > PROJECT_MAX_SIZE) throw new Error('photo too large (max 10 MB)');
  if (!PROJECT_ALLOWED.has(file.type)) throw new Error('photo must be JPEG, PNG or WebP');
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const filename = `${crypto.randomUUID()}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const { error } = await admin.storage.from(PROJECT_BUCKET).upload(filename, buf, {
    contentType: file.type,
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) throw new Error(`upload failed: ${error.message}`);
  const { data } = admin.storage.from(PROJECT_BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}

async function requireProjectAccess(projectId) {
  const ctx = await currentProfile();
  if (!ctx) redirect('/admin/login');
  if (ctx.profile.role === 'admin') return ctx;
  if (ctx.profile.role === 'editor' && ctx.assignedProjectIds.includes(projectId)) return ctx;
  redirect('/admin/projects');
}

async function requireAdmin() {
  const ctx = await currentProfile();
  if (!ctx || ctx.profile.role !== 'admin') redirect('/admin');
  return ctx;
}

function parseJsonOrNull(s) {
  if (!s || !s.trim()) return null;
  try { return JSON.parse(s); } catch { return null; }
}

function payloadFrom(formData) {
  const unitTypesCsv = String(formData.get('unit_types_csv') || '').trim();
  const reasonsLines = String(formData.get('reasons_lines') || '').trim();
  const parseLines = (name) => {
    const raw = String(formData.get(name) || '').trim();
    return raw ? raw.split('\n').map((s) => s.trim()).filter(Boolean) : null;
  };
  const exteriorUrls = parseLines('exterior_lines');
  const interiorUrls = parseLines('interior_lines');
  // `gallery_lines` still accepted from older form revisions — behave as
  // exterior when present so migrations are lossless.
  const legacyGallery = parseLines('gallery_lines');
  const combinedExterior = exteriorUrls || legacyGallery;
  // Unified gallery column = exterior + interior, for any consumer that
  // hasn't learned the new split yet.
  const mergedGallery = [
    ...(combinedExterior || []),
    ...(interiorUrls || []),
  ];
  const galleryUrls = mergedGallery.length ? mergedGallery : null;
  const num = (k) => {
    const v = formData.get(k);
    if (v === null || v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const str = (k) => {
    const v = formData.get(k);
    return v == null || v === '' ? null : String(v);
  };

  const options = parseJsonOrNull(String(formData.get('options_json') || ''));

  return {
    id: String(formData.get('id') || '').trim().toLowerCase(),
    sort_index: num('sort_index') ?? 0,
    name: str('name'),
    name_ar: str('name_ar'),
    name_zh: str('name_zh'),
    district: str('district'),
    district_ar: str('district_ar'),
    district_zh: str('district_zh'),
    sub_district: str('sub_district') || null,
    developer: str('developer'),
    price_usd: num('price_usd'),
    bedrooms: str('bedrooms'),
    bathrooms: str('bathrooms'),
    property_type: str('property_type'),
    delivery_month: num('delivery_month'),
    delivery_year: num('delivery_year'),
    delivery_status: str('delivery_status'),
    options: Array.isArray(options) ? options : [],
    area: num('area'),
    typology: str('typology'),
    market: str('market'),
    view: str('view'),
    delivery: str('delivery'),
    status: str('status'),
    category: str('category'),
    metro: formData.get('metro') === 'on',
    // Cover photo — prefer first exterior shot, then any gallery, then legacy img.
    img: (combinedExterior && combinedExterior[0]) || (galleryUrls && galleryUrls[0]) || str('img') || '',
    vimeo_id: str('vimeo_id') || '',
    youtube_url: str('youtube_url') || '',
    total_units: num('total_units'),
    blocks: num('blocks'),
    land_area: num('land_area'),
    unit_types: unitTypesCsv ? unitTypesCsv.split(',').map((s) => s.trim()).filter(Boolean) : null,
    payment_plan: parseJsonOrNull(String(formData.get('payment_plan') || '')),
    price_table: parseJsonOrNull(String(formData.get('price_table') || '')),
    distances: parseJsonOrNull(String(formData.get('distances') || '')),
    reasons: reasonsLines ? reasonsLines.split('\n').map((s) => s.trim()).filter(Boolean) : null,
    gallery: galleryUrls,
    exterior_images: combinedExterior,
    interior_images: interiorUrls,
    china_score: num('china_score'),
    arab_score: num('arab_score'),
  };
}

function refreshPaths() {
  revalidatePath('/');
  revalidatePath('/[lang]', 'layout');
  revalidatePath('/admin/projects');
}

export async function createProject(formData) {
  await requireAdmin();
  const row = payloadFrom(formData);
  if (!row.id || !row.name || !row.district) {
    redirect('/admin/projects/new?error=missing');
  }
  const supabase = supabaseAdmin();
  try {
    const uploaded = await uploadProjectPhoto(supabase, formData.get('photo'));
    if (uploaded) row.img = uploaded;
  } catch (e) {
    redirect(`/admin/projects/new?error=${encodeURIComponent(e.message)}`);
  }
  const { error } = await supabase.from('projects').insert(row);
  if (error) {
    console.error('createProject', error);
    redirect(`/admin/projects/new?error=${encodeURIComponent(error.message)}`);
  }
  refreshPaths();
  redirect('/admin/projects');
}

export async function updateProject(formData) {
  const row = payloadFrom(formData);
  if (!row.id) redirect('/admin/projects');
  await requireProjectAccess(row.id);
  const supabase = supabaseAdmin();
  try {
    const uploaded = await uploadProjectPhoto(supabase, formData.get('photo'));
    if (uploaded) row.img = uploaded;
  } catch (e) {
    redirect(`/admin/projects/${row.id}?error=${encodeURIComponent(e.message)}`);
  }
  const { error } = await supabase.from('projects').update(row).eq('id', row.id);
  if (error) {
    console.error('updateProject', error);
    redirect(`/admin/projects/${row.id}?error=${encodeURIComponent(error.message)}`);
  }
  refreshPaths();
  redirect('/admin/projects');
}

export async function deleteProject(formData) {
  await requireAdmin();
  const id = String(formData.get('id') || '');
  if (!id) redirect('/admin/projects');
  const supabase = supabaseAdmin();
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) {
    console.error('deleteProject', error);
    redirect(`/admin/projects/${id}?error=${encodeURIComponent(error.message)}`);
  }
  refreshPaths();
  redirect('/admin/projects');
}
