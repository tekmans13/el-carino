import {
  useEffect,
  useState,
} from 'react';

export default function RegistrationAdminNote({
  initialNote = '',
  disabled = false,
  onSave,
}) {
  const [note, setNote] = useState(initialNote ?? '');
  const [savedNote, setSavedNote] =
    useState(initialNote ?? '');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const normalizedNote = initialNote ?? '';

    setNote(normalizedNote);
    setSavedNote(normalizedNote);
  }, [initialNote]);

  const noteChanged = note !== savedNote;

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      saving
      || disabled
      || !noteChanged
    ) {
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await onSave(note);

      setSavedNote(note);
      setSuccess('La note administrateur a été enregistrée.');
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Impossible d’enregistrer la note.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-note-editor">
      <header>
        <div>
          <h2>Note administrateur</h2>

          <p>
            Cette note est interne et ne sera pas visible
            par l’adhérent.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <label htmlFor="registration-admin-note">
          Note interne
        </label>

        <textarea
          id="registration-admin-note"
          value={note}
          rows={5}
          maxLength={3000}
          disabled={saving || disabled}
          placeholder="Ajoute une remarque sur ce dossier…"
          onChange={(event) => {
            setNote(event.target.value);
            setError('');
            setSuccess('');
          }}
        />

        <div className="admin-note-editor-footer">
          <span>
            {note.length}
            {' '}
            / 3000 caractères
          </span>

          <button
            type="submit"
            className="admin-note-save-button"
            disabled={
              saving
              || disabled
              || !noteChanged
            }
          >
            {saving
              ? 'Enregistrement…'
              : 'Enregistrer la note'}
          </button>
        </div>
      </form>

      {success && (
        <p
          className="admin-note-editor-message is-success"
          role="status"
        >
          {success}
        </p>
      )}

      {error && (
        <p
          className="admin-note-editor-message is-error"
          role="alert"
        >
          {error}
        </p>
      )}
    </section>
  );
}
