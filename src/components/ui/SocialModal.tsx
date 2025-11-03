'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'

interface SocialModalProps {
  isOpen: boolean
  onClose: () => void
}

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/jelena_lazic_tattoo',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/jelenalazictattoo',
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@jelenalazictattoo',
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/381615849416',
  },
  {
    name: 'Telegram',
    url: 'https://t.me/+381615849416',
  },
]

function SocialModal(props: SocialModalProps) {
  const { isOpen, onClose } = props

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4" aria-label="Close">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Connect With Me</h2>
        <div className="space-y-4">
          {socialLinks.map((social) => (
            <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="flex items-center p-4 rounded-lg border hover:border-red-800">
              <span className="font-medium">{social.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SocialModal