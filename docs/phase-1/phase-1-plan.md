# pamgnn — React + Payload CMS Migration Plan

**Stack:** Next.js 15 (App Router) · Payload CMS 3 · Tailwind CSS 4 · Framer Motion · SQLite (dev) → PostgreSQL (VPS)  
**Deployment target:** local `localhost:3000` first, then self-managed VPS.

---

## Site inventory (from live audit)

### Pages / routes
| Route | Type | Notes |
|---|---|---|
| `/` | Static | Hero, Works, Skills, About, Contact sections |
| `/work/web-design` | Static | Gallery of web design projects |
| `/work/reel` | Static | Video reel + embedded YouTube |
| `/project/[slug]` | Dynamic CMS | 8 projects (see below) |
| `/about` | Static | Standalone about page |
| `/contact` | Static | Standalone contact page |
| `/404` | Static | Custom 404 |

### Project slugs (CMS-driven)
`comfortabull` · `camp-brigitte` · `vaughan-intl-film-festival` · `dynastic-wealth` · `shinee-love-sick` · `pearl-earring` · `animated-business-cards` · `social-media-graphics-ads`

### Design tokens (extracted from live CSS)
```
Colors
  --dark:       #12181a   (primary text / dark bg)
  --secondary:  #4b1f44   (purple accent)
  --ticker:     #f4e5e4   (blush pink ticker bg)
  --dark-2:     #293033
  --backdrop:   #171d1ffa (modal overlay)
  --button-hover: #dbdcdd

Typography
  Urbanist        → primary sans-serif
  Playfair Display → serif accent (display headings)
  Exo             → secondary sans (labels)

Spacing scale
  xs: 80px · s: 110px · m: 140px · l: 200px

Border radius
  --rounded: 10px · --pill-rounded: 50px

Letter spacing: 0.03em
```

### Key interactions to rebuild
1. **Infinite ticker** — `Illustration / Web Design / Motion Design / Identity & Branding` loop
2. **Hover-video skill cards** — each skill category shows an `.mp4`/`.webm` on hover
3. **Project grid** — 8 items with hover overlay
4. **Contact modal** — slide-in popup with form
5. **Button flip-text** — "Contact ME" flips to "Contact Me" on hover
6. **Sticky navbar** with smooth scroll and mobile burger
7. **Per-project accent color** — each project page overrides brand color

---

## Stage 0 — Environment bootstrap

### 0.1 Install prerequisites

```bash
# Verify versions
node -v   # need >=20
pnpm -v   # need >=9 (install: npm i -g pnpm)

# If not installed
curl -fsSL https://fnm.vercel.app/install | bash
fnm install 22
fnm use 22
npm install -g pnpm
```

### 0.2 Scaffold the Next.js + Payload project

```bash
cd /home/soup/Documents/pamgnn

pnpm create payload-app@latest . \
  --template blank \
  --db sqlite \
  --no-git

# Prompts:
#  Project name → pamgnn
#  Use TypeScript → yes
#  Use Tailwind → yes
```

> Payload 3 installs inside Next.js. The `/app/(payload)/` route group handles the admin UI at `http://localhost:3000/admin`.

### ✅ Stage 0 validation loop

```bash
pnpm dev
# Expected: server starts on :3000, no errors in terminal
# Open http://localhost:3000/admin → Payload login screen appears
# Open http://localhost:3000 → Next.js default page
```

---

## Stage 1 — Repo structure

### 1.1 Create directory tree

```
src/
  app/
    (frontend)/          ← public-facing pages
      page.tsx           ← homepage
      work/
        web-design/page.tsx
        reel/page.tsx
      project/
        [slug]/page.tsx
      about/page.tsx
      contact/page.tsx
      not-found.tsx
    (payload)/           ← Payload admin (auto-generated, leave alone)
    layout.tsx           ← root layout (fonts, global styles)
    globals.css
  components/
    layout/
      Navbar.tsx
      Footer.tsx
    sections/
      Hero.tsx
      Ticker.tsx
      Works.tsx
      Skills.tsx
      About.tsx
      ContactSection.tsx
    ui/
      Button.tsx
      Modal.tsx
      ProjectCard.tsx
      SkillCard.tsx
  payload/
    collections/
      Projects.ts
      Media.ts
      Skills.ts
    globals/
      SiteSettings.ts
    payload.config.ts     ← already exists after scaffold
  lib/
    payload.ts            ← server-side getPayload helper
    fonts.ts
  types/
    index.ts
```

