import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import ContactStep from '../features/inscription/components/ContactStep';
import HealthStep from '../features/inscription/components/HealthStep';
import ProfileStep from '../features/inscription/components/ProfileStep';
import RegistrationProgress from '../features/inscription/components/RegistrationProgress';
import { useRegistrationForm } from '../features/inscription/hooks/useRegistrationForm';

import '../features/inscription/registration.css';

const STEP_TITLES = {
  1: 'Bienvenue !',
  2: 'Informations personnelles',
  3: 'Santé et autorisations',
  4: 'Paiement et récapitulatif',
};

function formatProfileValue(value) {
  const labels = {
    adulte: 'Adulte',
    enfant: 'Enfant',
    loisir: 'Loisir',
    competition: 'Compétition',
  };

  return labels[value] ?? 'Non renseigné';
}

function RegistrationSummary({
  currentStep,
  formData,
}) {
  const fullName = [
    formData.firstName,
    formData.lastName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <aside className="registration-summary">
      <div className="registration-summary-header">
        <p className="registration-summary-kicker">
          Récapitulatif
        </p>

        <h2>Votre inscription</h2>
      </div>

      <ol className="registration-summary-list">
        <li
          className={
            currentStep >= 1
              ? 'registration-summary-item is-active'
              : 'registration-summary-item'
          }
        >
          <span className="registration-summary-number">
            {currentStep > 1 ? '✓' : '1'}
          </span>

          <div>
            <strong>Profil</strong>

            <span>
              {formatProfileValue(formData.ageCategory)}
            </span>

            <span>
              {formatProfileValue(formData.practiceType)}
            </span>
          </div>
        </li>

        <li
          className={
            currentStep >= 2
              ? 'registration-summary-item is-active'
              : 'registration-summary-item'
          }
        >
          <span className="registration-summary-number">
            {currentStep > 2 ? '✓' : '2'}
          </span>

          <div>
            <strong>Coordonnées</strong>

            <span>
              {fullName || 'À compléter'}
            </span>

            <span>
              {formData.email || 'Adresse e-mail'}
            </span>
          </div>
        </li>

        <li
          className={
            currentStep >= 3
              ? 'registration-summary-item is-active'
              : 'registration-summary-item'
          }
        >
          <span className="registration-summary-number">
            {currentStep > 3 ? '✓' : '3'}
          </span>

          <div>
            <strong>Santé</strong>

            <span>
              {formData.healthQuestionnaireCompleted
                ? 'Questionnaire complété'
                : 'À compléter'}
            </span>
          </div>
        </li>

        <li
          className={
            currentStep >= 4
              ? 'registration-summary-item is-active'
              : 'registration-summary-item'
          }
        >
          <span className="registration-summary-number">
            4
          </span>

          <div>
            <strong>Paiement</strong>
            <span>À venir</span>
          </div>
        </li>
      </ol>

      <div className="registration-security-card">
        <span
          className="registration-security-icon"
          aria-hidden="true"
        >
          ✓
        </span>

        <div>
          <strong>Vos données sont protégées</strong>

          <p>
            Les informations collectées sont utilisées
            uniquement pour gérer votre inscription.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default function InscriptionPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const contentRef = useRef(null);

  const {
    formData,
    updateField,
    updateHealthAnswer,
    resetForm,
  } = useRegistrationForm();

  const stepTitle = useMemo(
    () => STEP_TITLES[currentStep],
    [currentStep],
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      contentRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }, [currentStep]);

  function goToStep(step) {
    setCurrentStep(step);
  }

  function handleReset() {
    resetForm();
    setCurrentStep(1);
  }

  return (
    <main className="registration-page">
      <section className="registration-shell">
        <header className="registration-topbar">
          <Link
            className="registration-brand"
            to="/"
            aria-label="Retour à l’accueil"
          >
            <span
              className="registration-brand-mark"
              aria-hidden="true"
            >
              EC
            </span>

            <span>
              <strong>El Carino</strong>
              <small>Boxe thaï</small>
            </span>
          </Link>

          <div className="registration-help">
            <span>Besoin d’aide ?</span>

            <a href="tel:+33400000000">
              04 00 00 00 00
            </a>
          </div>
        </header>

        <RegistrationProgress currentStep={currentStep} />

        <div className="registration-layout">
          <RegistrationSummary
            currentStep={currentStep}
            formData={formData}
          />

          <section
            ref={contentRef}
            className="registration-content"
          >
            <header className="registration-content-header">
              <p className="registration-step-kicker">
                Étape {currentStep} sur 4
              </p>

              <h1>{stepTitle}</h1>

              {currentStep === 1 && (
                <p>
                  Sélectionnez le profil qui correspond à
                  la personne qui pratiquera au club.
                </p>
              )}

              {currentStep === 2 && (
                <p>
                  Renseignez les coordonnées nécessaires
                  à la constitution du dossier.
                </p>
              )}

              {currentStep === 3 && (
                <p>
                  Complétez les informations médicales et
                  les autorisations obligatoires.
                </p>
              )}

              {currentStep === 4 && (
                <p>
                  Vérifiez votre dossier avant de procéder
                  au règlement.
                </p>
              )}
            </header>

            {currentStep === 1 && (
              <ProfileStep
                formData={formData}
                updateField={updateField}
                onNext={() => goToStep(2)}
              />
            )}

            {currentStep === 2 && (
              <ContactStep
                formData={formData}
                updateField={updateField}
                onPrevious={() => goToStep(1)}
                onNext={() => goToStep(3)}
              />
            )}

            {currentStep === 3 && (
              <HealthStep
                formData={formData}
                updateField={updateField}
                updateHealthAnswer={updateHealthAnswer}
                onPrevious={() => goToStep(2)}
                onNext={() => goToStep(4)}
              />
            )}

            {currentStep === 4 && (
              <section className="payment-placeholder">
                <div className="payment-placeholder-icon">
                  €
                </div>

                <h2>Paiement à venir</h2>

                <p>
                  Le paiement HelloAsso sera intégré dans
                  le prochain lot.
                </p>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => goToStep(3)}
                  >
                    Retour
                  </button>
                </div>
              </section>
            )}
          </section>
        </div>

        <footer className="registration-bottom-bar">
          <button
            type="button"
            className="registration-reset-button"
            onClick={handleReset}
          >
            Recommencer
          </button>

          <div className="registration-footer-links">
            <span>Club affilié FFKMDA</span>

            <Link to="/">
              Retour à l’accueil
            </Link>
          </div>
        </footer>
      </section>
    </main>
  );
}
