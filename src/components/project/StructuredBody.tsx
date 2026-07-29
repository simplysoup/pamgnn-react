'use client'

import type { ContentSection } from '@/types/content-sections'
import { SectionText } from './SectionText'
import { SectionFullWidthImage } from './SectionFullWidthImage'
import { SectionDetailsGrid } from './SectionDetailsGrid'
import { SectionSideBySide } from './SectionSideBySide'

/* ─── Props ─────────────────────────────────────────────── */
type StructuredBodyProps = {
  sections: ContentSection[]
}

/**
 * Entry point for structured project content.
 * Maps over ContentSection[] and dispatches each section by its type discriminator.
 */
export function StructuredBody({ sections }: StructuredBodyProps) {
  if (!sections || sections.length === 0) return null

  return (
    <>
      {sections.map((section, index) => {
        switch (section.type) {
          case 'text':
            return <SectionText key={index} {...section} />
          case 'fullWidthImage':
            return <SectionFullWidthImage key={index} {...section} />
          case 'detailsGrid':
            return <SectionDetailsGrid key={index} {...section} />
          case 'sideBySide':
            return <SectionSideBySide key={index} {...section} />
          default:
            return null
        }
      })}
    </>
  )
}
