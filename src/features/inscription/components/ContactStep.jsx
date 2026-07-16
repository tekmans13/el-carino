import { useState } from 'react';

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
    if (!formData[field].trim()) {
      errors[field] = message;
    }
  });

  if (
    formData.email
    && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  ) {
    errors.email = 'L’adresse e-mail est invalide.';
  }

  if (
    formData.birthDate
    && new Date(formData.birthDate) > new Date()
  ) {
    errors.birthDate =
      'La date de naissance ne peut pas être dans le futur.';
  }

  if (formData.ageCategory === 'enfant') {
    if (!formData.legalRepresentativeName.trim()) {
      errors.legalRepresentativeName =
        'Le représentant légal est obligatoire.';
    }

    if (!formData.legalRepresentativeEmail.trim()) {
      errors.legalRepresentativeEmail =
        'L’e-mail du représentant légal est obligatoire.';
    }

    if (!formData.legalRepresentativePhone.trim()) {
      errors.legalRepresentativePhone =
        'Le téléphone du représentant légal est obligatoire.';
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
          value={formData.lastName}
          onChange={handleChange}
          autoComplete="family-name"
        />
        <FieldError message={errors.lastName} />

        <label htmlFor="firstName">Prénom</label>
        <input
          id="firstName"
          name="firstName"
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

        <label htmlFor="birthDate">Date de naissance</label>
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

        <label htmlFor="email">Adresse e-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
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
        />
        <FieldError message={errors.phone} />

        <label htmlFor="addressLine1">Adresse</label>
        <input
          id="addressLine1"
          name="addressLine1"
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
          value={formData.addressLine2}
          onChange={handleChange}
          autoComplete="address-line2"
        />

        <label htmlFor="postalCode">Code postal</label>
        <input
          id="postalCode"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          inputMode="numeric"
          autoComplete="postal-code"
        />
        <FieldError message={errors.postalCode} />

        <label htmlFor="city">Ville</label>
        <input
          id="city"
          name="city"
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
          value={formData.emergencyContactName}
          onChange={handleChange}
        />
        <FieldError message={errors.emergencyContactName} />

        <label htmlFor="emergencyContactPhone">
          Téléphone
        </label>
        <input
          id="emergencyContactPhone"
          name="emergencyContactPhone"
          type="tel"
          value={formData.emergencyContactPhone}
          onChange={handleChange}
        />
        <FieldError message={errors.emergencyContactPhone} />
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
          />
          <FieldError
            message={errors.legalRepresentativePhone}
          />
        </fieldset>
      )}

      <div>
        <button type="button" onClick={onPrevious}>
          Retour
        </button>

        <button type="submit">
          Continuer vers la santé
        </button>
      </div>
    </form>
  );
}
