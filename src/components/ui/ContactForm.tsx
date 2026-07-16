'use client'

import { useActionState } from 'react'

import { sendContact } from '@/app/actions/contact'

export function ContactForm({ onSuccess }: { onSuccess: () => void }) {
  const [state, action, pending] = useActionState(sendContact, null)

  if (state?.success) {
    onSuccess()
    return null
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <input name="name" type="text" placeholder="Name*" required className="rounded-lg border border-white/20 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/40" />
      <input name="email" type="email" placeholder="Email*" required className="rounded-lg border border-white/20 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/40" />
      <input name="subject" type="text" placeholder="Subject*" required className="rounded-lg border border-white/20 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/40" />
      <textarea name="message" placeholder="Message*" required rows={4} className="resize-none rounded-lg border border-white/20 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/40" />
      {state?.error ? <p className="text-sm text-red-400">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-dark transition-colors hover:bg-bhover disabled:opacity-50"
      >
        {pending ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
