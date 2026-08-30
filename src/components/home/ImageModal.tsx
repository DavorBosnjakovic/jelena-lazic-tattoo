// jela-website/src/components/home/ImageModal.tsx

'use client'

import { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import useHorizontalDrag from '@/components/ui/useHorizontalDrag'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  index: number
  onIndexChange: (index: number) => void
  altFor: (number: number) => string
}

// How far a swipe has to travel before it counts as a move to the next
// picture, as a share of the screen's width. Anything shorter springs back.
const SWIPE_SHARE = 0.18

// A short flick counts as well, however little ground it actually covered.
// Pixels per second.
const FLICK = 520

// How far off centre the arriving picture starts. Capped, so a long drag does
// not throw it in from the far side of the county.
const ARRIVES_FROM = 160

export default function ImageModal({
  isOpen,
  onClose,
  images,
  index,
  onIndexChange,
  altFor,
}: ImageModalProps) {
  const stage = useRef<HTMLDivElement | null>(null)

  const step = useCallback(
    (by: number) => {
      if (images.length === 0) return
      onIndexChange((index + by + images.length) % images.length)
    },
    [images.length, index, onIndexChange]
  )

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }

    document.addEventListener('keydown', onKeyDown)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, step])

  // Written straight onto the element rather than held in state: a re-render
  // for every pixel of a drag would drop frames on a phone, which is the one
  // place this matters.
  const place = (x: number, settling: boolean) => {
    const element = stage.current
    if (!element) return
    element.style.transition = settling
      ? 'transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1)'
      : 'none'
    element.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`
  }

  const { dragged, handlers } = useHorizontalDrag({
    onMove: (dx) => place(dx, false),
    onEnd: (dx, velocity) => {
      if (dx === 0) return

      const far = Math.abs(dx) > window.innerWidth * SWIPE_SHARE
      const fast = Math.abs(velocity) > FLICK
      if (!far && !fast) {
        place(0, true)
        return
      }

      // Left means forward, the way a stack of photographs is dealt through.
      const direction = dx < 0 ? 1 : -1
      step(direction)

      // The new picture comes in from the side the swipe was heading towards.
      // Sprung back from where the old one was let go instead, it would arrive
      // from the wrong side and read as the swipe being undone.
      place(direction * Math.min(ARRIVES_FROM, Math.abs(dx)), false)
      requestAnimationFrame(() => place(0, true))
    },
  })

  if (!isOpen || images.length === 0) return null

  const current = images[index % images.length]

  return (
    <div
      // touch-none, not pan-y. There is nothing behind this to scroll - the
      // page under it is locked while it is open - so there is no gesture for
      // the browser to arbitrate. Left as pan-y it had to decide whose the
      // gesture was before releasing it, and the picture sat still under the
      // finger until it let go.
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-lg touch-none"
      // A drag that happens to finish over the backdrop is still a drag, and
      // must not be taken for a click on it.
      onClick={() => {
        if (!dragged.current) onClose()
      }}
      {...handlers}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="group absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-200 border border-white/20"
        aria-label="Close modal"
      >
        <X className="w-6 h-6 text-white icon-glow" />
      </button>

      {/* Previous and next. The swipe is the whole point on a phone, but a
          mouse has nothing to swipe with. */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          step(-1)
        }}
        className="group absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-200 border border-white/20"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6 text-white icon-glow" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          step(1)
        }}
        className="group absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-200 border border-white/20"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6 text-white icon-glow" />
      </button>

      {/* Image container */}
      <div
        ref={stage}
        className="relative w-[90vw] h-[85vh] max-w-6xl will-change-transform"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={current}
          alt={altFor((index % images.length) + 1)}
          fill
          className="object-contain select-none"
          sizes="90vw"
          draggable={false}
          priority
        />
      </div>

      {/* Click outside hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm text-center px-6">
        Swipe or use arrow keys • ESC to close
      </div>
    </div>
  )
}
