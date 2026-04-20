import Header from '@/components/header';
import Footer from '@/components/footer';
import WhatsappFab from '@/components/whatsapp-fab';
import PageTransition from '@/components/page-transition';
import Analytics from '@/components/analytics';
import { LOCALES, DEFAULT_LOCALE, dirOf, getDict } from '@/lib/i18n';
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

const NO_FLASH_SCRIPT = `(function(){try{var t=localStorage.getItem('gate-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t)}else{document.documentElement.setAttribute('data-theme','dark')}}catch(e){document.documentElement.setAttribute('data-theme','dark')}})();`;

export default async function LangLayout({ children, params }) {
  const { lang } = await params;
  if (!LOCALES.includes(lang)) notFound();
  const dir = dirOf(lang);
  const team = await getTeam();
  return (
    <html lang={lang} dir={dir} data-theme="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      </head>
      <body>
        <Analytics />
        <Header lang={lang} />
        <main className="pt-0">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer lang={lang} />
        <WhatsappFab lang={lang} team={team} />
      </body>
    </html>
  );
}
