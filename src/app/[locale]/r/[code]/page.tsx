// jela-website/src/app/[locale]/r/[code]/page.tsx
// Public landing page opened by scanning a referral QR code.

import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getServiceClient } from '@/lib/supabase-server'
import { Referrer } from '@/lib/referral'
import ReferralBookingForm from '@/components/referral/ReferralBookingForm'
import MessengerIcon from '@/components/referral/MessengerIcon'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; code: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'referral' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    robots: { index: false, follow: false },
  }
}

// The heading font has no "%" glyph, so render that character in the body font
function renderWithPercent(text: string) {
  const parts = text.split('%')
  return parts.flatMap((part, i) =>
    i === 0
      ? [part]
      : [<span key={i} className="font-body font-extrabold">%</span>, part]
  )
}

async function findReferrer(code: string): Promise<Referrer | null> {
  const supabase = getServiceClient()
  const { data } = await supabase
    .from('referrers')
    .select('*')
    .eq('code', decodeURIComponent(code).trim().toUpperCase())
    .single()
  return (data as Referrer) ?? null
}

export default async function ReferralLandingPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>
}) {
  const { locale, code } = await params
  setRequestLocale(locale)
  const t = await getTranslations('referral')

  const referrer = await findReferrer(code)

  if (!referrer) {
    return (
      <div className="min-h-screen py-24">
        <div className="container mx-auto px-6 lg:px-8 max-w-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{t('invalidTitle')}</h1>
          <p className="text-lg text-foreground/70 mb-8">{t('invalidText')}</p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 bg-accent text-white font-nav font-semibold rounded-md hover:bg-accent/90 transition-all duration-200"
          >
            {t('invalidCta')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6 lg:px-8 max-w-2xl">
        <div className="text-center mb-12">
          <p className="text-sm font-nav uppercase tracking-widest text-accent mb-3">
            {t('badge', { name: referrer.name })}
          </p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{renderWithPercent(t('title'))}</h1>
          <p className="text-lg text-foreground/70">{t('subtitle')}</p>
          <div className="w-24 h-1 bg-accent mx-auto mt-6" />
        </div>

        <div className="p-6 md:p-8 bg-foreground/5 rounded-lg border border-border mb-10">
          <p className="text-center text-foreground/80 font-body mb-2">{t('codeLabel')}</p>
          <p className="text-center text-3xl font-bold tracking-widest text-accent mb-0">{referrer.code}</p>
        </div>

        <h2 className="text-2xl font-heading font-bold mb-6">{t('formTitle')}</h2>
        <ReferralBookingForm code={referrer.code} />

        <div className="mt-12 pt-10 border-t border-border text-center">
          <h2 className="text-2xl font-heading font-bold mb-2">{t('orMessageTitle')}</h2>
          <p className="text-foreground/70 font-body mb-6">{t('orMessageText')}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/381615849416?text=${encodeURIComponent(t('messagePrefill', { code: referrer.code }))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 font-nav font-semibold hover:text-accent transition-all duration-200"
            >
              <MessengerIcon name="whatsapp" />
              WhatsApp
            </a>
            <a
              href="https://t.me/+381615849416"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 font-nav font-semibold hover:text-accent transition-all duration-200"
            >
              <MessengerIcon name="telegram" />
              Telegram
            </a>
            <a
              href="viber://chat?number=%2B381615849416"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 font-nav font-semibold hover:text-accent transition-all duration-200"
            >
              <MessengerIcon name="viber" />
              Viber
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
