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

  admin_note,

  complement_message,
  complement_requested_at,
  complement_email_sent_at,

  created_at,
  updated_at
`;

const ADMIN_EDITABLE_STATUSES = [
  'soumis',
  'incomplet',
  'complement_demande',
  'valide',
  'en_attente_paiement',
  'refuse',
  'annule',
];

function validateRegistrationId(registrationId) {
  if (!registrationId) {
    throw new Error(
      'La référence du dossier est obligatoire.',
    );
  }
}

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

export async function getRegistrationById(
  registrationId,
) {
  validateRegistrationId(registrationId);

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

export async function updateRegistrationStatus(
  registrationId,
  status,
) {
  validateRegistrationId(registrationId);

  if (!ADMIN_EDITABLE_STATUSES.includes(status)) {
    throw new Error(
      'Le statut demandé n’est pas autorisé.',
    );
  }

  const { data, error } = await supabase
    .from('inscriptions')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', registrationId)
    .select(REGISTRATION_DETAIL_FIELDS)
    .single();

  if (error) {
    throw new Error(
      `Impossible de modifier le statut : ${error.message}`,
    );
  }

  return data;
}

export async function updateRegistrationAdminNote(
  registrationId,
  adminNote,
) {
  validateRegistrationId(registrationId);

  const normalizedNote =
    typeof adminNote === 'string'
      ? adminNote.trim()
      : '';

  const { data, error } = await supabase
    .from('inscriptions')
    .update({
      admin_note: normalizedNote || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', registrationId)
    .select(REGISTRATION_DETAIL_FIELDS)
    .single();

  if (error) {
    throw new Error(
      `Impossible d’enregistrer la note : ${error.message}`,
    );
  }

  return data;
}

export async function requestRegistrationComplement(
  registrationId,
  message,
) {
  validateRegistrationId(registrationId);

  const normalizedMessage =
    typeof message === 'string'
      ? message.trim()
      : '';

  if (!normalizedMessage) {
    throw new Error(
      'Le message de demande de complément est obligatoire.',
    );
  }

  const requestedAt = new Date().toISOString();

  const {
    data: updatedRegistration,
    error: updateError,
  } = await supabase
    .from('inscriptions')
    .update({
      status: 'complement_demande',
      complement_message: normalizedMessage,
      complement_requested_at: requestedAt,

      // Une nouvelle demande doit pouvoir déclencher
      // un nouvel e-mail.
      complement_email_sent_at: null,

      updated_at: requestedAt,
    })
    .eq('id', registrationId)
    .select(REGISTRATION_DETAIL_FIELDS)
    .single();

  if (updateError) {
    throw new Error(
      `Impossible d’enregistrer la demande de complément : ${updateError.message}`,
    );
  }

  const {
    data: emailResult,
    error: emailError,
  } = await supabase.functions.invoke(
    'send-registration-email',
    {
      body: {
        registrationId,
        type: 'complement_request',
      },
    },
  );

  if (emailError) {
    throw new Error(
      `La demande a été enregistrée, mais l’e-mail n’a pas pu être envoyé : ${emailError.message}`,
    );
  }

  if (!emailResult?.success) {
    throw new Error(
      emailResult?.error
        ?? 'La demande a été enregistrée, mais l’e-mail n’a pas pu être envoyé.',
    );
  }

  return getRegistrationById(registrationId);
}
