'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const HERO_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4';
const MOBILE_SUB = 'Premium residences along the Bosphorus and beyond.';
const EASE = [0.2, 0.8, 0.2, 1];

export default function GlassHero({ lang, t }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const words = t.home.heroTitle.split(' ');

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Video background */}
      <motion.div aria-hidden="true" className="absolute inset-0 z-0" style={{ y }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
        <div
          className="absolute inset-x-0 bottom-0 h-[300px]"
          style={{ background: 'linear-gradient(to bottom, transparent, rgb(var(--c-bg)))' }}
        />
      </motion.div>

      {/* Soft gold shimmer */}
      <div aria-hidden="true" className="absolute inset-0 z-[1] pointer-events-none">
        <div
          className="absolute left-[-20%] top-[5%] w-[70%] h-[60%] rounded-full blur-[140px] opacity-30 animate-orbFloat"
          style={{ background: 'radial-gradient(closest-side, rgb(201 168 76 / 0.35), transparent 70%)' }}
        />
        <div
          className="absolute right-[-15%] bottom-[10%] w-[60%] h-[60%] rounded-full blur-[160px] opacity-25 animate-orbFloat2"
          style={{ background: 'radial-gradient(closest-side, rgb(201 168 76 / 0.28), transparent 70%)' }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-container mx-auto px-6 md:px-8 py-24 md:py-32"
        style={{ opacity }}
      >
        <div
          className="max-w-[860px] backdrop-blur-2xl bg-white/5 rounded-[28px] md:rounded-[40px] p-7 md:p-16 shadow-[0_50px_120px_rgba(0,0,0,0.5)]"
          style={{ border: '0.5px solid rgba(255,255,255,0.15)' }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <span className="kicker">{t.home.kicker}</span>
          </motion.div>

          {/* Word-by-word blur-in heading */}
          <h1 className="font-serif text-[clamp(34px,6.5vw,88px)] leading-[1.05] tracking-[-0.03em] mt-4 md:mt-5 mb-6 md:mb-8">
            {words.map((w, i) => (
              <motion.span
                key={i}
                className="inline-block will-change-[filter,opacity,transform]"
                initial={{ opacity: 0, filter: 'blur(14px)', y: 10 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.06, ease: EASE }}
              >
                {w}
                {i < words.length - 1 && '\u00A0'}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8, ease: EASE }}
            className="text-[15px] md:text-[19px] text-fg/85 max-w-[580px] mb-8 md:mb-10 leading-relaxed"
          >
            <span className="hidden md:inline">{t.home.heroSub}</span>
            <span className="md:hidden">{MOBILE_SUB}</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2, ease: EASE }}
            className="flex gap-3 flex-wrap"
          >
            <Link
              href={`/${lang}/projects`}
              className="btn btn-gold btn-arrow shadow-[0_10px_30px_rgba(201,168,76,0.25)]"
            >
              {t.home.exploreCta}
            </Link>
            <Link
              href={`/${lang}/finder`}
              className="btn btn-outline hidden md:inline-flex"
            >
              {t.home.finderCta}
            </Link>
          </motion.div>
        </div>

        {/* Bounce arrow under the card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.6 }}
          className="mt-8 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-fg/60"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
