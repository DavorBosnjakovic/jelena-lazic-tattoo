// jela-website/src/components/ui/RevealOnScroll.tsx

'use client'

// An element comes in once its top has crossed this share of the screen.
const REVEAL_LINE = 0.85

// Capped, so a fast scroll never leaves the last item waiting on the others.
// High enough that a short row - the four messenger buttons, say - still gets
// a step each and lands one after the other rather than in pairs.
const MAX_STEPS = 7

import { useEffect, useRef } from 'react'

export default function RevealOnScroll({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const reveal = (wholeScreen = false) => {
      // Queried fresh every pass rather than remembered once. Paging the
      // gallery replaces the tiles with new elements, and a remembered list
      // would never learn about them - they would sit at zero opacity for
      // good.
      const waiting = Array.from(
        wrap.querySelectorAll<HTMLElement>('.reveal-up:not(.is-in)')
      )
      if (!waiting.length) return

      // Once there is no more page to scroll, anything still waiting is as
      // far up the screen as it will ever get. Without this, a short page
      // leaves whatever sits below the line stranded - on this site that was
      // the row of buttons, parked off to the left for good.
      const atTheEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2

      // On the first pass the line is the bottom of the screen, not the usual
      // 0.85 of it: anything already in front of the visitor when the page
      // opens should come in on its own. There may be no scrolling left to
      // reach it - on a short page the row of buttons would otherwise stay
      // parked off to the left for good.
      const line = wholeScreen
        ? window.innerHeight
        : window.innerHeight * REVEAL_LINE

      const due = atTheEnd
        ? waiting
        : waiting.filter((el) => el.getBoundingClientRect().top < line)
      if (!due.length) return

      // Down the rows, left to right inside one - the way the eye reads them.
      // Ordered by layout position, not by where the elements currently are:
      // several of them are already part way through a move of their own, and
      // sorting by that hands out the steps in the wrong order.
      due.sort(
        (a, b) => a.offsetTop - b.offsetTop || a.offsetLeft - b.offsetLeft
      )

      // The step is handed to CSS rather than run off timers here, so the
      // delay belongs to the same declaration as the transition it staggers.
      due.forEach((el, index) => {
        el.style.setProperty('--d', String(Math.min(index, MAX_STEPS)))
        el.classList.add('is-in')
      })
    }

    // The first pass waits. Anything already above the reveal line when the
    // page opens would otherwise be marked while the page is still putting
    // itself together, and its arrival would be over before there was
    // anything to watch. Later passes - a scroll, a change of gallery page -
    // still only need a frame, so the closed state gets painted once before
    // the class lands on it.
    let frame = 0
    let timer = 0
    let firstPass = true

    const revealNextFrame = () => {
      if (frame || timer) return

      if (firstPass) {
        firstPass = false
        // Straight off the timer, with no frame callback in the way. Half a
        // second of real time has already given the browser every chance to
        // paint the closed state, and a tab opened in the background never
        // gets a frame at all - which would leave the page with nothing on it.
        timer = window.setTimeout(() => {
          timer = 0
          reveal(true)
        }, 520)
        return
      }

      // Later passes follow newly inserted elements, which do need a frame to
      // paint their closed state first. The timer behind it is the safety net.
      frame = requestAnimationFrame(() => {
        frame = 0
        reveal()
      })
      timer = window.setTimeout(() => {
        timer = 0
        reveal()
      }, 120)
    }

    // Wrapped: the listeners must not hand the event object in as the flag.
    const onScroll = () => reveal()

    revealNextFrame()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    // Paging the gallery swaps the children without any scrolling, so nothing
    // above would ever fire and the new tiles would sit there unrevealed.
    // Deferred for the same reason as the first pass.
    const swapped = new MutationObserver(revealNextFrame)
    swapped.observe(wrap, { childList: true, subtree: true })

    return () => {
      if (frame) cancelAnimationFrame(frame)
      if (timer) window.clearTimeout(timer)
      swapped.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return <div ref={wrapRef}>{children}</div>
}
