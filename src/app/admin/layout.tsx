// jela-website/src/app/admin/layout.tsx
// Standalone root layout for the admin app (served on the admin subdomain).
// Serbian only, dark theme, installable on a phone home screen (PWA).

import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import '../[locale]/globals.css'

const montserrat = localFont({
  src: [
    { path: '../../../public/fonts/MontserratRegular.woff2', weight: '400', style: 'normal' },
    { path: '../../../public/fonts/MontserratMedium.woff2', weight: '500', style: 'normal' },
    { path: '../../../public/fonts/MontserratSemibold.woff2', weight: '600', style: 'normal' },
    { path: '../../../public/fonts/MontserratBold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
})

const freedoomed = localFont({
  src: '../../../public/fonts/FreedoomedDemo.woff2',
  variable: '--font-heading',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Jelena Admin',
  description: 'Referal program - admin panel',
  manifest: '/admin-manifest.json',
  robots: { index: false, follow: false },
  icons: {
    apple: '/admin-icon-192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Jelena Admin',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr" className="dark" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${freedoomed.variable} font-body`}>
        {children}
      </body>
    </html>
  )
}
