import Image from 'next/image'
import Link from 'next/link'

import { getCoverImage } from '@/lib/project-images'
import { STATIC_ALL_PROJECTS } from '@/data/static-projects'

const FEATURED_SLUGS = [
  'comfortabull',
  'camp-brigitte',
  'vaughan-intl-film-festival',
  'dynastic-wealth',
]

export async function Works() {
  const docs = STATIC_ALL_PROJECTS.filter((p) => FEATURED_SLUGS.includes(p.slug))

  return (
    <section className="section" id="services">
      <section className="section-homepage" id="works">
        <div className="container">
          <div className="projects-collection-wrapper">
            <div className="projects-collection-list" role="list">
              {docs.map((project) => {
                const coverUrl = getCoverImage(project.slug, project.coverImage)

                return (
                  <div key={project.slug} className="project" role="listitem">
                    <Link
                      href={`/project/${project.slug}`}
                      className="image-link rounded"
                      style={{ backgroundColor: project.accentColor }}
                    >
                      {coverUrl ? (
                        <Image
                          src={coverUrl}
                          alt={project.title ?? 'Project'}
                          width={660}
                          height={500}
                          className="image"
                          style={{
                            width: '100%',
                            height: 'auto',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                          sizes="(max-width: 767px) 100vw, 660px"
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            aspectRatio: '4/3',
                            backgroundColor: project.accentColor,
                          }}
                        />
                      )}
                      <div className="view-more-overlay">
                        <span className="view-more-text">View More</span>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}
