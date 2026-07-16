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
      <fieldset>
        <legend>Qui souhaitez-vous inscrire ?</legend>

        <label>
          <input
            type="radio"
            name="ageCategory"
            value="adulte"
            checked={formData.ageCategory === 'adulte'}
            onChange={(event) => {
              updateField('ageCategory', event.target.value);
            }}
          />
          Adulte
        </label>

        <label>
          <input
            type="radio"
            name="ageCategory"
            value="enfant"
            checked={formData.ageCategory === 'enfant'}
            onChange={(event) => {
              updateField('ageCategory', event.target.value);
            }}
          />
          Enfant
        </label>
      </fieldset>

      <fieldset>
        <legend>Type de pratique</legend>

        <label>
          <input
            type="radio"
            name="practiceType"
            value="loisir"
            checked={formData.practiceType === 'loisir'}
            onChange={(event) => {
              updateField('practiceType', event.target.value);
            }}
          />
          Loisir
        </label>

        <label>
          <input
            type="radio"
            name="practiceType"
            value="competition"
            checked={formData.practiceType === 'competition'}
            onChange={(event) => {
              updateField('practiceType', event.target.value);
            }}
          />
          Compétition
        </label>
      </fieldset>

      <button type="submit" disabled={!canContinue}>
        Continuer
      </button>
    </form>
  );
}
