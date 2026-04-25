import Link from 'next/link';
import { redirect } from 'next/navigation';
import AdminFrame from '../../_components/frame';
import { currentProfile } from '@/lib/supabase/server';
import { getSiteSettings } from '@/lib/site-settings';
import HeroForm from './form';
import { saveHeroSettings } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminHeroPage({ searchParams }) {
  const ctx = await currentProfile();
  if (!ctx) redirect('/admin/login');
  if (ctx.profile.role !== 'admin') redirect('/admin');

  const sp = await searchParams;
  const settings = await getSiteSettings();

  return (
    <AdminFrame active="settings" userEmail={ctx.profile.email} role={ctx.profile.role}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/settings" className="text-[11px] text-fg-muted hover:text-gold">← Site Settings</Link>
          <h1 className="mb-0 mt-1">Hero Section</h1>
          <p className="text-fg-muted text-[13px] mt-2 max-w-[640px]">
            Ana sayfa hero&rsquo;sunun klasik gradient ile yeni görsel arka plan
            versiyonu arasında geçiş yapar. Beğenmezsen tek tıkla v1&rsquo;e dönebilirsin —
            yüklediğin görseller silinmez, DB&rsquo;de kalır.
          </p>
        </div>
      </div>

      {sp?.saved === '1' && (
        <div className="mb-5 text-[13px] text-gold">✓ Saved. Public site revalidated.</div>
      )}
      {sp?.error && (
        <div className="mb-5 text-[13px] text-[#ef4444]">{decodeURIComponent(sp.error)}</div>
      )}

      {/* TEMP debug strip — shows the exact values getSiteSettings returned
          on this server render. Remove once the read path is confirmed. */}
      <div
        className="mb-5 p-3 font-mono text-[11px] leading-relaxed"
        style={{ background: '#0B1220', border: '1px dashed #334', color: '#9ca3af' }}
      >
        <div>DEBUG · server read</div>
        <div>heroVersion = <span style={{ color: '#fff' }}>{String(settings.heroVersion)}</span></div>
        <div>heroImageUrl = <span style={{ color: '#fff' }}>{settings.heroImageUrl ?? 'null'}</span></div>
        <div>heroImageMobileUrl = <span style={{ color: '#fff' }}>{settings.heroImageMobileUrl ?? 'null'}</span></div>
        <div>heroOverlayOpacity = <span style={{ color: '#fff' }}>{String(settings.heroOverlayOpacity)}</span></div>
        <div>updatedAt = <span style={{ color: '#fff' }}>{settings.updatedAt ?? 'null'}</span></div>
      </div>

      <HeroForm action={saveHeroSettings} initial={settings} />
    </AdminFrame>
  );
}
