'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

type ProjectCardProps = {
  href: string
  title: string
  accentColor?: string
  coverUrl?: string
}

export function ProjectCard({ href, title, accentColor = '#4b1f44', coverUrl }: ProjectCardProps) {
  return (
    <Link href={href}>
      <motion.div
        className="group relative aspect-video overflow-hidden rounded-card"
        style={{ backgroundColor: accentColor }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {coverUrl ? (
          <Image src={coverUrl} alt={title} fill className="object-cover transition-opacity duration-300 group-hover:opacity-80" />
        ) : null}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 p-5">
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
      </motion.div>
    </Link>
  )
}
