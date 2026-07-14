// jela-website/src/app/api/admin/redeem/route.ts
// POST: mark all of a referrer's active credits as used
// (called when the client spends their balance in the studio).

import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'
import { getServiceClient } from '@/lib/supabase-server'
import { creditBalance, Referral } from '@/lib/referral'

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  let body: { referrerId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
  if (!body.referrerId) {
    return NextResponse.json({ error: 'Missing referrerId' }, { status: 400 })
  }

  const supabase = getServiceClient()

  const { data: referrals, error: fetchError } = await supabase
    .from('referrals')
    .select('*')
    .eq('referrer_id', body.referrerId)

  if (fetchError) {
    console.error('Redeem fetch error:', fetchError)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  const now = new Date()
  const active = ((referrals ?? []) as Referral[]).filter((r) =>
    r.status === 'completed' &&
    r.credit_status === 'active' &&
    r.credit_expires_at !== null &&
    new Date(r.credit_expires_at) > now
  )

  if (active.length === 0) {
    return NextResponse.json({ error: 'Nema aktivnih popusta za ovog klijenta' }, { status: 409 })
  }

  const redeemedEur = creditBalance(active, now)

  const { error: updateError } = await supabase
    .from('referrals')
    .update({ credit_status: 'used', used_at: now.toISOString() })
    .in('id', active.map((r) => r.id))

  if (updateError) {
    console.error('Redeem update error:', updateError)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json({ redeemedEur, count: active.length })
}
