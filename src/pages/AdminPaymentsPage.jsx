import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import AdminHeader from '../features/admin/components/AdminHeader';
import AdminSidebar from '../features/admin/components/AdminSidebar';

import {
  getPaymentsOverview,
} from '../features/admin/services/paymentsOverviewService';

import '../features/admin/admin.css';
import '../features/admin/admin-payments-overview.css';

const PAYMENT_STATUS_LABELS = {
  unpaid: 'Non payé',
  pending: 'En attente d’encaissement',
  partial: 'Partiellement payé',
  paid: 'Payé',
  undefined: 'À définir',
};

function formatAmount(
  amountCents,
  currency = 'eur',
) {
  if (
    amountCents === null
    || amountCents === undefined
  ) {
    return '—';
  }

  return new Intl.NumberFormat(
    'fr-FR',
    {
      style: 'currency',
      currency:
        (currency ?? 'eur').toUpperCase(),
    },
  ).format(
    Number(amountCents) / 100,
  );
}

function formatDate(value) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat(
    'fr-FR',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    },
  ).format(date);
}

export default function AdminPaymentsPage() {
  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);

  const [registrations, setRegistrations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [search, setSearch] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('all');

  useEffect(() => {
    let active = true;

    async function loadPayments() {
      try {
        setLoading(true);
        setError('');

        const data =
          await getPaymentsOverview();

        if (active) {
          setRegistrations(data);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Impossible de charger les paiements.',
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPayments();

    return () => {
      active = false;
    };
  }, []);

  const filteredRegistrations =
    useMemo(
      () => {
        const normalizedSearch =
          search
            .trim()
            .toLowerCase();

        return registrations.filter(
          (registration) => {
            const matchesStatus =
              statusFilter === 'all'
              || registration
                .computed_payment_status
                === statusFilter;

            if (!matchesStatus) {
              return false;
            }

            if (!normalizedSearch) {
              return true;
            }

            const searchableValue = [
              registration.first_name,
              registration.last_name,
              registration.email,
              registration.phone,
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase();

            return searchableValue.includes(
              normalizedSearch,
            );
          },
        );
      },
      [
        registrations,
        search,
        statusFilter,
      ],
    );

  const statistics =
    useMemo(
      () => {
        return registrations.reduce(
          (result, registration) => {
            const due =
              Number(
                registration
                  .payment_amount_cents
                ?? 0,
              );

            const received =
              Number(
                registration
                  .amount_received_cents
                ?? 0,
              );

            const cashed =
              Number(
                registration
                  .amount_cashed_cents
                ?? 0,
              );

            const remaining =
              Number(
                registration
                  .remaining_amount_cents
                ?? 0,
              );

            result.amountDueCents += due;

            result.amountReceivedCents +=
              received;

            result.amountCashedCents +=
              cashed;

            result.remainingAmountCents +=
              remaining;

            if (
              registration
                .computed_payment_status
              === 'paid'
            ) {
              result.paidCount += 1;
            }

            if (
              registration
                .computed_payment_status
              === 'partial'
            ) {
              result.partialCount += 1;
            }

            if (
              registration
                .computed_payment_status
              === 'pending'
            ) {
              result.pendingCount += 1;
            }

            if (
              registration
                .computed_payment_status
              === 'unpaid'
            ) {
              result.unpaidCount += 1;
            }

            return result;
          },
          {
            amountDueCents: 0,
            amountReceivedCents: 0,
            amountCashedCents: 0,
            remainingAmountCents: 0,
            paidCount: 0,
            partialCount: 0,
            pendingCount: 0,
            unpaidCount: 0,
          },
        );
      },
      [registrations],
    );

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
        activeItem="payments"
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
              title="Paiements"
              description="Suivez les cotisations, les règlements reçus et leur encaissement."
            />

            {error && (
              <div
                className="admin-state-message admin-error-message"
                role="alert"
              >
                <strong>
                  Impossible de charger les paiements
                </strong>

                <p>
                  {error}
                </p>
              </div>
            )}

            {!error && (
              <>
                <section className="admin-payments-statistics">
                  <article>
                    <span>
                      Montant à régler
                    </span>

                    <strong>
                      {formatAmount(
                        statistics
                          .amountDueCents,
                      )}
                    </strong>
                  </article>

                  <article>
                    <span>
                      Reçu
                    </span>

                    <strong>
                      {formatAmount(
                        statistics
                          .amountReceivedCents,
                      )}
                    </strong>
                  </article>

                  <article>
                    <span>
                      Encaissé
                    </span>

                    <strong>
                      {formatAmount(
                        statistics
                          .amountCashedCents,
                      )}
                    </strong>
                  </article>

                  <article>
                    <span>
                      Reste à encaisser
                    </span>

                    <strong>
                      {formatAmount(
                        statistics
                          .remainingAmountCents,
                      )}
                    </strong>
                  </article>
                </section>

                <section className="admin-content-card">
                  <header className="admin-content-card-header">
                    <div className="admin-list-title">
                      <h2>
                        Suivi des cotisations
                      </h2>

                      <span>
                        {
                          filteredRegistrations
                            .length
                        }
                        {' '}
                        dossier
                        {
                          filteredRegistrations
                            .length > 1
                            ? 's'
                            : ''
                        }
                      </span>
                    </div>
                  </header>

                  <div className="admin-payments-filters">
                    <label className="admin-payments-search">
                      <span>
                        Rechercher
                      </span>

                      <input
                        type="search"
                        value={search}
                        placeholder="Nom, prénom, e-mail, téléphone…"
                        onChange={(event) =>
                          setSearch(
                            event.target.value,
                          )
                        }
                      />
                    </label>

                    <label className="admin-payments-filter">
                      <span>
                        État du paiement
                      </span>

                      <select
                        value={statusFilter}
                        onChange={(event) =>
                          setStatusFilter(
                            event.target.value,
                          )
                        }
                      >
                        <option value="all">
                          Tous
                        </option>

                        <option value="unpaid">
                          Non payé
                        </option>

                        <option value="pending">
                          En attente d’encaissement
                        </option>

                        <option value="partial">
                          Partiellement payé
                        </option>

                        <option value="paid">
                          Payé
                        </option>
                      </select>
                    </label>
                  </div>

                  {loading && (
                    <div className="admin-state-message">
                      <span className="admin-loader" />

                      <p>
                        Chargement des paiements…
                      </p>
                    </div>
                  )}

                  {!loading
                    && filteredRegistrations
                      .length === 0 && (
                      <div className="admin-state-message">
                        <p>
                          Aucun dossier ne correspond
                          aux critères sélectionnés.
                        </p>
                      </div>
                  )}

                  {!loading
                    && filteredRegistrations
                      .length > 0 && (
                      <div className="admin-table-wrapper">
                        <table className="admin-table admin-payments-overview-table">
                          <thead>
                            <tr>
                              <th>
                                Adhérent
                              </th>

                              <th>
                                Montant dû
                              </th>

                              <th>
                                Reçu
                              </th>

                              <th>
                                Encaissé
                              </th>

                              <th>
                                Reste à encaisser
                              </th>

                              <th>
                                Statut
                              </th>

                              <th>
                                Dernier règlement
                              </th>

                              <th>
                                Action
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {filteredRegistrations.map(
                              (registration) => (
                                <tr
                                  key={
                                    registration.id
                                  }
                                >
                                  <td>
                                    <div className="admin-payment-member">
                                      <strong>
                                        {
                                          registration
                                            .first_name
                                        }
                                        {' '}
                                        {
                                          registration
                                            .last_name
                                        }
                                      </strong>

                                      <small>
                                        {
                                          registration
                                            .email
                                        }
                                      </small>
                                    </div>
                                  </td>

                                  <td>
                                    {formatAmount(
                                      registration
                                        .payment_amount_cents,
                                      registration
                                        .payment_currency,
                                    )}
                                  </td>

                                  <td>
                                    <strong className="admin-payment-received">
                                      {formatAmount(
                                        registration
                                          .amount_received_cents,
                                        registration
                                          .payment_currency,
                                      )}
                                    </strong>
                                  </td>

                                  <td>
                                    <strong>
                                      {formatAmount(
                                        registration
                                          .amount_cashed_cents,
                                        registration
                                          .payment_currency,
                                      )}
                                    </strong>
                                  </td>

                                  <td>
                                    {formatAmount(
                                      registration
                                        .remaining_amount_cents,
                                      registration
                                        .payment_currency,
                                    )}
                                  </td>

                                  <td>
                                    <span
                                      className={[
                                        'admin-payment-overview-status',
                                        `is-${registration.computed_payment_status}`,
                                      ].join(' ')}
                                    >
                                      {
                                        PAYMENT_STATUS_LABELS[
                                          registration
                                            .computed_payment_status
                                        ]
                                        ?? 'À définir'
                                      }
                                    </span>
                                  </td>

                                  <td>
                                    {formatDate(
                                      registration
                                        .last_payment_at,
                                    )}
                                  </td>

                                  <td>
                                    <Link
                                      className="admin-payment-detail-link"
                                      to={`/admin/inscriptions/${registration.id}`}
                                    >
                                      Voir le dossier
                                    </Link>
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                  )}
                </section>

                <div className="admin-payment-status-summary">
                  <span>
                    Non payés :
                    {' '}
                    <strong>
                      {
                        statistics
                          .unpaidCount
                      }
                    </strong>
                  </span>

                  <span>
                    En attente :
                    {' '}
                    <strong>
                      {
                        statistics
                          .pendingCount
                      }
                    </strong>
                  </span>

                  <span>
                    Partiels :
                    {' '}
                    <strong>
                      {
                        statistics
                          .partialCount
                      }
                    </strong>
                  </span>

                  <span>
                    Payés :
                    {' '}
                    <strong>
                      {
                        statistics
                          .paidCount
                      }
                    </strong>
                  </span>
                </div>
              </>
            )}

            <footer className="admin-footer">
              El Carino — Back-office
            </footer>
          </section>
        </main>
      </div>
    </div>
  );
}
