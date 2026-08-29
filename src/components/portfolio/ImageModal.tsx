// jela-website/src/components/portfolio/ImageModal.tsx

'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import useHorizontalDrag from '@/components/ui/useHorizontalDrag'

interface ImageModalProps {
  isOpen: boolean
  imageSrc: string
  onClose: () => void
  onNext: () => void
  onPrev: () => void
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
  imageSrc,
  onClose,
  onNext,
  onPrev,
}: ImageModalProps) {
  const stage = useRef<HTMLDivElement | null>(null)

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onNext, onPrev])

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
      if (direction === 1) onNext()
      else onPrev()

      // The new picture comes in from the side the swipe was heading towards.
      // Sprung back from where the old one was let go instead, it would arrive
      // from the wrong side and read as the swipe being undone.
      place(direction * Math.min(ARRIVES_FROM, Math.abs(dx)), false)
      requestAnimationFrame(() => place(0, true))
    },
  })

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fadeIn touch-pan-y"
      // A drag that happens to finish over the backdrop is still a drag, and
      // must not be taken for a click on it.
      onClick={() => {
        if (!dragged.current) onClose()
      }}
      {...handlers}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="group absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center text-white"
        aria-label="Close modal"
      >
        <X className="w-8 h-8 icon-glow" />
      </button>

      {/* Previous button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onPrev()
        }}
        className="group absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-200"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-8 h-8 text-white icon-glow" />
      </button>

      {/* Next button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onNext()
        }}
        className="group absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-200"
        aria-label="Next image"
      >
        <ChevronRight className="w-8 h-8 text-white icon-glow" />
      </button>

      {/* Image container */}
      <div
        className="relative max-w-7xl max-h-[90vh] w-full mx-4 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* The drag rides on this layer, not on the one above it: that one
            carries the opening animation, and the two would overwrite each
            other's transform. */}
        <div ref={stage} className="relative w-full h-full">
          <Image
            src={imageSrc}
            alt="Tattoo design full view"
            width={1200}
            height={1600}
            className="w-auto h-auto max-w-full max-h-[90vh] object-contain mx-auto select-none"
            draggable={false}
            priority
          />
        </div>
      </div>

      {/* Instruction text */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-sm">
        Use arrow keys or swipe to navigate • ESC to close
      </div>
    </div>
  )
}