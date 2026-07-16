'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'

type SkillCardProps = {
  title: string
  description?: string
  iconUrl?: string
  videoUrl?: string
}

export function SkillCard({ title, description, iconUrl, videoUrl }: SkillCardProps) {
  const [hovered, setHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleEnter = () => {
    setHovered(true)
    videoRef.current?.play().catch(() => undefined)
  }

  const handleLeave = () => {
    setHovered(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <div
      className="relative cursor-default overflow-hidden rounded-card border border-white/10 p-6 transition-colors hover:border-white/30"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          loop
          playsInline
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${hovered ? 'opacity-20' : 'opacity-0'}`}
        />
      ) : null}

      <div className="relative z-10">
        {iconUrl ? <Image src={iconUrl} alt={title} width={60} height={60} className="mb-4" /> : null}
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
        {description ? <p className="text-sm leading-relaxed text-white/60">{description}</p> : null}
      </div>
    </div>
  )
}
