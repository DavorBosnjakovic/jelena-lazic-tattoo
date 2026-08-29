// jela-website/src/components/ui/TypedHeading.tsx

'use client'

import { useEffect, useRef, useState } from 'react'

const LETTER_MS = 85
const PAUSE_BEFORE_RULE = 220

export default function TypedHeading({ text }: { text: string }) {
  const [typed, setTyped] = useState('')
  const [done, setDone] = useState(false)
  const ruleRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(text)
      setDone(true)
      ruleRef.current?.classList.add('is-drawn')
      return
    }

    let index = 0
    const timers: number[] = []

    const step = () => {
      index += 1
      setTyped(text.slice(0, index))

      if (index < text.length) {
        timers.push(window.setTimeout(step, LETTER_MS))
        return
      }

      // The stroke is drawn only once the word is finished, not alongside it.
      setDone(true)
      timers.push(
        window.setTimeout(() => ruleRef.current?.classList.add('is-drawn'), PAUSE_BEFORE_RULE)
      )
    }

    timers.push(window.setTimeout(step, 350))
    return () => timers.forEach(window.clearTimeout)
  }, [text])

  return (
    <div className="text-center mb-16">
      {/* The full text stays in the document for screen readers and for search
          engines; only the visible copy is typed out. */}
      <span className="sr-only">{text}</span>

      {/* Shrink-wrapped around the words, so the stroke below can simply run
          the full width of it and end where the sentence ends. */}
      <span className="inline-block max-w-full">
        <h1 className="text-5xl md:text-6xl font-heading mb-1" aria-hidden="true">
          {typed}
          {!done && <span className="typed-caret" />}
        </h1>

        <span ref={ruleRef} aria-hidden="true" className="brush-rule w-full" />
      </span>
    </div>
  )
}
