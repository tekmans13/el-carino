import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import AdminHeader from '../features/admin/components/AdminHeader';
import AdminSidebar from '../features/admin/components/AdminSidebar';

import {
  getAdminStatistics,
} from '../features/admin/services/statisticsService';

import '../features/admin/admin.css';
import '../features/admin/admin-statistics.css';

const STATUS_LABELS = {
  brouillon: 'Brouillon',
  soumis: 'Soumis',
  incomplet: 'Incomplet',
  complement_demande: 'Complément demandé',
  en_attente_paiement: 'En attente paiement',
  paye: 'Payé',
  valide: 'Validé',
  refuse: 'Refusé',
  annule: 'Annulé',
};

function formatCurrency(cents) {
  return new Intl.NumberFormat(
    'fr-FR',
    {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2,
    },
  ).format(
    Number(cents ?? 0) / 100,
  );
}

function percentage(value, total) {
  if (!total) {
    return 0;
  }

  return Math.round(
    (Number(value) / Number(total)) * 100,
  );
}

function StatisticBar({
  label,
  value,
  total,
}) {
  const percent = percentage(value, total);

  return (
    <div className="admin-statistics-bar">
      <div className="admin-statistics-bar-header">
        <span>{label}</span>

        <strong>
          {value}
          <small>{percent}%</small>
        </strong>
      </div>

      <div
        className="admin-statistics-bar-track"
        aria-hidden="true"
      >
        <span
          style={{
            width: `${percent}%`,
          }}
        />
      </div>
    </div>
  );
}

function DistributionCard({
  title,
  subtitle,
  items,
}) {
  const total = items.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  return (
    <article className="admin-statistics-panel">
      <header>
        <div>
          <h2>{title}</h2>

          {subtitle && (
            <p>{subtitle}</p>
          )}
        </div>

        <strong className="admin-statistics-panel-total">
          {total}
        </strong>
      </header>

      <div className="admin-statistics-bars">
        {items.map((item) => (
          <StatisticBar
            key={item.label}
            label={item.label}
            value={item.value}
            total={total}
          />
        ))}
      </div>
    </article>
  );
}

function FinanceKpi({
  label,
  value,
  detail,
}) {
  return (
    <article className="admin-statistics-finance-kpi">
      <span>{label}</span>
      <strong>{value}</strong>

      {detail && (
        <small>{detail}</small>
      )}
    </article>
  );
}

