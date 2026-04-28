import Link from 'next/link';
import { getDict } from '@/lib/i18n';
import { getActiveTheme } from '@/lib/theme';
import EditorialServices from '@/components/editorial/services';
import AtomServices from '@/components/atom/services';
import { buildPageMetadata } from '@/lib/seo';

const CORE_ICONS = ['🗺️', '🇹🇷', '📜', '🗣️', '🏠', '🛋️', '💳', '🏦', '📊', '📦'];
const EXTRA_ICONS = ['💎', '💻', '🏢', '📋', '⛵', '🚗', '📖', '🎥'];

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const s = getDict(lang).services;
  return buildPageMetadata({
    lang,
    path: '/services',
    title: s.title,
    description: s.sub,
  });
}

export default async function ServicesPage({ params }) {
  const { lang } = await params;
  const theme = await getActiveTheme();
  if (theme === 'atom') return <AtomServices lang={lang} />;
  if (theme === 'editorial') return <EditorialServices lang={lang} />;
  const t = getDict(lang);
  const s = t.services;

  return (
    <div className="fade-in">
      <section className="pt-[160px] pb-15 border-b border-line">
        <div className="container-x">
          <span className="kicker">{s.kicker}</span>
          <h1 className="font-serif text-[clamp(48px,6vw,88px)] leading-[1.02] tracking-[-0.025em] my-4">
            {s.title}
          </h1>
          <p className="text-fg-muted text-[17px] max-w-[620px]">{s.sub}</p>
          <div className="mt-10 inline-flex items-center gap-4 border border-gold/35 px-6 py-4 bg-gold/5">
            <span className="text-2xl">🚗</span>
            <span className="font-serif text-[18px] md:text-[20px]">{s.motto}</span>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-30">
        <div className="container-x">
          <div className="mb-10">
            <span className="kicker block mb-3">№ 01 — {s.groupMain.toUpperCase()}</span>
            <h2 className="section-title">{s.groupMain}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-line border border-line">
            {s.items.map((item, i) => (
              <div key={i} className="bg-bg p-7 min-h-[220px] flex flex-col gap-4">
                <div className="text-3xl leading-none">{CORE_ICONS[i]}</div>
                <div className="font-mono text-[10px] text-fg-dim tracking-[0.12em]">
                  № {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <div className="font-serif text-[20px] leading-tight mb-2">{item.t}</div>
                  <p className="text-fg-muted text-[13px] leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bg-sunken border-y border-line py-20 md:py-30">
        <div className="container-x">
          <div className="mb-10">
            <span className="kicker block mb-3">№ 02 — {s.groupExtra.toUpperCase()}</span>
            <h2 className="section-title">{s.groupExtra}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line border border-line">
            {s.extras.map((item, i) => (
              <div key={i} className="bg-bg p-6 min-h-[180px] flex flex-col gap-3">
                <div className="text-2xl leading-none">{EXTRA_ICONS[i]}</div>
                <div className="font-serif text-[17px] leading-tight">{item.t}</div>
                <p className="text-fg-muted text-[12px] leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="concierge bg-surface py-20 md:py-25 border-t border-line"
        style={{ backgroundImage: 'radial-gradient(ellipse at top right, rgba(201,168,76,0.08), transparent 50%), radial-gradient(ellipse at bottom left, rgba(201,168,76,0.04), transparent 50%)' }}>
        <div className="container-x relative z-[1] max-w-[760px]">
          <span className="kicker">№ 03 — CONCIERGE</span>
          <h2 className="section-title mt-5 mb-6">{s.ctaTitle}</h2>
          <p className="text-[17px] text-fg-muted mb-10 max-w-[580px]">{s.ctaBody}</p>
          <Link href={`/${lang}/contact`} className="btn btn-gold btn-arrow">{s.ctaBtn}</Link>
        </div>
      </section>
    </div>
  );
}
