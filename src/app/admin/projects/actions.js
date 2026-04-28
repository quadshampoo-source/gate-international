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

// Build a jsonb locale bundle for fields that have a flagship EN column plus
// `<field>_<lang>` inputs for ar/zh/ru/fa/fr. Empty entries are dropped so the
// reader's fallback chain (lib/i18n-content.localizedField) does not return
// blank strings instead of the EN copy.
function buildI18nBundle(formData, fieldKey, baseEnValue) {
  const bundle = {};
  if (baseEnValue && String(baseEnValue).trim()) bundle.en = String(baseEnValue);
  for (const lang of ['ar', 'zh', 'ru', 'fa', 'fr']) {
    const raw = formData.get(`${fieldKey}_${lang}`);
    if (raw == null) continue;
    const trimmed = String(raw).trim();
    if (trimmed) bundle[lang] = trimmed;
  }
  return Object.keys(bundle).length ? bundle : null;
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
  const amenitiesJson = parseJsonOrNull(String(formData.get('amenities_json') || ''));
  const faqsJson = parseJsonOrNull(String(formData.get('faqs_json') || ''));
  const reelsJson = parseJsonOrNull(String(formData.get('reels_json') || ''));

  // Build the developer object from the split inputs. Legacy `developer` text
  // column still written — derived from the object's name so existing readers
  // (projects-client, cards, etc.) keep working.
  const developerFields = {
    name: str('developer_name'),
    logo_url: str('developer_logo_url'),
    founded_year: num('developer_founded_year'),
    website_url: str('developer_website_url'),
    description: str('developer_description'),
    past_projects_count: num('developer_past_projects_count'),
  };
  const developerEntries = Object.entries(developerFields).filter(([, value]) => value != null);
  const developerInfo = developerEntries.length
    ? Object.fromEntries(developerEntries)
    : null;
  const developerText = developerInfo?.name ?? str('developer');

  // Structured distances — 9 named fields now replace the old JSON textarea.
  const distanceKeys = [
    'metro_km', 'mall_km', 'school_km', 'airport_min', 'bosphorus_min',
    'beach_km', 'hospital_km', 'business_district_min', 'city_center_min',
  ];
  const distancesEntries = distanceKeys
    .map((k) => [k, num(`distance_${k}`)])
    .filter(([, value]) => value != null);
  const distancesValue = distancesEntries.length ? Object.fromEntries(distancesEntries) : null;

  // Investment sub-object. Checkbox always present; only include when the box
  // is actually checked so the field stays truly optional.
  const citizenshipEligible = formData.get('investment_citizenship_eligible') === 'on';
  const investmentFields = {
    rental_yield_pct: num('investment_rental_yield_pct'),
    appreciation_pct_5yr: num('investment_appreciation_pct_5yr'),
    roi_notes: str('investment_roi_notes'),
    min_investment_for_citizenship: num('investment_min_investment_for_citizenship'),
  };
  const investmentEntries = Object.entries(investmentFields).filter(([, value]) => value != null);
  if (citizenshipEligible) investmentEntries.push(['citizenship_eligible', true]);
  const investmentValue = investmentEntries.length ? Object.fromEntries(investmentEntries) : null;

  const heroTaglineEn = str('hero_tagline');
  const descriptionEn = str('description');

  return {
    id: String(formData.get('id') || '').trim().toLowerCase(),
    sort_index: num('sort_index') ?? 0,
    name: str('name'),
    name_ar: str('name_ar'),
    name_zh: str('name_zh'),
    name_ru: str('name_ru'),
    name_fa: str('name_fa'),
    name_fr: str('name_fr'),
    district: str('district'),
    district_ar: str('district_ar'),
    district_zh: str('district_zh'),
    district_ru: str('district_ru'),
    district_fa: str('district_fa'),
    district_fr: str('district_fr'),
    sub_district: str('sub_district') || null,
    developer: developerText,
    developer_info: developerInfo,
    hero_tagline: heroTaglineEn,
    description: descriptionEn,
    // Locale bundles — keep the EN copy in the legacy column above so
    // any reader that hasn't migrated still works, and additionally
    // mirror it into the bundle's `en` key alongside the 5 translated
    // entries the form just submitted.
    hero_tagline_i18n: buildI18nBundle(formData, 'hero_tagline', heroTaglineEn),
    description_i18n: buildI18nBundle(formData, 'description', descriptionEn),
    amenities: Array.isArray(amenitiesJson) ? amenitiesJson : null,
    faqs: Array.isArray(faqsJson) ? faqsJson : null,
    investment: investmentValue,
    brochure_url: str('brochure_url'),
    master_plan_url: str('master_plan_url'),
    reels: Array.isArray(reelsJson) && reelsJson.length ? reelsJson : null,
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
    distances: distancesValue,
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

// AI translation server action — called from the admin form's
// "Translate from EN" button. Takes the English source text and returns
// drafts for the five non-EN locales. Uses Anthropic's Messages API
// directly via fetch so we don't pull in an SDK as a dependency.
//
// kind: 'short' (taglines, names) → terse, max ~120 chars
// kind: 'long'  (descriptions)    → preserve markdown, paragraph structure
//
// Returns { ar, zh, ru, fa, fr } — caller fills the 5 textareas. If the
// env key is missing or the call errors, throws so the client can show
// the message instead of silently inserting placeholders.
export async function translateProjectField(text, kind = 'long') {
  await requireAdmin();
  const source = String(text || '').trim();
  if (!source) throw new Error('source text is empty');
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured');

  const toneNote = kind === 'short'
    ? 'Keep each translation under 120 characters. Tone: luxurious, concise, magazine-pull-quote energy.'
    : 'Preserve any markdown formatting (headings, lists, bold, links). Tone: refined, factual, luxury real-estate editorial.';

  const system = [
    'You translate Turkish real estate marketing copy from English into five target languages:',
    '- ar: Modern Standard Arabic',
    '- zh: Simplified Chinese',
    '- ru: Russian',
    '- fa: Persian (Farsi)',
    '- fr: French',
    toneNote,
    'Respond ONLY with a JSON object matching this exact shape: {"ar":"...","zh":"...","ru":"...","fa":"...","fr":"..."}.',
    'Do not add commentary, do not wrap in code fences, do not include any locale not listed above.',
  ].join('\n');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      temperature: 0.3,
      system,
      messages: [
        { role: 'user', content: source },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`translation API failed (${res.status}): ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const raw = (data?.content?.[0]?.text || '').trim();
  // Claude usually returns clean JSON when instructed, but defensively
  // strip a code fence if one slipped through.
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('translation API returned non-JSON response');
  }

  const out = {};
  for (const lang of ['ar', 'zh', 'ru', 'fa', 'fr']) {
    if (typeof parsed[lang] === 'string') out[lang] = parsed[lang];
  }
  if (Object.keys(out).length === 0) {
    throw new Error('translation API response missing all expected locales');
  }
  return out;
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
