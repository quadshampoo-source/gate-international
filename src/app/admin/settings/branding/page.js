import Link from 'next/link';
import { redirect } from 'next/navigation';
import AdminFrame from '../../_components/frame';
import { currentProfile } from '@/lib/supabase/server';
import { getSiteSettings } from '@/lib/site-settings';
import LogoUploader from './form';
import { saveAltText } from './actions';

export const dynamic = 'force-dynamic';

export default async function BrandingPage({ searchParams }) {
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
          <h1 className="mb-0 mt-1">Branding</h1>
        </div>
      </div>

      {sp?.saved === '1' && (
        <div className="mb-5 text-[13px] text-gold">✓ Saved.</div>
      )}
      {sp?.error && (
        <div className="mb-5 text-[13px] text-[#ef4444]">{decodeURIComponent(sp.error)}</div>
      )}

      <LogoUploader initialUrl={settings.logoUrl} initialAlt={settings.logoAlt} />

      <form action={saveAltText} className="max-w-[780px] mt-6">
        <div className="admin-row">
          <label>Alt text</label>
          <div>
            <input
              name="logo_alt"
              defaultValue={settings.logoAlt || ''}
              className="admin-input"
              placeholder="Gate International"
              maxLength={200}
            />
            <p className="text-[11px] text-fg-dim mt-2">
              Screen-reader description. Keep it short — usually just the brand name.
            </p>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button type="submit" className="admin-btn">Save alt text</button>
        </div>
      </form>
    </AdminFrame>
  );
}
