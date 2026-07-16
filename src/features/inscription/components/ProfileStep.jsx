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
    <form onSubmit={handleSubmit}>
      <section>
        <h2>Qui souhaitez-vous inscrire ?</h2>

        <div className="choice-grid">
          <label
            className={
              formData.ageCategory === 'adulte'
                ? 'choice-card selected'
                : 'choice-card'
            }
          >
            <input
              type="radio"
              name="ageCategory"
              value="adulte"
              checked={formData.ageCategory === 'adulte'}
              onChange={(event) => {
                updateField('ageCategory', event.target.value);
              }}
            />

            <span>Adulte</span>
          </label>

          <label
            className={
              formData.ageCategory === 'enfant'
                ? 'choice-card selected'
                : 'choice-card'
            }
          >
            <input
              type="radio"
              name="ageCategory"
              value="enfant"
              checked={formData.ageCategory === 'enfant'}
              onChange={(event) => {
                updateField('ageCategory', event.target.value);
              }}
            />

            <span>Enfant</span>
          </label>
        </div>
      </section>

      <section>
        <h2>Quelle pratique ?</h2>

        <div className="choice-grid">
          <label
            className={
              formData.practiceType === 'loisir'
                ? 'choice-card selected'
                : 'choice-card'
            }
          >
            <input
              type="radio"
              name="practiceType"
              value="loisir"
              checked={formData.practiceType === 'loisir'}
              onChange={(event) => {
                updateField('practiceType', event.target.value);
              }}
            />

            <span>Loisir</span>
          </label>

          <label
            className={
              formData.practiceType === 'competition'
                ? 'choice-card selected'
                : 'choice-card'
            }
          >
            <input
              type="radio"
              name="practiceType"
              value="competition"
              checked={formData.practiceType === 'competition'}
              onChange={(event) => {
                updateField('practiceType', event.target.value);
              }}
            />

            <span>Compétition</span>
          </label>
        </div>
      </section>

      <div className="form-actions">
        <button
          type="submit"
          disabled={!canContinue}
        >
          Continuer
        </button>
      </div>
    </form>
  );
}
