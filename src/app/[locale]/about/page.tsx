// jela-website/src/app/[locale]/about/page.tsx

import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import TypedHeading from '@/components/ui/TypedHeading'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import SocialIcon from '@/components/ui/SocialIcon'
import { INKFORMER_URL, INKFORMER_RED } from '@/components/ui/InkformerLink'
import SplitLines from '@/components/ui/SplitLines'

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
  const tInk = await getTranslations('inkformer')
  const specialties = t.raw('specialties') as string[]

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6 lg:px-8">
        <TypedHeading text={t('title')} />

        <div className="max-w-5xl mx-auto">
          <RevealOnScroll>
          <div className="mb-16 flex justify-center">
            <div className="about-photo reveal-up relative">
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
            <div className="max-w-none space-y-6">
              <SplitLines
                text={t('p1')}
                className="text-lg md:text-xl leading-relaxed text-foreground/90 font-body"
              />
              <SplitLines
                text={t('p2')}
                className="text-lg md:text-xl leading-relaxed text-foreground/90 font-body"
              />
              <SplitLines
                text={t('p3')}
                className="text-lg md:text-xl leading-relaxed text-foreground/90 font-body"
              />
            </div>
          </div>

          {/* No boxes: the home page has none, and grey rounded panels were the
              one thing on this page that did not belong to it. A title, the
              same brush stroke as the heading, and the words. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-14 mb-16">
              <div className="reveal-up step-reveal">
                <div>
                  <h3 className="text-2xl font-heading mb-3 text-accent">{t('educationTitle')}</h3>
                  <span aria-hidden="true" className="brush-rule brush-rule-sm mb-5 w-28" />
                  <p className="text-foreground/90 font-body leading-relaxed">
                    {t('educationText')}
                  </p>
                </div>
              </div>

              <div className="reveal-up step-reveal">
                <div>
                  <h3 className="text-2xl font-heading mb-3 text-accent">{t('experienceTitle')}</h3>
                  <span aria-hidden="true" className="brush-rule brush-rule-sm brush-rule-b mb-5 w-20" />
                  <p className="text-foreground/90 font-body leading-relaxed">
                    {t('experienceText')}
                  </p>
                </div>
              </div>

              <div className="reveal-up step-reveal">
                <div>
                  <h3 className="text-2xl font-heading mb-3 text-accent">{t('specialtiesTitle')}</h3>
                  <span aria-hidden="true" className="brush-rule brush-rule-sm brush-rule-c mb-5 w-32" />
                  <ul className="space-y-2 text-foreground/90 font-body">
                    {specialties.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="reveal-up step-reveal">
                <div>
                  <h3 className="text-2xl font-heading mb-3 text-accent">{t('locationTitle')}</h3>
                  <span aria-hidden="true" className="brush-rule brush-rule-sm brush-rule-d mb-5 w-24" />
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
            </div>
          </RevealOnScroll>

          <div className="text-center py-12 px-8">
            <h3 className="text-3xl font-heading mb-4">{t('ctaTitle')}</h3>
            <p className="text-lg text-foreground/80 mb-6 font-body">{t('ctaText')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn">
                {t('ctaGetInTouch')}
              </Link>
              <a
                href={INKFORMER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost group"
              >
                <SocialIcon
                  icon="/social/inkformer.svg"
                  name="Inkformer"
                  color={INKFORMER_RED}
                  className="w-[13px] h-5"
                />
                {tInk('button')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
