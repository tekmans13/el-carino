import './profile-step.css';

function ChildIllustration() {
  return (
    <svg
      className="profile-choice-illustration"
      viewBox="0 0 160 160"
      role="img"
      aria-label="Illustration d’un enfant"
    >
      <circle cx="80" cy="80" r="68" fill="#fff0f1" />

      <path
        d="M48 68c2-28 18-43 34-43 23 0 38 16 36 43"
        fill="#172033"
      />

      <circle cx="80" cy="72" r="35" fill="#ffd9c7" />

      <path
        d="M45 66c5-29 19-42 38-42 18 0 32 11 36 32-11-2-20-8-27-17-8 14-24 23-47 27Z"
        fill="#172033"
      />

      <circle cx="67" cy="72" r="3" fill="#172033" />
      <circle cx="93" cy="72" r="3" fill="#172033" />

      <path
        d="M70 88c6 6 14 6 20 0"
        fill="none"
        stroke="#b75f54"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <path
        d="M43 145c4-29 19-43 37-43 21 0 34 14 38 43"
        fill="#cf2028"
      />

      <path
        d="M66 105l14 17 14-17"
        fill="#ffffff"
        opacity="0.9"
      />
    </svg>
  );
}

function AdultIllustration() {
  return (
    <svg
      className="profile-choice-illustration"
      viewBox="0 0 160 160"
      role="img"
      aria-label="Illustration d’un adulte"
    >
      <circle cx="80" cy="80" r="68" fill="#f1f4f8" />

      <circle cx="80" cy="69" r="34" fill="#f0c6ad" />

      <path
        d="M48 65c1-29 17-44 34-44 23 0 37 16 35 41-12-2-22-8-30-19-8 10-20 18-39 22Z"
        fill="#172033"
      />

      <circle cx="67" cy="70" r="3" fill="#172033" />
      <circle cx="93" cy="70" r="3" fill="#172033" />

      <path
        d="M70 86c6 5 14 5 20 0"
        fill="none"
        stroke="#95584b"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <path
        d="M41 145c4-31 20-46 39-46 22 0 36 15 40 46"
        fill="#172033"
      />

      <path
        d="M64 103l16 19 16-19"
        fill="#ffffff"
      />
    </svg>
  );
}

function LeisureIllustration() {
  return (
    <svg
      className="practice-choice-icon"
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="29" fill="#fff0f1" />

      <path
        d="M20 18h24v8c0 9-5 15-12 15s-12-6-12-15v-8Z"
        fill="none"
        stroke="#c91f26"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      <path
        d="M20 22h-7v5c0 6 4 10 10 10M44 22h7v5c0 6-4 10-10 10"
        fill="none"
        stroke="#c91f26"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M32 41v8M23 53h18"
        fill="none"
        stroke="#c91f26"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CompetitionIllustration() {
  return (
    <svg
      className="practice-choice-icon"
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="29" fill="#f1f4f8" />

      <path
        d="M17 38c2-9 8-17 16-22l8 2 6 9-4 12-10 7-12-2-4-6Z"
        fill="none"
        stroke="#172033"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      <path
        d="M33 16l2 11M25 25l10 2M43 39l6 7"
        fill="none"
        stroke="#172033"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SelectionIndicator({ selected }) {
  return (
    <span
      className={
        selected
          ? 'profile-selection-indicator is-selected'
          : 'profile-selection-indicator'
      }
      aria-hidden="true"
    >
      {selected ? '✓' : ''}
    </span>
  );
}

export default function ProfileStep({
  formData,
  updateField,
  onNext,
}) {
  const canContinue =
    formData.ageCategory !== ''
    && formData.practiceType !== '';

  function handleSubmit(event) {
    event.preventDefault();

    if (canContinue) {
      onNext();
    }
  }

  return (
    <form
      className="profile-step"
      onSubmit={handleSubmit}
    >
      <section className="profile-choice-section">
        <h2 className="profile-choice-title">
          <span aria-hidden="true">♙</span>
          Qui souhaitez-vous inscrire ?
        </h2>

        <div className="profile-choice-grid">
          <label
            className={
              formData.ageCategory === 'enfant'
                ? 'profile-choice-card is-selected'
                : 'profile-choice-card'
            }
          >
            <input
              type="radio"
              name="ageCategory"
              value="enfant"
              checked={formData.ageCategory === 'enfant'}
              onChange={(event) =>
                updateField(
                  'ageCategory',
                  event.target.value,
                )
              }
            />

            <ChildIllustration />

            <strong>Enfant</strong>
            <span className="profile-choice-subtitle">
              Moins de 15 ans
            </span>

            <p>
              Pour les enfants et adolescents jusqu’à
              14 ans inclus.
            </p>

            <SelectionIndicator
              selected={
                formData.ageCategory === 'enfant'
              }
            />
          </label>

          <label
            className={
              formData.ageCategory === 'adulte'
                ? 'profile-choice-card is-selected'
                : 'profile-choice-card'
            }
          >
            <input
              type="radio"
              name="ageCategory"
              value="adulte"
              checked={formData.ageCategory === 'adulte'}
              onChange={(event) =>
                updateField(
                  'ageCategory',
                  event.target.value,
                )
              }
            />

            <AdultIllustration />

            <strong>Adulte</strong>
            <span className="profile-choice-subtitle">
              15 ans et plus
            </span>

            <p>
              Pour les adolescents à partir de 15 ans
              et les adultes.
            </p>

            <SelectionIndicator
              selected={
                formData.ageCategory === 'adulte'
              }
            />
          </label>
        </div>
      </section>

      <section className="practice-choice-section">
        <h2 className="profile-choice-title">
          <span aria-hidden="true">🥊</span>
          Quelle pratique ?
        </h2>

        <div className="practice-choice-grid">
          <label
            className={
              formData.practiceType === 'loisir'
                ? 'practice-choice-card is-selected'
                : 'practice-choice-card'
            }
          >
            <input
              type="radio"
              name="practiceType"
              value="loisir"
              checked={formData.practiceType === 'loisir'}
              onChange={(event) =>
                updateField(
                  'practiceType',
                  event.target.value,
                )
              }
            />

            <LeisureIllustration />

            <span className="practice-choice-content">
              <strong>Loisir</strong>
              <small>Pratique non compétitive</small>
            </span>

            <SelectionIndicator
              selected={
                formData.practiceType === 'loisir'
              }
            />
          </label>

          <label
            className={
              formData.practiceType === 'competition'
                ? 'practice-choice-card is-selected'
                : 'practice-choice-card'
            }
          >
            <input
              type="radio"
              name="practiceType"
              value="competition"
              checked={
                formData.practiceType === 'competition'
              }
              onChange={(event) =>
                updateField(
                  'practiceType',
                  event.target.value,
                )
              }
            />

            <CompetitionIllustration />

            <span className="practice-choice-content">
              <strong>Compétition</strong>
              <small>Pratique compétitive</small>
            </span>

            <SelectionIndicator
              selected={
                formData.practiceType === 'competition'
              }
            />
          </label>
        </div>
      </section>

      <div className="profile-step-actions">
        <button
          type="submit"
          disabled={!canContinue}
        >
          Continuer
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  );
}
