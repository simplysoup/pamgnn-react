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
        <h1
          className="font-exo text-[clamp(28px,3.5vw,40px)] font-bold uppercase leading-tight tracking-wide"
          style={{ marginBottom: 60, textAlign: 'center' }}
        >
          {heading}
        </h1>
      ) : null}
      <div className="grid grid-cols-2 gap-[60px] pt-[60px]" role="list">
        {projects.map((project) => {
          const coverUrl = getCoverImage(project.slug)

          return (
            <div key={project.slug} className="[&:nth-child(odd)]:-mt-20" role="listitem">
              <Link
                href={`/project/${project.slug}`}
                className="group relative block cursor-none overflow-hidden rounded-card no-underline"
                style={{ backgroundColor: project.accentColor }}
              >
                {coverUrl ? (
                  <Image
                    src={coverUrl}
                    alt={project.title}
                    width={660}
                    height={500}
                    className="block h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
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
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-[250ms] group-hover:opacity-100">
                  <span className="font-exo rounded-pill bg-[rgba(44,33,69,0.75)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.05em] text-white backdrop-blur-md">
                    View More
                  </span>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </>
  )
}
