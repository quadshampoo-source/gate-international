import { NextResponse } from 'next/server';
import { currentProfile } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

const BUCKET = 'project-photos';

// Admin-gated single-image upload. Client is expected to have already resized
// and transcoded — this endpoint just stores the bytes and returns a public URL.
export async function POST(req) {
  const ctx = await currentProfile();
  if (!ctx || ctx.profile.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const form = await req.formData();
  const file = form.get('file');
  const projectId = String(form.get('projectId') || '').replace(/[^a-z0-9-]/gi, '').toLowerCase() || 'unassigned';

  if (!file || typeof file === 'string' || !file.size) {
    return NextResponse.json({ error: 'no file' }, { status: 400 });
  }

  const ext = (file.type === 'image/webp' ? 'webp' : file.type === 'image/png' ? 'png' : 'jpg');
  const filename = `${projectId}/${crypto.randomUUID()}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  const admin = supabaseAdmin();
  const { error } = await admin.storage.from(BUCKET).upload(filename, buf, {
    contentType: file.type || 'image/jpeg',
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const { data } = admin.storage.from(BUCKET).getPublicUrl(filename);
  return NextResponse.json({ url: data.publicUrl });
}
