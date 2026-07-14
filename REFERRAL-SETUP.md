# Referal program — podešavanje (jednokratno)

Kod je gotov. Da bi sve proradilo, treba uraditi par stvari u Supabase i Vercel
kontrolnim tablama (na njih Claude nema pristup). Redom:

## 1. Napravi tabele u bazi (Supabase)

1. Otvori https://app.supabase.com i uđi u projekat sajta.
2. U levom meniju klikni **SQL Editor** → **New query**.
3. Otvori fajl `supabase/referral-schema.sql` iz ovog projekta, kopiraj CEO sadržaj,
   nalepi ga u editor i klikni **Run**.
4. Treba da piše "Success". To je to — tabele su napravljene i zaključane.

## 2. Napravi Jelenin nalog za admin panel

1. U Supabase, levi meni: **Authentication** → **Users** → **Add user** → **Create new user**.
2. Email: `jelenalazictattoo@gmail.com` (mora biti isti kao `ADMIN_EMAIL` u `.env.local`).
3. Lozinka: izmisli dobru lozinku i sačuvaj je — s njom se Jelena prijavljuje u admin.
4. Štikliraj **Auto Confirm User** ako postoji ta opcija, pa **Create user**.

Samo ovaj jedan nalog može da uđe u admin — čak i da neko drugi napravi nalog,
sistem ga odbija jer email nije `ADMIN_EMAIL`.

## 3. Ubaci tajni ključ baze u `.env.local`

1. U Supabase: **Settings** (zupčanik) → **API**.
2. Pod **Project API keys** nađi **service_role** ključ (piše "secret") i kopiraj ga.
3. U fajlu `jela-website/.env.local` zameni `PASTE_SERVICE_ROLE_KEY_HERE` tim ključem.
4. U istom fajlu zameni i `PASTE_ANY_LONG_RANDOM_STRING_HERE` (CRON_SECRET) bilo kojim
   dugačkim nasumičnim tekstom (nalupaj 30+ znakova).

**VAŽNO:** service_role ključ je tajna — ne šalje se nikome i ne ide na GitHub.
Koristi se samo na serveru.

## 4. Vercel — kad se sajt bude postavljao (deploy)

U Vercel projektu → **Settings** → **Environment Variables**, dodaj iste vrednosti
kao u `.env.local`:

| Ime | Vrednost |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | service_role ključ iz koraka 3 |
| `ADMIN_EMAIL` | `jelenalazictattoo@gmail.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://jelenalazictattoo.com` |
| `ADMIN_HOST` | `admin.jelenalazictattoo.com` |
| `CRON_SECRET` | isti nasumični tekst iz koraka 3 |

### Subdomena za admin

1. Vercel projekat → **Settings** → **Domains** → **Add** → upiši `admin.jelenalazictattoo.com`.
2. Vercel će reći koji DNS zapis treba (obično CNAME `admin` → `cname.vercel-dns.com`) —
   to se dodaje tamo gde je kupljen domen.
3. Posle toga admin radi na `https://admin.jelenalazictattoo.com`, a na glavnom sajtu
   `/admin` automatski preusmerava tamo.

### Mesečni podsetnik (cron)

Fajl `vercel.json` već kaže Vercelu da 1. u mesecu pozove podsetnik za popuste koji
ističu. Ništa dodatno ne treba — samo neka `CRON_SECRET` bude podešen.

## 5. Resend (email) — provera

Emailovi se šalju sa `noreply@jelenalazictattoo.com`. Da bi stizali bilo kome
(a ne samo na tvoju adresu), domen mora biti verifikovan na https://resend.com
pod **Domains**. Ako je kontakt forma sajta već slala emailove, ovo je verovatno
već sređeno.

## 6. Jelena — admin na telefonu

1. Jelena otvori `https://admin.jelenalazictattoo.com` u browseru na telefonu.
2. iPhone (Safari): dugme **Share** → **Add to Home Screen**.
   Android (Chrome): meni (tri tačke) → **Add to Home screen** / **Install app**.
3. Dobija ikonicu s logom — otvara se preko celog ekrana kao aplikacija.
4. Prijavi se emailom i lozinkom iz koraka 2 — ostaje prijavljena.

## Kako se koristi (podsetnik)

- **Novi klijent završio tetovažu** → admin → **+ Novi kod** → ime i email → klijentu
  stiže email sa QR kodom.
- **Neko došao preko koda** → stiže ti email, a prijava čeka u admin tabu **Prijave** →
  posle tetovaže klikni **Tetovaža obavljena**, upiši cenu → vlasnik koda automatski
  dobija 10% te cene kao kredit (email ide sam).
- **Klijent troši kredit** → tab **Klijenti** → nađi ga → **Saldo iskorišćen**.
- Krediti važe 3 godine; podsetnik pred istek ide automatski.
