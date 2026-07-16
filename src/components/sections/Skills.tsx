'use client'

import Image from 'next/image'
import { useState } from 'react'

type Skill = {
  name: string
  description: string
  icon: string
}

const defaultSkills: Skill[] = [
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

export function Skills() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section className="section-homepage" id="skills">
      <div className="container" style={{ paddingTop: 60, paddingBottom: 80 }}>
        <div className="skills-grid">
          {/* ── Sticky sidebar ── */}
          <div className="skills-sticky">
            <div>
              <h2 className="display-3">Skills</h2>
              <p style={{ marginTop: 8, fontSize: 13, color: 'var(--secondary)', fontWeight: 600, letterSpacing: '0.02em' }}>
                <sup>Hover over each to see!</sup>
              </p>
            </div>
            {/* Icon preview */}
            <div
              className="skills-preview"
              style={{
                opacity: hovered !== null ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            >
              {hovered !== null && (
                <Image
                  src={defaultSkills[hovered].icon}
                  alt={defaultSkills[hovered].name}
                  width={120}
                  height={120}
                  style={{
                    maxWidth: '60%',
                    filter: 'invert(13%) sepia(21%) saturate(3474%) hue-rotate(277deg) brightness(91%) contrast(92%)',
                  }}
                />
              )}
            </div>
          </div>

          {/* ── Skill rows ── */}
          <div>
            {defaultSkills.map((skill, i) => (
              <div
                key={skill.name}
                className="skill-row-v2"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Large icon */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    src={skill.icon}
                    alt=""
                    width={72}
                    height={72}
                    className="skill-icon-large"
                    aria-hidden
                  />
                </div>
                {/* Title */}
                <div style={{ paddingTop: 4 }}>
                  <span className="skill-title-v2">{skill.name}</span>
                </div>
                {/* Description */}
                <div className="skill-desc-v2-col">
                  <p className="skill-desc-v2">{skill.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
