import AtomShell from './shell';
import AtomPageHero from './page-hero';
import ContactClient from '@/components/contact-client';

export default async function AtomContact({ lang = 'en', team = {} }) {
  return (
    <AtomShell lang={lang}>
      <AtomPageHero
        eyebrow="Contact"
        title={<>Let&apos;s <span className="atom-accent">talk.</span></>}
        sub="Tell us what you&apos;re looking for. A senior advisor replies within one business day — often within an hour during office time."
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
