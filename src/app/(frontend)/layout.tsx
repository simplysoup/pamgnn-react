import type { ReactNode } from 'react'

import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import './styles.css'

export const metadata = {
  description: 'Pamela Desplenter — Design, Web, Animation',
  title: 'Pamela Desplenter | Design - Web - Animation',
}

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
