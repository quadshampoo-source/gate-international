'use client';

import { motion } from 'framer-motion';
import { WhatsappIcon } from './icons';
import { whatsappLink } from '@/lib/utils';

export default function WhatsappFab({ message }) {
  return (
    <motion.a
      className="wa-fab"
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.5, type: 'spring', bounce: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
        className="flex items-center justify-center"
      >
        <WhatsappIcon />
      </motion.span>
    </motion.a>
  );
}
