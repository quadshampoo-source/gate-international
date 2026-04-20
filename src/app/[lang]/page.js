import { getActiveTheme } from '@/lib/theme';
import HomeClassic from '@/components/home-classic';
import HomeCinematic from '@/components/home-cinematic';
import HomeEditorial from '@/components/home-editorial';

export const revalidate = 60;

export default async function HomePage({ params }) {
  const { lang } = await params;
  const theme = await getActiveTheme();
  if (theme === 'editorial') return <HomeEditorial lang={lang} />;
  if (theme === 'cinematic') return <HomeCinematic lang={lang} />;
  return <HomeClassic lang={lang} />;
}
