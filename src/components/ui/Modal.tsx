'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

import { ContactForm } from './ContactForm'

export function Modal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group relative h-10 overflow-hidden rounded-full border border-white/30 px-6 transition-colors hover:border-white"
      >
        <span className="flex flex-col transition-transform duration-300 group-hover:-translate-y-full">
          <span className="block text-sm uppercase tracking-[0.2em]">Contact ME</span>
          <span className="block text-sm uppercase tracking-[0.2em]">Contact Me</span>
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-backdrop/95" onClick={() => setOpen(false)} />
            <motion.div
              className="relative z-10 w-full max-w-lg rounded-card bg-dark2 p-8"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 text-white/40 hover:text-white"
                aria-label="Close"
              >
                ✕
              </button>
              <h2 className="mb-2 font-serif text-3xl italic text-white">Get In Touch!</h2>
              <p className="mb-6 text-sm text-white/50">
                Reach out to work on something together, request a commission, or just chat.
              </p>
              <ContactForm onSuccess={() => setOpen(false)} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
