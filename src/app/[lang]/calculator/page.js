import CalculatorClient from '@/components/calculator-client';
import EditorialCalculator from '@/components/editorial/calculator';
import AtomCalculator from '@/components/atom/calculator';
import { getActiveTheme } from '@/lib/theme';
import { getDict } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = getDict(lang).calculator;
  return buildPageMetadata({
    lang,
    path: '/calculator',
    title: t.title,
    description: t.sub,
  });
}

export default async function CalculatorPage({ params }) {
  const { lang } = await params;
  const theme = await getActiveTheme();
  if (theme === 'atom') return <AtomCalculator lang={lang} />;
  if (theme === 'editorial') return <EditorialCalculator lang={lang} />;
  return <CalculatorClient lang={lang} />;
}
