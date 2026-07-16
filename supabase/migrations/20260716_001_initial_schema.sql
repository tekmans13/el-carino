-- Types utilisés par le back-office et le tunnel d'inscription.

create type public.user_role as enum (
  'admin',
  'bureau'
);

create type public.age_category as enum (
  'adulte',
  'enfant'
);

create type public.practice_type as enum (
  'loisir',
  'competition'
);

create type public.registration_status as enum (
  'brouillon',
  'incomplet',
  'en_attente_paiement',
  'paye',
  'valide',
  'refuse'
);

-- Profils des utilisateurs autorisés à accéder au back-office.
-- L'identifiant correspond à celui de Supabase Auth.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  role public.user_role not null default 'bureau',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Inscriptions des adhérents.
-- Cette première version couvre principalement les étapes 1 et 2.

create table public.inscriptions (
  id uuid primary key default gen_random_uuid(),

  age_category public.age_category not null,
  practice_type public.practice_type not null,

  last_name text not null,
  first_name text not null,
  gender text not null,
  birth_date date not null,

  email text not null,
  phone text not null,

  address_line1 text not null,
  address_line2 text,
  postal_code text not null,
  city text not null,

  emergency_contact_name text not null,
  emergency_contact_phone text not null,

  legal_representative_name text,
  legal_representative_email text,
  legal_representative_phone text,

  image_consent boolean,
  parental_authorization boolean,

  status public.registration_status
    not null
    default 'brouillon',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint inscriptions_birth_date_check
    check (birth_date <= current_date),

  constraint inscriptions_minor_representative_check
    check (
      age_category <> 'enfant'
      or (
        legal_representative_name is not null
        and legal_representative_email is not null
        and legal_representative_phone is not null
      )
    )
);

-- Index utiles au futur back-office.

create index inscriptions_status_idx
  on public.inscriptions(status);

create index inscriptions_email_idx
  on public.inscriptions(email);

create index inscriptions_created_at_idx
  on public.inscriptions(created_at desc);

-- Activation de Row Level Security.

alter table public.profiles enable row level security;
alter table public.inscriptions enable row level security;

-- Chaque membre connecté peut consulter son propre profil.

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using (
  id = (select auth.uid())
);

-- Les utilisateurs du back-office peuvent consulter les inscriptions.

create policy "Backoffice users can read registrations"
on public.inscriptions
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
  )
);

-- Les utilisateurs du back-office peuvent corriger les inscriptions.

create policy "Backoffice users can update registrations"
on public.inscriptions
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
  )
);

-- Insertion publique initiale pour le tunnel.
-- Elle sera ensuite remplacée par une Edge Function avec validation renforcée.

create policy "Public can create registrations"
on public.inscriptions
for insert
to anon
with check (
  last_name is not null
  and first_name is not null
  and email is not null
  and phone is not null
);
