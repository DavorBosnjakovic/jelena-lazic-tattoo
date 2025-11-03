// jela-website/src/app/page.tsx

import HeroSection from '@/components/home/HeroSection'
import PortfolioCarousel from '@/components/home/PortfolioCarousel'
import ContactCTA from '@/components/home/ContactCTA'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PortfolioCarousel />
      <ContactCTA />
    </>
  )
}