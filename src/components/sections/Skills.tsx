'use client'

import Image from 'next/image'
import { useState } from 'react'

import { SKILLS, type Skill } from '@/data/skills'

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
              <p
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: 'var(--secondary)',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                }}
              >
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
                  src={SKILLS[hovered].icon}
                  alt={SKILLS[hovered].name}
                  width={120}
                  height={120}
                  style={{
                    maxWidth: '60%',
                    filter:
                      'invert(13%) sepia(21%) saturate(3474%) hue-rotate(277deg) brightness(91%) contrast(92%)',
                  }}
                />
              )}
            </div>
          </div>

          {/* ── Skill rows ── */}
          <div>
            {SKILLS.map((skill, i) => (
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
