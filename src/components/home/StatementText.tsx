// jela-website/src/components/home/StatementText.tsx

'use client'

import { Fragment, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'

// One line of copy between the hero and the portfolio. The letters light up
// one by one as the paragraph climbs the screen, with the brand red riding
// the leading edge and cooling back to the text colour behind it.
//
// The markup is rendered here rather than built from the DOM, so the text is
// in the HTML the server sends and the sentence survives with JavaScript off.

// How many letters stay warm behind the front of the light.
const TRAIL = 5

export default function StatementText() {
  const t = useTranslations('statement')
  const text = t('text')
  const paragraphRef = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    const paragraph = paragraphRef.current
    if (!paragraph) return

    const letters = Array.from(
      paragraph.querySelectorAll<HTMLElement>('.statement-letter'),
    )
    if (!letters.length) return

    // Nothing to animate for a visitor who asked for stillness; the sentence
    // is simply there, fully lit, which is what it reads as at the end anyway.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      letters.forEach((letter) => letter.classList.add('is-lit'))
      return
    }

    const update = () => {
      const box = paragraph.getBoundingClientRect()
      const viewport = window.innerHeight

      // Starts as the paragraph crosses the lower part of the screen and is
      // finished a third of a screen after it has gone by, so the light moves
      // at about reading pace rather than snapping across.
      const progress = Math.min(
        1,
        Math.max(0, (viewport * 0.85 - box.top) / (box.height + viewport * 0.35)),
      )
      const litCount = Math.round(progress * letters.length)

      letters.forEach((letter, i) => {
        letter.classList.toggle('is-lit', i < litCount)
        // Once the whole sentence is lit the red cools off and the line
        // settles into the ordinary text colour.
        const heat =
          litCount < letters.length && i < litCount
            ? Math.max(0, 1 - (litCount - 1 - i) / TRAIL)
            : 0
        letter.style.setProperty('--heat', `${Math.round(heat * 100)}%`)
      })
    }

    // Lenis smooths the real window scroll, so the ordinary scroll event is
    // still the right thing to listen to here.
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [text])

  const words = text.split(' ')

  return (
    <section className="statement-section bg-background" aria-label={t('label')}>
      {/* Same container as the header and every other section, so the left
          edge of this line sits under the logo rather than off on its own. */}
      <div className="container mx-auto">
      <p className="statement-text" ref={paragraphRef}>
        {/* The sentence as one piece for screen readers; the split letters
            below are decoration and are skipped. */}
        <span className="sr-only">{text}</span>
        <span aria-hidden="true">
          {words.map((word, w) => (
            <Fragment key={w}>
              {/* Words stay unbroken so a line never wraps mid-word. */}
              <span className="statement-word">
                {Array.from(word).map((char, c) => (
                  <span className="statement-letter" key={c}>
                    {char}
                  </span>
                ))}
              </span>
              {w < words.length - 1 ? ' ' : null}
            </Fragment>
          ))}
        </span>
      </p>
      </div>
    </section>
  )
}
