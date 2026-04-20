import CalculatorClient from '@/components/calculator-client';
import EditorialCalculator from '@/components/editorial/calculator';
import { getActiveTheme } from '@/lib/theme';

export default async function CalculatorPage({ params }) {
  const { lang } = await params;
  const theme = await getActiveTheme();
  if (theme === 'editorial') return <EditorialCalculator lang={lang} />;
  return <CalculatorClient lang={lang} />;
}
