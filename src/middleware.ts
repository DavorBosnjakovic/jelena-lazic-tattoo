import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const { pathname } = request.nextUrl

  // Admin subdomain (admin.<domain>): serve the admin app at its root
  if (host.startsWith('admin.')) {
    if (!pathname.startsWith('/admin')) {
      const url = request.nextUrl.clone()
      url.pathname = `/admin${pathname === '/' ? '' : pathname}`
      return NextResponse.rewrite(url)
    }
    return NextResponse.next()
  }

  // /admin opened on the main domain: send to the subdomain in production,
  // allow directly in local development (no subdomains on localhost)
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const adminHost = process.env.ADMIN_HOST
    if (adminHost && !host.startsWith('localhost') && !host.startsWith('127.0.0.1')) {
      return NextResponse.redirect(`https://${adminHost}/`)
    }
    return NextResponse.next()
  }

  return intlMiddleware(request)
}

export const config = {
  // Match all pathnames except API routes, Next internals, and static files (anything with a dot)
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
}
