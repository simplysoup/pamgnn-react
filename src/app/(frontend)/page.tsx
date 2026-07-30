import { About } from '@/components/sections/About'
import { ContactSection } from '@/components/sections/ContactSection'
import { Hero } from '@/components/sections/Hero'
import { Skills } from '@/components/sections/Skills'
import { Ticker } from '@/components/sections/Ticker'
import { Works } from '@/components/sections/Works'

import { getPayloadClient } from '@/lib/payload'

export default async function HomePage() {
  const payload = await getPayloadClient()

  let heroLine1: string | undefined
  let heroLine2: string | undefined
  let heroLine3: string | undefined
  try {
    const settings = (await payload.findGlobal({ slug: 'site-settings' as never })) as Record<
      string,
      unknown
    >
    heroLine1 = typeof settings.heroLine1 === 'string' ? settings.heroLine1 : undefined
    heroLine2 = typeof settings.heroLine2 === 'string' ? settings.heroLine2 : undefined
    heroLine3 = typeof settings.heroLine3 === 'string' ? settings.heroLine3 : undefined
  } catch {
    // Fall through — Hero uses its own hardcoded defaults
  }

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
