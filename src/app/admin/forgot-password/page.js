'use client';

import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';

// Triggers a Supabase password-recovery email that lands on
// /admin/reset-password (our own handler). We set redirectTo explicitly so
// the link works regardless of whatever Site URL is configured in the
// Supabase dashboard.
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/admin/reset-password`,
    });
    setLoading(false);
    if (error) setErr(error.message);
    else setSent(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-[420px] border border-line bg-bg-raised p-8">
        <div className="admin-brand mb-6">GATE <em>·</em> ADMIN</div>
        <h1 className="font-serif text-[28px] mb-3 tracking-tight">Forgot password</h1>
        <p className="text-[13px] text-fg-muted mb-6 leading-relaxed">
          Enter the email you registered with and we&apos;ll send you a link to
          set a new password.
        </p>

        {sent ? (
          <p className="text-[13px] text-fg-muted">
            If an account exists for <strong>{email}</strong>, a reset link is on
            its way. Check your inbox (and spam) for an email from Supabase.
          </p>
        ) : (
          <form onSubmit={onSubmit}>
            <label className="block text-[10px] font-mono tracking-[0.18em] uppercase text-fg-muted mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
              className="admin-input mb-6"
            />

            {err && <div className="text-[#ef4444] text-[13px] mb-4">{err}</div>}

            <button className="admin-btn w-full" type="submit" disabled={loading}>
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}

        <div className="text-center mt-6 text-[12px] text-fg-muted">
          <a href="/admin/login" className="text-gold hover:underline">Back to sign in</a>
        </div>
      </div>
    </div>
  );
}
