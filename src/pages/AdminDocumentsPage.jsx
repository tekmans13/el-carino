import {
  useRef,
  useState,
} from 'react';

import AdminHeader from '../features/admin/components/AdminHeader';
import AdminSidebar from '../features/admin/components/AdminSidebar';

import {
  CLUB_DOCUMENTS,
  getClubDocumentPublicUrl,
  uploadClubDocument,
} from '../features/admin/services/clubDocumentsService';

import '../features/admin/admin.css';
import '../features/admin/admin-settings.css';

export default function AdminDocumentsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const inputRef = useRef(null);

  const document = CLUB_DOCUMENTS.statutes;

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const publicUrl = getClubDocumentPublicUrl(
    document.storagePath,
  );

  function handleFileChange(event) {
    const selectedFile =
      event.target.files?.[0] ?? null;

    setMessage('');
    setError('');

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (
      selectedFile.type !== 'application/pdf'
      && !selectedFile.name
        .toLowerCase()
        .endsWith('.pdf')
    ) {
      setFile(null);
      event.target.value = '';

      setError(
        'Le document doit être un fichier PDF.',
      );

      return;
    }

    setFile(selectedFile);
  }

  async function handleUpload() {
    if (!file) {
      setError(
        'Sélectionnez un fichier PDF.',
      );
      return;
    }

    setUploading(true);
    setMessage('');
    setError('');

    try {
      await uploadClubDocument(
        document.storagePath,
        file,
      );

      setFile(null);

      if (inputRef.current) {
        inputRef.current.value = '';
      }

      setMessage(
        'Les statuts ont été publiés avec succès.',
      );
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'Impossible de publier les statuts.',
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      className={[
        'admin-dashboard',
        sidebarCollapsed
          ? 'is-sidebar-collapsed'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <AdminSidebar
        activeItem="documents"
        collapsed={sidebarCollapsed}
        onToggle={() =>
          setSidebarCollapsed(
            (current) => !current,
          )
        }
      />

      <div className="admin-dashboard-content">
        <main className="admin-page">
          <section className="admin-shell">
            <AdminHeader
              title="Documents"
              description="Gérez les documents publics du club."
            />

            <section className="admin-content-card">
              <header className="admin-content-card-header">
                <div className="admin-list-title">
                  <h2>
                    Statuts de l'association
                  </h2>

                  <span>
                    Document publié sur le site
                  </span>
                </div>
              </header>

              <div className="admin-settings-section">
                <div className="admin-settings-field">
                  <span className="admin-settings-label">
                    Statuts actuellement publiés
                  </span>

                  <p>
                    Le document est toujours publié
                    sous le nom{' '}
                    <strong>
                      statuts-el-carino.pdf
                    </strong>.
                  </p>

                  <p>
                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Voir les statuts actuellement publiés
                    </a>
                  </p>
                </div>

                <label className="admin-settings-field">
                  <span className="admin-settings-label">
                    Nouveau fichier PDF
                  </span>

                  <input
                    ref={inputRef}
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />

                  <small>
                    Le nom du fichier sélectionné
                    n'a pas d'importance. Il sera
                    automatiquement publié comme
                    statuts-el-carino.pdf.
                  </small>
                </label>

                {file && (
                  <div className="admin-settings-field">
                    <span className="admin-settings-label">
                      Fichier sélectionné
                    </span>

                    <strong>
                      {file.name}
                    </strong>
                  </div>
                )}

                {error && (
                  <div
                    className="admin-state-message admin-error-message"
                    role="alert"
                  >
                    <strong>
                      Impossible de publier le document
                    </strong>

                    <p>{error}</p>
                  </div>
                )}

                {message && (
                  <div className="admin-state-message">
                    <p>{message}</p>
                  </div>
                )}

                <div>
                  <button
                    type="button"
                    className="admin-primary-button"
                    onClick={handleUpload}
                    disabled={!file || uploading}
                  >
                    {uploading
                      ? 'Publication…'
                      : 'Publier les statuts'}
                  </button>
                </div>
              </div>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}
