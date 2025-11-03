// jela-website/src/components/portfolio/PortfolioGrid.tsx

'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import ImageModal from './ImageModal'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const IMAGES_PER_PAGE = 9

function PortfolioImage({ src, alt, onClick }: { src: string; alt: string; onClick: () => void }) {
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
      {
        rootMargin: '200px',
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={imgRef}
      className="break-inside-avoid group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
        <div className="relative aspect-auto">
          {isVisible ? (
            <Image
              src={src}
              alt={alt}
              width={600}
              height={800}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1199px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-[800px] bg-gray-200 dark:bg-gray-800 animate-pulse" />
          )}
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PortfolioGrid() {
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

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <div className="animate-pulse text-lg">Loading portfolio...</div>
        </div>
      </div>
    )
  }

  if (portfolioImages.length === 0) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">No images found in portfolio</div>
      </div>
    )
  }

  return (
    <>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {currentImages.map((image, index) => (
          <PortfolioImage
            key={startIndex + index}
            src={image}
            alt={`Tattoo design ${startIndex + index + 1}`}
            onClick={() => openModal(image, index)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <>
          <div className="flex items-center justify-center gap-4 mt-16">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-3 rounded-lg border border-border bg-background hover:bg-accent hover:text-white hover:border-accent transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-background disabled:hover:text-foreground disabled:hover:border-border"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-4 py-2 rounded-lg font-nav font-semibold transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-accent text-white'
                      : 'bg-background border border-border hover:bg-accent/10 hover:border-accent'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-3 rounded-lg border border-border bg-background hover:bg-accent hover:text-white hover:border-accent transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-background disabled:hover:text-foreground disabled:hover:border-border"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center mt-6 text-sm text-foreground/60">
            Showing {startIndex + 1}-{Math.min(endIndex, portfolioImages.length)} of {portfolioImages.length} designs
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