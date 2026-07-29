/* ─────────────────────────────────────────────────────────
 * Static fallback data for project pages
 *
 * Single source of truth for project detail content.
 * Populated with rich structured sections (ContentSection[])
 * that mirror the Payload CMS data shape.
 *
 * To add a new project: add an entry to STATIC_PROJECTS,
 * then optionally add to STATIC_GALLERIES and STATIC_ALL_PROJECTS.
 * ───────────────────────────────────────────────────────── */

import type { ContentSection } from '@/types/content-sections'

type StaticProject = {
  title: string
  accentColor: string
  summary: string
  coverImage?: string
  contentHtml?: string
  sections?: ContentSection[]
  client?: string
  tools?: string[]
  categories?: string[]
}

export const STATIC_PROJECTS: Record<string, StaticProject> = {
  /* ─── Comfortabull ─────────────────────────────────── */
  'comfortabull': {
    title: 'Comfortabull',
    accentColor: '#141d37',
    summary: 'Comfortabull is a bulldog-focused doggy daycare; providing the care and attention bulldogs need.',
    client: 'Comfortabull',
    categories: ['branding'],
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

  /* ─── Camp Brigitte ────────────────────────────────── */
  'camp-brigitte': {
    title: 'Camp Brigitte',
    accentColor: '#e29d36',
    summary: 'Camp Brigitte is an indigenous-owned lodging and vacation destination located in upper west Ontario. A place for family, friends, and nature.',
    client: 'Camp Brigitte (via Bloom + Brilliance)',
    categories: ['illustration', 'identity'],
    sections: [
      {
        type: 'fullWidthImage',
        src: '/images/project-camp-brigitte/brand-presentation.webp',
        alt: 'Camp Brigitte Brand Presentation',
        width: 1200,
        height: 928,
      },
      {
        type: 'detailsGrid',
        sidebar: [
          { label: 'Client', value: 'Camp Brigitte' },
          { label: 'Category', tags: ['Illustration', 'Identity'] },
          { label: 'Our Role', value: 'Logo Design, Brand Identity' },
          { label: 'Tools', toolSlugs: ['illustrator', 'photoshop'] },
        ],
        content: [
          {
            type: 'text',
            html: '<p>Camp Brigitte is an indigenous-owned lodging and vacation located in upper west Ontario. A prime destination for overnight stays, gatherings/parties, hunting, bonfires, and winter activities. Looking for a logo they wanted to show their key focus on family and friends integrating with nature.</p><p>This is a project I did with the Bloom + Brilliance team.</p>',
          },
        ],
      },
      {
        type: 'text',
        heading: 'CONCEPT EXPLORATION',
        headingStyle: 'h2',
        html: '<p>A main focus with this client was wanting to include key elements of the camp and activities there in the logo; trees/forest, people, animals, and the cabin itself.</p><p>I first experimented with 3 different looks to the logo and placement/amount of elements. The first is more of a badge look and focuses on the deer and 1 person, the second is a much more full logo with a full scene including the cabin, and the third is a simplistic linear logo; with each element specifically shaped.</p><p>Choosing to move forward with the circular logo I worked on different variations, pulling the girl back from the previous designs adding another child. I also experimented with a seasonal variation showing winter activities.</p>',
      },
      {
        type: 'text',
        heading: 'FINAL REFINEMENT',
        headingStyle: 'h2',
        html: '<p>Then moving forward with the help of Janelle Desrosiers we transitioned it into the final version. Simplifying the logo while bringing the text up much more. We pulled the deer and children forward, centering the bonfire in front of the cabin, and brightened the colours. Tying them with meaning and connection to their brand focus to make everything cohesive.</p>',
      },
    ],
  },

  /* ─── Vaughan Intl. Film Festival ──────────────────── */
  'vaughan-intl-film-festival': {
    title: 'Vaughan Intl. Film Festival',
    accentColor: '#c0392b',
    summary: 'Event branding and motion graphics package for the Vaughan International Film Festival &ndash; from countdowns to contest videos.',
    client: 'Vaughan Int\'l Film Festival',
    categories: ['motion', 'identity'],
    sections: [
      {
        type: 'fullWidthImage',
        src: '/images/project-vaughan.jpg',
        alt: 'Vaughan Intl. Film Festival branding',
        width: 1921,
        height: 1080,
      },
      {
        type: 'detailsGrid',
        sidebar: [
          { label: 'Client', value: 'Vaughan Int\'l Film Festival' },
          { label: 'Category', tags: ['Motion', 'Identity'] },
          { label: 'Our Role', value: 'Graphic Design, Motion Graphics, Video Production' },
          { label: 'Tools', toolSlugs: ['illustrator', 'photoshop', 'after-effects', 'premiere'] },
        ],
        content: [
          {
            type: 'text',
            html: '<p>During my time working with VFF I worked with the team to redefine the 2024 style for the festival. Along with the Manager of Marketing and 2 other team members focused on graphic design we laid out the new style and created the full graphics for festival run. From countdowns, holiday posts, announcements of films, presenters, winners, to email blast graphics, and more.</p>',
          },
        ],
      },
      {
        type: 'text',
        heading: 'VIDEO &amp; MOTION',
        headingStyle: 'h2',
        html: '<p>With my motion graphic, animation and video experience I was also tasked to work along the video team to create two videos (with landscape and mobile versions).</p><p>First up the VFF By the Numbers video which showcases the festival so far and how much it has grown.</p><p>Secondly an informative video for submissions for the student film competition. Highschool students across Ontario are open to submit their short films to be screened in front of a live audience and evaluated by professionals in the film industry with the chance to win prizes for their team and school.</p>',
      },
    ],
  },

  /* ─── Dynastic Wealth ──────────────────────────────── */
  'dynastic-wealth': {
    title: 'Dynastic Wealth',
    accentColor: '#1a1a2e',
    summary: 'Visual identity and web design for Dr. Latanya White&rsquo;s financial advisory firm &ndash; building generational wealth through culturally relevant training.',
    client: 'Dr. Latanya White',
    categories: ['identity', 'web-design'],
    sections: [
      {
        type: 'fullWidthImage',
        src: '/images/project-dynastic.png',
        alt: 'Dynastic Wealth brand identity',
        width: 1921,
        height: 1080,
      },
      {
        type: 'detailsGrid',
        sidebar: [
          { label: 'Client', value: 'Dr. Latanya White' },
          { label: 'Category', tags: ['Identity', 'Web Design'] },
          { label: 'Our Role', value: 'Brand Identity, Logo Design, Web Design' },
          { label: 'Tools', toolSlugs: ['illustrator', 'photoshop'] },
        ],
        content: [
          {
            type: 'text',
            html: '<p>Financial wellness and building generational wealth through culturally relevant training.</p><p>With a focus on building and creating intergenerational wealth Dr. Latanya White wanted a refresh of her brand and a new website. The website would serve as her base point for displaying future talks and features, promoting her services, and giving support with more than just financial wealth.</p>',
          },
        ],
      },
      {
        type: 'text',
        heading: 'LOGO DEVELOPMENT',
        headingStyle: 'h2',
        html: '<p>To start, we began with the logo first; Dr. Latanya wanted to use the logo for the parent company Concept Creative Group, LLC as a starting point to build from with the peacock iconography.</p><p>At first I very simply tried to use a peacock and the iconic feathers to integrate the wealth aspect. Then moved on to combining the peacock and gold with her focus on uplifting families and generational wealth through the couple and egg.</p>',
      },
      {
        type: 'text',
        heading: 'SYMBOLISM',
        headingStyle: 'sidebar',
        html: '<p><strong>Couple:</strong> Depicts mentorship, community, and the tie with egg to show generational transfer of wealth</p><p><strong>Peacock:</strong> Shows success, ties to Concept Creative Group LLC, and vibrant wealth</p><p><strong>Egg:</strong> The nest egg, protected assets, new beginnings and the tie to the couple</p>',
      },
    ],
  },

  /* ─── Shinee Love Sick ─────────────────────────────── */
  'shinee-love-sick': {
    title: 'Shinee Love Sick',
    accentColor: '#7b2d8b',
    summary: 'Fan-art music video and editorial series for SHINee&rsquo;s &ldquo;Love Sick&rdquo; &ndash; inspired by Utomaru&rsquo;s animation style.',
    categories: ['illustration', 'motion'],
    tools: ['After Effects', 'Illustrator', 'Premiere Pro'],
    sections: [
      {
        type: 'fullWidthImage',
        src: '/images/project-shinee-preview.gif',
        alt: 'Shinee Love Sick animated preview',
        width: 500,
        height: 282,
      },
      {
        type: 'detailsGrid',
        sidebar: [
          { label: 'Category', tags: ['Illustration', 'Motion'] },
          { label: 'Tools', toolSlugs: ['illustrator', 'photoshop', 'after-effects', 'premiere'] },
        ],
        content: [
          {
            type: 'text',
            html: '<p>Music video for Korean group SHINee and the song &lsquo;Love Sick&rsquo;. The song references their debut single &lsquo;Replay&rsquo; and so I integrated small references to the song and its music video through the video. Style was inspired by the animation work done by Utomaru (Yuko Motoki) for ORESAMA music videos. All animation and illustration work was done by me within Adobe Illustrator and After Effects, and then finalized in Premiere Pro.</p>',
          },
        ],
      },
    ],
  },

  /* ─── Pearl Earring ────────────────────────────────── */
  'pearl-earring': {
    title: 'Pearl Earring',
    accentColor: '#2c3e50',
    summary: 'Illustration series reimagining Vermeer&rsquo;s &ldquo;Girl with a Pearl Earring&rdquo; through Loish&rsquo;s vibrant style.',
    categories: ['illustration'],
    tools: ['Photoshop'],
    sections: [
      {
        type: 'fullWidthImage',
        src: '/images/project-pearl-earring-gallery.webp',
        alt: 'Pearl Earring illustration series',
        width: 1080,
        height: 1080,
      },
      {
        type: 'detailsGrid',
        sidebar: [
          { label: 'Category', tags: ['Illustration'] },
          { label: 'Tools', toolSlugs: ['photoshop'] },
        ],
        content: [
          {
            type: 'text',
            html: '<p>This came from the prompt to base a famous painting rendition from one artist by pulling inspiration from another artist&rsquo;s style. It was fun working with the limited bright palette and interesting shading style brought in by Loish&rsquo;s style to bring a new perspective on the famous Girl with the Pearl Earring by Johannes Vermeer.</p>',
          },
        ],
      },
      {
        type: 'fullWidthImage',
        src: '/images/project-pearl-earring.jpg',
        alt: 'Pearl Earring full render',
        width: 1080,
        height: 1350,
      },
    ],
  },

  /* ─── Animated Business Cards ──────────────────────── */
  'animated-business-cards': {
    title: 'Animated Business Cards',
    accentColor: '#16a085',
    summary: 'Motion-design micro-animations for business card concepts &ndash; scan the QR code to see each card come to life.',
    categories: ['motion'],
    tools: ['Animate', 'Illustrator', 'After Effects'],
    sections: [
      {
        type: 'fullWidthImage',
        src: '/images/project-animated-business-cards/mockup.webp',
        alt: 'Animated Business Cards mockup',
        width: 1000,
        height: 667,
      },
      {
        type: 'detailsGrid',
        sidebar: [
          { label: 'Category', tags: ['Motion'] },
          { label: 'Tools', toolSlugs: ['animate', 'illustrator', 'after-effects'] },
        ],
        content: [
          {
            type: 'text',
            html: '<p>Personal business cards I made to show all three of my specializations; illustration, animation, and graphic design. Scanning the QR code on each card brings up a different animation in relation to the graphic on it. Grab one from me and try it out yourself!</p>',
          },
        ],
      },
    ],
  },

  /* ─── Social Media Graphics & Ads ──────────────────── */
  'social-media-graphics-ads': {
    title: 'Social Media Graphics & Ads',
    accentColor: '#e67e22',
    summary: 'Social content packages for various client campaigns across industries &ndash; including BOW, Centanni, 21 Stages, Premier Care, and more.',
    client: 'Various',
    categories: ['illustration', 'motion', 'web-design'],
    sections: [
      {
        type: 'fullWidthImage',
        src: '/images/project-social-media/social-collection.webp',
        alt: 'Social media graphics collection',
        width: 1000,
        height: 1000,
      },
      {
        type: 'detailsGrid',
        sidebar: [
          { label: 'Client', value: 'Various' },
          { label: 'Category', tags: ['Illustration', 'Motion', 'Web Design'] },
          { label: 'Our Role', value: 'Graphic Design, Social Media Assets, Ad Creative' },
        ],
        content: [
          {
            type: 'text',
            html: '<p>A collection of social media graphics and advertisements designed for various clients across different industries — including BOW, Centanni, 21 Stages, Premier Care, HSM, OsoHair, Alcan, and more.</p>',
          },
        ],
      },
    ],
  },
}

/* ─── Static gallery fallback per project ──────────────── */
export const STATIC_GALLERIES: Record<string, string[]> = {
  'comfortabull':               ['/images/project-comfortabull.png'],
  'camp-brigitte':              ['/images/project-camp-brigitte.webp'],
  'vaughan-intl-film-festival': ['/images/project-vaughan.jpg'],
  'dynastic-wealth':            ['/images/project-dynastic.png'],
  'shinee-love-sick':           ['/images/project-shinee-preview.gif'],
  'pearl-earring':              ['/images/project-pearl-earring-gallery.webp'],
  'animated-business-cards':    ['/images/project-animated-business-cards.webp'],
  'social-media-graphics-ads':  ['/images/project-social-media.webp'],
}

/* ─── Static all-projects list for "related" section ───── */
export const STATIC_ALL_PROJECTS: { slug: string; title: string; coverImage?: string; accentColor: string }[] = [
  { slug: 'comfortabull',               title: 'Comfortabull',                coverImage: '/images/project-comfortabull.png',                   accentColor: '#141d37' },
  { slug: 'camp-brigitte',              title: 'Camp Brigitte',               coverImage: '/images/project-camp-brigitte.webp',                 accentColor: '#e29d36' },
  { slug: 'vaughan-intl-film-festival', title: 'Vaughan Intl. Film Festival', coverImage: '/images/project-vaughan.jpg',                        accentColor: '#c0392b' },
  { slug: 'dynastic-wealth',            title: 'Dynastic Wealth',             coverImage: '/images/project-dynastic.png',                       accentColor: '#1a1a2e' },
  { slug: 'shinee-love-sick',           title: 'Shinee Love Sick',            coverImage: '/images/project-shinee-preview.gif',                 accentColor: '#7b2d8b' },
  { slug: 'pearl-earring',              title: 'Pearl Earring',               coverImage: '/images/project-pearl-earring-gallery.webp',         accentColor: '#2c3e50' },
  { slug: 'animated-business-cards',    title: 'Animated Business Cards',    coverImage: '/images/project-animated-business-cards.webp',        accentColor: '#16a085' },
  { slug: 'social-media-graphics-ads',  title: 'Social Media Graphics & Ads', coverImage: '/images/project-social-media.webp',                  accentColor: '#e67e22' },
]

/**
 * Get the full list of projects for the "related" section.
 */
export function getStaticRelatedProjects(currentSlug: string) {
  return STATIC_ALL_PROJECTS.filter((p) => p.slug !== currentSlug).slice(0, 4)
}

/**
 * Get a static project by slug, with optional field overrides.
 */
export function getStaticProject(slug: string) {
  return STATIC_PROJECTS[slug] ?? null
}
