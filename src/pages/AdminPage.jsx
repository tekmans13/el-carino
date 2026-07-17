import { useEffect, useMemo, useState } from 'react';

import AdminSidebar from '../features/admin/components/AdminSidebar';
import { listRegistrations } from '../features/admin/services/registrationAdminService';

import '../features/admin/admin.css';

const STATUS_LABELS = {
  brouillon: 'Brouillon',
  soumis: 'Soumis',
  incomplet: 'Incomplet',
  complement_demande: 'Complément demandé',
  valide: 'Validé',
  en_attente_paiement: 'Paiement attendu',
  paye: 'Payé',
  refuse: 'Refusé',
  annule: 'Annulé',
};

const PAYMENT_STATUS_LABELS = {
  non_demande: 'Non demandé',
  en_attente: 'En attente',
  session_creee: 'Session créée',
  paye: 'Payé',
  echoue: 'Échoué',
  annule: 'Annulé',
  rembourse: 'Remboursé',
};

const PROFILE_LABELS = {
  enfant: 'Enfant',
  adulte: 'Adulte',
};

const PRACTICE_LABELS = {
  loisir: 'Loisir',
  competition: 'Compétition',
};

function formatDate(value) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

function normalizeSearchValue(value) {
  return value
    ?.normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim() ?? '';
}

function getInitials(firstName, lastName) {
  const firstInitial = firstName?.trim().charAt(0) ?? '';
  const lastInitial = lastName?.trim().charAt(0) ?? '';

  return `${firstInitial}${lastInitial}`.toUpperCase() || '—';
}

function StatusBadge({
  value,
  labels,
  type = 'registration',
}) {
  return (
    <span
      className={[
        'admin-status-badge',
        `admin-status-${type}`,
        `is-${value ?? 'unknown'}`,
      ].join(' ')}
    >
      <span
        className="admin-status-dot"
        aria-hidden="true"
      />

      {labels[value] ?? value ?? '—'}
    </span>
  );
}

function RegistrationCard({ registration }) {
  return (
    <article className="admin-registration-card">
      <header className="admin-registration-card-header">
        <div className="admin-registration-card-identity">
          <span
            className="admin-registration-avatar"
            aria-hidden="true"
          >
            {getInitials(
              registration.first_name,
              registration.last_name,
            )}
          </span>

          <div>
            <strong>
              {registration.first_name}
              {' '}
              {registration.last_name}
            </strong>

            <span>
              {formatDate(registration.created_at)}
            </span>
          </div>
        </div>

        <StatusBadge
          value={registration.status}
          labels={STATUS_LABELS}
        />
      </header>

      <dl className="admin-registration-card-details">
        <div>
          <dt>Profil</dt>
          <dd>
            {PROFILE_LABELS[registration.age_category] ?? '—'}
            {' · '}
            {PRACTICE_LABELS[registration.practice_type] ?? '—'}
          </dd>
        </div>

        <div>
          <dt>E-mail</dt>
          <dd>
            <a href={`mailto:${registration.email}`}>
              {registration.email}
            </a>
          </dd>
        </div>

        <div>
          <dt>Téléphone</dt>
          <dd>
            <a href={`tel:${registration.phone}`}>
              {registration.phone}
            </a>
          </dd>
        </div>

        <div>
          <dt>Paiement</dt>
          <dd>
            <StatusBadge
              value={registration.payment_status}
              labels={PAYMENT_STATUS_LABELS}
              type="payment"
            />
          </dd>
        </div>
      </dl>

      <button
        type="button"
        className="admin-card-action"
        disabled
      >
        Ouvrir le dossier
      </button>
    </article>
  );
}

