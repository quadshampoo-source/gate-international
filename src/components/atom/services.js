import AtomShell from './shell';
import AtomPageHero from './page-hero';
import { Button, Card, IconContainer } from '@/components/ui';
import { getDict } from '@/lib/i18n';

function Icon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default async function AtomServices({ lang = 'en' }) {
  const t = getDict(lang).pages.services;
  return (
    <AtomShell lang={lang}>
      <AtomPageHero
        eyebrow={t.hero.eyebrow}
        title={<>{t.hero.titleLead} <span className="atom-accent">{t.hero.titleHighlight}</span></>}
        sub={t.hero.sub}
      />

      <section className="py-10 md:py-16">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— {t.core.kicker} —</span>
          <h2 className="atom-h2 mt-3 mb-8 md:mb-10" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)' }}>{t.core.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.core.items.map((s, i) => (
              <Card key={i} padding="md" align="left" hairline={false}>
                <IconContainer size="md"><Icon /></IconContainer>
                <h3 className="mt-4 text-xl font-semibold" style={{ color: 'var(--neutral-900)' }}>{s.title}</h3>
                <p className="mt-2 text-sm" style={{ color: 'var(--neutral-500)' }}>{s.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20" style={{ background: 'var(--neutral-100)' }}>
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— {t.extras.kicker} —</span>
          <h2 className="atom-h2 mt-3 mb-8" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)' }}>{t.extras.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.extras.items.map((s, i) => (
              <div key={i} className="p-5" style={{ background: 'var(--atom-surface)', borderRadius: 'var(--atom-radius-lg)', border: '1px solid var(--neutral-200)' }}>
                <h3 className="font-semibold" style={{ color: 'var(--neutral-900)' }}>{s.title}</h3>
                <p className="mt-1 text-sm" style={{ color: 'var(--neutral-500)' }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <div className="text-center p-10 md:p-14" style={{ borderRadius: 'var(--atom-radius-2xl)', background: 'var(--gradient-primary)', color: '#fff', boxShadow: '0 16px 48px rgba(99,102,241,0.28)' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700 }}>{t.cta.title}</h2>
            <p className="mt-3 max-w-[640px] mx-auto" style={{ color: 'rgba(255,255,255,0.88)', fontSize: 16 }}>
              {t.cta.sub}
            </p>
            <div className="mt-6 flex justify-center gap-3 flex-wrap">
              <Button href={`/${lang}/contact`} variant="ghost" className="!bg-white !text-atom-primary-700 !border-transparent">{t.cta.buttonStart}</Button>
              <Button href="https://wa.me/" external variant="ghost" arrow={false} className="!bg-transparent !text-white !border-white/50">{t.cta.buttonWa}</Button>
            </div>
          </div>
        </div>
      </section>
    </AtomShell>
  );
}
