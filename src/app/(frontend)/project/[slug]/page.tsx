import { notFound } from 'next/navigation'

import { ProjectHero } from '@/components/project/ProjectHero'
import { ProjectRelated } from '@/components/project/ProjectRelated'
import { StaticBody } from '@/components/project/StaticBody'

import { StructuredBody } from '@/components/project/StructuredBody'
import { ProcessSection } from '@/components/project/ProcessSection'

import { STATIC_PROJECTS, STATIC_GALLERIES, STATIC_ALL_PROJECTS } from '@/data/static-projects'

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return Object.keys(STATIC_PROJECTS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params

  const staticProject = STATIC_PROJECTS[slug]
  if (staticProject) {
    return { title: `${staticProject.title} | Pamela Desplenter Portfolio` }
  }

  return {}
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params

  const project = STATIC_PROJECTS[slug]

  if (!project) {
    notFound()
  }

  const title = project.title
  const accentColor = project.accentColor ?? '#4b1f44'
  const summary = project.summary ?? ''
  const contentHtml = project.contentHtml ?? null
  const sections = project.sections ?? null
  const client = project.client ?? null
  const tools = project.tools ?? null
  const categories = project.categories ?? null
  const process = project.process ?? null

  // Build gallery image list from static galleries
  const galleryImages: { src: string; alt: string }[] = []
  if (STATIC_GALLERIES[slug]) {
    STATIC_GALLERIES[slug].forEach((src) => {
      if (src) galleryImages.push({ src, alt: title })
    })
  }

  // Build related projects list
  const relatedProjects = STATIC_ALL_PROJECTS

  return (
    <>
      {/* ── Hero with letter reveal + summary ── */}
      <ProjectHero title={title} summary={summary} categories={categories ?? undefined} />

      {/* ── Content section ── */}
      <section className="project-content-section">
        <div className="container">
          <div className="project-body">
            {/* Structured sections from content model */}
            {sections && sections.length > 0 ? <StructuredBody sections={sections} /> : null}

            {/* Static HTML body from Webflow content (fallback) */}
            {!sections && contentHtml ? <StaticBody contentHtml={contentHtml} /> : null}
          </div>
        </div>
      </section>

      {/* ── Process section (storyboard → style frames → final) ── */}
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

      {/* ── Related projects carousel ── */}
      <ProjectRelated projects={relatedProjects} currentSlug={slug} />
    </>
  )
}
