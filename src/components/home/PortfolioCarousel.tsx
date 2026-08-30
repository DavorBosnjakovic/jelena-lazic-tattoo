// jela-website/src/components/home/PortfolioCarousel.tsx

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { CSSProperties } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ImageModal from './ImageModal'
import useHorizontalDrag from '@/components/ui/useHorizontalDrag'

// Pixels per second the strip drifts. Slow enough to read, never stops.
const DRIFT = 26

// How far an arrow nudges the strip.
const NUDGE = 420

// How quickly an arrow nudge is eaten up. Higher glides in faster.
const NUDGE_EASE = 4.5

// A flick carries on after the finger leaves: roughly this many seconds of
// travel at the speed it was let go at, with a ceiling so a violent swipe
// cannot fling the strip halfway round the deck.
const FLICK_CARRY = 0.28
const FLICK_MAX = 1400

// Each card gets one of these angles, picked by its position. Fixed list, so
// the server and the browser lay out the same row.
const TILTS = [-7, 5.5, -9, 6.5, -5.5, 8.5, -6, 9.5]


// Share of a card that the next one lies over. Must match --card-overlap.
const OVERLAP = 0.34

// Only the cards that can be on screen take part; the rest sit off to the
// side behind the clip and nobody sees them arrive.
// How many is a question of how much room the deck has to be dealt across.
// Twenty spread over a desktop reads as a hand laid out on a table; the same
// twenty dealt across a phone is a scramble, because they land on top of one
// another faster than the eye can follow them.
const flyInCount = (width: number) => (width < 768 ? 7 : width < 1024 ? 12 : 20)

// The deck arrives from off screen on the left as one stack, then spreads out
// to the right a card at a time. Shares of the section's travel up the screen.
const DECK_ENTERS = 0.34
const FAN_FROM = 0.3
const FAN_SPAN = 0.3

// Spread so the last card in the deck settles just before the section has
// finished crossing the screen. A fixed step would leave the tail of a long
// deck still half dealt when the scroll runs out - and a short deck would be
// done long before it, with the rest of the scroll spent watching nothing.
const fanStagger = (count: number) =>
  (0.96 - FAN_FROM - FAN_SPAN) / Math.max(1, count - 1)

// The reveal is spread across the section crossing the screen, as shares of
// that travel. Heading first from below, then the two lines of copy from
// alternating sides. Wide and only lightly overlapped, so each move is long
// enough to actually be watched.
const HEADING_WINDOW = [0, 0.5] as const
const LINE_WINDOWS = [
  [0.36, 0.68],
  [0.48, 0.8],
] as const

// The heading never starts closer than this to where it settles, in case the
// section is already high on screen when the reveal begins.
const HEADING_MIN_RISE = 180


