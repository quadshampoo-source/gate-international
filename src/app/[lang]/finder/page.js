import FinderClient from '@/components/finder-client';
import EditorialFinder from '@/components/editorial/finder';
import { getActiveTheme } from '@/lib/theme';

export default async function FinderPage({ params }) {
  const { lang } = await params;
  const theme = await getActiveTheme();
  if (theme === 'editorial') return <EditorialFinder lang={lang} />;
  return <FinderClient lang={lang} />;
}
