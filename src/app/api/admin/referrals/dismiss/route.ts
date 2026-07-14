// jela-website/src/app/api/admin/referrals/dismiss/route.ts
// POST: dismiss a pending referral (person never showed up / spam).

import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'
import { getServiceClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  let body: { referralId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
  if (!body.referralId) {
    return NextResponse.json({ error: 'Missing referralId' }, { status: 400 })
  }

  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('referrals')
    .update({ status: 'dismissed' })
    .eq('id', body.referralId)
    .eq('status', 'pending')
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Prijava nije pronađena ili je već obrađena' }, { status: 404 })
  }

  return NextResponse.json({ referral: data })
}
