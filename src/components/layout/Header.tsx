// jela-website/src/components/layout/Header.tsx

'use client'

import { useState, useEffect } from 'react'
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

          <div className="hidden md:flex items-center gap-5">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>

          <button
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
            <div className="flex items-center gap-6 pt-4">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
