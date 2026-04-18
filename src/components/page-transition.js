'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

// Simple fade-in on each navigation. We avoid `AnimatePresence mode="wait"` +
// `exit` because it can block client-side navigation when combined with async
// server components in the Next.js App Router.
export default function PageTransition({ children }) {
  const pathname = usePathname();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
