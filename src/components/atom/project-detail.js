import Link from 'next/link';
import AtomProjectCard from './project-card';
import { Button, Card } from '@/components/ui';

function fmtUsd(n) {
  if (!n) return '—';
  return `$${Number(n).toLocaleString()}`;
}

function cover(p) {
  if (Array.isArray(p.exteriorImages) && p.exteriorImages[0]) return p.exteriorImages[0];
  if (Array.isArray(p.gallery) && p.gallery[0]) return p.gallery[0];
  return p.img || null;
}

export default function AtomProjectDetail({ project, lang = 'en', allProjects = [] }) {
  const img = cover(project);
  const price = project.priceUsd ?? project.price_usd;
  const options = Array.isArray(project.options) ? project.options.filter((o) => o && (o.type || o.size || o.price)) : [];
  const gallery = [
    ...(Array.isArray(project.exteriorImages) ? project.exteriorImages : []),
    ...(Array.isArray(project.interiorImages) ? project.interiorImages : []),
  ].filter(Boolean);
  const deliveryLabel = (() => {
    if (project.deliveryStatus === 'DELIVERED') return 'Delivered';
    if (project.deliveryMonth && project.deliveryYear) return `${String(project.deliveryMonth).padStart(2, '0')}/${project.deliveryYear}`;
    return project.delivery || null;
  })();
  const similar = (allProjects || []).filter((p) => p.id !== project.id && p.district === project.district).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-8 md:pb-12">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <div className="flex items-center gap-3 text-sm mb-4" style={{ color: 'var(--neutral-500)' }}>
            <Link href={`/${lang}/projects`} className="hover:text-atom-primary-600">All residences</Link>
            <span>/</span>
            <span style={{ color: 'var(--neutral-900)' }}>{project.name}</span>
          </div>

          <div className="flex items-end justify-between gap-6 mb-6 flex-wrap">
            <div>
              <div className="atom-caption" style={{ color: 'var(--primary-600)' }}>{(project.district || '').toUpperCase()}{project.developer ? ` · ${project.developer.toUpperCase()}` : ''}</div>
              <h1 className="atom-h1 mt-3" style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}>{project.name}</h1>
            </div>
            {price && (
              <div className="text-right">
                <div className="atom-caption" style={{ color: 'var(--neutral-400)' }}>From</div>
                <div className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--neutral-900)' }}>{fmtUsd(price)}</div>
              </div>
            )}
          </div>

          {img && (
            <div className="overflow-hidden" style={{ borderRadius: 'var(--atom-radius-xl)', boxShadow: 'var(--atom-shadow-md)', aspectRatio: '16 / 9', background: 'var(--neutral-100)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={project.name} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </section>

      {/* Specs grid */}
      <section className="py-8 md:py-12">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {project.bedrooms && <SpecCell label="Bedrooms" value={project.bedrooms} />}
            {project.bathrooms && <SpecCell label="Bathrooms" value={project.bathrooms} />}
            {project.area && <SpecCell label="Area" value={`${project.area} m²`} />}
            {project.propertyType && <SpecCell label="Type" value={project.propertyType} />}
            {deliveryLabel && <SpecCell label="Delivery" value={deliveryLabel} />}
            {project.view && <SpecCell label="View" value={project.view} />}
            {project.totalUnits && <SpecCell label="Total units" value={project.totalUnits} />}
            {project.blocks && <SpecCell label="Blocks" value={project.blocks} />}
          </div>
        </div>
      </section>

      {/* Options */}
      {options.length > 0 && (
        <section className="py-12 md:py-16" style={{ background: 'var(--neutral-100)' }}>
          <div className="max-w-[1360px] mx-auto px-6 md:px-10">
            <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— Options —</span>
            <h2 className="atom-h2 mt-3 mb-8 md:mb-10" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)' }}>
              Available <span className="atom-accent">configurations.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {options.map((o, i) => (
                <Card key={i} padding="md" align="left" hairline={false}>
                  <div className="flex items-baseline justify-between gap-3 mb-3">
                    <div className="text-xl font-semibold" style={{ color: 'var(--neutral-900)' }}>{o.type || '—'}</div>
                    {o.size && (
                      <div className="atom-caption" style={{ color: 'var(--neutral-400)' }}>{Number(String(o.size).replace(/\D/g, ''))} m²</div>
                    )}
                  </div>
                  {o.price && (
                    <div className="text-2xl font-bold atom-accent" style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                      {fmtUsd(Number(String(o.price).replace(/\D/g, '')))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 1 && (
        <section className="py-12 md:py-16">
          <div className="max-w-[1360px] mx-auto px-6 md:px-10">
            <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— Gallery —</span>
            <h2 className="atom-h2 mt-3 mb-8 md:mb-10" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)' }}>
              A closer <span className="atom-accent">look.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {gallery.slice(0, 6).map((src, i) => (
                <div key={i} className="overflow-hidden" style={{ borderRadius: 'var(--atom-radius-lg)', aspectRatio: '4 / 3', background: 'var(--neutral-100)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`${project.name} — ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div
            className="text-center p-10 md:p-14"
            style={{
              borderRadius: 'var(--atom-radius-2xl)',
              background: 'var(--gradient-primary)',
              color: '#fff',
              boxShadow: '0 16px 48px rgba(99,102,241,0.28)',
            }}
          >
            <h2 className="mb-3" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Interested in {project.name}?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 17 }}>
              Send a request — a senior advisor will reply within one business day with floor plans, payment options, and a private tour.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button href={`/${lang}/contact?project=${project.id}`} variant="ghost" className="!bg-white !text-atom-primary-700 !border-transparent">
                Request details
              </Button>
              <Button href="https://wa.me/" external variant="ghost" arrow={false} className="!bg-transparent !text-white !border-white/50 hover:!bg-white/10">
                WhatsApp us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Similar */}
      {similar.length > 0 && (
        <section className="py-12 md:py-20">
          <div className="max-w-[1360px] mx-auto px-6 md:px-10">
            <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>— More nearby —</span>
            <h2 className="atom-h2 mt-3 mb-8 md:mb-10" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)' }}>
              Also in <span className="atom-accent">{project.district}.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similar.map((p) => <AtomProjectCard key={p.id} project={p} lang={lang} />)}
            </div>
          </div>
        </section>
      )}

    </>
  );
}

function SpecCell({ label, value }) {
  return (
    <div className="p-5 bg-white" style={{ borderRadius: 'var(--atom-radius-lg)', border: '1px solid var(--neutral-200)', boxShadow: 'var(--atom-shadow-sm)' }}>
      <div className="atom-caption" style={{ color: 'var(--neutral-400)' }}>{label}</div>
      <div className="mt-2 text-xl font-semibold" style={{ color: 'var(--neutral-900)' }}>{value}</div>
    </div>
  );
}
