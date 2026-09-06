export default function AdminHeader({
  title = 'Inscriptions',
  description = 'Consultez et traitez les dossiers transmis par les adhérents.',
}) {
  return (
    <header className="admin-header">
      <div>
        <p className="admin-header-kicker">
          Back-office El Carino
        </p>

        <h1>{title}</h1>

        <p>{description}</p>
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
