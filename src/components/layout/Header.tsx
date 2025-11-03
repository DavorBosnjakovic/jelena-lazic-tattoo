// jela-website/src/components/layout/Header.tsx

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

const navItems = [
  { label: 'About Me', href: '/about' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Store', href: '/store' },
  { label: 'Contact', href: '/contact' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-md shadow-sm'
          : 'bg-background'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link
            href="/"
            className="relative h-10 w-auto transition-transform duration-200 hover:scale-102"
          >
            <Image
              src="https://exwuyunznlrgscchbnef.supabase.co/storage/v1/object/public/logos/logo-light-mode.png"
              alt="Jelena Lazić Tattoo"
              width={120}
              height={40}
              className="h-10 w-auto dark:hidden"
              priority
            />
            <Image
              src="https://exwuyunznlrgscchbnef.supabase.co/storage/v1/object/public/logos/logo-dark-mode.png"
              alt="Jelena Lazić Tattoo"
              width={120}
              height={40}
              className="h-10 w-auto hidden dark:block"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-nav text-base font-medium transition-all duration-200 hover:scale-105 ${
                  pathname === item.href
                    ? 'text-accent scale-105 font-semibold'
                    : 'text-foreground hover:text-hover'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
            <ThemeToggle />
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-foreground hover:text-accent transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - FIXED: Added backdrop-blur-md and bg-background/95 */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-20 bg-background/95 backdrop-blur-md z-40 md:hidden">
          <nav className="flex flex-col items-center space-y-8 pt-12">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-nav text-2xl font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? 'text-accent font-semibold'
                    : 'text-foreground hover:text-accent'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-8">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}