export default function AdminPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [profileFilter, setProfileFilter] = useState('');
  const [practiceFilter, setPracticeFilter] = useState('');

  useEffect(() => {
    let active = true;

    async function loadRegistrations() {
      try {
        setLoading(true);
        setError('');

        const data = await listRegistrations();

        if (active) {
          setRegistrations(data);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Une erreur est survenue.',
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRegistrations();

    return () => {
      active = false;
    };
  }, []);

  const filteredRegistrations = useMemo(() => {
    const normalizedSearch = normalizeSearchValue(search);

    return registrations.filter((registration) => {
      const searchableText = normalizeSearchValue([
        registration.first_name,
        registration.last_name,
        registration.email,
        registration.phone,
      ].join(' '));

      const matchesSearch =
        !normalizedSearch
        || searchableText.includes(normalizedSearch);

      const matchesStatus =
        !statusFilter
        || registration.status === statusFilter;

      const matchesProfile =
        !profileFilter
        || registration.age_category === profileFilter;

      const matchesPractice =
        !practiceFilter
        || registration.practice_type === practiceFilter;

      return (
        matchesSearch
        && matchesStatus
        && matchesProfile
        && matchesPractice
      );
    });
  }, [
    practiceFilter,
    profileFilter,
    registrations,
    search,
    statusFilter,
  ]);

  const counters = useMemo(() => ({
    total: registrations.length,

    submitted: registrations.filter(
      (registration) => registration.status === 'soumis',
    ).length,

    incomplete: registrations.filter(
      (registration) =>
        registration.status === 'incomplet'
        || registration.status === 'complement_demande',
    ).length,

    validated: registrations.filter(
      (registration) =>
        registration.status === 'valide'
        || registration.status === 'paye',
    ).length,
  }), [registrations]);

  function resetFilters() {
    setSearch('');
    setStatusFilter('');
    setProfileFilter('');
    setPracticeFilter('');
  }

  const filtersActive = Boolean(
    search
    || statusFilter
    || profileFilter
    || practiceFilter,
  );

  return (
      <div
  className={[
    'admin-dashboard',
    sidebarCollapsed ? 'is-sidebar-collapsed' : '',
  ]
    .filter(Boolean)
    .join(' ')}
>
  <AdminSidebar
    activeItem="registrations"
    collapsed={sidebarCollapsed}
    onToggle={() =>
      setSidebarCollapsed((current) => !current)
    }
  />

      <div className="admin-dashboard-content">
        <main className="admin-page">
          <section className="admin-shell">
            <header className="admin-header">
              <div>
                <p className="admin-header-kicker">
                  Back-office El Carino
                </p>

                <h1>Inscriptions</h1>

                <p>
                  Consultez et traitez les dossiers transmis
                  par les adhérents.
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

            <section className="admin-content-card">
              <header className="admin-content-card-header">
                <div className="admin-list-title">
                  <h2>Liste des dossiers</h2>

                  <span>
                    {filteredRegistrations.length}
                    {' '}
                    dossier
                    {filteredRegistrations.length > 1 ? 's' : ''}
                    {' '}
                    affiché
                    {filteredRegistrations.length > 1 ? 's' : ''}
                  </span>
                </div>

                {filtersActive && (
                  <button
                    type="button"
                    className="admin-reset-filters"
                    onClick={resetFilters}
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </header>

              <div className="admin-filters">
                <div className="admin-search-field">
                  <label htmlFor="admin-search">
                    Rechercher
                  </label>

                  <div className="admin-search-control">
                    <span aria-hidden="true">⌕</span>

                    <input
                      id="admin-search"
                      type="search"
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                      placeholder="Nom, e-mail ou téléphone"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="admin-status-filter">
                    Statut
                  </label>

                  <select
                    id="admin-status-filter"
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                  >
                    <option value="">Tous les statuts</option>

                    {Object.entries(STATUS_LABELS).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="admin-profile-filter">
                    Profil
                  </label>

                  <select
                    id="admin-profile-filter"
                    value={profileFilter}
                    onChange={(event) =>
                      setProfileFilter(event.target.value)
                    }
                  >
                    <option value="">Tous les profils</option>
                    <option value="enfant">Enfant</option>
                    <option value="adulte">Adulte</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="admin-practice-filter">
                    Pratique
                  </label>

                  <select
                    id="admin-practice-filter"
                    value={practiceFilter}
                    onChange={(event) =>
                      setPracticeFilter(event.target.value)
                    }
                  >
                    <option value="">
                      Toutes les pratiques
                    </option>

                    <option value="loisir">
                      Loisir
                    </option>

                    <option value="competition">
                      Compétition
                    </option>
                  </select>
                </div>
              </div>

              {loading && (
                <div className="admin-state-message">
                  <span className="admin-loader" />
                  <p>Chargement des inscriptions…</p>
                </div>
              )}

              {error && (
                <div
                  className="admin-state-message admin-error-message"
                  role="alert"
                >
                  <strong>
                    Impossible de charger les dossiers
                  </strong>

                  <p>{error}</p>
                </div>
              )}

              {!loading
                && !error
                && filteredRegistrations.length === 0 && (
                  <div className="admin-state-message">
                    <strong>Aucun dossier trouvé</strong>

                    <p>
                      Modifiez les filtres ou attendez la
                      réception de nouvelles inscriptions.
                    </p>
                  </div>
                )}

              {!loading
                && !error
                && filteredRegistrations.length > 0 && (
                  <>
                    <div className="admin-table-wrapper">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Adhérent</th>
                            <th>Profil</th>
                            <th>Pratique</th>
                            <th>Contact</th>
                            <th>Dossier</th>
                            <th>Paiement</th>
                            <th>Actions</th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredRegistrations.map(
                            (registration) => (
                              <tr key={registration.id}>
                                <td>
                                  {formatDate(
                                    registration.created_at,
                                  )}
                                </td>

                                <td>
                                  <div className="admin-member-cell">
                                    <span
                                      className="admin-registration-avatar"
                                      aria-hidden="true"
                                    >
                                      {getInitials(
                                        registration.first_name,
                                        registration.last_name,
                                      )}
                                    </span>

                                    <div>
                                      <strong>
                                        {registration.first_name}
                                        {' '}
                                        {registration.last_name}
                                      </strong>

                                      <small>
                                        Réf.
                                        {' '}
                                        {registration.id.slice(0, 8)}
                                      </small>
                                    </div>
                                  </div>
                                </td>

                                <td>
                                  <span className="admin-category-badge is-profile">
                                    {
                                      PROFILE_LABELS[
                                        registration.age_category
                                      ] ?? '—'
                                    }
                                  </span>
                                </td>

                                <td>
                                  <span className="admin-category-badge is-practice">
                                    {
                                      PRACTICE_LABELS[
                                        registration.practice_type
                                      ] ?? '—'
                                    }
                                  </span>
                                </td>

                                <td>
                                  <a
                                    href={`mailto:${registration.email}`}
                                  >
                                    {registration.email}
                                  </a>

                                  <span>
                                    {registration.phone}
                                  </span>
                                </td>

                                <td>
                                  <StatusBadge
                                    value={registration.status}
                                    labels={STATUS_LABELS}
                                  />
                                </td>

                                <td>
                                  <StatusBadge
                                    value={
                                      registration.payment_status
                                    }
                                    labels={PAYMENT_STATUS_LABELS}
                                    type="payment"
                                  />
                                </td>

                                <td>
                                  <button
                                    type="button"
                                    className="admin-row-action"
                                    disabled
                                    title="La fiche détaillée sera ajoutée ensuite"
                                  >
                                    Ouvrir
                                  </button>
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="admin-mobile-list">
                      {filteredRegistrations.map(
                        (registration) => (
                          <RegistrationCard
                            key={registration.id}
                            registration={registration}
                          />
                        ),
                      )}
                    </div>
                  </>
                )}
            </section>

            <footer className="admin-footer">
              El Carino — Back-office
            </footer>
          </section>
        </main>
      </div>
    </div>
  );
}
