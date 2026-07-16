import './registration-progress.css';

const STEPS = [
  {
    number: 1,
    label: 'Inscription',
    description: 'Type de profil',
  },
  {
    number: 2,
    label: 'Informations',
    description: 'Coordonnées',
  },
  {
    number: 3,
    label: 'Santé',
    description: 'Questionnaire',
  },
  {
    number: 4,
    label: 'Paiement',
    description: 'Récapitulatif',
  },
];

export default function RegistrationProgress({
  currentStep,
  maxStepReached,
  onStepChange,
}) {
  const progressPercent =
    ((maxStepReached - 1) / (STEPS.length - 1)) * 100;

  function handleStepClick(stepNumber) {
    if (stepNumber <= maxStepReached) {
      onStepChange(stepNumber);
    }
  }

  return (
    <nav
      className="registration-stepper"
      aria-label="Progression de l’inscription"
      style={{
        '--stepper-progress': `${progressPercent}%`,
      }}
    >
      <ol className="registration-stepper-list">
        {STEPS.map((step) => {
          const isCurrent = step.number === currentStep;
          const isCompleted = step.number < maxStepReached;
          const isAccessible = step.number <= maxStepReached;

          return (
            <li
              key={step.number}
              className={[
                'registration-stepper-item',
                isCurrent ? 'is-current' : '',
                isCompleted ? 'is-completed' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <button
                type="button"
                className="registration-stepper-button"
                disabled={!isAccessible}
                aria-current={isCurrent ? 'step' : undefined}
                onClick={() => handleStepClick(step.number)}
              >
                <span
                  className="registration-stepper-marker"
                  aria-hidden="true"
                >
                  {isCompleted ? '✓' : step.number}
                </span>

                <span className="registration-stepper-label">
                  {step.label}
                </span>

                <span className="registration-stepper-description">
                  {step.description}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
