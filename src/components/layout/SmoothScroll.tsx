// jela-website/src/components/layout/SmoothScroll.tsx

'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

// Lenis smooths the real window scroll rather than transforming the page
// inside a container. That distinction matters here: everything on the home
// page is built on position: sticky and on reading window.scrollY, and a
// container-based smoother would leave both dead.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.15,
      // Gentle at the end, so long scrolls settle instead of stopping dead.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Left off on touch on purpose: on a phone the smoothing fights the
      // finger and reads as the device not keeping up.
      syncTouch: false,
    })

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])

  return null
}
