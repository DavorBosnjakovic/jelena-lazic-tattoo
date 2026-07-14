// jela-website/src/app/api/admin/referrers/route.ts
// GET: list all referrers with their referrals (for balances)
// POST: create a new referrer, generate code + secret, email them the QR code

import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'
import { getServiceClient } from '@/lib/supabase-server'
import { generateCode, generateSecret, Referral, Referrer } from '@/lib/referral'
import { referralEmails } from '@/lib/referral-emails'
import { getResendClient, EMAIL_CONFIG } from '@/lib/resend'

export async function GET(request: NextRequest) {
  const auth = await verifyAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('referrers')
    .select('*, referrals(*)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('List referrers error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json({ referrers: data as (Referrer & { referrals: Referral[] })[] })
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  let body: { name?: string; email?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const name = body.name?.trim()
  const email = body.email?.trim().toLowerCase()
  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Ime i ispravan email su obavezni' }, { status: 400 })
  }

  const supabase = getServiceClient()

  // Retry a few times in the (unlikely) case of a code collision
  let referrer: Referrer | null = null
  for (let attempt = 0; attempt < 5 && !referrer; attempt++) {
    const { data, error } = await supabase
      .from('referrers')
      .insert({ name, email, code: generateCode(), secret: generateSecret() })
      .select()
      .single()

    if (!error) {
      referrer = data as Referrer
    } else if (error.code !== '23505') {
      // not a unique violation -> real error
      console.error('Create referrer error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  }

  if (!referrer) {
    return NextResponse.json({ error: 'Could not generate a unique code' }, { status: 500 })
  }

  // Send the code email; if it fails, keep the referrer but report it
  let emailSent = true
  try {
    const resend = getResendClient()
    const template = referralEmails.codeCreated({
      name: referrer.name,
      code: referrer.code,
      secret: referrer.secret,
    })
    const { error: emailError } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [referrer.email],
      subject: template.subject,
      html: template.html,
    })
    if (emailError) {
      console.error('Code email error:', emailError)
      emailSent = false
    }
  } catch (e) {
    console.error('Code email error:', e)
    emailSent = false
  }

  return NextResponse.json({ referrer, emailSent }, { status: 201 })
}
