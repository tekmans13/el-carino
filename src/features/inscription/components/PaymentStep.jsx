import { useState } from 'react';

import {
  createRegistration,
  updatePlannedPaymentMethods,
} from '../services/registrationService';

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

const MAIN_PAYMENT_METHODS = [
  {
    value: 'cash',
    label: 'Espèces',
    description: 'En une seule fois',
  },
  {
    value: 'check_1',
    label: 'Chèque',
    description: 'En 1 fois',
  },
  {
    value: 'check_2',
    label: 'Chèque',
    description: 'En 2 fois',
  },
  {
    value: 'check_3',
    label: 'Chèque',
    description: 'En 3 fois',
  },
];

const ADDITIONAL_PAYMENT_METHODS = [
  {
    value: 'caf',
    label: 'Coupons CAF',
  },
  {
    value: 'cjeune',
    label: 'C-Jeune',
  },
  {
    value: 'pass_sport',
    label: 'Pass’Sport',
  },
];

export default function PaymentStep({
  formData,
  medicalCertificate,
  clubSettings,
  view,
  onRegistrationSaved,
  onPrevious,
}) {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [registration, setRegistration] = useState(null);

  const [
    mainPaymentMethod,
    setMainPaymentMethod,
  ] = useState('');

  const [
    additionalPaymentMethods,
    setAdditionalPaymentMethods,
  ] = useState([]);

  const [
    savingPaymentMethod,
    setSavingPaymentMethod,
  ] = useState(false);

  const [
    paymentMethodError,
    setPaymentMethodError,
  ] = useState('');

  const [
    paymentMethodSaved,
    setPaymentMethodSaved,
  ] = useState(false);

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

  const hasPaymentMethod =
    Boolean(mainPaymentMethod)
    || additionalPaymentMethods.length > 0;

  function handleAdditionalPaymentMethod(method) {
    setAdditionalPaymentMethods((currentMethods) => {
      if (currentMethods.includes(method)) {
        return currentMethods.filter(
          (currentMethod) => currentMethod !== method,
        );
      }

      return [
        ...currentMethods,
        method,
      ];
    });
  }

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
      onRegistrationSaved();
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

  async function handleSavePaymentMethods() {
    if (
      savingPaymentMethod
      || !registration
      || !hasPaymentMethod
    ) {
      return;
    }

    try {
      setSavingPaymentMethod(true);
      setPaymentMethodError('');
      setPaymentMethodSaved(false);

      await updatePlannedPaymentMethods(
        registration.id,
        mainPaymentMethod,
        additionalPaymentMethods,
      );

      setPaymentMethodSaved(true);
    } catch (error) {
      setPaymentMethodError(
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue pendant l’enregistrement du règlement.',
      );
    } finally {
      setSavingPaymentMethod(false);
    }
  }

  if (view === 'payment' && registration) {
    return (
      <section className="payment-step">
        <section className="payment-price-card">
          <div>
            <span>Montant de votre cotisation</span>

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

        <section className="payment-method-card">
          <div className="payment-method-header">
            <h2>
              Comment souhaitez-vous régler ?
            </h2>

            <p>
              Vous pouvez associer des aides ou coupons
              à un règlement en espèces ou par chèque.
            </p>
          </div>

          <div className="payment-method-section">
            <div className="payment-method-section-header">
              <strong>Règlement principal</strong>

              <span>
                Espèces ou chèque
              </span>
            </div>

            <div className="payment-method-list">
              {MAIN_PAYMENT_METHODS.map((method) => (
                <label
                  key={method.value}
                  className={[
                    'payment-method-option',
                    mainPaymentMethod === method.value
                      ? 'is-selected'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <input
                    type="radio"
                    name="mainPaymentMethod"
                    value={method.value}
                    checked={
                      mainPaymentMethod === method.value
                    }
                    onChange={(event) =>
                      setMainPaymentMethod(
                        event.target.value,
                      )
                    }
                  />

                  <span>
                    <strong>{method.label}</strong>

                    <small>
                      {method.description}
                    </small>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="payment-method-section">
            <div className="payment-method-section-header">
              <strong>Aides et coupons</strong>

              <span>
                Plusieurs choix possibles
              </span>
            </div>

            <div className="payment-method-list payment-method-list-additional">
              {ADDITIONAL_PAYMENT_METHODS.map(
                (method) => {
                  const selected =
                    additionalPaymentMethods.includes(
                      method.value,
                    );

                  return (
                    <label
                      key={method.value}
                      className={[
                        'payment-method-option',
                        selected
                          ? 'is-selected'
                          : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <input
                        type="checkbox"
                        value={method.value}
                        checked={selected}
                        onChange={() =>
                          handleAdditionalPaymentMethod(
                            method.value,
                          )
                        }
                      />

                      <span>
                        <strong>
                          {method.label}
                        </strong>
                      </span>
                    </label>
                  );
                },
              )}
            </div>
          </div>
        </section>

        {paymentMethodError && (
          <section
            className="payment-error"
            role="alert"
          >
            <strong>
              Échec de l’enregistrement
            </strong>

            <p>{paymentMethodError}</p>
          </section>
        )}

        {paymentMethodSaved && (
          <section className="payment-success">
            Choix de règlement enregistré.
          </section>
        )}

        <div className="payment-information">
          <span aria-hidden="true">i</span>

          <p>
            Le règlement n’est pas effectué en ligne.
            Les règlements et justificatifs sont à
            remettre directement au club. Les chèques
            sont à établir à l’ordre de « ASC EL CARINO ».
            Les chèques vacances ne sont pas acceptés.
          </p>
        </div>

        <div className="payment-step-actions">
          <div />

          <button
            type="button"
            className="payment-submit-button"
            onClick={handleSavePaymentMethods}
            disabled={
              !hasPaymentMethod
              || savingPaymentMethod
            }
          >
            {savingPaymentMethod
              ? 'Enregistrement en cours…'
              : 'Valider mon choix de règlement'}
          </button>
        </div>
      </section>
    );
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
            Contrôlez les informations ci-dessous avant
            d’enregistrer votre inscription.
          </p>
        </div>
      </header>

      <section className="payment-summary-card">
        <header className="payment-summary-card-header">
          <span aria-hidden="true">1</span>

          <div>
            <h3>Profil</h3>
            <p>
              Type d’inscription et pratique choisie.
            </p>
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
            <p>
              Identité et coordonnées de l’adhérent.
            </p>
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
            <p>
              État du questionnaire et des documents.
            </p>
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

      {saveError && (
        <section
          className="payment-save-error"
          role="alert"
        >
          <strong>
            Échec de l’enregistrement
          </strong>

          <p>{saveError}</p>
        </section>
      )}

      <div className="payment-information">
        <span aria-hidden="true">i</span>

        <p>
          Après l’enregistrement de votre dossier,
          vous pourrez indiquer votre mode de règlement.
        </p>
      </div>

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

        <button
          type="button"
          className="payment-submit-button"
          onClick={handleSaveRegistration}
          disabled={saving}
        >
          {saving
            ? 'Enregistrement en cours…'
            : 'Enregistrer mon inscription'}
        </button>
      </div>
    </section>
  );
}
