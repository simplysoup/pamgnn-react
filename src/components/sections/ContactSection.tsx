'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const ArrowRight = () => (
  <svg fill="none" height="10" viewBox="0 0 10 10" width="10" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 5L9 5M9 5L5.4 1M9 5L5.4 9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1"/>
  </svg>
)

const socials = [
  { href: 'https://www.youtube.com/@pamguinn', label: 'YouTube', icon: '/images/youtube.svg' },
  { href: 'mailto:pamdesp@gmail.com', label: 'Email', icon: '/images/mail.svg' },
  { href: 'https://www.linkedin.com/in/pmgnn/', label: 'LinkedIn', icon: '/images/linkedin.svg' },
  { href: 'https://vimeo.com/pamgnn', label: 'Vimeo', icon: '/images/vimeo.svg' },
]

export function ContactSection() {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          subject: data.get('subject'),
          message: data.get('message'),
        }),
        headers: { 'Content-Type': 'application/json' },
      })
    } catch {
      // show success anyway
    }
    setSubmitted(true)
  }

  return (
    <>
      <section className="section" id="contact">
        <div
          style={{
            padding: 'clamp(80px, 10vw, 160px) 0 clamp(80px, 10vw, 180px)',
            position: 'relative',
          }}
        >
          <div className="container contact-section-inner">
            <div className="hero-text">
              <div className="line">
                <h1 className="display-1">
                  Want to work{' '}
                  <span className="text-serif cc-underline">together?</span>
                </h1>
              </div>
              <div className="line" style={{ marginBottom: 32 }}>
                <h1 className="display-1">
                  <span className="text-serif cc-italic">Let&rsquo;s get started.</span>
                </h1>
              </div>
              <div className="line">
                <button
                  className="button-with-icon"
                  onClick={() => { setOpen(true); setSubmitted(false) }}
                  type="button"
                >
                  <span>Contact ME</span>
                  <span className="button-icon-wrapper">
                    <span className="button-icon"><ArrowRight /></span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {open && (
        <div
          className="popup"
          role="dialog"
          aria-modal="true"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div className="popup-wrap">
            <button className="popup-close" onClick={() => setOpen(false)} type="button" aria-label="Close">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            <div className="popup-inner">
              <div className="grid-2-columns">
                {/* Sidebar */}
                <div className="sidebar">
                  <h2 className="display-3" style={{ marginBottom: 4 }}>Get In Touch!</h2>
                  <p style={{ margin: 0, fontSize: 16, lineHeight: '26px', color: 'var(--dark-70)' }}>
                    Reach out to work on something together, request a commission, or just chat!
                  </p>
                  <ul className="sc-links" role="list">
                    {socials.map(({ href, label, icon }) => (
                      <li key={label}>
                        <Link
                          href={href}
                          target={href.startsWith('mailto') ? undefined : '_blank'}
                          rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                          className="sc-link"
                          aria-label={label}
                        >
                          <Image src={icon} alt={label} width={18} height={18} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Form */}
                <div>
                  {submitted ? (
                    <p style={{ fontSize: '1.1rem', paddingTop: '2rem' }}>
                      Thanks for reaching out! I&rsquo;ll be in touch soon. ✨
                    </p>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
                    >
                      <input className="text-field" name="name" placeholder="Name*" required type="text" />
                      <input className="text-field" name="email" placeholder="Email*" required type="email" />
                      <input className="text-field" name="subject" placeholder="Subject*" required type="text" />
                      <textarea className="textarea" name="message" placeholder="Message*" required rows={5} />
                      <div>
                        <button type="submit" className="submit-btn">
                          Send Message
                          <span style={{ display: 'flex' }}><ArrowRight /></span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
