import { notFound } from 'next/navigation'

import { ProjectBody } from '@/components/project/ProjectBody'
import { ProjectGallery } from '@/components/project/ProjectGallery'
import { ProjectHero } from '@/components/project/ProjectHero'
import { ProjectRelated } from '@/components/project/ProjectRelated'
import { ProjectSummary } from '@/components/project/ProjectSummary'
import { StaticBody } from '@/components/project/StaticBody'

import { StructuredBody } from '@/components/project/StructuredBody'
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
  contentHtml?: string
  sections?: import('@/types/content-sections').ContentSection[]
  client?: string
  tools?: string[]
  categories?: string[]
}

const STATIC_PROJECTS: Record<string, StaticProject> = {
  'comfortabull': {
    title: 'Comfortabull',
    accentColor: '#141d37',
    summary: 'Brand identity and full brand design for a bulldog-focused doggy daycare.',
    client: 'Comfortabull',
    categories: ['branding'],
    contentHtml: `<p>Comfortabull is a bulldog-focused doggy daycare; providing the care and attention bulldogs need. Comfortabull offers group stays, or private, to fit your pup perfectly. With this in mind, they wanted their new logo to feature both bulldog varieties, have a cozy but professional vibe, with an interest in hatchwork styling. The illustration style pulls formline style which gives a nod to the owners indigenous culture, ancestry, and residence.</p>`,
    sections: [
      {
        type: 'fullWidthImage',
        src: '/images/project-comfortabull/brand-presentation-cover.webp',
        alt: 'Comfortabull Brand Presentation',
        width: 1650,
        height: 1275,
      },
      {
        type: 'detailsGrid',
        sidebar: [
          { label: 'Client', value: 'Comfortabull' },
          { label: 'Category', tags: ['Branding'] },
          { label: 'Our Role', value: 'Creative Direction, Full Brand Design' },
          { label: 'Tools', toolSlugs: ['clip-studio', 'photoshop', 'illustrator'] },
        ],
        content: [
          {
            type: 'text',
            html: '<p>Comfortabull offers group stays, or private, to fit your pup perfectly. With this in mind, they wanted their new logo to feature both bulldog varieties, have a cozy but professional vibe, with an interest in hatchwork styling. The illustration style pulls formline style which gives a nod to the owners indigenous culture, ancestry, and residence.</p>',
          },
        ],
      },
      {
        type: 'fullWidthImage',
        src: '/images/project-comfortabull/second-sketch.webp',
        alt: 'Ideation sketch',
        width: 1921,
        height: 1081,
      },
      {
        type: 'detailsGrid',
        sidebar: [{ label: 'IDEATION', value: '' }],
        content: [
          {
            type: 'text',
            html: '<p>First on my list, I had to figure out how I wanted to approach the bulldogs. I spent some time looking at and drawing French and English bulldogs and their key features. As we wanted both dogs and a cozy vibe I leaned towards having them both in a doggy bed together.</p><p>But another idea was to have the dogs be able to separate; and use them as 2 individual elements which made the doggy bed idea harder to work with so I also looked at stacking the dogs, having them face each other, and standing side by side.</p><p>Luckily, the graphic came together nicely, with the circle and dogs inside and a cute paw heart touch! With the lineart and crosshatching set, there weren\'t too many additional adjustments past the palette.</p>',
          },
        ],
      },
      {
        type: 'fullWidthImage',
        src: '/images/project-comfortabull/third-sketch.webp',
        alt: 'Third design sketch',
        width: 1921,
        height: 1080,
      },
      {
        type: 'sideBySide',
        left: {
          src: '/images/project-comfortabull/third-pt1-process.webp',
          alt: 'Process step 1',
          width: 1081,
          height: 1081,
        },
        right: {
          src: '/images/project-comfortabull/third-pt2-process.webp',
          alt: 'Process step 2',
          width: 1001,
          height: 1001,
        },
      },
      {
        type: 'text',
        heading: 'NEXT UP: TYPEFACE',
        headingStyle: 'h2',
        html: '<p>I ran through options with a meld of sans serif and cursive font. With the client preferring a cursive expressive looping style to compliment the sans-serif. Then tested out the fonts with some key phrases they wanted to use for branding down the line; &ldquo;Life is Better with a Bulldog&rdquo;, &ldquo;Heavy Breathers Club&rdquo;, and &ldquo;Squish Face Crew&rdquo;. With the finalized font choice we went with the simplistic &ldquo;We Love Bulldogs&rdquo; stylizing love with the chosen Shaley typeface and Neutra Text combo.</p>',
      },
      {
        type: 'fullWidthImage',
        src: '/images/project-comfortabull/fourth-typeface.webp',
        alt: 'Typeface exploration',
        width: 1921,
        height: 1081,
      },
      {
        type: 'text',
        html: '<p>Along with the logo design I provided Comfortabull with full branding for socials; including a set of custom social icons, template socials and stories, and banners for Facebook and Instagram. The template socials and stories were both designed in Canva and made to accommodate the free version, to provide easy access and adjustment capabilities for the client.</p>',
      },
      {
        type: 'sideBySide',
        left: {
          src: '/images/project-comfortabull/fourth-pt2-social.webp',
          alt: 'Social branding 1',
          width: 1001,
          height: 1001,
        },
        right: {
          src: '/images/project-comfortabull/fourth-pt1-social.webp',
          alt: 'Social branding 2',
          width: 1081,
          height: 1081,
        },
      },
    ],
  },
  'camp-brigitte': {
    title: 'Camp Brigitte',
    accentColor: '#e29d36',
    summary: 'Illustrated editorial identity for a summer camp brand.',
    categories: ['illustration', 'identity'],
    contentHtml: `<p>Camp Brigitte is an indigenous-owned lodging and vacation located in upper west Ontario. A prime destination for overnight stays, gatherings/parties, hunting, bonfires, and winter activities. Looking for a logo they wanted to show their key focus on family and friends integrating with nature.</p><p>This is a project I did with the Bloom + Brilliance team, which you can see here.</p><p>A main focus with this client was wanting to include key elements of the camp and activities there in the logo; trees/forest, people, animals, and the cabin itself.</p><p>I first experimented with 3 different looks to the logo and placement/amount of elements. The first is more of a badge look and focuses on the deer and 1 person, the second is a much more full logo with a full scene including the cabin, and the third is a simplistic linear logo; with each element specifically shaped.</p><p>Choosing to move forward with the circular logo I worked on different variations, pulling the girl back from the previous designs adding another child. I also experimented with a seasonal variation showing winter activities.</p><p>Then moving forward with the help of Janelle Desrosiers we transitioned it into the final version. Simplifying the logo while bringing the text up much more. We pulled the deer and children forward, centering the bonfire in front of the cabin, and brightened the colours. Tying them with meaning and connection to their brand focus to make everything cohesive.</p>`,
  },
  'vaughan-intl-film-festival': {
    title: 'Vaughan Intl. Film Festival',
    accentColor: '#c0392b',
    summary: 'Event branding and motion graphics package.',
    client: 'Vaughan Int\'l Film Festival',
    categories: ['motion'],
    contentHtml: `<p>During my time working with VFF I worked with the team to redefine the 2024 style for the festival. Along with the Manager of Marketing and 2 other team members focused on graphic design we laid out the new style and created the full graphics for festival run. From countdowns, holiday posts, announcements of films, presenters, winners, to email blast graphics, and more.</p><p>With my motion graphic, animation and video experience I was also tasked to work along the video team to create two videos (with landscape and mobile versions). First up the VFF By the Numbers video which showcases the festival so far and how much it has grown. Secondly an informative video for submissions for the student film competition. Highschool students across Ontario are open to submit their short films to be screened in front of a live audience and evaluated by professionals in the film industry with the chance to win prizes for their team and school.</p>`,
  },
  'dynastic-wealth': {
    title: 'Dynastic Wealth',
    accentColor: '#1a1a2e',
    summary: 'Visual identity for a financial advisory firm.',
    client: 'Dr. Latanya White',
    categories: ['identity', 'web-design'],
    contentHtml: `<p>Financial wellness and building generational wealth through culturally relevant training.</p><p>With a focus on building and creating intergenerational wealth Dr. Latanya White wanted a refresh of her brand and a new website. The website would serve as her base point for displaying future talks and features, promoting her services, and giving support with more than just financial wealth.</p><p>To start, we began with the logo first; with Dr. Latanya wanted to use the logo for the parent company Concept Creative Group, LLC as a starting point to build from with the peacock iconography.</p><p>At first I very simply tried to use a peacock and the iconic feathers to integrate the wealth aspect. Then moved on to combining the peacock and gold with her focus on uplifting families and generational wealth through the couple and egg.</p><p><strong>Symbolism:</strong></p><p><strong>Couple:</strong> Depicts mentorship, community, and the tie with egg to show generational transfer of wealth</p><p><strong>Peacock:</strong> Shows success, ties to Concept Creative Group LLC, and vibrant wealth</p><p><strong>Egg:</strong> The nest egg, protected assets, new beginnings and the tie to the couple</p>`,
  },
  'shinee-love-sick': {
    title: 'Shinee Love Sick',
    accentColor: '#7b2d8b',
    summary: 'Fan-art editorial series and motion piece.',
    categories: ['illustration', 'motion'],
    tools: ['After Effects', 'Illustrator', 'Premiere Pro'],
    contentHtml: `<p>Music video for Korean group SHINee and the song 'Love Sick'. The song references their debut single 'Replay' and so I integrated small references to the song and its music video through the video. Style was inspired by the animation work done by Utomaru (Yuko Motoki) for ORESAMA music videos. All animation and illustration work was done by me within Adobe Illustrator and After Effects, and then finalized in Premiere Pro.</p>`,
  },
  'pearl-earring': {
    title: 'Pearl Earring',
    accentColor: '#2c3e50',
    summary: 'Illustration series inspired by Vermeer.',
    categories: ['illustration'],
    tools: ['Photoshop'],
    contentHtml: `<p>This came from the prompt to base a famous painting rendition from one artist by pulling inspiration from another artist's style. It was fun working with the limited bright palette and interesting shading style brought in by Loish's style to bring a new perspective on the famous Girl with the Pearl Earring by Johannes Vermeer.</p>`,
  },
  'animated-business-cards': {
    title: 'Animated Business Cards',
    accentColor: '#16a085',
    summary: 'Motion-design micro-animations for business card concepts.',
    categories: ['motion'],
    tools: ['Animate', 'Illustrator', 'After Effects'],
    contentHtml: `<p>Personal business cards I made to show all three of my specializations; illustration, animation, and graphic design. Scanning the QR code on each card brings up a different animation in relation to the graphic on it. Grab one from me and try it out yourself!</p>`,
  },
  'social-media-graphics-ads': {
    title: 'Social Media Graphics & Ads',
    accentColor: '#e67e22',
    summary: 'Social content packages for various client campaigns.',
    client: 'Various',
    categories: ['illustration', 'motion', 'web-design'],
    contentHtml: `<p>A collection of social media graphics and advertisements designed for various clients across different industries — including BOW, Centanni, 21 Stages, Premier Care, HSM, OsoHair, Alcan, and more.</p>`,
  },
}

