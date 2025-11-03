import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ThemeProvider } from '@/components/layout/ThemeProvider'

// FreedoomedDemo - Headings and logo
const freedoomed = localFont({
  src: '../../public/fonts/FreedoomedDemo.woff2',
  variable: '--font-heading',
  display: 'swap',
})

// Agency - Navigation
const agency = localFont({
  src: '../../public/fonts/Agency.woff2',
  variable: '--font-nav',
  display: 'swap',
})

// Montserrat - Body text (all weights)
const montserrat = localFont({
  src: [
    {
      path: '../../public/fonts/MontserratThin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/MontserratThinItalic.woff2',
      weight: '100',
      style: 'italic',
    },
    {
      path: '../../public/fonts/MontserratRegular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/MontserratItalic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/MontserratMedium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/MontserratSemibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/MontserratSemiboldItalic.woff2',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../../public/fonts/MontserratBold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/MontserratBoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Jelena Lazić - Professional Tattoo Artist | Custom Designs',
  description: 'Academic painter and professional tattoo artist in Belgrade. Custom tattoo designs combining artistic excellence with technical mastery since 2013.',
  keywords: 'tattoo artist Belgrade, custom tattoo, realistic tattoo, tattoo Serbia, Jelena Lazić',
  openGraph: {
    title: 'Jelena Lazić - Professional Tattoo Artist',
    description: 'Custom tattoo designs in Belgrade by academic painter Jelena Lazić',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${freedoomed.variable} ${agency.variable} ${montserrat.variable}`}>
        <ThemeProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}