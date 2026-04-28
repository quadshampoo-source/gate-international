import { getActiveTheme } from '@/lib/theme';
import HomeClassic from '@/components/home-classic';
import HomeCinematic from '@/components/home-cinematic';
import HomeEditorial from '@/components/home-editorial';
import LegacyHome from '@/components/legacy/home';
import AtomHome from '@/components/atom/home';
import { getDict } from '@/lib/i18n';
import { buildPageMetadata, websiteSchema } from '@/lib/seo';
import JsonLd from '@/components/seo/json-ld';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = getDict(lang);
  return buildPageMetadata({
    lang,
    path: '',
    // Home keeps the full brand-anchored title (no template wrap).
    title: `${dict.brand} — Istanbul, Bodrum & Bursa Premium Real Estate`,
    titleAbsolute: true,
    description: dict.home.heroSub,
  });
}

export default async function HomePage({ params, searchParams }) {
  const { lang } = await params;
  const sp = (await searchParams) || {};
  const theme = await getActiveTheme();
  const themed = (() => {
    if (theme === 'atom') return <AtomHome lang={lang} searchParams={sp} />;
    if (theme === 'legacy') return <LegacyHome lang={lang} />;
    if (theme === 'editorial') return <HomeEditorial lang={lang} />;
    if (theme === 'cinematic') return <HomeCinematic lang={lang} />;
    return <HomeClassic lang={lang} />;
  })();
  return (
    <>
      {/* WebSite + SearchAction — surfaces the sitelinks search box in
          Google. Home-only so it isn't duplicated across the site. */}
      <JsonLd data={websiteSchema(lang)} />
      {themed}
    </>
  );
}
