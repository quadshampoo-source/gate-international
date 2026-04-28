import AtomShell from './shell';
import AtomPageHero from './page-hero';
import ContactClient from '@/components/contact-client';
import { getDict } from '@/lib/i18n';

export default async function AtomContact({ lang = 'en', team = {} }) {
  const t = getDict(lang).pages.contact;
  return (
    <AtomShell lang={lang}>
      <AtomPageHero
        eyebrow={t.hero.eyebrow}
        title={<>{t.hero.titleLead} <span className="atom-accent">{t.hero.titleHighlight}</span></>}
        sub={t.hero.sub}
      />
      <section className="pb-20">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <div className="bg-white p-6 md:p-10" style={{ borderRadius: 'var(--atom-radius-xl)', border: '1px solid var(--neutral-200)', boxShadow: 'var(--atom-shadow-md)' }}>
            <ContactClient lang={lang} teamGroups={team} />
          </div>
        </div>
      </section>
    </AtomShell>
  );
}
