// jela-website/src/app/api/admin/referrals/complete/route.ts
// POST: mark a pending referral as completed with the tattoo price.
// Computes the 10% credit, sets its 3-year expiry and emails the referrer.

import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'
import { getServiceClient } from '@/lib/supabase-server'
import { CREDIT_PERCENT, CREDIT_VALID_YEARS, creditBalance, Referral, Referrer } from '@/lib/referral'
import { referralEmails } from '@/lib/referral-emails'
import { getResendClient, EMAIL_CONFIG } from '@/lib/resend'

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  let body: { referralId?: string; priceEur?: number }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { referralId } = body
  const priceEur = Number(body.priceEur)
  if (!referralId || !Number.isFinite(priceEur) || priceEur <= 0 || priceEur > 100000) {
    return NextResponse.json({ error: 'Neispravna cena' }, { status: 400 })
  }

  const supabase = getServiceClient()

  const { data: referral, error: fetchError } = await supabase
    .from('referrals')
    .select('*, referrers(*)')
    .eq('id', referralId)
    .single()

  if (fetchError || !referral) {
    return NextResponse.json({ error: 'Prijava nije pronađena' }, { status: 404 })
  }
  if (referral.status !== 'pending') {
    return NextResponse.json({ error: 'Prijava je već obrađena' }, { status: 409 })
  }

  const creditEur = Math.round(priceEur * CREDIT_PERCENT) / 100
  const completedAt = new Date()
  const expiresAt = new Date(completedAt)
  expiresAt.setFullYear(expiresAt.getFullYear() + CREDIT_VALID_YEARS)

  const { data: updated, error: updateError } = await supabase
    .from('referrals')
    .update({
      status: 'completed',
      tattoo_price_eur: priceEur,
      credit_eur: creditEur,
      credit_status: 'active',
      credit_expires_at: expiresAt.toISOString(),
      completed_at: completedAt.toISOString(),
    })
    .eq('id', referralId)
    .eq('status', 'pending')
    .select()
    .single()

  if (updateError || !updated) {
    console.error('Complete referral error:', updateError)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  const referrer = referral.referrers as Referrer

  // New balance = all active credits of this referrer
  const { data: allReferrals } = await supabase
    .from('referrals')
    .select('*')
    .eq('referrer_id', referrer.id)
  const balanceEur = creditBalance((allReferrals ?? []) as Referral[])

  let emailSent = true
  try {
    const resend = getResendClient()
    const template = referralEmails.creditEarned({
      name: referrer.name,
      friendName: referral.friend_name,
      creditEur,
      balanceEur,
      expiresAt: expiresAt.toISOString(),
      secret: referrer.secret,
    })
    const { error: emailError } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [referrer.email],
      subject: template.subject,
      html: template.html,
    })
    if (emailError) {
      console.error('Credit email error:', emailError)
      emailSent = false
    }
  } catch (e) {
    console.error('Credit email error:', e)
    emailSent = false
  }

  return NextResponse.json({ referral: updated, creditEur, balanceEur, emailSent })
}
