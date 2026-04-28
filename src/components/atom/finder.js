'use client';

import { useState } from 'react';
import Link from 'next/link';
import AtomShell from './shell';
import AtomPageHero from './page-hero';
import { getDict } from '@/lib/i18n';

const TOTAL_Q = 7;

function FinderBody({ lang }) {
  const t = getDict(lang);
  const f = t.finder;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const pickOption = (q, val) => {
    setAnswers({ ...answers, [`q${q}`]: val });
    setTimeout(() => setStep((s) => s + 1), 220);
  };

  const setMulti = (key, val) => setAnswers((a) => ({ ...a, [key]: val }));
  const canSubmit = answers.name && answers.email && answers.phone && answers.channel;

  if (step === 0) {
    return (
      <>
        <AtomPageHero
          eyebrow={f.kicker}
          title={f.title}
          sub={f.sub}
        />
        <section className="pb-20">
          <div className="max-w-[760px] mx-auto px-6 md:px-10 text-center">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center justify-center gap-2 px-8 h-12 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
              style={{
                background: 'var(--accent-coral)',
                borderRadius: 'var(--atom-radius-pill)',
                boxShadow: '0 6px 18px rgba(255,107,92,0.35)',
              }}
            >
              {f.start}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </section>
      </>
    );
  }

  if (step > TOTAL_Q) {
    return (
      <section className="pt-32 md:pt-40 pb-20">
        <div className="max-w-[760px] mx-auto px-6 md:px-10 text-center">
          <div
            className="inline-flex items-center justify-center mx-auto mb-6"
            style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--primary-50)', color: 'var(--primary-700)',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="atom-h1" style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', color: 'var(--neutral-900)' }}>
            {f.doneTitle}
          </h2>
          <p className="atom-body-lg mt-4 max-w-[480px] mx-auto" style={{ color: 'var(--neutral-500)' }}>
            {f.doneSub}
          </p>
          <div className="mt-8 flex gap-3 justify-center flex-wrap">
            <button
              type="button"
              onClick={() => { setStep(0); setAnswers({}); }}
              className="inline-flex items-center justify-center px-5 h-11 text-sm font-semibold transition-colors"
              style={{
                background: 'var(--atom-surface)',
                border: '1px solid var(--neutral-200)',
                color: 'var(--neutral-900)',
                borderRadius: 'var(--atom-radius-pill)',
              }}
            >
              {f.startOver}
            </button>
            <Link
              href={`/${lang}`}
              className="inline-flex items-center justify-center px-5 h-11 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
              style={{
                background: 'var(--accent-coral)',
                borderRadius: 'var(--atom-radius-pill)',
                boxShadow: '0 6px 18px rgba(255,107,92,0.35)',
              }}
            >
              {f.returnHome}
            </Link>
          </div>

          <div
            className="mt-10 max-w-[480px] mx-auto p-6 text-left"
            style={{
              background: 'var(--atom-surface)',
              border: '1px solid var(--neutral-200)',
              borderRadius: 'var(--atom-radius-lg)',
            }}
          >
            <div
              className="text-[10px] font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--primary-600)' }}
            >
              {f.enquirySummary}
            </div>
            <div className="text-xs font-mono" style={{ color: 'var(--neutral-700)' }}>
              {Object.entries(answers).map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between gap-4 py-1.5"
                  style={{ borderBottom: '1px solid var(--neutral-100)' }}
                >
                  <span style={{ color: 'var(--neutral-400)' }}>{k.toUpperCase()}</span>
                  <span className="text-right" style={{ color: 'var(--neutral-900)' }}>
                    {String(v).length > 30 ? `${String(v).slice(0, 30)}…` : String(v)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentQ = step;
  const qKey = `q${currentQ}`;
  const qText = f[qKey];
  const qOpts = f[`${qKey}a`];

  return (
    <section className="pt-32 md:pt-40 pb-20">
      <div className="max-w-[760px] mx-auto px-6 md:px-10">
        <div className="flex items-center gap-4 mb-10 justify-between">
          <span
            className="text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap"
            style={{ color: 'var(--neutral-500)' }}
          >
            {f.step} {String(currentQ).padStart(2, '0')} / {String(TOTAL_Q).padStart(2, '0')}
          </span>
          <div className="flex-1 flex gap-1.5">
            {Array.from({ length: TOTAL_Q }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-1 transition-colors duration-500"
                style={{
                  background:
                    i + 1 === currentQ
                      ? 'var(--accent-coral)'
                      : i + 1 < currentQ
                      ? 'var(--primary-400)'
                      : 'var(--neutral-200)',
                  borderRadius: 999,
                }}
              />
            ))}
          </div>
        </div>

        <h2
          className="atom-h2 mb-8"
          style={{ fontSize: 'clamp(26px, 4vw, 40px)', color: 'var(--neutral-900)', letterSpacing: '-0.015em' }}
        >
          {qText}
        </h2>

        {currentQ < 7 && (
          <div className="flex flex-col gap-2 mb-8">
            {qOpts.map((opt) => {
              const selected = answers[qKey] === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => pickOption(currentQ, opt)}
                  className="w-full text-left px-5 py-4 transition-colors"
                  style={{
                    background: selected ? 'var(--primary-50)' : '#fff',
                    border: '1px solid',
                    borderColor: selected ? 'var(--primary-500)' : 'var(--neutral-200)',
                    color: selected ? 'var(--primary-700)' : 'var(--neutral-900)',
                    fontWeight: selected ? 600 : 500,
                    fontSize: 15,
                    borderRadius: 'var(--atom-radius-md)',
                    cursor: 'pointer',
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {currentQ === 7 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Field
              full
              label={f.q7name}
              value={answers.name || ''}
              onChange={(e) => setMulti('name', e.target.value)}
            />
            <Field
              type="email"
              label={f.q7email}
              value={answers.email || ''}
              onChange={(e) => setMulti('email', e.target.value)}
            />
            <Field
              type="tel"
              label={f.q7phone}
              value={answers.phone || ''}
              onChange={(e) => setMulti('phone', e.target.value)}
              placeholder="+—"
            />
            <div className="sm:col-span-2">
              <span
                className="block text-[11px] font-semibold uppercase tracking-wider mb-2"
                style={{ color: 'var(--neutral-400)' }}
              >
                {f.q7channel}
              </span>
              <div className="flex flex-wrap gap-2">
                {f.q7channels.map((c) => {
                  const selected = answers.channel === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setMulti('channel', c)}
                      className="px-4 py-2 text-sm font-semibold transition-colors"
                      style={{
                        background: selected ? 'var(--primary-50)' : '#fff',
                        border: '1px solid',
                        borderColor: selected ? 'var(--primary-500)' : 'var(--neutral-200)',
                        color: selected ? 'var(--primary-700)' : 'var(--neutral-700)',
                        borderRadius: 'var(--atom-radius-pill)',
                      }}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-6" style={{ borderTop: '1px solid var(--neutral-100)' }}>
          <button
            type="button"
            onClick={() => (step > 1 ? setStep(step - 1) : setStep(0))}
            className="text-sm font-semibold transition-colors"
            style={{ color: 'var(--neutral-500)' }}
          >
            ← {f.back}
          </button>
          {currentQ === 7 ? (
            <button
              type="button"
              disabled={!canSubmit}
              onClick={() => canSubmit && setStep(step + 1)}
              className="inline-flex items-center justify-center gap-2 px-6 h-11 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed"
              style={{
                background: 'var(--accent-coral)',
                borderRadius: 'var(--atom-radius-pill)',
                boxShadow: '0 6px 18px rgba(255,107,92,0.35)',
                opacity: canSubmit ? 1 : 0.45,
              }}
            >
              {f.submit}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          ) : (
            <span
              className="text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: 'var(--neutral-400)' }}
            >
              {f.selectToContinue}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder, full }) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? 'sm:col-span-2' : ''}`}>
      <span
        className="text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: 'var(--neutral-400)' }}
      >
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder || '—'}
        className="w-full text-sm px-4"
        style={{
          height: 48,
          border: '1px solid var(--neutral-200)',
          borderRadius: 'var(--atom-radius-md)',
          background: 'var(--neutral-50)',
          color: 'var(--neutral-900)',
        }}
      />
    </label>
  );
}

export default async function AtomFinder({ lang = 'en' }) {
  return (
    <AtomShell lang={lang}>
      <FinderBody lang={lang} />
    </AtomShell>
  );
}
