// jela-website/src/app/[locale]/store/page.tsx

import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'store' })
  return { title: t('metaTitle'), description: t('metaDescription') }
}

export default async function StorePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('store')

  const features = [
    { title: t('customDesignsTitle'), text: t('customDesignsText') },
    { title: t('artPrintsTitle'), text: t('artPrintsText') },
    { title: t('merchTitle'), text: t('merchText') },
    { title: t('digitalTitle'), text: t('digitalText') },
  ]

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4">
            {t('title')}
          </h1>
          <div className="w-24 h-1 bg-accent mx-auto" />
        </div>

        {/* Coming Soon Content */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-12">
            {/* Decorative Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent/10 mb-8">
              <svg
                className="w-12 h-12 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>

            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              {t('comingSoon')}
            </h2>

            <p className="text-lg md:text-xl text-foreground/80 mb-8 leading-relaxed">
              {t('intro')}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 bg-foreground/5 rounded-xl border border-border">
                <h3 className="text-xl font-heading font-semibold mb-3 text-accent">
                  {feature.title}
                </h3>
                <p className="text-foreground/80 font-body">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

          {/* Follow CTA */}
          <div className="p-8 bg-accent/5 rounded-xl border border-accent/20">
            <h3 className="text-2xl font-heading font-bold mb-4">
              {t('followTitle')}
            </h3>
            <p className="text-foreground/80 mb-6">
              {t('followText')}
            </p>
            <Link
              href="https://www.instagram.com/jelena_lazic_tattoo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-accent text-white font-nav font-semibold rounded-md hover:bg-accent/90 hover:scale-102 transition-all duration-200"
            >
              {t('followBtn')}
            </Link>
          </div>

          {/* Alternative CTAs */}
          <div className="mt-12">
            <p className="text-foreground/70 mb-6">
              {t('altIntro')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/portfolio"
                className="px-8 py-3 bg-foreground text-background font-nav font-semibold rounded-md hover:bg-foreground/90 hover:scale-102 transition-all duration-200"
              >
                {t('viewPortfolio')}
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 bg-accent text-white font-nav font-semibold rounded-md hover:bg-accent/90 hover:scale-102 transition-all duration-200"
              >
                {t('contactMe')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
