// jela-website/src/components/ui/SplitLines.tsx

'use client'

import { useEffect, useRef } from 'react'

// Lines are not something the markup knows about - they are the result of the
// browser wrapping the words. So the words are rendered individually, then
// grouped by the line they actually landed on, and each group is brought in
// one after the other. Regrouped on resize, because the wrapping moves.
export default function SplitLines({
  text,
  className = '',
}: {
  text: string
  className?: string
}) {
  const ref = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    const paragraph = ref.current
    if (!paragraph) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const group = () => {
      const words = Array.from(paragraph.querySelectorAll<HTMLElement>('.split-word'))
      let line = -1
      let previousTop: number | null = null

      words.forEach((word) => {
        const top = Math.round(word.offsetTop)
        if (previousTop === null || top > previousTop + 2) {
          line += 1
          previousTop = top
        }
        word.style.setProperty('--line', String(line))
      })
    }

    group()
    window.addEventListener('resize', group)
    return () => window.removeEventListener('resize', group)
  }, [text])

  const words = text.split(' ')

  return (
    <p ref={ref} className={`reveal-up split-lines ${className}`}>
      {words.map((word, index) => (
        <span key={index}>
          <span className="split-word">{word}</span>
          {index < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  )
}
