import Image from 'next/image'
import Link from 'next/link'

import { getPayloadClient } from '@/lib/payload'

type ProjectDoc = {
  id: string | number
  slug?: string
  title?: string
  coverImage?: { url?: string } | null
  accentColor?: string
}

// Local image fallbacks by slug (from Webflow export)
const SLUG_IMAGES: Record<string, string> = {
  'comfortabull':             '/images/project-comfortabull.png',
  'camp-brigitte':            '/images/project-camp-brigitte.webp',
  'vaughan-intl-film-festival': '/images/project-vaughan.jpg',
  'dynastic-wealth':          '/images/project-dynastic.png',
  'pearl-earring':            '/images/project-pearl-earring.jpg',
  'animated-business-cards':  '/images/project-animated-business-cards.webp',
  'social-media-graphics-ads': '/images/project-social-media.webp',
}

export async function Works() {
  const payload = await getPayloadClient()

  let docs: ProjectDoc[] = []

  try {
    const result = await payload.find({
      collection: 'projects' as never,
      limit: 8,
      sort: 'order',
      where: { featured: { equals: true } },
    })
    docs = (result.docs ?? []) as ProjectDoc[]
  } catch {
    docs = []
  }

  return (
    <section className="section" id="services">
      <section className="section-homepage" id="works">
        <div className="container">
          <div className="projects-collection-wrapper">
            <div className="projects-collection-list" role="list">
              {docs.map((project) => {
                const slug = typeof project.slug === 'string' ? project.slug : String(project.id)
                const coverUrl = project.coverImage?.url ?? SLUG_IMAGES[slug] ?? null
                const color = project.accentColor ?? '#4b1f44'

                return (
                  <div key={String(project.id)} className="project" role="listitem">
                    <Link
                      href={`/project/${slug}`}
                      className="image-link rounded"
                      style={{ backgroundColor: color }}
                    >
                      {coverUrl ? (
                        <Image
                          src={coverUrl}
                          alt={project.title ?? 'Project'}
                          width={660}
                          height={500}
                          className="image"
                          style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }}
                          sizes="(max-width: 767px) 100vw, 660px"
                        />
                      ) : (
                        <div style={{ width: '100%', aspectRatio: '4/3', backgroundColor: color }} />
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
