import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { getCoverImage } from '@/lib/project-images'
import Image from 'next/image'

type ProjectDoc = {
  id: string | number
  slug?: string
  title?: string
  coverImage?: { url?: string } | null
  accentColor?: string
}

const STATIC_MOTION_PROJECTS: ProjectDoc[] = [
  { id: 'static-1', slug: 'shinee-love-sick',            title: 'Shinee Love Sick',              accentColor: '#7b2d8b' },
  { id: 'static-2', slug: 'vaughan-intl-film-festival',  title: 'Vaughan Intl. Film Festival',   accentColor: '#c0392b' },
  { id: 'static-3', slug: 'animated-business-cards',      title: 'Animated Business Cards',       accentColor: '#16a085' },
  { id: 'static-4', slug: 'social-media-graphics-ads',    title: 'Social Media Graphics & Ads',   accentColor: '#e67e22' },
]

export default async function ReelPage() {
  const payload = await getPayloadClient()
  let docs: ProjectDoc[] = []

  try {
    const result = await payload.find({
      collection: 'projects' as never,
      limit: 20,
      sort: 'order',
      where: { category: { in: ['motion'] } },
    })
    docs = (result.docs ?? []) as ProjectDoc[]
  } catch {
    docs = []
  }

  if (docs.length === 0) {
    docs = STATIC_MOTION_PROJECTS
  }

  return (
    <>
      <div className="page-sections">
        <div className="container">
          <h1 className="display-3" style={{ marginBottom: 20, textAlign: 'center' }}>Reel</h1>
          <p style={{ fontSize: '18px', lineHeight: '30px', color: 'var(--dark-70)', textAlign: 'center', maxWidth: 600, margin: '0 auto 40px' }}>
            Demo reel and motion work portfolio. View selected projects on{' '}
            <Link href="https://vimeo.com/pamgnn" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'var(--primary)' }}>Vimeo</Link>
            {' '}and{' '}
            <Link href="https://www.youtube.com/@pamgraphicdesign" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'var(--primary)' }}>YouTube</Link>.
          </p>

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
                      <span className="view-more-text">View Project</span>
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