```bash
mkdir -p src/components/{layout,sections,ui} \
         src/payload/{collections,globals} \
         src/lib \
         src/types \
         src/app/\(frontend\)/{work/{web-design,reel},project/\[slug\],about,contact}
```

### ✅ Stage 1 validation loop

```bash
# Tree should show all directories created
find src -type d | sort
# pnpm dev still starts cleanly
pnpm dev
```

---

## Stage 2 — Design system

### 2.1 Tailwind config

Edit `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dark:    '#12181a',
        dark2:   '#293033',
        secondary: '#4b1f44',
        ticker:  '#f4e5e4',
        backdrop:'#171d1f',
        bhover:  '#dbdcdd',
      },
      fontFamily: {
        sans:   ['Urbanist', 'sans-serif'],
        serif:  ['"Playfair Display"', 'serif'],
        exo:    ['Exo', 'sans-serif'],
      },
      letterSpacing: {
        wide: '0.03em',
      },
      borderRadius: {
        card: '10px',
        pill: '50px',
      },
      spacing: {
        xs: '80px',
        s:  '110px',
        m:  '140px',
        l:  '200px',
      },
    },
  },
}
export default config
```

### 2.2 Root layout — font loading

`src/lib/fonts.ts`:
```ts
import { Urbanist, Playfair_Display, Exo } from 'next/font/google'

export const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const exo = Exo({
  subsets: ['latin'],
  variable: '--font-exo',
  display: 'swap',
})
```

`src/app/layout.tsx` — add font variables to `<html>`:
```tsx
import { urbanist, playfair, exo } from '@/lib/fonts'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${urbanist.variable} ${playfair.variable} ${exo.variable}`}>
      <body className="bg-dark text-white font-sans">{children}</body>
    </html>
  )
}
```

`src/app/globals.css`:
```css
@import "tailwindcss";

:root {
  --font-sans: var(--font-sans);
  --font-serif: var(--font-serif);
  --font-exo: var(--font-exo);
}

* { box-sizing: border-box; }

html { scroll-behavior: smooth; }
```

### ✅ Stage 2 validation loop

```bash
pnpm dev
# Open http://localhost:3000
# DevTools → Computed tab on body → font-family should be Urbanist
# No Tailwind config errors in terminal
# pnpm build → should complete with no TS errors
pnpm build
```

---

## Stage 3 — Payload CMS collections

### 3.1 Media collection

`src/payload/collections/Media.ts`:
```ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'public/media',
    imageSizes: [
      { name: 'thumb', width: 400, height: 300, crop: 'center' },
      { name: 'card',  width: 800, height: 600, crop: 'center' },
      { name: 'full',  width: 1600 },
    ],
    adminThumbnail: 'thumb',
  },
  fields: [{ name: 'alt', type: 'text', required: true }],
}
```

### 3.2 Skills collection

`src/payload/collections/Skills.ts`:
```ts
import type { CollectionConfig } from 'payload'

export const Skills: CollectionConfig = {
  slug: 'skills',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name',        type: 'text',     required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'icon',        type: 'upload',   relationTo: 'media' },
    { name: 'hoverVideo',  type: 'upload',   relationTo: 'media',
      admin: { description: 'mp4 file — will be served as HTML5 video on hover' } },
    { name: 'order',       type: 'number' },
  ],
}
```

### 3.3 Projects collection

`src/payload/collections/Projects.ts`:
```ts
import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title',        type: 'text',     required: true },
    { name: 'slug',         type: 'text',     required: true, unique: true,
      admin: { description: 'URL-safe slug e.g. comfortabull' } },
    { name: 'accentColor',  type: 'text',     required: true,
      admin: { description: 'Hex color for project header, e.g. #141d37' } },
    { name: 'category',     type: 'select',   hasMany: true,
      options: ['illustration','web-design','motion','identity'] },
    { name: 'coverImage',   type: 'upload',   relationTo: 'media' },
    { name: 'summary',      type: 'textarea' },
    { name: 'content',      type: 'richText' },
    { name: 'gallery',      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media' }] },
    { name: 'featured',     type: 'checkbox', defaultValue: false },
    { name: 'order',        type: 'number' },
  ],
}
```

### 3.4 Site Settings global

`src/payload/globals/SiteSettings.ts`:
```ts
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  fields: [
    { name: 'bio',             type: 'richText' },
    { name: 'resumeAvailable', type: 'checkbox', defaultValue: true },
    { name: 'youtube',         type: 'text' },
    { name: 'linkedin',        type: 'text' },
    { name: 'vimeo',           type: 'text' },
    { name: 'email',           type: 'email' },
    { name: 'copyright',       type: 'text' },
  ],
}
```

### 3.5 Register in payload.config.ts

```ts
// src/payload/payload.config.ts  (replace the collections/globals arrays)
import { Media }        from './collections/Media'
import { Skills }       from './collections/Skills'
import { Projects }     from './collections/Projects'
import { SiteSettings } from './globals/SiteSettings'

