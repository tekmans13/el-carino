import {
  PRACTICE_LABELS,
  PROFILE_LABELS,
  STATUS_LABELS,
} from '../constants';

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 4 4" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 8V4.5L2 7.5 5 10V8a7 7 0 1 1-1 7" />
    </svg>
  );
}

export default function RegistrationFilters({
  search,
  statusFilter,
  profileFilter,
  practiceFilter,
  filtersActive,
  onSearchChange,
  onStatusChange,
  onProfileChange,
  onPracticeChange,
  onReset,
}) {
  return (
    <div className="admin-filters">
      <div className="admin-search-field">
        <label
          className="sr-only"
          htmlFor="admin-search"
        >
          Rechercher
        </label>

        <div className="admin-search-control">
          <SearchIcon />

          <input
            id="admin-search"
            type="search"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Rechercher un nom, e-mail ou téléphone..."
          />
        </div>
      </div>

      <div className="admin-filter-field">
        <label htmlFor="admin-status-filter">
          Statut
        </label>

        <select
          id="admin-status-filter"
          value={statusFilter}
          onChange={(event) =>
            onStatusChange(event.target.value)
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

      <div className="admin-filter-field">
        <label htmlFor="admin-profile-filter">
          Profil
        </label>

        <select
          id="admin-profile-filter"
          value={profileFilter}
          onChange={(event) =>
            onProfileChange(event.target.value)
          }
        >
          <option value="">Tous les profils</option>

          {Object.entries(PROFILE_LABELS).map(
            ([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ),
          )}
        </select>
      </div>

      <div className="admin-filter-field">
        <label htmlFor="admin-practice-filter">
          Pratique
        </label>

        <select
          id="admin-practice-filter"
          value={practiceFilter}
          onChange={(event) =>
            onPracticeChange(event.target.value)
          }
        >
          <option value="">
            Toutes les pratiques
          </option>

          {Object.entries(PRACTICE_LABELS).map(
            ([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ),
          )}
        </select>
      </div>

      <button
        type="button"
        className="admin-reset-filters"
        onClick={onReset}
        disabled={!filtersActive}
      >
        <ResetIcon />
        <span>Réinitialiser</span>
      </button>
    </div>
  );
}
