-- Autorise uniquement les membres Admin et Bureau
-- à supprimer les certificats médicaux du bucket privé.
--
-- Cette permission est nécessaire lors du remplacement
-- d’un certificat : le nouveau fichier est d’abord ajouté,
-- puis l’ancien est supprimé après mise à jour de la base.

drop policy if exists
  "admin and bureau can delete medical certificates"
  on storage.objects;

create policy
  "admin and bureau can delete medical certificates"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'medical-certificates'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin', 'bureau')
  )
);
