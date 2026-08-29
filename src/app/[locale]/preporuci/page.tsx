// jela-website/src/app/[locale]/preporuci/page.tsx
// Public "Refer me & earn a discount" page: explains the referral program and
// points visitors to message Jelena directly to request their personal code.

import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import MessengerIcon from '@/components/referral/MessengerIcon'
import TypedHeading from '@/components/ui/TypedHeading'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import SplitLines from '@/components/ui/SplitLines'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'refer' })
  return { title: t('metaTitle'), description: t('metaDescription') }
}

export default async function ReferPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('refer')

  const steps = [
    { title: t('step1Title'), text: t('step1Text') },
    { title: t('step2Title'), text: t('step2Text') },
    { title: t('step3Title'), text: t('step3Text') },
  ]

  const prefill = encodeURIComponent(t('requestPrefill'))
  const messengers = [
    { name: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/381615849416?text=${prefill}`, external: true },
    { name: 'telegram', label: 'Telegram', href: 'https://t.me/+381615849416', external: true },
    { name: 'viber', label: 'Viber', href: 'viber://chat?number=%2B381615849416', external: false },
  ]

  return (
    <div className="deal-page min-h-screen pt-24 pb-20">
      {/* The prose keeps a column - a line of text running the full width of a
          desktop screen is unreadable. Everything else on the page is free. */}
      <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
        <TypedHeading text={t('title')} />

        <RevealOnScroll>
          <SplitLines
            text={t('subtitle')}
            className="text-lg text-foreground/70 text-center -mt-8 mb-16 font-body"
          />

          {/* No boxes. The number carries the step, the stroke separates it
              from the words, exactly as on the About page. */}
          {/* Each step surfaces whole - number, stroke, title and words move
              together on one inner wrapper - but they come up one after the
              other rather than as a block. */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
            {steps.map((step, i) => (
              <div key={step.title} className="reveal-up step-reveal">
                <div>
                  <span className="block font-heading text-5xl text-accent leading-none mb-3">
                    {i + 1}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`brush-rule brush-rule-sm mb-4 w-16 ${
                      i === 1 ? 'brush-rule-b' : i === 2 ? 'brush-rule-c' : ''
                    }`}
                  />
                  <h3 className="text-xl font-heading mb-2">{step.title}</h3>
                  <p className="text-foreground/80 font-body text-sm leading-relaxed">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <SplitLines
            text={t('note')}
            className="text-center text-foreground/60 font-body text-sm mb-16"
          />

          <div className="text-center">
            <h2 className="reveal-up step-reveal text-3xl font-heading mb-2">
              <span className="block">{t('ctaTitle')}</span>
            </h2>
            <SplitLines
              text={t('ctaText')}
              className="text-foreground/80 font-body mb-8"
            />

            <div className="flex flex-wrap gap-3 justify-center">
              {messengers.map((m, i) => (
                <a
                  key={m.name}
                  href={m.href}
                  {...(m.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="reveal-up deal-in btn btn-sm group"
                  style={{ '--i': i } as CSSProperties}
                >
                  <MessengerIcon name={m.name} />
                  {m.label}
                </a>
              ))}
              <a
                href={`mailto:jelenalazictattoo@gmail.com?subject=${encodeURIComponent(t('emailSubject'))}&body=${encodeURIComponent(t('emailBody'))}`}
                className="reveal-up deal-in btn btn-sm group"
                style={{ '--i': messengers.length } as CSSProperties}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="icon-glow w-[22px] h-[22px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l9 6 9-6M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z"
                  />
                </svg>
                Email
              </a>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  )
}
