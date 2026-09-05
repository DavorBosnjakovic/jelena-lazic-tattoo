// jela-website/src/components/home/ContactCTA.tsx

'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import InkformerLink from '@/components/ui/InkformerLink'

export default function ContactCTA() {
  const t = useTranslations('contactCta')
  const sectionRef = useRef<HTMLElement | null>(null)

  // Same top padding as the portfolio, so this heading lands the same
  // distance below the header when it holds.
  return (
    <section
      ref={sectionRef}
      data-pin
      className="section-pin cta-section pt-10 pb-20 bg-background text-foreground"
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-heading mb-6">
            {t('title')}
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl mb-12 leading-relaxed text-foreground/75">
            {t('text')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
            <Link href="/contact" className="btn">
              {t('getInTouch')}
            </Link>
            <Link href="/portfolio" className="btn btn-ghost">
              {t('viewPortfolio')}
            </Link>
          </div>

          <InkformerLink />

          {/* Contact Info */}
          <div className="mt-14 pt-8 border-t border-foreground/15">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="font-semibold mb-1">{t('locationLabel')}</p>
                <p className="text-foreground/70">{t('locationValue')}</p>
              </div>
              <div>
                <p className="font-semibold mb-1">{t('contactLabel')}</p>
                <p className="text-foreground/70">+381 61 584 9416</p>
              </div>
              <div>
                <p className="font-semibold mb-1">{t('hoursLabel')}</p>
                <p className="text-foreground/70">{t('hoursValue')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
