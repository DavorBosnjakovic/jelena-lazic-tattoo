// jela-website/src/components/ui/ImageViewer.tsx

'use client'

import { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

// A picture at a time, on a strip three wide: the one before, the one being
// looked at, and the one after. Dragging moves the strip, so the picture in
// hand leaves the screen and the next is already there behind it - nothing is
// swapped under the finger.
//
// Pinch and double tap are handled here rather than left to the browser. The
// browser's own version cannot be had at the same time as a horizontal drag:
// whatever gesture it is given, it takes the drag with it.

// How far a swipe must travel to count, as a share of the screen's width.
const SWIPE_SHARE = 0.16

// A flick counts however little ground it covered. Pixels per second.
const FLICK = 450

const SLIDE_MS = 300

// A swipe that did not make the grade eases back to the middle.
const SETTLE_MS = 240

const MAX_SCALE = 4
const DOUBLE_TAP_SCALE = 2.5

// A second tap this soon after the first, and this close to it, is a double.
const DOUBLE_TAP_MS = 300
const DOUBLE_TAP_SLOP = 30

// A tap that wanders less than this is still a tap.
const SLOP = 6

type Props = {
  isOpen: boolean
  images: string[]
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
  altFor?: (number: number) => string
}

export default function ImageViewer({
  isOpen,
  images,
  index,
  onIndexChange,
  onClose,
  altFor,
}: Props) {
  const track = useRef<HTMLDivElement | null>(null)
  const zoomed = useRef<HTMLDivElement | null>(null)

  // The whole gesture, in refs: a re-render for every pixel would drop frames
  // on a phone, which is the one place this matters.
  const points = useRef(new Map<number, { x: number; y: number }>())
  const drag = useRef({ from: 0, dx: 0, lastX: 0, lastAt: 0, velocity: 0, moved: false })
  const pinch = useRef({ active: false, from: 0, scale: 1 })
  const view = useRef({ scale: 1, x: 0, y: 0 })
  const lastTap = useRef({ at: 0, x: 0, y: 0 })
  const handing = useRef(false)

  const count = images.length

  const at = useCallback(
    (offset: number) => images[(((index + offset) % count) + count) % count],
    [images, index, count]
  )

  const width = () => (typeof window === 'undefined' ? 0 : window.innerWidth)

  // The strip sits one screen to the left, so the middle slide is the one on
  // show. Everything else is measured from there.
  const placeTrack = (dx: number, ms: number) => {
    const element = track.current
    if (!element) return
    element.style.transition = ms ? `transform ${ms}ms cubic-bezier(0.22, 0.7, 0.2, 1)` : 'none'
    element.style.transform = `translate3d(${(-width() + dx).toFixed(1)}px, 0, 0)`
  }

  const placeZoom = (ms: number) => {
    const element = zoomed.current
    if (!element) return
    const { scale, x, y } = view.current
    element.style.transition = ms ? `transform ${ms}ms cubic-bezier(0.22, 0.7, 0.2, 1)` : 'none'
    element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`
  }

  const resetZoom = (ms: number) => {
    view.current = { scale: 1, x: 0, y: 0 }
    placeZoom(ms)
  }

  // A zoomed picture may only be pushed as far as its own edges.
  const clampPan = () => {
    const element = zoomed.current
    if (!element) return
    const { scale } = view.current
    const room = element.getBoundingClientRect()
    const maxX = Math.max(0, (room.width * scale - width()) / 2)
    const maxY = Math.max(0, (room.height * scale - window.innerHeight) / 2)
    view.current.x = Math.min(maxX, Math.max(-maxX, view.current.x))
    view.current.y = Math.min(maxY, Math.max(-maxY, view.current.y))
  }

  // Whatever is on show goes back to the middle at rest, and unzoomed.
  useEffect(() => {
    if (!isOpen) return
    handing.current = false
    placeTrack(0, 0)
    resetZoom(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, index])

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onIndexChange((index + 1) % count)
      if (event.key === 'ArrowLeft') onIndexChange((index - 1 + count) % count)
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, onIndexChange, index, count])

  useEffect(() => {
    const onResize = () => {
      if (!handing.current) placeTrack(0, 0)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // The strip carries on the way it was pushed until the picture is off the
  // screen; the index changes only once it is gone, and the strip is then put
  // back in the middle with nothing to see.
  const hand = (direction: number) => {
    handing.current = true
    placeTrack(-direction * width(), SLIDE_MS)
    window.setTimeout(() => {
      onIndexChange((((index + direction) % count) + count) % count)
    }, SLIDE_MS)
  }

  const spread = () => {
    const [a, b] = Array.from(points.current.values())
    return Math.hypot(a.x - b.x, a.y - b.y)
  }

  const onPointerDown = (event: React.PointerEvent) => {
    if (handing.current) return
    points.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

    if (points.current.size === 2) {
      pinch.current = { active: true, from: spread(), scale: view.current.scale }
      return
    }

    drag.current = {
      from: event.clientX,
      dx: 0,
      lastX: event.clientX,
      lastAt: event.timeStamp,
      velocity: 0,
      moved: false,
    }
  }

  const onPointerMove = (event: React.PointerEvent) => {
    const was = points.current.get(event.pointerId)
    if (!was) return
    points.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

    if (pinch.current.active && points.current.size === 2) {
      const next = (spread() / pinch.current.from) * pinch.current.scale
      view.current.scale = Math.min(MAX_SCALE, Math.max(1, next))
      clampPan()
      placeZoom(0)
      return
    }

    if (points.current.size !== 1) return

    const g = drag.current
    const dx = event.clientX - g.from
    if (!g.moved && Math.abs(dx) > SLOP) g.moved = true

    const dt = event.timeStamp - g.lastAt
    if (dt > 0) g.velocity = ((event.clientX - g.lastX) / dt) * 1000
    g.lastX = event.clientX
    g.lastAt = event.timeStamp
    g.dx = dx

    if (!g.moved) return

    // Zoomed in, one finger pushes the picture about instead of the strip.
    if (view.current.scale > 1) {
      view.current.x += event.clientX - was.x
      view.current.y += event.clientY - was.y
      clampPan()
      placeZoom(0)
      return
    }

    placeTrack(dx, 0)
  }

  const finish = (event: React.PointerEvent) => {
    points.current.delete(event.pointerId)

    if (pinch.current.active) {
      if (points.current.size < 2) {
        pinch.current.active = false
        if (view.current.scale <= 1.02) resetZoom(200)
      }
      return
    }

    const g = drag.current

    if (!g.moved) {
      // Two taps in quick succession, in much the same place: zoom to that
      // point, or back out if it is already zoomed.
      const now = event.timeStamp
      const near =
        Math.abs(event.clientX - lastTap.current.x) < DOUBLE_TAP_SLOP &&
        Math.abs(event.clientY - lastTap.current.y) < DOUBLE_TAP_SLOP
      if (now - lastTap.current.at < DOUBLE_TAP_MS && near) {
        lastTap.current = { at: 0, x: 0, y: 0 }
        if (view.current.scale > 1) {
          resetZoom(220)
        } else {
          view.current.scale = DOUBLE_TAP_SCALE
          // Pull the point that was tapped towards the middle.
          view.current.x = (width() / 2 - event.clientX) * (DOUBLE_TAP_SCALE - 1)
          view.current.y = (window.innerHeight / 2 - event.clientY) * (DOUBLE_TAP_SCALE - 1)
          clampPan()
          placeZoom(220)
        }
        return
      }
      lastTap.current = { at: now, x: event.clientX, y: event.clientY }
      return
    }

    if (view.current.scale > 1) return

    const far = Math.abs(g.dx) > width() * SWIPE_SHARE
    const fast = Math.abs(g.velocity) > FLICK
    if (!far && !fast) {
      placeTrack(0, SETTLE_MS)
      return
    }

    hand(g.dx < 0 ? 1 : -1)
  }

  if (!isOpen || count === 0) return null

  const slides = [-1, 0, 1]

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-lg select-none"
      // Every gesture is handled here, pinch included, so the browser is given
      // none of them. Left anything, it takes the horizontal drag with it.
      style={{ touchAction: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finish}
      onPointerCancel={finish}
      onClick={() => {
        if (!drag.current.moved && view.current.scale === 1) onClose()
      }}
    >
      <div ref={track} className="absolute inset-0 flex will-change-transform">
        {slides.map((offset) => (
          <div
            key={offset}
            className="relative shrink-0 w-screen h-full flex items-center justify-center"
          >
            <div
              ref={offset === 0 ? zoomed : undefined}
              className="relative w-[92vw] h-[86vh] will-change-transform"
            >
              <Image
                src={at(offset)}
                alt={altFor ? altFor((((index + offset) % count) + count) % count + 1) : ''}
                fill
                className="object-contain"
                sizes="100vw"
                draggable={false}
                priority={offset === 0}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        className="group absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full border border-white/20"
        aria-label="Close"
      >
        <X className="w-6 h-6 text-white icon-glow" />
      </button>

      {/* A mouse has nothing to swipe with. */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          hand(-1)
        }}
        className="group hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white/10 backdrop-blur-md rounded-full border border-white/20"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6 text-white icon-glow" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          hand(1)
        }}
        className="group hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white/10 backdrop-blur-md rounded-full border border-white/20"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6 text-white icon-glow" />
      </button>

      {/* Only where there is a keyboard to use. On a phone the gestures are
          the obvious thing to try and the line is just something in the way. */}
      <div className="hidden md:block absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
        Arrow keys to move • ESC to close
      </div>
    </div>
  )
}
