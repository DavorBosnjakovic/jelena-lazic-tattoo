// jela-website/src/app/[locale]/contact/page.tsx

import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import ContactForm from '@/components/contact/ContactForm'
import TypedHeading from '@/components/ui/TypedHeading'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import SplitLines from '@/components/ui/SplitLines'
import SocialIcon from '@/components/ui/SocialIcon'
// TEMPORARILY COMMENTED OUT - Google Map import - UNCOMMENT WHEN ADDRESS IS CONFIRMED
// import GoogleMap from '@/components/contact/GoogleMap'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return { title: t('metaTitle'), description: t('metaDescription') }
}

const socialLinks = [
  { name: 'Instagram', url: 'https://www.instagram.com/jelena_lazic_tattoo', icon: '/social/instagram.webp' },
  { name: 'Facebook', url: 'https://www.facebook.com/jelenalazictattoo', icon: '/social/facebook.webp' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@jelenalazictattoo', icon: '/social/tiktok.webp' },
  { name: 'WhatsApp', url: 'https://wa.me/381615849416', icon: '/social/whatsapp.webp' },
  { name: 'Telegram', url: 'https://t.me/+381615849416', icon: '/social/telegram.webp' },
]

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('contact')

  const info = [
    {
      title: t('phoneTitle'),
      body: (
        <>
          <a
            href="tel:+381615849416"
            className="text-foreground/90 font-body hover:text-accent transition-colors duration-200"
          >
            +381 61 584 9416
          </a>
          <p className="text-sm text-foreground/60 mt-2">{t('phoneNote')}</p>
        </>
      ),
    },
    {
      title: t('emailTitle'),
      body: (
        <a
          href="mailto:jelenalazictattoo@gmail.com"
          className="text-foreground/90 font-body hover:text-accent transition-colors duration-200 break-all"
        >
          jelenalazictattoo@gmail.com
        </a>
      ),
    },
    {
      title: t('hoursTitle'),
      body: (
        <>
          <p className="text-foreground/90 font-body">{t('hoursValue')}</p>
          <p className="text-sm text-foreground/60 mt-2">{t('hoursNote')}</p>
        </>
      ),
    },
  ]

  return (
    <div className="deal-page min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6 lg:px-8">
        <TypedHeading text={t('title')} />

        <RevealOnScroll>
          <SplitLines
            text={t('subtitle')}
            className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto text-center -mt-8 mb-16"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 max-w-6xl mx-auto mb-16">
            {/* The form arrives as one piece - it is one thing to do, not a
                list of parts. */}
            <div>
              <div className="reveal-up step-reveal mb-6">
                <div>
                  <h2 className="text-3xl font-heading mb-2">{t('sendMessage')}</h2>
                  <span aria-hidden="true" className="brush-rule brush-rule-sm w-24" />
                </div>
              </div>
              <div>
                <ContactForm />

                <div className="mt-8 pt-8 border-t border-foreground/12">
                  <p className="text-center text-foreground/60 mb-5 font-body text-sm">
                    {t('orConnect')}
                  </p>
                  <div className="flex gap-5 justify-center">
                    {socialLinks.map((social, i) => (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="reveal-up deal-in group w-10 h-10 text-foreground/80"
                        style={{ '--i': i } as CSSProperties}
                        aria-label={social.name}
                      >
                        <SocialIcon icon={social.icon} name={social.name} className="w-full h-full" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* No boxes. Title, stroke, contents - the same block as everywhere
                else, each surfacing on its own. */}
            <div>
              <div className="reveal-up step-reveal mb-8">
                <div>
                  <h2 className="text-3xl font-heading mb-2">{t('infoTitle')}</h2>
                  <span aria-hidden="true" className="brush-rule brush-rule-sm w-24" />
                </div>
              </div>

              <div className="space-y-10">
                {info.map((item, i) => (
                  <div key={item.title} className="reveal-up step-reveal">
                    <div>
                      <h3 className="text-xl font-heading mb-2 text-accent">{item.title}</h3>
                      <span
                        aria-hidden="true"
                        className={`brush-rule brush-rule-sm mb-4 w-16 ${
                          i === 1 ? 'brush-rule-b' : i === 2 ? 'brush-rule-c' : ''
                        }`}
                      />
                      {item.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* TEMPORARILY COMMENTED OUT - Map Section - UNCOMMENT WHEN ADDRESS IS CONFIRMED
        <div id="map" className="max-w-6xl mx-auto scroll-mt-24">
          <h2 className="text-3xl font-heading mb-6 text-center">Find Me</h2>
          <GoogleMap />
        </div>
        END OF COMMENTED SECTION */}
      </div>
    </div>
  )
}
