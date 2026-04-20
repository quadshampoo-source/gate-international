'use client';

// Text left, pinned image right. CSS position: sticky keeps the image visible
// while the paragraphs scroll past it. Falls back to a stacked column on mobile.
export default function OverviewSticky({ kicker, title, paragraphs = [], image, alt }) {
  return (
    <section className="py-20 md:py-32" style={{ background: 'rgb(var(--c-bg-raised))' }}>
      <div className="container-x">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">
          <div className="md:pr-6 lg:pr-10">
            {kicker && (
              <div
                className="font-mono text-[10px] md:text-[11px] uppercase text-[#C9A84C] mb-5"
                style={{ letterSpacing: '3px' }}
              >
                {kicker}
              </div>
            )}
            {title && (
              <h2 className="font-editorial text-[36px] md:text-[56px] leading-[1.08] tracking-[-0.02em] mb-8">
                {title}
              </h2>
            )}
            <div className="space-y-5 text-[15px] md:text-[17px] leading-[1.8]" style={{ color: 'rgb(var(--c-fg-muted))' }}>
              {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
          <div
            className="md:sticky overflow-hidden rounded-[16px] w-full aspect-[4/5]"
            style={{ top: 96 }}
          >
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={alt || ''}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full"
                style={{ background: 'linear-gradient(135deg, #273C46 0%, #0B1418 100%)' }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