function RegistrationsChart({
  registrations,
}) {
  if (!registrations.length) {
    return (
      <div className="admin-statistics-chart-empty">
        Aucune inscription.
      </div>
    );
  }

  const width = 1000;
  const height = 190;

  const padding = {
    top: 12,
    right: 20,
    bottom: 32,
    left: 30,
  };

  const chartWidth =
    width - padding.left - padding.right;

  const chartHeight =
    height - padding.top - padding.bottom;

  const maxDaily = Math.max(
    ...registrations.map((item) => item.count),
    1,
  );

  const maxCumulative = Math.max(
    ...registrations.map(
      (item) => item.cumulative,
    ),
    1,
  );

  const step =
    chartWidth / registrations.length;

  const barWidth = Math.max(
    Math.min(step * 0.55, 22),
    4,
  );

  const points = registrations.map(
    (item, index) => {
      const x =
        padding.left
        + (index * step)
        + (step / 2);

      const y =
        padding.top
        + chartHeight
        - (
          item.cumulative
          / maxCumulative
        ) * chartHeight;

      return {
        ...item,
        x,
        y,
      };
    },
  );

  const linePoints = points
    .map((point) => `${point.x},${point.y}`)
    .join(' ');

  const total =
    registrations[
      registrations.length - 1
    ].cumulative;

  const activeDays =
    registrations.filter(
      (item) => item.count > 0,
    ).length;

  const average =
    activeDays > 0
      ? total / activeDays
      : 0;

  const busiestDay =
    registrations.reduce(
      (best, item) =>
        item.count > best.count
          ? item
          : best,
      registrations[0],
    );

  return (
    <>
      <div className="admin-statistics-chart-legend">
        <span>
          <i className="is-bars" />
          Inscriptions par jour
        </span>

        <span>
          <i className="is-line" />
          Cumul des inscriptions
        </span>
      </div>

      <div className="admin-statistics-chart-scroll">
        <svg
          className="admin-statistics-chart"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="Évolution quotidienne et cumulée des inscriptions"
        >
          {[0, 0.25, 0.5, 0.75, 1].map(
            (ratio) => {
              const y =
                padding.top
                + chartHeight
                - ratio * chartHeight;

              return (
                <line
                  key={ratio}
                  x1={padding.left}
                  x2={width - padding.right}
                  y1={y}
                  y2={y}
                  className="admin-statistics-chart-grid"
                />
              );
            },
          )}

          {registrations.map(
            (item, index) => {
              const x =
                padding.left
                + (index * step)
                + (step / 2);

              const barHeight =
                (
                  item.count
                  / maxDaily
                ) * chartHeight;

              return (
                <g key={item.key}>
                  <rect
                    x={x - barWidth / 2}
                    y={
                      padding.top
                      + chartHeight
                      - barHeight
                    }
                    width={barWidth}
                    height={barHeight}
                    rx="3"
                    className="admin-statistics-chart-bar"
                  >
                    <title>
                      {item.fullLabel}
                      {' : '}
                      {item.count}
                      {' inscription'}
                      {item.count > 1 ? 's' : ''}
                    </title>
                  </rect>

                  {(index % 2 === 0
                    || registrations.length <= 16
                  ) && (
                    <text
                      x={x}
                      y={height - 10}
                      textAnchor="middle"
                      className="admin-statistics-chart-label"
                    >
                      {item.label}
                    </text>
                  )}
                </g>
              );
            },
          )}

          <polyline
            points={linePoints}
            className="admin-statistics-chart-line"
          />

          {points.map((point) => (
            <circle
              key={point.key}
              cx={point.x}
              cy={point.y}
              r="3.5"
              className="admin-statistics-chart-point"
            >
              <title>
                {point.fullLabel}
                {' : cumul '}
                {point.cumulative}
              </title>
            </circle>
          ))}
        </svg>
      </div>

      <div className="admin-statistics-chart-summary">
        <article>
          <span>Total</span>
          <strong>{total}</strong>
          <small>inscriptions</small>
        </article>

        <article>
          <span>Moyenne / jour actif</span>
          <strong>
            {average.toLocaleString(
              'fr-FR',
              {
                maximumFractionDigits: 1,
              },
            )}
          </strong>
          <small>inscriptions</small>
        </article>

        <article>
          <span>Jour le plus actif</span>
          <strong>
            {busiestDay.label}
          </strong>
          <small>
            {busiestDay.count}
            {' inscription'}
            {busiestDay.count > 1
              ? 's'
              : ''}
          </small>
        </article>
      </div>
    </>
  );
}

