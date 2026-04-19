import { getActiveTheme } from '@/lib/theme';
import HomeClassic from '@/components/home-classic';
import HomeCinematic from '@/components/home-cinematic';

export const revalidate = 60;

export default async function HomePage({ params }) {
  const { lang } = await params;
  const theme = await getActiveTheme();
  if (theme === 'cinematic') return <HomeCinematic lang={lang} />;
  return <HomeClassic lang={lang} />;
}
