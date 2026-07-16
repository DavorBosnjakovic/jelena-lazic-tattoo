// jela-website/src/app/[locale]/preporuci/page.tsx
// Public "Refer me & earn a discount" page: explains the referral program and
// points visitors to message Jelena directly to request their personal code.

import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import MessengerIcon from '@/components/referral/MessengerIcon'

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
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">{t('title')}</h1>
          <p className="text-lg text-foreground/70">{t('subtitle')}</p>
          <div className="w-24 h-1 bg-accent mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {steps.map((step, i) => (
            <div key={step.title} className="p-6 bg-foreground/5 rounded-xl border border-border text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent font-bold mb-4">
                {i + 1}
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">{step.title}</h3>
              <p className="text-foreground/80 font-body text-sm leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-foreground/70 font-body mb-16">{t('note')}</p>

        <div className="p-8 bg-accent/5 rounded-xl border border-accent/20 text-center">
          <h2 className="text-3xl font-heading font-bold mb-2">{t('ctaTitle')}</h2>
          <p className="text-foreground/80 font-body mb-6">{t('ctaText')}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {messengers.map((m) => (
              <a
                key={m.name}
                href={m.href}
                {...(m.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-nav font-semibold hover:text-accent transition-all duration-200"
              >
                <MessengerIcon name={m.name} />
                {m.label}
              </a>
            ))}
            <a
              href={`mailto:jelenalazictattoo@gmail.com?subject=${encodeURIComponent(t('emailSubject'))}&body=${encodeURIComponent(t('emailBody'))}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 font-nav font-semibold hover:text-accent transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z" />
              </svg>
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
