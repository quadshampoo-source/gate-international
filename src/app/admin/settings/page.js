import AdminFrame from '../_components/frame';
import { currentUser } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { THEMES, DEFAULT_THEME } from '@/lib/theme';
import { setActiveTheme } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage({ searchParams }) {
  const user = await currentUser();
  const sp = await searchParams;
  const client = supabaseAdmin();
  const { data } = await client
    .from('site_settings')
    .select('active_theme, updated_at')
    .eq('id', 1)
    .single();
  const active = data?.active_theme || DEFAULT_THEME;

  return (
    <AdminFrame active="settings" userEmail={user?.email}>
      <h1>Site Settings</h1>

      {sp?.saved && (
        <div className="text-[#4ade80] text-sm mb-6">✓ Theme saved. Public pages revalidated.</div>
      )}
      {sp?.error && <div className="text-[#ef4444] text-sm mb-6">Error: {sp.error}</div>}

      <section className="max-w-[820px]">
        <div className="mb-6">
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-fg-muted mb-2">Active Theme</div>
          <div className="font-serif text-[22px]">{THEMES.find((t) => t.key === active)?.label || active}</div>
          {data?.updated_at && (
            <div className="font-mono text-[11px] text-fg-dim mt-2">
              Last changed · {new Date(data.updated_at).toLocaleString()}
            </div>
          )}
        </div>

        <form action={setActiveTheme}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {THEMES.map((t) => {
              const disabled = t.key === 'minimal';
              const selected = active === t.key;
              return (
                <label
                  key={t.key}
                  className={`block p-5 border cursor-pointer transition-colors ${
                    selected ? 'border-gold bg-gold/10' : 'border-line bg-bg-raised hover:border-gold/40'
                  } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={t.key}
                    defaultChecked={selected}
                    disabled={disabled}
                    className="sr-only peer"
                  />
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-serif text-[20px]">{t.label}</span>
                    {selected && <span className="text-gold text-xs font-mono">ACTIVE</span>}
                    {disabled && <span className="text-fg-dim text-[10px] font-mono">SOON</span>}
                  </div>
                  <p className="text-fg-muted text-[13px] leading-relaxed">{t.description}</p>
                  <ThemePreview theme={t.key} />
                </label>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <button type="submit" className="admin-btn">Save theme</button>
            <a href="/" target="_blank" className="text-xs text-gold hover:underline" rel="noreferrer">
              Open public site in new tab →
            </a>
          </div>
        </form>
      </section>
    </AdminFrame>
  );
}

function ThemePreview({ theme }) {
  if (theme === 'classic') {
    return (
      <div className="mt-4 aspect-[16/9] bg-bg overflow-hidden relative border border-line">
        <div className="absolute inset-x-4 top-4 h-[2px] bg-gold" />
        <div className="absolute top-8 left-4 right-4 h-6 bg-fg/10" />
        <div className="absolute top-16 left-4 right-4 h-3 bg-fg/5" />
        <div className="absolute bottom-4 left-4 w-24 h-6 bg-gold" />
        <div className="absolute top-2 right-2 text-[8px] font-mono text-gold">№ 01</div>
      </div>
    );
  }
  if (theme === 'cinematic') {
    return (
      <div className="mt-4 aspect-[16/9] bg-bg overflow-hidden relative">
        <div
          className="absolute w-[60%] h-[80%] rounded-full blur-[24px] opacity-80 animate-orbFloat"
          style={{ background: 'radial-gradient(closest-side, rgb(201 168 76 / 0.55), transparent 70%)', top: '-10%', left: '-20%' }}
        />
        <div
          className="absolute w-[50%] h-[60%] rounded-full blur-[20px] opacity-60 animate-orbFloat2"
          style={{ background: 'radial-gradient(closest-side, rgb(139 92 246 / 0.4), transparent 70%)', bottom: '-10%', right: '-15%' }}
        />
        <div className="absolute inset-4 backdrop-blur-md bg-bg-raised/40 border border-gold/20 rounded-2xl flex flex-col justify-end p-3">
          <div className="h-4 bg-fg/15 w-3/4 rounded" />
          <div className="h-2 bg-fg/10 w-1/2 rounded mt-2" />
        </div>
      </div>
    );
  }
  return (
    <div className="mt-4 aspect-[16/9] bg-bg-sunken border border-line-strong flex items-center justify-center text-fg-dim text-[11px] font-mono">
      preview soon
    </div>
  );
}
