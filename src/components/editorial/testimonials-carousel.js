'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function avatarHue(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}

function Avatar({ name }) {
  const initials = (name || '').split(/\s+/).map((p) => p[0] || '').join('').slice(0, 2).toUpperCase();
  const hue = avatarHue(name);
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center font-editorial text-[17px] text-white shrink-0"
      style={{ background: `linear-gradient(135deg, hsl(${hue} 40% 45%), hsl(${(hue + 40) % 360} 35% 30%))` }}
    >
      {initials}
    </div>
  );
}

const DEFAULTS = [
  { name: 'Hala Al-Rasheed', role: 'Private Investor · Riyadh', quote: 'They remembered the school run, the time zone, the minor details. Everything else — the closing, the TAPU, the furnishing — just happened around us.' },
  { name: 'Wei Chen', role: 'Founder · Shanghai', quote: 'Gate handled three residences for my family in less than a year. No surprises, no stalling — the paperwork was done before we landed in Istanbul.' },
  { name: 'Karim Mansour', role: 'CEO · Cairo', quote: 'We compared eleven brokers in the city. Only Gate walked us through the valuation and the citizenship timeline without flinching.' },
  { name: 'Elena Petrova', role: 'Art Collector · Moscow', quote: 'The Bosphorus apartment was our fourth home. Gate made it feel like our first — every introduction felt personal.' },
];

export default function EditorialTestimonials({ items }) {
  const list = items?.length ? items : DEFAULTS;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => setI((v) => (v + 1) % list.length), 3200);
    return () => clearInterval(timer.current);
  }, [paused, list.length]);

  const current = list[i];

  return (
    <div
      className="relative max-w-[860px] mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative rounded-[40px] bg-white px-7 py-10 md:px-14 md:py-14 overflow-hidden"
        style={{ boxShadow: '0 30px 80px rgba(5,26,36,0.12), 0 1px 0 rgba(5,26,36,0.04)', border: '0.5px solid #E0EBF0' }}
      >
        {/* Quote mark */}
        <svg width="42" height="34" viewBox="0 0 42 34" className="text-[#C9A84C] mb-6" aria-hidden="true">
          <path
            fill="currentColor"
            d="M0 34V18.3C0 10.9 1.2 6.4 3.6 3.8 6 1.3 9.4 0 13.7 0v7.7c-2.6 0-4.5.7-5.7 2.1-1.2 1.4-1.8 3.4-1.8 6.1h6.6V34H0zm22.8 0V18.3c0-7.4 1.2-11.9 3.6-14.5C28.8 1.3 32.2 0 36.5 0v7.7c-2.6 0-4.5.7-5.7 2.1-1.2 1.4-1.8 3.4-1.8 6.1H35.6V34H22.8z"
          />
        </svg>

        <AnimatePresence mode="wait">
          <motion.blockquote
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.36, ease: [0.2, 0.8, 0.2, 1] }}
            className="min-h-[160px]"
          >
            <p className="font-editorial text-[20px] md:text-[26px] leading-[1.5] text-[#051A24]">
              “{current.quote}”
            </p>
            <div className="flex items-center gap-4 mt-8">
              <Avatar name={current.name} />
              <div>
                <div className="font-editorial text-[17px] text-[#051A24]">{current.name}</div>
                <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#273C46] mt-1">
                  {current.role}
                </div>
              </div>
            </div>
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {list.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Testimonial ${idx + 1}`}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: idx === i ? 24 : 8,
              background: idx === i ? '#051A24' : '#E0EBF0',
            }}
          />
        ))}
      </div>
    </div>
  );
}
