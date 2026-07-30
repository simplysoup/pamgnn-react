import { notFound } from 'next/navigation'

import { ProjectBody } from '@/components/project/ProjectBody'
import { ProjectHero } from '@/components/project/ProjectHero'
import { ProjectRelated } from '@/components/project/ProjectRelated'
import { StaticBody } from '@/components/project/StaticBody'

import { StructuredBody } from '@/components/project/StructuredBody'
import { ProcessSection } from '@/components/project/ProcessSection'
import { getPayloadClient } from '@/lib/payload'

import {
  STATIC_PROJECTS,
  STATIC_GALLERIES,
  STATIC_ALL_PROJECTS,
} from '@/data/static-projects'

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}

// Allow any slug so CMS-created projects work without a rebuild
export const dynamicParams = true

export async function generateStaticParams() {
  return Object.keys(STATIC_PROJECTS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params

  // Try CMS first
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'projects' as never,
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (Array.isArray(docs) && docs.length > 0) {
      const firstProject = docs[0] as Record<string, unknown>
      const title = typeof firstProject.title === 'string' ? firstProject.title : 'Project'
      return { title: `${title} | Pamela Desplenter Portfolio` }
    }
  } catch {
    // fall through
  }

  // Fall back to static data
  const staticProject = STATIC_PROJECTS[slug]
  if (staticProject) {
    return { title: `${staticProject.title} | Pamela Desplenter Portfolio` }
  }

  return {}
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const payload = await getPayloadClient()

  let project: Record<string, unknown> | null = null
  let allProjects: Record<string, unknown>[] = []

  try {
    // Fetch current project
    const { docs } = await payload.find({
      collection: 'projects' as never,
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (Array.isArray(docs) && docs.length > 0) {
      project = docs[0] as Record<string, unknown>
    }

    // Fetch all projects for "related" section
    const allResult = await payload.find({
      collection: 'projects' as never,
      limit: 20,
      sort: 'order',
    })
    allProjects = (allResult.docs ?? []) as Record<string, unknown>[]
  } catch {
    project = null
    allProjects = []
  }

  // Fall back to static data for known slugs so pages render before seeding
  if (!project && STATIC_PROJECTS[slug]) {
    project = { ...STATIC_PROJECTS[slug], slug }
  }

  if (!project) {
    notFound()
  }

  const title = typeof project.title === 'string' ? project.title : slug.replace(/-/g, ' ')
  const accentColor = typeof project.accentColor === 'string' ? project.accentColor : '#4b1f44'
  const summary = typeof project.summary === 'string' ? project.summary : ''
  const content = typeof project.content === 'object' && project.content ? (project.content as object) : null
  const contentHtml = typeof project.contentHtml === 'string' ? project.contentHtml : (STATIC_PROJECTS[slug]?.contentHtml ?? null)
  const sections = Array.isArray(project.sections) ? project.sections as import('@/types/content-sections').ContentSection[] : (STATIC_PROJECTS[slug]?.sections ?? null)
  const client = typeof project.client === 'string' ? project.client : (STATIC_PROJECTS[slug]?.client ?? null)
  const tools = Array.isArray(project.tools) ? project.tools : (STATIC_PROJECTS[slug]?.tools ?? null)
  const categories = Array.isArray(project.categories) ? project.categories : (STATIC_PROJECTS[slug]?.categories ?? null)
  const galleryRaw = Array.isArray(project.gallery) ? project.gallery : []
  const process = Array.isArray(project.process) ? project.process : (STATIC_PROJECTS[slug]?.process ?? null)
  const coverImageUrl = null

  // Build gallery image list from CMS or static fallback
  const galleryImages: { src: string; alt: string }[] = []
  if (galleryRaw.length > 0) {
    galleryRaw.forEach((item: Record<string, unknown>) => {
      const src = typeof item.image === 'object' && item.image && 'url' in item.image
        ? String(item.image.url)
        : ''
      if (src) galleryImages.push({ src, alt: title })
    })
  }
  // Static fallback
  if (galleryImages.length === 0 && STATIC_GALLERIES[slug]) {
    STATIC_GALLERIES[slug].forEach((src) => {
      if (src) galleryImages.push({ src, alt: title })
    })
  }

  // Build related projects list
  const relatedProjects = allProjects.length > 0
    ? allProjects.map((p) => ({
        slug: typeof p.slug === 'string' ? p.slug : String(p.id),
        title: typeof p.title === 'string' ? p.title : '',
        coverImage: typeof p.coverImage === 'object' && p.coverImage && 'url' in p.coverImage
          ? String(p.coverImage.url)
          : null,
        accentColor: typeof p.accentColor === 'string' ? p.accentColor : undefined,
      }))
    : STATIC_ALL_PROJECTS

  return (
    <>
      {/* ── Hero with letter reveal + summary ── */}
      <ProjectHero
        title={title}
        summary={summary}
        categories={categories ?? undefined}
      />


      {/* ── Content section ── */}
      <section className="project-content-section">
        <div className="container">
          <div className="project-body">
            {/* Summary shown in hero — no duplicate here */}

            {/* Rich text body from CMS */}
            {content ? (
              <ProjectBody content={content} />
            ) : null}

            {/* Structured sections from content model */}
            {sections && sections.length > 0 ? (
              <StructuredBody sections={sections} />
            ) : null}

            {/* Static HTML body from Webflow content (fallback) */}
            {!sections && contentHtml && !content ? (
              <StaticBody contentHtml={contentHtml} />
            ) : null}
          </div>
        </div>
      </section>

      {/* ── Process section (storyboard → style frames → final) ── */}
      {process && process.length > 0 ? (
        <section className="project-content-section">
          <div className="container">
            <div className="project-body">
              <ProcessSection steps={process as import('@/components/project/ProcessSection').ProcessStep[]} />
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Related projects carousel ── */}
      <ProjectRelated projects={relatedProjects} currentSlug={slug} />
    </>
  )
}
