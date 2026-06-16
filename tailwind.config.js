/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#060F1A',
          800: '#0A1628',
          700: '#0D1B2E',
          600: '#13243B',
          500: '#16294A',
          400: '#1E3A5C',
        },
        gold: {
          50:  '#FDF8E8',
          100: '#F8ECC4',
          200: '#F0D882',
          300: '#E8C766',
          400: '#D4A843',
          500: '#9A7A2E',
          600: '#7A5C00',
        },
        /* CSS-var semantic tokens for the futuristic redesign */
        brand: {
          navy:     'var(--navy)',
          mid:      'var(--navy-mid)',
          elevated: 'var(--navy-elevated)',
          surface:  'var(--navy-surface)',
          gold:     'var(--gold)',
          bright:   'var(--gold-bright)',
          bronze:   'var(--bronze)',
          cream:    'var(--cream)',
          slate:    'var(--slate)',
          green:    'var(--live-green)',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gold-gradient':  'linear-gradient(135deg, #E8C766 0%, #D4A843 50%, #9A7A2E 100%)',
        'gold-shine':     'linear-gradient(135deg, #F0D882 0%, #D4A843 40%, #9A7A2E 100%)',
        'navy-gradient':  'linear-gradient(180deg, #0A1628 0%, #0D1B2E 100%)',
        'glass-shine':    'linear-gradient(135deg, rgba(232,199,102,0.08) 0%, rgba(19,36,59,0) 100%)',
      },
      boxShadow: {
        'gold-sm':       '0 0 12px rgba(212,168,67,0.20)',
        'gold-md':       '0 0 28px rgba(212,168,67,0.25)',
        'gold-lg':       '0 0 52px rgba(212,168,67,0.20)',
        'gold-xl':       '0 0 80px rgba(212,168,67,0.15)',
        'glass':         '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(232,199,102,0.06)',
        'glass-hover':   '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(232,199,102,0.10), 0 0 24px rgba(212,168,67,0.08)',
        'card':          '0 4px 24px rgba(0,0,0,0.3)',
        'card-hover':    '0 8px 40px rgba(0,0,0,0.4)',
        'gold-glow':     '0 0 20px rgba(212,168,67,0.4)',
        'gold-glow-lg':  '0 0 40px rgba(212,168,67,0.3)',
      },
      animation: {
        'shimmer':      'shimmer 2.5s linear infinite',
        'float':        'float 3s ease-in-out infinite',
        'pulse-gold':   'pulseGold 2s ease-in-out infinite',
        'aurora-1':     'aurora-1 22s ease-in-out infinite',
        'aurora-2':     'aurora-2 28s ease-in-out infinite',
        'aurora-3':     'aurora-3 19s ease-in-out infinite',
        'grain':        'grain-shift 8s steps(10) infinite',
        'pulse-live':   'pulseGold 2.5s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.55' },
        },
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'decel':   'cubic-bezier(0.0, 0.0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
