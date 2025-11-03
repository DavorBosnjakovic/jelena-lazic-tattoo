// jela-website/src/components/ui/ImageModal.tsx

'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  alt: string
}

export default function ImageModal({ isOpen, onClose, imageUrl, alt }: ImageModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-lg"
      onClick={onClose}
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
        className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-200 border border-white/20"
        aria-label="Close modal"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Image container */}
      <div
        className="relative w-[90vw] h-[90vh] max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-contain"
          sizes="90vw"
          priority
        />
      </div>

      {/* Click outside hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
        Click outside or press ESC to close
      </div>
    </div>
  )
}