-- ============================================================
-- Connexion back-office par prénom / username
-- ============================================================

-- 1. Ajout du username.
alter table public.profiles
add column if not exists username text;

-- 2. Initialisation des comptes existants depuis display_name.
--    Yvan -> yvan, Claire -> claire, Polo -> polo
update public.profiles
set username = lower(trim(display_name))
where username is null;

-- 3. Vérification avant d'ajouter l'unicité.
do $$
begin
  if exists (
    select lower(username)
    from public.profiles
    where username is not null
    group by lower(username)
    having count(*) > 1
  ) then
    raise exception
      'Impossible de créer la contrainte username : doublons détectés.';
  end if;
end;
$$;

-- 4. Username obligatoire.
alter table public.profiles
alter column username set not null;

-- 5. Unicité insensible à la casse.
create unique index if not exists profiles_username_lower_unique
on public.profiles (lower(username));

-- 6. Le trigger de création de profil récupère automatiquement
--    le prénom comme username.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  generated_username text;
begin
  generated_username := lower(
    trim(
      coalesce(
        new.raw_user_meta_data ->> 'first_name',
        split_part(new.email, '@', 1)
      )
    )
  );

  insert into public.profiles (
    id,
    email,
    display_name,
    username,
    role
  )
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'first_name',
      split_part(new.email, '@', 1)
    ),
    generated_username,
    'bureau'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- 7. Fonction publique extrêmement limitée :
--    username -> email nécessaire à Supabase Auth.
--
--    Elle ne retourne aucune autre information du profil.
create or replace function public.resolve_admin_login(
  login_username text
)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select email
  from public.profiles
  where lower(username) = lower(trim(login_username))
  limit 1;
$$;

revoke all
on function public.resolve_admin_login(text)
from public;

grant execute
on function public.resolve_admin_login(text)
to anon, authenticated;
