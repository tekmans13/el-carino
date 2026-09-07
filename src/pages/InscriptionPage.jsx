import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import ContactStep from '../features/inscription/components/ContactStep';
import HealthStep from '../features/inscription/components/HealthStep';
import PaymentStep from '../features/inscription/components/PaymentStep';
import ProfileStep from '../features/inscription/components/ProfileStep';
import RegistrationProgress from '../features/inscription/components/RegistrationProgress';
import { useRegistrationForm } from '../features/inscription/hooks/useRegistrationForm';
import { getClubSettings } from '../features/inscription/services/clubSettingsService';

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
  step4View,
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

  const paymentCompleted =
    step4View === 'confirmation';

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
              {formatProfileValue(
                formData.ageCategory,
              )}
            </span>

            <span>
              {formatProfileValue(
                formData.practiceType,
              )}
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
          className={[
            'registration-summary-item',
            currentStep >= 4 ? 'is-active' : '',
            paymentCompleted ? 'is-completed' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span className="registration-summary-number">
            {paymentCompleted ? '✓' : '4'}
          </span>

          <div>
            <strong>Paiement</strong>

            <span>
              {paymentCompleted
                ? 'Choix enregistré'
                : 'À venir'}
            </span>
          </div>
        </li>
      </ol>
    </aside>
  );
}

export default function InscriptionPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const [maxStepReached, setMaxStepReached] =
    useState(1);

  const [step4View, setStep4View] =
    useState('summary');

  const [clubSettings, setClubSettings] =
    useState(null);

  const [settingsLoading, setSettingsLoading] =
    useState(true);

  const [settingsError, setSettingsError] =
    useState('');

  const [
    medicalCertificate,
    setMedicalCertificate,
  ] = useState(null);

  const [
    paiProtocol,
    setPaiProtocol,
  ] = useState(null);

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
  }, [currentStep, step4View]);

  useEffect(() => {
    let active = true;

    async function loadClubSettings() {
      try {
        setSettingsLoading(true);
        setSettingsError('');

        const settings = await getClubSettings();

        if (active) {
          setClubSettings(settings);
        }
      } catch (error) {
        if (active) {
          setSettingsError(
            error instanceof Error
              ? error.message
              : 'Impossible de charger les paramètres du club.',
          );
        }
      } finally {
        if (active) {
          setSettingsLoading(false);
        }
      }
    }

    loadClubSettings();

    return () => {
      active = false;
    };
  }, []);

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
    setMedicalCertificate(null);
    setPaiProtocol(null);
    setCurrentStep(1);
    setMaxStepReached(1);
    setStep4View('summary');
  }

  return (
    <main className="registration-page">
      <section
        ref={pageRef}
        className="registration-shell"
      >
        <header className="registration-topbar">
          <div className="registration-brand">
            <img
              className="registration-brand-logo"
              src="/logo-elcarino.jpg"
              alt="El Carino Muay Thai"
            />

            <span>
              <strong>El Carino</strong>
              <small>Boxe thaï</small>
            </span>
          </div>

          <div className="registration-help">
            <strong>
              <span>Prêt pour l'inscription ?</span>
            </strong>

            <span>
              Le processus est simple, rapide et conçu
              pour être accessible à tous.
            </span>
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
            step4View={step4View}
          />

          <section className="registration-content">
            <header className="registration-content-header">
              <p className="registration-step-kicker">
                Étape {currentStep} sur 4
              </p>

              <h1>
                {currentStep === 4
                  ? step4View === 'confirmation'
                    ? 'Inscription enregistrée'
                    : step4View === 'payment'
                      ? 'Règlement'
                      : 'Récapitulatif'
                  : stepTitle}
              </h1>

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

              {currentStep === 4
                && step4View === 'summary' && (
                  <p>
                    Vérifiez votre dossier avant
                    d’enregistrer votre inscription.
                  </p>
                )}

              {currentStep === 4
                && step4View === 'payment' && (
                  <p>
                    Indiquez comment vous prévoyez de
                    régler votre cotisation.
                  </p>
                )}

              {currentStep === 4
                && step4View === 'confirmation' && (
                  <p>
                    Votre inscription a bien été prise en
                    compte.
                  </p>
                )}
            </header>

            {settingsLoading && (
              <div className="payment-information">
                <span aria-hidden="true">i</span>

                <p>
                  Chargement des paramètres du club…
                </p>
              </div>
            )}

            {settingsError && (
              <section
                className="payment-save-error"
                role="alert"
              >
                <strong>
                  Impossible de démarrer l’inscription
                </strong>

                <p>{settingsError}</p>
              </section>
            )}

            {clubSettings && currentStep === 1 && (
              <ProfileStep
                formData={formData}
                updateField={updateField}
                adultAgeThreshold={
                  clubSettings.adult_age_threshold
                }
                onNext={() => completeStep(2)}
              />
            )}

            {clubSettings && currentStep === 2 && (
              <ContactStep
                formData={formData}
                updateField={updateField}
                adultAgeThreshold={
                  clubSettings.adult_age_threshold
                }
                onPrevious={() => goToStep(1)}
                onNext={() => completeStep(3)}
              />
            )}

            {clubSettings && currentStep === 3 && (
              <HealthStep
                formData={formData}
                updateField={updateField}
                updateHealthAnswer={updateHealthAnswer}
                medicalCertificate={
                  medicalCertificate
                }
                onMedicalCertificateChange={
                  setMedicalCertificate
                }
                paiProtocol={paiProtocol}
                onPaiProtocolChange={
                  setPaiProtocol
                }
                onPrevious={() => goToStep(2)}
                onNext={() => completeStep(4)}
              />
            )}

            {clubSettings && currentStep === 4 && (
              <PaymentStep
                formData={formData}
                medicalCertificate={
                  medicalCertificate
                }
                paiProtocol={paiProtocol}
                clubSettings={clubSettings}
                view={step4View}
                onRegistrationSaved={() =>
                  setStep4View('payment')
                }
                onPaymentSaved={() =>
                  setStep4View('confirmation')
                }
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
          </div>
        </footer>
      </section>
    </main>
  );
}
