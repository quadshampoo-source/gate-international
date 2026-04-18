'use client';

import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState, Children, cloneElement } from 'react';

const EASE = [0.2, 0.8, 0.2, 1];

// --- FadeIn: immediate fade + slight upward slide ---
export function FadeIn({ children, delay = 0, y = 20, className = '', as: Tag = 'div' }) {
  const MotionTag = motion[Tag] || motion.div;
  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

// --- ScrollReveal: reveal when element enters viewport ---
export function ScrollReveal({ children, delay = 0, y = 30, once = true, className = '', as: Tag = 'div' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '0px 0px -10% 0px' });
  const MotionTag = motion[Tag] || motion.div;
  return (
    <MotionTag
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

// --- Stagger: reveal children in sequence ---
export function Stagger({ children, delay = 0, stagger = 0.08, y = 20, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const items = Children.toArray(children);
  return (
    <div ref={ref} className={className}>
      {items.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
          transition={{ duration: 0.7, delay: delay + i * stagger, ease: EASE }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

// --- Counter: animates number from 0 to target when in view ---
export function Counter({ to, duration = 2, prefix = '', suffix = '', decimals = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: duration * 1000, bounce: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, mv, to]);

  useEffect(() => {
    const unsub = spring.on('change', (v) => setDisplay(v));
    return () => unsub();
  }, [spring]);

  const formatted = display.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

// --- Parallax: y-translate based on scroll progress ---
export function Parallax({ children, speed = 0.3, className = '' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -200 * speed]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// --- Marquee: infinite horizontal scroll ---
export function Marquee({ children, speed = 40, className = '' }) {
  const items = Children.toArray(children);
  const loop = [...items, ...items];
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex gap-10 w-max"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        {loop.map((child, i) => (
          <div key={i} className="flex-shrink-0">{child}</div>
        ))}
      </motion.div>
    </div>
  );
}

// --- HoverLift: gentle lift/scale on hover ---
export function HoverLift({ children, className = '', scale = 1.02, y = -4 }) {
  return (
    <motion.div
      whileHover={{ scale, y }}
      transition={{ duration: 0.3, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
