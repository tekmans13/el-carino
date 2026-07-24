import { supabase } from '../../../services/supabase';

const MEDICAL_CERTIFICATE_BUCKET =
  'medical-certificates';

const MAX_MEDICAL_CERTIFICATE_SIZE =
  5 * 1024 * 1024;

const REGISTRATION_LIST_FIELDS = `
  id,
  first_name,
  last_name,
  gender,
  birth_date,
  email,
  phone,

  address_line1,
  address_line2,
  postal_code,
  city,

  age_category,
  practice_type,

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
  medical_certificate_uploaded_at,

  image_consent,
  parental_authorization,

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

function validateMedicalCertificate(file) {
  if (!(file instanceof File)) {
    throw new Error(
      'Veuillez sélectionner un certificat médical.',
    );
  }

  if (file.type !== 'application/pdf') {
    throw new Error(
      'Le certificat médical doit être un fichier PDF.',
    );
  }

  if (file.size > MAX_MEDICAL_CERTIFICATE_SIZE) {
    throw new Error(
      'Le certificat médical ne doit pas dépasser 5 Mo.',
    );
  }
}

async function uploadMedicalCertificate(
  storagePath,
  file,
) {
  const { error } = await supabase.storage
    .from(MEDICAL_CERTIFICATE_BUCKET)
    .upload(
      storagePath,
      file,
      {
        upsert: false,
        contentType: 'application/pdf',
        cacheControl: '3600',
      },
    );

  if (error) {
    throw new Error(
      `Impossible de déposer le certificat médical : ${error.message}`,
    );
  }
}

async function deleteMedicalCertificate(
  storagePath,
) {
  if (!storagePath) {
    return;
  }

  const { error } = await supabase.storage
    .from(MEDICAL_CERTIFICATE_BUCKET)
    .remove([storagePath]);

  if (error) {
    throw new Error(
      `Impossible de supprimer le certificat médical : ${error.message}`,
    );
  }
}

export async function replaceMedicalCertificate(
  registration,
  file,
) {
  validateMedicalCertificate(file);

  if (!registration?.id) {
    throw new Error(
      'La référence du dossier est obligatoire.',
    );
  }

  const oldStoragePath =
    registration.medical_certificate_storage_path;

  if (!oldStoragePath) {
    throw new Error(
      'Aucun certificat existant à remplacer.',
    );
  }

  const newStoragePath =
    `${registration.id}/certificat-medical-${Date.now()}.pdf`;

  await uploadMedicalCertificate(
    newStoragePath,
    file,
  );

  const uploadedAt = new Date().toISOString();

  const { data, error } = await supabase
    .from('inscriptions')
    .update({
      medical_certificate_storage_path:
        newStoragePath,
      medical_certificate_filename:
        file.name,
      medical_certificate_mime_type:
        file.type,
      medical_certificate_uploaded_at:
        uploadedAt,
      updated_at:
        uploadedAt,
    })
    .eq('id', registration.id)
    .select(REGISTRATION_DETAIL_FIELDS)
    .single();

  if (error) {
    try {
      await deleteMedicalCertificate(
        newStoragePath,
      );
    } catch {
      // Le nettoyage ne doit pas masquer l’erreur SQL.
    }

    throw new Error(
      `Impossible de remplacer le certificat médical : ${error.message}`,
    );
  }

  try {
    await deleteMedicalCertificate(
      oldStoragePath,
    );
  } catch (deleteError) {
    console.error(
      'Le certificat a été remplacé, mais l’ancien fichier n’a pas pu être supprimé.',
      deleteError,
    );
  }

  return data;
}

export async function updateRegistrationStatus(
  registrationId,
  status,
) {
  if (!registrationId) {
    throw new Error(
      'La référence du dossier est obligatoire.',
    );
  }

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
  if (!registrationId) {
    throw new Error(
      'La référence du dossier est obligatoire.',
    );
  }

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
