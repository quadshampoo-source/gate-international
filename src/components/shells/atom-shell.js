import AtomNav from '../atom/nav';
import AtomFooter from '../atom/footer';
import { getSiteSettings } from '@/lib/site-settings';

const RTL_LANGS = new Set(['ar', 'fa']);

// Exclusive Atom shell: nothing classic/editorial/legacy renders alongside.
export default async function AtomShellOuter({ lang = 'en', children }) {
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
      <main>{children}</main>
      <AtomFooter lang={lang} />
    </div>
  );
}
