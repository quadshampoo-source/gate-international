import Header from '../header';
import Footer from '../footer';
import { getSiteSettings } from '@/lib/site-settings';

// Shared shell for Classic + Cinematic — both use the dark/gold site-header
// and classic footer branch inside the existing Header/Footer components.
export default async function ClassicShellOuter({ lang = 'en', theme = 'classic', children }) {
  const settings = await getSiteSettings();
  return (
    <>
      <Header
        lang={lang}
        theme={theme}
        logoUrl={settings.logoUrl}
        logoAlt={settings.logoAlt}
      />
      <main className="pt-0">{children}</main>
      <Footer lang={lang} theme={theme} />
    </>
  );
}
