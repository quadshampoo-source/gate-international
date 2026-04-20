'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/browser';

// Self-service password change for the currently signed-in user. Uses the
// browser client so we update via the user's own session (not the service-
// role key). We re-check the current password first via signInWithPassword
// because supabase.auth.updateUser will otherwise happily let anyone with
// a stolen session cookie change the password without proving they know
// the old one.
export default function PasswordForm() {
  const router = useRouter();
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [newPwd2, setNewPwd2] = useState('');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setOk(false);

    if (newPwd.length < 8) { setErr('New password must be at least 8 characters.'); return; }
    if (newPwd !== newPwd2) { setErr('New passwords do not match.'); return; }
    if (currentPwd === newPwd) { setErr('New password must differ from the current one.'); return; }

    setLoading(true);
    const supabase = supabaseBrowser();

    // Re-verify the current password.
    const { data: session } = await supabase.auth.getUser();
    const email = session?.user?.email;
    if (!email) {
      setLoading(false);
      setErr('Session expired. Please sign in again.');
      return;
    }
    const { error: verifyErr } = await supabase.auth.signInWithPassword({ email, password: currentPwd });
    if (verifyErr) {
      setLoading(false);
      setErr('Current password is incorrect.');
      return;
    }

    // Update to the new password.
    const { error: updateErr } = await supabase.auth.updateUser({ password: newPwd });
    setLoading(false);
    if (updateErr) { setErr(updateErr.message); return; }

    setOk(true);
    setCurrentPwd('');
    setNewPwd('');
    setNewPwd2('');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      <label className="block text-[10px] font-mono tracking-[0.18em] uppercase text-fg-muted mb-2">
        Current password
      </label>
      <input
        type="password"
        value={currentPwd}
        onChange={(e) => setCurrentPwd(e.target.value)}
        required
        autoComplete="current-password"
        className="admin-input mb-4"
      />

      <label className="block text-[10px] font-mono tracking-[0.18em] uppercase text-fg-muted mb-2">
        New password
      </label>
      <input
        type="password"
        value={newPwd}
        onChange={(e) => setNewPwd(e.target.value)}
        required
        minLength={8}
        autoComplete="new-password"
        className="admin-input mb-4"
      />

      <label className="block text-[10px] font-mono tracking-[0.18em] uppercase text-fg-muted mb-2">
        Confirm new password
      </label>
      <input
        type="password"
        value={newPwd2}
        onChange={(e) => setNewPwd2(e.target.value)}
        required
        minLength={8}
        autoComplete="new-password"
        className="admin-input mb-5"
      />

      {err && <div className="text-[#ef4444] text-[13px] mb-4">{err}</div>}
      {ok && <div className="text-[#4ade80] text-[13px] mb-4">✓ Password updated.</div>}

      <button type="submit" className="admin-btn" disabled={loading}>
        {loading ? 'Updating…' : 'Update password'}
      </button>
    </form>
  );
}
