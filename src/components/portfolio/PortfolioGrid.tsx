// jela-website/src/components/portfolio/PortfolioGrid.tsx

'use client'

import { useState, useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import ImageModal from './ImageModal'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Four full rows of the widest grid, so a page never ends on a stub.
const IMAGES_PER_PAGE = 20

// The angle each photograph swings to when the cursor is on it. A fixed list
// rather than anything random, so the grid lays out the same on the server and
// in the browser - and so neighbours never lean the same way.
const HOVER_TILTS = [2.6, -3.2, 2, -2.4, 3.4, -2, 2.8, -3, 2.2, -2.6]

// How far a photograph drifts inside its frame, top to bottom, as the tile
// crosses the screen. There is 18% of slack at each edge, so this stays
// inside what there is to give with a margin left over.
const DRIFT_PERCENT = 14

function PortfolioImage({
  src,
  alt,
  index,
  onClick,
}: {
  src: string
  alt: string
  index: number
  onClick: () => void
}) {
  const [isVisible, setIsVisible] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: '200px' }
    )

    if (imgRef.current) observer.observe(imgRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={imgRef}
      className="reveal-up portfolio-tile"
      style={{ '--hover-tilt': `${HOVER_TILTS[index % HOVER_TILTS.length]}deg` } as CSSProperties}
      onClick={onClick}
    >
      {/* Two layers on purpose. The frame does the uncovering and the crop;
          the tile around it is left free for the hover, so the reveal and the
          hover never overwrite each other's transform. */}
      <div className="portfolio-frame relative aspect-[3/4] overflow-hidden">
        {isVisible ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 bg-foreground/5 animate-pulse" />
        )}
      </div>
    </div>
  )
}

export default function PortfolioGrid() {
  const t = useTranslations('portfolio')
  const [portfolioImages, setPortfolioImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

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

  const totalPages = Math.ceil(portfolioImages.length / IMAGES_PER_PAGE)
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE
  const endIndex = startIndex + IMAGES_PER_PAGE
  const currentImages = portfolioImages.slice(startIndex, endIndex)

  const openModal = (src: string, index: number) => {
    setSelectedImage(src)
    setSelectedIndex(startIndex + index)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  const showNext = () => {
    const nextIndex = (selectedIndex + 1) % portfolioImages.length
    setSelectedIndex(nextIndex)
    setSelectedImage(portfolioImages[nextIndex])
  }

  const showPrev = () => {
    const prevIndex = (selectedIndex - 1 + portfolioImages.length) % portfolioImages.length
    setSelectedIndex(prevIndex)
    setSelectedImage(portfolioImages[prevIndex])
  }

  // A slow drift inside the crop as the grid scrolls past. The photograph is
  // taller than its frame, so it has room to move without uncovering an edge.
  useEffect(() => {
    if (portfolioImages.length === 0) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0

    const place = () => {
      frame = 0
      const viewport = window.innerHeight

      document.querySelectorAll<HTMLElement>('.portfolio-frame img').forEach((photo) => {
        const frameBox = photo.parentElement
        if (!frameBox) return

        const box = frameBox.getBoundingClientRect()
        if (box.bottom < 0 || box.top > viewport) return

        // -1 when the tile sits at the bottom of the screen, +1 at the top.
        const middle = box.top + box.height / 2
        const progress = 1 - (middle / viewport) * 2
        photo.style.transform = `translate3d(0, ${(progress * DRIFT_PERCENT).toFixed(2)}%, 0)`
      })
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(place)
    }

    place()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [portfolioImages.length, currentPage])

  const goToPage = (page: number) => {
    // Jump first, swap second. The other way round the new tiles appear while
    // the visitor is still down the page, get revealed where they stand, and
    // the animation is over before it has been seen. Instant rather than
    // smooth for the same reason.
    window.scrollTo({ top: 0, behavior: 'auto' })
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <div className="animate-pulse text-lg">{t('loading')}</div>
        </div>
      </div>
    )
  }

  if (portfolioImages.length === 0) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">{t('noImages')}</div>
      </div>
    )
  }

  return (
    <>
      {/* A grid, filling left to right along each row. The old layout packed
          the photographs into vertical columns, which reads top to bottom per
          column and shuffles itself as images load in. */}
      <RevealOnScroll>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {currentImages.map((image, index) => (
            <PortfolioImage
              key={startIndex + index}
              src={image}
              alt={t('imageAlt', { number: startIndex + index + 1 })}
              index={startIndex + index}
              onClick={() => openModal(image, index)}
            />
          ))}
        </div>
      </RevealOnScroll>

      {totalPages > 1 && (
        <>
          {/* Nothing boxed: bare chevrons, and the page you are on marked by
              the same brush stroke used everywhere else on the site. */}
          <div className="flex items-center justify-center gap-6 mt-16">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-foreground/60 hover:text-accent transition-colors duration-200 disabled:opacity-25 disabled:hover:text-foreground/60"
              aria-label={t('prevAria')}
            >
              <ChevronLeft className="w-8 h-8" strokeWidth={1} />
            </button>

            <div className="flex gap-5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`font-heading text-lg transition-colors duration-200 ${
                    currentPage === page
                      ? 'text-accent'
                      : 'text-foreground/55 hover:text-foreground'
                  }`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                  <span
                    aria-hidden="true"
                    className={`brush-rule brush-rule-sm mt-1 w-full ${
                      currentPage === page ? 'is-drawn' : ''
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-foreground/60 hover:text-accent transition-colors duration-200 disabled:opacity-25 disabled:hover:text-foreground/60"
              aria-label={t('nextAria')}
            >
              <ChevronRight className="w-8 h-8" strokeWidth={1} />
            </button>
          </div>

          <div className="text-center mt-6 text-sm text-foreground/50 font-body">
            {t('showing', { from: startIndex + 1, to: Math.min(endIndex, portfolioImages.length), total: portfolioImages.length })}
          </div>
        </>
      )}

      <ImageModal
        isOpen={!!selectedImage}
        imageSrc={selectedImage || ''}
        onClose={closeModal}
        onNext={showNext}
        onPrev={showPrev}
      />
    </>
  )
}