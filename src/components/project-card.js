import Link from 'next/link';
import { fmtUsd, localizedName, localizedDistrict } from '@/lib/utils';
import { getDict } from '@/lib/i18n';
import { badgesFor } from '@/lib/projects';
import ProjectPlaceholder from '@/components/project-placeholder';

// A URL counts as a "placeholder" (not a real project photo) when it's empty
// or points to picsum.photos (our generic fallback). In both cases we render
// the regional gradient+name placeholder instead of a broken <img>.
function isPlaceholderUrl(url) {
  if (!url || !url.trim()) return true;
  if (url.includes('picsum.photos')) return true;
  return false;
}

export default function ProjectCard({ project, index, lang, wide = false, showFromPrefix = false }) {
  const dict = getDict(lang);
  const name = localizedName(project, lang);
  const district = localizedDistrict(project, lang);
  const badges = badgesFor(project).slice(0, 2);
  const priceLabel = typeof project.priceUsd === 'number'
    ? `${showFromPrefix ? `${dict.projects.from} ` : ''}${fmtUsd(project.priceUsd)}`
    : dict.projectsExtra.priceOnRequest;

  const showPlaceholder = isPlaceholderUrl(project.img);

  return (
    <Link
      href={`/${lang}/project/${project.id}`}
      className="block project-card cursor-pointer"
    >
      <div className={`media${wide ? ' wide' : ''}`}>
        <span className="tag">№ {String(index + 1).padStart(2, '0')}</span>
        {!showPlaceholder ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.img} alt={name} loading="lazy" />
        ) : (
          <ProjectPlaceholder project={{ ...project, name, subDistrict: project.subDistrict, district: project.district }} />
        )}
        {badges.length > 0 && (
          <div className="absolute top-5 right-5 z-[2] flex flex-col gap-1 items-end">
            {badges.map((b) => (
              <span
                key={b}
                className="font-mono text-[9px] tracking-[0.16em] uppercase px-2 py-1 bg-gold text-bg rounded-sm"
              >
                {dict.projectsExtra[`badge_${b}`]}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="pt-5 flex justify-between items-start gap-4">
        <div>
          <div className="font-serif text-[22px] leading-tight mb-1">{name}</div>
          <div className="text-xs text-fg-muted tracking-[0.08em]">
            {district.toUpperCase()}
            {project.subDistrict ? ` · ${project.subDistrict.toUpperCase()}` : ''}
            {' · '}{project.bedrooms} {dict.projects.bedrooms} · {project.area}m²
          </div>
          {project.category && (
            <div className="font-mono text-[10px] tracking-[0.18em] text-gold/80 mt-1.5 uppercase">
              {dict.projectsExtra[`cat_${project.category}`] || project.category}
            </div>
          )}
        </div>
        <div className="font-mono text-[13px] text-gold whitespace-nowrap rtl:text-left text-right">
          {priceLabel}
        </div>
      </div>
    </Link>
  );
}
