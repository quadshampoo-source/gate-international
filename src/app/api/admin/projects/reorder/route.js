import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { currentProfile } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function PUT(req) {
  const ctx = await currentProfile();
  if (!ctx || ctx.profile.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const order = Array.isArray(body?.order) ? body.order : null;
  if (!order || !order.length) {
    return NextResponse.json({ error: 'missing order' }, { status: 400 });
  }

  const clean = [];
  for (const item of order) {
    const id = typeof item?.id === 'string' ? item.id.trim() : '';
    const idx = Number(item?.sort_index);
    if (!id || !Number.isFinite(idx)) {
      return NextResponse.json({ error: 'invalid entry' }, { status: 400 });
    }
    clean.push({ id, sort_index: idx });
  }

  const admin = supabaseAdmin();
  const results = await Promise.all(
    clean.map((item) =>
      admin.from('projects').update({ sort_index: item.sort_index }).eq('id', item.id)
    )
  );
  const failure = results.find((r) => r.error);
  if (failure) {
    console.error('reorder', failure.error);
    return NextResponse.json({ error: failure.error.message }, { status: 500 });
  }

  revalidatePath('/');
  revalidatePath('/[lang]', 'layout');
  revalidatePath('/admin/projects');

  return NextResponse.json({ success: true, count: clean.length });
}
