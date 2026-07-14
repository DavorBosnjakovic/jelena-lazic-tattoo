// jela-website/src/app/[locale]/portfolio/page.tsx

import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import PortfolioGrid from '@/components/portfolio/PortfolioGrid'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'portfolio' })
  return { title: t('metaTitle'), description: t('metaDescription') }
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('portfolio')

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
          <div className="w-24 h-1 bg-accent mx-auto mt-6" />
        </div>

        {/* Portfolio Grid Component */}
        <PortfolioGrid />
      </div>
    </div>
  )
}