// inside buildConfig({...}):
collections: [Media, Skills, Projects],
globals:     [SiteSettings],
```

### 3.6 Server-side query helper

`src/lib/payload.ts`:
```ts
import { getPayload } from 'payload'
import config from '@/payload/payload.config'
import { cache } from 'react'

export const getPayloadClient = cache(async () => {
  return getPayload({ config })
})
```

### ✅ Stage 3 validation loop

```bash
pnpm dev
# Open http://localhost:3000/admin
# Create an admin user when prompted
# Verify sidebar shows: Projects, Skills, Media, Site Settings
# Create one test Project entry with all fields
# Save — no validation errors
```

---

## Stage 4 — Static layout components

### 4.1 Navbar (`src/components/layout/Navbar.tsx`)

Key behaviors:
- Fixed top, transparent background becomes dark on scroll
- Links: HOME · Works (#works) · WEB DESIGN (/work/web-design) · REEL (/work/reel) · About (#about) · Contact (#contact)
- Mobile: burger menu → full-screen overlay
- Uses `useScrollPosition` hook to switch background

```tsx
'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { label: 'HOME',       href: '/' },
  { label: 'Works',      href: '/#works' },
  { label: 'WEB DESIGN', href: '/work/web-design' },
  { label: 'REEL',       href: '/work/reel' },
  { label: 'About',      href: '/#about' },
  { label: 'Contact',    href: '/#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300
        ${scrolled ? 'bg-dark/90 backdrop-blur-sm' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold tracking-wide text-white text-sm">pamgnn</Link>
        <nav className="hidden md:flex gap-8">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className="text-xs tracking-widest text-white/80 hover:text-white transition-colors uppercase">
              {l.label}
            </Link>
          ))}
        </nav>
        <button className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
          {[0,1,2].map(i => (
            <span key={i} className="block w-6 h-px bg-white transition-transform" />
          ))}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 bg-dark z-40 flex flex-col items-center justify-center gap-8">
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="text-2xl tracking-widest text-white uppercase">{l.label}</Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
```

### 4.2 Footer (`src/components/layout/Footer.tsx`)

```tsx
// Server component — reads SiteSettings from Payload
import { getPayloadClient } from '@/lib/payload'
import Link from 'next/link'

export default async function Footer() {
  const payload  = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  return (
    <footer className="bg-dark border-t border-white/10 py-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/50 text-sm">{settings.copyright ?? '© 2026 Pamela Desplenter'}</p>
        <ul className="flex gap-5">
          {settings.youtube  && <li><Link href={settings.youtube}  target="_blank" className="text-white/50 hover:text-white text-sm">YouTube</Link></li>}
          {settings.linkedin && <li><Link href={settings.linkedin} target="_blank" className="text-white/50 hover:text-white text-sm">LinkedIn</Link></li>}
          {settings.vimeo    && <li><Link href={settings.vimeo}    target="_blank" className="text-white/50 hover:text-white text-sm">Vimeo</Link></li>}
          {settings.email    && <li><Link href={`mailto:${settings.email}`} className="text-white/50 hover:text-white text-sm">Email</Link></li>}
        </ul>
      </div>
    </footer>
  )
}
```

### ✅ Stage 4 validation loop

```bash
pnpm dev
# http://localhost:3000 → Navbar renders, links exist in DOM
# Resize to mobile width → burger appears, desktop nav hidden
# DevTools Network → no 404s on icon/font requests
# Scroll down → navbar background transitions
# pnpm build && pnpm start → same results in production mode
```

---

## Stage 5 — Animated sections

Install animation library first:

```bash
pnpm add framer-motion
```

### 5.1 Hero section (`src/components/sections/Hero.tsx`)

```tsx
'use client'
import { motion } from 'framer-motion'

