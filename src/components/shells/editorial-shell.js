import Header from '../header';
import Footer from '../footer';
import { getSiteSettings } from '@/lib/site-settings';

// Editorial (Gate) shell — pill glass nav + serif typography + cream footer.
// Reuses the existing Header/Footer editorial branches so we don't duplicate
// the rich interactive behaviour that lives there.
export default async function EditorialShellOuter({ lang = 'en', children }) {
  const settings = await getSiteSettings();
  return (
    <>
      <Header
        lang={lang}
        theme="editorial"
        logoUrl={settings.logoUrl}
        logoAlt={settings.logoAlt}
      />
      <main className="pt-0">{children}</main>
      <Footer lang={lang} theme="editorial" />
    </>
  );
}
