'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function EditorialNavbar({ lang, dict, contactHref }) {
  // When the editorial homepage mounts, hide the global site-header and flag body for CSS overrides.
  useEffect(() => {
    document.body.classList.add('theme-editorial-home');
    return () => {
      document.body.classList.remove('theme-editorial-home');
    };
  }, []);

  const nav = [
    { key: 'projects', href: `/${lang}/projects` },
    { key: 'services', href: `/${lang}/services` },
    { key: 'citizenship', href: `/${lang}/citizenship` },
    { key: 'about', href: `/${lang}/about` },
  ];

  return (
    <div className="fixed top-4 md:top-6 inset-x-0 z-[110] flex justify-center px-4 pointer-events-none">
      <nav
        className="pointer-events-auto flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-full"
        style={{
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'saturate(160%) blur(14px)',
          WebkitBackdropFilter: 'saturate(160%) blur(14px)',
          boxShadow: '0 10px 40px rgba(5,26,36,0.08), 0 1px 0 rgba(5,26,36,0.04)',
          border: '0.5px solid rgba(5,26,36,0.08)',
        }}
      >
        <Link
          href={`/${lang}`}
          className="font-editorial text-[16px] md:text-[17px] text-[#051A24] leading-none px-3 md:px-4 whitespace-nowrap"
        >
          Gate <span className="italic">International</span>
        </Link>
        <div className="hidden md:flex items-center gap-1 px-2">
          {nav.map((n) => (
            <Link
              key={n.key}
              href={n.href}
              className="px-3 py-2 text-[13px] text-[#273C46] hover:text-[#051A24] transition-colors rounded-full"
            >
              {dict.nav[n.key]}
            </Link>
          ))}
        </div>
        <Link
          href={contactHref}
          className="ml-1 md:ml-0 px-4 md:px-5 py-2 rounded-full bg-[#051A24] text-white text-[12px] md:text-[13px] font-medium hover:bg-[#0a2a38] transition-colors"
        >
          {dict.nav.contact}
        </Link>
      </nav>
    </div>
  );
}
