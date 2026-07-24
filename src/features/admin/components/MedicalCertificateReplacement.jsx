import { useState } from 'react';

import { replaceMedicalCertificate } from '../services/registrationAdminService';

export default function MedicalCertificateReplacement({
  registration,
  onUpdated,
}) {
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file || saving) {
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const updatedRegistration =
        await replaceMedicalCertificate(
          registration,
          file,
        );

      setFile(null);

      event.target.reset();

      setSuccess(
        'Le certificat médical a été remplacé.',
      );

      onUpdated(updatedRegistration);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de remplacer le certificat.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      className="admin-certificate-replacement"
      onSubmit={handleSubmit}
    >
      <label htmlFor="replacement-medical-certificate">
        Remplacer le certificat médical
      </label>

      <input
        id="replacement-medical-certificate"
        type="file"
        accept=".pdf,application/pdf"
        disabled={saving}
        onChange={(event) =>
          setFile(
            event.target.files?.[0] ?? null,
          )
        }
      />

      <button
        type="submit"
        className="admin-detail-back-button"
        disabled={!file || saving}
      >
        {saving
          ? 'Remplacement...'
          : 'Enregistrer le nouveau certificat'}
      </button>

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
          className="admin-error-message"
          role="alert"
        >
          {error}
        </p>
      )}
    </form>
  );
}
