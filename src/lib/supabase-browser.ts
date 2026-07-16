// jela-website/src/lib/supabase-browser.ts
// Browser Supabase client (anon key) - used only for Jelena's admin login.
// All data goes through server API routes; the anon key has no table access.

import { createClient, SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function getBrowserClient(): SupabaseClient {
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  client = createClient(url, anonKey)
  return client
}
