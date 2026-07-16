import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RichText } from '@/components/ui/RichText'
import { getPayloadClient } from '@/lib/payload'

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return [
    { slug: 'comfortabull' },
    { slug: 'camp-brigitte' },
    { slug: 'vaughan-intl-film-festival' },
    { slug: 'dynastic-wealth' },
    { slug: 'shinee-love-sick' },
    { slug: 'pearl-earring' },
    { slug: 'animated-business-cards' },
    { slug: 'social-media-graphics-ads' },
  ]
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params
  const payload = await getPayloadClient()

  try {
    const { docs } = await payload.find({
      collection: 'projects' as never,
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (!Array.isArray(docs) || !docs.length) {
      return {}
    }

    const firstProject = docs[0] as Record<string, unknown>
    const title = typeof firstProject.title === 'string' ? firstProject.title : 'Project'
    return { title: `${title} | Pamela Desplenter Portfolio` }
  } catch {
    return {}
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const payload = await getPayloadClient()

  let project: Record<string, unknown> | null = null

  try {
    const { docs } = await payload.find({
      collection: 'projects' as never,
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (Array.isArray(docs) && docs.length > 0) {
      project = docs[0] as Record<string, unknown>
    }
  } catch {
    project = null
  }

  if (!project) {
    notFound()
  }

  const title = typeof project.title === 'string' ? project.title : slug.replace(/-/g, ' ')
  const accentColor = typeof project.accentColor === 'string' ? project.accentColor : '#4b1f44'
  const summary = typeof project.summary === 'string' ? project.summary : ''
  const content = typeof project.content === 'object' && project.content ? (project.content as object) : null
  const gallery = Array.isArray(project.gallery) ? project.gallery : []
  const coverImage = typeof project.coverImage === 'object' && project.coverImage && 'url' in project.coverImage ? String(project.coverImage.url) : undefined

  return (
    <>
      {/* Hero header with accent colour */}
      <header
        style={{
          backgroundColor: accentColor,
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'flex-end',
          paddingTop: '160px',
          paddingBottom: '60px',
        }}
      >
        <div className="container">
          <Link
            href="/work/web-design"
            style={{
              display: 'inline-block',
              marginBottom: '24px',
              fontSize: '14px',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            ← Back to work
          </Link>
          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              lineHeight: 1.1,
              color: '#fff',
              margin: 0,
            }}
          >
            {title}
          </h1>
        </div>
      </header>

      <section className="section-2">
        <div className="container">
          <div className="project-body">
            {coverImage ? (
              <div
                style={{
                  borderRadius: 'var(--rounded)',
                  overflow: 'hidden',
                  marginBottom: '50px',
                }}
              >
                <Image
                  src={coverImage}
                  alt={title}
                  width={1200}
                  height={700}
                  style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                />
              </div>
            ) : null}

            {summary ? (
              <p
                style={{
                  fontSize: '20px',
                  lineHeight: '32px',
                  color: 'var(--dark-70)',
                  maxWidth: '720px',
                  marginBottom: '40px',
                }}
              >
                {summary}
              </p>
            ) : null}

            {content ? (
              <div style={{ maxWidth: '720px' }}>
                <RichText content={content as never} />
              </div>
            ) : null}

            {gallery.length > 0 ? (
              <div className="projects-collection-list">
                {gallery.map((item: Record<string, unknown>, index: number) => {
                  const image =
                    typeof item.image === 'object' && item.image && 'url' in item.image
                      ? String(item.image.url)
                      : ''
                  if (!image) return null
                  return (
                    <div key={`${image}-${index}`} className="project">
                      <div className="image-link rounded">
                        <Image
                          src={image}
                          alt={title}
                          width={660}
                          height={500}
                          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
