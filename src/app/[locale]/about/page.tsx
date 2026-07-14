// jela-website/src/app/[locale]/about/page.tsx

import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  return { title: t('metaTitle'), description: t('metaDescription') }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('about')
  const specialties = t.raw('specialties') as string[]

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4">
            {t('title')}
          </h1>
          <div className="w-24 h-1 bg-accent mx-auto" />
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="mb-16 flex justify-center">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/about/artist.webp"
                alt={t('imageAlt')}
                width={300}
                height={200}
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="space-y-8 mb-16">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg md:text-xl leading-relaxed text-foreground/90 font-body">
                {t('p1')}
              </p>

              <p className="text-lg md:text-xl leading-relaxed text-foreground/90 font-body">
                {t('p2')}
              </p>

              <p className="text-lg md:text-xl leading-relaxed text-foreground/90 font-body">
                {t('p3')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-8 bg-foreground/5 rounded-xl border border-border">
              <h3 className="text-2xl font-heading font-bold mb-4 text-accent">{t('educationTitle')}</h3>
              <p className="text-foreground/90 font-body leading-relaxed">
                {t('educationText')}
              </p>
            </div>

            <div className="p-8 bg-foreground/5 rounded-xl border border-border">
              <h3 className="text-2xl font-heading font-bold mb-4 text-accent">{t('experienceTitle')}</h3>
              <p className="text-foreground/90 font-body leading-relaxed">
                {t('experienceText')}
              </p>
            </div>

            <div className="p-8 bg-foreground/5 rounded-xl border border-border">
              <h3 className="text-2xl font-heading font-bold mb-4 text-accent">{t('specialtiesTitle')}</h3>
              <ul className="space-y-2 text-foreground/90 font-body">
                {specialties.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="p-8 bg-foreground/5 rounded-xl border border-border">
              <h3 className="text-2xl font-heading font-bold mb-4 text-accent">{t('locationTitle')}</h3>
              <div className="space-y-2 text-foreground/90 font-body">
                <p>
                  <span className="font-semibold">{t('studioLabel')}</span><br />
                  {t('studioValue')}
                </p>
                <p>
                  <span className="font-semibold">{t('hoursLabel')}</span><br />
                  {t('hoursValue')}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center py-12 px-8 bg-accent/5 rounded-xl border border-accent/20">
            <h3 className="text-3xl font-heading font-bold mb-4">{t('ctaTitle')}</h3>
            <p className="text-lg text-foreground/80 mb-6 font-body">{t('ctaText')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="px-8 py-3 bg-accent text-white font-nav font-semibold rounded-md hover:bg-accent/90 hover:scale-102 transition-all duration-200">
                {t('ctaGetInTouch')}
              </Link>
              <Link href="/portfolio" className="px-8 py-3 bg-foreground text-background font-nav font-semibold rounded-md hover:bg-foreground/90 hover:scale-102 transition-all duration-200">
                {t('ctaViewPortfolio')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
