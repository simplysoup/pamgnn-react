'use client'

import Image from 'next/image'
import { useState } from 'react'

import { SKILLS, type Skill } from '@/data/skills'

export function Skills() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section className="-mt-[120px] pt-[120px]" id="skills">
      <div
        className="relative mx-auto w-full max-w-[1290px] px-10 pb-[60px]"
        style={{ paddingTop: 60, paddingBottom: 80 }}
      >
        <div className="grid grid-cols-[220px_1fr] gap-[60px] items-start pt-[60px]">
          {/* ── Sticky sidebar ── */}
          <div className="sticky top-[120px] flex flex-col gap-6">
            <div>
              <h2 className="tracking-wide uppercase font-exo font-bold text-[clamp(28px,3.5vw,40px)] leading-tight">
                Skills
              </h2>
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
              className="w-full aspect-square rounded-[var(--rounded)] bg-ticker flex items-center justify-center transition-opacity duration-300"
              style={{
                opacity: hovered !== null ? 1 : 0,
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
                className="grid grid-cols-[100px_1fr_2fr] gap-6 border-b border-[rgba(18,24,26,0.1)] py-8 items-start cursor-default transition-[background-color] duration-200 last:border-b-0 hover:bg-[rgba(244,229,228,0.25)] hover:rounded-xl hover:px-3 max-[991px]:grid-cols-[60px_1fr] max-[767px]:grid-cols-[1fr] max-[767px]:gap-3"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Large icon */}
                <div className="flex items-center justify-center">
                  <Image
                    src={skill.icon}
                    alt=""
                    width={72}
                    height={72}
                    className="w-[72px] h-[72px] shrink-0 max-[991px]:w-[52px] max-[991px]:h-[52px] max-[767px]:w-[44px] max-[767px]:h-[44px]"
                    aria-hidden
                  />
                </div>
                {/* Title */}
                <div style={{ paddingTop: 4 }}>
                  <span className="text-lg font-bold font-exo tracking-wide text-dark leading-tight pt-1">
                    {skill.name}
                  </span>
                </div>
                {/* Description */}
                <div className="max-[991px]:hidden max-[767px]:block">
                  <p className="m-0 text-base leading-[26px] text-dark-70">{skill.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
