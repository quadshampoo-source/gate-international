import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { FadeIn, ScrollReveal, Stagger } from '@/components/motion';

function renderTitle(title) {
  if (!title || typeof title !== 'string') return title;
  const parts = title.trim().split(/\s+/);
  if (parts.length < 2) return title;
  const last = parts[parts.length - 1];
  const match = last.match(/^(.*?)([.,;:!?"'„”»«]?)$/);
  const core = match ? match[1] : last;
  const punct = match ? match[2] : '';
  const before = parts.slice(0, -1).join(' ');
  return (<>{before}{before ? ' ' : ''}<em className="italic">{core}</em>{punct}</>);
}

const TEAM = [
  { name: 'Emre Altınok', role: 'Founding Partner', bio: 'Twenty years in Istanbul prime. Former BCG. Wharton MBA.' },
  { name: 'Leyla Hanım', role: 'Director · Bosphorus', bio: 'Specialist in the Sarıyer–Kandilli corridor since 2014.' },
  { name: 'Wang Jing 王静', role: 'Head · Greater China', bio: 'Between Istanbul and Shanghai. Native Mandarin, fluent Turkish.' },
  { name: 'Khalid Al-Sabah', role: 'Head · Gulf Region', bio: 'Riyadh office. Serves private offices across the GCC.' },
];

const LICENSES = [
  { name: 'TAPU Certified', detail: 'LIC. 0418-INT-2009', full: 'Turkish Land Registry — authorised foreign-buyer intermediary since 2009.' },
  { name: 'GYODER', detail: 'MEMBER № 14521', full: 'Real Estate Investors Association of Turkey — founding-tier.' },
  { name: 'RE/MAX Global', detail: 'AFFILIATE · 2016', full: 'Global referral network covering 110+ markets.' },
  { name: 'Citizenship by Investment', detail: 'MOI AUTHORISED', full: 'Registered agent for the Republic of Türkiye citizenship programme.' },
  { name: 'TÜRKSAT', detail: 'DATA PROT. CERT.', full: 'ISO-27001 alignment. Client data resides on Turkish servers only.' },
  { name: 'Cemre Özkan Partnership', detail: 'EST. 2009', full: 'In-house counsel specialising in cross-border property transactions.' },
];

function Avatar({ name }) {
  const initials = name.split(/\s+/).map((p) => p[0] || '').join('').slice(0, 2).toUpperCase();
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return (
    <div
      className="w-full aspect-[3/4] rounded-[22px] flex items-end p-5 font-editorial text-[56px] text-white"
      style={{ background: `linear-gradient(135deg, hsl(${h} 40% 52%), hsl(${(h + 40) % 360} 45% 34%))` }}
    >
      {initials}
    </div>
  );
}

export default async function EditorialAbout({ lang }) {
  const t = getDict(lang).about;
  return (
    <div className="fade-in" style={{ background: '#FFFFFF', color: '#051A24' }}>
      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16">
        <div className="container-x">
          <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-8 md:gap-16 items-end">
            <div>
              <FadeIn delay={0.1}>
                <span className="font-mono text-[10px] md:text-[11px] tracking-[0.26em] uppercase text-[#273C46]">
                  {t.kicker}
                </span>
              </FadeIn>
              <FadeIn delay={0.25}>
                <h1 className="font-editorial text-[52px] md:text-[92px] leading-[1.02] tracking-[-0.02em] text-[#051A24] mt-5 md:mt-7">
                  {renderTitle(t.title)}
                </h1>
              </FadeIn>
            </div>
            <FadeIn delay={0.45}>
              <p className="text-[15px] md:text-[17px] leading-relaxed text-[#273C46]">{t.sub}</p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 md:py-28" style={{ background: '#F6FCFF' }}>
        <div className="container-x">
          <ScrollReveal>
            <div className="mb-10 md:mb-14 max-w-[780px]">
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">№ 01 — People</div>
              <h2 className="font-editorial text-[40px] md:text-[64px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
                {renderTitle(t.team)}
              </h2>
            </div>
          </ScrollReveal>
          <Stagger stagger={0.08}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {TEAM.map((m) => (
                <div
                  key={m.name}
                  className="p-5 rounded-[24px] bg-white"
                  style={{ border: '1px solid #E0EBF0', boxShadow: '0 10px 30px rgba(5,26,36,0.05)' }}
                >
                  <Avatar name={m.name} />
                  <div className="font-editorial text-[20px] text-[#051A24] mt-4">{m.name}</div>
                  <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#C9A84C] mt-1">{m.role}</div>
                  <p className="text-[13px] text-[#273C46] mt-2.5 leading-relaxed">{m.bio}</p>
                </div>
              ))}
            </div>
          </Stagger>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-x">
          <ScrollReveal>
            <div className="mb-10 md:mb-14 max-w-[780px]">
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">№ 02 — Credentials</div>
              <h2 className="font-editorial text-[40px] md:text-[64px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
                {renderTitle(t.licenses)}
              </h2>
            </div>
          </ScrollReveal>
          <Stagger stagger={0.06}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {LICENSES.map((l, i) => (
                <div
                  key={l.name}
                  className="p-7 rounded-[22px] flex flex-col"
                  style={{ background: '#F6FCFF', border: '1px solid #E0EBF0' }}
                >
                  <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-2">
                    № {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="font-editorial text-[22px] text-[#051A24] leading-tight mb-2">{l.name}</div>
                  <div className="font-mono text-[10px] tracking-[0.12em] text-[#C9A84C]">{l.detail}</div>
                  <p className="text-[13px] text-[#273C46] mt-3.5 leading-relaxed">{l.full}</p>
                </div>
              ))}
            </div>
          </Stagger>
        </div>
      </section>

      {/* Office */}
      <section className="py-20 md:py-28" style={{ background: '#F6FCFF' }}>
        <div className="container-x">
          <ScrollReveal>
            <div className="mb-10 max-w-[780px]">
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">№ 03 — Office</div>
              <h2 className="font-editorial text-[40px] md:text-[60px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
                {renderTitle(t.office)}
              </h2>
              <p className="text-[15px] text-[#273C46] mt-5 max-w-[480px]">{t.officeSub}</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {['https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=85', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=85'].map((src, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={i}
                src={src}
                alt={`Office ${i + 1}`}
                loading="lazy"
                className="w-full aspect-[4/3] object-cover rounded-[22px]"
                style={{ boxShadow: '0 20px 50px rgba(5,26,36,0.08)' }}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
