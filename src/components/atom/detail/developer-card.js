'use client';

import { getDict } from '@/lib/i18n';

// Renders project.developerInfo. Returns null if missing/empty so the
// section disappears entirely on sparse projects.
export default function DeveloperCard({ developerInfo, lang = 'en' }) {
  const t = getDict(lang).pages.detail.developer;
  if (!developerInfo || typeof developerInfo !== 'object') return null;
  const { name, logo_url, founded_year, website_url, description, past_projects_count } = developerInfo;
  if (!name) return null;

  const meta = [
    founded_year ? `${t.estPrefix} ${founded_year}` : null,
    past_projects_count ? `${past_projects_count}${t.projectsSuffix}` : null,
  ].filter(Boolean);

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-semibold mb-5" style={{ color: 'var(--neutral-900)', letterSpacing: '-0.02em' }}>
        {t.heading}
      </h2>

      <div
        className="p-6 md:p-8 flex flex-col md:flex-row gap-5 md:gap-6"
        style={{
          background: '#fff',
          border: '1px solid var(--neutral-200)',
          borderRadius: 'var(--atom-radius-lg)',
        }}
      >
        <div
          className="flex-shrink-0 inline-flex items-center justify-center"
          style={{
            width: 96,
            height: 96,
            background: 'var(--neutral-50)',
            border: '1px solid var(--neutral-200)',
            borderRadius: 'var(--atom-radius-md)',
            overflow: 'hidden',
          }}
        >
          {logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo_url} alt={`${name} logo`} className="w-full h-full object-contain p-3" />
          ) : (
            <span className="text-2xl font-bold" style={{ color: 'var(--primary-600)' }}>
              {name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold" style={{ color: 'var(--neutral-900)' }}>
            {name}
          </h3>
          {meta.length > 0 && (
            <div className="mt-1 text-sm" style={{ color: 'var(--neutral-500)' }}>
              {meta.join(' · ')}
            </div>
          )}
          {description && (
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--neutral-700)' }}>
              {description}
            </p>
          )}
          {website_url && (
            <a
              href={website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold"
              style={{ color: 'var(--primary-600)' }}
            >
              {t.visitWebsite}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
