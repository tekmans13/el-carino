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
    ['emergencyContactName', 'Le contact d’urgence est obligatoire.'],
    ['emergencyContactPhone', 'Le téléphone du contact d’urgence est obligatoire.'],
  ];

  requiredFields.forEach(([field, message]) => {
    if (!formData[field].trim()) {
      errors[field] = message;
    }
  });

  if (
    formData.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  ) {
    errors.email = 'Adresse e-mail invalide.';
  }

  if (
    formData.birthDate &&
    new Date(formData.birthDate) > new Date()
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

  return (
    <p
      role="alert"
      style={{ color: 'red', marginTop: 4 }}
    >
      {message}
    </p>
  );
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

    setErrors((current) => ({
      ...current,
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

        <label>Nom</label>
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
        <FieldError message={errors.lastName} />

        <label>Prénom</label>
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
        <FieldError message={errors.firstName} />

        <label>Sexe</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Sélectionner</option>
          <option value="homme">Homme</option>
          <option value="femme">Femme</option>
          <option value="autre">Autre</option>
        </select>
        <FieldError message={errors.gender} />

        <label>Date de naissance</label>
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
        />
        <FieldError message={errors.birthDate} />
      </fieldset>

      <fieldset>
        <legend>Coordonnées</legend>

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <FieldError message={errors.email} />

        <label>Téléphone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <FieldError message={errors.phone} />

        <label>Adresse</label>
        <input
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleChange}
        />
        <FieldError message={errors.addressLine1} />

        <label>Complément</label>
        <input
          name="addressLine2"
          value={formData.addressLine2}
          onChange={handleChange}
        />

        <label>Code postal</label>
        <input
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
        />
        <FieldError message={errors.postalCode} />

        <label>Ville</label>
        <input
          name="city"
          value={formData.city}
          onChange={handleChange}
        />
        <FieldError message={errors.city} />
      </fieldset>

      <fieldset>
        <legend>Contact d'urgence</legend>

        <label>Nom</label>
        <input
          name="emergencyContactName"
          value={formData.emergencyContactName}
          onChange={handleChange}
        />
        <FieldError message={errors.emergencyContactName} />

        <label>Téléphone</label>
        <input
          name="emergencyContactPhone"
          value={formData.emergencyContactPhone}
          onChange={handleChange}
        />
        <FieldError message={errors.emergencyContactPhone} />
      </fieldset>

      {formData.ageCategory === 'enfant' && (
        <fieldset>
          <legend>Représentant légal</legend>

          <label>Nom</label>
          <input
            name="legalRepresentativeName"
            value={formData.legalRepresentativeName}
            onChange={handleChange}
          />
          <FieldError
            message={errors.legalRepresentativeName}
          />

          <label>Email</label>
          <input
            type="email"
            name="legalRepresentativeEmail"
            value={formData.legalRepresentativeEmail}
            onChange={handleChange}
          />
          <FieldError
            message={errors.legalRepresentativeEmail}
          />

          <label>Téléphone</label>
          <input
            type="tel"
            name="legalRepresentativePhone"
            value={formData.legalRepresentativePhone}
            onChange={handleChange}
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
          Continuer
        </button>
      </div>
    </form>
  );
}
