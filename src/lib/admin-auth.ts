// jela-website/src/lib/admin-auth.ts
// Verifies that an admin API request comes from Jelena (logged in via Supabase Auth).

import { NextRequest } from 'next/server'
import { getServiceClient } from './supabase-server'

export async function verifyAdmin(request: NextRequest): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) {
    return { ok: false, error: 'ADMIN_EMAIL is not configured', status: 500 }
  }

  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) {
    return { ok: false, error: 'Not authenticated', status: 401 }
  }

  const supabase = getServiceClient()
  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user?.email) {
    return { ok: false, error: 'Invalid session', status: 401 }
  }

  if (data.user.email.toLowerCase() !== adminEmail.toLowerCase()) {
    return { ok: false, error: 'Not authorized', status: 403 }
  }

  return { ok: true }
}
