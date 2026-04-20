'use client';

import Link from 'next/link';
import { useState } from 'react';
import TeamCard from '@/components/team-card';
import { getDict } from '@/lib/i18n';
import { OFFICE_GROUP_ORDER, OFFICE_FLAGS } from '@/lib/team-constants';
import { whatsappLink, WHATSAPP_DEFAULT_MESSAGES } from '@/lib/utils';

function WaIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.52 3.48A11.93 11.93 0 0 0 12.05 0C5.46 0 .1 5.37.1 11.96c0 2.11.55 4.17 1.6 5.98L0 24l6.24-1.63a12 12 0 0 0 5.8 1.48h.01c6.59 0 11.95-5.37 11.95-11.96 0-3.19-1.24-6.19-3.48-8.41z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.84.59 2.8.72A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function renderTitle(title) {
  if (!title || typeof title !== 'string') return title;
  const parts = title.trim().split(/\s+/);
  if (parts.length < 2) return title;
  const last = parts[parts.length - 1];
  const match = last.match(/^(.*?)([.,;:!?"'„”»«]?)$/);
  const core = match ? match[1] : last;
  const punct = match ? match[2] : '';
  const before = parts.slice(0, -1).join(' ');
  return (
    <>
      {before}{before ? ' ' : ''}<em className="italic">{core}</em>{punct}
    </>
  );
}

function OfficePill({ flag, title, address, hours }) {
  return (
    <div
      className="p-6 md:p-7 rounded-[22px]"
      style={{ background: '#FFFFFF', border: '1px solid #E0EBF0', boxShadow: '0 10px 30px rgba(5,26,36,0.05)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[18px] leading-none">{flag}</span>
        <div className="font-editorial text-[20px] text-[#051A24]">{title}</div>
      </div>
      <div className="text-[13px] text-[#273C46] leading-relaxed whitespace-pre-line mb-4">
        {address}
      </div>
      <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#C9A84C] whitespace-pre-line">
        {hours}
      </div>
    </div>
  );
}

export default function EditorialContact({ lang, teamGroups = {} }) {
  const t = getDict(lang);
  const [sent, setSent] = useState(false);

  const waHref = whatsappLink(WHATSAPP_DEFAULT_MESSAGES[lang] || WHATSAPP_DEFAULT_MESSAGES.en, lang);

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="fade-in" style={{ background: '#FFFFFF', color: '#051A24' }}>
      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-12">
        <div className="container-x text-center">
          <span className="font-mono text-[10px] md:text-[11px] tracking-[0.26em] uppercase text-[#273C46]">
            {t.contact.kicker}
          </span>
          <h1 className="font-editorial text-[48px] md:text-[76px] leading-[1.02] tracking-[-0.02em] text-[#051A24] mt-5 md:mt-7 max-w-[820px] mx-auto">
            {renderTitle(t.contact.title)}
          </h1>
          <p className="text-[15px] md:text-[17px] leading-relaxed text-[#273C46] max-w-[540px] mx-auto mt-6">
            {t.contact.sub}
          </p>
        </div>
      </section>

      {/* Channel pills */}
      <section className="pb-16">
        <div className="container-x flex flex-wrap justify-center gap-3">
          <Link
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 h-12 px-6 rounded-full text-white text-[13px] font-medium transition-colors"
            style={{ background: '#25D366' }}
          >
            <WaIcon /> {t.contact.whatsapp}
          </Link>
          <a
            href="mailto:concierge@gateinternational.com"
            className="inline-flex items-center gap-2.5 h-12 px-6 rounded-full bg-[#051A24] text-white text-[13px] font-medium hover:bg-[#0a2a38] transition-colors"
          >
            <EmailIcon /> concierge@gateinternational.com
          </a>
          <a
            href="tel:+902120001453"
            className="inline-flex items-center gap-2.5 h-12 px-6 rounded-full text-[#051A24] text-[13px] font-medium transition-colors"
            style={{ background: '#FFFFFF', border: '1px solid #E0EBF0' }}
          >
            <PhoneIcon /> +90 212 000 1453
          </a>
        </div>
      </section>

      {/* Offices */}
      <section className="pb-20" style={{ background: '#F6FCFF' }}>
        <div className="container-x pt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <OfficePill flag="🇹🇷" title={t.contact.office} address={t.contact.address} hours={t.contact.hours} />
            <OfficePill flag="🇸🇦" title={t.contactExtra.riyadhOffice} address={t.contactExtra.riyadhAddress} hours={t.contactExtra.riyadhHours} />
            <OfficePill flag="🇨🇳" title={t.contactExtra.shanghaiOffice} address={t.contactExtra.shanghaiAddress} hours={t.contactExtra.shanghaiHours} />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-x">
          <div className="mb-10 md:mb-14 text-center max-w-[680px] mx-auto">
            <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">№ 01 — Directors</div>
            <h2 className="font-editorial text-[40px] md:text-[60px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
              {renderTitle(t.team.title)}
            </h2>
            <p className="text-[15px] md:text-[17px] leading-relaxed text-[#273C46] mt-5">
              {t.team.sub}
            </p>
          </div>

          <div className="space-y-12">
            {OFFICE_GROUP_ORDER.map((office) => {
              const members = teamGroups[office] || [];
              if (office === 'china' && members.length === 0) {
                return (
                  <div key={office}>
                    <div className="flex items-center gap-3 mb-5 justify-center">
                      <span className="text-[20px] leading-none">{OFFICE_FLAGS[office]}</span>
                      <h3 className="font-editorial text-[24px] text-[#051A24]">{t.team.offices[office]}</h3>
                      <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#C9A84C] border border-[#C9A84C]/40 rounded-full px-3 py-1">
                        {t.team.chinaSoon}
                      </span>
                    </div>
                    <div
                      className="p-8 rounded-[22px] text-center max-w-[680px] mx-auto"
                      style={{ background: '#F6FCFF', border: '1px solid #E0EBF0' }}
                    >
                      <p className="text-[15px] leading-relaxed text-[#273C46] mb-5">
                        {t.team.chinaSoonBody}
                      </p>
                    </div>
                  </div>
                );
              }
              if (members.length === 0) return null;
              return (
                <div key={office}>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[20px] leading-none">{OFFICE_FLAGS[office]}</span>
                    <h3 className="font-editorial text-[24px] text-[#051A24]">{t.team.offices[office]}</h3>
                    <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#273C46]/60">· {members.length}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {members.map((m) => (
                      <TeamCard key={m.id} member={m} lang={lang} dict={t} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 md:py-28" style={{ background: '#F6FCFF' }}>
        <div className="container-x max-w-[780px]">
          <div className="text-center mb-10">
            <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-3">№ 02 — Enquiry</div>
            <h2 className="font-editorial text-[36px] md:text-[52px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
              {renderTitle(t.contact.formTitle)}
            </h2>
          </div>
          <form onSubmit={onSubmit} className="rounded-[32px] bg-white p-8 md:p-10" style={{ border: '1px solid #E0EBF0', boxShadow: '0 30px 80px rgba(5,26,36,0.08)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder={t.contact.name}
                className="h-12 px-5 rounded-full text-[14px] text-[#051A24] placeholder:text-[#273C46]/60"
                style={{ background: '#F6FCFF', border: '1px solid #E0EBF0' }}
                required
              />
              <input
                type="email"
                placeholder={t.contact.email}
                className="h-12 px-5 rounded-full text-[14px] text-[#051A24] placeholder:text-[#273C46]/60"
                style={{ background: '#F6FCFF', border: '1px solid #E0EBF0' }}
                required
              />
            </div>
            <input
              type="tel"
              placeholder={t.contact.phone}
              className="w-full h-12 px-5 rounded-full text-[14px] text-[#051A24] placeholder:text-[#273C46]/60 mb-4"
              style={{ background: '#F6FCFF', border: '1px solid #E0EBF0' }}
            />
            <textarea
              placeholder={t.contact.message}
              rows={5}
              className="w-full p-5 rounded-[20px] text-[14px] text-[#051A24] placeholder:text-[#273C46]/60 resize-y mb-5"
              style={{ background: '#F6FCFF', border: '1px solid #E0EBF0' }}
              required
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-3 h-12 px-6 rounded-full bg-[#051A24] text-white text-[13px] font-medium hover:bg-[#0a2a38] transition-colors"
              >
                {sent ? `✓ ${t.contact.sent}` : t.contact.send}
                <span aria-hidden>→</span>
              </button>
              {sent && (
                <span className="text-[13px] text-[#273C46]">We respond within the day.</span>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
