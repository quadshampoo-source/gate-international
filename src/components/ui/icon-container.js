/**
 * 64×64 primary-tinted square that houses an icon (SVG). Subtle inner
 * shadow for depth. Icon content inherits `color: var(--primary-600)`.
 *
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children  The icon (SVG) to render inside.
 */
export function IconContainer({ size = 'md', className = '', children }) {
  const dim = { sm: 48, md: 64, lg: 80 }[size];
  const radius = size === 'sm' ? 'var(--atom-radius-md)' : 'var(--atom-radius-lg)';

  return (
    <span
      aria-hidden
      className={`inline-flex items-center justify-center flex-shrink-0 ${className}`.trim()}
      style={{
        width: dim,
        height: dim,
        borderRadius: radius,
        background: 'var(--primary-100)',
        color: 'var(--primary-600)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(15,22,36,0.04)',
      }}
    >
      {children}
    </span>
  );
}

export default IconContainer;
