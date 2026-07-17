-- Informations minimales de santé et certificat médical.
-- Aucun détail médical libre n'est conservé dans la table.

alter table public.inscriptions
  add column health_questionnaire_completed boolean
    not null
    default false,

  add column health_questionnaire_has_positive_answer boolean
    not null
    default false,

  add column medical_certificate_required boolean
    not null
    default false,

  add column medical_certificate_storage_path text,

  add column medical_certificate_filename text,

  add column medical_certificate_mime_type text,

  add column medical_certificate_uploaded_at timestamptz;

alter table public.inscriptions
  add constraint inscriptions_medical_certificate_pdf_check
  check (
    medical_certificate_mime_type is null
    or medical_certificate_mime_type = 'application/pdf'
  );

create index inscriptions_medical_certificate_required_idx
  on public.inscriptions (medical_certificate_required)
  where medical_certificate_required = true;
