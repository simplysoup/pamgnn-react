/* ─── Structured project content sections ───────────────── */
/* A discriminated union for interleaved content sections    */
/* that can be serialized from Payload CMS blocks later.     */

export type HeadingStyle = 'h2' | 'sidebar'

export type ContentSection =
  | SectionText
  | SectionFullWidthImage
  | SectionDetailsGrid
  | SectionSideBySide

export type SectionText = {
  type: 'text'
  heading?: string
  headingStyle?: HeadingStyle
  html: string
}

export type SectionFullWidthImage = {
  type: 'fullWidthImage'
  src: string
  alt: string
  width?: number
}

export type SidebarDetail = {
  label: string
  value?: string
  tags?: string[]
  toolSlugs?: string[]
}

export type SectionDetailsGrid = {
  type: 'detailsGrid'
  sidebar: SidebarDetail[]
  content: ContentSection[]
}

export type ImageSection = {
  src: string
  alt: string
  width?: number
}

export type SectionSideBySide = {
  type: 'sideBySide'
  left: ImageSection
  right: ImageSection
}
