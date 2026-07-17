import { supabase } from '../../../services/supabase';

const MEDICAL_CERTIFICATE_BUCKET =
  'medical-certificates';

const MAX_MEDICAL_CERTIFICATE_SIZE =
  5 * 1024 * 1024;

function normalizeOptionalValue(value) {
  const normalizedValue = value?.trim();

  return normalizedValue || null;
}

function isPdfFile(file) {
  return (
    file instanceof File
    && file.type === 'application/pdf'
  );
}

function getCertificateRequired(formData) {
  return (
    (
      formData.ageCategory === 'adulte'
      && formData.practiceType === 'competition'
    )
    || Boolean(
      formData.healthQuestionnaireHasPositiveAnswer,
    )
  );
}

function getMedicalCertificatePath(registrationId) {
  return `${registrationId}/certificat-medical.pdf`;
}

function buildRegistrationPayload(
  formData,
  registrationId,
  medicalCertificate,
) {
  const certificateRequired =
    getCertificateRequired(formData);

  const certificatePath = medicalCertificate
    ? getMedicalCertificatePath(registrationId)
    : null;

  return {
    id: registrationId,

    age_category: formData.ageCategory,
    practice_type: formData.practiceType,

    last_name: formData.lastName.trim(),
    first_name: formData.firstName.trim(),
    gender: formData.gender,
    birth_date: formData.birthDate,

    email: formData.email.trim(),
    phone: formData.phone.trim(),

    address_line1: formData.addressLine1.trim(),

    address_line2: normalizeOptionalValue(
      formData.addressLine2,
    ),

    postal_code: formData.postalCode.trim(),
    city: formData.city.trim(),

    emergency_contact_name:
      formData.emergencyContactName.trim(),

    emergency_contact_phone:
      formData.emergencyContactPhone.trim(),

    legal_representative_name:
      normalizeOptionalValue(
        formData.legalRepresentativeName,
      ),

    legal_representative_email:
      normalizeOptionalValue(
        formData.legalRepresentativeEmail,
      ),

    legal_representative_phone:
      normalizeOptionalValue(
        formData.legalRepresentativePhone,
      ),

    health_questionnaire_completed:
      Boolean(
        formData.healthQuestionnaireCompleted,
      ),

    health_questionnaire_has_positive_answer:
      Boolean(
        formData.healthQuestionnaireHasPositiveAnswer,
      ),

    medical_certificate_required:
      certificateRequired,

    medical_certificate_storage_path:
      certificatePath,

    medical_certificate_filename:
      medicalCertificate?.name ?? null,

    medical_certificate_mime_type:
      medicalCertificate?.type ?? null,

    medical_certificate_uploaded_at:
      medicalCertificate
        ? new Date().toISOString()
        : null,

    image_consent:
      formData.imageConsent === 'accepted',

    parental_authorization:
      formData.ageCategory === 'enfant'
        ? Boolean(formData.parentalAuthorization)
        : null,

    status: 'soumis',
  };
}

function validateMedicalCertificate(
  medicalCertificate,
  certificateRequired,
) {
  if (certificateRequired && !medicalCertificate) {
    throw new Error(
      'Le certificat médical est obligatoire pour ce dossier.',
    );
  }

  if (!medicalCertificate) {
    return;
  }

  if (!isPdfFile(medicalCertificate)) {
    throw new Error(
      'Le certificat médical doit être un fichier PDF.',
    );
  }

  if (
    medicalCertificate.size
    > MAX_MEDICAL_CERTIFICATE_SIZE
  ) {
    throw new Error(
      'Le certificat médical ne doit pas dépasser 5 Mo.',
    );
  }
}

async function uploadMedicalCertificate(
  registrationId,
  medicalCertificate,
) {
  if (!medicalCertificate) {
    return null;
  }

  const storagePath =
    getMedicalCertificatePath(registrationId);

  const { error } = await supabase.storage
    .from(MEDICAL_CERTIFICATE_BUCKET)
    .upload(
      storagePath,
      medicalCertificate,
      {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false,
      },
    );

  if (error) {
    throw new Error(
      `Impossible de transmettre le certificat médical : ${error.message}`,
    );
  }

  return storagePath;
}

async function removeUploadedMedicalCertificate(
  storagePath,
) {
  if (!storagePath) {
    return;
  }

  const { error } = await supabase.storage
    .from(MEDICAL_CERTIFICATE_BUCKET)
    .remove([storagePath]);

  if (error) {
    console.error(
      'Impossible de supprimer le certificat après échec :',
      error,
    );
  }
}

export async function createRegistration(
  formData,
  medicalCertificate = null,
) {
  const registrationId = crypto.randomUUID();

  const certificateRequired =
    getCertificateRequired(formData);

  validateMedicalCertificate(
    medicalCertificate,
    certificateRequired,
  );

  const storagePath =
    await uploadMedicalCertificate(
      registrationId,
      medicalCertificate,
    );

  const payload = buildRegistrationPayload(
    formData,
    registrationId,
    medicalCertificate,
  );

  const { error } = await supabase
    .from('inscriptions')
    .insert(payload);

  if (error) {
    await removeUploadedMedicalCertificate(
      storagePath,
    );

    throw new Error(
      `Impossible d’enregistrer l’inscription : ${error.message}`,
    );
  }

  return {
    id: registrationId,
    status: 'soumis',
  };
}
