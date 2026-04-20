// Shared tile background: uses `project.img` when provided, otherwise
// falls back to a stable pastel gradient derived from the project id.
// Keeps the scale-on-hover behaviour so group-hover:scale works on the parent.

function tileHue(seed = '') {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return h;
}

export default function EditorialTileBg({ project, alt }) {
  const img = project?.img && String(project.img).trim();
  const hue = tileHue(project?.id || project?.name || '');
  if (img) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={img}
        alt={alt || project?.name || ''}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.04]"
      />
    );
  }
  return (
    <div
      className="absolute inset-0 transition-transform duration-[800ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.04]"
      style={{ background: `linear-gradient(135deg, hsl(${hue} 35% 72%), hsl(${(hue + 40) % 360} 40% 54%))` }}
    />
  );
}
