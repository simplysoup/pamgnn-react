import { getPayloadClient } from '@/lib/payload'
import Image from 'next/image'
import Link from 'next/link'

type ProjectDoc = {
  id: string | number
  slug?: string
  title?: string
  coverImage?: { url?: string } | null
  accentColor?: string
  category?: string
}

export default async function WebDesignPage() {
  const payload = await getPayloadClient()
  let docs: ProjectDoc[] = []
  try {
    const result = await payload.find({
      collection: 'projects' as never,
      limit: 20,
      sort: 'order',
    })
    docs = (result.docs ?? []) as ProjectDoc[]
  } catch {
    docs = []
  }

  return (
    <>
      <div className="page-sections">
        <div className="container">
          <h1 className="display-3" style={{ marginBottom: 60, textAlign: 'center' }}>Web Design</h1>
          <div className="projects-collection-list" role="list">
            {docs.map((project) => {
              const slug = typeof project.slug === 'string' ? project.slug : String(project.id)
              const coverUrl = project.coverImage?.url ?? null
              const color = project.accentColor ?? '#4b1f44'
              return (
                <div key={String(project.id)} className="project" role="listitem">
                  <Link href={`/project/${slug}`} className="image-link rounded" style={{ backgroundColor: color }}>
                    {coverUrl ? (
                      <Image src={coverUrl} alt={project.title ?? 'Project'} width={660} height={500} className="image" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} sizes="(max-width: 767px) 100vw, 660px" />
                    ) : (
                      <div style={{ width: '100%', aspectRatio: '4/3', backgroundColor: color }} />
                    )}
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
