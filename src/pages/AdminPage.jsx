import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import AdminHeader from '../features/admin/components/AdminHeader';
import AdminSidebar from '../features/admin/components/AdminSidebar';
import AdminStatistics from '../features/admin/components/AdminStatistics';
import RegistrationFilters from '../features/admin/components/RegistrationFilters';
import RegistrationTable from '../features/admin/components/RegistrationTable';

import { exportRegistrationsToExcel } from '../features/admin/services/exportExcel';
import { listRegistrations } from '../features/admin/services/registrationAdminService';

import { normalizeSearchValue } from '../features/admin/utils/registrationFormatters';

import '../features/admin/admin.css';

export default function AdminPage() {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [registrations, setRegistrations] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportError, setExportError] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] =
    useState('');
  const [profileFilter, setProfileFilter] =
    useState('');
  const [practiceFilter, setPracticeFilter] =
    useState('');

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
    const normalizedSearch =
      normalizeSearchValue(search);

    return registrations.filter((registration) => {
      const searchableText =
        normalizeSearchValue([
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
      (registration) =>
        registration.status === 'soumis',
    ).length,

    incomplete: registrations.filter(
      (registration) =>
        registration.status === 'incomplet'
        || registration.status
          === 'complement_demande',
    ).length,

    validated: registrations.filter(
      (registration) =>
        registration.status === 'valide'
        || registration.status === 'paye',
    ).length,
  }), [registrations]);

  const filtersActive = Boolean(
    search
    || statusFilter
    || profileFilter
    || practiceFilter,
  );

  function resetFilters() {
    setSearch('');
    setStatusFilter('');
    setProfileFilter('');
    setPracticeFilter('');
  }

  function handleExport() {
    try {
      setExportError('');

      exportRegistrationsToExcel(
        filteredRegistrations,
      );
    } catch (exportException) {
      setExportError(
        exportException instanceof Error
          ? exportException.message
          : 'Impossible de générer le fichier Excel.',
      );
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
        activeItem="registrations"
        collapsed={sidebarCollapsed}
        onToggle={() =>
          setSidebarCollapsed((current) => !current)
        }
      />

      <div className="admin-dashboard-content">
        <main className="admin-page">
          <section className="admin-shell">
            <AdminHeader />

            <AdminStatistics counters={counters} />

            <section className="admin-content-card">
              <header className="admin-content-card-header">
                <div className="admin-list-title">
                  <h2>Liste des dossiers</h2>

                  <span>
                    {filteredRegistrations.length}
                    {' '}
                    dossier
                    {filteredRegistrations.length > 1
                      ? 's'
                      : ''}
                    {' '}
                    affiché
                    {filteredRegistrations.length > 1
                      ? 's'
                      : ''}
                  </span>
                </div>

                <button
                  type="button"
                  className="admin-export-button"
                  onClick={handleExport}
                  disabled={
                    loading
                    || filteredRegistrations.length === 0
                  }
                >
                  Exporter Excel
                </button>
              </header>

              {exportError && (
                <div
                  className="admin-export-error"
                  role="alert"
                >
                  {exportError}
                </div>
              )}

              <RegistrationFilters
                search={search}
                statusFilter={statusFilter}
                profileFilter={profileFilter}
                practiceFilter={practiceFilter}
                filtersActive={filtersActive}
                onSearchChange={setSearch}
                onStatusChange={setStatusFilter}
                onProfileChange={setProfileFilter}
                onPracticeChange={setPracticeFilter}
                onReset={resetFilters}
              />

              {loading && (
                <div className="admin-state-message">
                  <span className="admin-loader" />

                  <p>
                    Chargement des inscriptions…
                  </p>
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
                    <strong>
                      Aucun dossier trouvé
                    </strong>

                    <p>
                      Modifiez les filtres ou attendez
                      de nouvelles inscriptions.
                    </p>
                  </div>
                )}

              {!loading
                && !error
                && filteredRegistrations.length > 0 && (
                  <RegistrationTable
                    registrations={
                      filteredRegistrations
                    }
                  />
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
