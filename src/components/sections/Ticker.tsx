'use client'

import { motion } from 'framer-motion'

const items = ['Illustration', 'Web Design', 'Motion Design', 'Identity & Branding']

const StarSvg = () => (
  <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
    <svg fill="none" height="12" viewBox="0 0 12 12" width="12" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.7785 6.31384C12.0738 6.20886 12.0738 5.79113 11.7785 5.68616L9.42461 4.84958C9.23859 4.78347 9.15057 4.57098 9.23535 4.3927L10.309 2.1348C10.4436 1.85171 10.1483 1.55635 9.86519 1.69097L7.6073 2.76465C7.42902 2.84943 7.21653 2.76141 7.15042 2.57539L6.31384 0.221535C6.20886 -0.073844 5.79113 -0.0738453 5.68616 0.221533L4.84958 2.57539C4.78347 2.76141 4.57098 2.84943 4.3927 2.76465L2.1348 1.69097C1.85171 1.55635 1.55635 1.85172 1.69097 2.13481L2.76465 4.3927C2.84943 4.57098 2.76141 4.78347 2.57539 4.84958L0.221535 5.68616C-0.073844 5.79113 -0.0738453 6.20886 0.221533 6.31384L2.57539 7.15042C2.76141 7.21653 2.84943 7.42902 2.76465 7.6073L1.69097 9.8652C1.55635 10.1483 1.85172 10.4436 2.13481 10.309L4.3927 9.23535C4.57098 9.15057 4.78347 9.23859 4.84958 9.42461L5.68616 11.7785C5.79113 12.0738 6.20886 12.0738 6.31384 11.7785L7.15042 9.4246C7.21653 9.23859 7.42902 9.15057 7.6073 9.23535L9.8652 10.309C10.1483 10.4436 10.4436 10.1483 10.309 9.86519L9.23535 7.6073C9.15057 7.42902 9.23859 7.21653 9.42461 7.15042L11.7785 6.31384Z"
        fill="currentColor"
      />
    </svg>
  </div>
)

// Build a single set of item+star pairs then repeat 5× for seamless loop
const buildRow = () =>
  items.flatMap((item) => [
    { type: 'item' as const, text: item },
    { type: 'star' as const },
  ])

const row = buildRow()
// 5 repetitions so the loop can animate -50% without gaps
const repeated = [...row, ...row, ...row, ...row, ...row]

export function Ticker() {
  return (
    <div className="ticker-outer">
      <div className="ticker">
        <motion.div
          className="ticker-wrapper"
          animate={{ x: ['0%', '-40%'] }}
          transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
          style={{ display: 'flex' }}
        >
          <div className="ticker-inner">
            {repeated.map((el, i) =>
              el.type === 'item' ? (
                <h3 key={i} className="ticker-item">{el.text}</h3>
              ) : (
                <StarSvg key={i} />
              ),
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
