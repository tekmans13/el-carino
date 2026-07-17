export default function AdminHeader() {
  return (
    <header className="admin-header">
      <div>
        <p className="admin-header-kicker">
          Back-office El Carino
        </p>

        <h1>Inscriptions</h1>

        <p>
          Consultez et traitez les dossiers transmis par
          les adhérents.
        </p>
      </div>

      <div className="admin-header-actions">
        <button
          type="button"
          className="admin-account-button"
        >
          <span
            className="admin-account-icon"
            aria-hidden="true"
          >
            AD
          </span>

          <span>Administration</span>

          <span aria-hidden="true">⌄</span>
        </button>
      </div>
    </header>
  );
}
