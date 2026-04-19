'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EASE = [0.2, 0.8, 0.2, 1];

export default function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-3">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="backdrop-blur-xl bg-bg-raised/40 border border-gold/15 rounded-2xl overflow-hidden"
            style={{ borderWidth: '0.5px', borderColor: 'rgba(255,255,255,0.12)' }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left rtl:text-right"
            >
              <span className="font-serif text-[17px] md:text-[18px] leading-snug">{it.q}</span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="text-gold font-serif text-[22px] leading-none flex-shrink-0"
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-5 text-[14px] text-fg-muted leading-relaxed">
                    {it.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
