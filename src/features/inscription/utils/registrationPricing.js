export function calculateAge(birthDate) {
  if (!birthDate) {
    return null;
  }

  const birth = new Date(`${birthDate}T00:00:00`);
  const today = new Date();

  if (Number.isNaN(birth.getTime())) {
    return null;
  }

  let age = today.getFullYear() - birth.getFullYear();

  const birthdayNotReached =
    today.getMonth() < birth.getMonth()
    || (
      today.getMonth() === birth.getMonth()
      && today.getDate() < birth.getDate()
    );

  if (birthdayNotReached) {
    age -= 1;
  }

  return age;
}

export function getRegistrationPricing(
  formData,
  settings,
) {
  if (!settings) {
    return null;
  }

  const age = calculateAge(formData.birthDate);

  if (age === null || age < 0) {
    return null;
  }

  const isAdult =
    age >= settings.adult_age_threshold;

  const baseFeeCents = isAdult
    ? settings.adult_annual_fee_cents
    : settings.minor_annual_fee_cents;

  const licenseFeeCents =
    formData.practiceType === 'competition'
      ? settings.federal_license_fee_cents
      : 0;

  return {
    age,
    isAdult,
    baseFeeCents,
    licenseFeeCents,
    totalCents:
      baseFeeCents + licenseFeeCents,
  };
}

export function formatEuroFromCents(value) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(value ?? 0) / 100);
}
