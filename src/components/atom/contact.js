'use client';

import { useState } from 'react';
import Link from 'next/link';
import AtomShell from './shell';
import AtomPageHero from './page-hero';
import AtomTeamCard from './team-card';
import { whatsappLink } from '@/lib/utils';
import { getDict } from '@/lib/i18n';
import { OFFICE_GROUP_ORDER, OFFICE_FLAGS } from '@/lib/team-constants';

function ContactBody({ lang, teamGroups }) {
  const t = getDict(lang);
  const heroT = t.pages.contact.hero;
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <>
      <AtomPageHero
        eyebrow={heroT.eyebrow}
        title={<>{heroT.titleLead} <span className="atom-accent">{heroT.titleHighlight}</span></>}
        sub={heroT.sub}
      />

      {/* Team grouped by office */}
      <section className="pb-12 md:pb-16">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: 'var(--neutral-900)', letterSpacing: '-0.02em' }}>
              {t.team.title}
            </h2>
            <p className="mt-2 text-sm md:text-base max-w-[640px]" style={{ color: 'var(--neutral-500)' }}>
              {t.team.sub}
            </p>
          </div>

          <div className="space-y-10">
            {OFFICE_GROUP_ORDER.map((office) => {
              const members = teamGroups[office] || [];
              if (office === 'china' && members.length === 0) {
                return (
                  <div key={office}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xl leading-none">{OFFICE_FLAGS[office]}</span>
                      <h3 className="text-lg font-semibold" style={{ color: 'var(--neutral-900)' }}>
                        {t.team.offices[office]}
                      </h3>
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1"
                        style={{
                          background: 'var(--primary-50)',
                          color: 'var(--primary-700)',
                          border: '1px solid var(--primary-200)',
                          borderRadius: 'var(--atom-radius-pill)',
                        }}
                      >
                        {t.team.chinaSoon}
                      </span>
                    </div>
                    <div
                      className="p-6"
                      style={{
                        background: '#fff',
                        border: '1px solid var(--neutral-200)',
                        borderRadius: 'var(--atom-radius-lg)',
                      }}
                    >
                      <p className="text-sm md:text-base leading-relaxed mb-4" style={{ color: 'var(--neutral-700)' }}>
                        {t.team.chinaSoonBody}
                      </p>
                      <Link
                        href="#top"
                        onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold"
                        style={{ color: 'var(--primary-600)' }}
                      >
                        {t.team.chinaSoonCta}
                      </Link>
                    </div>
                  </div>
                );
              }
              if (members.length === 0) return null;
              return (
                <div key={office}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl leading-none">{OFFICE_FLAGS[office]}</span>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--neutral-900)' }}>
                      {t.team.offices[office]}
                    </h3>
                    <span
                      className="text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--neutral-400)' }}
                    >
                      · {members.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.map((m) => (
                      <AtomTeamCard key={m.id} member={m} lang={lang} dict={t} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Two-column: methods + offices vs form */}
      <section className="pb-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Methods + offices column */}
            <div className="flex flex-col gap-5">
              <ContactRow
                href={whatsappLink('Hello, I would like to enquire.', lang)}
                external
                icon={<WhatsAppGlyph />}
                iconBg="#25D366"
                label={t.contact.whatsapp}
                value="+90 212 000 1453"
              />
              <ContactRow
                href="#wechat-qr-box"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('wechat-qr-box')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                icon={<WeChatGlyph />}
                iconBg="#07C160"
                label={t.contact.wechat}
                value="GateIntl_Istanbul"
              />
              <ContactRow
                href="mailto:concierge@gateinternational.com"
                icon={<MailGlyph />}
                iconBg="var(--primary-50)"
                iconColor="var(--primary-700)"
                label={t.contact.emailLabel}
                value="concierge@gateinternational.com"
              />
              <ContactRow
                href="tel:+902120001453"
                icon={<PhoneGlyph />}
                iconBg="var(--primary-50)"
                iconColor="var(--primary-700)"
                label={t.contact.phoneLabel}
                value="+90 212 000 1453"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                <OfficeBlock
                  title={t.contact.office}
                  address={t.contact.address}
                  hoursLabel={t.contact.hoursLabel}
                  hours={t.contact.hours}
                />
                <OfficeBlock
                  title={t.contactExtra?.riyadhOffice || 'Riyadh Office'}
                  address={t.contactExtra?.riyadhAddress || 'King Fahd Road\nRiyadh'}
                  hoursLabel={t.contact.hoursLabel}
                  hours={t.contactExtra?.riyadhHours || 'Sun — Thu'}
                />
                <OfficeBlock
                  title={t.contactExtra?.shanghaiOffice || 'Shanghai Office'}
                  address={t.contactExtra?.shanghaiAddress || 'Huaihai Road\nShanghai'}
                  hoursLabel={t.contact.hoursLabel}
                  hours={t.contactExtra?.shanghaiHours || 'Mon — Fri'}
                />
              </div>

              <div
                id="wechat-qr-box"
                className="p-5 mt-2 flex items-center gap-4"
                style={{
                  background: '#fff',
                  border: '1px solid var(--neutral-200)',
                  borderRadius: 'var(--atom-radius-lg)',
                }}
              >
                <div
                  className="w-[88px] h-[88px] flex-shrink-0 grid place-items-center"
                  style={{ background: 'var(--neutral-100)', borderRadius: 'var(--atom-radius-md)' }}
                >
                  <FakeQR />
                </div>
                <div>
                  <div
                    className="text-[10px] font-semibold uppercase tracking-wider mb-1"
                    style={{ color: 'var(--neutral-400)' }}
                  >
                    WECHAT · 微信
                  </div>
                  <div className="text-base font-semibold mb-0.5" style={{ color: 'var(--neutral-900)' }}>
                    {t.contact.scanWechat}
                  </div>
                  <div className="text-xs font-mono" style={{ color: 'var(--primary-600)' }}>
                    ID: GateIntl_Istanbul
                  </div>
                </div>
              </div>
            </div>

            {/* Form column */}
            <div
              className="p-6 md:p-8"
              style={{
                background: '#fff',
                border: '1px solid var(--neutral-200)',
                borderRadius: 'var(--atom-radius-xl)',
                boxShadow: 'var(--atom-shadow-md)',
                alignSelf: 'start',
              }}
            >
              <h3 className="text-xl font-semibold mb-5" style={{ color: 'var(--neutral-900)' }}>
                {t.contact.formTitle}
              </h3>
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <Field label={t.contact.name} required type="text" />
                <Field label={t.contact.email} required type="email" />
                <Field label={t.contact.phone} type="tel" placeholder="+—" />
                <Field label={t.contact.message} required textarea />
                <button
                  type="submit"
                  className="mt-2 inline-flex items-center justify-center gap-2 h-12 text-sm font-semibold text-white transition-transform hover:scale-[1.01]"
                  style={{
                    background: 'var(--accent-coral)',
                    borderRadius: 'var(--atom-radius-pill)',
                    boxShadow: '0 6px 18px rgba(255,107,92,0.35)',
                  }}
                >
                  {sent ? (
                    <>
                      <CheckGlyph /> {t.contact.sent}
                    </>
                  ) : (
                    t.contact.send
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactRow({ href, external, onClick, icon, iconBg, iconColor = '#fff', label, value }) {
  const Anchor = external ? 'a' : (href?.startsWith('#') ? 'a' : 'a');
  const props = external ? { target: '_blank', rel: 'noreferrer' } : {};
  return (
    <Anchor
      href={href}
      onClick={onClick}
      {...props}
      className="flex items-center gap-4 p-4 transition-colors hover:bg-[var(--neutral-50)]"
      style={{
        background: '#fff',
        border: '1px solid var(--neutral-200)',
        borderRadius: 'var(--atom-radius-lg)',
        textDecoration: 'none',
      }}
    >
      <span
        className="inline-grid place-items-center flex-shrink-0"
        style={{ width: 44, height: 44, borderRadius: 'var(--atom-radius-md)', background: iconBg, color: iconColor }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <div
          className="text-[10px] font-semibold uppercase tracking-wider mb-0.5"
          style={{ color: 'var(--neutral-400)' }}
        >
          {label}
        </div>
        <div className="text-base font-semibold truncate" style={{ color: 'var(--neutral-900)' }}>
          {value}
        </div>
      </div>
    </Anchor>
  );
}

function OfficeBlock({ title, address, hoursLabel, hours }) {
  return (
    <div
      className="p-4"
      style={{
        background: '#fff',
        border: '1px solid var(--neutral-200)',
        borderRadius: 'var(--atom-radius-md)',
      }}
    >
      <h4
        className="text-[10px] font-semibold uppercase tracking-wider mb-2"
        style={{ color: 'var(--primary-600)' }}
      >
        {title}
      </h4>
      <p className="text-sm whitespace-pre-line leading-snug" style={{ color: 'var(--neutral-900)' }}>
        {address}
      </p>
      <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--neutral-100)' }}>
        <h4
          className="text-[10px] font-semibold uppercase tracking-wider mb-1"
          style={{ color: 'var(--primary-600)' }}
        >
          {hoursLabel}
        </h4>
        <p className="text-xs whitespace-pre-line leading-snug" style={{ color: 'var(--neutral-500)' }}>
          {hours}
        </p>
      </div>
    </div>
  );
}

function Field({ label, required, type = 'text', textarea, placeholder }) {
  const baseStyle = {
    border: '1px solid var(--neutral-200)',
    borderRadius: 'var(--atom-radius-md)',
    background: 'var(--neutral-50)',
    color: 'var(--neutral-900)',
  };
  return (
    <label className="flex flex-col gap-1.5">
      <span
        className="text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: 'var(--neutral-400)' }}
      >
        {label}{required ? ' *' : ''}
      </span>
      {textarea ? (
        <textarea
          required={required}
          placeholder={placeholder || '—'}
          rows={4}
          className="w-full text-sm px-4 py-3"
          style={{ ...baseStyle, resize: 'vertical' }}
        />
      ) : (
        <input
          type={type}
          required={required}
          placeholder={placeholder || '—'}
          className="w-full text-sm px-4"
          style={{ ...baseStyle, height: 48 }}
        />
      )}
    </label>
  );
}

function WhatsAppGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.52 3.48A11.93 11.93 0 0 0 12.05 0C5.46 0 .1 5.37.1 11.96c0 2.11.55 4.17 1.6 5.98L0 24l6.24-1.63a12 12 0 0 0 5.8 1.48h.01c6.59 0 11.95-5.37 11.95-11.96 0-3.19-1.24-6.19-3.48-8.41zm-8.47 18.4h-.01a9.93 9.93 0 0 1-5.06-1.39l-.36-.22-3.71.97.99-3.6-.24-.37a9.91 9.91 0 0 1-1.52-5.31c0-5.48 4.46-9.93 9.95-9.93a9.93 9.93 0 0 1 7.02 2.91 9.86 9.86 0 0 1 2.92 7.03c0 5.48-4.47 9.93-9.98 9.93zm5.45-7.43c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.48 1.69.62.71.23 1.35.2 1.86.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
    </svg>
  );
}

function WeChatGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9.5 4C5.36 4 2 6.69 2 10c0 1.74.95 3.31 2.46 4.42L4 16l1.97-1.04A8.6 8.6 0 0 0 9.5 16h.5a6.7 6.7 0 0 1-.06-.83C9.94 12.32 12.7 10 16 10c.45 0 .9.04 1.32.13C16.85 6.78 13.6 4 9.5 4Zm-2.5 4.4a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Zm5 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z" />
      <path d="M16 11c-3.31 0-6 2.24-6 5s2.69 5 6 5c.81 0 1.59-.13 2.3-.37L20 22l-.4-1.36C21.06 19.65 22 18.4 22 17c0-2.76-2.69-5-6-5Zm-2 3.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Zm4 0a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Z" />
    </svg>
  );
}

function MailGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PhoneGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function FakeQR() {
  return (
    <svg viewBox="0 0 80 80" width="72" height="72" aria-hidden>
      <rect width="80" height="80" fill="#fff" />
      <g fill="var(--neutral-900)">
        {Array.from({ length: 64 }).map((_, i) => {
          const r = Math.floor(i / 8);
          const c = i % 8;
          const filled = (r * 7 + c * 13) % 3 === 0;
          if (!filled) return null;
          return <rect key={i} x={c * 9 + 4} y={r * 9 + 4} width={8} height={8} />;
        })}
        <rect x="4" y="4" width="22" height="22" fill="none" stroke="var(--neutral-900)" strokeWidth="3" />
        <rect x="54" y="4" width="22" height="22" fill="none" stroke="var(--neutral-900)" strokeWidth="3" />
        <rect x="4" y="54" width="22" height="22" fill="none" stroke="var(--neutral-900)" strokeWidth="3" />
      </g>
    </svg>
  );
}

export default async function AtomContact({ lang = 'en', team = {} }) {
  return (
    <AtomShell lang={lang}>
      <ContactBody lang={lang} teamGroups={team} />
    </AtomShell>
  );
}
