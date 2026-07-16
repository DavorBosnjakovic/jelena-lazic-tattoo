// jela-website/src/app/[locale]/moj-kod/[secret]/page.tsx
// Private status page for a referrer - reached only via the secret link
// from their email. Shows balance, QR code and referral history.

import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getServiceClient } from '@/lib/supabase-server'
import {
  creditBalance,
  formatEur,
  isCreditActive,
  Referral,
  Referrer,
  referralLandingUrl,
} from '@/lib/referral'
import ShareLink from '@/components/referral/ShareLink'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; secret: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'referralStatus' })
  return {
    title: t('metaTitle'),
    robots: { index: false, follow: false },
  }
}

function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale === 'sr' ? 'sr-Latn-RS' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Belgrade',
  })
}

export default async function ReferralStatusPage({
  params,
}: {
  params: Promise<{ locale: string; secret: string }>
}) {
  const { locale, secret } = await params
  setRequestLocale(locale)
  const t = await getTranslations('referralStatus')

  const supabase = getServiceClient()
  const { data } = await supabase
    .from('referrers')
    .select('*, referrals(*)')
    .eq('secret', decodeURIComponent(secret))
    .single()

  if (!data) {
    return (
      <div className="min-h-screen py-24">
        <div className="container mx-auto px-6 lg:px-8 max-w-2xl text-center">
          <h1 className="text-4xl font-heading font-bold mb-4">{t('invalidTitle')}</h1>
          <p className="text-lg text-foreground/70">{t('invalidText')}</p>
        </div>
      </div>
    )
  }

  const referrer = data as Referrer & { referrals: Referral[] }
  const now = new Date()
  const referrals = referrer.referrals ?? []
  const balance = creditBalance(referrals, now)

  const completed = referrals
    .filter((r) => r.status === 'completed')
    .sort((a, b) => (b.completed_at ?? '').localeCompare(a.completed_at ?? ''))
  const pendingCount = referrals.filter((r) => r.status === 'pending').length
  const totalEarned = completed.reduce((sum, r) => sum + Number(r.credit_eur ?? 0), 0)

  // Earliest expiry among currently active credits
  const activeExpirations = completed
    .filter((r) => isCreditActive(r, now))
    .map((r) => r.credit_expires_at!)
    .sort()
  const nextExpiry = activeExpirations[0] ?? null

  const creditLabel = (r: Referral): string => {
    if (isCreditActive(r, now)) return t('creditActive')
    if (r.credit_status === 'used') return t('creditUsed')
    return t('creditExpired')
  }

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6 lg:px-8 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2">{t('title')}</h1>
          <p className="text-lg text-foreground/70">{t('greeting', { name: referrer.name })}</p>
          <div className="w-24 h-1 bg-accent mx-auto mt-6" />
        </div>

        {/* Balance */}
        <div className="p-8 bg-foreground/5 rounded-lg border border-border text-center mb-6">
          <p className="text-foreground/70 font-body mb-2">{t('balanceLabel')}</p>
          <p className="text-5xl font-bold text-accent mb-2">{formatEur(balance)}</p>
          {nextExpiry && (
            <p className="text-sm text-foreground/60">
              {t('expiresAt', { date: formatDate(nextExpiry, locale) })}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="p-5 bg-foreground/5 rounded-lg border border-border text-center">
            <p className="text-3xl font-bold">{completed.length}</p>
            <p className="text-sm text-foreground/70">{t('statReferrals')}</p>
          </div>
          <div className="p-5 bg-foreground/5 rounded-lg border border-border text-center">
            <p className="text-3xl font-bold">{formatEur(totalEarned)}</p>
            <p className="text-sm text-foreground/70">{t('statEarned')}</p>
          </div>
        </div>

        {/* QR + share */}
        <div className="p-6 md:p-8 bg-foreground/5 rounded-lg border border-border text-center mb-10">
          <h2 className="text-2xl font-heading font-bold mb-1">{t('shareTitle')}</h2>
          <p className="text-foreground/70 font-body mb-6">{t('shareText')}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/referral/qr?code=${encodeURIComponent(referrer.code)}`}
            alt={`QR ${referrer.code}`}
            width={220}
            height={220}
            className="mx-auto rounded-lg bg-white p-2 mb-4"
          />
          <p className="text-2xl font-bold tracking-widest text-accent mb-4">{referrer.code}</p>
          <ShareLink url={referralLandingUrl(referrer.code)} />
        </div>

        {/* History */}
        <h2 className="text-2xl font-heading font-bold mb-4">{t('historyTitle')}</h2>
        {pendingCount > 0 && (
          <p className="text-sm text-foreground/60 mb-4">
            {t('pendingNote', { count: pendingCount })}
          </p>
        )}
        {completed.length === 0 ? (
          <p className="text-foreground/70 font-body">{t('historyEmpty')}</p>
        ) : (
          <div className="space-y-3">
            {completed.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-4 bg-foreground/5 rounded-lg border border-border"
              >
                <div>
                  <p className="font-body font-semibold">{r.friend_name}</p>
                  <p className="text-sm text-foreground/60">
                    {r.completed_at ? formatDate(r.completed_at, locale) : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-accent">+{formatEur(Number(r.credit_eur ?? 0))}</p>
                  <p className="text-sm text-foreground/60">{creditLabel(r)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
