/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#060F1A',
          800: '#0B1F33',
          700: '#0F2640',
          600: '#132D4A',
          500: '#1A3A5C',
        },
        gold: {
          50:  '#FDF8E8',
          100: '#F8ECC4',
          200: '#F0D882',
          300: '#E8C96C',
          400: '#C9A84C',
          500: '#A88A2C',
          600: '#8A6A00',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F0D882 0%, #C9A84C 50%, #8A6A00 100%)',
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(201, 168, 76, 0.4)',
        'gold-glow-lg': '0 0 40px rgba(201, 168, 76, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
