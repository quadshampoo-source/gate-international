// Location section — big typography + embedded map. Uses the keyless
// maps.google.com embed so no API key is required; zoomed enough to show
// the neighbourhood context.
export default function LocationMap({ district, city = 'Istanbul', projectName }) {
  const query = encodeURIComponent(`${projectName || district}, ${district}, ${city}`);
  const mapSrc = `https://maps.google.com/maps?q=${query}&z=14&output=embed`;

  return (
    <section
      className="py-20 md:py-28"
      style={{ background: '#0B1418', color: '#EEF0EA' }}
    >
      <div className="container-x">
        <div
          className="font-mono mb-5"
          style={{
            fontSize: 12,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#C9A84C',
          }}
        >
          № 06 — LOCATION
        </div>
        <h2
          className="font-editorial"
          style={{
            fontSize: 'clamp(40px, 9vw, 104px)',
            fontWeight: 400,
            lineHeight: 0.98,
            letterSpacing: '-0.02em',
          }}
        >
          {district}
          <span className="text-[#C9A84C]"> · </span>
          <span className="italic">{city}.</span>
        </h2>
        <div
          className="mt-10 md:mt-14 rounded-[16px] overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <iframe
            src={mapSrc}
            title={`${projectName || district} map`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block w-full"
            style={{ height: 'clamp(280px, 50vh, 520px)', border: 0, filter: 'invert(0.92) hue-rotate(180deg) saturate(0.85)' }}
          />
        </div>
      </div>
    </section>
  );
}
