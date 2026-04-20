'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getDict } from '@/lib/i18n';

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

export default function EditorialFinder({ lang }) {
  const t = getDict(lang).finder;
  const [step, setStep] = useState(0); // 0 = intro, 1..7 = questions, 8 = done
  const [answers, setAnswers] = useState({ q1: '', q2: [], q3: '', q4: '', q5: '', q6: '' });
  const [contact, setContact] = useState({ name: '', email: '', phone: '', channel: '' });

  const steps = [
    { q: t.q1, key: 'q1', opts: t.q1a, multi: false },
    { q: t.q2, key: 'q2', opts: t.q2a, multi: true },
    { q: t.q3, key: 'q3', opts: t.q3a, multi: false },
    { q: t.q4, key: 'q4', opts: t.q4a, multi: false },
    { q: t.q5, key: 'q5', opts: t.q5a, multi: false },
    { q: t.q6, key: 'q6', opts: t.q6a, multi: false },
  ];
  const total = steps.length + 1; // +1 for contact step

  const pick = (key, opt, multi) => {
    if (multi) {
      const cur = answers[key] || [];
      const next = cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt];
      setAnswers((a) => ({ ...a, [key]: next }));
    } else {
      setAnswers((a) => ({ ...a, [key]: opt }));
      setTimeout(() => setStep((s) => s + 1), 220);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setStep(99);
  };

  // Intro screen
  if (step === 0) {
    return (
      <div className="fade-in" style={{ background: '#FFFFFF', color: '#051A24' }}>
        <section className="min-h-[calc(100svh-88px)] flex items-center pt-32 md:pt-24 pb-20">
          <div className="container-x max-w-[820px] mx-auto text-center">
            <span className="font-mono text-[10px] md:text-[11px] tracking-[0.26em] uppercase text-[#273C46]">
              {t.kicker}
            </span>
            <h1 className="font-editorial text-[52px] md:text-[92px] leading-[1.02] tracking-[-0.02em] text-[#051A24] mt-5 md:mt-7">
              {renderTitle(t.title)}
            </h1>
            <p className="text-[15px] md:text-[19px] leading-relaxed text-[#273C46] max-w-[560px] mx-auto mt-6 md:mt-8">
              {t.sub}
            </p>
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-3 h-14 px-8 rounded-full bg-[#051A24] text-white text-[14px] font-medium hover:bg-[#0a2a38] transition-colors mt-10"
            >
              {t.start}
              <span aria-hidden>→</span>
            </button>
          </div>
        </section>
      </div>
    );
  }

  // Done screen
  if (step === 99) {
    const summary = [
      { label: t.q1, value: answers.q1 },
      { label: t.q2, value: (answers.q2 || []).join(' · ') },
      { label: t.q3, value: answers.q3 },
      { label: t.q4, value: answers.q4 },
      { label: t.q5, value: answers.q5 },
      { label: t.q6, value: answers.q6 },
    ].filter((x) => x.value);
    return (
      <div className="fade-in" style={{ background: '#FFFFFF', color: '#051A24' }}>
        <section className="pt-32 md:pt-40 pb-24">
          <div className="container-x max-w-[720px] mx-auto text-center">
            <div className="w-14 h-14 rounded-full bg-[#C9A84C] text-white flex items-center justify-center text-2xl mx-auto mb-8">✓</div>
            <h1 className="font-editorial text-[48px] md:text-[72px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
              {renderTitle(t.doneTitle)}
            </h1>
            <p className="text-[15px] md:text-[17px] leading-relaxed text-[#273C46] max-w-[520px] mx-auto mt-5">
              {t.doneSub}
            </p>

            <div
              className="mt-12 text-left p-6 md:p-8 rounded-[24px]"
              style={{ background: '#F6FCFF', border: '1px solid #E0EBF0' }}
            >
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] mb-5">
                {t.enquirySummary}
              </div>
              <dl className="space-y-3 text-[14px]">
                {summary.map((s, i) => (
                  <div key={i} className="flex items-baseline gap-4">
                    <dt className="text-[#273C46] shrink-0 w-[220px] text-[13px]">{s.label}</dt>
                    <dd className="font-editorial text-[16px] text-[#051A24]">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-10 flex justify-center gap-3">
              <button
                onClick={() => { setStep(0); setAnswers({ q1: '', q2: [], q3: '', q4: '', q5: '', q6: '' }); setContact({ name: '', email: '', phone: '', channel: '' }); }}
                className="inline-flex items-center gap-3 h-11 px-6 rounded-full text-[#051A24] text-[13px] font-medium transition-colors"
                style={{ background: '#FFFFFF', border: '1px solid #E0EBF0' }}
              >
                {t.startOver}
              </button>
              <Link
                href={`/${lang}`}
                className="inline-flex items-center gap-3 h-11 px-6 rounded-full bg-[#051A24] text-white text-[13px] font-medium hover:bg-[#0a2a38] transition-colors"
              >
                {t.returnHome}
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Contact step
  const isContactStep = step === steps.length + 1;

  return (
    <div className="fade-in" style={{ background: '#FFFFFF', color: '#051A24' }}>
      <section className="pt-32 md:pt-36 pb-24">
        <div className="container-x max-w-[780px] mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-between mb-10">
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A84C]">
              {t.step} {step} {t.of} {total}
            </span>
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#273C46] hover:text-[#051A24]"
            >
              ← {t.back}
            </button>
          </div>
          <div className="h-[3px] rounded-full mb-12" style={{ background: '#E0EBF0' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(step / total) * 100}%`, background: '#051A24' }}
            />
          </div>

          <AnimatePresence mode="wait">
            {isContactStep ? (
              <motion.form
                key="contact"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                onSubmit={onSubmit}
              >
                <h2 className="font-editorial text-[40px] md:text-[60px] leading-[1.05] tracking-[-0.02em] text-[#051A24]">
                  {renderTitle(t.q7)}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                  <input
                    type="text" required placeholder={t.q7name}
                    value={contact.name}
                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                    className="h-12 px-5 rounded-full text-[14px] text-[#051A24] placeholder:text-[#273C46]/60"
                    style={{ background: '#F6FCFF', border: '1px solid #E0EBF0' }}
                  />
                  <input
                    type="email" required placeholder={t.q7email}
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    className="h-12 px-5 rounded-full text-[14px] text-[#051A24] placeholder:text-[#273C46]/60"
                    style={{ background: '#F6FCFF', border: '1px solid #E0EBF0' }}
                  />
                  <input
                    type="tel" placeholder={t.q7phone}
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    className="h-12 px-5 rounded-full text-[14px] text-[#051A24] placeholder:text-[#273C46]/60"
                    style={{ background: '#F6FCFF', border: '1px solid #E0EBF0' }}
                  />
                  <select
                    value={contact.channel}
                    onChange={(e) => setContact({ ...contact, channel: e.target.value })}
                    className="h-12 px-5 rounded-full text-[14px] text-[#051A24]"
                    style={{ background: '#F6FCFF', border: '1px solid #E0EBF0' }}
                    required
                  >
                    <option value="">{t.q7channel}</option>
                    {(t.q7channels || []).map((ch) => <option key={ch}>{ch}</option>)}
                  </select>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-3 h-12 px-6 rounded-full bg-[#051A24] text-white text-[13px] font-medium hover:bg-[#0a2a38] transition-colors mt-8"
                >
                  {t.submit}
                  <span aria-hidden>→</span>
                </button>
              </motion.form>
            ) : (
              <motion.div
                key={`q${step}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
              >
                {(() => {
                  const s = steps[step - 1];
                  if (!s) return null;
                  return (
                    <>
                      <h2 className="font-editorial text-[40px] md:text-[60px] leading-[1.05] tracking-[-0.02em] text-[#051A24] mb-10">
                        {renderTitle(s.q)}
                      </h2>
                      <div className="flex flex-wrap gap-3">
                        {s.opts.map((opt) => {
                          const selected = s.multi
                            ? (answers[s.key] || []).includes(opt)
                            : answers[s.key] === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => pick(s.key, opt, s.multi)}
                              type="button"
                              className="px-5 py-3 rounded-full text-[14px] transition-all"
                              style={{
                                background: selected ? '#051A24' : '#F6FCFF',
                                color: selected ? '#FFFFFF' : '#051A24',
                                border: `1px solid ${selected ? '#051A24' : '#E0EBF0'}`,
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {s.multi && (
                        <button
                          onClick={() => setStep((v) => v + 1)}
                          type="button"
                          className="inline-flex items-center gap-3 h-12 px-6 rounded-full bg-[#051A24] text-white text-[13px] font-medium hover:bg-[#0a2a38] transition-colors mt-10"
                        >
                          {t.next}
                          <span aria-hidden>→</span>
                        </button>
                      )}
                    </>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
