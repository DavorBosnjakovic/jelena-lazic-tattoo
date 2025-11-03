// jela-website/src/components/home/PortfolioCarousel.tsx

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ImageModal from './ImageModal'

const SLIDES_TO_MOVE = 3

export default function PortfolioCarousel() {
  const [portfolioImages, setPortfolioImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>('')
  
  // Touch/Drag state
  const [isDragging, setIsDragging] = useState(false)
  const [hasDragged, setHasDragged] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const itemsPerView = {
    mobile: 2,
    tablet: 3,
    desktop: 4,
  }

  const [itemsToShow, setItemsToShow] = useState(itemsPerView.desktop)

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

  // Handle responsive items to show
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsToShow(itemsPerView.mobile)
      } else if (window.innerWidth < 1200) {
        setItemsToShow(itemsPerView.tablet)
      } else {
        setItemsToShow(itemsPerView.desktop)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Navigation handlers
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => prev + SLIDES_TO_MOVE)
  }, [])

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => prev - SLIDES_TO_MOVE)
  }, [])

  // Auto-rotate carousel
  useEffect(() => {
    if (portfolioImages.length === 0) return

    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        if (!isHovered) {
          handleNext()
        }
      }, 4000)
    }

    startInterval()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isHovered, portfolioImages.length, handleNext])

  // Handle infinite loop reset
  useEffect(() => {
    if (portfolioImages.length === 0) return

    // When we reach near the end of the first duplicate set, instantly reset
    if (currentIndex >= portfolioImages.length) {
      const timer = setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(currentIndex % portfolioImages.length)
        setTimeout(() => setIsTransitioning(true), 50)
      }, 700)

      return () => clearTimeout(timer)
    }

    // When we go before the first image, instantly reset to the equivalent position at the end
    if (currentIndex < 0) {
      const timer = setTimeout(() => {
        setIsTransitioning(false)
        const resetIndex = portfolioImages.length + (currentIndex % portfolioImages.length)
        setCurrentIndex(resetIndex)
        setTimeout(() => setIsTransitioning(true), 50)
      }, 700)

      return () => clearTimeout(timer)
    }
  }, [currentIndex, portfolioImages.length])

  // Touch/Mouse drag handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true)
    setHasDragged(false) // Reset on start
    setStartX(clientX)
    setCurrentX(clientX)
    setIsTransitioning(false)
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return
    setCurrentX(clientX)
    const diff = clientX - startX
    setDragOffset(diff)
    
    // Mark as dragged if moved more than 5px
    if (Math.abs(diff) > 5) {
      setHasDragged(true)
    }
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    
    setIsDragging(false)
    setIsTransitioning(true)

    const threshold = 50
    const diff = currentX - startX

    if (Math.abs(diff) > threshold && hasDragged) {
      if (diff > 0) {
        handlePrev()
      } else {
        handleNext()
      }
    }

    // Reset drag offset after a brief delay
    setTimeout(() => {
      setDragOffset(0)
      setHasDragged(false)
    }, 100)
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleDragStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX)
  }

  const handleMouseUp = () => {
    handleDragEnd()
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd()
    }
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    handleDragEnd()
  }

  // Open image in modal
  const handleImageClick = (imageUrl: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!hasDragged) {
      setSelectedImage(imageUrl)
      setModalOpen(true)
    }
  }

  if (loading) {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">Loading portfolio...</div>
          </div>
        </div>
      </section>
    )
  }

  if (portfolioImages.length === 0) {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center">No images found</div>
        </div>
      </section>
    )
  }

  const extendedImages = [
    ...portfolioImages,
    ...portfolioImages,
    ...portfolioImages,
  ]

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Portfolio
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Explore a selection of custom tattoo designs combining artistic excellence with technical mastery
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-background hover:scale-110 transition-all duration-200 border border-border"
            aria-label="Previous images"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-background hover:scale-110 transition-all duration-200 border border-border"
            aria-label="Next images"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>

          <div className="max-w-7xl mx-auto">
            <div 
              className="overflow-hidden cursor-grab active:cursor-grabbing"
              ref={carouselRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className={`flex gap-6 ${isTransitioning && !isDragging ? 'transition-transform duration-700 ease-in-out' : ''}`}
                style={{
                  transform: `translateX(calc(-${(currentIndex * (100 / itemsToShow)) + (currentIndex * (1.5 / itemsToShow))}% + ${dragOffset}px))`,
                  userSelect: 'none',
                }}
              >
                {extendedImages.map((src, index) => (
                  <div
                    key={`${src}-${index}`}
                    className="relative aspect-[3/4] rounded-lg overflow-hidden group flex-shrink-0"
                    style={{
                      width: `calc((100% - ${(itemsToShow - 1) * 1.5}rem) / ${itemsToShow})`,
                    }}
                    onDragStart={(e) => e.preventDefault()}
                  >
                    <div
                      className="absolute inset-0 z-10 cursor-pointer"
                      onClick={(e) => handleImageClick(src, e)}
                    />
                    <Image
                      src={src}
                      alt={`Portfolio image ${(index % portfolioImages.length) + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, (max-width: 1199px) 33vw, 25vw"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {portfolioImages.map((_, index) => {
              const normalizedIndex = ((currentIndex % portfolioImages.length) + portfolioImages.length) % portfolioImages.length
              const isActive = normalizedIndex === index
              
              return (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-accent w-8'
                      : 'bg-foreground/20 hover:bg-foreground/40 w-2'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              )
            })}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/portfolio"
            className="inline-block px-8 py-3 bg-accent text-white font-nav font-semibold rounded-md hover:bg-accent/90 hover:scale-102 transition-all duration-200"
          >
            View All Work
          </Link>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageUrl={selectedImage}
        alt="Portfolio image"
      />
    </section>
  )
}