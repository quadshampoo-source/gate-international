'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EditorialServicesAccordion({ items = [] }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const open = openIdx === i;
        return (
          <div
            key={i}
            className="rounded-[32px] overflow-hidden transition-colors"
            style={{ background: open ? '#FFFFFF' : '#F6FCFF', border: '1px solid #E0EBF0' }}
          >
            <button
              type="button"
              onClick={() => setOpenIdx(open ? -1 : i)}
              className="w-full flex items-center justify-between gap-4 px-6 md:px-9 py-6 md:py-8 text-left"
            >
              <div className="flex items-baseline gap-4 md:gap-6 min-w-0">
                <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#C9A84C] shrink-0">
                  № {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-editorial text-[22px] md:text-[30px] leading-tight tracking-[-0.01em] text-[#051A24] truncate">
                  {item.t}
                </h3>
              </div>
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
                className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: open ? '#051A24' : '#FFFFFF', color: open ? '#FFFFFF' : '#051A24', border: '1px solid #E0EBF0' }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ gridTemplateRows: '0fr', opacity: 0 }}
                  animate={{ gridTemplateRows: '1fr', opacity: 1 }}
                  exit={{ gridTemplateRows: '0fr', opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
                  style={{ display: 'grid' }}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 md:px-9 pb-7 md:pb-9 pt-0">
                      <p className="text-[15px] md:text-[17px] leading-relaxed text-[#273C46] max-w-[720px]">
                        {item.d}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
