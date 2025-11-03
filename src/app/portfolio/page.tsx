// jela-website/src/app/portfolio/page.tsx

import PortfolioGrid from '@/components/portfolio/PortfolioGrid'

export const metadata = {
  title: 'Portfolio - Jelena Lazić | Custom Tattoo Designs',
  description: 'Browse the complete portfolio of custom tattoo designs by Jelena Lazić. Realistic, black & grey, and color tattoo art in Belgrade.',
}

export default function PortfolioPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4">
            Portfolio
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
            A collection of custom tattoo designs combining artistic vision with technical excellence
          </p>
          <div className="w-24 h-1 bg-accent mx-auto mt-6" />
        </div>

        {/* Portfolio Grid Component */}
        <PortfolioGrid />
      </div>
    </div>
  )
}