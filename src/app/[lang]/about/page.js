import { getDict } from '@/lib/i18n';
import { getActiveTheme } from '@/lib/theme';
import EditorialAbout from '@/components/editorial/about';
import AtomAbout from '@/components/atom/about';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = getDict(lang).about;
  return buildPageMetadata({
    lang,
    path: '/about',
    title: t.title,
    description: t.sub,
  });
}

const TEAM = [
  { name: 'Emre Altınok', role: 'Founding Partner', bio: 'Twenty years in Istanbul prime. Former BCG. Wharton MBA.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80' },
  { name: 'Leyla Hanım', role: 'Director · Bosphorus', bio: 'Specialist in the Sarıyer–Kandilli corridor since 2014.', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80' },
  { name: 'Wang Jing 王静', role: 'Head · Greater China', bio: 'Based between Istanbul and Shanghai. Native Mandarin, fluent Turkish.', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80' },
  { name: 'Khalid Al-Sabah', role: 'Head · Gulf Region', bio: 'Riyadh office. Serves private offices across the GCC.', img: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&q=80' },
];

const LICENSES = [
  { name: 'TAPU Certified', detail: 'LIC. 0418-INT-2009', full: 'Turkish Land Registry — authorized foreign-buyer intermediary since 2009.' },
  { name: 'GYODER', detail: 'MEMBER № 14521', full: 'Real Estate Investors Association of Turkey — founding-tier.' },
  { name: 'RE/MAX Global', detail: 'AFFILIATE · 2016', full: 'Global referral network covering 110+ markets.' },
  { name: 'Citizenship by Investment', detail: 'MOI AUTHORIZED', full: 'Registered agent for the Republic of Türkiye citizenship programme.' },
  { name: 'TÜRKSAT', detail: 'DATA PROT. CERT.', full: 'ISO-27001 alignment. Client data resides on Turkish servers only.' },
  { name: 'Legal · Cemre Özkan Partnership', detail: 'EST. 2009', full: 'In-house counsel specialising in cross-border property transactions.' },
];

export default async function AboutPage({ params }) {
  const { lang } = await params;
  const theme = await getActiveTheme();
  if (theme === 'atom') return <AtomAbout lang={lang} />;
  if (theme === 'editorial') return <EditorialAbout lang={lang} />;
  const t = getDict(lang);

  return (
    <div className="fade-in">
      <section className="pt-[160px] pb-20 border-b border-line">
        <div className="container-x">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-end">
            <div>
              <span className="kicker">{t.about.kicker}</span>
              <h1 className="font-serif text-[clamp(48px,6vw,88px)] leading-[1.02] tracking-[-0.025em] my-4">
                {t.about.title}
              </h1>
            </div>
            <p className="text-[17px] text-fg-muted leading-[1.7]">{t.about.sub}</p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-30">
        <div className="container-x">
          <div className="mb-15">
            <span className="kicker block mb-4">№ 01 — PEOPLE</span>
            <h2 className="section-title">{t.about.team}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {TEAM.map((m) => (
              <div key={m.name} className="group">
                <div className="aspect-[3/4] bg-surface overflow-hidden mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.img}
                    alt={m.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-all duration-700 grayscale-[30%] saturate-[0.8] group-hover:grayscale-0 group-hover:saturate-100"
                  />
                </div>
                <div className="font-serif text-[22px] mb-1">{m.name}</div>
                <div className="font-mono text-[11px] tracking-[0.12em] text-gold uppercase">{m.role}</div>
                <p className="text-fg-muted text-[13px] mt-2.5 leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bg-sunken border-y border-line py-20 md:py-30">
        <div className="container-x">
          <div className="mb-15">
            <span className="kicker block mb-4">№ 02 — CREDENTIALS</span>
            <h2 className="section-title">{t.about.licenses}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
            {LICENSES.map((l, i) => (
              <div key={l.name} className="bg-bg p-7 md:p-8 min-h-[180px] flex flex-col justify-between">
                <div className="font-mono text-[11px] text-fg-dim tracking-[0.12em]">
                  № {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <div className="font-serif text-[22px] my-3 leading-tight">{l.name}</div>
                  <div className="font-mono text-[11px] text-gold tracking-[0.08em]">{l.detail}</div>
                  <p className="text-fg-muted text-[13px] mt-3.5 leading-relaxed">{l.full}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-30">
        <div className="container-x">
          <div className="mb-10">
            <span className="kicker block mb-4">№ 03 — THE OFFICE</span>
            <h2 className="section-title">{t.about.office}</h2>
            <p className="text-fg-muted max-w-[400px] text-sm mt-5">{t.about.officeSub}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=85',
              'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=85',
            ].map((src, i) => (
              <div key={i} className="aspect-[4/3] bg-surface overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Office ${i + 1}`} loading="lazy" className="w-full h-full object-cover saturate-[0.85]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
