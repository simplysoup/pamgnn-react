type ProjectCategory = 'illustration' | 'web-design' | 'motion' | 'identity'

export const projectSeeds: Array<{
  title: string
  slug: string
  accentColor: string
  featured: boolean
  order: number
  summary: string
  category: ProjectCategory[]
}> = [
  {
    title: 'Comfortabull',
    slug: 'comfortabull',
    accentColor: '#141d37',
    featured: true,
    order: 1,
    summary: 'Brand identity and web design for a comfort food restaurant.',
    category: ['identity', 'web-design'],
  },
  {
    title: 'Camp Brigitte',
    slug: 'camp-brigitte',
    accentColor: '#e29d36',
    featured: true,
    order: 2,
    summary: 'Illustrated editorial identity for a summer camp brand.',
    category: ['illustration', 'identity'],
  },
  {
    title: 'Vaughan Intl. Film Festival',
    slug: 'vaughan-intl-film-festival',
    accentColor: '#c0392b',
    featured: true,
    order: 3,
    summary: 'Event branding and motion graphics package.',
    category: ['identity', 'motion'],
  },
  {
    title: 'Dynastic Wealth',
    slug: 'dynastic-wealth',
    accentColor: '#1a1a2e',
    featured: true,
    order: 4,
    summary: 'Visual identity for a financial advisory firm.',
    category: ['identity'],
  },
  {
    title: 'Shinee Love Sick',
    slug: 'shinee-love-sick',
    accentColor: '#7b2d8b',
    featured: false,
    order: 5,
    summary: 'Fan-art editorial series and motion piece.',
    category: ['illustration', 'motion'],
  },
  {
    title: 'Pearl Earring',
    slug: 'pearl-earring',
    accentColor: '#2c3e50',
    featured: false,
    order: 6,
    summary: 'Illustration series inspired by Vermeer.',
    category: ['illustration'],
  },
  {
    title: 'Animated Business Cards',
    slug: 'animated-business-cards',
    accentColor: '#16a085',
    featured: false,
    order: 7,
    summary: 'Motion-design micro-animations for business card concepts.',
    category: ['motion'],
  },
  {
    title: 'Social Media Graphics & Ads',
    slug: 'social-media-graphics-ads',
    accentColor: '#e67e22',
    featured: false,
    order: 8,
    summary: 'Social content packages for various client campaigns.',
    category: ['illustration', 'motion'],
  },
]

export const skillSeeds = [
  {
    name: 'Illustration',
    description: 'Digital and traditional illustration for editorial, branding, and storytelling.',
    order: 1,
  },
  {
    name: 'Web Design',
    description: 'Custom website design with attention to layout, type, and interaction.',
    order: 2,
  },
  {
    name: 'Motion Design',
    description: 'After Effects animations, title sequences, and micro-interactions.',
    order: 3,
  },
  {
    name: 'Identity & Branding',
    description: 'Logo systems, brand guidelines, and identity packages from brief to delivery.',
    order: 4,
  },
]

export const siteSettingsSeedDefaults = {
  siteName: 'Pam Graphic Design',
  contactEmail: 'hello@pamgraphicdesign.com',
  copyright: '© 2026 Pamela Desplenter',
  youtube: 'https://www.youtube.com/@pamgraphicdesign',
  linkedin: 'https://www.linkedin.com/in/pamgraphicdesign',
  vimeo: 'https://vimeo.com/pamgraphicdesign',
}

export const adminSeedDefaults = {
  email: 'admin@example.com',
  password: 'change-me-on-first-login',
}
