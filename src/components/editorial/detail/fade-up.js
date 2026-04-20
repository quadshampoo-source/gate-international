'use client';

import { useEffect, useRef, useState } from 'react';

// Generic Intersection-Observer fade-in + 24 px slide-up. Honours
// prefers-reduced-motion by instantly revealing the content.
export default function FadeUp({ children, delay = 0, as: Tag = 'div', className = '', style }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setVisible(true); return; }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); io.disconnect(); }
    }, { rootMargin: '0px 0px -10% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 24px, 0)',
        transition: `opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s, transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s`,
        willChange: 'opacity, transform',
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
