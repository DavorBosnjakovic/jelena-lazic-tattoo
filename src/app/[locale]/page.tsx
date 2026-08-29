// jela-website/src/app/[locale]/page.tsx

import { setRequestLocale } from 'next-intl/server'
import HeroColumns from '@/components/home/HeroColumns'
import HeroIntro from '@/components/home/HeroIntro'
import ScrollSequence from '@/components/home/ScrollSequence'
import PortfolioCarousel from '@/components/home/PortfolioCarousel'
import ContactCTA from '@/components/home/ContactCTA'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <ScrollSequence />
      <HeroIntro />
      <HeroColumns />
      <PortfolioCarousel />
      <ContactCTA />
      {/* Room for the closing panel to hold against; the footer fills it. */}
      <div className="cta-dwell" aria-hidden="true" />
    </>
  )
}
