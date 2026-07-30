'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const ArrowRight = () => (
  <svg fill="none" height="10" viewBox="0 0 10 10" width="10" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 5L9 5M9 5L5.4 1M9 5L5.4 9"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.1"
    />
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
      <section className="-mt-[120px] pt-[120px]" id="contact">
        <div
          style={{
            padding: 'clamp(80px, 10vw, 160px) 0 clamp(80px, 10vw, 180px)',
            position: 'relative',
          }}
        >
          <div className="w-full max-w-[1290px] mx-auto px-10 pb-[60px] relative z-10">
            <div className="relative z-[2] flex flex-col gap-2 px-6 max-w-full">
              <div className="relative z-[1] flex justify-center items-center flex-wrap gap-3">
                <h1 className="tracking-wide capitalize flex-none m-0 text-[clamp(2rem,5.5vw,3.8em)] leading-[1.15] font-exo font-bold text-dark whitespace-nowrap">
                  Want to work{' '}
                  <span className="font-serif border-b-[3px] border-dark inline-block pb-[2px]">
                    together?
                  </span>
                </h1>
              </div>
              <div
                className="relative z-[1] flex justify-center items-center flex-wrap gap-3"
                style={{ marginBottom: 32 }}
              >
                <h1 className="tracking-wide capitalize flex-none m-0 text-[clamp(2rem,5.5vw,3.8em)] leading-[1.15] font-exo font-bold text-dark whitespace-nowrap">
                  <span className="font-serif tracking-normal normal-case italic">
                    Let&rsquo;s get started.
                  </span>
                </h1>
              </div>
              <div className="relative z-[1] flex justify-center items-center flex-wrap gap-3">
                <button
                  className="inline-flex items-center gap-3 border-[1.5px] border-secondary rounded-pill text-secondary tracking-wide uppercase bg-transparent py-3.5 pl-[22px] pr-[14px] text-sm font-semibold leading-none no-underline cursor-pointer transition-colors duration-200 font-exo hover:bg-secondary hover:text-white"
                  onClick={() => {
                    setOpen(true)
                    setSubmitted(false)
                  }}
                  type="button"
                >
                  <span>Contact ME</span>
                  <span className="bg-secondary rounded-full flex justify-center items-center w-[26px] h-[26px] shrink-0 transition-colors duration-200 group-hover:bg-white/25">
                    <span className="text-white flex items-center">
                      <ArrowRight />
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {open && (
        <div
          className="fixed inset-0 z-[99999] flex justify-center items-center p-5 bg-dark/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          <div className="bg-white rounded-[24px] w-full max-w-[1000px] relative max-h-[90vh] overflow-auto">
            <button
              className="bg-ticker w-[34px] h-[34px] text-dark cursor-pointer rounded-full flex justify-center items-center absolute top-5 right-5 border-none transition-colors duration-200 hover:bg-bhover"
              onClick={() => setOpen(false)}
              type="button"
              aria-label="Close"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M1 1L11 11M11 1L1 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="p-[60px]">
              <div className="grid grid-cols-2 gap-[60px] w-full p-5">
                {/* Sidebar */}
                <div className="flex flex-col gap-6">
                  <h2
                    className="tracking-wide uppercase text-[clamp(28px,3.5vw,40px)] leading-[1.25] font-exo font-bold"
                    style={{ marginBottom: 4 }}
                  >
                    Get In Touch!
                  </h2>
                  <p className="m-0 text-base leading-[26px] text-dark-70">
                    Reach out to work on something together, request a commission, or just chat!
                  </p>
                  <ul className="flex gap-[10px] list-none m-0 p-0" role="list">
                    {socials.map(({ href, label, icon }) => (
                      <li key={label}>
                        <Link
                          href={href}
                          target={href.startsWith('mailto') ? undefined : '_blank'}
                          rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                          className="bg-dark w-9 h-9 text-white rounded-full flex justify-center items-center no-underline transition-colors duration-200 hover:bg-secondary"
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
                      <input
                        className="border-none border-b border-dark-70 bg-transparent text-dark text-[17px] leading-[28px] font-exo py-2 pb-3 w-full outline-none block placeholder:text-dark-70 focus:border-b-secondary"
                        name="name"
                        placeholder="Name*"
                        required
                        type="text"
                      />
                      <input
                        className="border-none border-b border-dark-70 bg-transparent text-dark text-[17px] leading-[28px] font-exo py-2 pb-3 w-full outline-none block placeholder:text-dark-70 focus:border-b-secondary"
                        name="email"
                        placeholder="Email*"
                        required
                        type="email"
                      />
                      <input
                        className="border-none border-b border-dark-70 bg-transparent text-dark text-[17px] leading-[28px] font-exo py-2 pb-3 w-full outline-none block placeholder:text-dark-70 focus:border-b-secondary"
                        name="subject"
                        placeholder="Subject*"
                        required
                        type="text"
                      />
                      <textarea
                        className="border-none border-b border-dark-70 bg-transparent text-dark text-[17px] leading-[28px] font-exo py-2 pb-3 w-full outline-none block min-h-[100px] resize-y placeholder:text-dark-70 focus:border-b-secondary"
                        name="message"
                        placeholder="Message*"
                        required
                        rows={5}
                      />
                      <div>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-[10px] bg-secondary text-white tracking-wide uppercase rounded-pill px-5 py-[13px] text-sm font-semibold border-none cursor-pointer font-exo transition-colors duration-200 hover:bg-dark"
                        >
                          Send Message
                          <span style={{ display: 'flex' }}>
                            <ArrowRight />
                          </span>
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
