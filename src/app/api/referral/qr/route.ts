// jela-website/src/app/api/referral/qr/route.ts
// GET ?code=JELA-XXXX -> PNG image of the QR code pointing to the landing page.
// Used both in emails and on the status page.

import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { getServiceClient } from '@/lib/supabase-server'
import { referralLandingUrl } from '@/lib/referral'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')?.trim().toUpperCase()
  if (!code || !/^[A-Z0-9-]{4,20}$/.test(code)) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
  }

  // Only render QR codes for codes that actually exist
  const supabase = getServiceClient()
  const { data: referrer } = await supabase
    .from('referrers')
    .select('id')
    .eq('code', code)
    .single()

  if (!referrer) {
    return NextResponse.json({ error: 'Unknown code' }, { status: 404 })
  }

  const png = await QRCode.toBuffer(referralLandingUrl(code), {
    type: 'png',
    width: 440,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: { dark: '#1a1a1a', light: '#ffffff' },
  })

  return new NextResponse(new Uint8Array(png), {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  })
}
