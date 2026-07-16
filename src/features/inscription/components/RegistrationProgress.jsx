export default function RegistrationProgress({ currentStep }) {
  return (
    <nav aria-label="Progression de l’inscription">
      <p>
        Étape {currentStep} sur 4
      </p>

      <ol>
        <li aria-current={currentStep === 1 ? 'step' : undefined}>
          Profil
        </li>

        <li aria-current={currentStep === 2 ? 'step' : undefined}>
          Coordonnées
        </li>

        <li aria-current={currentStep === 3 ? 'step' : undefined}>
          Santé
        </li>

        <li aria-current={currentStep === 4 ? 'step' : undefined}>
          Paiement
        </li>
      </ol>
    </nav>
  );
}