export default function AdminStatisticsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [statistics, setStatistics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    let active = true;

    async function loadStatistics() {
      try {
        setLoading(true);
        setError('');

        const data =
          await getAdminStatistics();

        if (active) {
          setStatistics(data);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Impossible de charger les statistiques.',
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadStatistics();

    return () => {
      active = false;
    };
  }, []);

  const statusItems = useMemo(() => {
    if (!statistics) {
      return [];
    }

    return Object.entries(
      statistics.statuses,
    )
      .filter(([, value]) => value > 0)
      .map(([status, value]) => ({
        label:
          STATUS_LABELS[status]
          ?? status,
        value,
      }))
      .sort(
        (first, second) =>
          second.value - first.value,
      );
  }, [statistics]);

  if (loading) {
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
          activeItem="statistics"
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
                title="Statistiques"
                description="Vue d'ensemble des adhérents, inscriptions et règlements."
              />

              <div className="admin-state-message">
                Chargement des statistiques…
              </div>
            </section>
          </main>
        </div>
      </div>
    );
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
        activeItem="statistics"
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
              title="Statistiques"
              description="Vue d'ensemble des adhérents, inscriptions et règlements."
            />

            {error && (
              <div
                className="admin-state-message admin-error-message"
                role="alert"
              >
                <strong>
                  Une erreur est survenue
                </strong>

                <p>{error}</p>
              </div>
            )}

            {!error && statistics && (
              <>
                <section className="admin-statistics-kpis">
                  <article>
                    <span>Adhérents</span>
                    <strong>
                      {statistics.total}
                    </strong>
                  </article>

                  <article>
                    <span>Enfants</span>
                    <strong>
                      {statistics.age.enfant}
                    </strong>
                    <small>
                      {percentage(
                        statistics.age.enfant,
                        statistics.total,
                      )}
                      % des adhérents
                    </small>
                  </article>

                  <article>
                    <span>Adultes</span>
                    <strong>
                      {statistics.age.adulte}
                    </strong>
                    <small>
                      {percentage(
                        statistics.age.adulte,
                        statistics.total,
                      )}
                      % des adhérents
                    </small>
                  </article>

                  <article>
                    <span>Compétiteurs</span>
                    <strong>
                      {
                        statistics.practice.enfant
                          .competition
                        + statistics.practice.adulte
                          .competition
                      }
                    </strong>
                    <small>
                      Enfants et adultes
                    </small>
                  </article>
                </section>

                <article className="admin-statistics-panel admin-statistics-chart-panel">
                  <header>
                    <div>
                      <h2>
                        Évolution des inscriptions
                      </h2>

                      <p>
                        Nombre de dossiers créés par jour
                        et cumul depuis le début
                      </p>
                    </div>
                  </header>

                  <RegistrationsChart
                    registrations={
                      statistics.dailyRegistrations
                    }
                  />
                </article>

                <div className="admin-statistics-section-title">
                  <div>
                    <span>Adhérents</span>
                    <h2>Répartition des adhérents</h2>
                  </div>
                </div>

                <section className="admin-statistics-grid">
                  <DistributionCard
                    title="Enfants / Adultes"
                    subtitle="Répartition par profil"
                    items={[
                      {
                        label: 'Enfants',
                        value:
                          statistics.age.enfant,
                      },
                      {
                        label: 'Adultes',
                        value:
                          statistics.age.adulte,
                      },
                    ]}
                  />

                  <DistributionCard
                    title="Hommes / Femmes"
                    subtitle="Répartition déclarée à l'inscription"
                    items={[
                      {
                        label: 'Hommes',
                        value:
                          statistics.gender.male,
                      },
                      {
                        label: 'Femmes',
                        value:
                          statistics.gender.female,
                      },
                      ...(statistics.gender.other > 0
                        ? [{
                          label: 'Autre / non renseigné',
                          value:
                            statistics.gender.other,
                        }]
                        : []),
                    ]}
                  />
                </section>

                <div className="admin-statistics-section-title">
                  <div>
                    <span>Pratique</span>
                    <h2>Loisir et compétition</h2>
                  </div>
                </div>

                <section className="admin-statistics-grid">
                  <DistributionCard
                    title="Enfants"
                    subtitle="Type de pratique"
                    items={[
                      {
                        label: 'Loisir',
                        value:
                          statistics.practice.enfant
                            .loisir,
                      },
                      {
                        label: 'Compétition',
                        value:
                          statistics.practice.enfant
                            .competition,
                      },
                    ]}
                  />

                  <DistributionCard
                    title="Adultes"
                    subtitle="Type de pratique"
                    items={[
                      {
                        label: 'Loisir',
                        value:
                          statistics.practice.adulte
                            .loisir,
                      },
                      {
                        label: 'Compétition',
                        value:
                          statistics.practice.adulte
                            .competition,
                      },
                    ]}
                  />
                </section>

                <div className="admin-statistics-section-title">
                  <div>
                    <span>Dossiers</span>
                    <h2>Suivi des inscriptions</h2>
                  </div>
                </div>

                <section className="admin-statistics-grid">
                  <DistributionCard
                    title="État des dossiers"
                    subtitle="Statut administratif actuel"
                    items={statusItems}
                  />


                </section>

                <div className="admin-statistics-section-title">
                  <div>
                    <span>Finances</span>
                    <h2>Situation des règlements</h2>
                  </div>
                </div>

                <section className="admin-statistics-finance">
                  <FinanceKpi
                    label="Montant attendu"
                    value={formatCurrency(
                      statistics.payments
                        .expectedCents,
                    )}
                  />

                  <FinanceKpi
                    label="Reçu"
                    value={formatCurrency(
                      statistics.payments
                        .receivedCents,
                    )}
                    detail="Règlements enregistrés"
                  />

                  <FinanceKpi
                    label="Encaissé"
                    value={formatCurrency(
                      statistics.payments
                        .cashedCents,
                    )}
                    detail="Règlements encaissés"
                  />

                  <FinanceKpi
                    label="Reste à encaisser"
                    value={formatCurrency(
                      statistics.payments
                        .remainingCents,
                    )}
                  />
                </section>

                <section className="admin-statistics-aids">
                  <header>
                    <div>
                      <h2>Montants par moyen de paiement</h2>
                      <p>Règlements réellement enregistrés</p>
                    </div>
                  </header>

                  <div>
                    {[
                      ['Espèces', 'cash'],
                      ['Chèques', 'check'],
                      ['CAF', 'caf'],
                      ['C-Jeune', 'cjeune'],
                      ["Pass'Sport", 'pass_sport'],
                    ].map(([label, method]) => (
                      <article key={method}>
                        <span>{label}</span>
                        <strong>
                          {formatCurrency(
                            statistics.payments.byMethod[method]
                              .receivedCents,
                          )}
                        </strong>
                        <small>
                          Encaissé :{' '}
                          {formatCurrency(
                            statistics.payments.byMethod[method]
                              .cashedCents,
                          )}
                        </small>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="admin-statistics-grid">
                  <DistributionCard
                    title="État des règlements"
                    subtitle="Selon les encaissements enregistrés"
                    items={[
                      {
                        label: 'Payés',
                        value:
                          statistics.payments
                            .statuses.paid,
                      },
                      {
                        label: 'Partiels',
                        value:
                          statistics.payments
                            .statuses.partial,
                      },
                      {
                        label: 'En attente',
                        value:
                          statistics.payments
                            .statuses.pending,
                      },
                      {
                        label: 'Non payés',
                        value:
                          statistics.payments
                            .statuses.unpaid,
                      },
                    ]}
                  />

                  <DistributionCard
                    title="Règlement prévu"
                    subtitle="Choix indiqué lors de l'inscription"
                    items={[
                      {
                        label: 'Espèces',
                        value:
                          statistics.plannedPayments
                            .cash,
                      },
                      {
                        label: 'Chèque — 1 fois',
                        value:
                          statistics.plannedPayments
                            .check_1,
                      },
                      {
                        label: 'Chèque — 2 fois',
                        value:
                          statistics.plannedPayments
                            .check_2,
                      },
                      {
                        label: 'Chèque — 3 fois',
                        value:
                          statistics.plannedPayments
                            .check_3,
                      },
                    ]}
                  />
                </section>

                <section className="admin-statistics-aids">
                  <header>
                    <div>
                      <h2>Aides prévues</h2>
                      <p>
                        Aides déclarées lors de
                        l'inscription
                      </p>
                    </div>
                  </header>

                  <div>
                    <article>
                      <span>CAF</span>
                      <strong>
                        {statistics.aids.caf}
                      </strong>
                    </article>

                    <article>
                      <span>C-Jeune</span>
                      <strong>
                        {statistics.aids.cjeune}
                      </strong>
                    </article>

                    <article>
                      <span>Pass'Sport</span>
                      <strong>
                        {statistics.aids.pass_sport}
                      </strong>
                    </article>
                  </div>
                </section>
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
