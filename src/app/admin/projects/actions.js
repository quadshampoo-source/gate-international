'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';

function parseJsonOrNull(s) {
  if (!s || !s.trim()) return null;
  try { return JSON.parse(s); } catch { return null; }
}

function payloadFrom(formData) {
  const unitTypesCsv = String(formData.get('unit_types_csv') || '').trim();
  const reasonsLines = String(formData.get('reasons_lines') || '').trim();
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

  return {
    id: String(formData.get('id') || '').trim().toLowerCase(),
    sort_index: num('sort_index') ?? 0,
    name: str('name'),
    name_ar: str('name_ar'),
    name_zh: str('name_zh'),
    district: str('district'),
    district_ar: str('district_ar'),
    district_zh: str('district_zh'),
    developer: str('developer'),
    price_usd: num('price_usd'),
    bedrooms: num('bedrooms'),
    area: num('area'),
    typology: str('typology'),
    market: str('market'),
    view: str('view'),
    delivery: str('delivery'),
    status: str('status'),
    category: str('category'),
    metro: formData.get('metro') === 'on',
    img: str('img') || '',
    vimeo_id: str('vimeo_id') || '',
    total_units: num('total_units'),
    blocks: num('blocks'),
    land_area: num('land_area'),
    unit_types: unitTypesCsv ? unitTypesCsv.split(',').map((s) => s.trim()).filter(Boolean) : null,
    payment_plan: parseJsonOrNull(String(formData.get('payment_plan') || '')),
    price_table: parseJsonOrNull(String(formData.get('price_table') || '')),
    distances: parseJsonOrNull(String(formData.get('distances') || '')),
    reasons: reasonsLines ? reasonsLines.split('\n').map((s) => s.trim()).filter(Boolean) : null,
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
  const row = payloadFrom(formData);
  if (!row.id || !row.name || !row.district) {
    redirect('/admin/projects/new?error=missing');
  }
  const supabase = supabaseAdmin();
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
  const supabase = supabaseAdmin();
  const { error } = await supabase.from('projects').update(row).eq('id', row.id);
  if (error) {
    console.error('updateProject', error);
    redirect(`/admin/projects/${row.id}?error=${encodeURIComponent(error.message)}`);
  }
  refreshPaths();
  redirect('/admin/projects');
}

export async function deleteProject(formData) {
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