const lines = ['multidisciplinary', 'Designer who likes', 'to make Cool Things']

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-16 bg-dark">
      <div className="container mx-auto px-6">
        {lines.map((line, i) => (
          <motion.h1 key={i}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            transition={{ delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`text-white leading-none tracking-tight
              ${i === 0 ? 'font-serif italic text-5xl md:text-8xl' : 'font-sans font-bold text-5xl md:text-7xl'}`}
          >
            {line}
          </motion.h1>
        ))}
      </div>
    </section>
  )
}
```

### 5.2 Ticker (`src/components/sections/Ticker.tsx`)

```tsx
'use client'
import { motion } from 'framer-motion'

const items = ['Illustration', 'Web Design', 'Motion Design', 'Identity & Branding']
const repeated = [...items, ...items, ...items]  // 3× for seamless loop

export default function Ticker() {
  return (
    <div className="overflow-hidden bg-ticker py-4 border-y border-dark/10">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-33.333%'] }}
        transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="text-dark font-exo uppercase tracking-widest text-sm font-semibold">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
```

### 5.3 Skill cards with hover video (`src/components/ui/SkillCard.tsx`)

```tsx
'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'

interface SkillCardProps {
  name: string
  description: string
  iconUrl?: string
  videoUrl?: string
}

export default function SkillCard({ name, description, iconUrl, videoUrl }: SkillCardProps) {
  const [hovered, setHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleEnter = () => {
    setHovered(true)
    videoRef.current?.play()
  }
  const handleLeave = () => {
    setHovered(false)
    videoRef.current?.pause()
    if (videoRef.current) videoRef.current.currentTime = 0
  }

  return (
    <div
      className="relative overflow-hidden rounded-card border border-white/10 p-6 cursor-default transition-colors hover:border-white/30"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${hovered ? 'opacity-20' : 'opacity-0'}`}
        />
      )}
      <div className="relative z-10">
        {iconUrl && <Image src={iconUrl} alt={name} width={60} height={60} className="mb-4" />}
        <h3 className="text-white font-semibold text-lg mb-2">{name}</h3>
        <p className="text-white/60 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
```

### 5.4 Skills section (`src/components/sections/Skills.tsx`)

```tsx
import { getPayloadClient } from '@/lib/payload'
import SkillCard from '@/components/ui/SkillCard'

export default async function Skills() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'skills',
    sort: 'order',
    limit: 10,
  })

  return (
    <section id="works" className="py-s bg-dark">
      <div className="container mx-auto px-6">
        <h2 className="text-white text-3xl font-bold mb-2">Skills</h2>
        <p className="text-white/40 text-sm mb-12 uppercase tracking-widest">Hover over each to see!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {docs.map(skill => (
            <SkillCard
              key={skill.id}
              name={skill.name}
              description={skill.description}
              iconUrl={typeof skill.icon === 'object' ? skill.icon?.url : undefined}
              videoUrl={typeof skill.hoverVideo === 'object' ? skill.hoverVideo?.url : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
```

### 5.5 Works / project grid (`src/components/sections/Works.tsx`)

```tsx
import { getPayloadClient } from '@/lib/payload'
import ProjectCard from '@/components/ui/ProjectCard'

export default async function Works() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    sort: 'order',
    where: { featured: { equals: true } },
    limit: 8,
  })

  return (
    <section id="works" className="py-s bg-dark">
      <div className="container mx-auto px-6">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {docs.map(project => (
            <li key={project.id}>
              <ProjectCard
                title={project.title}
                slug={project.slug}
                accentColor={project.accentColor}
                coverUrl={typeof project.coverImage === 'object' ? project.coverImage?.url : undefined}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
```

### 5.6 About section (`src/components/sections/About.tsx`)

```tsx
import { getPayloadClient } from '@/lib/payload'
import Image from 'next/image'

export default async function About() {
  const payload  = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  return (
    <section id="about" className="py-m bg-dark">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="font-serif text-5xl text-white mb-8 italic">Heyo!</h2>
          {/* Rich text rendered from Payload — add @payloadcms/richtext-lexical renderer */}
          <div className="text-white/70 leading-relaxed">
            {/* RichText component goes here once renderer is set up (Stage 6) */}
          </div>
        </div>
        <div>
          {/* Profile image pulled from Media collection */}
        </div>
      </div>
    </section>
  )
}
```

### ✅ Stage 5 validation loop

```bash
pnpm dev
# Seed 4 Skills in Payload admin (name, description, icon, hoverVideo)
# Seed 2 featured Projects in Payload admin
# http://localhost:3000 → Ticker animates, no jitter
# Hover a SkillCard → video plays, unpauses
# DevTools Console → zero hydration warnings
# DevTools Performance tab → Ticker animation runs at 60fps (no main-thread block)
pnpm build  # zero TS errors, zero ESLint errors
```

---

## Stage 6 — Dynamic project pages

### 6.1 `ProjectCard` component (`src/components/ui/ProjectCard.tsx`)

```tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface ProjectCardProps {
  title: string
  slug: string
  accentColor: string
  coverUrl?: string
}

export default function ProjectCard({ title, slug, accentColor, coverUrl }: ProjectCardProps) {
  return (
    <Link href={`/project/${slug}`}>
      <motion.div
        className="relative overflow-hidden rounded-card aspect-video group"
        style={{ backgroundColor: accentColor }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {coverUrl && (
          <Image
            src={coverUrl} alt={title} fill
            className="object-cover transition-opacity duration-300 group-hover:opacity-80"
          />
        )}
        <div className="absolute inset-0 flex items-end p-5 bg-gradient-to-t from-black/60">
          <h3 className="text-white font-bold text-xl">{title}</h3>
        </div>
      </motion.div>
    </Link>
  )
}
```

### 6.2 Project page route (`src/app/(frontend)/project/[slug]/page.tsx`)

```tsx
import { getPayloadClient } from '@/lib/payload'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'projects', limit: 100 })
  return docs.map(p => ({ slug: p.slug }))
}

export default async function ProjectPage({ params }: Props) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: params.slug } },
    limit: 1,
  })

  if (!docs.length) notFound()
  const project = docs[0]

  return (
    <>
      <Navbar />
      <main>
        <header
          className="min-h-[50vh] flex items-end pb-16 pt-32 px-6"
          style={{ backgroundColor: project.accentColor }}
        >
          <div className="container mx-auto">
            <h1 className="text-5xl md:text-8xl font-bold text-white">{project.title}</h1>
          </div>
        </header>

        <section className="py-m bg-dark">
          <div className="container mx-auto px-6">
            {/* Rich text content — renderer set up below */}
            {project.summary && (
              <p className="text-white/70 text-lg leading-relaxed max-w-2xl mb-12">
                {project.summary}
              </p>
            )}

            {/* Gallery */}
            {project.gallery?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.gallery.map((item, i) => (
                  typeof item.image === 'object' && item.image?.url ? (
                    <div key={i} className="rounded-card overflow-hidden aspect-video relative">
                      <Image src={item.image.url} alt={item.image.alt ?? ''} fill className="object-cover" />
                    </div>
                  ) : null
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export async function generateMetadata({ params }: Props) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: params.slug } },
    limit: 1,
  })
  if (!docs.length) return {}
  return { title: `${docs[0].title} | Pamela Desplenter Portfolio` }
}
```

### 6.3 Install rich text renderer

```bash
pnpm add @payloadcms/richtext-lexical
```

Create `src/components/ui/RichText.tsx`:
```tsx
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'

export default function RichText({ content }: { content: SerializedEditorState }) {
  return <PayloadRichText data={content} className="prose prose-invert max-w-none" />
}
```

### ✅ Stage 6 validation loop

```bash
pnpm dev
# Seed all 8 projects in Payload admin with: title, slug, accentColor, coverImage, summary
# http://localhost:3000/project/comfortabull → renders with #141d37 header bg
# http://localhost:3000/project/camp-brigitte → renders with #e29d36 header bg
# All 8 slugs load without 404
# pnpm build → generateStaticParams pre-renders all 8 slugs at build time

pnpm build 2>&1 | grep "project/"
# Should see: ● /project/[slug] with all 8 slugs listed
```

---

## Stage 7 — Contact form (server action)

### 7.1 Contact modal component (`src/components/ui/Modal.tsx`)

```tsx
'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import ContactForm from './ContactForm'

export default function ContactModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Trigger — flip-text button */}
      <button
        onClick={() => setOpen(true)}
        className="group relative overflow-hidden h-10 px-6 rounded-pill border border-white/30 hover:border-white"
      >
        <span className="flex flex-col transition-transform duration-300 group-hover:-translate-y-full">
          <span className="block text-sm tracking-widest uppercase">Contact ME</span>
          <span className="block text-sm tracking-widest uppercase">Contact Me</span>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-backdrop/95" onClick={() => setOpen(false)} />
            <motion.div
              className="relative z-10 bg-dark2 rounded-card p-8 w-full max-w-lg"
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white"
                aria-label="Close"
              >✕</button>
              <h2 className="font-serif text-3xl text-white mb-2 italic">Get In Touch!</h2>
              <p className="text-white/50 text-sm mb-6">Reach out to work on something together, request a commission, or just chat!</p>
              <ContactForm onSuccess={() => setOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

### 7.2 Contact form with server action (`src/components/ui/ContactForm.tsx`)

```tsx
'use client'
import { useActionState } from 'react'
import { sendContact } from '@/app/actions/contact'

export default function ContactForm({ onSuccess }: { onSuccess: () => void }) {
  const [state, action, pending] = useActionState(sendContact, null)

  if (state?.success) {
    onSuccess()
    return null
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <input name="name"    type="text"  placeholder="Name*"    required className="input" />
      <input name="email"   type="email" placeholder="Email*"   required className="input" />
      <input name="subject" type="text"  placeholder="Subject*" required className="input" />
      <textarea name="message" placeholder="Message*" required rows={4} className="input resize-none" />
      {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}
      <button type="submit" disabled={pending}
        className="bg-white text-dark font-semibold py-2 px-6 rounded-pill hover:bg-bhover transition-colors disabled:opacity-50">
        {pending ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
```

### 7.3 Server action (`src/app/actions/contact.ts`)

```ts
'use server'
import nodemailer from 'nodemailer'
import { z } from 'zod'

const schema = z.object({
  name:    z.string().min(1).max(100),
  email:   z.string().email().max(200),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
})

export async function sendContact(_prev: unknown, formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData))

  if (!parsed.success) {
    return { success: false, error: 'Please fill in all fields correctly.' }
  }

  const { name, email, subject, message } = parsed.data

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from:    `"${name}" <${process.env.SMTP_USER}>`,
    to:      process.env.CONTACT_TO_EMAIL,
    replyTo: email,
    subject: `[pamgnn contact] ${subject}`,
    text:    `From: ${name} <${email}>\n\n${message}`,
  })

  return { success: true }
}
```

```bash
pnpm add nodemailer zod
pnpm add -D @types/nodemailer
```

`.env.local` (local dev — use a free SMTP service like Brevo or Mailhog):
```
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=test
SMTP_PASS=test
CONTACT_TO_EMAIL=pamdesp@gmail.com
```

For local testing without a real SMTP service, use [Mailhog](https://github.com/mailhog/MailHog):
```bash
# Install Mailhog (one-time)
go install github.com/mailhog/MailHog@latest
# Or via Docker: docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog
# Web UI at http://localhost:8025
```

### ✅ Stage 7 validation loop

```bash
# Start Mailhog in background
mailhog &

pnpm dev
# http://localhost:3000 → click "Contact ME"
# Modal opens with form
# Submit form with valid data → http://localhost:8025 → email received
# Submit with blank name → inline error appears, no submission
# Press Esc or click backdrop → modal closes
# pnpm build → server action compiles cleanly
```

---

## Stage 8 — Remaining pages

### 8.1 `/work/web-design` (`src/app/(frontend)/work/web-design/page.tsx`)

```tsx
import { getPayloadClient } from '@/lib/payload'
import ProjectCard from '@/components/ui/ProjectCard'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default async function WebDesignPage() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    where: { category: { contains: 'web-design' } },
    sort: 'order',
  })

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-m px-6 bg-dark min-h-screen">
        <div className="container mx-auto">
          <h1 className="text-white font-bold text-6xl mb-16">Web Design</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {docs.map(p => (
              <ProjectCard key={p.id} title={p.title} slug={p.slug}
                accentColor={p.accentColor}
                coverUrl={typeof p.coverImage === 'object' ? p.coverImage?.url : undefined} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
```

### 8.2 `/work/reel`

```tsx
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function ReelPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-m px-6 bg-dark min-h-screen">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-white font-bold text-6xl mb-12">Reel</h1>
          <div className="aspect-video rounded-card overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/CP9440IiSHw"
              title="Pamela Desplenter — Reel"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
```

### 8.3 Custom 404 (`src/app/not-found.tsx`)

```tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-dark flex flex-col items-center justify-center gap-6">
      <h1 className="text-white font-bold text-8xl">404</h1>
      <p className="text-white/50">Page not found.</p>
      <Link href="/" className="text-white border border-white/30 px-6 py-2 rounded-pill hover:bg-white hover:text-dark transition-colors">
        Go home
      </Link>
    </main>
  )
}
```

### ✅ Stage 8 validation loop

```bash
pnpm dev
# /work/web-design → shows web-design tagged projects
# /work/reel → YouTube embed loads (will be blocked by X-Frame in some browsers — expected)
# /nonexistent-route → custom 404 renders
# pnpm build → no errors; all static pages listed in build output
```

---

## Stage 9 — Homepage assembly

`src/app/(frontend)/page.tsx`:
```tsx
import Navbar from '@/components/layout/Navbar'
import Hero   from '@/components/sections/Hero'
import Ticker from '@/components/sections/Ticker'
import Works  from '@/components/sections/Works'
import Skills from '@/components/sections/Skills'
import About  from '@/components/sections/About'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <Works />
        <Skills />
        <About />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
```

`src/components/sections/ContactSection.tsx` — wraps the CTA headline + modal trigger:
```tsx
import ContactModal from '@/components/ui/Modal'

export default function ContactSection() {
  return (
    <section id="contact" className="py-l bg-dark">
      <div className="container mx-auto px-6">
        <div className="overflow-hidden mb-2">
          <h1 className="text-white text-5xl md:text-8xl font-bold leading-none">
            Want to work <span className="font-serif italic">together?</span>
          </h1>
        </div>
        <div className="overflow-hidden mb-12">
          <h1 className="text-white text-5xl md:text-8xl font-serif italic leading-none">
            Let&apos;s get started.
          </h1>
        </div>
        <ContactModal />
      </div>
    </section>
  )
}
```

### ✅ Stage 9 validation loop

```bash
pnpm dev
# Full homepage renders: Hero → Ticker → Works → Skills → About → Contact → Footer
# Scroll-linked sections have correct IDs (#works, #about, #contact)
# Navbar links scroll correctly to each section
# Lighthouse: Performance > 80, Accessibility > 90

pnpm build && pnpm start
# Production build runs on :3000
# No hydration errors in browser console
```

---

## Stage 10 — Content migration (seeding)

### 10.1 Create seed script (`src/payload/seed.ts`)

```ts
import { getPayloadClient } from '../lib/payload'

async function seed() {
  const payload = await getPayloadClient()

  // Seed Site Settings
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      copyright: '© 2026 Pamela Desplenter',
      youtube:   'https://www.youtube.com/@pamguinn',
      linkedin:  'https://www.linkedin.com/in/pmgnn/',
      vimeo:     'https://vimeo.com/pamgnn',
      email:     'pamdesp@gmail.com',
    },
  })

  // Seed Skills
  const skillData = [
    { name: 'Motion Design & Animation', description: 'From 2D to vector motion animation I have worked on various projects from education, advertising, UX/UI graphics, and logo animation.', order: 1 },
    { name: 'Web Design',                description: 'Responsive web design has been a mainstay in my work experience. I have revitalized old websites as well as worked with clients to build something new from scratch.', order: 2 },
    { name: 'Identity & Branding',       description: 'Having a recognizable and scalable identity is important! I have worked on many logos from emblem, wordmarks, and abstract.', order: 3 },
    { name: 'Illustration',              description: 'Much of my illustration work has been a key supporting feature for my animation or branding work. I also receive commissions for various uses.', order: 4 },
  ]
  for (const s of skillData) {
    await payload.create({ collection: 'skills', data: s })
  }

  // Seed Projects
  const projectData = [
    { title: 'Comfortabull',                   slug: 'comfortabull',                  accentColor: '#141d37', featured: true, order: 1 },
    { title: 'Camp Brigitte',                  slug: 'camp-brigitte',                 accentColor: '#e29d36', featured: true, order: 2 },
    { title: 'Vaughan Int\'l Film Festival',   slug: 'vaughan-intl-film-festival',    accentColor: '#fecb00', featured: true, order: 3 },
    { title: 'Dynastic Wealth',                slug: 'dynastic-wealth',               accentColor: '#25442f', featured: true, order: 4 },
    { title: 'SHINee Love Sick',               slug: 'shinee-love-sick',              accentColor: '#1a1a2e', featured: true, order: 5 },
    { title: 'Pearl Earring',                  slug: 'pearl-earring',                 accentColor: '#eddb80', featured: true, order: 6 },
    { title: 'Animated Business Card',         slug: 'animated-business-cards',       accentColor: '#431740', featured: true, order: 7 },
    { title: 'Social Media Graphics/Ads',      slug: 'social-media-graphics-ads',     accentColor: '#1e1e1e', featured: true, order: 8 },
  ]
  for (const p of projectData) {
    await payload.create({ collection: 'projects', data: p })
  }

  console.log('Seed complete.')
  process.exit(0)
}

