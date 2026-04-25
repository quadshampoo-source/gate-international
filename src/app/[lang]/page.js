import { getActiveTheme } from '@/lib/theme';
import HomeClassic from '@/components/home-classic';
import HomeCinematic from '@/components/home-cinematic';
import HomeEditorial from '@/components/home-editorial';
import LegacyHome from '@/components/legacy/home';
import AtomHome from '@/components/atom/home';

export const revalidate = 60;

export default async function HomePage({ params, searchParams }) {
  const { lang } = await params;
  const sp = (await searchParams) || {};
  const theme = await getActiveTheme();
  if (theme === 'atom') return <AtomHome lang={lang} searchParams={sp} />;
  if (theme === 'legacy') return <LegacyHome lang={lang} />;
  if (theme === 'editorial') return <HomeEditorial lang={lang} />;
  if (theme === 'cinematic') return <HomeCinematic lang={lang} />;
  return <HomeClassic lang={lang} />;
}
