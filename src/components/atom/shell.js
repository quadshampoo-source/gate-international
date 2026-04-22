import AtomNav from './nav';
import AtomFooter from './footer';
import { getSiteSettings } from '@/lib/site-settings';

const RTL_LANGS = new Set(['ar', 'fa']);

/**
 * Common shell for every inner Atom page — renders the nav, page body slot,
 * and footer with a consistent cream background and Inter font. Async so it
 * can pull the current logo from Supabase and pass it into the nav.
 */
export default async function AtomShell({ lang = 'en', children, containerless = false }) {
  const settings = await getSiteSettings();
  const isRtl = RTL_LANGS.has(lang);
  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        background: 'var(--neutral-50)',
        color: 'var(--neutral-900)',
        fontFamily: 'var(--atom-font-sans)',
        minHeight: '100vh',
      }}
    >
      <AtomNav lang={lang} logoUrl={settings.logoUrl} logoAlt={settings.logoAlt} />
      <main className={containerless ? '' : 'pt-24 md:pt-32'}>{children}</main>
      <AtomFooter lang={lang} />
    </div>
  );
}
