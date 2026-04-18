'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon } from '@/components/icons';
import { getDict } from '@/lib/i18n';

const TOTAL_Q = 7;

export default function FinderClient({ lang }) {
  const t = getDict(lang);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const pickOption = (q, val) => {
    setAnswers({ ...answers, [`q${q}`]: val });
    setTimeout(() => setStep((s) => s + 1), 250);
  };

  const setMulti = (key, val) => setAnswers((a) => ({ ...a, [key]: val }));

  const canSubmit = answers.name && answers.email && answers.phone && answers.channel;

  if (step === 0) {
    return (
      <div className="min-h-screen pt-[140px] pb-20 fade-in">
        <div className="max-w-[780px] mx-auto px-8">
          <div className="text-center py-15 md:py-20">
            <span className="kicker">{t.finder.kicker}</span>
            <h1 className="font-serif text-[clamp(44px,6vw,72px)] leading-[1.05] tracking-[-0.02em] my-6 max-w-[720px] mx-auto">
              {t.finder.title}
            </h1>
            <p className="text-fg-muted text-[17px] max-w-[540px] mx-auto mb-10">{t.finder.sub}</p>
            <button onClick={() => setStep(1)} className="btn btn-gold btn-arrow">
              {t.finder.start}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step > TOTAL_Q) {
    return (
      <div className="min-h-screen pt-[140px] pb-20 fade-in">
        <div className="max-w-[780px] mx-auto px-8">
          <div className="text-center py-20">
            <div className="w-16 h-16 border border-gold rounded-full flex items-center justify-center text-gold mx-auto mb-8">
              <CheckIcon />
            </div>
            <h2 className="font-serif text-[clamp(40px,5vw,64px)] mb-5">{t.finder.doneTitle}</h2>
            <p className="text-fg-muted text-[17px] max-w-[480px] mx-auto">{t.finder.doneSub}</p>
            <div className="mt-12 flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => {
                  setStep(0);
                  setAnswers({});
                }}
                className="btn btn-outline"
              >
                {t.finder.startOver}
              </button>
              <Link href={`/${lang}`} className="btn btn-gold">{t.finder.returnHome}</Link>
            </div>
            <div className="mt-15 max-w-[480px] mx-auto p-6 bg-bg-raised border border-line text-left">
              <div className="font-mono text-[10px] tracking-[0.18em] text-gold mb-3.5">
                {t.finder.enquirySummary}
              </div>
              <div className="font-mono text-[11px] text-fg-muted leading-loose">
                {Object.entries(answers).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-5 border-b border-line py-1.5">
                    <span className="text-fg-dim">{k.toUpperCase()}</span>
                    <span className="text-fg text-right">
                      {String(v).length > 30 ? `${String(v).slice(0, 30)}…` : String(v)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = step;
  const qKey = `q${currentQ}`;
  const qText = t.finder[qKey];
  const qOpts = t.finder[`${qKey}a`];

  return (
    <div className="min-h-screen pt-[140px] pb-20 fade-in">
      <div className="max-w-[780px] mx-auto px-8">
        <div className="flex items-center gap-4 mb-12 justify-between">
          <span className="font-mono text-[11px] tracking-[0.16em] text-fg-muted whitespace-nowrap">
            {t.finder.step} {String(currentQ).padStart(2, '0')} / {String(TOTAL_Q).padStart(2, '0')}
          </span>
          <div className="flex-1 flex gap-2">
            {Array.from({ length: TOTAL_Q }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-0.5 transition-colors duration-500 ${
                  i + 1 === currentQ ? 'bg-gold' : i + 1 < currentQ ? 'bg-gold-dim' : 'bg-line'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <h2 className="font-serif text-[clamp(32px,4.5vw,52px)] leading-[1.1] tracking-[-0.015em] mb-12">
              {qText}
            </h2>

          {currentQ < 7 && (
            <div className="flex flex-col gap-0.5 mb-12">
              {qOpts.map((opt) => (
                <button
                  key={opt}
                  onClick={() => pickOption(currentQ, opt)}
                  className={`finder-option${answers[qKey] === opt ? ' selected' : ''}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {currentQ === 7 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5 mb-8">
              <div className="form-field sm:col-span-2">
                <label>{t.finder.q7name}</label>
                <input
                  type="text"
                  value={answers.name || ''}
                  onChange={(e) => setMulti('name', e.target.value)}
                  placeholder="—"
                />
              </div>
              <div className="form-field">
                <label>{t.finder.q7email}</label>
                <input
                  type="email"
                  value={answers.email || ''}
                  onChange={(e) => setMulti('email', e.target.value)}
                  placeholder="—"
                />
              </div>
              <div className="form-field">
                <label>{t.finder.q7phone}</label>
                <input
                  type="tel"
                  value={answers.phone || ''}
                  onChange={(e) => setMulti('phone', e.target.value)}
                  placeholder="+—"
                />
              </div>
              <div className="form-field sm:col-span-2">
                <label>{t.finder.q7channel}</label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {t.finder.q7channels.map((c) => (
                    <button
                      key={c}
                      onClick={() => setMulti('channel', c)}
                      className="px-4 py-2.5 font-serif text-[15px] border transition-colors"
                      style={{
                        borderColor: answers.channel === c ? '#C9A84C' : '#2a2720',
                        color: answers.channel === c ? '#C9A84C' : '#9a9487',
                        background: answers.channel === c ? 'rgba(201, 168, 76, 0.06)' : 'transparent',
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-8 border-t border-line">
            <button
              onClick={() => (step > 1 ? setStep(step - 1) : setStep(0))}
              className="text-xs tracking-[0.14em] text-fg-muted hover:text-gold transition-colors"
            >
              ← {t.finder.back}
            </button>
            {currentQ === 7 ? (
              <button
                disabled={!canSubmit}
                onClick={() => canSubmit && setStep(step + 1)}
                className="btn btn-gold btn-arrow"
                style={{ opacity: canSubmit ? 1 : 0.4 }}
              >
                {t.finder.submit}
              </button>
            ) : (
              <span className="font-mono text-[11px] text-fg-dim tracking-[0.14em]">
                {t.finder.selectToContinue}
              </span>
            )}
          </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
