import { supabase } from '../../../services/supabase';

import { getClubSettings } from './clubSettingsService';

import {
  getRegistrationPricing,
} from '../utils/registrationPricing';

const MEDICAL_CERTIFICATE_BUCKET =
  'medical-certificates';

const MAX_MEDICAL_CERTIFICATE_SIZE =
  5 * 1024 * 1024;

const MAX_PAI_PROTOCOL_SIZE =
  5 * 1024 * 1024;

function normalizeOptionalValue(value) {
  const normalizedValue = value?.trim();

  return normalizedValue || null;
}

function normalizeOptionalNumber(value) {
  if (
    value === ''
    || value === null
    || value === undefined
  ) {
    return null;
  }

  const normalizedValue = Number(value);

  return Number.isFinite(normalizedValue)
    ? normalizedValue
    : null;
}

function isPdfFile(file) {
  return (
    file instanceof File
    && file.type === 'application/pdf'
  );
}

function getCertificateRequired(formData) {
  return (
    formData.ageCategory === 'adulte'
    || formData.practiceType === 'competition'
    || Boolean(
      formData.healthQuestionnaireHasPositiveAnswer,
    )
  );
}

function getMedicalCertificatePath(registrationId) {
  return `${registrationId}/certificat-medical.pdf`;
}

function getPaiProtocolPath(registrationId) {
  return `${registrationId}/pai-protocole.pdf`;
}

function buildRegistrationPayload(
  formData,
  registrationId,
  medicalCertificate,
  paiProtocol,
  paymentAmountCents,
) {
  const certificateRequired =
    getCertificateRequired(formData);

  const certificatePath = medicalCertificate
    ? getMedicalCertificatePath(registrationId)
    : null;

  const hasPai = formData.hasPai === 'yes';

  const paiProtocolPath =
    hasPai && paiProtocol
      ? getPaiProtocolPath(registrationId)
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

    height_cm:
      normalizeOptionalNumber(formData.heightCm),

    weight_kg:
      normalizeOptionalNumber(formData.weightKg),

    tshirt_size:
      normalizeOptionalValue(formData.tshirtSize),

    short_size:
      normalizeOptionalValue(formData.shortSize),

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

    has_pai: hasPai,

    pai_type:
      hasPai
        ? formData.paiType
        : null,

    pai_other_details:
      hasPai && formData.paiType === 'other'
        ? normalizeOptionalValue(
          formData.paiOtherDetails,
        )
        : null,

    pai_protocol_storage_path:
      paiProtocolPath,

    pai_protocol_filename:
      hasPai && paiProtocol
        ? paiProtocol.name
        : null,

    pai_protocol_mime_type:
      hasPai && paiProtocol
        ? paiProtocol.type
        : null,

    pai_protocol_uploaded_at:
      hasPai && paiProtocol
        ? new Date().toISOString()
        : null,

    image_consent:
      formData.imageConsent === 'accepted',

    parental_authorization:
      formData.ageCategory === 'enfant'
        ? Boolean(formData.parentalAuthorization)
        : null,

    payment_amount_cents:
      paymentAmountCents,

    payment_currency: 'eur',

    status: 'soumis',
  };
}

