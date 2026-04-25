'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { currentProfile } from '@/lib/supabase/server';

const BUCKET = 'hero-banner';
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB — hero images can be larger than logos
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

async function requireAdmin() {
  const ctx = await currentProfile();
  if (!ctx || ctx.profile.role !== 'admin') redirect('/admin');
}

// Upload a single hero image to the hero-banner bucket. Returns the public
// URL or null when the form field was empty.
async function uploadIfPresent(admin, file) {
  if (!file || typeof file === 'string' || file.size === 0) return null;
  if (file.size > MAX_BYTES) {
    throw new Error('image too large (max 8 MB)');
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error('image must be JPEG, PNG or WebP');
  }
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const filename = `hero-${Date.now()}-${crypto.randomUUID()}.${ext}`;
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

// Delete a previously-uploaded hero image. Best-effort — never blocks the
// save flow if cleanup fails.
async function removeExisting(admin, url) {
  if (!url) return;
  const m = /\/storage\/v1\/object\/public\/hero-banner\/(.+)$/.exec(url);
  const path = m?.[1];
  if (!path) return;
  try { await admin.storage.from(BUCKET).remove([path]); } catch {}
}

function clampOpacity(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 0.4;
  return Math.max(0, Math.min(1, n));
}

export async function saveHeroSettings(formData) {
  await requireAdmin();
  const admin = supabaseAdmin();

  const heroVersion = formData.get('hero_version') === 'v2' ? 'v2' : 'v1';
  const heroOverlayOpacity = clampOpacity(formData.get('hero_overlay_opacity'));

  // Read current image URLs so we can clean up replaced ones.
  const { data: current } = await admin
    .from('site_settings')
    .select('hero_image_url, hero_image_mobile_url')
    .eq('id', 1)
    .single();

  const update = {
    id: 1,
    hero_version: heroVersion,
    hero_overlay_opacity: heroOverlayOpacity,
  };

  // Image fields: undefined = keep existing, null = explicit clear, string = new upload.
  let replacedDesktop = null;
  let replacedMobile = null;
  try {
    const desktopUrl = await uploadIfPresent(admin, formData.get('image_desktop'));
    if (desktopUrl) {
      update.hero_image_url = desktopUrl;
      replacedDesktop = current?.hero_image_url || null;
    }
    const mobileUrl = await uploadIfPresent(admin, formData.get('image_mobile'));
    if (mobileUrl) {
      update.hero_image_mobile_url = mobileUrl;
      replacedMobile = current?.hero_image_mobile_url || null;
    }
  } catch (e) {
    redirect(`/admin/settings/hero?error=${encodeURIComponent(e.message)}`);
  }

  if (formData.get('clear_desktop') === '1') {
    update.hero_image_url = null;
    replacedDesktop = current?.hero_image_url || null;
  }
  if (formData.get('clear_mobile') === '1') {
    update.hero_image_mobile_url = null;
    replacedMobile = current?.hero_image_mobile_url || null;
  }

  const { error } = await admin
    .from('site_settings')
    .upsert(update, { onConflict: 'id' });
  if (error) {
    redirect(`/admin/settings/hero?error=${encodeURIComponent(error.message)}`);
  }

  // Cleanup orphaned blobs after the row is committed.
  await Promise.all([
    removeExisting(admin, replacedDesktop),
    removeExisting(admin, replacedMobile),
  ]);

  revalidatePath('/');
  revalidatePath('/[lang]', 'layout');
  revalidatePath('/admin/settings/hero');
  redirect('/admin/settings/hero?saved=1');
}
