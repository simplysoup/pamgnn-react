import { Exo, Playfair_Display, Urbanist } from 'next/font/google'

export const urbanist = Urbanist({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-sans',
})

export const playfair = Playfair_Display({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-serif',
})

export const exo = Exo({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-exo',
})
