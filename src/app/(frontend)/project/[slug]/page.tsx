import { notFound } from 'next/navigation'

import { ProjectBody } from '@/components/project/ProjectBody'
import { ProjectGallery } from '@/components/project/ProjectGallery'
import { ProjectHero } from '@/components/project/ProjectHero'
import { ProjectRelated } from '@/components/project/ProjectRelated'
import { ProjectSummary } from '@/components/project/ProjectSummary'
import { getPayloadClient } from '@/lib/payload'

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}

/* ─── Static fallback data ─────────────────────────────── */
type StaticProject = {
  title: string
  accentColor: string
  summary: string
  coverImage?: string
}

const STATIC_PROJECTS: Record<string, StaticProject> = {
  'comfortabull':               { title: 'Comfortabull',                accentColor: '#141d37', summary: 'Brand identity and web design for a comfort food restaurant.' },
  'camp-brigitte':              { title: 'Camp Brigitte',               accentColor: '#e29d36', summary: 'Illustrated editorial identity for a summer camp brand.' },
  'vaughan-intl-film-festival': { title: 'Vaughan Intl. Film Festival', accentColor: '#c0392b', summary: 'Event branding and motion graphics package.' },
  'dynastic-wealth':            { title: 'Dynastic Wealth',             accentColor: '#1a1a2e', summary: 'Visual identity for a financial advisory firm.' },
  'shinee-love-sick':           { title: 'Shinee Love Sick',            accentColor: '#7b2d8b', summary: 'Fan-art editorial series and motion piece.' },
  'pearl-earring':              { title: 'Pearl Earring',               accentColor: '#2c3e50', summary: 'Illustration series inspired by Vermeer.' },
  'animated-business-cards':    { title: 'Animated Business Cards',     accentColor: '#16a085', summary: 'Motion-design micro-animations for business card concepts.' },
  'social-media-graphics-ads':  { title: 'Social Media Graphics & Ads',accentColor: '#e67e22', summary: 'Social content packages for various client campaigns.' },
}

/* ─── Static gallery fallback per project ──────────────── */
const STATIC_GALLERIES: Record<string, string[]> = {
  'comfortabull':               ['/images/project-comfortabull.png'],
  'camp-brigitte':              ['/images/project-camp-brigitte.webp'],
  'vaughan-intl-film-festival': ['/images/project-vaughan.jpg'],
  'dynastic-wealth':            ['/images/project-dynastic.png'],
  'animated-business-cards':    ['/images/project-animated-business-cards.webp'],
  'social-media-graphics-ads':  ['/images/project-social-media.webp'],
}

/* ─── Static all-projects list for "related" ────────────── */
const STATIC_ALL_PROJECTS: { slug: string; title: string; coverImage?: string; accentColor: string }[] = [
  { slug: 'comfortabull',               title: 'Comfortabull',                coverImage: '/images/project-comfortabull.png',                   accentColor: '#141d37' },
  { slug: 'camp-brigitte',              title: 'Camp Brigitte',               coverImage: '/images/project-camp-brigitte.webp',                 accentColor: '#e29d36' },
  { slug: 'vaughan-intl-film-festival', title: 'Vaughan Intl. Film Festival', coverImage: '/images/project-vaughan.jpg',                        accentColor: '#c0392b' },
  { slug: 'dynastic-wealth',            title: 'Dynastic Wealth',             coverImage: '/images/project-dynastic.png',                       accentColor: '#1a1a2e' },
  { slug: 'shinee-love-sick',           title: 'Shinee Love Sick',            accentColor: '#7b2d8b' },
  { slug: 'pearl-earring',              title: 'Pearl Earring',               accentColor: '#2c3e50' },
  { slug: 'animated-business-cards',    title: 'Animated Business Cards',     coverImage: '/images/project-animated-business-cards.webp',        accentColor: '#16a085' },
  { slug: 'social-media-graphics-ads',  title: 'Social Media Graphics & Ads', coverImage: '/images/project-social-media.webp',                   accentColor: '#e67e22' },
]

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
  const galleryRaw = Array.isArray(project.gallery) ? project.gallery : []
  const coverImageUrl = typeof project.coverImage === 'object' && project.coverImage && 'url' in project.coverImage
    ? String(project.coverImage.url)
    : (STATIC_PROJECTS[slug]?.coverImage ?? null)

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
      galleryImages.push({ src, alt: title })
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
      {/* ── Motion hero with accent sweep + letter reveal ── */}
      <ProjectHero
        title={title}
        accentColor={accentColor}
        coverImage={coverImageUrl}
      />

      {/* ── Content section ── */}
      <section className="project-content-section">
        <div className="container">
          <div className="project-body">
            {/* Summary with word-by-word reveal */}
            {summary ? <ProjectSummary summary={summary} /> : null}

            {/* Rich text body with scroll-triggered reveal */}
            {content ? (
              <ProjectBody content={content} />
            ) : null}
          </div>
        </div>
      </section>

      {/* ── Gallery with spring entrances + full-screen morph ── */}
      {galleryImages.length > 0 ? (
        <section className="project-gallery-section">
          <div className="container">
            <ProjectGallery images={galleryImages} accentColor={accentColor} />
          </div>
        </section>
      ) : null}

      {/* ── Related projects carousel ── */}
      <ProjectRelated projects={relatedProjects} currentSlug={slug} />
    </>
  )
}
