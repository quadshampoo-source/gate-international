import Link from 'next/link';

/**
 * Gradient CTA button. Pairs with the Atom design system in
 * `src/styles/tokens.css`. Use `href` to render an `<a>` (or Next Link);
 * omit it for a plain `<button>`.
 *
 * @param {Object} props
 * @param {'primary'|'ghost'|'coral'} [props.variant='primary']
 * @param {'md'|'lg'} [props.size='md']
 * @param {string} [props.href]
 * @param {boolean} [props.external]
 * @param {boolean} [props.arrow=true]
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function Button({
  variant = 'primary',
  size = 'md',
  href,
  external,
  arrow = true,
  className = '',
  children,
  type = 'button',
  ...rest
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atom-primary-500 focus-visible:ring-offset-2';

  const sizes = {
    md: 'px-6 py-3 text-sm rounded-atom-md',
    lg: 'px-8 py-4 text-base rounded-atom-md',
  };

  const variants = {
    primary: 'text-white bg-atom-cta shadow-atom-cta hover:scale-[1.02] hover:shadow-atom-cta-hover',
    coral: 'text-white hover:scale-[1.02]',
    ghost: 'text-atom-neutral-900 bg-transparent border border-atom-neutral-200 hover:bg-atom-neutral-100',
  };

  const styleByVariant = variant === 'coral'
    ? { background: 'var(--accent-coral)', boxShadow: '0 8px 24px rgba(255, 107, 92, 0.3)' }
    : undefined;

  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`.trim();

  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      )}
    </>
  );

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={styleByVariant} {...rest}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} style={styleByVariant} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={cls} style={styleByVariant} {...rest}>
      {content}
    </button>
  );
}

export default Button;
