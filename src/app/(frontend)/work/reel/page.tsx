import { getCoverImage } from '@/lib/project-images'
import { STATIC_ALL_PROJECTS } from '@/data/static-projects'
import { ReelVideoPlayer } from '@/components/project/ReelVideoPlayer'
import Image from 'next/image'
import Link from 'next/link'

const docs = STATIC_ALL_PROJECTS.filter((p) => {
  const slug = p.slug
  return (
    slug === 'shinee-love-sick' ||
    slug === 'vaughan-intl-film-festival' ||
    slug === 'animated-business-cards' ||
    slug === 'social-media-graphics-ads' ||
    slug === 'atla-reanimated'
  )
})

export default async function ReelPage() {
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