seed().catch(e => { console.error(e); process.exit(1) })
```

```bash
# package.json — add script:
# "seed": "tsx src/payload/seed.ts"

pnpm add -D tsx
pnpm seed
```

### ✅ Stage 10 validation loop

```bash
pnpm seed
# Output: "Seed complete."

# Open http://localhost:3000/admin/collections/projects
# → 8 projects listed

# Open http://localhost:3000
# → Works grid shows 8 project cards
# → Skills section shows 4 cards

# Open each /project/[slug]
# → Each page loads with correct accent color
```

---

## Stage 11 — Local production hardening

### 11.1 Environment variables

`.env` (committed — non-secret defaults):
```
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
DATABASE_URI=file:./pamgnn.db
PAYLOAD_SECRET=change-this-in-production
```

`.env.local` (gitignored — overrides):
```
PAYLOAD_SECRET=<random 64-char string>
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=test
SMTP_PASS=test
CONTACT_TO_EMAIL=pamdesp@gmail.com
```

### 11.2 Generate secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# paste output into .env.local PAYLOAD_SECRET
```

### 11.3 Validate production build locally

```bash
pnpm build
pnpm start
# → http://localhost:3000 serves production build
# → http://localhost:3000/admin functional
# Run Lighthouse on http://localhost:3000
```

