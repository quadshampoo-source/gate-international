'use client';

import { motion } from 'framer-motion';

const EASE = [0.2, 0.8, 0.2, 1];

export default function BlurText({
  text,
  as: Tag = 'h1',
  className = '',
  delay = 0,
  stagger = 0.06,
  duration = 0.7,
}) {
  const words = text.split(' ');
  const MotionTag = motion[Tag] || motion.h1;
  return (
    <MotionTag className={className} aria-label={text}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block will-change-[filter,opacity,transform]"
          initial={{ opacity: 0, filter: 'blur(14px)', y: 10 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration, delay: delay + i * stagger, ease: EASE }}
        >
          {w}
          {i < words.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </MotionTag>
  );
}
