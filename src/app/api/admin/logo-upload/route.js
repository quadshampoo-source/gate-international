import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { currentProfile } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

const BUCKET = 'project-photos';
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
// PNG file signature — first 8 bytes must match exactly.
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function isPng(buf) {
  if (!buf || buf.length < 8) return false;
  for (let i = 0; i < 8; i++) if (buf[i] !== PNG_MAGIC[i]) return false;
  return true;
}

async function requireAdmin() {
  const ctx = await currentProfile();
  if (!ctx || ctx.profile.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  return null;
}

// Delete a previously-uploaded logo at `url` from the `project-photos` bucket.
// Only touches paths under branding/ — belt and braces.
async function removeExisting(admin, url) {
  if (!url) return;
  const m = /\/storage\/v1\/object\/public\/project-photos\/(.+)$/.exec(url);
  const path = m?.[1];
  if (!path || !path.startsWith('branding/')) return;
  try { await admin.storage.from(BUCKET).remove([path]); } catch {}
}

function refresh() {
  revalidatePath('/');
  revalidatePath('/[lang]', 'layout');
  revalidatePath('/admin/settings/branding');
}

export async function POST(req) {
  const forbid = await requireAdmin();
  if (forbid) return forbid;

  const form = await req.formData();
  const file = form.get('file');
  if (!file || typeof file === 'string' || !file.size) {
    return NextResponse.json({ error: 'no file' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'file too large (max 2 MB)' }, { status: 400 });
  }
  // Trust neither the MIME type nor the extension — check the magic bytes.
  const bytes = Buffer.from(await file.arrayBuffer());
  if (!isPng(bytes)) {
    return NextResponse.json({ error: 'only PNG files are accepted' }, { status: 400 });
  }

  const admin = supabaseAdmin();

  // Read current logo URL so we can delete it after upload.
  const { data: current } = await admin
    .from('site_settings')
    .select('logo_url')
    .eq('id', 1)
    .single();

  const filename = `branding/logo-${Date.now()}.png`;
  const { error: upErr } = await admin.storage.from(BUCKET).upload(filename, bytes, {
    contentType: 'image/png',
    cacheControl: '31536000',
    upsert: false,
  });
  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }
  const { data: pub } = admin.storage.from(BUCKET).getPublicUrl(filename);
  const newUrl = pub.publicUrl;

  const { error: wErr } = await admin
    .from('site_settings')
    .upsert({ id: 1, logo_url: newUrl }, { onConflict: 'id' });
  if (wErr) {
    return NextResponse.json({ error: wErr.message }, { status: 500 });
  }

  await removeExisting(admin, current?.logo_url);
  refresh();

  return NextResponse.json({ url: newUrl });
}

export async function DELETE() {
  const forbid = await requireAdmin();
  if (forbid) return forbid;

  const admin = supabaseAdmin();
  const { data: current } = await admin
    .from('site_settings')
    .select('logo_url')
    .eq('id', 1)
    .single();

  const { error: wErr } = await admin
    .from('site_settings')
    .upsert({ id: 1, logo_url: null }, { onConflict: 'id' });
  if (wErr) {
    return NextResponse.json({ error: wErr.message }, { status: 500 });
  }

  await removeExisting(admin, current?.logo_url);
  refresh();
  return NextResponse.json({ ok: true });
}
