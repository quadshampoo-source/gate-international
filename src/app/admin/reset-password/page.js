'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/browser';

// Landing page for Supabase password-recovery emails. The recovery link
// either carries tokens in the URL fragment (#access_token=...&type=recovery)
// or a PKCE code (?code=...); the browser client's detectSessionInUrl handles
// both and emits a SIGNED_IN / PASSWORD_RECOVERY auth event once a recovery
// session is active. We wait for that, then let the user set a new password
// via supabase.auth.updateUser, sign them out, and bounce back to /admin/login.
export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [linkError, setLinkError] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = supabaseBrowser();
    let mounted = true;

    // detectSessionInUrl runs on client init; give it a tick to consume the
    // hash/code, then check.
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (!mounted) return;
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') setReady(true);
    });

    // If after 2s we still have no session and no hash/code in the URL, the
    // link was consumed elsewhere or expired. Surface a clear error.
    const timeout = setTimeout(() => {
      if (!mounted || ready) return;
      const hasHash = typeof window !== 'undefined' && window.location.hash.includes('access_token');
      const hasCode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('code');
      if (!hasHash && !hasCode) {
        setLinkError('This reset link is invalid or has already been used. Please request a new one.');
      }
    }, 2000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      sub?.subscription?.unsubscribe?.();
    };
  }, [ready]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    if (pwd.length < 8) { setErr('Password must be at least 8 characters.'); return; }
    if (pwd !== pwd2) { setErr('Passwords do not match.'); return; }
    setLoading(true);
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.updateUser({ password: pwd });
    if (error) {
      setLoading(false);
      setErr(error.message);
      return;
    }
    setOk(true);
    await supabase.auth.signOut();
    setTimeout(() => router.push('/admin/login'), 1600);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-[420px] border border-line bg-bg-raised p-8">
        <div className="admin-brand mb-6">GATE <em>·</em> ADMIN</div>
        <h1 className="font-serif text-[28px] mb-6 tracking-tight">Set a new password</h1>

        {linkError ? (
          <>
            <p className="text-[#ef4444] text-[13px] mb-5">{linkError}</p>
            <a href="/admin/forgot-password" className="admin-btn w-full inline-block text-center">
              Request a new link
            </a>
          </>
        ) : ok ? (
          <p className="text-[13px] text-fg-muted">
            Password updated. Redirecting you to sign in…
          </p>
        ) : !ready ? (
          <p className="text-[13px] text-fg-muted">Verifying link…</p>
        ) : (
          <form onSubmit={onSubmit}>
            <label className="block text-[10px] font-mono tracking-[0.18em] uppercase text-fg-muted mb-2">
              New password
            </label>
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              required
              autoFocus
              autoComplete="new-password"
              className="admin-input mb-4"
            />

            <label className="block text-[10px] font-mono tracking-[0.18em] uppercase text-fg-muted mb-2">
              Confirm new password
            </label>
            <input
              type="password"
              value={pwd2}
              onChange={(e) => setPwd2(e.target.value)}
              required
              autoComplete="new-password"
              className="admin-input mb-6"
            />

            {err && <div className="text-[#ef4444] text-[13px] mb-4">{err}</div>}

            <button className="admin-btn w-full" type="submit" disabled={loading}>
              {loading ? 'Updating…' : 'Update password'}
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
