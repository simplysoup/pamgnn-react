import { getPayloadClient } from '@/lib/payload'
import { getCoverImage } from '@/lib/project-images'
import Image from 'next/image'
import Link from 'next/link'

type ProjectDoc = {
  id: string | number
  slug?: string
  title?: string
  coverImage?: { url?: string } | null
  accentColor?: string
  category?: string
}

// Static fallback data shown when the database is empty or unreachable
const STATIC_WEB_DESIGN: ProjectDoc[] = [
  { id: 'static-1', slug: 'comfortabull',               title: 'Comfortabull',                  accentColor: '#141d37' },
  { id: 'static-2', slug: 'dynastic-wealth',             title: 'Dynastic Wealth',              accentColor: '#1a1a2e' },
  { id: 'static-3', slug: 'social-media-graphics-ads',   title: 'Social Media Graphics & Ads',  accentColor: '#e67e22' },
]

export default async function WebDesignPage() {
  const payload = await getPayloadClient()
  let docs: ProjectDoc[] = []

  try {
    const result = await payload.find({
      collection: 'projects' as never,
      limit: 20,
      sort: 'order',
      where: { category: { in: ['web-design'] } },
    })
    docs = (result.docs ?? []) as ProjectDoc[]
  } catch {
    docs = []
  }

  // Fall back to static data so the section always renders
  if (docs.length === 0) {
    docs = STATIC_WEB_DESIGN
  }

  return (
    <>
      <div className="page-sections">
        <div className="container">
          <h1 className="display-3" style={{ marginBottom: 60, textAlign: 'center' }}>Web Design</h1>
          <div className="projects-collection-list" role="list">
            {docs.map((project) => {
              const slug = typeof project.slug === 'string' ? project.slug : String(project.id)
              const coverUrl = getCoverImage(slug, project.coverImage?.url)
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
    </>
  )
}
