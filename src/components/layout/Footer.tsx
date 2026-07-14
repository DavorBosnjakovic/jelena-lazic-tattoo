// jela-website/src/components/layout/Footer.tsx

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import SocialIcon from '@/components/ui/SocialIcon'

const menuLinks = [
  { key: 'about', href: '/about' },
  { key: 'portfolio', href: '/portfolio' },
  { key: 'store', href: '/store' },
  { key: 'contact', href: '/contact' },
] as const

const socialLinks = [
  { name: 'Instagram', url: 'https://www.instagram.com/jelena_lazic_tattoo', icon: '/social/instagram.webp' },
  { name: 'Facebook', url: 'https://www.facebook.com/jelenalazictattoo', icon: '/social/facebook.webp' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@jelenalazictattoo', icon: '/social/tiktok.webp' },
  { name: 'WhatsApp', url: 'https://wa.me/381615849416', icon: '/social/whatsapp.webp' },
  { name: 'Telegram', url: 'https://t.me/+381615849416', icon: '/social/telegram.webp' },
]

export default function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')

  return (
    <footer className="bg-background text-foreground border-t border-border py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-lg font-bold mb-4">{t('quickLinks')}</h3>
            <div className="flex flex-col space-y-3">
              {menuLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-foreground/80 hover:text-accent transition-colors">
                  {tNav(link.key)}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">{t('connect')}</h3>
            <p className="text-sm text-foreground/80">{t('location')}</p>
            <p className="text-sm text-foreground/80">+381 61 584 9416</p>

            {/* Social icons (white glyphs; inverted to dark in light mode so they stay visible) */}
            <div className="flex gap-4 mt-5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="group w-6 h-6 text-foreground/80 transition-transform duration-300 hover:scale-110"
                >
                  <SocialIcon icon={social.icon} name={social.name} className="w-full h-full" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-foreground/70">
            {t('rights', { year: new Date().getFullYear() })}
          </p>
          <a
            href="https://omnium-studio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:opacity-80 transition-opacity"
          >
            <span>{t('madeBy')}</span>
            {/* Dark text variant for light background */}
            <img
              src="/omnium-studio-horizontal-dark.svg"
              alt="Omnium Studio"
              className="h-[18px] w-auto dark:hidden"
              width={119}
              height={18}
            />
            {/* Light text variant for dark background */}
            <img
              src="/omnium-studio-horizontal.svg"
              alt="Omnium Studio"
              className="h-[18px] w-auto hidden dark:block"
              width={119}
              height={18}
            />
          </a>
        </div>
      </div>
    </footer>
  )
}
