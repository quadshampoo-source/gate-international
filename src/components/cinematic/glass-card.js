'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fmtUsd, localizedName, localizedDistrict } from '@/lib/utils';
import { getDict } from '@/lib/i18n';
import { badgesFor } from '@/lib/projects';

function hashGradient(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const a = h % 360;
  const b = (a + 60) % 360;
  return `linear-gradient(135deg, hsl(${a} 50% 22%) 0%, hsl(${b} 55% 14%) 100%)`;
}

export default function GlassCard({ project, lang, index }) {
  const dict = getDict(lang);
  const name = localizedName(project, lang);
  const district = localizedDistrict(project, lang);
  const badges = badgesFor(project).slice(0, 1);
  const priceLabel =
    typeof project.priceUsd === 'number'
      ? `${dict.projects.from} ${fmtUsd(project.priceUsd)}`
      : dict.projectsExtra.priceOnRequest;
  const hasImg = !!project.img;

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}>
      <Link
        href={`/${lang}/project/${project.id}`}
        className="group block relative overflow-hidden rounded-[24px] border border-gold/15 backdrop-blur-xl bg-bg-raised/50 hover:border-gold/50 transition-colors"
      >
        {/* Media */}
        <div
          className="relative aspect-[4/5] overflow-hidden"
          style={!hasImg ? { background: hashGradient(project.id) } : undefined}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-[1]" />
          {hasImg && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.img}
              alt={name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105 saturate-[0.95]"
            />
          )}

          {/* Badge */}
          {badges.length > 0 && (
            <div className="absolute top-4 left-4 z-[2]">
              <span className="inline-flex backdrop-blur-lg bg-gold/90 text-bg font-mono text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 rounded-full">
                {dict.projectsExtra[`badge_${badges[0]}`]}
              </span>
            </div>
          )}

          {/* Number */}
          <div className="absolute top-4 right-4 z-[2] font-mono text-[10px] tracking-[0.2em] text-fg/60">
            № {String(index + 1).padStart(2, '0')}
          </div>

          {/* Bottom glass info block */}
          <div className="absolute inset-x-0 bottom-0 z-[2] p-5 md:p-6">
            <div className="backdrop-blur-xl bg-black/35 border-t border-gold/15 rounded-[16px] p-4 md:p-5">
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <div className="font-serif text-[20px] md:text-[22px] leading-tight truncate">{name}</div>
                  <div className="text-[11px] text-fg-muted tracking-[0.1em] mt-1 truncate">
                    {district.toUpperCase()}
                    {project.subDistrict ? ` · ${project.subDistrict.toUpperCase()}` : ''}
                    {' · '}{project.bedrooms} {dict.projects.bedrooms}
                  </div>
                </div>
                <div className="font-mono text-[12px] text-gold whitespace-nowrap">{priceLabel}</div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
