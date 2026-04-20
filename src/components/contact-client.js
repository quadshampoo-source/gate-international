'use client';

import Link from 'next/link';
import { useState } from 'react';
import { WhatsappIcon, WechatIcon, MailIcon, PhoneIcon, CheckIcon, FakeQR } from '@/components/icons';
import TeamCard from '@/components/team-card';
import { whatsappLink } from '@/lib/utils';
import { getDict } from '@/lib/i18n';
import { OFFICE_GROUP_ORDER, OFFICE_FLAGS } from '@/lib/team-constants';

export default function ContactClient({ lang, teamGroups = {} }) {
  const t = getDict(lang);
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="fade-in">
      <section className="pt-[160px] pb-15">
        <div className="container-x">
          <span className="kicker">{t.contact.kicker}</span>
          <h1 className="font-serif text-[clamp(48px,6vw,88px)] leading-[1.02] tracking-[-0.025em] my-4">
            {t.contact.title}
          </h1>
          <p className="text-fg-muted text-[17px] max-w-[540px]">{t.contact.sub}</p>
        </div>
      </section>

      {/* Team — grouped by office/desk */}
      <section className="pb-20">
        <div className="container-x">
          <div className="mb-10">
            <h2 className="section-title">{t.team.title}</h2>
            <p className="text-fg-muted text-[15px] max-w-[620px] mt-3">{t.team.sub}</p>
          </div>
          <div className="space-y-12">
            {OFFICE_GROUP_ORDER.map((office) => {
              const members = teamGroups[office] || [];
              // Special China handling: if no active members, render "coming soon" banner.
              if (office === 'china' && members.length === 0) {
                return (
                  <div key={office}>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-[20px] leading-none">{OFFICE_FLAGS[office]}</span>
                      <h3 className="font-serif text-[24px] tracking-[-0.01em]">{t.team.offices[office]}</h3>
                      <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-gold border border-gold/40 rounded-full px-3 py-1">
                        {t.team.chinaSoon}
                      </span>
                    </div>
                    <div
                      className="p-8 rounded-[22px] backdrop-blur-xl bg-bg-raised/40"
                      style={{ border: '0.5px solid rgba(255,255,255,0.12)' }}
                    >
                      <p className="text-fg-muted text-[15px] leading-relaxed mb-5 max-w-[640px]">
                        {t.team.chinaSoonBody}
                      </p>
                      <Link
                        href="#top"
                        onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="inline-flex items-center gap-2 h-10 px-5 rounded-xl border border-gold/35 text-gold hover:bg-gold/10 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors"
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
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[20px] leading-none">{OFFICE_FLAGS[office]}</span>
                    <h3 className="font-serif text-[24px] tracking-[-0.01em]">{t.team.offices[office]}</h3>
                    <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-fg-dim">
                      · {members.length}
                    </span>
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

      <div className="container-x">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 pb-30">
          <div>
            <div className="flex flex-col gap-px bg-line border border-line">
              <a href={whatsappLink('Hello, I would like to enquire.', lang)} target="_blank" rel="noreferrer" className="bg-bg px-7 py-6 flex items-center gap-5 cursor-pointer transition-colors hover:bg-bg-raised">
                <div className="w-11 h-11 flex items-center justify-center text-bg flex-shrink-0" style={{ background: '#25D366', borderColor: '#25D366' }}>
                  <WhatsappIcon />
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.16em] text-fg-muted uppercase mb-1">
                    {t.contact.whatsapp}
                  </div>
                  <div className="font-serif text-[18px]">+90 212 000 1453</div>
                </div>
              </a>
              <a
                href="#wechat-qr-box"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('wechat-qr-box')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="bg-bg px-7 py-6 flex items-center gap-5 cursor-pointer transition-colors hover:bg-bg-raised"
              >
                <div className="w-11 h-11 flex items-center justify-center text-bg flex-shrink-0" style={{ background: '#07C160', borderColor: '#07C160' }}>
                  <WechatIcon />
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.16em] text-fg-muted uppercase mb-1">
                    {t.contact.wechat}
                  </div>
                  <div className="font-serif text-[18px]">GateIntl_Istanbul</div>
                </div>
              </a>
              <a href="mailto:concierge@gateinternational.com" className="bg-bg px-7 py-6 flex items-center gap-5 cursor-pointer transition-colors hover:bg-bg-raised">
                <div className="w-11 h-11 border border-gold/35 flex items-center justify-center text-gold flex-shrink-0">
                  <MailIcon />
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.16em] text-fg-muted uppercase mb-1">
                    {t.contact.emailLabel}
                  </div>
                  <div className="font-serif text-[18px]">concierge@gateinternational.com</div>
                </div>
              </a>
              <a href="tel:+902120001453" className="bg-bg px-7 py-6 flex items-center gap-5 cursor-pointer transition-colors hover:bg-bg-raised">
                <div className="w-11 h-11 border border-gold/35 flex items-center justify-center text-gold flex-shrink-0">
                  <PhoneIcon />
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.16em] text-fg-muted uppercase mb-1">
                    {t.contact.phoneLabel}
                  </div>
                  <div className="font-serif text-[18px]">+90 212 000 1453</div>
                </div>
              </a>
            </div>

            <div className="grid grid-cols-1 gap-px bg-line border border-line mt-6">
              <OfficeBlock
                title={t.contact.office}
                address={t.contact.address}
                hoursLabel={t.contactExtra ? t.contact.hoursLabel : 'HOURS'}
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

            <div id="wechat-qr-box" className="p-6 bg-bg-raised border border-line flex items-center gap-5 mt-6">
              <div className="w-[100px] h-[100px] p-1.5 bg-white flex-shrink-0">
                <FakeQR />
              </div>
              <div>
                <div className="font-mono text-[10px] tracking-[0.16em] text-fg-muted mb-1.5">
                  WECHAT · 微信
                </div>
                <div className="font-serif text-[18px] mb-1">{t.contact.scanWechat}</div>
                <div className="font-mono text-[11px] text-gold tracking-[0.08em]">ID: GateIntl_Istanbul</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-[32px] mb-6 tracking-[-0.01em]">{t.contact.formTitle}</h3>
            <form onSubmit={onSubmit} className="flex flex-col gap-0.5">
              <div className="form-field">
                <label>{t.contact.name}</label>
                <input type="text" required placeholder="—" />
              </div>
              <div className="form-field">
                <label>{t.contact.email}</label>
                <input type="email" required placeholder="—" />
              </div>
              <div className="form-field">
                <label>{t.contact.phone}</label>
                <input type="tel" placeholder="+—" />
              </div>
              <div className="form-field">
                <label>{t.contact.message}</label>
                <textarea rows="4" required placeholder="—" />
              </div>
              <button type="submit" className="btn btn-gold btn-arrow self-start mt-4">
                {sent ? (
                  <>
                    <CheckIcon /> {t.contact.sent}
                  </>
                ) : (
                  t.contact.send
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function OfficeBlock({ title, address, hoursLabel, hours }) {
  return (
    <div className="px-7 py-6 bg-surface">
      <h4 className="font-mono text-[10px] tracking-[0.16em] text-gold uppercase mb-3 font-normal">{title}</h4>
      <p className="font-serif text-[17px] whitespace-pre-line leading-snug mb-3">{address}</p>
      <div className="border-t border-line pt-3 mt-3">
        <h4 className="font-mono text-[10px] tracking-[0.16em] text-gold uppercase mb-2 font-normal">{hoursLabel}</h4>
        <p className="font-mono text-[13px] whitespace-pre-line leading-snug text-fg-muted">{hours}</p>
      </div>
    </div>
  );
}
