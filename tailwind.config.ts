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
    },
  },
}

export default config
