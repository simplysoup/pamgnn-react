import { About } from '@/components/sections/About'
import { ContactSection } from '@/components/sections/ContactSection'
import { Hero } from '@/components/sections/Hero'
import { Skills } from '@/components/sections/Skills'
import { Ticker } from '@/components/sections/Ticker'
import { Works } from '@/components/sections/Works'

export default async function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <Works />
      <Skills />
      <About />
      <ContactSection />
    </>
  )
}
