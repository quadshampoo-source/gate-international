import AtomShell from './shell';
import AtomPageHero from './page-hero';
import FinderClient from '@/components/finder-client';

export default async function AtomFinder({ lang = 'en' }) {
  return (
    <AtomShell lang={lang}>
      <AtomPageHero
        eyebrow="Residence finder"
        title={<>Tell us what <span className="atom-accent">matters.</span></>}
        sub="A three-minute brief — budget, city, purpose, timing — and we come back with a tailored shortlist."
      />
      <section className="pb-20">
        <div className="max-w-[1000px] mx-auto px-6 md:px-10">
          <div className="bg-white p-6 md:p-10" style={{ borderRadius: 'var(--atom-radius-xl)', border: '1px solid var(--neutral-200)', boxShadow: 'var(--atom-shadow-md)' }}>
            <FinderClient lang={lang} />
          </div>
        </div>
      </section>
    </AtomShell>
  );
}
