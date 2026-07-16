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
  onPrevious,
}) {
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
    formData.ageCategory === 'adulte'
      && formData.practiceType === 'competition'
    || formData.healthQuestionnaireHasPositiveAnswer;

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
            Contrôlez les informations avant de procéder
            au paiement de l’inscription.
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
            value={[
              formData.addressLine1,
              formData.addressLine2,
              formData.postalCode,
              formData.city,
            ]
              .filter(Boolean)
              .join(', ') || 'Non renseignée'}
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

          <p>
            Le tarif sera récupéré depuis les paramètres
            administrables de la saison.
          </p>
        </div>

        <strong>À définir</strong>
      </section>

      <div className="payment-information">
        <span aria-hidden="true">i</span>

        <p>
          Le paiement en ligne sera activé lorsque les
          tarifs et la configuration Stripe seront ajoutés.
        </p>
      </div>

      <div className="payment-step-actions">
        <button
          type="button"
          className="payment-back-button"
          onClick={onPrevious}
        >
          <span aria-hidden="true">←</span>
          Retour
        </button>

        <button
          type="button"
          className="payment-submit-button"
          disabled
        >
          Payer l’inscription
        </button>
      </div>
    </section>
  );
}
