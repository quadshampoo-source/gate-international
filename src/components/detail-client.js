'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import VideoModal from '@/components/video-modal';
import ProjectCard from '@/components/project-card';
import { PlayIcon, WhatsappIcon } from '@/components/icons';
import { fmtUsd, localizedName, localizedDistrict, whatsappLink } from '@/lib/utils';
import { getDict } from '@/lib/i18n';
import { PROJECTS as staticProjects, badgesFor } from '@/lib/projects';

function hashGradient(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const a = h % 360;
  const b = (a + 40) % 360;
  return `linear-gradient(135deg, hsl(${a} 35% 20%) 0%, hsl(${b} 45% 14%) 50%, #0a0a0a 100%)`;
}

// Simple deterministic "people watching" number — 8 to 34.
function watchingCount(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return 8 + (h % 27);
}

function refNumber(project, allProjects) {
  const list = allProjects && allProjects.length ? allProjects : staticProjects;
  const idx = list.findIndex((p) => p.id === project.id);
  return `GATE-${String(idx + 1).padStart(3, '0')}`;
}

export default function DetailClient({ project, lang, allProjects = [] }) {
  const t = getDict(lang);
  const ext = t.detailExtra;
  const projExt = t.projectsExtra;
  const [videoOpen, setVideoOpen] = useState(false);

  const name = localizedName(project, lang);
  const district = localizedDistrict(project, lang);
  const badges = badgesFor(project);

  const isPlaceholderImg = !project.img || !project.img.trim() || project.img.includes('picsum.photos');
  const hasImg = !isPlaceholderImg;
  // Prefer admin-uploaded gallery; fall back to a placeholder set when we have
  // a hero image but no gallery yet.
  const dbGallery = Array.isArray(project.gallery) ? project.gallery.filter(Boolean) : [];
  const gallery = dbGallery.length
    ? dbGallery
    : hasImg
      ? [
          project.img,
          'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1600&q=80',
          'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1600&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
          'https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?w=1600&q=80',
        ]
      : [];

  const pool = allProjects.length ? allProjects : staticProjects;
  const similar = pool.filter((p) => p.id !== project.id && p.district === project.district).slice(0, 3);
  const ref = refNumber(project, pool);
  const enquireMessage = `Hello, I am interested in ${project.name} (Ref: ${ref}).`;
  const watching = watchingCount(project.id);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://gate.example${typeof window !== 'undefined' ? window.location.pathname : ''}`;
  const shareText = `${name} — ${district}`;

  const heroBg = hasImg ? { backgroundImage: `url(${project.img})` } : { backgroundImage: hashGradient(project.id) };

  return (
    <div className="fade-in">
      <section className="relative h-[85vh] min-h-[600px] flex items-end overflow-hidden p-0">
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={heroBg} />
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/30 via-black/20 to-black/95" />

        <button
          onClick={() => setVideoOpen(true)}
          aria-label="Play video tour"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3] w-[88px] h-[88px] rounded-full border border-gold bg-black/30 backdrop-blur-md flex items-center justify-center transition-all hover:bg-gold group"
        >
          <PlayIcon className="text-gold group-hover:text-bg" />
        </button>

        <div className="relative z-[3] pb-20 w-full max-w-container mx-auto">
          <div className="px-8">
            <span className="kicker">{district.toUpperCase()} · {project.typology.toUpperCase()} · {ref}</span>
            <h1 className="font-serif text-[clamp(40px,5vw,72px)] leading-[1.05] tracking-[-0.02em] my-4 max-w-[800px]">
              {name}
            </h1>
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {badges.map((b) => (
                  <span key={b} className="font-mono text-[10px] tracking-[0.16em] uppercase px-3 py-1.5 bg-gold text-bg">
                    {projExt[`badge_${b}`]}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-10 md:gap-12 mt-8 flex-wrap">
              <Meta label={t.detail.bedrooms} value={project.bedrooms} />
              <Meta label={t.detail.area} value={`${project.area} m²`} />
              <Meta label={t.detail.view.toUpperCase()} value={project.view} />
              <Meta label={t.detail.delivery} value={project.delivery} />
              {project.developer && <Meta label={ext.developer.toUpperCase()} value={project.developer} />}
            </div>
          </div>
        </div>

        <div className="absolute top-[100px] right-6 md:right-10 rtl:right-auto rtl:left-6 md:rtl:left-10 z-[3] bg-bg/80 backdrop-blur border border-gold/40 px-4 py-2 font-mono text-[11px] text-gold tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
          <span>{watching} {ext.watching}</span>
        </div>
      </section>

      <div className="container-x">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-10 md:gap-20 py-15 md:py-25 items-start">
          <div>
            <div className="mb-15">
              <span className="kicker">№ 01 — {t.detail.overview.toUpperCase()}</span>
              <h3 className="font-serif text-[32px] mt-3 mb-6 tracking-[-0.01em]">{t.detail.overviewTitle}</h3>
              <p className="text-fg-muted text-[15px] leading-loose max-w-[640px] mb-4">
                {t.detail.overviewP1.replace('{name}', name).replace('{district}', district)}
              </p>
              <p className="text-fg-muted text-[15px] leading-loose max-w-[640px]">{t.detail.overviewP2}</p>
            </div>

            {project.reasons && project.reasons.length > 0 && (
              <div className="mb-15">
                <span className="kicker">{ext.whyThis.toUpperCase()}</span>
                <h3 className="font-serif text-[28px] mt-3 mb-6 tracking-[-0.01em]">{ext.whyThis}</h3>
                <ul className="space-y-3 max-w-[640px]">
                  {project.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-4 text-fg-muted text-[15px] leading-relaxed">
                      <span className="font-mono text-gold text-[11px] tracking-[0.14em] mt-1 flex-shrink-0">
                        № {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {gallery.length > 0 && (
              <div className="mb-15">
                <span className="kicker">№ 02 — {t.detail.gallery.toUpperCase()}</span>
                <h3 className="font-serif text-[32px] mt-3 mb-8">{t.detail.galleryTitle}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-[2fr_1fr_1fr] auto-rows-[180px] gap-1">
                  {gallery.slice(0, 5).map((src, i) => (
                    <div key={i} className={`overflow-hidden bg-surface ${i === 0 ? 'sm:row-span-2 col-span-2 sm:col-span-1' : ''}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`Gallery ${i + 1}`} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 saturate-[0.9] hover:saturate-100" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-15">
              <span className="kicker">№ 03 — {t.detail.specs.toUpperCase()}</span>
              <h3 className="font-serif text-[32px] mt-3 mb-8">{t.detail.specs}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line">
                <Spec label={t.detail.bedrooms} value={project.bedrooms} />
                <Spec label={t.detail.bathrooms} value={Math.max(2, project.bedrooms)} />
                <Spec label={t.detail.area} value={`${project.area} m²`} />
                <Spec label={t.detail.terrace} value={`${Math.round(project.area * 0.22)} m²`} />
                <Spec label={t.detail.orientation} value="SE · Bosphorus" />
                <Spec label={t.detail.delivery} value={project.delivery} />
                <Spec label={t.detail.tenure} value={t.detail.freehold} />
                <Spec label={t.detail.parking} value={`3 ${t.detail.coveredParking}`} />
                {project.totalUnits && <Spec label={ext.totalUnits} value={project.totalUnits} />}
                {project.blocks > 0 && <Spec label={ext.blocks} value={project.blocks} />}
              </div>
            </div>

            {project.priceTable && project.priceTable.length > 0 && (
              <div className="mb-15">
                <span className="kicker">{ext.priceTable.toUpperCase()}</span>
                <h3 className="font-serif text-[28px] mt-3 mb-6">{ext.priceTable}</h3>
                <div className="border border-line overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-bg-sunken">
                      <tr>
                        <th className="px-4 py-3 text-left rtl:text-right font-mono text-[10px] tracking-[0.16em] text-gold uppercase">
                          {ext.unitType}
                        </th>
                        <th className="px-4 py-3 text-right rtl:text-left font-mono text-[10px] tracking-[0.16em] text-gold uppercase">
                          {ext.unitPrice}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.priceTable.map((row, i) => (
                        <tr key={i} className="border-t border-line">
                          <td className="px-4 py-3 font-serif text-[17px]">{row.type}</td>
                          <td className="px-4 py-3 font-mono text-[15px] text-gold text-right rtl:text-left">
                            {fmtUsd(row.priceUsd)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {project.paymentPlan && (
              <div className="mb-15">
                <span className="kicker">{ext.paymentPlan.toUpperCase()}</span>
                <h3 className="font-serif text-[28px] mt-3 mb-6">{ext.paymentPlan}</h3>
                <div className="grid grid-cols-3 gap-px bg-line border border-line">
                  <Spec label={ext.downPayment} value={`${project.paymentPlan.downPct}%`} />
                  <Spec label={ext.term} value={`${project.paymentPlan.termMonths} ${ext.months}`} />
                  <Spec label={ext.interest} value={`${project.paymentPlan.interestPct}%`} />
                </div>
              </div>
            )}

            {project.distances && (
              <div className="mb-15">
                <span className="kicker">{ext.distances.toUpperCase()}</span>
                <h3 className="font-serif text-[28px] mt-3 mb-6">{ext.distances}</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-line border border-line">
                  {[
                    ['metro', project.distances.metro_km],
                    ['mall', project.distances.mall_km],
                    ['airport', project.distances.airport_km],
                    ['hospital', project.distances.hospital_km],
                    ['school', project.distances.school_km],
                  ].filter(([_, v]) => v !== undefined).map(([k, v]) => (
                    <div key={k} className="bg-bg p-4 flex flex-col gap-1 min-h-[92px] justify-between">
                      <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-fg-dim">{ext[k]}</div>
                      <div className="font-serif text-[20px] text-gold">{v} <span className="text-[11px] text-fg-dim font-mono">{ext.km}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-15">
              <span className="kicker">№ 04 — {t.detail.floorplan.toUpperCase()}</span>
              <h3 className="font-serif text-[32px] mt-3 mb-8">{t.detail.floorplanTitle}</h3>
              <div className="bg-bg-sunken border border-line p-6 md:p-10">
                <FloorPlanSvg />
                <div className="flex justify-center gap-6 md:gap-8 mt-6 flex-wrap font-mono text-[11px] tracking-[0.1em] text-fg-muted">
                  <span>· SCALE 1:150 ·</span>
                  <span>· {project.area} m² NET ·</span>
                  <span>· PRIMARY LEVEL ·</span>
                </div>
              </div>
            </div>

            <div className="mb-15">
              <span className="kicker">№ 05 — {t.detail.location.toUpperCase()}</span>
              <h3 className="font-serif text-[32px] mt-3 mb-8">{t.detail.locationTitle}</h3>
              <div className="relative h-[420px] bg-bg-sunken border border-line overflow-hidden">
                <BosphorusMap name={name} />
              </div>
            </div>

            <ShareBar url={shareUrl} text={shareText} label={ext.shareVia} />
          </div>

          <aside>
            <div className="bg-surface border border-line p-6 md:p-8 md:sticky md:top-[100px]">
              <div className="font-serif text-[40px] text-gold mb-1 tracking-[-0.02em]">
                {typeof project.priceUsd === 'number' ? fmtUsd(project.priceUsd) : projExt.priceOnRequest}
              </div>
              <div className="font-mono text-[11px] text-fg-muted tracking-[0.14em] mb-6">
                {t.projects.from} · {t.detail.perTaxIncl}
              </div>
              <hr className="border-line my-6" />
              <div className="flex gap-3.5 items-center mb-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dim flex items-center justify-center font-serif text-lg text-bg">
                  LH
                </div>
                <div>
                  <div className="font-serif text-base">Leyla Hanım</div>
                  <div className="font-mono text-[11px] text-fg-muted tracking-[0.08em]">
                    {t.detail.director} · {district.toUpperCase()}
                  </div>
                </div>
              </div>
              <a
                href={whatsappLink(enquireMessage, lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold btn-arrow w-full justify-center mb-2.5"
              >
                {t.detail.contact}
              </a>
              <button onClick={() => setVideoOpen(true)} className="btn btn-outline w-full justify-center mb-2.5">
                <PlayIcon /> {t.detail.videoTour}
              </button>
              <Link href={`/${lang}/finder`} className="btn btn-outline w-full justify-center">
                {t.detail.requestShortlist}
              </Link>
              <hr className="border-line my-6" />
              <div className="font-mono text-[10px] text-fg-dim tracking-[0.14em] leading-loose">
                {t.detail.ref} № {ref}<br />
                {t.detail.listed} · 2026-02-14<br />
                {t.detail.updated} · 04-18
              </div>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="pt-10 pb-30 border-t border-line">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
              <div>
                <span className="kicker block mb-3">№ 06 — {t.detail.similar.toUpperCase()}</span>
                <h2 className="section-title">{t.detail.similarTitle.replace('{district}', district)}</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {similar.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} lang={lang} />
              ))}
            </div>
          </section>
        )}
      </div>

      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} project={project} />
    </div>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <span className="font-mono text-[10px] tracking-[0.16em] text-fg-dim uppercase block mb-1">{label}</span>
      <span className="font-serif text-[22px] text-fg">{value}</span>
    </div>
  );
}

function Spec({ label, value }) {
  return (
    <div className="bg-bg p-5 md:p-6 flex justify-between items-baseline gap-4">
      <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-fg-dim">{label}</span>
      <span className="font-serif text-[18px] text-fg text-right">{value}</span>
    </div>
  );
}

function ShareBar({ url, text, label }) {
  const encoded = encodeURIComponent(`${text} — ${url}`);
  const links = [
    { k: 'WhatsApp', href: `https://wa.me/?text=${encoded}`, icon: <WhatsappIcon /> },
    { k: 'Telegram', href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, icon: <span className="font-serif text-base">T</span> },
    { k: 'X', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, icon: <span className="font-serif text-base">𝕏</span> },
    { k: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, icon: <span className="font-serif text-base">in</span> },
  ];
  return (
    <div className="flex items-center gap-4 pt-6 border-t border-line">
      <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-fg-dim">{label}</span>
      <div className="flex gap-2">
        {links.map((l) => (
          <a
            key={l.k}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${l.k}`}
            className="w-10 h-10 border border-line hover:border-gold hover:text-gold flex items-center justify-center transition-colors"
          >
            {l.icon}
          </a>
        ))}
      </div>
    </div>
  );
}

function FloorPlanSvg() {
  return (
    <svg className="w-full h-auto max-w-[640px] block mx-auto" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#C9A84C" strokeOpacity="0.15" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="20" y="20" width="560" height="360" fill="none" stroke="#C9A84C" strokeWidth="2" />
      <rect x="20" y="20" width="260" height="200" fill="url(#hatch)" stroke="#C9A84C" strokeOpacity="0.4" strokeWidth="1" />
      <rect x="280" y="20" width="180" height="120" fill="none" stroke="#C9A84C" strokeOpacity="0.4" strokeWidth="1" />
      <rect x="460" y="20" width="120" height="120" fill="none" stroke="#C9A84C" strokeOpacity="0.4" strokeWidth="1" />
      <rect x="280" y="140" width="300" height="80" fill="none" stroke="#C9A84C" strokeOpacity="0.4" strokeWidth="1" />
      <rect x="20" y="220" width="180" height="160" fill="none" stroke="#C9A84C" strokeOpacity="0.4" strokeWidth="1" />
      <rect x="200" y="220" width="180" height="160" fill="none" stroke="#C9A84C" strokeOpacity="0.4" strokeWidth="1" />
      <rect x="380" y="220" width="200" height="160" fill="url(#hatch)" stroke="#C9A84C" strokeOpacity="0.4" strokeWidth="1" />
      <line x1="145" y1="220" x2="175" y2="220" stroke="#0a0a0a" strokeWidth="3" />
      <line x1="290" y1="220" x2="320" y2="220" stroke="#0a0a0a" strokeWidth="3" />
      <line x1="280" y1="80" x2="280" y2="110" stroke="#0a0a0a" strokeWidth="3" />
      <text x="150" y="125" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#C9A84C" letterSpacing="2">LIVING · 68m²</text>
      <text x="370" y="85" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#9a9487" letterSpacing="1.5">DINING</text>
      <text x="520" y="85" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#9a9487" letterSpacing="1.5">KITCHEN</text>
      <text x="430" y="185" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#9a9487" letterSpacing="1.5">CIRCULATION</text>
      <text x="110" y="305" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#9a9487" letterSpacing="1.5">MASTER · 32m²</text>
      <text x="290" y="305" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#9a9487" letterSpacing="1.5">BEDROOM 2</text>
      <text x="480" y="305" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#C9A84C" letterSpacing="2">TERRACE · 48m²</text>
      <g transform="translate(560,360)">
        <circle r="14" fill="none" stroke="#C9A84C" strokeOpacity="0.5" />
        <path d="M 0,-10 L 4,6 L 0,2 L -4,6 Z" fill="#C9A84C" />
        <text y="-18" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#C9A84C">N</text>
      </g>
    </svg>
  );
}

function BosphorusMap({ name }) {
  return (
    <svg className="w-full h-full block" viewBox="0 0 800 420" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d1419" />
          <stop offset="100%" stopColor="#060d12" />
        </linearGradient>
        <pattern id="land" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="4" height="4" fill="#0f0e09" />
          <circle cx="1" cy="1" r="0.3" fill="#1e1d17" />
        </pattern>
      </defs>
      <rect width="800" height="420" fill="url(#water)" />
      <path d="M 200,0 Q 280,80 260,160 Q 230,230 290,300 Q 340,360 320,420 L 420,420 Q 440,360 390,300 Q 340,230 380,160 Q 420,80 340,0 Z" fill="url(#land)" opacity="0.6" />
      <path d="M 0,0 L 200,0 Q 280,80 260,160 Q 230,230 290,300 Q 340,360 320,420 L 0,420 Z" fill="url(#land)" />
      <path d="M 420,420 Q 440,360 390,300 Q 340,230 380,160 Q 420,80 340,0 L 800,0 L 800,420 Z" fill="url(#land)" />
      {Array.from({ length: 20 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="420" stroke="#1e1d17" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 11 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 40} x2="800" y2={i * 40} stroke="#1e1d17" strokeWidth="0.5" />
      ))}
      <path d="M 0,150 Q 150,160 240,140 Q 320,125 330,100" fill="none" stroke="#2a2720" strokeWidth="2" />
      <path d="M 460,120 Q 550,100 650,110 Q 750,115 800,130" fill="none" stroke="#2a2720" strokeWidth="2" />
      <circle cx="180" cy="120" r="2" fill="#9a9487" />
      <text x="185" y="108" fontFamily="JetBrains Mono" fontSize="9" fill="#9a9487">İstinye</text>
      <circle cx="500" cy="180" r="2" fill="#9a9487" />
      <text x="508" y="178" fontFamily="JetBrains Mono" fontSize="9" fill="#9a9487">Kandilli</text>
      <circle cx="150" cy="280" r="2" fill="#9a9487" />
      <text x="155" y="295" fontFamily="JetBrains Mono" fontSize="9" fill="#9a9487">Bebek</text>
      <g transform="translate(240, 200)">
        <circle r="24" fill="#C9A84C" fillOpacity="0.12" />
        <circle r="14" fill="#C9A84C" fillOpacity="0.3" />
        <circle r="6" fill="#C9A84C" />
        <line x1="0" y1="-30" x2="0" y2="-14" stroke="#C9A84C" strokeWidth="1" />
        <line x1="0" y1="14" x2="0" y2="30" stroke="#C9A84C" strokeWidth="1" />
        <line x1="-30" y1="0" x2="-14" y2="0" stroke="#C9A84C" strokeWidth="1" />
        <line x1="14" y1="0" x2="30" y2="0" stroke="#C9A84C" strokeWidth="1" />
        <text y="-38" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#C9A84C" letterSpacing="2">{name.toUpperCase()}</text>
        <text y="50" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#C9A84C" opacity="0.7">41.10°N · 29.05°E</text>
      </g>
      <g transform="translate(750, 50)">
        <circle r="20" fill="none" stroke="#C9A84C" strokeOpacity="0.4" />
        <path d="M 0,-14 L 5,10 L 0,4 L -5,10 Z" fill="#C9A84C" />
        <text y="-26" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#C9A84C">N</text>
      </g>
      <text x="20" y="405" fontFamily="JetBrains Mono" fontSize="9" fill="#6b6659" letterSpacing="2">BOSPHORUS · EUROPEAN SIDE  ·  SCALE 1:12,000</text>
    </svg>
  );
}
