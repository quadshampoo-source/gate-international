/**
 * Reusable inner-page hero — eyebrow, gradient-accent H1, sub paragraph.
 * Keeps the Atom pages visually coherent without repeating markup.
 *
 * @param {Object} props
 * @param {string} [props.eyebrow]
 * @param {React.ReactNode} props.title
 * @param {string} [props.sub]
 * @param {string} [props.align='left']  'left' | 'center'
 */
export default function AtomPageHero({ eyebrow, title, sub, align = 'left' }) {
  const alignCls = align === 'center' ? 'text-center' : 'text-left';
  const subMax = align === 'center' ? 'mx-auto' : '';
  return (
    <section className="pt-4 md:pt-8 pb-10 md:pb-14">
      <div className={`max-w-[1100px] mx-auto px-6 md:px-10 ${alignCls}`}>
        {eyebrow && (
          <span className="atom-caption" style={{ color: 'var(--primary-600)' }}>
            — {eyebrow} —
          </span>
        )}
        <h1
          className="atom-h1 mt-3"
          style={{ fontSize: 'clamp(40px, 6vw, 64px)', letterSpacing: '-0.025em' }}
        >
          {title}
        </h1>
        {sub && (
          <p className={`atom-body-lg mt-5 max-w-[640px] ${subMax}`} style={{ color: 'var(--neutral-500)' }}>
            {sub}
          </p>
        )}
      </div>
    </section>
  );
}
