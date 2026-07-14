// jela-website/src/app/api/referral/book/route.ts
// POST: public booking request from the /r/[code] landing page.
// Stores a pending referral and notifies Jelena by email.

import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase-server'
import { Referrer } from '@/lib/referral'
import { referralEmails } from '@/lib/referral-emails'
import { getResendClient, EMAIL_CONFIG } from '@/lib/resend'

export async function POST(request: NextRequest) {
  let body: {
    code?: string
    fullName?: string
    email?: string
    phone?: string
    message?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const code = body.code?.trim().toUpperCase()
  const fullName = body.fullName?.trim()
  const email = body.email?.trim() || null
  const phone = body.phone?.trim() || null
  const message = body.message?.trim() || null

  if (!code || !fullName || fullName.length > 200) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (!email && !phone) {
    return NextResponse.json({ error: 'Contact required' }, { status: 400 })
  }
  if ((message?.length ?? 0) > 5000 || (email?.length ?? 0) > 320 || (phone?.length ?? 0) > 50) {
    return NextResponse.json({ error: 'Input too long' }, { status: 400 })
  }

  const supabase = getServiceClient()

  const { data: referrer, error: refError } = await supabase
    .from('referrers')
    .select('*')
    .eq('code', code)
    .single()

  if (refError || !referrer) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 404 })
  }

  const { error: insertError } = await supabase.from('referrals').insert({
    referrer_id: (referrer as Referrer).id,
    friend_name: fullName,
    friend_email: email,
    friend_phone: phone,
    message,
  })

  if (insertError) {
    console.error('Booking insert error:', insertError)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  // Notify Jelena; the booking is stored even if the email fails
  try {
    const resend = getResendClient()
    const template = referralEmails.bookingReceived({
      friendName: fullName,
      friendEmail: email ?? undefined,
      friendPhone: phone ?? undefined,
      message: message ?? undefined,
      referrerName: (referrer as Referrer).name,
      code,
    })
    await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [EMAIL_CONFIG.artistEmail],
      reply_to: email ?? undefined,
      subject: template.subject,
      html: template.html,
    })
  } catch (e) {
    console.error('Booking notification email error:', e)
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
