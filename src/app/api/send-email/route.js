import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { currentProfile } from '@/lib/supabase/server';

// POST JSON: { to, subject, html, text, replyTo }
// Admin-only endpoint — blocks casual misuse.
export async function POST(req) {
  const ctx = await currentProfile();
  if (!ctx || ctx.profile.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'invalid json' }, { status: 400 }); }

  const { to, subject, html, text, replyTo } = body || {};
  if (!to || !subject || (!html && !text)) {
    return NextResponse.json({ error: 'to, subject, and html or text are required' }, { status: 400 });
  }

  const result = await sendEmail({ to, subject, html, text, replyTo });
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
