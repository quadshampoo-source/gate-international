'use client';

import { forwardRef } from 'react';

// Unified pill/circle action used in the atom header (hamburger, theme toggle,
// lang dropdown). 40px tall, neutral border, primary-50 fill when active or
// hovered. Icon-only renders as a 40×40 circle; when children include text
// the same height yields a pill automatically thanks to rounded-full.
const HeaderAction = forwardRef(function HeaderAction(
  { active = false, className = '', style, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      {...rest}
      className={`atom-header-action inline-flex items-center justify-center gap-1.5 h-10 min-w-10 px-2 text-sm font-medium transition-colors hover:bg-[var(--primary-50)] hover:border-[var(--primary-200)] hover:text-[var(--primary-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-200)] ${className}`.trim()}
      data-active={active || undefined}
      style={{
        background: active ? 'var(--primary-50)' : 'transparent',
        border: '1px solid var(--neutral-200)',
        borderRadius: 'var(--atom-radius-pill)',
        color: 'var(--neutral-700)',
        ...style,
      }}
    >
      {children}
    </button>
  );
});

export default HeaderAction;
