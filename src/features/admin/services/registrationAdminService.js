import { supabase } from '../../../services/supabase';

const MEDICAL_CERTIFICATE_BUCKET =
  'medical-certificates';

const REGISTRATION_LIST_FIELDS = `
  id,
  first_name,
  last_name,
  email,
  phone,
  age_category,
  practice_type,
  status,
  payment_status,
  created_at
`;

const REGISTRATION_DETAIL_FIELDS = `
  id,
  age_category,
  practice_type,

  last_name,
  first_name,
  gender,
  birth_date,

  email,
  phone,

  address_line1,
  address_line2,
  postal_code,
  city,

  emergency_contact_name,
  emergency_contact_phone,

  legal_representative_name,
  legal_representative_email,
  legal_representative_phone,

  health_questionnaire_completed,
  health_questionnaire_has_positive_answer,

  medical_certificate_required,
  medical_certificate_storage_path,
  medical_certificate_filename,
  medical_certificate_mime_type,
  medical_certificate_uploaded_at,

  image_consent,
  parental_authorization,

  status,
  payment_status,
  payment_amount_cents,
  payment_currency,
  paid_at,

  created_at,
  updated_at
`;

export async function listRegistrations() {
  const { data, error } = await supabase
    .from('inscriptions')
    .select(REGISTRATION_LIST_FIELDS)
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `Impossible de charger les inscriptions : ${error.message}`,
    );
  }

  return data ?? [];
}

export async function getRegistrationById(registrationId) {
  if (!registrationId) {
    throw new Error(
      'La référence du dossier est obligatoire.',
    );
  }

  const { data, error } = await supabase
    .from('inscriptions')
    .select(REGISTRATION_DETAIL_FIELDS)
    .eq('id', registrationId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Impossible de charger le dossier : ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      'Le dossier demandé est introuvable.',
    );
  }

  return data;
}

export async function createMedicalCertificateUrl(
  storagePath,
) {
  if (!storagePath) {
    throw new Error(
      'Aucun certificat médical n’est associé à ce dossier.',
    );
  }

  const { data, error } = await supabase.storage
    .from(MEDICAL_CERTIFICATE_BUCKET)
    .createSignedUrl(
      storagePath,
      60,
    );

  if (error) {
    throw new Error(
      `Impossible d’ouvrir le certificat médical : ${error.message}`,
    );
  }

  if (!data?.signedUrl) {
    throw new Error(
      'Supabase n’a pas retourné de lien vers le certificat médical.',
    );
  }

  return data.signedUrl;
}
