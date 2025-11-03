// jela-website/src/app/store/page.tsx

import Link from 'next/link'

export const metadata = {
  title: 'Store - Jelena Lazić | Custom Designs & Prints (Coming Soon)',
  description: 'Shop custom tattoo designs, prints, and merchandise by Jelena Lazić. Exclusive and classic designs available soon.',
}

export default function StorePage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4">
            Store
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
              Coming Soon
            </h2>

            <p className="text-lg md:text-xl text-foreground/80 mb-8 leading-relaxed">
              We're working on something special! Soon you'll be able to shop:
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 bg-foreground/5 rounded-xl border border-border">
              <h3 className="text-xl font-heading font-semibold mb-3 text-accent">
                Custom Designs
              </h3>
              <p className="text-foreground/80 font-body">
                Exclusive one-of-a-kind tattoo designs and classic designs 
                available for purchase and use.
              </p>
            </div>

            <div className="p-6 bg-foreground/5 rounded-xl border border-border">
              <h3 className="text-xl font-heading font-semibold mb-3 text-accent">
                Art Prints
              </h3>
              <p className="text-foreground/80 font-body">
                High-quality prints of original artwork and favorite tattoo 
                designs for your space.
              </p>
            </div>

            <div className="p-6 bg-foreground/5 rounded-xl border border-border">
              <h3 className="text-xl font-heading font-semibold mb-3 text-accent">
                Merchandise
              </h3>
              <p className="text-foreground/80 font-body">
                T-shirts, accessories, and other items featuring original 
                artwork and designs.
              </p>
            </div>

            <div className="p-6 bg-foreground/5 rounded-xl border border-border">
              <h3 className="text-xl font-heading font-semibold mb-3 text-accent">
                Digital Downloads
              </h3>
              <p className="text-foreground/80 font-body">
                Reference sheets, flash designs, and digital art for your 
                personal collection.
              </p>
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="p-8 bg-accent/5 rounded-xl border border-accent/20">
            <h3 className="text-2xl font-heading font-bold mb-4">
              Be the First to Know
            </h3>
            <p className="text-foreground/80 mb-6">
              Want to be notified when the store launches? Subscribe to our newsletter 
              for updates, exclusive previews, and special launch offers.
            </p>
            <p className="text-sm text-foreground/60 mb-4">
              Newsletter signup available in the footer below ↓
            </p>
          </div>

          {/* Alternative CTAs */}
          <div className="mt-12">
            <p className="text-foreground/70 mb-6">
              In the meantime, explore my work or get in touch about a custom tattoo:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/portfolio"
                className="px-8 py-3 bg-foreground text-background font-nav font-semibold rounded-md hover:bg-foreground/90 hover:scale-102 transition-all duration-200"
              >
                View Portfolio
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 bg-accent text-white font-nav font-semibold rounded-md hover:bg-accent/90 hover:scale-102 transition-all duration-200"
              >
                Contact Me
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}