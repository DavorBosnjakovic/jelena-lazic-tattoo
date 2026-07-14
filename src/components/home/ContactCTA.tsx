// jela-website/src/components/home/ContactCTA.tsx

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function ContactCTA() {
  const t = useTranslations('contactCta')

  return (
    <section className="py-24 bg-foreground text-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            {t('title')}
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl mb-8 leading-relaxed opacity-90">
            {t('text')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-accent text-white font-nav font-semibold rounded-md hover:bg-accent/90 hover:scale-102 transition-all duration-200 shadow-lg"
            >
              {t('getInTouch')}
            </Link>
            <Link
              href="/portfolio"
              className="px-8 py-4 bg-background text-foreground font-nav font-semibold rounded-md hover:bg-background/90 hover:scale-102 transition-all duration-200"
            >
              {t('viewPortfolio')}
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-background/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="font-semibold mb-1">{t('locationLabel')}</p>
                <p className="opacity-80">{t('locationValue')}</p>
              </div>
              <div>
                <p className="font-semibold mb-1">{t('contactLabel')}</p>
                <p className="opacity-80">+381 61 584 9416</p>
              </div>
              <div>
                <p className="font-semibold mb-1">{t('hoursLabel')}</p>
                <p className="opacity-80">{t('hoursValue')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
