import { useState } from 'react';

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

function validateForm(formData) {
  const errors = {};

  const requiredFields = [
    ['firstName', 'Le prénom est obligatoire.'],
    ['lastName', 'Le nom est obligatoire.'],
    ['gender', 'Le sexe est obligatoire.'],
    ['birthDate', 'La date de naissance est obligatoire.'],
    ['email', 'L’adresse e-mail est obligatoire.'],
    ['phone', 'Le téléphone est obligatoire.'],
    ['addressLine1', 'L’adresse est obligatoire.'],
    ['postalCode', 'Le code postal est obligatoire.'],
    ['city', 'La ville est obligatoire.'],
    [
      'emergencyContactName',
      'Le contact d’urgence est obligatoire.',
    ],
    [
      'emergencyContactPhone',
      'Le téléphone du contact d’urgence est obligatoire.',
    ],
  ];

  requiredFields.forEach(([field, message]) => {
    if (!formData[field]?.trim()) {
      errors[field] = message;
    }
  });

  if (
    formData.email
    && !isValidEmail(formData.email)
  ) {
    errors.email =
      'Saisissez une adresse e-mail valide.';
  }

  if (
    formData.phone
    && !isValidFrenchPhone(formData.phone)
  ) {
    errors.phone =
      'Saisissez un numéro français valide, par exemple 06 12 34 56 78.';
  }

  if (
    formData.emergencyContactPhone
    && !isValidFrenchPhone(
      formData.emergencyContactPhone,
    )
  ) {
    errors.emergencyContactPhone =
      'Saisissez un numéro français valide.';
  }

  if (
    formData.birthDate
    && new Date(formData.birthDate) > new Date()
  ) {
    errors.birthDate =
      'La date de naissance ne peut pas être dans le futur.';
  }

  if (
    formData.postalCode
    && !/^\d{5}$/.test(formData.postalCode.trim())
  ) {
    errors.postalCode =
      'Le code postal doit contenir 5 chiffres.';
  }

  if (formData.ageCategory === 'enfant') {
    if (!formData.legalRepresentativeName?.trim()) {
      errors.legalRepresentativeName =
        'Le représentant légal est obligatoire.';
    }

    if (!formData.legalRepresentativeEmail?.trim()) {
      errors.legalRepresentativeEmail =
        'L’e-mail du représentant légal est obligatoire.';
    } else if (
      !isValidEmail(
        formData.legalRepresentativeEmail,
      )
    ) {
      errors.legalRepresentativeEmail =
        'Saisissez une adresse e-mail valide.';
    }

    if (!formData.legalRepresentativePhone?.trim()) {
      errors.legalRepresentativePhone =
        'Le téléphone du représentant légal est obligatoire.';
    } else if (
      !isValidFrenchPhone(
        formData.legalRepresentativePhone,
      )
    ) {
      errors.legalRepresentativePhone =
        'Saisissez un numéro français valide.';
    }
  }

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
}) {
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    updateField(name, value);

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm(formData);

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
            value={
              formData.legalRepresentativeName
            }
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
            value={
              formData.legalRepresentativeEmail
            }
            onChange={handleChange}
            inputMode="email"
            placeholder="nom@exemple.fr"
          />
          <FieldError
            message={
              errors.legalRepresentativeEmail
            }
          />

          <label htmlFor="legalRepresentativePhone">
            Téléphone
          </label>
          <input
            id="legalRepresentativePhone"
            name="legalRepresentativePhone"
            type="tel"
            value={
              formData.legalRepresentativePhone
            }
            onChange={handleChange}
            inputMode="tel"
            placeholder="06 12 34 56 78"
          />
          <FieldError
            message={
              errors.legalRepresentativePhone
            }
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
