/* ─────────────────────────────────────────────────────────
 * Skills definitions — single source of truth for the 4
 * skill cards displayed on the homepage Skills section.
 * ───────────────────────────────────────────────────────── */

export type Skill = {
  name: string
  description: string
  icon: string
}

export const SKILLS: Skill[] = [
  {
    name: 'Motion Design & Animation',
    description:
      'From 2D to vector motion animation I have worked on various projects from education, advertising, UX/UI graphics, and logo animation.',
    icon: '/images/motion.svg',
  },
  {
    name: 'Web Design',
    description:
      'Responsive web design has been a mainstay in my work experience. I have revitalized old websites as well as worked with clients to build something new from scratch.',
    icon: '/images/web.svg',
  },
  {
    name: 'Identity & Branding',
    description:
      'Having a recognizable and scalable identity is important! I have worked on many logos from emblem, wordmarks, and abstract. As well as branding assets from social media, stationary, and shipping essentials, to conference banners, table wraps, and more.',
    icon: '/images/design.svg',
  },
  {
    name: 'Illustration',
    description:
      'Much of my illustration work has been a key supporting feature for my animation or branding work. I also receive commissions for various uses.',
    icon: '/images/illustration.svg',
  },
]
