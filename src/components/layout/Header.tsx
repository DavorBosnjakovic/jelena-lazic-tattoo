// jela-website/src/components/layout/Header.tsx

'use client'

import { useState, useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import ThemeToggle from './ThemeToggle'
import LocaleSwitcher from './LocaleSwitcher'
import SocialIcon from '@/components/ui/SocialIcon'

const navItems = [
  { key: 'about', href: '/about' },
  { key: 'portfolio', href: '/portfolio' },
  { key: 'refer', href: '/preporuci' },
  { key: 'contact', href: '/contact' },
] as const

// The same set the footer carries, in the same order.
const socialLinks = [
  { name: 'Instagram', url: 'https://www.instagram.com/jelena_lazic_tattoo', icon: '/social/instagram.webp' },
  { name: 'Facebook', url: 'https://www.facebook.com/jelenalazictattoo', icon: '/social/facebook.webp' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@jelenalazictattoo', icon: '/social/tiktok.webp' },
  { name: 'WhatsApp', url: 'https://wa.me/381615849416', icon: '/social/whatsapp.webp' },
  { name: 'Telegram', url: 'https://t.me/+381615849416', icon: '/social/telegram.webp' },
]

export default function Header() {
  const t = useTranslations('nav')
  const tFooter = useTranslations('footer')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const panelContentsRef = useRef<HTMLDivElement | null>(null)

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

    // Only what is actually on screen counts towards the stagger. Counting
    // the hidden ones too meant that on a phone, where the four nav links are
    // not rendered, the logo was first and the menu button seventh - six steps
    // apart, for two things sitting side by side.
    // Whether the element takes up any space at all, rather than what its own
    // `display` says. The four nav links sit inside a container that is hidden
    // on a phone, and asking each link reports the link's own display, not its
    // parent's - so all six counted, and the menu button ended up six steps
    // behind a logo standing right next to it.
    const visible = () =>
      Array.from(header.querySelectorAll<HTMLElement>('[data-rise]')).filter(
        (part) => part.getClientRects().length > 0
      )

    let parts = visible()

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
      if (parts.length === 0) parts = visible()
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
    const onResize = () => {
      parts = visible()
      assemble()
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      window.removeEventListener('scroll', assemble)
      window.removeEventListener('resize', onResize)
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

  // The panel opens to the height of what is in it. The contents are not
  // themselves height constrained - only the panel around them clips - so
  // this reads true even while the panel is shut.
  useEffect(() => {
    const panel = panelRef.current
    const contents = panelContentsRef.current
    if (!panel || !contents) return

    const measure = () => {
      // Held to what is left of the screen under the bar. Past that the panel
      // scrolls, rather than running off the bottom with the contacts on it.
      const room = window.innerHeight - 80
      const height = Math.min(contents.scrollHeight, room)
      panel.style.setProperty('--menu-h', `${height}px`)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [mobileMenuOpen, pathname])

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

      {/* The menu drops out from under the bar. Always in the document, so it
          can be watched closing as well as opening; `inert` keeps the closed
          panel out of the way of the keyboard and the screen reader. */}
      <div
        id="mobile-menu"
        ref={panelRef}
        inert={!mobileMenuOpen}
        className={`mobile-menu md:hidden ${mobileMenuOpen ? 'is-open' : ''}`}
      >
        <div ref={panelContentsRef}>
          <div className="container mx-auto px-6 pt-4 pb-8">
            <nav className="font-nav">
              {navItems.map((item, index) => (
                <div
                  key={item.href}
                  className="menu-item"
                  style={{ '--d': index } as CSSProperties}
                >
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? 'page' : undefined}
                    className={`menu-link ${pathname === item.href ? 'is-active' : ''}`}
                  >
                    {t(item.key)}
                  </Link>
                </div>
              ))}
            </nav>

            {/* The row inside the riser, not on it - the riser is forced to
                be a block so it can be clipped. */}
            <div
              className="menu-item"
              style={{ '--d': navItems.length } as CSSProperties}
            >
              <div>
                <div className="flex items-center justify-center gap-6 pt-6">
                  <LocaleSwitcher />
                  <ThemeToggle />
                </div>
              </div>
            </div>

            {/* Who this is and how to reach her, at the foot of the panel. */}
            <div
              className="menu-item"
              style={{ '--d': navItems.length + 1 } as CSSProperties}
            >
              <div className="mt-7 pt-7 border-t border-border text-center">
                <Link
                  href="/"
                  aria-label={t('homeAria')}
                  className="inline-block"
                >
                  <Image
                    src="/logos/logo-light-mode.webp"
                    alt="Jelena Lazić Tattoo"
                    width={180}
                    height={60}
                    className="h-14 w-auto dark:hidden"
                  />
                  <Image
                    src="/logos/logo-dark-mode.webp"
                    alt="Jelena Lazić Tattoo"
                    width={180}
                    height={60}
                    className="h-14 w-auto hidden dark:block"
                  />
                </Link>

                <p className="mt-5 text-sm text-foreground/70">{tFooter('location')}</p>
                <a
                  href="tel:+381615849416"
                  className="block text-sm text-foreground/70 hover:text-accent transition-colors"
                >
                  +381 61 584 9416
                </a>

                <div className="flex justify-center gap-5 mt-5">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="group w-6 h-6 text-foreground/70 transition-transform duration-300 hover:scale-110"
                    >
                      <SocialIcon
                        icon={social.icon}
                        name={social.name}
                        className="w-full h-full"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
