// jela-website/src/components/admin/AdminDashboard.tsx
// Jelena's admin panel for the referral program. Mobile-first, Serbian.

'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getBrowserClient } from '@/lib/supabase-browser'
import { creditBalance, formatEur, isCreditActive, Referral, Referrer } from '@/lib/referral'

type ReferrerWithReferrals = Referrer & { referrals: Referral[] }

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('sr-Latn-RS', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Europe/Belgrade',
  })
}

export default function AdminDashboard() {
  const [session, setSession] = useState<Session | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [referrers, setReferrers] = useState<ReferrerWithReferrals[]>([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [tab, setTab] = useState<'prijave' | 'klijenti'>('prijave')
  const [toast, setToast] = useState('')
  const [showNewForm, setShowNewForm] = useState(false)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  // --- auth ---
  useEffect(() => {
    const supabase = getBrowserClient()
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthChecked(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  const authFetch = useCallback(
    async (url: string, init?: RequestInit) => {
      const token = session?.access_token
      return fetch(url, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(init?.headers ?? {}),
        },
      })
    },
    [session]
  )

  const loadData = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const res = await authFetch('/api/admin/referrers')
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Greška pri učitavanju')
      }
      const body = await res.json()
      setReferrers(body.referrers ?? [])
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Greška pri učitavanju')
    }
    setLoading(false)
  }, [authFetch])

  useEffect(() => {
    if (session) loadData()
  }, [session, loadData])

  if (!authChecked) {
    return <Centered><p className="text-foreground/60">Učitavanje...</p></Centered>
  }

  if (!session) {
    return <LoginScreen />
  }

  const pending = referrers
    .flatMap((ref) =>
      (ref.referrals ?? [])
        .filter((r) => r.status === 'pending')
        .map((r) => ({ referral: r, referrer: ref }))
    )
    .sort((a, b) => b.referral.created_at.localeCompare(a.referral.created_at))

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold">
            Referal <span className="text-accent">program</span>
          </h1>
          <button
            onClick={() => getBrowserClient().auth.signOut()}
            className="text-sm text-foreground/60 hover:text-foreground"
          >
            Odjava
          </button>
        </div>
        {/* Tabs */}
        <div className="max-w-lg mx-auto px-4 flex gap-2 pb-3">
          <TabButton active={tab === 'prijave'} onClick={() => setTab('prijave')}>
            Prijave{pending.length > 0 ? ` (${pending.length})` : ''}
          </TabButton>
          <TabButton active={tab === 'klijenti'} onClick={() => setTab('klijenti')}>
            Klijenti ({referrers.length})
          </TabButton>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {loadError && (
          <div className="mb-4 p-4 rounded-md bg-red-900/20 text-red-200 text-sm">
            {loadError}{' '}
            <button onClick={loadData} className="underline">Pokušaj ponovo</button>
          </div>
        )}
        {loading && referrers.length === 0 && !loadError && (
          <p className="text-foreground/60 text-center py-8">Učitavanje...</p>
        )}

        {tab === 'prijave' && (
          <PendingTab
            pending={pending}
            authFetch={authFetch}
            onChanged={() => { loadData(); showToast('Sačuvano ✓') }}
            showToast={showToast}
          />
        )}

        {tab === 'klijenti' && (
          <ClientsTab
            referrers={referrers}
            authFetch={authFetch}
            onChanged={() => loadData()}
            showToast={showToast}
          />
        )}
      </main>

      {/* New code button */}
      <button
        onClick={() => setShowNewForm(true)}
        className="fixed bottom-6 right-6 px-6 py-4 bg-accent text-white font-nav font-bold text-lg rounded-full shadow-lg hover:bg-accent/90 transition-all"
      >
        + Novi kod
      </button>

      {showNewForm && (
        <NewReferrerModal
          authFetch={authFetch}
          onClose={() => setShowNewForm(false)}
          onCreated={(msg) => {
            setShowNewForm(false)
            loadData()
            showToast(msg)
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-5 py-3 bg-foreground text-background rounded-full text-sm font-semibold shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  )
}

// ---------- helpers ----------

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex items-center justify-center px-4">{children}</div>
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 rounded-md font-nav font-semibold transition-colors ${
        active ? 'bg-accent text-white' : 'bg-foreground/5 text-foreground/70 hover:bg-foreground/10'
      }`}
    >
      {children}
    </button>
  )
}

// ---------- login ----------

function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error } = await getBrowserClient().auth.signInWithPassword({ email, password })
    if (error) setError('Pogrešan email ili lozinka')
    setBusy(false)
  }

  return (
    <Centered>
      <form onSubmit={login} className="w-full max-w-sm space-y-4">
        <h1 className="text-3xl font-heading font-bold text-center mb-8">
          Jelena <span className="text-accent">Admin</span>
        </h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="username"
          required
          className="w-full px-4 py-3 rounded-md border-2 border-border bg-background text-foreground focus:border-accent focus:outline-none"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Lozinka"
          autoComplete="current-password"
          required
          className="w-full px-4 py-3 rounded-md border-2 border-border bg-background text-foreground focus:border-accent focus:outline-none"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full px-6 py-3 bg-accent text-white font-nav font-semibold rounded-md hover:bg-accent/90 disabled:opacity-50"
        >
          {busy ? 'Prijavljivanje...' : 'Prijavi se'}
        </button>
      </form>
    </Centered>
  )
}

// ---------- pending tab ----------

type AuthFetch = (url: string, init?: RequestInit) => Promise<Response>

function PendingTab({
  pending,
  authFetch,
  onChanged,
  showToast,
}: {
  pending: { referral: Referral; referrer: Referrer }[]
  authFetch: AuthFetch
  onChanged: () => void
  showToast: (msg: string) => void
}) {
  if (pending.length === 0) {
    return (
      <p className="text-foreground/60 text-center py-8">
        Nema prijava koje čekaju. Kad neko pošalje upit preko koda, pojaviće se ovde.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {pending.map(({ referral, referrer }) => (
        <PendingCard
          key={referral.id}
          referral={referral}
          referrer={referrer}
          authFetch={authFetch}
          onChanged={onChanged}
          showToast={showToast}
        />
      ))}
    </div>
  )
}

function PendingCard({
  referral,
  referrer,
  authFetch,
  onChanged,
  showToast,
}: {
  referral: Referral
  referrer: Referrer
  authFetch: AuthFetch
  onChanged: () => void
  showToast: (msg: string) => void
}) {
  const [price, setPrice] = useState('')
  const [completing, setCompleting] = useState(false)
  const [busy, setBusy] = useState(false)

  const complete = async () => {
    const priceEur = Number(price.replace(',', '.'))
    if (!Number.isFinite(priceEur) || priceEur <= 0) {
      showToast('Unesi ispravnu cenu')
      return
    }
    setBusy(true)
    const res = await authFetch('/api/admin/referrals/complete', {
      method: 'POST',
      body: JSON.stringify({ referralId: referral.id, priceEur }),
    })
    setBusy(false)
    if (res.ok) {
      const body = await res.json()
      showToast(`${referrer.name} je dobio/la ${formatEur(body.creditEur)} kredita ✓`)
      onChanged()
    } else {
      const body = await res.json().catch(() => ({}))
      showToast(body.error || 'Greška — pokušaj ponovo')
    }
  }

  const dismiss = async () => {
    if (!window.confirm(`Odbaciti prijavu "${referral.friend_name}"? Neće doneti kredit.`)) return
    setBusy(true)
    const res = await authFetch('/api/admin/referrals/dismiss', {
      method: 'POST',
      body: JSON.stringify({ referralId: referral.id }),
    })
    setBusy(false)
    if (res.ok) onChanged()
    else showToast('Greška — pokušaj ponovo')
  }

  return (
    <div className="p-4 bg-foreground/5 rounded-lg border border-border">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="font-bold text-lg">{referral.friend_name}</p>
          <p className="text-sm text-foreground/60">
            preko: <span className="text-accent font-semibold">{referrer.name}</span> ({referrer.code})
          </p>
        </div>
        <p className="text-xs text-foreground/50 whitespace-nowrap">{formatDate(referral.created_at)}</p>
      </div>

      <div className="text-sm text-foreground/80 space-y-1 mb-4">
        {referral.friend_email && (
          <p><a className="underline" href={`mailto:${referral.friend_email}`}>{referral.friend_email}</a></p>
        )}
        {referral.friend_phone && (
          <p><a className="underline" href={`tel:${referral.friend_phone}`}>{referral.friend_phone}</a></p>
        )}
        {referral.message && <p className="text-foreground/60 whitespace-pre-wrap">{referral.message}</p>}
      </div>

      {completing ? (
        <div className="space-y-3">
          <label className="block text-sm font-semibold">
            Cena tetovaže (pre popusta), u evrima:
            <input
              type="number"
              inputMode="decimal"
              min="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="npr. 150"
              className="mt-1 w-full px-4 py-3 rounded-md border-2 border-border bg-background text-foreground focus:border-accent focus:outline-none"
              autoFocus
            />
          </label>
          {price && Number(price.replace(',', '.')) > 0 && (
            <p className="text-sm text-foreground/70">
              → {referrer.name} dobija{' '}
              <span className="text-accent font-bold">
                {formatEur(Math.round(Number(price.replace(',', '.')) * 10) / 100)}
              </span>{' '}
              kredita
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={complete}
              disabled={busy}
              className="flex-1 px-4 py-3 bg-accent text-white font-nav font-semibold rounded-md hover:bg-accent/90 disabled:opacity-50"
            >
              {busy ? 'Čuvanje...' : 'Potvrdi'}
            </button>
            <button
              onClick={() => setCompleting(false)}
              disabled={busy}
              className="px-4 py-3 border-2 border-border rounded-md font-nav font-semibold"
            >
              Nazad
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => setCompleting(true)}
            className="flex-1 px-4 py-3 bg-accent text-white font-nav font-semibold rounded-md hover:bg-accent/90"
          >
            Tetovaža obavljena
          </button>
          <button
            onClick={dismiss}
            disabled={busy}
            className="px-4 py-3 border-2 border-border rounded-md font-nav font-semibold text-foreground/60 hover:text-foreground"
          >
            Odbaci
          </button>
        </div>
      )}
    </div>
  )
}

// ---------- clients tab ----------

function ClientsTab({
  referrers,
  authFetch,
  onChanged,
  showToast,
}: {
  referrers: ReferrerWithReferrals[]
  authFetch: AuthFetch
  onChanged: () => void
  showToast: (msg: string) => void
}) {
  const [search, setSearch] = useState('')

  const filtered = referrers.filter((r) => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.code.toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Pretraži po imenu, emailu ili kodu..."
        className="w-full px-4 py-3 mb-4 rounded-md border-2 border-border bg-background text-foreground focus:border-accent focus:outline-none"
      />
      {filtered.length === 0 ? (
        <p className="text-foreground/60 text-center py-8">
          {referrers.length === 0
            ? 'Još nema klijenata. Klikni "+ Novi kod" da kreiraš prvi.'
            : 'Nema rezultata pretrage.'}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <ClientCard
              key={r.id}
              referrer={r}
              authFetch={authFetch}
              onChanged={onChanged}
              showToast={showToast}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ClientCard({
  referrer,
  authFetch,
  onChanged,
  showToast,
}: {
  referrer: ReferrerWithReferrals
  authFetch: AuthFetch
  onChanged: () => void
  showToast: (msg: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  const now = new Date()
  const referrals = referrer.referrals ?? []
  const balance = creditBalance(referrals, now)
  const completed = referrals
    .filter((r) => r.status === 'completed')
    .sort((a, b) => (b.completed_at ?? '').localeCompare(a.completed_at ?? ''))

  const redeem = async () => {
    if (!window.confirm(`Označiti ${formatEur(balance)} kao iskorišćeno za ${referrer.name}?`)) return
    setBusy(true)
    const res = await authFetch('/api/admin/redeem', {
      method: 'POST',
      body: JSON.stringify({ referrerId: referrer.id }),
    })
    setBusy(false)
    if (res.ok) {
      const body = await res.json()
      showToast(`Iskorišćeno ${formatEur(body.redeemedEur)} ✓`)
      onChanged()
    } else {
      const body = await res.json().catch(() => ({}))
      showToast(body.error || 'Greška — pokušaj ponovo')
    }
  }

  const copyLanding = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin.replace(/^https?:\/\/admin\./, 'https://')}/sr/r/${referrer.code}`)
      showToast('Link kopiran ✓')
    } catch {
      showToast('Kopiranje nije uspelo')
    }
  }

  const addManual = async () => {
    const friendName = window.prompt(
      `Ko je došao preko koda ${referrer.code}? Upiši ime:\n(za prijave koje su stigle porukom, mimo sajta)`
    )?.trim()
    if (!friendName) return
    setBusy(true)
    const res = await authFetch('/api/admin/referrals/create', {
      method: 'POST',
      body: JSON.stringify({ referrerId: referrer.id, friendName }),
    })
    setBusy(false)
    if (res.ok) {
      showToast(`Prijava "${friendName}" dodata — čeka u tabu Prijave ✓`)
      onChanged()
    } else {
      const body = await res.json().catch(() => ({}))
      showToast(body.error || 'Greška — pokušaj ponovo')
    }
  }

  const creditLabel = (r: Referral): string => {
    if (isCreditActive(r, now)) return `aktivan do ${r.credit_expires_at ? formatDate(r.credit_expires_at) : ''}`
    if (r.credit_status === 'used') return `iskorišćen ${r.used_at ? formatDate(r.used_at) : ''}`
    return 'istekao'
  }

  return (
    <div className="bg-foreground/5 rounded-lg border border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div>
          <p className="font-bold">{referrer.name}</p>
          <p className="text-sm text-foreground/60">{referrer.code}</p>
        </div>
        <div className="text-right">
          <p className={`font-bold ${balance > 0 ? 'text-accent' : 'text-foreground/40'}`}>
            {formatEur(balance)}
          </p>
          <p className="text-xs text-foreground/50">{completed.length} preporuka</p>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-border pt-4 space-y-4">
          <p className="text-sm text-foreground/70">{referrer.email}</p>

          {balance > 0 && (
            <button
              onClick={redeem}
              disabled={busy}
              className="w-full px-4 py-3 bg-accent text-white font-nav font-semibold rounded-md hover:bg-accent/90 disabled:opacity-50"
            >
              {busy ? 'Čuvanje...' : `Saldo iskorišćen (${formatEur(balance)})`}
            </button>
          )}

          <button
            onClick={copyLanding}
            className="w-full px-4 py-3 border-2 border-border rounded-md font-nav font-semibold hover:border-accent"
          >
            Kopiraj link za deljenje
          </button>

          <button
            onClick={addManual}
            disabled={busy}
            className="w-full px-4 py-3 border-2 border-border rounded-md font-nav font-semibold hover:border-accent disabled:opacity-50"
          >
            + Dodaj prijavu ručno
          </button>

          {completed.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2">Istorija preporuka:</p>
              <div className="space-y-2">
                {completed.map((r) => (
                  <div key={r.id} className="flex justify-between text-sm">
                    <span className="text-foreground/80">{r.friend_name}</span>
                    <span className="text-foreground/60">
                      +{formatEur(Number(r.credit_eur ?? 0))} · {creditLabel(r)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ---------- new referrer modal ----------

function NewReferrerModal({
  authFetch,
  onClose,
  onCreated,
}: {
  authFetch: AuthFetch
  onClose: () => void
  onCreated: (msg: string) => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const res = await authFetch('/api/admin/referrers', {
      method: 'POST',
      body: JSON.stringify({ name, email }),
    })
    setBusy(false)
    if (res.ok) {
      const body = await res.json()
      onCreated(
        body.emailSent
          ? `Kod ${body.referrer.code} kreiran, email poslat ✓`
          : `Kod ${body.referrer.code} kreiran, ali email NIJE poslat!`
      )
    } else {
      const body = await res.json().catch(() => ({}))
      setError(body.error || 'Greška — pokušaj ponovo')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-background border border-border rounded-lg p-6 space-y-4"
      >
        <h2 className="text-xl font-heading font-bold">Novi kod za klijenta</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ime klijenta"
          required
          autoFocus
          className="w-full px-4 py-3 rounded-md border-2 border-border bg-background text-foreground focus:border-accent focus:outline-none"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email klijenta"
          required
          className="w-full px-4 py-3 rounded-md border-2 border-border bg-background text-foreground focus:border-accent focus:outline-none"
        />
        <p className="text-xs text-foreground/50">
          Klijentu odmah stiže email sa QR kodom i njegovim ličnim linkom.
        </p>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={busy}
            className="flex-1 px-4 py-3 bg-accent text-white font-nav font-semibold rounded-md hover:bg-accent/90 disabled:opacity-50"
          >
            {busy ? 'Kreiranje...' : 'Kreiraj i pošalji'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="px-4 py-3 border-2 border-border rounded-md font-nav font-semibold"
          >
            Otkaži
          </button>
        </div>
      </form>
    </div>
  )
}
