import { login } from './actions';

export default async function LoginPage({ searchParams }) {
  const sp = await searchParams;
  const err = sp?.error;
  const next = sp?.next || '/admin';

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form
        action={login}
        className="w-full max-w-[420px] border border-line bg-bg-raised p-8"
      >
        <div className="admin-brand mb-6">GATE <em>·</em> ADMIN</div>
        <h1 className="font-serif text-[28px] mb-6 tracking-tight">Sign in</h1>

        <input type="hidden" name="next" value={next} />

        <label className="block text-[10px] font-mono tracking-[0.18em] uppercase text-fg-muted mb-2">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          autoFocus
          autoComplete="email"
          className="admin-input mb-4"
        />

        <label className="block text-[10px] font-mono tracking-[0.18em] uppercase text-fg-muted mb-2">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="admin-input mb-6"
        />

        {err && (
          <div className="text-[#ef4444] text-[13px] mb-4">
            {err === 'invalid' ? 'Invalid email or password.' : err === 'unauthorized' ? 'Not authorised.' : err}
          </div>
        )}

        <button className="admin-btn w-full" type="submit">Sign in</button>
      </form>
    </div>
  );
}
