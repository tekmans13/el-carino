import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import ContactStep from '../features/inscription/components/ContactStep';
import HealthStep from '../features/inscription/components/HealthStep';
import ProfileStep from '../features/inscription/components/ProfileStep';
import RegistrationProgress from '../features/inscription/components/RegistrationProgress';
import { useRegistrationForm } from '../features/inscription/hooks/useRegistrationForm';

import '../features/inscription/registration.css';

export default function InscriptionPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const {
    formData,
    updateField,
    updateHealthAnswer,
    resetForm,
  } = useRegistrationForm();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [currentStep]);

  function handleHealthNext() {
    setCurrentStep(4);
  }

  return (
    <main className="registration-page">
      <section className="registration-card">
        <header className="registration-header">
          <p className="registration-kicker">
            El Carino
          </p>

          <h1>Inscription au club</h1>

          <p>
            Complétez votre dossier en quelques étapes.
          </p>
        </header>

        <RegistrationProgress currentStep={currentStep} />

        {currentStep === 1 && (
          <ProfileStep
            formData={formData}
            updateField={updateField}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <ContactStep
            formData={formData}
            updateField={updateField}
            onPrevious={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 3 && (
          <HealthStep
            formData={formData}
            updateField={updateField}
            updateHealthAnswer={updateHealthAnswer}
            onPrevious={() => setCurrentStep(2)}
            onNext={handleHealthNext}
          />
        )}

        {currentStep === 4 && (
          <section>
            <h2>Paiement</h2>

            <p>
              L’intégration du paiement sera réalisée
              dans le prochain lot.
            </p>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
              >
                Retour
              </button>
            </div>
          </section>
        )}

        <footer className="registration-footer">
          <button
            type="button"
            onClick={() => {
              resetForm();
              setCurrentStep(1);

              window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant',
              });
            }}
          >
            Recommencer
          </button>

          <Link to="/">
            Retour à l’accueil
          </Link>
        </footer>
      </section>
    </main>
  );
}
