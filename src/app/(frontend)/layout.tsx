import type { ReactNode } from 'react'

import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'

// ─── Styles (being migrated to Tailwind in U5) ──────────
import '../../styles/navbar.css'
import '../../styles/hero.css'
import '../../styles/layout.css'
import '../../styles/project-page.css'
import '../../styles/animations.css'
import '../../styles/responsive.css'

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
