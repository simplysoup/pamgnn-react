'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import type { SectionDetailsGrid as SectionDetailsGridType, ContentSection } from '@/types/content-sections'
import { SectionText } from './SectionText'
import { SectionFullWidthImage } from './SectionFullWidthImage'
import { SectionSideBySide } from './SectionSideBySide'

/* ─── Tool icon lookup ──────────────────────────────────── */
const TOOL_ICONS: Record<string, string> = {
  'clip-studio': '/images/tools/clip-studio.png',
  'photoshop': '/images/tools/photoshop.png',
  'illustrator': '/images/tools/illustrator.png',
}

/* ─── Internal section renderer for nested content ──────── */
function NestedSection({ section, index }: { section: ContentSection; index: number }) {
  switch (section.type) {
    case 'text':
      return <SectionText key={index} {...section} />
    case 'fullWidthImage':
      return <SectionFullWidthImage key={index} {...section} />
    case 'sideBySide':
      return <SectionSideBySide key={index} {...section} />
    default:
      return null
  }
}

/* ─── Easing ─────────────────────────────────────────────── */
const easeOutExpo = [0.22, 1, 0.36, 1] as [number, number, number, number]

/**
 * Renders a detailsGrid section: 12-column layout with a sticky sidebar
 * (client, category, role, tools) on the left and nested content on the right.
 */
export function SectionDetailsGrid({ sidebar, content }: SectionDetailsGridType) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <motion.section
      ref={ref}
      className="content-section"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: easeOutExpo }}
    >
      <div className="content-grid-12">
        {/* Sidebar column */}
        <div className="content-sidebar">
          {sidebar.map((detail, i) => (
            <div key={i} className="sidebar-detail-row">
              <span className="sidebar-detail-label">{detail.label}</span>
              {detail.value ? (
                <p className="sidebar-detail-value">{detail.value}</p>
              ) : null}
              {detail.tags && detail.tags.length > 0 ? (
                <div className="sidebar-tag-list">
                  {detail.tags.map((tag) => (
                    <span key={tag} className="sidebar-tag">{tag}</span>
                  ))}
                </div>
              ) : null}
              {detail.toolSlugs && detail.toolSlugs.length > 0 ? (
                <div className="sidebar-tool-icons">
                  {detail.toolSlugs.map((slug) => {
                    const iconSrc = TOOL_ICONS[slug]
                    return iconSrc ? (
                      <Image
                        key={slug}
                        src={iconSrc}
                        alt={slug}
                        width={28}
                        height={28}
                        className="tool-icon"
                      />
                    ) : null
                  })}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {/* Main content column */}
        <div className="content-main">
          {content.map((section, i) => (
            <NestedSection key={i} section={section} index={i} />
          ))}
        </div>
      </div>
    </motion.section>
  )
}
