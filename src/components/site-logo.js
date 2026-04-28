import Link from 'next/link';
import Image from 'next/image';

/**
 * Renders the brand link — either an admin-uploaded PNG logo, or a
 * per-variant fallback wordmark. Every usage wraps `<Link href="/{lang}">`
 * and carries an aria-label so screen readers always get "Gate
 * International" even when the image is missing.
 *
 * @param {Object} props
 * @param {string} [props.lang='en']
 * @param {string|null} [props.logoUrl]
 * @param {string|null} [props.logoAlt]
 * @param {'atom'|'editorial'|'legacy'|'mark'} [props.variant='editorial']
 *   Controls the fallback wordmark style when no PNG is present.
 * @param {number} [props.height]   Override PNG height (default 28/32 responsive).
 * @param {string} [props.className]
 * @param {React.CSSProperties} [props.style]
 */
export default function SiteLogo({
  lang = 'en',
  logoUrl = null,
  logoAlt = null,
  variant = 'editorial',
  height,
  className = '',
  style,
}) {
  const alt = logoAlt || 'Gate International';

  // For admin-uploaded logos, dimensions vary so we use width/height=auto via
  // explicit base size + responsive style. `unoptimized` avoids re-encoding
  // the brand mark (PNGs uploaded by admins are already tuned).
  const inner = logoUrl ? (
    <Image
      src={logoUrl}
      alt={alt}
      width={200}
      height={height || 32}
      sizes={`${height || 32}px`}
      unoptimized
      className="w-auto select-none"
      style={{
        height: height ? `${height}px` : undefined,
        objectFit: 'contain',
        ...style,
      }}
    />
  ) : (
    <Fallback variant={variant} />
  );

  return (
    <Link
      href={`/${lang}`}
      aria-label="Gate International"
      className={`inline-flex items-center gap-3 ${className}`.trim()}
      style={logoUrl && !height ? { height: '32px' } : undefined}
    >
      {inner}
    </Link>
  );
}

function Fallback({ variant }) {
  if (variant === 'atom') {
    return (
      <>
        <span
          aria-hidden
          className="inline-grid place-items-center font-bold"
          style={{
            width: 36, height: 36,
            borderRadius: 10,
            background: 'var(--gradient-cta)',
            color: '#fff',
            fontSize: 18,
            boxShadow: '0 4px 12px rgba(99,102,241,0.30)',
          }}
        >
          G
        </span>
        <span className="hidden sm:inline font-semibold text-base" style={{ color: 'var(--neutral-900)' }}>
          Gate International
        </span>
      </>
    );
  }
  if (variant === 'legacy') {
    return (
      <>
        <span className="logo-mark" aria-hidden>G</span>
        <span>
          <span className="logo-text">Gate International</span>
          <span className="logo-sub" style={{ display: 'block' }}>EST. 2009</span>
        </span>
      </>
    );
  }
  if (variant === 'mark') {
    return <span className="font-serif italic text-[17px]" style={{ color: 'currentColor' }}>G</span>;
  }
  // editorial (default): serif wordmark matching the existing pill nav
  return (
    <span className="font-editorial text-[16px] md:text-[17px] leading-none whitespace-nowrap">
      Gate <span className="italic">International</span>
    </span>
  );
}
