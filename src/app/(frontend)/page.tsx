import { About } from '@/components/sections/About'
import { ContactSection } from '@/components/sections/ContactSection'
import { Hero } from '@/components/sections/Hero'
import { Skills } from '@/components/sections/Skills'
import { Ticker } from '@/components/sections/Ticker'
import { Works } from '@/components/sections/Works'

import { heroLine1, heroLine2, heroLine3 } from '@/data/site-settings'

export default async function HomePage() {
  return (
    <>
      <Hero heroLine1={heroLine1} heroLine2={heroLine2} heroLine3={heroLine3} />
      <Ticker />
      <Works />
      <Skills />
      <About />
      <ContactSection />
    </>
  )
}
