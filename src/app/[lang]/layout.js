import ThemeShell from '@/components/theme-shell';
import PageTransition from '@/components/page-transition';
import Analytics from '@/components/analytics';
import WhatsappFab from '@/components/whatsapp-fab';
import { LOCALES, dirOf, getDict } from '@/lib/i18n';
import { getActiveTheme } from '@/lib/theme';
import { getTeam } from '@/lib/team';
import { notFound } from 'next/navigation';
import { SITE_URL, OG_LOCALE_MAP, buildAlternateLocales, organizationSchema } from '@/lib/seo';
import JsonLd from '@/components/seo/json-ld';

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

// Layout-level metadata = locale-aware defaults that propagate to any
// child page that doesn't define its own metadata. Page-specific bits
// (canonical, hreflang languages, og:url, page-specific image) live on
// each page's own `generateMetadata` so they don't leak through
// inheritance.
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = getDict(lang);
  const defaultTitle = `${dict.brand} — Istanbul, Bodrum & Bursa Premium Real Estate`;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: defaultTitle,
      // Child pages with a string `title` get rendered as
      //   "{title} | Gate International"
      // Pages that need the bare brand title (eg. home) return
      //   `title: { absolute: ... }` instead.
      template: `%s | ${dict.brand}`,
    },
    description: dict.home.heroSub,
    applicationName: dict.brand,
    formatDetection: { email: false, address: false, telephone: false },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: OG_LOCALE_MAP[lang] || 'en_US',
      alternateLocale: buildAlternateLocales(lang),
      siteName: dict.brand,
      title: defaultTitle,
      description: dict.home.heroSub,
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
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
        {/* Organization / RealEstateAgent — emitted on every page so
            crawlers always have brand-level context. */}
        <JsonLd data={organizationSchema()} />
      </head>
      <body className={bodyClass}>
        <Analytics />
        <ThemeShell theme={theme} lang={lang}>
          <PageTransition>{children}</PageTransition>
        </ThemeShell>
        <WhatsappFab lang={lang} team={team} />
      </body>
    </html>
  );
}
