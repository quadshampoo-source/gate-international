import Link from 'next/link';

export default function EditorialPricingCards({ lang, dict, waHref }) {
  const freeLabel = dict?.team?.chatCta ? null : null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
      {/* Left: dark CTA */}
      <div
        className="relative rounded-[32px] p-8 md:p-11 text-white overflow-hidden"
        style={{ background: '#051A24' }}
      >
        <div className="editorial-grain" />
        <div className="relative">
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-5">№ 01 — Free</div>
          <h3 className="font-editorial text-[32px] md:text-[40px] leading-[1.05] tracking-[-0.01em] mb-4">
            Investment Consultation
          </h3>
          <p className="text-[15px] leading-relaxed text-white/75 mb-8 max-w-[360px]">
            A 45-minute call with one of our directors — market briefing, shortlist of residences, and an outline of the citizenship pathway if relevant.
          </p>
          <ul className="space-y-2 mb-10 text-[14px] text-white/85">
            <li>— Portfolio briefing · Istanbul, Bodrum, Bursa</li>
            <li>— Yield & appreciation breakdown</li>
            <li>— Citizenship eligibility assessment</li>
            <li>— No obligation, no upsell</li>
          </ul>
          <Link
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 h-12 px-6 rounded-full bg-white text-[#051A24] text-[13px] font-medium hover:bg-[#F6FCFF] transition-colors"
          >
            Book a call
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      {/* Right: light CTA */}
      <div
        className="relative rounded-[32px] p-8 md:p-11 overflow-hidden"
        style={{ background: '#F6FCFF', border: '1px solid #E0EBF0', color: '#051A24' }}
      >
        <div
          className="absolute -top-16 -right-16 w-[280px] h-[280px] rounded-full opacity-40"
          style={{ background: 'radial-gradient(closest-side, #C9A84C33, transparent 70%)' }}
        />
        <div className="relative">
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-5">№ 02 — Premium</div>
          <h3 className="font-editorial text-[32px] md:text-[40px] leading-[1.05] tracking-[-0.01em] mb-4">
            Concierge Programme
          </h3>
          <p className="text-[15px] leading-relaxed text-[#273C46] mb-8 max-w-[360px]">
            Full end-to-end representation — from the first shortlist to TAPU registration, interior fit-out, and residency.
          </p>
          <ul className="space-y-2 mb-10 text-[14px] text-[#273C46]">
            <li>— Dedicated director, multilingual</li>
            <li>— Legal, banking, TAPU handled end-to-end</li>
            <li>— Furniture & interior specification</li>
            <li>— Rental & property management options</li>
          </ul>
          <Link
            href={`/${lang}/contact`}
            className="inline-flex items-center gap-3 h-12 px-6 rounded-full bg-[#051A24] text-white text-[13px] font-medium hover:bg-[#0a2a38] transition-colors"
          >
            Contact us
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
