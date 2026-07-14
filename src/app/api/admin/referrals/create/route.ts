// jela-website/src/app/api/admin/referrals/create/route.ts
// POST: manually add a pending referral (friend booked via WhatsApp/Telegram
// instead of the landing-page form).

import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'
import { getServiceClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  let body: { referrerId?: string; friendName?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const friendName = body.friendName?.trim()
  if (!body.referrerId || !friendName || friendName.length > 200) {
    return NextResponse.json({ error: 'Missing referrerId or friendName' }, { status: 400 })
  }

  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('referrals')
    .insert({ referrer_id: body.referrerId, friend_name: friendName })
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Klijent nije pronađen' }, { status: 404 })
  }

  return NextResponse.json({ referral: data }, { status: 201 })
}
