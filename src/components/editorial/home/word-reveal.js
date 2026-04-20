'use client';

// Staggered word-by-word reveal for headlines. Splits the passed `text`
// on whitespace, wraps each word in an inline-block span, and stagger-
// animates them on mount. Supports a per-instance delay and a word-step
// delay. Respects prefers-reduced-motion — renders the text flat.
//
// Use italics inside the text with the marker `{word}` — e.g.
//   <WordReveal text="the value of a {view}." />
// emits <em>view</em> for that word (keeps the accent that the rest of
// the site uses for hero titles).
export default function WordReveal({
  text = '',
  delay = 0.5,
  step = 0.04,
  className = '',
  as: Tag = 'h1',
  style,
}) {
  // Preserve whitespace groups and markup tokens like {word}.
  const tokens = String(text).split(/(\s+)/);
  let wordIndex = 0;
  return (
    <Tag className={`word-reveal ${className}`} style={style}>
      <style>{`
        .word-reveal .w {
          display: inline-block;
          opacity: 0;
          transform: translateY(12px);
          animation: wordRevealIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes wordRevealIn {
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .word-reveal .w {
            opacity: 1;
            transform: none;
            animation: none;
          }
        }
      `}</style>
      {tokens.map((tok, i) => {
        if (/^\s+$/.test(tok)) return <span key={i}>{tok}</span>;
        const italic = /^\{.+\}$/.test(tok);
        const clean = italic ? tok.slice(1, -1) : tok;
        const d = delay + wordIndex * step;
        wordIndex += 1;
        return (
          <span key={i} className="w" style={{ animationDelay: `${d}s` }}>
            {italic ? <em className="italic">{clean}</em> : clean}
          </span>
        );
      })}
    </Tag>
  );
}
