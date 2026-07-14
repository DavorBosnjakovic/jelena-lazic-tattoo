-- ============================================
-- REFERRAL PROGRAM SCHEMA
-- Paste this whole file into Supabase SQL Editor and click "Run".
-- Safe to run more than once.
-- ============================================

create extension if not exists pgcrypto;

-- A client who received their own referral code from Jelena
create table if not exists referrers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  code text not null unique,      -- shareable code, e.g. JELA-K4T9
  secret text not null unique,    -- private token for the "my status" page link
  created_at timestamptz not null default now()
);

-- A person who arrived via someone's code (booking request -> completed tattoo)
create table if not exists referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references referrers(id) on delete cascade,
  friend_name text not null,
  friend_email text,
  friend_phone text,
  message text,
  status text not null default 'pending' check (status in ('pending', 'completed', 'dismissed')),
  tattoo_price_eur numeric(10,2),
  credit_eur numeric(10,2),
  credit_status text check (credit_status in ('active', 'used')),
  credit_expires_at timestamptz,
  reminder_sent boolean not null default false,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  used_at timestamptz
);

create index if not exists referrals_referrer_idx on referrals (referrer_id);
create index if not exists referrals_status_idx on referrals (status);

-- Lock both tables down completely: no anon or authenticated access.
-- The website talks to these tables only from the server, using the
-- service role key, so no browser can ever read or write them directly.
alter table referrers enable row level security;
alter table referrals enable row level security;
