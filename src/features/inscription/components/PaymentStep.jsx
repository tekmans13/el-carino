import { useState } from 'react';

import { createRegistration } from '../services/registrationService';

import {
  formatEuroFromCents,
  getRegistrationPricing,
} from '../utils/registrationPricing';

import './payment-step.css';

function formatValue(value, labels = {}) {
  if (!value) {
    return 'Non renseigné';
  }

  return labels[value] ?? value;
}

function SummaryRow({ label, value }) {
  return (
    <div className="payment-summary-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function PaymentStep({
  formData,
  medicalCertificate,
  clubSettings,
  onPrevious,
}) {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [registration, setRegistration] = useState(null);

  const fullName = [
    formData.firstName,
    formData.lastName,
  ]
    .filter(Boolean)
    .join(' ');

  const profileLabels = {
    enfant: 'Enfant',
    adulte: 'Adulte',
  };

  const practiceLabels = {
    loisir: 'Loisir',
    competition: 'Compétition',
  };

  const genderLabels = {
    femme: 'Femme',
    homme: 'Homme',
    autre: 'Autre',
  };

  const imageConsentLabels = {
    accepted: 'Autorisé',
    refused: 'Refusé',
  };

  const certificateRequired =
    (
      formData.ageCategory === 'adulte'
      && formData.practiceType === 'competition'
    )
    || formData.healthQuestionnaireHasPositiveAnswer;

  const pricing = getRegistrationPricing(
    formData,
    clubSettings,
  );

  async function handleSaveRegistration() {
    if (saving || registration) {
      return;
    }

    try {
      setSaving(true);
      setSaveError('');

      const createdRegistration =
        await createRegistration(
          formData,
          medicalCertificate,
        );

      setRegistration(createdRegistration);
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue pendant l’enregistrement.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="payment-step">
      <header className="payment-step-header">
        <span
          className="payment-step-header-icon"
          aria-hidden="true"
        >
          ✓
        </span>

        <div>
          <h2>Vérifiez votre dossier</h2>

          <p>
            Contrôlez les informations avant d’enregistrer
            le dossier et de procéder au paiement.
          </p>
        </div>
      </header>

      <section className="payment-summary-card">
        <header className="payment-summary-card-header">
          <span aria-hidden="true">1</span>

          <div>
            <h3>Profil</h3>
            <p>Type d’inscription et pratique choisie.</p>
          </div>
        </header>

        <div className="payment-summary-content">
          <SummaryRow
            label="Catégorie"
            value={formatValue(
              formData.ageCategory,
              profileLabels,
            )}
          />

          <SummaryRow
            label="Pratique"
            value={formatValue(
              formData.practiceType,
              practiceLabels,
            )}
          />
        </div>
      </section>

      <section className="payment-summary-card">
        <header className="payment-summary-card-header">
          <span aria-hidden="true">2</span>

          <div>
            <h3>Informations personnelles</h3>
            <p>Identité et coordonnées de l’adhérent.</p>
          </div>
        </header>

        <div className="payment-summary-content">
          <SummaryRow
            label="Nom et prénom"
            value={fullName || 'Non renseigné'}
          />

          <SummaryRow
            label="Sexe"
            value={formatValue(
              formData.gender,
              genderLabels,
            )}
          />

          <SummaryRow
            label="Date de naissance"
            value={formatValue(formData.birthDate)}
          />

          <SummaryRow
            label="Adresse e-mail"
            value={formatValue(formData.email)}
          />

          <SummaryRow
            label="Téléphone"
            value={formatValue(formData.phone)}
          />

          <SummaryRow
            label="Adresse"
            value={
              [
                formData.addressLine1,
                formData.addressLine2,
                formData.postalCode,
                formData.city,
              ]
                .filter(Boolean)
                .join(', ')
              || 'Non renseignée'
            }
          />
        </div>
      </section>

      <section className="payment-summary-card">
        <header className="payment-summary-card-header">
          <span aria-hidden="true">3</span>

          <div>
            <h3>Santé et autorisations</h3>
            <p>État du questionnaire et des documents.</p>
          </div>
        </header>

        <div className="payment-summary-content">
          <SummaryRow
            label="Questionnaire de santé"
            value={
              formData.healthQuestionnaireCompleted
                ? 'Complété'
                : certificateRequired
                  ? 'Non requis'
                  : 'À vérifier'
            }
          />

          <SummaryRow
            label="Certificat médical"
            value={
              certificateRequired
                ? 'Obligatoire'
                : 'Non requis'
            }
          />

          <SummaryRow
            label="Autorisation parentale"
            value={
              formData.ageCategory === 'enfant'
                ? formData.parentalAuthorization
                  ? 'Acceptée'
                  : 'Non acceptée'
                : 'Non concerné'
            }
          />

          <SummaryRow
            label="Droit à l’image"
            value={formatValue(
              formData.imageConsent,
              imageConsentLabels,
            )}
          />
        </div>
      </section>

      <section className="payment-price-card">
        <div>
          <span>Montant de l’inscription</span>

          {pricing ? (
            <p>
              {pricing.isAdult
                ? 'Cotisation adulte'
                : 'Cotisation mineur'}
              {' : '}
              {formatEuroFromCents(
                pricing.baseFeeCents,
              )}

              {pricing.licenseFeeCents > 0 && (
                <>
                  {' + licence fédérale : '}
                  {formatEuroFromCents(
                    pricing.licenseFeeCents,
                  )}
                </>
              )}
            </p>
          ) : (
            <p>
              Impossible de calculer le tarif.
            </p>
          )}
        </div>

        <strong>
          {pricing
            ? formatEuroFromCents(
              pricing.totalCents,
            )
            : 'À calculer'}
        </strong>
      </section>

      {registration && (
        <section
          className="payment-save-success"
          aria-live="polite"
        >
          <span aria-hidden="true">✓</span>

          <div>
            <strong>Dossier enregistré</strong>

            <p>
              Référence :
              {' '}
              <code>{registration.id}</code>
            </p>
          </div>
        </section>
      )}

      {saveError && (
        <section
          className="payment-save-error"
          role="alert"
        >
          <strong>Échec de l’enregistrement</strong>
          <p>{saveError}</p>
        </section>
      )}

      {!registration && (
        <div className="payment-information">
          <span aria-hidden="true">i</span>

          <p>
            Enregistrez le dossier. Le règlement sera
            ensuite suivi manuellement par le bureau.
          </p>
        </div>
      )}

      <div className="payment-step-actions">
        <button
          type="button"
          className="payment-back-button"
          onClick={onPrevious}
          disabled={saving}
        >
          <span aria-hidden="true">←</span>
          Retour
        </button>

        {!registration ? (
          <button
            type="button"
            className="payment-submit-button"
            onClick={handleSaveRegistration}
            disabled={saving}
          >
            {saving
              ? 'Enregistrement en cours…'
              : 'Enregistrer le dossier'}
          </button>
        ) : (
          <button
            type="button"
            className="payment-submit-button"
            disabled
          >
            Dossier enregistré
          </button>
        )}
      </div>
    </section>
  );
}
