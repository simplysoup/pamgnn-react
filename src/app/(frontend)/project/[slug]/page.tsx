import { notFound } from 'next/navigation'

import { ProjectHero } from '@/components/project/ProjectHero'
import { ProjectRelated } from '@/components/project/ProjectRelated'
import { StaticBody } from '@/components/project/StaticBody'
import { StructuredBody } from '@/components/project/StructuredBody'
import { ProcessSection } from '@/components/project/ProcessSection'

import { STATIC_PROJECTS } from '@/data/static-projects'
import { getProject, getRelatedProjects } from '@/lib/project-helpers'

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return Object.keys(STATIC_PROJECTS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProject(slug)
  if (project) {
    return { title: `${project.title} | Pamela Desplenter Portfolio` }
  }
  return {}
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProject(slug)

  if (!project) {
    notFound()
  }

  const { title, summary, contentHtml, sections, categories, process } = project
  const relatedProjects = getRelatedProjects(slug)

  return (
    <>
      <ProjectHero title={title} summary={summary ?? ''} categories={categories ?? undefined} />

      <section className="project-content-section">
        <div className="container">
          <div className="project-body">
            {sections && sections.length > 0 ? <StructuredBody sections={sections} /> : null}
            {!sections && contentHtml ? <StaticBody contentHtml={contentHtml} /> : null}
          </div>
        </div>
      </section>

      {process && process.length > 0 ? (
        <section className="project-content-section">
          <div className="container">
            <div className="project-body">
              <ProcessSection
                steps={process as import('@/components/project/ProcessSection').ProcessStep[]}
              />
            </div>
          </div>
        </section>
      ) : null}

      <ProjectRelated projects={relatedProjects} currentSlug={slug} />
    </>
  )
}
