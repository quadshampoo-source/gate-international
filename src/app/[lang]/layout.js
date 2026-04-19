import Header from '@/components/header';
import Footer from '@/components/footer';
import WhatsappFab from '@/components/whatsapp-fab';
import PageTransition from '@/components/page-transition';
import { LOCALES, dirOf, getDict } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = getDict(lang);
  return {
    title: `${dict.brand} — Istanbul, Bodrum & Bursa Premium Real Estate`,
    description: dict.home.heroSub,
  };
}

const NO_FLASH_SCRIPT = `(function(){try{var t=localStorage.getItem('gate-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t)}else{document.documentElement.setAttribute('data-theme','dark')}}catch(e){document.documentElement.setAttribute('data-theme','dark')}})();`;

export default async function LangLayout({ children, params }) {
  const { lang } = await params;
  if (!LOCALES.includes(lang)) notFound();
  const dir = dirOf(lang);
  return (
    <html lang={lang} dir={dir} data-theme="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      </head>
      <body>
        <Header lang={lang} />
        <main className="pt-0">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer lang={lang} />
        <WhatsappFab lang={lang} />
      </body>
    </html>
  );
}
