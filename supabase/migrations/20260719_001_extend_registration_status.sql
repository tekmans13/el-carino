-- Ajoute les statuts nécessaires au workflow administratif V1.

alter type public.registration_status
  add value if not exists 'soumis'
  after 'brouillon';

alter type public.registration_status
  add value if not exists 'complement_demande'
  after 'incomplet';

alter type public.registration_status
  add value if not exists 'annule'
  after 'refuse';
