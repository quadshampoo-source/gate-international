import Link from 'next/link';

/**
 * Pill chip for category / filter tags. Use `active` for the current
 * selection, or pass `href` to render a Link. For click-to-filter UI,
 * pass `onClick` and `active` together with a plain `<button>`.
 *
 * @param {Object} props
 * @param {boolean} [props.active=false]
 * @param {string} [props.href]
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function PillTag({
  active = false,
  href,
  className = '',
  children,
  onClick,
  ...rest
}) {
  const base = 'inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atom-primary-500 focus-visible:ring-offset-2';
  const state = active
    ? 'bg-atom-primary-200 text-atom-primary-700'
    : 'bg-atom-primary-100 text-atom-primary-700 hover:bg-atom-primary-200';

  const cls = `${base} ${state} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={cls} {...rest}>{children}</Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls} {...rest}>
      {children}
    </button>
  );
}

export default PillTag;
