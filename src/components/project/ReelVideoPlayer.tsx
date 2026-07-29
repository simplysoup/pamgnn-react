'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

type ReelVideoPlayerProps = {
  vimeoId: string
  title?: string
  description?: string
}

const posterUrl = (id: string) => `https://vumbnail.com/${id}.jpg`

export function ReelVideoPlayer({ vimeoId, title = 'Reel', description }: ReelVideoPlayerProps) {
  const [isMuted, setIsMuted] = useState(true)
  const [showOverlay, setShowOverlay] = useState(true)
  const [playerReady, setPlayerReady] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Detect when the Vimeo player has initialised via postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://player.vimeo.com') return
      try {
        const data = JSON.parse(event.data)
        if (data.event === 'ready') {
          setPlayerReady(true)
        }
      } catch {
        // not a Vimeo message event
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const handleUnmute = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ method: 'setVolume', value: 1 }),
        'https://player.vimeo.com',
      )
    }
    setIsMuted(false)
    setShowOverlay(false)
  }

  return (
    <section className="reel-hero">
      {/* ── Poster frame — visible while Vimeo player loads ── */}
      <AnimatePresence>
        {!playerReady && (
          <motion.div
            key="poster"
            className="reel-hero-media"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <Image
              src={posterUrl(vimeoId)}
              alt=""
              fill
              className="reel-hero-poster-img"
              priority
              sizes="100vw"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Vimeo iframe — fades in once the player is ready ── */}
      <motion.div
        className="reel-hero-media"
        initial={{ opacity: 0 }}
        animate={{ opacity: playerReady ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <iframe
          ref={iframeRef}
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&byline=0&portrait=0&title=0&dnt=1`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="reel-hero-iframe"
          title={title}
        />
      </motion.div>

      {/* ── Dark gradient overlay for text readability ── */}
      <div className="reel-hero-overlay" />

      {/* ── Centered hero content ── */}
      <div className="reel-hero-content">
        <h1 className="reel-hero-title">{title}</h1>
        {description && <p className="reel-hero-description">{description}</p>}
      </div>

      {/* ── Unmute button ── */}
      {showOverlay && (
        <div className="reel-hero-unmute">
          <button className="reel-unmute-btn" onClick={handleUnmute} aria-label="Unmute video">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
            <span>Click to Unmute</span>
          </button>
        </div>
      )}

      {/* ── Muted badge ── */}
      {isMuted && (
        <div className="reel-hero-muted" aria-live="polite">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
          Muted
        </div>
      )}
    </section>
  )
}
