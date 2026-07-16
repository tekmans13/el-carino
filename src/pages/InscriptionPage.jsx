import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import ContactStep from '../features/inscription/components/ContactStep';
import HealthStep from '../features/inscription/components/HealthStep';
import PaymentStep from '../features/inscription/components/PaymentStep';
import ProfileStep from '../features/inscription/components/ProfileStep';
import RegistrationProgress from '../features/inscription/components/RegistrationProgress';
import { useRegistrationForm } from '../features/inscription/hooks/useRegistrationForm';

import '../features/inscription/registration.css';
import '../features/inscription/components/registration-summary.css';

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
  maxStepReached,
  formData,
}) {
  const fullName = [
    formData.firstName,
    formData.lastName,
  ]
    .filter(Boolean)
    .join(' ');

  const profileCompleted =
    Boolean(formData.ageCategory)
    && Boolean(formData.practiceType);

  const contactCompleted = maxStepReached >= 3;
  const healthCompleted = maxStepReached >= 4;

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
          className={[
            'registration-summary-item',
            currentStep >= 1 ? 'is-active' : '',
            profileCompleted ? 'is-completed' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span className="registration-summary-number">
            {profileCompleted ? '✓' : '1'}
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
          className={[
            'registration-summary-item',
            currentStep >= 2 ? 'is-active' : '',
            contactCompleted ? 'is-completed' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span className="registration-summary-number">
            {contactCompleted ? '✓' : '2'}
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
          className={[
            'registration-summary-item',
            currentStep >= 3 ? 'is-active' : '',
            healthCompleted ? 'is-completed' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span className="registration-summary-number">
            {healthCompleted ? '✓' : '3'}
          </span>

          <div>
            <strong>Santé</strong>

            <span>
              {healthCompleted
                ? 'Étape complétée'
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
    </aside>
  );
}

export default function InscriptionPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);

  const pageRef = useRef(null);

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
      pageRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }, [currentStep]);

  function goToStep(stepNumber) {
    if (stepNumber > maxStepReached) {
      return;
    }

    setCurrentStep(stepNumber);
  }

  function completeStep(nextStep) {
    setMaxStepReached((currentMaximum) =>
      Math.max(currentMaximum, nextStep),
    );

    setCurrentStep(nextStep);
  }

  function handleReset() {
    resetForm();
    setCurrentStep(1);
    setMaxStepReached(1);
  }

  return (
    <main className="registration-page">
      <section
        ref={pageRef}
        className="registration-shell"
      >
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

        <RegistrationProgress
          currentStep={currentStep}
          maxStepReached={maxStepReached}
          onStepChange={goToStep}
        />

        <div className="registration-layout">
          <RegistrationSummary
            currentStep={currentStep}
            maxStepReached={maxStepReached}
            formData={formData}
          />

          <section className="registration-content">
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
                onNext={() => completeStep(2)}
              />
            )}

            {currentStep === 2 && (
              <ContactStep
                formData={formData}
                updateField={updateField}
                onPrevious={() => goToStep(1)}
                onNext={() => completeStep(3)}
              />
            )}

            {currentStep === 3 && (
              <HealthStep
                formData={formData}
                updateField={updateField}
                updateHealthAnswer={updateHealthAnswer}
                onPrevious={() => goToStep(2)}
                onNext={() => completeStep(4)}
              />
            )}

            {currentStep === 4 && (
              <PaymentStep
                formData={formData}
                onPrevious={() => goToStep(3)}
              />
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
