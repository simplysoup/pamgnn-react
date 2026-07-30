import Image from 'next/image'
import Link from 'next/link'

import { getCoverImage } from '@/lib/project-images'

export type ProjectCardGridProps = {
  projects: { slug: string; title: string; accentColor: string }[]
  heading?: string
}

export function ProjectCardGrid({ projects, heading }: ProjectCardGridProps) {
  return (
    <>
      {heading ? (
        <h1 className="display-3" style={{ marginBottom: 60, textAlign: 'center' }}>
          {heading}
        </h1>
      ) : null}
      <div className="projects-collection-list" role="list">
        {projects.map((project) => {
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
                    alt={project.title}
                    width={660}
                    height={500}
                    className="image"
                    style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }}
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
    </>
  )
}
