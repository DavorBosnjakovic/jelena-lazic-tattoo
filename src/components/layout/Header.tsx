// jela-website/src/components/layout/Header.tsx

'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import ThemeToggle from './ThemeToggle'
import LocaleSwitcher from './LocaleSwitcher'

const navItems = [
  { key: 'about', href: '/about' },
  { key: 'portfolio', href: '/portfolio' },
  { key: 'refer', href: '/preporuci' },
  { key: 'contact', href: '/contact' },
] as const

export default function Header() {
  const t = useTranslations('nav')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement | null>(null)

  // The home page opens on a full-screen hero with nothing over it, so the
  // header is not there at rest - it assembles as soon as the visitor starts
  // to scroll away from it. Everywhere else it is simply present.
  const overHero = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const parts = Array.from(header.querySelectorAll<HTMLElement>('[data-rise]'))

    const clear = () => {
      header.style.backgroundColor = ''
      header.style.pointerEvents = ''
      parts.forEach((part) => {
        part.style.transition = ''
        part.style.transform = ''
        part.style.opacity = ''
      })
    }

    if (!overHero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      clear()
      return
    }

    // Soft at both ends, even through the middle.
    const ease = (value: number) => value * value * (3 - 2 * value)
    const clamp = (value: number) => Math.min(1, Math.max(0, value))

    const assemble = () => {
      const viewport = window.innerHeight
      const progress = clamp(window.scrollY / (viewport * 0.45))

      // The bar itself only darkens once its contents are on their way, so an
      // empty strip never sits over the hero.
      header.style.backgroundColor = `rgb(var(--color-background) / ${(progress * 0.85).toFixed(3)})`
      header.style.pointerEvents = progress > 0.08 ? 'auto' : 'none'

      parts.forEach((part, index) => {
        const start = index * 0.07
        const risen = ease(clamp((progress - start) / 0.55))

        if (risen === 1) {
          // Hand the element back to its own stylesheet. Leaving an inline
          // transform behind would permanently block the hover scale.
          part.style.transition = ''
          part.style.transform = ''
          part.style.opacity = ''
          return
        }

        // These elements carry a `transition` class for their hover states.
        // Left on, it would stretch every scroll write over 200ms and the
        // climb would lag behind the finger.
        part.style.transition = 'none'
        // Each one starts a little short of the one before it, so the row
        // never travels as a single block.
        const distance = viewport * (0.95 - index * 0.035)
        part.style.transform = `translate3d(0, ${(distance * (1 - risen)).toFixed(1)}px, 0)`
        part.style.opacity = String(risen)
      })
    }

    assemble()
    window.addEventListener('scroll', assemble, { passive: true })
    window.addEventListener('resize', assemble, { passive: true })
    return () => {
      window.removeEventListener('scroll', assemble)
      window.removeEventListener('resize', assemble)
      clear()
    }
  }, [overHero])

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
      ref={headerRef}
      className={`${overHero ? 'fixed inset-x-0 top-0' : 'sticky top-0'} z-50 ${
        scrolled ? 'backdrop-blur-md' : ''
      } ${overHero ? '' : scrolled ? 'bg-background/80 shadow-sm' : 'bg-background'}`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link
            data-rise
            href="/"
            aria-label={t('homeAria')}
            className="relative h-10 w-auto transition-transform duration-200 hover:scale-102"
          >
            <Image
              src="/logos/logo-light-mode.webp"
              alt="Jelena Lazić Tattoo"
              width={120}
              height={40}
              className="h-10 w-auto dark:hidden"
              priority
            />
            <Image
              src="/logos/logo-dark-mode.webp"
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
                data-rise
                key={item.href}
                href={item.href}
                className={`font-nav text-base font-medium transition-all duration-200 hover:scale-105 ${
                  pathname === item.href
                    ? 'text-accent scale-105 font-semibold'
                    : 'text-foreground hover:text-hover'
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div data-rise className="hidden md:flex items-center gap-5">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>

          <button
            data-rise
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="group md:hidden text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 icon-glow" />
            ) : (
              <Menu className="w-6 h-6 icon-glow" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Full screen overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-foreground z-[100] md:hidden h-screen w-screen">
          {/* Header bar replica */}
          <div className="h-20 flex items-center justify-between px-6 lg:px-8 border-b border-background/10">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              aria-label={t('homeAria')}
              className="relative h-10 w-auto"
            >
              <Image
                src="/logos/logo-dark-mode.webp"
                alt="Jelena Lazić Tattoo"
                width={120}
                height={40}
                className="h-10 w-auto dark:hidden"
              />
              <Image
                src="/logos/logo-light-mode.webp"
                alt="Jelena Lazić Tattoo"
                width={120}
                height={40}
                className="h-10 w-auto hidden dark:block"
              />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="group text-background"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 icon-glow" />
            </button>
          </div>

          <nav className="flex flex-col items-center space-y-8 pt-12">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-nav text-2xl font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? 'text-accent font-semibold'
                    : 'text-background hover:text-accent'
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="flex items-center gap-6 pt-4 text-background">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
