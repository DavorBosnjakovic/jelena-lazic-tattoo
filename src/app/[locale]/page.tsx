// jela-website/src/app/[locale]/page.tsx

import { setRequestLocale } from 'next-intl/server'
import HeroSection from '@/components/home/HeroSection'
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
      <HeroSection />
      <PortfolioCarousel />
      <ContactCTA />
    </>
  )
}
