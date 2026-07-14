// jela-website/src/lib/referral.ts
// Shared types, constants and helpers for the referral program.

import { randomBytes } from 'crypto'

export const CREDIT_PERCENT = 10
export const CREDIT_VALID_YEARS = 3

export type Referrer = {
  id: string
  name: string
  email: string
  code: string
  secret: string
  created_at: string
}

export type Referral = {
  id: string
  referrer_id: string
  friend_name: string
  friend_email: string | null
  friend_phone: string | null
  message: string | null
  status: 'pending' | 'completed' | 'dismissed'
  tattoo_price_eur: number | null
  credit_eur: number | null
  credit_status: 'active' | 'used' | null
  credit_expires_at: string | null
  reminder_sent: boolean
  created_at: string
  completed_at: string | null
  used_at: string | null
}

// Unambiguous alphabet: no 0/O, 1/I/L to avoid misreading a printed code
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export function generateCode(): string {
  const bytes = randomBytes(4)
  let suffix = ''
  for (let i = 0; i < 4; i++) {
    suffix += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length]
  }
  return `JELA-${suffix}`
}

export function generateSecret(): string {
  return randomBytes(16).toString('hex')
}

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://jelenalazictattoo.com').replace(/\/$/, '')
}

// Links sent by email point to the Serbian version of the site
// (clients can switch language in the header)
export function referralLandingUrl(code: string): string {
  return `${getSiteUrl()}/sr/r/${encodeURIComponent(code)}`
}

export function referralStatusUrl(secret: string): string {
  return `${getSiteUrl()}/sr/moj-kod/${encodeURIComponent(secret)}`
}

export function qrImageUrl(code: string): string {
  return `${getSiteUrl()}/api/referral/qr?code=${encodeURIComponent(code)}`
}

// A credit is spendable if it exists, is still active and has not expired
export function isCreditActive(r: Referral, now = new Date()): boolean {
  return (
    r.status === 'completed' &&
    r.credit_status === 'active' &&
    r.credit_eur !== null &&
    r.credit_expires_at !== null &&
    new Date(r.credit_expires_at) > now
  )
}

export function creditBalance(referrals: Referral[], now = new Date()): number {
  return referrals
    .filter((r) => isCreditActive(r, now))
    .reduce((sum, r) => sum + Number(r.credit_eur), 0)
}

export function formatEur(amount: number): string {
  const rounded = Math.round(amount * 100) / 100
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(2)} €`
}

export function formatDateSr(iso: string): string {
  return new Date(iso).toLocaleDateString('sr-Latn-RS', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Belgrade',
  })
}
