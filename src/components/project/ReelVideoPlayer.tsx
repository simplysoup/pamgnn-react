'use client'

const styles = {
  section: {
    padding: '140px 24px 80px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '48px',
  },
  title: {
    fontFamily: 'Exo, sans-serif',
    textTransform: 'uppercase' as const,
    fontSize: 'clamp(2rem, 4vw, 48px)',
    lineHeight: '1.15',
    color: '#141d37',
    margin: '0 0 16px',
    letterSpacing: '0.02em',
  },
  description: {
    fontSize: 'clamp(0.95rem, 1.4vw, 18px)',
    lineHeight: '1.6',
    color: 'rgba(18, 24, 26, 0.7)',
    margin: '0 auto',
    maxWidth: '600px',
  },
  wrapper: {
    width: '100%',
  },
  container: {
    position: 'relative' as const,
    width: '100%',
    aspectRatio: '16 / 9',
    borderRadius: '12px',
    overflow: 'hidden' as const,
    background: '#000',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)',
  },
  iframe: {
    position: 'absolute' as const,
    inset: '0',
    width: '100%',
    height: '100%',
    border: 'none',
  },
}

type ReelVideoPlayerProps = {
  vimeoId: string
  title?: string
  description?: string
}

export function ReelVideoPlayer({ vimeoId, title = 'Reel', description }: ReelVideoPlayerProps) {
  return (
    <section style={styles.section}>
      <div style={styles.header}>
        <h1 style={styles.title}>{title}</h1>
        {description && <p style={styles.description}>{description}</p>}
      </div>

      <div style={styles.wrapper}>
        <div style={styles.container}>
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&byline=0&portrait=0&title=0&dnt=1`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={styles.iframe}
            title={title}
          />
        </div>
      </div>
    </section>
  )
}