function buildRegistrationUpdatePayload(
  formData,
  paymentAmountCents,
) {
  const certificateRequired =
    getCertificateRequired(formData);

  const hasPai = formData.hasPai === 'yes';

  return {
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

    height_cm:
      normalizeOptionalNumber(formData.heightCm),

    weight_kg:
      normalizeOptionalNumber(formData.weightKg),

    tshirt_size:
      normalizeOptionalValue(formData.tshirtSize),

    short_size:
      normalizeOptionalValue(formData.shortSize),

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

    has_pai: hasPai,

    pai_type:
      hasPai
        ? formData.paiType
        : null,

    pai_other_details:
      hasPai && formData.paiType === 'other'
        ? normalizeOptionalValue(
          formData.paiOtherDetails,
        )
        : null,

    image_consent:
      formData.imageConsent === 'accepted',

    parental_authorization:
      formData.ageCategory === 'enfant'
        ? Boolean(formData.parentalAuthorization)
        : null,

    payment_amount_cents:
      paymentAmountCents,

    payment_currency: 'eur',
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

function validatePaiProtocol(
  formData,
  paiProtocol,
) {
  if (formData.hasPai !== 'yes') {
    return;
  }

  if (!formData.paiType) {
    throw new Error(
      'Le type de PAI est obligatoire.',
    );
  }

  if (
    formData.paiType === 'other'
    && !normalizeOptionalValue(
      formData.paiOtherDetails,
    )
  ) {
    throw new Error(
      'La précision du PAI est obligatoire.',
    );
  }

  if (!paiProtocol) {
    throw new Error(
      'Le protocole PAI est obligatoire pour ce dossier.',
    );
  }

  if (!isPdfFile(paiProtocol)) {
    throw new Error(
      'Le protocole PAI doit être un fichier PDF.',
    );
  }

  if (
    paiProtocol.size
    > MAX_PAI_PROTOCOL_SIZE
  ) {
    throw new Error(
      'Le protocole PAI ne doit pas dépasser 5 Mo.',
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

async function uploadPaiProtocol(
  registrationId,
  paiProtocol,
) {
  if (!paiProtocol) {
    return null;
  }

  const storagePath =
    getPaiProtocolPath(registrationId);

  const { error } = await supabase.storage
    .from(MEDICAL_CERTIFICATE_BUCKET)
    .upload(
      storagePath,
      paiProtocol,
      {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false,
      },
    );

  if (error) {
    throw new Error(
      `Impossible de transmettre le protocole PAI : ${error.message}`,
    );
  }

  return storagePath;
}

async function removeUploadedFile(
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
      'Impossible de supprimer le fichier après échec :',
      error,
    );
  }
}

async function sendRegistrationConfirmationEmail(
  registrationId,
) {
  const { error } = await supabase.functions.invoke(
    'send-registration-email',
    {
      body: {
        registrationId,
      },
    },
  );

  if (error) {
    throw new Error(
      `Le choix de règlement a été enregistré, mais le mail de confirmation n’a pas pu être envoyé : ${error.message}`,
    );
  }
}

function throwRegistrationDatabaseError(
  error,
  action,
) {
  if (
    error.code === '23505'
    && error.message?.includes(
      'inscriptions_unique_practitioner_identity_idx',
    )
  ) {
    throw new Error(
      'Une inscription existe déjà pour ce pratiquant. Si vous pensez qu’il s’agit d’une erreur, contactez le club.',
    );
  }

  throw new Error(
    `Impossible ${action} l’inscription : ${error.message}`,
  );
}

export async function createRegistration(
  formData,
  medicalCertificate = null,
  paiProtocol = null,
) {
  const registrationId = crypto.randomUUID();

  const clubSettings = await getClubSettings();

  const pricing = getRegistrationPricing(
    formData,
    clubSettings,
  );

  if (!pricing) {
    throw new Error(
      'Impossible de calculer le montant de l’inscription.',
    );
  }

  const certificateRequired =
    getCertificateRequired(formData);

  validateMedicalCertificate(
    medicalCertificate,
    certificateRequired,
  );

  validatePaiProtocol(
    formData,
    paiProtocol,
  );

  let medicalCertificateStoragePath = null;
  let paiProtocolStoragePath = null;

  try {
    medicalCertificateStoragePath =
      await uploadMedicalCertificate(
        registrationId,
        medicalCertificate,
      );

    paiProtocolStoragePath =
      await uploadPaiProtocol(
        registrationId,
        paiProtocol,
      );
  } catch (error) {
    await removeUploadedFile(
      medicalCertificateStoragePath,
    );

    await removeUploadedFile(
      paiProtocolStoragePath,
    );

    throw error;
  }

  const payload = buildRegistrationPayload(
    formData,
    registrationId,
    medicalCertificate,
    paiProtocol,
    pricing.totalCents,
  );

  const { error } = await supabase
    .from('inscriptions')
    .insert(payload);

  if (error) {
    await removeUploadedFile(
      medicalCertificateStoragePath,
    );

    await removeUploadedFile(
      paiProtocolStoragePath,
    );

    throwRegistrationDatabaseError(
      error,
      'd’enregistrer',
    );
  }

  return {
    id: registrationId,
    status: 'soumis',
  };
}

export async function updateRegistration(
  registrationId,
  formData,
  medicalCertificate = null,
  paiProtocol = null,
) {
  if (!registrationId) {
    throw new Error(
      'Impossible de modifier l’inscription : inscription inconnue.',
    );
  }

  const clubSettings = await getClubSettings();

  const pricing = getRegistrationPricing(
    formData,
    clubSettings,
  );

  if (!pricing) {
    throw new Error(
      'Impossible de calculer le montant de l’inscription.',
    );
  }

  const certificateRequired =
    getCertificateRequired(formData);

  validateMedicalCertificate(
    medicalCertificate,
    certificateRequired,
  );

  validatePaiProtocol(
    formData,
    paiProtocol,
  );

  const payload = buildRegistrationUpdatePayload(
    formData,
    pricing.totalCents,
  );

  const { error } = await supabase
    .from('inscriptions')
    .update(payload)
    .eq('id', registrationId);

  if (error) {
    throwRegistrationDatabaseError(
      error,
      'de modifier',
    );
  }

  return {
    id: registrationId,
  };
}

export async function updatePlannedPaymentMethods(
  registrationId,
  mainPaymentMethod,
  paymentAids = [],
) {
  if (!registrationId) {
    throw new Error(
      'Impossible d’enregistrer le mode de règlement : inscription inconnue.',
    );
  }

  const { error } = await supabase
    .from('inscriptions')
    .update({
      planned_payment_main_method:
        mainPaymentMethod || null,
      planned_payment_aids: paymentAids,
    })
    .eq('id', registrationId);

  if (error) {
    throw new Error(
      `Impossible d’enregistrer le mode de règlement : ${error.message}`,
    );
  }

  await sendRegistrationConfirmationEmail(
    registrationId,
  );
}
