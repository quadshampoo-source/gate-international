import CalculatorClient from '@/components/calculator-client';

export default async function CalculatorPage({ params }) {
  const { lang } = await params;
  return <CalculatorClient lang={lang} />;
}
