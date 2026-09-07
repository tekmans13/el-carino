alter table public.inscriptions
  add column if not exists has_pai boolean not null default false,
  add column if not exists pai_type text,
  add column if not exists pai_other_details text,
  add column if not exists pai_protocol_storage_path text,
  add column if not exists pai_protocol_filename text,
  add column if not exists pai_protocol_mime_type text,
  add column if not exists pai_protocol_uploaded_at timestamptz;

alter table public.inscriptions
  add constraint inscriptions_pai_type_check
  check (
    pai_type is null
    or pai_type in (
      'asthma',
      'severe_allergy',
      'diabetes',
      'epilepsy',
      'cardiac_disorder',
      'coagulation_disorder',
      'other'
    )
  );

alter table public.inscriptions
  add constraint inscriptions_pai_consistency_check
  check (
    (
      has_pai = false
      and pai_type is null
      and pai_other_details is null
      and pai_protocol_storage_path is null
      and pai_protocol_filename is null
      and pai_protocol_mime_type is null
      and pai_protocol_uploaded_at is null
    )
    or
    (
      has_pai = true
      and pai_type is not null
    )
  );

alter table public.inscriptions
  add constraint inscriptions_pai_other_details_check
  check (
    pai_type <> 'other'
    or (
      pai_other_details is not null
      and length(trim(pai_other_details)) > 0
    )
  );
