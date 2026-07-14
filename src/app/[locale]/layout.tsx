import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { routing } from '@/i18n/routing'

// FreedoomedDemo - Headings and logo
const freedoomed = localFont({
  src: '../../../public/fonts/FreedoomedDemo.woff2',
  variable: '--font-heading',
  display: 'swap',
})

// Agency - Navigation
const agency = localFont({
  src: '../../../public/fonts/Agency.woff2',
  variable: '--font-nav',
  display: 'swap',
})

// Montserrat - Body text (only weights actually used: 400/500/600/700 normal)
const montserrat = localFont({
  src: [
    {
      path: '../../../public/fonts/MontserratRegular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/MontserratMedium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/MontserratSemibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/MontserratBold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-body',
  display: 'swap',
})

const OG_LOCALES: Record<string, string> = { en: 'en_US', sr: 'sr_RS' }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    metadataBase: new URL('https://jelenalazictattoo.com'),
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    alternates: {
      canonical: locale === routing.defaultLocale ? '/' : `/${locale}`,
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      type: 'website',
      locale: OG_LOCALES[locale],
      siteName: 'Jelena Lazić Tattoo',
      url: locale === routing.defaultLocale ? '/' : `/${locale}`,
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Jelena Lazić - Professional Tattoo Artist, Belgrade',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: ['/og-image.jpg'],
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${freedoomed.variable} ${agency.variable} ${montserrat.variable}`}>
        <NextIntlClientProvider>
          <ThemeProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
