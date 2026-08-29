// jela-website/src/components/home/ScrollSequence.tsx

'use client'

import { useEffect } from 'react'

// Publishes how far the visitor has scrolled out of the hero as --seq, a
// plain 0-to-1 number on the root element, which is what fades the hero out.
// The portfolio runs its own reveal off its own position on screen.
//
// Deliberately not `animation-timeline: scroll()`, which Safari and Firefox
// still do not support.
export default function ScrollSequence() {
  useEffect(() => {
    const root = document.documentElement
    root.dataset.seqActive = 'yes'

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.style.setProperty('--seq', '1')
      return
    }

    const update = () => {
      // Half a screen of scrolling is the whole hand-over. The portfolio is
      // pulled up over the hero, so it does not need a screenful of travel.
      const span = window.innerHeight * 0.5
      const progress = Math.min(1, Math.max(0, window.scrollY / span))
      root.style.setProperty('--seq', progress.toFixed(4))
    }

    // Pinning itself lives in CSS and is on from the first paint. All this
    // does is take it back off when a section turns out to be taller than the
    // space under the header - which cannot be expressed in CSS, because it
    // depends on the section's own rendered height.
    //
    // Written this way round on purpose: if this never runs, the section stays
    // pinned, which is the right answer on any normal screen. The other way
    // round, a missed measurement meant nothing was pinned at all.
    const HEADER_HEIGHT = 80

    const checkFit = () => {
      // The spacer that lets the closing panel hold is exactly this tall, and
      // the footer is pulled up by the same amount to fill it.
      const footer = document.querySelector('footer')
      if (footer) {
        root.style.setProperty('--footer-h', `${Math.round(footer.getBoundingClientRect().height)}px`)
      }

      document.querySelectorAll<HTMLElement>('[data-pin]').forEach((section) => {
        const room = window.innerHeight - HEADER_HEIGHT
        // Measured without the pin applied, so a pinned section does not
        // report its own clipped height.
        section.classList.toggle('is-unpinned', section.offsetHeight > room)
      })
    }

    checkFit()
    window.addEventListener('resize', checkFit, { passive: true })
    window.addEventListener('load', checkFit)

    // The carousel section only reaches its real height once its image list
    // arrives, well after this runs.
    const resized = new ResizeObserver(checkFit)
    document.querySelectorAll<HTMLElement>('[data-pin]').forEach((section) => resized.observe(section))

    // Belt and braces. The observer is the right tool but it only reports
    // when the browser gets round to it; these fire regardless, and cover the
    // photos and the web font settling. Cheap - it reads two heights.
    const settles = [300, 1000, 2500].map((delay) => window.setTimeout(checkFit, delay))

    // Called straight from the event rather than through requestAnimationFrame.
    // The browser already caps scroll events at one per frame, and the extra
    // hop only adds a way for the update to be dropped.
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })

    return () => {
      settles.forEach(window.clearTimeout)
      resized.disconnect()
      window.removeEventListener('load', checkFit)
      window.removeEventListener('resize', checkFit)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      // --seq is deliberately left in place. React mounts twice in
      // development, and clearing it on teardown means one unlucky ordering
      // leaves the whole page frozen at zero with everything invisible.
    }
  }, [])

  return null
}
