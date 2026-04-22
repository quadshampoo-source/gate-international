import Link from 'next/link';

function priceLabel(p) {
  const n = Number(p.priceUsd ?? p.price_usd) || 0;
  if (!n) return null;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  return `$${Math.round(n / 1_000)}K`;
}

function coverOf(p) {
  if (Array.isArray(p.exteriorImages) && p.exteriorImages[0]) return p.exteriorImages[0];
  if (Array.isArray(p.gallery) && p.gallery[0]) return p.gallery[0];
  return p.img || null;
}

export default function AtomProjectCard({ project, lang }) {
  const img = coverOf(project);
  const price = priceLabel(project);
  const status = (project.deliveryStatus === 'DELIVERED' || project.status === 'delivered')
    ? 'Delivered'
    : 'For sale';
  const isDelivered = status === 'Delivered';

  return (
    <Link
      href={`/${lang}/project/${project.id}`}
      className="group block overflow-hidden bg-white transition-all duration-200 hover:-translate-y-0.5"
      style={{
        borderRadius: 'var(--atom-radius-lg)',
        boxShadow: 'var(--atom-shadow-md)',
        border: '1px solid var(--neutral-200)',
      }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 3.2', background: 'var(--neutral-100)' }}>
        {img && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={img}
            alt={project.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
        <span
          className="absolute top-4 left-4 text-xs font-medium rounded-full"
          style={{
            padding: '6px 12px',
            background: isDelivered ? 'var(--neutral-900)' : 'rgba(255,255,255,0.92)',
            color: isDelivered ? '#fff' : 'var(--neutral-900)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {status}
        </span>
        {price && (
          <span
            className="absolute bottom-4 left-4 font-semibold"
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--atom-radius-md)',
              background: 'rgba(255,255,255,0.95)',
              color: 'var(--neutral-900)',
              fontSize: 15,
              backdropFilter: 'blur(8px)',
              boxShadow: 'var(--atom-shadow-sm)',
            }}
          >
            {price}
          </span>
        )}
      </div>

      <div className="p-5 md:p-6 flex flex-col gap-2">
        <h3 className="text-[18px] md:text-[20px] font-semibold leading-tight" style={{ color: 'var(--neutral-900)' }}>
          {project.name}
        </h3>
        <div className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--neutral-400)' }}>
          {project.district}{project.developer ? ` · ${project.developer}` : ''}
        </div>

        <div
          className="flex items-center gap-4 mt-3 pt-3 text-sm"
          style={{ color: 'var(--neutral-500)', borderTop: '1px solid var(--neutral-100)' }}
        >
          {project.bedrooms && (
            <span className="inline-flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 10h18v8H3zM7 10V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" /></svg>
              {project.bedrooms} Bed
            </span>
          )}
          {project.area && (
            <span className="inline-flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="1" /><path d="M3 9h18M9 3v18" /></svg>
              {project.area} m²
            </span>
          )}
          {project.propertyType && (
            <span className="inline-flex items-center gap-1.5 ml-auto font-medium" style={{ color: 'var(--primary-600)' }}>
              {project.propertyType}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
