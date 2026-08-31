// jela-website/src/components/ui/useHorizontalDrag.ts

'use client'

import { useCallback, useRef } from 'react'

// Pointer events rather than separate mouse and touch handlers. One code path
// covers a mouse, a finger and a pen, and once a drag is under way pointer
// capture keeps it alive when the pointer wanders off the element it started
// on - over an arrow, past the edge of the strip, out of the window.

// A tap that wanders this far is still a tap. No finger is ever quite still,
// and without the slack every tap on a photograph would register as a drag
// and the picture would refuse to open.
const SLOP = 6

type Options = {
  onStart?: () => void
  onMove?: (dx: number) => void
  // Velocity is in pixels per second, signed the same way as dx.
  onEnd?: (dx: number, velocity: number) => void
}

export default function useHorizontalDrag({ onStart, onMove, onEnd }: Options) {
  const gesture = useRef({
    id: null as number | null,
    from: 0,
    lastX: 0,
    lastAt: 0,
    velocity: 0,
    moved: false,
  })

  // Read by whatever handles the click that follows: it has to know whether
  // the pointer that just came up was a tap or the end of a drag.
  const dragged = useRef(false)

  const onPointerDown = useCallback(
    (event: React.PointerEvent) => {
      // A second finger, or any button other than the left one, is not a drag.
      if (gesture.current.id !== null) return
      if (event.pointerType === 'mouse' && event.button !== 0) return

      gesture.current = {
        id: event.pointerId,
        from: event.clientX,
        lastX: event.clientX,
        lastAt: event.timeStamp,
        velocity: 0,
        moved: false,
      }
      dragged.current = false
      onStart?.()
    },
    [onStart]
  )

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      const g = gesture.current
      if (g.id !== event.pointerId) return

      const dx = event.clientX - g.from
      if (!g.moved && Math.abs(dx) > SLOP) {
        g.moved = true
        dragged.current = true
        // Captured here rather than at the start of the gesture. Capture
        // retargets everything that follows to the element holding it - the
        // click included - so capturing every press meant a plain click on a
        // photograph was delivered to the strip around it and the picture
        // never opened. A press that never becomes a drag is now never
        // captured, and its click lands where it was aimed.
        event.currentTarget.setPointerCapture(event.pointerId)
      }

      // Measured over the last move rather than the whole gesture, so a flick
      // at the end of a slow drag still throws the strip.
      const dt = event.timeStamp - g.lastAt
      if (dt > 0) g.velocity = ((event.clientX - g.lastX) / dt) * 1000
      g.lastX = event.clientX
      g.lastAt = event.timeStamp

      if (g.moved) onMove?.(dx)
    },
    [onMove]
  )

  const finish = useCallback(
    (event: React.PointerEvent) => {
      const g = gesture.current
      if (g.id !== event.pointerId) return
      g.id = null

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }

      onEnd?.(g.moved ? event.clientX - g.from : 0, g.moved ? g.velocity : 0)

      // Cleared a beat later, never here. A mouse drag is followed by a click,
      // and that click has to find the flag still set or the photograph opens
      // at the end of every drag.
      if (g.moved) window.setTimeout(() => { dragged.current = false }, 0)
    },
    [onEnd]
  )

  return {
    dragged,
    // Spread onto the element the gesture starts on. It also wants
    // `touch-action: pan-y`, or the browser claims the horizontal swipe for
    // itself and no move ever arrives.
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finish,
      onPointerCancel: finish,
    },
  }
}
