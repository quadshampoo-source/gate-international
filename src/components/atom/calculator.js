import AtomShell from './shell';
import AtomPageHero from './page-hero';
import CalculatorClient from '@/components/calculator-client';

export default async function AtomCalculator({ lang = 'en' }) {
  return (
    <AtomShell lang={lang}>
      <AtomPageHero
        eyebrow="ROI calculator"
        title={<>Model your <span className="atom-accent">returns.</span></>}
        sub="A transparent tool for rental yield, capital-gains projections, and citizenship-hold scenarios. Numbers first, narrative second."
      />
      <section className="pb-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="bg-white p-6 md:p-10" style={{ borderRadius: 'var(--atom-radius-xl)', border: '1px solid var(--neutral-200)', boxShadow: 'var(--atom-shadow-md)' }}>
            <CalculatorClient lang={lang} />
          </div>
        </div>
      </section>
    </AtomShell>
  );
}
