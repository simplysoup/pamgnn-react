'use client'

import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'

import { getCoverImage } from '@/lib/project-images'

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
    <section className="py-20 pb-[100px] bg-ticker" ref={ref}>
      <div className="w-full max-w-[1290px] mx-auto px-10 pb-15 relative">
        <motion.h2
          className="text-[clamp(28px,3.5vw,40px)] font-bold font-exo tracking-wide uppercase m-0 mb-10 text-dark"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: easeOutExpo }}
        >
          More Projects
        </motion.h2>

        <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-lg:gap-5 max-md:grid-cols-1 max-md:gap-6">
          {related.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: easeOutExpo, delay: i * 0.1 }}
            >
              <Link
                href={`/project/${project.slug}`}
                className="group block no-underline text-inherit"
              >
                <div
                  className="relative aspect-[4/3] rounded-card overflow-hidden mb-3"
                  style={{ backgroundColor: project.accentColor || '#4b1f44' }}
                >
                  {(() => {
                    const coverUrl = getCoverImage(project.slug, project.coverImage)
                    return coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.06] [transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)]"
                        sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 25vw"
                      />
                    ) : null
                  })()}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-250 group-hover:opacity-100">
                    <span className="bg-[rgba(44,33,69,0.75)] backdrop-blur-md text-white tracking-wider uppercase text-xs font-semibold px-4 py-[10px] rounded-[50px] font-exo">
                      View Project
                    </span>
                  </div>
                </div>
                <h3 className="text-base font-bold font-exo tracking-[0.02em] m-0 text-dark leading-[1.3]">
                  {project.title}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
