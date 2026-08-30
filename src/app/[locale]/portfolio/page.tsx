// jela-website/src/app/[locale]/portfolio/page.tsx

import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import PortfolioGrid from '@/components/portfolio/PortfolioGrid'
import TypedHeading from '@/components/ui/TypedHeading'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import SplitLines from '@/components/ui/SplitLines'

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
    <div className="min-h-screen pt-24 pb-20">
      {/* Heading in a column, the pictures edge to edge - the work is what the
          page is for. */}
      <div className="container mx-auto px-6 lg:px-8">
        <TypedHeading text={t('title')} />
        {/* Line by line, the way every other subtitle on the site arrives. */}
        <RevealOnScroll>
          <SplitLines
            text={t('subtitle')}
            className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto text-center -mt-10 mb-16"
          />
        </RevealOnScroll>
      </div>

      <div className="px-2">
        <PortfolioGrid />
      </div>
    </div>
  )
}
