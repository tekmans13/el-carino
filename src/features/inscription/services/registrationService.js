import { supabase } from '../../../services/supabase';

function normalizeOptionalValue(value) {
  const normalizedValue = value?.trim();

  return normalizedValue || null;
}

function buildRegistrationPayload(
  formData,
  registrationId,
) {
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

    image_consent:
      formData.imageConsent === 'accepted',

    parental_authorization:
      formData.ageCategory === 'enfant'
        ? Boolean(formData.parentalAuthorization)
        : null,

    status: 'brouillon',
  };
}

export async function createRegistration(formData) {
  const registrationId = crypto.randomUUID();

  const payload = buildRegistrationPayload(
    formData,
    registrationId,
  );

  const { error } = await supabase
    .from('inscriptions')
    .insert(payload);

  if (error) {
    throw new Error(
      `Impossible d’enregistrer l’inscription : ${error.message}`,
    );
  }

  return {
    id: registrationId,
    status: 'brouillon',
  };
}
