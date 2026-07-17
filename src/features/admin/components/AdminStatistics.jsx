export default function AdminStatistics({
  counters,
}) {
  return (
    <section
      className="admin-statistics"
      aria-label="Statistiques des inscriptions"
    >
      <article>
        <span
          className="admin-statistic-icon is-total"
          aria-hidden="true"
        >
          👥
        </span>

        <div>
          <span>Total</span>
          <strong>{counters.total}</strong>

          <small>
            dossier
            {counters.total > 1 ? 's' : ''}
          </small>
        </div>
      </article>

      <article>
        <span
          className="admin-statistic-icon is-pending"
          aria-hidden="true"
        >
          ◷
        </span>

        <div>
          <span>À vérifier</span>
          <strong>{counters.submitted}</strong>

          <small>
            dossier
            {counters.submitted > 1 ? 's' : ''}
          </small>
        </div>
      </article>

      <article>
        <span
          className="admin-statistic-icon is-incomplete"
          aria-hidden="true"
        >
          !
        </span>

        <div>
          <span>Incomplets</span>
          <strong>{counters.incomplete}</strong>

          <small>
            dossier
            {counters.incomplete > 1 ? 's' : ''}
          </small>
        </div>
      </article>

      <article>
        <span
          className="admin-statistic-icon is-validated"
          aria-hidden="true"
        >
          ✓
        </span>

        <div>
          <span>Validés</span>
          <strong>{counters.validated}</strong>

          <small>
            dossier
            {counters.validated > 1 ? 's' : ''}
          </small>
        </div>
      </article>
    </section>
  );
}
