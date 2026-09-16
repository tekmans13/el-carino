-- ============================================================
-- Création automatique des profils back-office
-- et protection de l'administrateur principal.
-- ============================================================


-- ------------------------------------------------------------
-- 1. Création automatique d'un profil lors de la création
--    d'un utilisateur Supabase Auth.
--
--    Tous les nouveaux utilisateurs sont "bureau" par défaut.
-- ------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    display_name,
    role
  )
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      split_part(new.email, '@', 1)
    ),
    'bureau'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;


drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();


-- ------------------------------------------------------------
-- 2. Protection du profil administrateur principal.
--
--    Empêche :
--      - la suppression de son profil
--      - le changement de son rôle admin
-- ------------------------------------------------------------

create or replace function public.protect_main_admin_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin

  if old.id = 'e9907145-d102-4014-a5a7-23346af251eb'::uuid then

    if tg_op = 'DELETE' then
      raise exception
        'Le profil de l''administrateur principal ne peut pas être supprimé.';
    end if;

    if tg_op = 'UPDATE' and new.role <> 'admin' then
      raise exception
        'Le rôle de l''administrateur principal doit rester admin.';
    end if;

  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;


drop trigger if exists protect_main_admin_profile
on public.profiles;

create trigger protect_main_admin_profile
before update or delete
on public.profiles
for each row
execute function public.protect_main_admin_profile();


-- ------------------------------------------------------------
-- 3. Protection du compte Supabase Auth de l'administrateur.
--
--    Empêche la suppression du compte yvan.manon@free.fr
--    lui-même, et pas uniquement de son profil.
-- ------------------------------------------------------------

create or replace function public.protect_main_admin_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin

  if old.id = 'e9907145-d102-4014-a5a7-23346af251eb'::uuid then
    raise exception
      'Le compte de l''administrateur principal ne peut pas être supprimé.';
  end if;

  return old;
end;
$$;


drop trigger if exists protect_main_admin_auth_user
on auth.users;

create trigger protect_main_admin_auth_user
before delete
on auth.users
for each row
execute function public.protect_main_admin_auth_user();
