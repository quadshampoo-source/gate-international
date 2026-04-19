'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function GlassHero({ lang, t }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Animated aurora orbs */}
      <motion.div aria-hidden="true" className="absolute inset-0 -z-0" style={{ y }}>
        <div
          className="absolute left-[-20%] top-[10%] w-[80%] h-[70%] rounded-full blur-[140px] opacity-80 animate-orbFloat"
          style={{ background: 'radial-gradient(closest-side, rgb(201 168 76 / 0.55), transparent 70%)' }}
        />
        <div
          className="absolute right-[-15%] bottom-[-10%] w-[70%] h-[70%] rounded-full blur-[160px] opacity-60 animate-orbFloat2"
          style={{ background: 'radial-gradient(closest-side, rgb(201 168 76 / 0.35), transparent 70%)' }}
        />
        <div
          className="absolute left-[30%] top-[40%] w-[50%] h-[50%] rounded-full blur-[100px] opacity-40 animate-orbFloat3"
          style={{ background: 'radial-gradient(closest-side, rgb(139 92 246 / 0.25), transparent 70%)' }}
        />
      </motion.div>

      {/* Grain layer */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%27200%27 height=%27200%27><filter id=%27n%27><feTurbulence baseFrequency=%270.9%27 numOctaves=%272%27/></filter><rect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/></svg>")',
        }}
      />

      <motion.div
        className="relative z-[2] w-full max-w-container mx-auto px-8 py-32"
        style={{ opacity }}
      >
        <div className="max-w-[860px] backdrop-blur-2xl bg-bg-raised/30 border border-gold/20 rounded-[40px] p-10 md:p-16 shadow-[0_50px_120px_rgba(0,0,0,0.5)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <span className="kicker">{t.home.kicker}</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
            className="font-serif text-[clamp(40px,6.5vw,88px)] leading-[1.02] tracking-[-0.03em] mt-5 mb-8"
          >
            {t.home.heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className="text-[17px] md:text-[19px] text-fg/80 max-w-[580px] mb-10 leading-relaxed"
          >
            {t.home.heroSub}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex gap-4 flex-wrap"
          >
            <Link
              href={`/${lang}/projects`}
              className="btn btn-gold btn-arrow shadow-[0_10px_30px_rgba(201,168,76,0.25)]"
            >
              {t.home.exploreCta}
            </Link>
            <Link href={`/${lang}/finder`} className="btn btn-outline">
              {t.home.finderCta}
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[3] hidden md:flex flex-col items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-fg-muted"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span>SCROLL</span>
        <span className="w-px h-10 bg-gradient-to-b from-gold/50 to-transparent" />
      </motion.div>
    </section>
  );
}
