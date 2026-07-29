import Link from 'next/link'

export default function ReelPage() {
  return (
    <div className="page-sections">
      <div className="container">
        <h1 className="display-3" style={{ marginBottom: 20 }}>Reel</h1>
        <p style={{ fontSize: '18px', lineHeight: '30px', color: 'var(--dark-70)' }}>
          Demo reel and motion work portfolio. View selected projects on{' '}
          <Link href="https://vimeo.com/pamgnn" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'var(--primary)' }}>Vimeo</Link>
          {' '}and{' '}
          <Link href="https://www.youtube.com/@pamgraphicdesign" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'var(--primary)' }}>YouTube</Link>.
        </p>
        <p style={{ fontSize: '16px', lineHeight: '26px', color: 'var(--dark-50)', marginTop: 8 }}>
          Featured motion projects: Shinee Love Sick music video, Vaughan Intl. Film Festival
          graphics, and Animated Business Cards.
        </p>
      </div>
    </div>
  )
}
