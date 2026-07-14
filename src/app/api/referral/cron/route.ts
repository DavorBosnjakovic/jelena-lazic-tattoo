// jela-website/src/app/api/referral/cron/route.ts
// Monthly cron (see vercel.json): emails clients whose credits expire
// within the next 60 days. Each credit is reminded only once.

import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase-server'
import { creditBalance, Referral, Referrer } from '@/lib/referral'
import { referralEmails } from '@/lib/referral-emails'
import { getResendClient, EMAIL_CONFIG } from '@/lib/resend'

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getServiceClient()
  const now = new Date()
  const soon = new Date(now)
  soon.setDate(soon.getDate() + 60)

  const { data, error } = await supabase
    .from('referrals')
    .select('*, referrers(*)')
    .eq('status', 'completed')
    .eq('credit_status', 'active')
    .eq('reminder_sent', false)
    .gt('credit_expires_at', now.toISOString())
    .lte('credit_expires_at', soon.toISOString())

  if (error) {
    console.error('Cron fetch error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  const expiring = (data ?? []) as (Referral & { referrers: Referrer })[]

  // Group per referrer so each person gets one email
  const byReferrer = new Map<string, { referrer: Referrer; credits: Referral[] }>()
  for (const r of expiring) {
    const entry = byReferrer.get(r.referrer_id) ?? { referrer: r.referrers, credits: [] }
    entry.credits.push(r)
    byReferrer.set(r.referrer_id, entry)
  }

  const resend = getResendClient()
  let sent = 0

  for (const { referrer, credits } of Array.from(byReferrer.values())) {
    const expiringEur = creditBalance(credits, now)
    // Earliest expiry date among this person's expiring credits
    const expiresAt = credits
      .map((c) => c.credit_expires_at!)
      .sort()[0]

    try {
      const template = referralEmails.expiryReminder({
        name: referrer.name,
        expiringEur,
        expiresAt,
        secret: referrer.secret,
      })
      const { error: emailError } = await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: [referrer.email],
        subject: template.subject,
        html: template.html,
      })
      if (emailError) {
        console.error('Reminder email error:', emailError)
        continue
      }
      await supabase
        .from('referrals')
        .update({ reminder_sent: true })
        .in('id', credits.map((c) => c.id))
      sent++
    } catch (e) {
      console.error('Reminder email error:', e)
    }
  }

  return NextResponse.json({ remindersSent: sent })
}
