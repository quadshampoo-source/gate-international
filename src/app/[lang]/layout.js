import Header from '@/components/header';
import Footer from '@/components/footer';
import PageTransition from '@/components/page-transition';
import Analytics from '@/components/analytics';
import WhatsappFab from '@/components/whatsapp-fab';
import { LOCALES, DEFAULT_LOCALE, dirOf, getDict } from '@/lib/i18n';
import { getActiveTheme } from '@/lib/theme';
import { getTeam } from '@/lib/team';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gateinternational.co';

const OG_LOCALE_MAP = {
  en: 'en_US',
  ar: 'ar_AR',
  zh: 'zh_CN',
  ru: 'ru_RU',
  fa: 'fa_IR',
  fr: 'fr_FR',
};

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = getDict(lang);
  const languages = Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}`]));
  languages['x-default'] = `${SITE_URL}/${DEFAULT_LOCALE}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: `${dict.brand} — Istanbul, Bodrum & Bursa Premium Real Estate`,
    description: dict.home.heroSub,
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages,
    },
    openGraph: {
      type: 'website',
      locale: OG_LOCALE_MAP[lang] || 'en_US',
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALE_MAP[l]).filter(Boolean),
      url: `${SITE_URL}/${lang}`,
      siteName: dict.brand,
      title: `${dict.brand} — Istanbul, Bodrum & Bursa Premium Real Estate`,
      description: dict.home.heroSub,
    },
  };
}

// Default: light. Only a deliberate toggle (persisted to localStorage) can
// switch the site into dark. System prefers-color-scheme is intentionally
// ignored so every first-time visitor sees the editorial white ground.
const NO_FLASH_SCRIPT = `(function(){try{var t=localStorage.getItem('gate-theme');if(t!=='light'&&t!=='dark'){t='light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export default async function LangLayout({ children, params }) {
  const { lang } = await params;
  if (!LOCALES.includes(lang)) notFound();
  const dir = dirOf(lang);
  const [team, theme] = await Promise.all([getTeam(), getActiveTheme()]);
  const bodyClass = theme === 'editorial' ? 'theme-editorial' : '';
  return (
    <html lang={lang} dir={dir} data-theme="light" data-active-theme={theme}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      </head>
      <body className={bodyClass}>
        <Analytics />
        <Header lang={lang} theme={theme} />
        <main className="pt-0">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer lang={lang} theme={theme} />
        <WhatsappFab lang={lang} team={team} />
      </body>
    </html>
  );
}
