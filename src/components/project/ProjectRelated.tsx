'use client'

import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'

/* ─── Easing ───────────────────────────────────────────── */
const easeOutExpo = [0.22, 1, 0.36, 1] as [number, number, number, number]

/* ─── Props ─────────────────────────────────────────────── */
type RelatedProject = {
  slug: string
  title: string
  coverImage?: string | null
  accentColor?: string
}

type ProjectRelatedProps = {
  projects: RelatedProject[]
  currentSlug: string
}

export function ProjectRelated({ projects, currentSlug }: ProjectRelatedProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  // Filter out current project and take up to 4
  const related = projects.filter((p) => p.slug !== currentSlug).slice(0, 4)

  if (related.length === 0) return null

  return (
    <section className="project-related" ref={ref}>
      <div className="container">
        <motion.h2
          className="project-related-heading"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: easeOutExpo }}
        >
          More Projects
        </motion.h2>

        <div className="project-related-grid">
          {related.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: easeOutExpo, delay: i * 0.1 }}
            >
              <Link href={`/project/${project.slug}`} className="project-related-card">
                <div
                  className="project-related-card-media"
                  style={{ backgroundColor: project.accentColor || '#4b1f44' }}
                >
                  {project.coverImage ? (
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      className="project-related-card-image"
                      sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 25vw"
                    />
                  ) : null}
                  <div className="project-related-card-overlay">
                    <span className="project-related-card-label">View Project</span>
                  </div>
                </div>
                <h3 className="project-related-card-title">{project.title}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
