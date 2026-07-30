import type { ReactNode } from 'react'

import { exo, playfair, urbanist } from '@/lib/fonts'
import './globals.css'

export const metadata = {
  description: 'Pamela Desplenter portfolio built with Next.js.',
  title: 'Pamela Desplenter',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${urbanist.variable} ${playfair.variable} ${exo.variable}`}>
      <body>{children}</body>
    </html>
  )
}
