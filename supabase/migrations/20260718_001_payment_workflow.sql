-- États possibles du paiement d'une inscription.

create type public.payment_status as enum (
  'non_demande',
  'en_attente',
  'session_creee',
  'paye',
  'echoue',
  'annule',
  'rembourse'
);

alter table public.inscriptions
  add column payment_status public.payment_status
    not null
    default 'non_demande',

  add column payment_token_hash text,

  add column payment_token_created_at timestamptz,

  add column payment_token_expires_at timestamptz,

  add column payment_token_revoked_at timestamptz,

  add column payment_amount_cents integer,

  add column payment_currency text
    not null
    default 'eur',

  add column stripe_checkout_session_id text,

  add column stripe_payment_intent_id text,

  add column paid_at timestamptz,

  add column summary_email_sent_at timestamptz,

  add constraint inscriptions_payment_amount_check
    check (
      payment_amount_cents is null
      or payment_amount_cents >= 0
    ),

  add constraint inscriptions_payment_currency_check
    check (
      payment_currency ~ '^[a-z]{3}$'
    );

create unique index inscriptions_payment_token_hash_key
  on public.inscriptions (payment_token_hash)
  where payment_token_hash is not null;

create unique index inscriptions_stripe_checkout_session_key
  on public.inscriptions (stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;

create unique index inscriptions_stripe_payment_intent_key
  on public.inscriptions (stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;

create index inscriptions_payment_status_idx
  on public.inscriptions (payment_status);

create index inscriptions_payment_token_expires_at_idx
  on public.inscriptions (payment_token_expires_at)
  where payment_token_expires_at is not null;
