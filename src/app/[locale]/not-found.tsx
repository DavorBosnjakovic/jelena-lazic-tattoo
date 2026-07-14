// jela-website/src/app/[locale]/not-found.tsx

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function NotFound() {
  const t = useTranslations('notFound')

  return (
    <div className="min-h-screen flex items-center justify-center py-24">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <h1 className="text-9xl md:text-[12rem] font-heading font-bold text-accent/20">
              {t('code')}
            </h1>
          </div>

          {/* Error Message */}
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            {t('title')}
          </h2>

          <p className="text-lg md:text-xl text-foreground/70 mb-8 font-body">
            {t('text')}
          </p>

          {/* Decorative Element */}
          <div className="flex justify-center mb-8">
            <svg
              className="w-24 h-24 text-accent/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>

          {/* Navigation Options */}
          <div className="space-y-4">
            <p className="text-foreground/60 font-body mb-6">
              {t('helpText')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-3 bg-accent text-white font-nav font-semibold rounded-md hover:bg-accent/90 hover:scale-102 transition-all duration-200"
              >
                {t('goHome')}
              </Link>
              <Link
                href="/portfolio"
                className="px-8 py-3 bg-foreground text-background font-nav font-semibold rounded-md hover:bg-foreground/90 hover:scale-102 transition-all duration-200"
              >
                {t('viewPortfolio')}
              </Link>
            </div>

            {/* Additional Links */}
            <div className="pt-8 flex flex-wrap justify-center gap-6 text-sm">
              <Link
                href="/about"
                className="text-foreground/70 hover:text-accent transition-colors duration-200 font-nav"
              >
                {t('aboutMe')}
              </Link>
              <Link
                href="/contact"
                className="text-foreground/70 hover:text-accent transition-colors duration-200 font-nav"
              >
                {t('contact')}
              </Link>
              <Link
                href="/store"
                className="text-foreground/70 hover:text-accent transition-colors duration-200 font-nav"
              >
                {t('store')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
