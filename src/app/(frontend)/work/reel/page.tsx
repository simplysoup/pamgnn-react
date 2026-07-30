import { getCoverImage } from '@/lib/project-images'
import Image from 'next/image'
import Link from 'next/link'
import { ReelVideoPlayer } from '@/components/project/ReelVideoPlayer'

type ProjectDoc = {
  id: string | number
  slug?: string
  title?: string
  coverImage?: { url?: string } | null
  accentColor?: string
  category?: string
}

const STATIC_DATA: ProjectDoc[] = [
  { id: 'static-1', slug: 'shinee-love-sick', title: 'Shinee Love Sick', accentColor: '#7b2d8b' },
  {
    id: 'static-2',
    slug: 'vaughan-intl-film-festival',
    title: 'Vaughan Intl. Film Festival',
    accentColor: '#c0392b',
  },
  {
    id: 'static-3',
    slug: 'animated-business-cards',
    title: 'Animated Business Cards',
    accentColor: '#16a085',
  },
  {
    id: 'static-4',
    slug: 'social-media-graphics-ads',
    title: 'Social Media Graphics & Ads',
    accentColor: '#e67e22',
  },
  { id: 'static-5', slug: 'atla-reanimated', title: 'ATLA Reanimated', accentColor: '#2a4b7c' },
]

export default async function ReelPage() {
  const docs = STATIC_DATA

  return (
    <>
      <ReelVideoPlayer
        vimeoId="638941634"
        title="Reel"
        description="Demo reel and motion work portfolio. View selected projects on Vimeo and YouTube."
      />
      <div className="page-sections">
        <div className="container">
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
                        style={{
                          width: '100%',
                          height: 'auto',
                          objectFit: 'cover',
                          display: 'block',
                        }}
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
