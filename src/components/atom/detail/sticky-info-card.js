'use client';

import { useState } from 'react';
import ScheduleViewingModal from './schedule-viewing-modal';
import BottomSheet from './bottom-sheet';
import { getDict } from '@/lib/i18n';

const ADVISOR = {
  phone: '+90 535 520 6339',
  whatsappNumber: '905355206339',
  photo: null,
};

const fmtUsd = (n) => {
  if (!n && n !== 0) return null;
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return null;
  return `$${v.toLocaleString()}`;
};

// Sticky right rail on desktop. On mobile renders a fixed bottom CTA bar
// with a "View options" button that opens the same content in a bottom
// sheet.
export default function StickyInfoCard({ project, lang = 'en' }) {
  const t = getDict(lang).pages.detail.stickyCard;
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const price = project.priceUsd ?? project.price_usd;
  const priceLabel = fmtUsd(price);
  const paymentPlan = project.payment_plan || project.paymentPlan;
  const brochureUrl = project.brochure_url || project.brochureUrl;
  const masterPlanUrl = project.master_plan_url || project.masterPlanUrl;
  const priceNote = project.price_note || project.priceNote;
  const waMsg = encodeURIComponent(t.waMessageTemplate.replace('{project}', project.name));
  const waHref = `https://wa.me/${ADVISOR.whatsappNumber}?text=${waMsg}`;

  const cardBody = (
    <CardBody
      project={project}
      priceLabel={priceLabel}
      priceNote={priceNote}
      paymentPlan={paymentPlan}
      brochureUrl={brochureUrl}
      masterPlanUrl={masterPlanUrl}
      t={t}
      waHref={waHref}
      onSchedule={() => setScheduleOpen(true)}
    />
  );

  return (
    <>
      {/* desktop sticky rail */}
      <aside
        className="hidden md:block sticky"
        style={{ top: 96, alignSelf: 'start' }}
      >
        <div
          style={{
            background: 'var(--atom-surface)',
            border: '1px solid var(--neutral-200)',
            borderRadius: 'var(--atom-radius-xl)',
            boxShadow: 'var(--atom-shadow-lg)',
            padding: 24,
          }}
        >
          {cardBody}
        </div>
      </aside>

      {/* mobile fixed bottom bar — flagged with cta-sticky + cta-with-wa so the
          floating WhatsApp FAB hides itself via :has() (see whatsapp-fab.js). */}
      <div
        className="cta-sticky cta-with-wa visible md:hidden fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 px-4 py-3"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--neutral-200)',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
          boxShadow: '0 -8px 24px rgba(15,22,36,0.08)',
        }}
      >
        <div className="flex flex-col flex-1 min-w-0">
          {priceLabel && (
            <>
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--neutral-400)' }}>
                {t.from}
              </span>
              <span className="text-base font-bold truncate" style={{ color: 'var(--neutral-900)' }}>
                {priceLabel}
              </span>
            </>
          )}
        </div>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.whatsappAdvisor}
          className="inline-flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105 active:scale-95"
          style={{
            width: 44, height: 44,
            borderRadius: '50%',
            background: '#25D366',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(37,211,102,0.35)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="inline-flex items-center justify-center px-5 h-11 text-sm font-semibold text-white flex-shrink-0"
          style={{
            background: 'var(--accent-coral)',
            borderRadius: 'var(--atom-radius-pill)',
            boxShadow: '0 4px 12px rgba(255,107,92,0.35)',
          }}
        >
          {t.viewOptions}
        </button>
      </div>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={t.reachAdvisor} closeLabel={getDict(lang).pages.detail.scheduleViewing.close}>
        <div className="px-5 pb-6">
          {cardBody}
        </div>
      </BottomSheet>

      <ScheduleViewingModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        projectName={project.name}
        lang={lang}
      />
    </>
  );
}

function CardBody({ project, priceLabel, priceNote, paymentPlan, brochureUrl, masterPlanUrl, t, waHref, onSchedule }) {
  // Stages array introduced in March 2026 — collapse it to a short summary
  // here; the full timeline lives in PaymentPlanTimeline on the page body.
  const planSummary = (() => {
    if (!paymentPlan) return null;
    if (paymentPlan.downPct) {
      const months = paymentPlan.totalMonths || paymentPlan.termMonths;
      return months
        ? t.downPctTemplate.replace('{pct}', paymentPlan.downPct).replace('{months}', months)
        : t.downPctNoMonths.replace('{pct}', paymentPlan.downPct);
    }
    return null;
  })();

  return (
    <div>
      {priceLabel && (
        <div className="mb-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--neutral-400)' }}>
            {t.from}
          </span>
          <div className="text-3xl font-bold" style={{ color: 'var(--neutral-900)' }}>
            {priceLabel}
          </div>
          {priceNote && (
            <div className="mt-1 text-[11px] leading-snug" style={{ color: 'var(--neutral-500)' }}>
              {priceNote}
            </div>
          )}
        </div>
      )}

      {planSummary && (
        <div className="mt-2 mb-3 text-xs" style={{ color: 'var(--neutral-500)' }}>
          {planSummary}
        </div>
      )}

      <div className="flex flex-col gap-2 mt-4">
        <button
          type="button"
          onClick={onSchedule}
          className="inline-flex items-center justify-center w-full h-12 text-sm font-semibold text-white transition-transform hover:scale-[1.01]"
          style={{
            background: 'var(--accent-coral)',
            borderRadius: 'var(--atom-radius-pill)',
            boxShadow: '0 6px 18px rgba(255,107,92,0.35)',
          }}
        >
          {t.schedule}
        </button>

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full h-12 text-sm font-semibold transition-colors"
          style={{
            background: 'var(--atom-surface)',
            border: '1px solid var(--neutral-200)',
            borderRadius: 'var(--atom-radius-pill)',
            color: 'var(--neutral-900)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden style={{ color: '#25D366' }}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {t.whatsappAdvisor}
        </a>

        {brochureUrl && (
          <a
            href={brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full h-11 text-sm font-semibold transition-colors"
            style={{
              background: 'var(--atom-surface)',
              border: '1px solid var(--neutral-300)',
              borderRadius: 'var(--atom-radius-pill)',
              color: 'var(--neutral-900)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {t.brochure}
          </a>
        )}

        {masterPlanUrl && (
          <a
            href={masterPlanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full h-11 text-sm font-medium transition-colors"
            style={{
              background: 'transparent',
              border: '1px dashed var(--neutral-300)',
              borderRadius: 'var(--atom-radius-pill)',
              color: 'var(--neutral-700)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
            {t.masterPlan}
          </a>
        )}
      </div>

      <div className="mt-5 pt-5 flex items-center gap-3" style={{ borderTop: '1px solid var(--neutral-200)' }}>
        <div
          className="flex-shrink-0 inline-flex items-center justify-center"
          style={{
            width: 44, height: 44,
            borderRadius: '50%',
            background: 'var(--primary-50)',
            color: 'var(--primary-700)',
          }}
        >
          {ADVISOR.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ADVISOR.photo} alt="" className="w-full h-full object-cover rounded-full" />
          ) : (
            <span className="text-sm font-bold">IA</span>
          )}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold" style={{ color: 'var(--neutral-900)' }}>
            {t.advisorName}
          </div>
          <a
            href={`tel:${ADVISOR.phone.replace(/\s/g, '')}`}
            className="text-xs"
            style={{ color: 'var(--neutral-500)' }}
          >
            {ADVISOR.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
