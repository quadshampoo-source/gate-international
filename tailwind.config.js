/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,jsx}",
    "./src/app/**/*.{js,jsx}",
    "./src/lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        'bg-raised': 'rgb(var(--c-bg-raised) / <alpha-value>)',
        'bg-sunken': 'rgb(var(--c-bg-sunken) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        'line-strong': 'rgb(var(--c-line-strong) / <alpha-value>)',
        fg: 'rgb(var(--c-fg) / <alpha-value>)',
        'fg-muted': 'rgb(var(--c-fg-muted) / <alpha-value>)',
        'fg-dim': 'rgb(var(--c-fg-dim) / <alpha-value>)',
        gold: 'rgb(var(--c-gold) / <alpha-value>)',
        'gold-dim': 'rgb(var(--c-gold-dim) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        container: '1400px',
      },
      spacing: {
        15: '60px',
        25: '100px',
        30: '120px',
      },
      transitionTimingFunction: {
        ease: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      keyframes: {
        kenBurns: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.08) translate(-1%, -1%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        kenBurns: 'kenBurns 20s ease-in-out infinite alternate',
        fadeUp: 'fadeUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
