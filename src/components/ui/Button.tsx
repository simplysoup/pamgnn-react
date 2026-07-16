import type { ReactNode } from 'react'

type ButtonProps = {
  children: ReactNode
  href?: string
}

export function Button({ children, href }: ButtonProps) {
  const content = <span className="inline-flex rounded-full border border-white/20 px-5 py-3 text-sm uppercase tracking-[0.03em] transition hover:bg-white/10">{children}</span>

  if (href) {
    return <a href={href}>{content}</a>
  }

  return content
}