### ✅ Stage 11 validation loop

```bash
pnpm build 2>&1 | tail -20
# Must show: "Route (app)" table with all pages listed
# No "Error:" lines

pnpm start &
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
# Expected: 200

curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/project/comfortabull
# Expected: 200

curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/admin
# Expected: 200 or 307 (redirect to login)
```

---

## Stage 12 — VPS prep (when ready)

### 12.1 Switch database to PostgreSQL

```bash
pnpm add @payloadcms/db-postgres pg
pnpm remove @payloadcms/db-sqlite better-sqlite3
```

In `payload.config.ts`:
```ts
import { postgresAdapter } from '@payloadcms/db-postgres'

db: postgresAdapter({
  pool: { connectionString: process.env.DATABASE_URI },
}),
```

`.env.production`:
```
DATABASE_URI=postgresql://pamgnn_user:password@localhost:5432/pamgnn
```

### 12.2 Process manager (PM2)

```bash
# On VPS:
npm i -g pm2

pm2 start "pnpm start" --name pamgnn
pm2 save
pm2 startup
```

### 12.3 Reverse proxy (nginx)

`/etc/nginx/sites-available/pamgnn`:
```nginx
server {
  listen 80;
  server_name yourdomain.com www.yourdomain.com;

  location / {
    proxy_pass         http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header   Upgrade $http_upgrade;
    proxy_set_header   Connection 'upgrade';
    proxy_set_header   Host $host;
    proxy_set_header   X-Real-IP $remote_addr;
    proxy_cache_bypass $http_upgrade;
  }

  location /media {
    alias /var/www/pamgnn/public/media;
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

```bash
# Enable and get SSL
sudo ln -s /etc/nginx/sites-available/pamgnn /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### ✅ Stage 12 validation loop

