'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const HERO_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4';

export default function GlassHero({ lang, t }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Video background */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{ y }}
      >
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

        {/* Dark overlay for legibility */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Bottom gradient fade into page background */}
        <div
          className="absolute inset-x-0 bottom-0 h-[300px]"
          style={{ background: 'linear-gradient(to bottom, transparent, rgb(var(--c-bg)))' }}
        />
      </motion.div>

      {/* Subtle gold orbs layered over video for cinematic shimmer */}
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

      {/* Grain layer */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] opacity-[0.05] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%27200%27 height=%27200%27><filter id=%27n%27><feTurbulence baseFrequency=%270.9%27 numOctaves=%272%27/></filter><rect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/></svg>")',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-container mx-auto px-8 py-32"
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
            className="text-[17px] md:text-[19px] text-fg/85 max-w-[580px] mb-10 leading-relaxed"
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
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-fg/70"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span>SCROLL</span>
        <span className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent" />
      </motion.div>
    </section>
  );
}
