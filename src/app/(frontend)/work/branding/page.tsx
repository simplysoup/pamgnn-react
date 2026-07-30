import { getCoverImage } from '@/lib/project-images'
import { STATIC_PROJECTS } from '@/data/static-projects'
import Image from 'next/image'
import Link from 'next/link'

const docs = Object.entries(STATIC_PROJECTS)
  .filter(([_, p]) => p.categories?.includes('identity'))
  .map(([slug, p]) => ({ slug, title: p.title, accentColor: p.accentColor }))

export default async function BrandingPage() {
  return (
    <>
      <div className="page-sections">
        <div className="container">
          <h1 className="display-3" style={{ marginBottom: 60, textAlign: 'center' }}>
            Identity &amp; Branding
          </h1>
          <div className="projects-collection-list" role="list">
            {docs.map((project) => {
              const coverUrl = getCoverImage(project.slug)

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
    </>
  )
}