```bash
# On VPS after deploy:
curl -I https://yourdomain.com
# Expected: HTTP/2 200, x-powered-by: Next.js

curl -I https://yourdomain.com/admin
# Expected: 307 or 200

# Check PM2
pm2 list
# pamgnn should show status: online

# DB connectivity
psql $DATABASE_URI -c "SELECT count(*) FROM projects;"
# Should return 8
```

---

## Summary checklist

| Stage | Description | Done |
|---|---|---|
| 0 | Bootstrap: Node, pnpm, Payload + Next.js scaffold | ☐ |
| 1 | Directory structure | ☐ |
| 2 | Design tokens: Tailwind config, fonts | ☐ |
| 3 | Payload CMS: collections + globals | ☐ |
| 4 | Static layout: Navbar, Footer | ☐ |
| 5 | Animated sections: Hero, Ticker, SkillCard, hover video | ☐ |
| 6 | Dynamic project pages + rich text renderer | ☐ |
| 7 | Contact form + server action + Mailhog test | ☐ |
| 8 | Remaining pages: /work/web-design, /work/reel, 404 | ☐ |
| 9 | Homepage final assembly | ☐ |
| 10 | Content seed script (all 8 projects, 4 skills, settings) | ☐ |
| 11 | Local production build + env hardening | ☐ |
| 12 | VPS: PostgreSQL, PM2, nginx, SSL | ☐ |
