import AtomShell from './shell';
import AtomProjectCard from './project-card';
import { Button, Card, StatCard } from '@/components/ui';
import { getDict } from '@/lib/i18n';

const BG = {
  Bodrum: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=2400&q=85',
  Bursa: 'https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=2400&q=85',
};

export default async function AtomDistrict({ lang = 'en', district = 'Bodrum', projects = [] }) {
  const t = getDict(lang).pages.district;
  const districtKey = district === 'Bursa' ? 'bursa' : 'bodrum';
  const c = t[districtKey];
  const bg = BG[district] || BG.Bodrum;
  const districtProjects = projects.filter((p) => p.district === district);
  const featured = districtProjects.slice(0, 6);

  return (
    <AtomShell lang={lang} containerless>
      {/* Hero with background image */}
      <section className="relative overflow-hidden pt-32 md:pt-40 pb-20 md:pb-28" style={{ minHeight: 520 }}>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${bg}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(15,22,36,0.4) 0%, rgba(15,22,36,0.72) 100%)' }}
        />
        <div className="relative max-w-[1100px] mx-auto px-6 md:px-10 text-white">
          <span className="atom-caption" style={{ color: 'var(--accent-cyan)' }}>— {c.eyebrow} —</span>
          <h1 className="mt-4" style={{ fontSize: 'clamp(44px, 7vw, 88px)', fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.025em' }}>
            {c.titleHead} <span className="italic" style={{ fontWeight: 300 }}>{c.titleTail}</span>
          </h1>
          <p className="mt-6 max-w-[640px]" style={{ color: 'rgba(255,255,255,0.88)', fontSize: 17 }}>
            {c.sub}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={`/${lang}/projects?district=${encodeURIComponent(district)}`} variant="ghost" className="!bg-white !text-atom-primary-700 !border-transparent">
              {t.buttons.viewResidences}
            </Button>
            <Button href={`/${lang}/contact?district=${encodeURIComponent(district)}`} variant="ghost" arrow={false} className="!bg-transparent !text-white !border-white/60">
              {t.buttons.speakAdvisor}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {c.stats.map((s, i) => (
              <Card key={i} padding="md" align="left"><StatCard number={s.n} accent={s.accent} label={s.lbl} caption={s.cap} /></Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20" style={{ background: 'var(--neutral-100)' }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— {t.sections.subRegionsKicker} —</span>
          <h2 className="atom-h2 mt-3 mb-8 md:mb-10" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)' }}>
            {t.sections.subRegionsTitleLead} <span className="atom-accent">{t.sections.subRegionsTitleHighlight}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {c.subRegions.map((r) => (
              <div key={r.name} className="p-6" style={{ background: 'var(--atom-surface)', borderRadius: 'var(--atom-radius-lg)', border: '1px solid var(--neutral-200)' }}>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--neutral-900)' }}>{r.name}</h3>
                <p className="mt-1.5 text-sm" style={{ color: 'var(--neutral-500)' }}>{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="py-12 md:py-20">
          <div className="max-w-[1360px] mx-auto px-6 md:px-10">
            <div className="flex items-end justify-between gap-6 mb-8 md:mb-10 flex-wrap">
              <div>
                <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— {t.sections.residencesKicker} —</span>
                <h2 className="atom-h2 mt-3" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)' }}>{t.sections.featuredInTemplate.replace('{district}', district)}</h2>
              </div>
              <Button href={`/${lang}/projects?district=${encodeURIComponent(district)}`} variant="ghost">{t.buttons.viewAllTemplate.replace('{count}', districtProjects.length)}</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p) => <AtomProjectCard key={p.id} project={p} lang={lang} />)}
            </div>
          </div>
        </section>
      )}

      <section className="pb-20">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <div className="text-center p-10 md:p-14" style={{ borderRadius: 'var(--atom-radius-2xl)', background: 'var(--gradient-primary)', color: '#fff', boxShadow: '0 16px 48px rgba(99,102,241,0.28)' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700 }}>{t.sections.consideringTemplate.replace('{district}', district)}</h2>
            <p className="mt-3 max-w-[560px] mx-auto" style={{ color: 'rgba(255,255,255,0.88)', fontSize: 16 }}>
              {t.sections.ctaSub}
            </p>
            <div className="mt-6 flex justify-center">
              <Button href={`/${lang}/contact?district=${encodeURIComponent(district)}`} variant="ghost" className="!bg-white !text-atom-primary-700 !border-transparent">{t.buttons.bookCall}</Button>
            </div>
          </div>
        </div>
      </section>
    </AtomShell>
  );
}
