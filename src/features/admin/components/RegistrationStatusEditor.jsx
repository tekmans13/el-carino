import { useState } from 'react';

import { STATUS_LABELS } from '../constants';

const EDITABLE_STATUSES = [
  'soumis',
  'incomplet',
  'complement_demande',
  'valide',
  'en_attente_paiement',
  'refuse',
  'annule',
];

export default function RegistrationStatusEditor({
  currentStatus,
  disabled = false,
  onSave,
}) {
  const [selectedStatus, setSelectedStatus] =
    useState(currentStatus);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const statusChanged =
    selectedStatus !== currentStatus;

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      saving
      || disabled
      || !statusChanged
    ) {
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await onSave(selectedStatus);

      setSuccess('Le statut a été mis à jour.');
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Impossible de modifier le statut.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-status-editor">
      <header>
        <div>
          <h2>Traitement du dossier</h2>

          <p>
            Modifie l’état d’avancement de cette
            inscription.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="admin-status-editor-field">
          <label htmlFor="registration-status">
            Nouveau statut
          </label>

          <select
            id="registration-status"
            value={selectedStatus}
            disabled={saving || disabled}
            onChange={(event) => {
              setSelectedStatus(event.target.value);
              setError('');
              setSuccess('');
            }}
          >
            {EDITABLE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="admin-status-save-button"
          disabled={
            saving
            || disabled
            || !statusChanged
          }
        >
          {saving
            ? 'Enregistrement…'
            : 'Enregistrer le statut'}
        </button>
      </form>

      {success && (
        <p
          className="admin-status-editor-message is-success"
          role="status"
        >
          {success}
        </p>
      )}

      {error && (
        <p
          className="admin-status-editor-message is-error"
          role="alert"
        >
          {error}
        </p>
      )}
    </section>
  );
}
