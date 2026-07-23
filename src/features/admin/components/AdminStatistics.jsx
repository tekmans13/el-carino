function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19v-1.5A4.5 4.5 0 0 1 8 13h2a4.5 4.5 0 0 1 4.5 4.5V19" />
      <circle cx="17" cy="9" r="2.2" />
      <path d="M16 14h1a3.5 3.5 0 0 1 3.5 3.5V19" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v5.5" />
      <path d="M12 16.5h.01" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12.5 4.3 4.2L19 7" />
    </svg>
  );
}

const statistics = [
  {
    key: 'total',
    label: 'Total',
    className: 'is-total',
    Icon: UsersIcon,
  },
  {
    key: 'submitted',
    label: 'À vérifier',
    className: 'is-pending',
    Icon: ClockIcon,
  },
  {
    key: 'incomplete',
    label: 'Incomplets',
    className: 'is-incomplete',
    Icon: AlertIcon,
  },
  {
    key: 'validated',
    label: 'Validés',
    className: 'is-validated',
    Icon: CheckIcon,
  },
];

export default function AdminStatistics({
  counters,
}) {
  return (
    <section
      className="admin-statistics"
      aria-label="Statistiques des inscriptions"
    >
      {statistics.map((statistic) => {
        const value = counters[statistic.key];
        const Icon = statistic.Icon;

        return (
          <article key={statistic.key}>
            <span
              className={[
                'admin-statistic-icon',
                statistic.className,
              ].join(' ')}
              aria-hidden="true"
            >
              <Icon />
            </span>

            <div className="admin-statistic-content">
              <strong>{value}</strong>

              <span>{statistic.label}</span>

              <small>
                dossier
                {value > 1 ? 's' : ''}
              </small>
            </div>
          </article>
        );
      })}
    </section>
  );
}
