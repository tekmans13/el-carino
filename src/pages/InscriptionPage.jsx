import { useState } from 'react';
import { Link } from 'react-router-dom';

import ContactStep from '../features/inscription/components/ContactStep';
import ProfileStep from '../features/inscription/components/ProfileStep';
import RegistrationProgress from '../features/inscription/components/RegistrationProgress';
import { useRegistrationForm } from '../features/inscription/hooks/useRegistrationForm';

export default function InscriptionPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const {
    formData,
    updateField,
    resetForm,
  } = useRegistrationForm();

  return (
    <main>
      <h1>Inscription</h1>

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
        <section>
          <h2>Santé et autorisations</h2>

          <p>
            Cette étape sera développée dans le prochain commit.
          </p>

          <button
            type="button"
            onClick={() => setCurrentStep(2)}
          >
            Retour
          </button>
        </section>
      )}

      <hr />

      <button
        type="button"
        onClick={() => {
          resetForm();
          setCurrentStep(1);
        }}
      >
        Effacer le formulaire
      </button>

      <p>
        <Link to="/">Retour à l’accueil</Link>
      </p>
    </main>
  );
}