export default function PortfolioCarousel() {
  const t = useTranslations('carousel')
  const [portfolioImages, setPortfolioImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const offset = useRef(0)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  // The drag lives in refs, not in state. The strip's position is written
  // frame by frame from a loop that has to keep running, and a state update
  // per pointer move tore that loop down and rebuilt it on every pixel of the
  // drag - which is why dragging did nothing on a phone.
  const dragging = useRef(false)
  // How far the current drag had travelled when it was last read, so each
  // move can be applied as the step since the last one.
  const draggedSoFar = useRef(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Settled on the server at the desktop figure and corrected on mount. It
  // decides which cards a ref is hung on, nothing that is rendered, so the
  // two never disagree over the markup.
  const [flyIn, setFlyIn] = useState(() => flyInCount(1280))

  // Distance from one card to the next. Measured rather than assumed, because
  // the width is set in CSS from the viewport height.
  const [step, setStep] = useState(0)
  const [cardsLanding, setCardsLanding] = useState(false)
  const flyingCards = useRef<(HTMLDivElement | null)[]>([])
  const headingRef = useRef<HTMLHeadingElement | null>(null)
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([])

  // Fetch images from API
  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch('/api/portfolio-images')
        const data = await response.json()
        
        if (data.images && data.images.length > 0) {
          const urls = data.images.map((img: any) => img.url)
          setPortfolioImages(urls)
        }
      } catch (error) {
        console.error('Error fetching portfolio images:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  useEffect(() => {
    const measure = () => {
      const slot = carouselRef.current?.querySelector('.portfolio-slot')
      if (slot) setStep(slot.getBoundingClientRect().width * (1 - OVERLAP))
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [portfolioImages.length])

  useEffect(() => {
    const decide = () => setFlyIn(flyInCount(window.innerWidth))

    decide()
    window.addEventListener('resize', decide)
    return () => window.removeEventListener('resize', decide)
  }, [])

  // A card dropped from the deal must not be left holding the offset the last
  // one gave it, or it sits out of the row for good.
  useEffect(() => {
    flyingCards.current.forEach((card) => {
      if (!card) return
      card.style.transition = ''
      card.style.transform = ''
    })
  }, [flyIn])

  // The strip has no pages. An arrow adds to a debt that the drift loop pays
  // off over the next few frames, so it glides instead of jumping.
  const pending = useRef(0)

  const handleNext = useCallback(() => {
    pending.current -= NUDGE
  }, [])

  const handlePrev = useCallback(() => {
    pending.current += NUDGE
  }, [])

  // Two separate things happen here. The heading and the two lines of copy
  // are tied to how far this section has travelled up the screen. The cards
  // are not - each one simply stands up when its top crosses the reveal line,
  // which is what makes a row land one picture after another.
  useEffect(() => {
    if (portfolioImages.length === 0) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCardsLanding(true)
      return
    }

    const track = carouselRef.current
    if (!track) return

    const span = (value: number, from: number, to: number) =>
      Math.min(1, Math.max(0, (value - from) / (to - from)))

    // Smoothstep: soft at both ends but even through the middle. A steep
    // ease-out spends nearly all its travel in the first fifth of the range,
    // which on a scroll-driven move reads as a jump followed by nothing.
    const ease = (t: number) => t * t * (3 - 2 * t)

    // The transform we last wrote, so the heading's untransformed position can
    // be worked back out without clearing it and forcing a reflow.
    let headingOffset = 0

    // Layout position, walked up the offset chain. Reading it from
    // getBoundingClientRect would stop being true the moment the section
    // pins: its top stops moving, so the progress derived from it freezes
    // and the deck is left half dealt.
    const layoutTop = (element: HTMLElement) => {
      let top = 0
      let node: HTMLElement | null = element
      while (node) {
        top += node.offsetTop
        node = node.offsetParent as HTMLElement | null
      }
      return top
    }

    // Measured once, not on every scroll write. The layout does not move
    // while scrolling, and reading it live makes the progress depend on the
    // very pinning it is supposed to survive.
    let trackTop = layoutTop(track)

    const placeText = () => {
      const viewport = window.innerHeight

      // Floored at zero: the section sits pulled up over the hero, so on a
      // tall screen it is already partly in view before anything is scrolled.
      const from = Math.max(0, trackTop - viewport)
      const to = Math.max(from + viewport * 0.7, trackTop - viewport * 0.1)
      const progress = span(window.scrollY, from, to)

      const heading = headingRef.current
      if (heading) {
        // Start it level with the bottom edge of the screen, measured at the
        // scroll position where the reveal begins. A fixed drop would put it
        // so far down that most of the climb happens off screen.
        const home = heading.getBoundingClientRect().top + window.scrollY - headingOffset
        const rise = Math.max(HEADING_MIN_RISE, viewport - (home - from))

        const risen = ease(span(progress, HEADING_WINDOW[0], HEADING_WINDOW[1]))
        headingOffset = rise * (1 - risen)
        heading.style.opacity = String(risen)
        heading.style.transform = `translate3d(0, ${headingOffset.toFixed(1)}px, 0)`
      }

      lineRefs.current.forEach((line, index) => {
        if (!line) return
        const window_ = LINE_WINDOWS[index] ?? LINE_WINDOWS[LINE_WINDOWS.length - 1]
        const slid = ease(span(progress, window_[0], window_[1]))
        // Even lines come from the left, odd ones from the right.
        const direction = index % 2 === 0 ? -1 : 1
        line.style.opacity = String(slid)
        line.style.transform = `translate3d(${(direction * 60 * (1 - slid)).toFixed(1)}vw, 0, 0)`
      })

      return progress
    }

    // The deck: off screen left as one stack, in, then spread.
    const dealDeck = (progress: number) => {
      const track = carouselRef.current
      if (!track || !step) return

      const width = track.getBoundingClientRect().width
      const entered = ease(span(progress, 0, DECK_ENTERS))
      const stagger = fanStagger(flyIn)

      flyingCards.current.forEach((card, index) => {
        if (!card) return

        // Dealt off the top of the pile, not out from under it. The cards lie
        // in source order, so the last one is the one on top - it goes right
        // first and uncovers the next, the way a deck is pushed out across a
        // table. Started from the first card instead, the deal came out of the
        // bottom of the pile and the cards on top just sat there.
        const from = FAN_FROM + (flyIn - 1 - index) * stagger
        const fanned = ease(span(progress, from, from + FAN_SPAN))

        if (entered === 1 && fanned === 1) {
          // Back to the stylesheet, so the hover lift works again.
          card.style.transition = ''
          card.style.transform = ''
          return
        }

        // Collapsed onto the first card's place, then out to its own.
        const stacked = -index * step
        // The whole stack held off the left edge.
        const offscreen = -(width + step)
        const x = offscreen * (1 - entered) + stacked * (1 - fanned)
        // Lands on the angle the stylesheet gives this card, so nothing jumps
        // at the moment the inline style is handed back.
        const resting = TILTS[index % TILTS.length]
        const tilt = resting * fanned + -3.5 * (1 - fanned)

        card.style.transition = 'none'
        card.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0) rotate(${tilt.toFixed(2)}deg)`
      })

      // Late enough that the deck is dealt, early enough that it is reached
      // even if the measured range is a little off.
      if (progress >= 0.9) setCardsLanding(true)
    }

    const onScroll = () => {
      dealDeck(placeText())
    }

    const onResize = () => {
      trackTop = layoutTop(track)
      onScroll()
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [portfolioImages.length, step, flyIn])

  // One continuous drift. The image list is laid out three times over, and
  // once the strip has travelled the width of one full list it is snapped
  // back by exactly that much - the row behind is identical, so nothing shows.
  // No pages, no reset gap, and the overlap between the last card and the
  // first is the same as everywhere else.
  useEffect(() => {
    if (!cardsLanding || !step || portfolioImages.length === 0) return

    const track = carouselRef.current?.firstElementChild as HTMLElement | null
    if (!track) return

    // Whatever the deal left behind is wiped before the strip starts moving.
    // A card still holding an inline offset would leave a hole in the row.
    flyingCards.current.forEach((card) => {
      if (!card) return
      card.style.transition = ''
      card.style.transform = ''
    })

    const lap = step * portfolioImages.length
    let frame = 0
    let previous = 0

    const tick = (now: number) => {
      if (previous) {
        const elapsed = Math.min(0.05, (now - previous) / 1000)
        if (!isHovered && !dragging.current) offset.current -= DRIFT * elapsed

        // Pay off part of any arrow nudge, so it slides rather than snaps.
        if (pending.current) {
          const paid = pending.current * Math.min(1, elapsed * NUDGE_EASE)
          offset.current += paid
          pending.current -= paid
          if (Math.abs(pending.current) < 0.5) pending.current = 0
        }
      }
      previous = now

      // Looped before it is drawn, so nothing can ever be shown outside the
      // one lap the strip is allowed to occupy. `while`, not `if`: a hard
      // flick can cover more than a lap between two frames, and a single
      // subtraction would leave it out of range with the row hanging off its
      // own end.
      while (offset.current <= -lap) offset.current += lap
      while (offset.current > 0) offset.current -= lap

      track.style.transform = `translateX(${offset.current.toFixed(2)}px)`
      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [cardsLanding, step, portfolioImages.length, isHovered])

  const { dragged, handlers: dragHandlers } = useHorizontalDrag({
    onStart: () => {
      dragging.current = true
      draggedSoFar.current = 0
      // Any arrow nudge still gliding is dropped: the finger is in charge now.
      pending.current = 0
    },
    // The step since the last move, added straight onto the strip's own
    // position. Held apart as a second offset and only added on at the end,
    // it escaped the looping that keeps the strip inside one lap - so a long
    // drag pushed the row off its own start and uncovered the bare page
    // beside it.
    onMove: (dx) => {
      offset.current += dx - draggedSoFar.current
      draggedSoFar.current = dx
    },
    onEnd: (dx, velocity) => {
      dragging.current = false
      draggedSoFar.current = 0

      // A flick carries on. Handed to the same debt the arrows use, so it
      // glides to a stop rather than stopping dead the moment the finger
      // leaves the glass.
      pending.current = Math.max(
        -FLICK_MAX,
        Math.min(FLICK_MAX, velocity * FLICK_CARRY)
      )
    },
  })

  // Open image in modal
  const handleImageClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()

    // A drag that finishes on a photograph is still a drag, and must not be
    // taken for a tap on it.
    if (dragged.current) return

    setSelectedIndex(index)
    setModalOpen(true)
  }

  if (loading) {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">{t('loading')}</div>
          </div>
        </div>
      </section>
    )
  }

  if (portfolioImages.length === 0) {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center">{t('noImages')}</div>
        </div>
      </section>
    )
  }

  const subtitleWords = t('subtitle').split(' ')
  const subtitleLines = [
    subtitleWords.slice(0, Math.ceil(subtitleWords.length / 2)).join(' '),
    subtitleWords.slice(Math.ceil(subtitleWords.length / 2)).join(' '),
  ]

  const extendedImages = [
    ...portfolioImages,
    ...portfolioImages,
    ...portfolioImages,
  ]

  return (
    <section data-pin className="section-pin portfolio-section py-10">
      <div className="text-center mb-8 px-6">
        <h2
          ref={headingRef}
          className="portfolio-reveal text-4xl md:text-5xl font-heading mb-4"
        >
          {t('title')}
        </h2>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          {subtitleLines.map((line, index) => (
            <span
              key={index}
              ref={(node) => {
                lineRefs.current[index] = node
              }}
              className="portfolio-reveal block"
            >
              {line}
            </span>
          ))}
        </p>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={handlePrev}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 p-2 text-foreground/60 hover:text-accent transition-colors duration-200"
          aria-label="Previous images"
        >
          <ChevronLeft className="w-9 h-9 md:w-12 md:h-12" strokeWidth={1} />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 p-2 text-foreground/60 hover:text-accent transition-colors duration-200"
          aria-label="Next images"
        >
          <ChevronRight className="w-9 h-9 md:w-12 md:h-12" strokeWidth={1} />
        </button>

        {/* Clipped left and right only - the arriving cards have to be free to
            come from above and below. */}
        {/* touch-pan-y hands vertical gestures back to the browser so the page
            still scrolls, and keeps the horizontal ones for the strip. Without
            it the browser claims the whole gesture and no move ever arrives. */}
        <div
          className="carousel-clip cursor-grab active:cursor-grabbing touch-pan-y"
          ref={carouselRef}
          {...dragHandlers}
        >
          {/* Position is written straight onto this element frame by frame -
              no transition, or the wrap-around would be animated and show. */}
          <div className="flex" style={{ userSelect: 'none' }}>
            {extendedImages.map((src, index) => {
              const fliesIn = index < flyIn

              return (
                <div
                  key={`${src}-${index}`}
                  className="portfolio-slot relative flex-shrink-0"
                  onDragStart={(e) => e.preventDefault()}
                >
                  {/* Inner layer carries the arrival, so it never fights the
                      track's own transform. */}
                  <div
                    ref={(node) => {
                      flyingCards.current[index] = fliesIn ? node : null
                    }}
                    className="portfolio-card"
                    style={{ '--tilt': `${TILTS[index % TILTS.length]}deg` } as CSSProperties}
                  >
                    {/* Height is fixed in CSS and the width follows it, so
                        the section always fits under the header. The photo is
                        object-cover, so the box crops rather than squashes. */}
                    <div className="portfolio-media relative overflow-hidden group">
                      <div
                        className="absolute inset-0 z-10 cursor-pointer"
                        onClick={(e) =>
                          handleImageClick(index % portfolioImages.length, e)
                        }
                      />
                      <Image
                        src={src}
                        alt={t('imageAlt', { number: (index % portfolioImages.length) + 1 })}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 40vw, 22vw"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>

      <div className="text-center mt-6">
        <Link
          href="/portfolio"
          className="btn inline-block"
        >
          {t('viewAll')}
        </Link>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        images={portfolioImages}
        index={selectedIndex}
        onIndexChange={setSelectedIndex}
        altFor={(number) => t('imageAlt', { number })}
      />
    </section>
  )
}