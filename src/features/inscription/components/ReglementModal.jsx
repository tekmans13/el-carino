import './reglement-modal.css';

export default function ReglementModal({
  isOpen,
  onClose,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="reglement-modal-overlay"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        className="reglement-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reglement-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="reglement-modal-header">
          <div>
            <h2 id="reglement-modal-title">
              Règlement intérieur
            </h2>

            <p>ASC EL CARINO</p>
          </div>

          <button
            type="button"
            className="reglement-modal-close"
            onClick={onClose}
            aria-label="Fermer le règlement intérieur"
          >
            ×
          </button>
        </header>

        <div className="reglement-modal-content">
          <iframe
            src="/docs/reglement-interieur.pdf"
            title="Règlement intérieur ASC EL CARINO"
          />
        </div>

        <footer className="reglement-modal-footer">
          <a
            href="/docs/reglement-interieur.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Ouvrir le PDF dans un nouvel onglet
          </a>

          <button
            type="button"
            onClick={onClose}
          >
            Fermer
          </button>
        </footer>
      </section>
    </div>
  );
}
