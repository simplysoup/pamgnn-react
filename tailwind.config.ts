import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: '#12181a',
        dark2: '#293033',
        secondary: '#4b1f44',
        ticker: '#f4e5e4',
        backdrop: '#171d1f',
        bhover: '#dbdcdd',
        'dark-70': 'rgba(18,24,26,0.7)',
        white: '#ffffff',
      },
      fontFamily: {
        sans: ['Urbanist', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        exo: ['Exo', 'sans-serif'],
      },
      letterSpacing: {
        wide: '0.03em',
      },
      borderRadius: {
        card: '10px',
        pill: '50px',
      },
      spacing: {
        xs: '80px',
        s: '110px',
        m: '140px',
        l: '200px',
      },
      keyframes: {
        float1: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(8px, -14px) rotate(5deg)' },
          '50%': { transform: 'translate(-6px, -22px) rotate(-3deg)' },
          '75%': { transform: 'translate(-12px, -8px) rotate(2deg)' },
        },
        float2: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(-10px, -18px) rotate(-6deg)' },
          '66%': { transform: 'translate(12px, -10px) rotate(4deg)' },
        },
        float3: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '40%': { transform: 'translate(6px, -20px)' },
          '80%': { transform: 'translate(-8px, -12px)' },
        },
        float4: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-10px, -16px) scale(1.04)' },
        },
        heroFadeUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float1: 'float1 6s ease-in-out infinite',
        float2: 'float2 5s ease-in-out infinite 0.8s',
        float3: 'float3 4.5s ease-in-out infinite',
        float4: 'float4 6.5s ease-in-out infinite 1.8s',
        'hero-fade-up': 'heroFadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
}

export default config
