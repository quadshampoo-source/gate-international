import FinderClient from '@/components/finder-client';
import EditorialFinder from '@/components/editorial/finder';
import AtomFinder from '@/components/atom/finder';
import { getActiveTheme } from '@/lib/theme';
import { getDict } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = getDict(lang).finder;
  return buildPageMetadata({
    lang,
    path: '/finder',
    title: t.title,
    description: t.sub,
  });
}

export default async function FinderPage({ params }) {
  const { lang } = await params;
  const theme = await getActiveTheme();
  if (theme === 'atom') return <AtomFinder lang={lang} />;
  if (theme === 'editorial') return <EditorialFinder lang={lang} />;
  return <FinderClient lang={lang} />;
}
