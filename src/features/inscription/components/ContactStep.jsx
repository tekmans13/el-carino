import { useState } from 'react';

const DEFAULT_MINIMUM_AGE = 5;
const DEFAULT_ADULT_AGE_THRESHOLD = 15;
const DEFAULT_MAXIMUM_AGE = 80;

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

function isValidFrenchPhone(value) {
  const normalizedPhone = value
    .trim()
    .replace(/[\s.-]/g, '');

  return /^(?:(?:\+|00)33|0)[1-9]\d{8}$/.test(
    normalizedPhone,
  );
}

function calculateAge(birthDate) {
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

function getBirthDateError(
  birthDate,
  ageCategory,
  minimumAge,
  adultAgeThreshold,
  maximumAge,
) {
  if (!birthDate) {
    return 'La date de naissance est obligatoire.';
  }

  const selectedDate = new Date(`${birthDate}T00:00:00`);

  if (
    Number.isNaN(selectedDate.getTime())
    || selectedDate > new Date()
  ) {
    return 'La date de naissance est invalide.';
  }

  const age = calculateAge(birthDate);

  if (age === null || age < 0) {
    return 'La date de naissance est invalide.';
  }

  if (age < minimumAge) {
    return (
      `Cette personne a ${age} an${age > 1 ? 's' : ''}. `
      + `Le club accepte les inscriptions à partir de ${minimumAge} ans.`
    );
  }

  if (age > maximumAge) {
    return (
      `Cette personne a ${age} ans. `
      + `Le club accepte les inscriptions jusqu’à ${maximumAge} ans. `
      + 'Merci de contacter le club pour une demande particulière.'
    );
  }

  if (
    ageCategory === 'adulte'
    && age < adultAgeThreshold
  ) {
    return (
      `Cette personne a ${age} an${age > 1 ? 's' : ''}. `
      + `Choisissez « Enfant » pour une personne âgée de `
      + `${minimumAge} à ${adultAgeThreshold - 1} ans.`
    );
  }

  if (
    ageCategory === 'enfant'
    && age >= adultAgeThreshold
  ) {
    return (
      `Cette personne a ${age} ans. `
      + `Choisissez « Adulte » à partir de ${adultAgeThreshold} ans.`
    );
  }

  return null;
}

function validateField(
  name,
  value,
  formData,
  settings,
) {
  const {
    minimumAge,
    adultAgeThreshold,
    maximumAge,
  } = settings;

  switch (name) {
    case 'birthDate':
      return getBirthDateError(
        value,
        formData.ageCategory,
        minimumAge,
        adultAgeThreshold,
        maximumAge,
      );

    case 'email':
      if (!value.trim()) {
        return 'L’adresse e-mail est obligatoire.';
      }

      if (!isValidEmail(value)) {
        return 'Saisissez une adresse e-mail valide.';
      }

      return null;

    case 'phone':
      if (!value.trim()) {
        return 'Le téléphone est obligatoire.';
      }

      if (!isValidFrenchPhone(value)) {
        return (
          'Saisissez un numéro français valide, '
          + 'par exemple 06 12 34 56 78.'
        );
      }

      return null;

    case 'emergencyContactPhone':
      if (!value.trim()) {
        return (
          'Le téléphone du contact d’urgence '
          + 'est obligatoire.'
        );
      }

      if (!isValidFrenchPhone(value)) {
        return 'Saisissez un numéro français valide.';
      }

      return null;

    case 'legalRepresentativeEmail':
      if (formData.ageCategory !== 'enfant') {
        return null;
      }

      if (!value.trim()) {
        return (
          'L’e-mail du représentant légal '
          + 'est obligatoire.'
        );
      }

      if (!isValidEmail(value)) {
        return 'Saisissez une adresse e-mail valide.';
      }

      return null;

    case 'legalRepresentativePhone':
      if (formData.ageCategory !== 'enfant') {
        return null;
      }

      if (!value.trim()) {
        return (
          'Le téléphone du représentant légal '
          + 'est obligatoire.'
        );
      }

      if (!isValidFrenchPhone(value)) {
        return 'Saisissez un numéro français valide.';
      }

      return null;

    case 'postalCode':
      if (!value.trim()) {
        return 'Le code postal est obligatoire.';
      }

      if (!/^\d{5}$/.test(value.trim())) {
        return 'Le code postal doit contenir 5 chiffres.';
      }

      return null;

    default:
      return null;
  }
}

function validateForm(formData, settings) {
  const errors = {};

  const requiredFields = [
    ['lastName', 'Le nom est obligatoire.'],
    ['firstName', 'Le prénom est obligatoire.'],
    ['gender', 'Le sexe est obligatoire.'],
    ['addressLine1', 'L’adresse est obligatoire.'],
    ['city', 'La ville est obligatoire.'],
    [
      'emergencyContactName',
      'Le contact d’urgence est obligatoire.',
    ],
  ];

  requiredFields.forEach(([field, message]) => {
    if (!formData[field]?.trim()) {
      errors[field] = message;
    }
  });

  const validatedFields = [
    'birthDate',
    'email',
    'phone',
    'postalCode',
    'emergencyContactPhone',
  ];

  if (formData.ageCategory === 'enfant') {
    validatedFields.push(
      'legalRepresentativeEmail',
      'legalRepresentativePhone',
    );

    if (!formData.legalRepresentativeName?.trim()) {
      errors.legalRepresentativeName =
        'Le représentant légal est obligatoire.';
    }
  }

  validatedFields.forEach((field) => {
    const error = validateField(
      field,
      formData[field] ?? '',
      formData,
      settings,
    );

    if (error) {
      errors[field] = error;
    }
  });

  return errors;
}

function FieldError({ message }) {
  if (!message) {
    return null;
  }

  return <p role="alert">{message}</p>;
}

export default function ContactStep({
  formData,
  updateField,
  onPrevious,
  onNext,
  minimumAge = DEFAULT_MINIMUM_AGE,
  adultAgeThreshold = DEFAULT_ADULT_AGE_THRESHOLD,
  maximumAge = DEFAULT_MAXIMUM_AGE,
}) {
  const [errors, setErrors] = useState({});

  const settings = {
    minimumAge,
    adultAgeThreshold,
    maximumAge,
  };

  function handleChange(event) {
    const { name, value } = event.target;

    updateField(name, value);

    if (errors[name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: undefined,
      }));
    }
  }

  function handleBlur(event) {
    const { name, value } = event.target;

    const error = validateField(
      name,
      value,
      {
        ...formData,
        [name]: value,
      },
      settings,
    );

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: error ?? undefined,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm(
      formData,
      settings,
    );

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onNext();
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <fieldset>
        <legend>Identité</legend>

        <label htmlFor="lastName">Nom</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          autoComplete="family-name"
        />
        <FieldError message={errors.lastName} />

        <label htmlFor="firstName">Prénom</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          autoComplete="given-name"
        />
        <FieldError message={errors.firstName} />

        <label htmlFor="gender">Sexe</label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Sélectionner</option>
          <option value="femme">Femme</option>
          <option value="homme">Homme</option>
          <option value="autre">Autre</option>
        </select>
        <FieldError message={errors.gender} />

        <label htmlFor="birthDate">
          Date de naissance
        </label>
        <input
          id="birthDate"
          name="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <FieldError message={errors.birthDate} />
      </fieldset>

      <fieldset>
        <legend>Coordonnées</legend>

        <label htmlFor="email">
          Adresse e-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="email"
          inputMode="email"
          placeholder="nom@exemple.fr"
        />
        <FieldError message={errors.email} />

        <label htmlFor="phone">Téléphone</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="tel"
          inputMode="tel"
          placeholder="06 12 34 56 78"
        />
        <FieldError message={errors.phone} />

        <label htmlFor="addressLine1">
          Adresse
        </label>
        <input
          id="addressLine1"
          name="addressLine1"
          type="text"
          value={formData.addressLine1}
          onChange={handleChange}
          autoComplete="address-line1"
        />
        <FieldError message={errors.addressLine1} />

        <label htmlFor="addressLine2">
          Complément d’adresse
        </label>
        <input
          id="addressLine2"
          name="addressLine2"
          type="text"
          value={formData.addressLine2}
          onChange={handleChange}
          autoComplete="address-line2"
        />

        <label htmlFor="postalCode">
          Code postal
        </label>
        <input
          id="postalCode"
          name="postalCode"
          type="text"
          value={formData.postalCode}
          onChange={handleChange}
          onBlur={handleBlur}
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={5}
          placeholder="13016"
        />
        <FieldError message={errors.postalCode} />

        <label htmlFor="city">Ville</label>
        <input
          id="city"
          name="city"
          type="text"
          value={formData.city}
          onChange={handleChange}
          autoComplete="address-level2"
        />
        <FieldError message={errors.city} />
      </fieldset>

      <fieldset>
        <legend>Contact d’urgence</legend>

        <label htmlFor="emergencyContactName">
          Nom et prénom
        </label>
        <input
          id="emergencyContactName"
          name="emergencyContactName"
          type="text"
          value={formData.emergencyContactName}
          onChange={handleChange}
        />
        <FieldError
          message={errors.emergencyContactName}
        />

        <label htmlFor="emergencyContactPhone">
          Téléphone
        </label>
        <input
          id="emergencyContactPhone"
          name="emergencyContactPhone"
          type="tel"
          value={formData.emergencyContactPhone}
          onChange={handleChange}
          onBlur={handleBlur}
          inputMode="tel"
          placeholder="06 12 34 56 78"
        />
        <FieldError
          message={errors.emergencyContactPhone}
        />
      </fieldset>

      {formData.ageCategory === 'enfant' && (
        <fieldset>
          <legend>Représentant légal</legend>

          <label htmlFor="legalRepresentativeName">
            Nom et prénom
          </label>
          <input
            id="legalRepresentativeName"
            name="legalRepresentativeName"
            type="text"
            value={formData.legalRepresentativeName}
            onChange={handleChange}
          />
          <FieldError
            message={errors.legalRepresentativeName}
          />

          <label htmlFor="legalRepresentativeEmail">
            Adresse e-mail
          </label>
          <input
            id="legalRepresentativeEmail"
            name="legalRepresentativeEmail"
            type="email"
            value={formData.legalRepresentativeEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            inputMode="email"
            placeholder="nom@exemple.fr"
          />
          <FieldError
            message={errors.legalRepresentativeEmail}
          />

          <label htmlFor="legalRepresentativePhone">
            Téléphone
          </label>
          <input
            id="legalRepresentativePhone"
            name="legalRepresentativePhone"
            type="tel"
            value={formData.legalRepresentativePhone}
            onChange={handleChange}
            onBlur={handleBlur}
            inputMode="tel"
            placeholder="06 12 34 56 78"
          />
          <FieldError
            message={errors.legalRepresentativePhone}
          />
        </fieldset>
      )}

      <div className="form-actions">
        <button
          type="button"
          onClick={onPrevious}
        >
          Retour
        </button>

        <button type="submit">
          Continuer vers la santé
        </button>
      </div>
    </form>
  );
}
