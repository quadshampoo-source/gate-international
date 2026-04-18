import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { whatsappLink } from '@/lib/utils';

export default async function CitizenshipPage({ params }) {
  const { lang } = await params;
  const t = getDict(lang);
  const c = t.citizenship;

  return (
    <div className="fade-in">
      <section className="pt-[160px] pb-15 border-b border-line">
        <div className="container-x">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10 items-end">
            <div>
              <span className="kicker">{c.kicker}</span>
              <h1 className="font-serif text-[clamp(48px,6.5vw,96px)] leading-[1.02] tracking-[-0.025em] my-4">
                {c.title}
              </h1>
              <p className="text-fg-muted text-[17px] max-w-[640px]">{c.sub}</p>
            </div>
            <div className="bg-gold/10 border border-gold/40 p-8 text-center">
              <div className="font-serif text-[72px] text-gold leading-none tracking-[-0.02em]">
                $400<span className="font-mono text-[20px] align-top">K</span>
              </div>
              <div className="font-mono text-[10px] tracking-[0.18em] text-gold mt-3">MINIMUM INVESTMENT</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-30">
        <div className="container-x">
          <div className="mb-10">
            <span className="kicker block mb-3">№ 01 — TIMELINE</span>
            <h2 className="section-title">{c.timelineTitle}</h2>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-10 md:gap-x-16">
            {c.steps.map((s, i) => (
              <div key={i} className="contents">
                <div className="flex md:flex-col items-baseline md:items-start gap-4 md:gap-2 mb-2 md:mb-0 relative">
                  <div className="font-serif text-gold text-[40px] md:text-[56px] leading-none tracking-[-0.02em]">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  {i < c.steps.length - 1 && (
                    <div className="hidden md:block w-px h-full bg-gold/30 ml-7 flex-1" />
                  )}
                </div>
                <div className="pb-10 md:pb-12 border-b border-line last:border-b-0">
                  <div className="font-serif text-[22px] md:text-[26px] mb-2 tracking-[-0.01em]">{s.t}</div>
                  <p className="text-fg-muted text-[14px] leading-relaxed max-w-[600px]">{s.d}</p>
                </div>
              </div>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-bg-sunken border-y border-line py-20 md:py-30">
        <div className="container-x">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
            <div>
              <span className="kicker block mb-3">№ 02 — DOCUMENTS</span>
              <h3 className="font-serif text-[32px] mb-6">{c.docsTitle}</h3>
              <ul className="space-y-3">
                {c.docs.map((d, i) => (
                  <li key={i} className="flex items-start gap-3 text-fg-muted text-[15px] leading-relaxed">
                    <span className="text-gold font-mono text-[11px] tracking-wider mt-1 flex-shrink-0">
                      № {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="kicker block mb-3">№ 03 — FAMILY</span>
              <h3 className="font-serif text-[32px] mb-6">{c.familyTitle}</h3>
              <p className="text-fg-muted text-[15px] leading-loose max-w-[540px]">{c.familyBody}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-30">
        <div className="container-x">
          <div className="mb-10">
            <span className="kicker block mb-3">№ 04 — BENEFITS</span>
            <h2 className="section-title">{c.rightsTitle}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-line border border-line">
            {c.rights.map((r, i) => (
              <div key={i} className="bg-bg p-7 min-h-[140px] flex items-start gap-4">
                <span className="font-serif text-gold text-[24px] leading-none">✓</span>
                <span className="font-serif text-[17px] leading-snug">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bg-sunken border-y border-line py-20 md:py-30">
        <div className="container-x">
          <div className="mb-10">
            <span className="kicker block mb-3">№ 05 — FAQ</span>
            <h2 className="section-title">{c.faqTitle}</h2>
          </div>
          <div className="space-y-px bg-line border border-line max-w-[880px]">
            {c.faqs.map((f, i) => (
              <details key={i} className="bg-bg p-6 group">
                <summary className="cursor-pointer flex justify-between items-start gap-4">
                  <span className="font-serif text-[18px] leading-snug flex-1">{f.q}</span>
                  <span className="text-gold font-serif text-[24px] leading-none transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="text-fg-muted text-[14px] leading-relaxed mt-4 pr-6">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="concierge bg-surface py-20 border-t border-line"
        style={{ backgroundImage: 'radial-gradient(ellipse at top right, rgba(201,168,76,0.08), transparent 50%)' }}>
        <div className="container-x relative z-[1] max-w-[760px]">
          <span className="kicker">№ 06 — NEXT STEP</span>
          <h2 className="section-title mt-5 mb-6">{c.consultCta}</h2>
          <form className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 max-w-[560px] mb-6">
            <input
              type="email"
              placeholder={c.email}
              className="px-4 py-3 bg-bg-raised border border-line text-fg placeholder-fg-dim font-serif text-[15px]"
            />
            <button type="button" className="btn btn-outline">{c.pdfCta}</button>
          </form>
          <Link href={whatsappLink('Hello, I would like a Turkish citizenship consultation.')} className="btn btn-gold btn-arrow">
            {c.consultCta}
          </Link>
        </div>
      </section>
    </div>
  );
}
