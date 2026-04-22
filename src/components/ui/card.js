/**
 * Gradient-border card. A 2px gradient hairline sits on the top edge and
 * carries the rounded corners. Set `hairline={false}` for a flat card
 * (still keeps the soft shadow + radius).
 *
 * @param {Object} props
 * @param {boolean} [props.hairline=true]
 * @param {'md'|'lg'|'xl'} [props.padding='lg']
 * @param {'center'|'left'} [props.align='center']
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function Card({
  hairline = true,
  padding = 'lg',
  align = 'center',
  className = '',
  children,
  ...rest
}) {
  const pad = {
    md: 'p-6 md:p-8',
    lg: 'p-8 md:p-12',
    xl: 'p-10 md:p-16',
  }[padding];
  const alignCls = align === 'center' ? 'text-center' : 'text-left';
  const hair = hairline ? 'atom-hairline-top' : '';

  return (
    <article
      className={`relative overflow-hidden bg-atom-white shadow-atom-md rounded-atom-lg ${hair} ${pad} ${alignCls} ${className}`.trim()}
      {...rest}
    >
      {children}
    </article>
  );
}

export default Card;
