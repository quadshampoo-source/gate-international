'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const LABELS = {
  en: { projects: 'Projects', services: 'Services', about: 'About', contact: 'Contact', cta: 'Get in touch' },
  ar: { projects: 'المشاريع', services: 'الخدمات', about: 'من نحن', contact: 'تواصل', cta: 'تواصل معنا' },
  zh: { projects: '项目', services: '服务', about: '关于', contact: '联系', cta: '联系我们' },
  ru: { projects: 'Проекты', services: 'Услуги', about: 'О нас', contact: 'Контакт', cta: 'Связаться' },
  fa: { projects: 'پروژه\u200cها', services: 'خدمات', about: 'درباره', contact: 'تماس', cta: 'تماس' },
  fr: { projects: 'Projets', services: 'Services', about: 'À propos', contact: 'Contact', cta: 'Contactez-nous' },
};

export default function AtomNav({ lang = 'en' }) {
  const [scrolled, setScrolled] = useState(false);
  const labels = LABELS[lang] || LABELS.en;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-200"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--neutral-200)' : '1px solid transparent',
      }}
    >
      <div className="max-w-[1360px] mx-auto flex items-center justify-between px-6 md:px-10 py-4 md:py-5">
        <Link href={`/${lang}`} className="inline-flex items-center gap-3">
          <span
            aria-hidden
            className="inline-grid place-items-center font-bold"
            style={{
              width: 36, height: 36,
              borderRadius: 10,
              background: 'var(--gradient-cta)',
              color: '#fff',
              fontSize: 18,
              boxShadow: '0 4px 12px rgba(99,102,241,0.30)',
            }}
          >
            G
          </span>
          <span className="hidden sm:inline font-semibold text-base" style={{ color: 'var(--neutral-900)' }}>
            Gate International
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: 'var(--neutral-700)' }}>
          <Link href={`/${lang}/projects`} className="hover:text-atom-primary-600 transition-colors">{labels.projects}</Link>
          <Link href={`/${lang}/services`} className="hover:text-atom-primary-600 transition-colors">{labels.services}</Link>
          <Link href={`/${lang}/about`} className="hover:text-atom-primary-600 transition-colors">{labels.about}</Link>
          <Link href={`/${lang}/contact`} className="hover:text-atom-primary-600 transition-colors">{labels.contact}</Link>
        </nav>

        <div className="flex items-center gap-3">
          <span
            className="hidden sm:inline text-xs font-medium uppercase tracking-wider"
            style={{ color: 'var(--neutral-400)' }}
          >
            {String(lang).toUpperCase()}
          </span>
          <Button href={`/${lang}/contact`} variant="primary" size="md" arrow>
            {labels.cta}
          </Button>
        </div>
      </div>
    </header>
  );
}