/* ─── Static gallery fallback per project ──────────────── */
const STATIC_GALLERIES: Record<string, string[]> = {
  'comfortabull':               ['/images/project-comfortabull.png'],
  'camp-brigitte':              ['/images/project-camp-brigitte.webp'],
  'vaughan-intl-film-festival': ['/images/project-vaughan.jpg'],
  'dynastic-wealth':            ['/images/project-dynastic.png'],
  'shinee-love-sick':           ['/images/project-shinee-preview.gif'],
  'pearl-earring':              ['/images/project-pearl-earring-gallery.webp'],
  'animated-business-cards':    ['/images/project-animated-business-cards.webp'],
  'social-media-graphics-ads':  ['/images/project-social-media.webp'],
}

/* ─── Static all-projects list for "related" ────────────── */
const STATIC_ALL_PROJECTS: { slug: string; title: string; coverImage?: string; accentColor: string }[] = [
  { slug: 'comfortabull',               title: 'Comfortabull',                coverImage: '/images/project-comfortabull.png',                   accentColor: '#141d37' },
  { slug: 'camp-brigitte',              title: 'Camp Brigitte',               coverImage: '/images/project-camp-brigitte.webp',                 accentColor: '#e29d36' },
  { slug: 'vaughan-intl-film-festival', title: 'Vaughan Intl. Film Festival', coverImage: '/images/project-vaughan.jpg',                        accentColor: '#c0392b' },
  { slug: 'dynastic-wealth',            title: 'Dynastic Wealth',             coverImage: '/images/project-dynastic.png',                       accentColor: '#1a1a2e' },
  { slug: 'shinee-love-sick',           title: 'Shinee Love Sick',            coverImage: '/images/project-shinee-preview.gif',            accentColor: '#7b2d8b' },
  { slug: 'pearl-earring',              title: 'Pearl Earring',               coverImage: '/images/project-pearl-earring-gallery.webp',    accentColor: '#2c3e50' },
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
  const contentHtml = typeof project.contentHtml === 'string' ? project.contentHtml : (STATIC_PROJECTS[slug]?.contentHtml ?? null)
  const sections = Array.isArray(project.sections) ? project.sections as import('@/types/content-sections').ContentSection[] : (STATIC_PROJECTS[slug]?.sections ?? null)
  const client = typeof project.client === 'string' ? project.client : (STATIC_PROJECTS[slug]?.client ?? null)
  const tools = Array.isArray(project.tools) ? project.tools : (STATIC_PROJECTS[slug]?.tools ?? null)
  const categories = Array.isArray(project.categories) ? project.categories : (STATIC_PROJECTS[slug]?.categories ?? null)
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
      {/* ── Motion hero with accent sweep + letter reveal ── */}
      <ProjectHero
        title={title}
        accentColor={accentColor}
        coverImage={coverImageUrl}
      />

      {/* ── Project metadata (category, tools, client) ── */}
      {(categories && categories.length > 0) || tools || client ? (
        <section className="project-meta-section">
          <div className="container">
            <div className="project-meta-bar">
              {categories && categories.length > 0 ? (
                <div className="project-meta-group">
                  <span className="project-meta-label">Category</span>
                  <div className="project-meta-tags">
                    {categories.map((cat: string) => (
                      <span key={cat} className="project-meta-tag">{cat}</span>
                    ))}
                  </div>
                </div>
              ) : null}
              {tools && tools.length > 0 ? (
                <div className="project-meta-group">
                  <span className="project-meta-label">Tools</span>
                  <div className="project-meta-tags">
                    {tools.map((tool: string) => (
                      <span key={tool} className="project-meta-tag tool-tag">{tool}</span>
                    ))}
                  </div>
                </div>
              ) : null}
              {client ? (
                <div className="project-meta-group">
                  <span className="project-meta-label">Client</span>
                  <span className="project-meta-value">{client}</span>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Gallery with spring entrances + full-screen morph ── */}
      {galleryImages.length > 0 ? (
        <section className="project-gallery-section">
          <div className="container">
            <ProjectGallery images={galleryImages} accentColor={accentColor} />
          </div>
        </section>
      ) : null}

      {/* ── Content section ── */}
      <section className="project-content-section">
        <div className="container">
          <div className="project-body">
            {/* Summary with word-by-word reveal */}
            {summary ? <ProjectSummary summary={summary} /> : null}

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

      {/* ── Related projects carousel ── */}
      <ProjectRelated projects={relatedProjects} currentSlug={slug} />
    </>
  )
}
