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
}) {
  return (
    <nav
      className="registration-progress"
      aria-label="Progression de l’inscription"
    >
      <ol className="registration-progress-list">
        {STEPS.map((step, index) => {
          const isCurrent = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <li
              key={step.number}
              className={[
                'registration-progress-item',
                isCurrent ? 'is-current' : '',
                isCompleted ? 'is-completed' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div className="registration-progress-marker-row">
                {index > 0 && (
                  <span
                    className="registration-progress-line registration-progress-line-before"
                    aria-hidden="true"
                  />
                )}

                <span
                  className="registration-progress-marker"
                  aria-hidden="true"
                >
                  {isCompleted ? '✓' : step.number}
                </span>

                {index < STEPS.length - 1 && (
                  <span
                    className="registration-progress-line registration-progress-line-after"
                    aria-hidden="true"
                  />
                )}
              </div>

              <span className="registration-progress-label">
                {step.label}
              </span>

              <span className="registration-progress-description">
                {step.description}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
