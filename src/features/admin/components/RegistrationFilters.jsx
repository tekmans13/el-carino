import {
  PRACTICE_LABELS,
  PROFILE_LABELS,
  STATUS_LABELS,
} from '../constants';

export default function RegistrationFilters({
  search,
  statusFilter,
  profileFilter,
  practiceFilter,
  onSearchChange,
  onStatusChange,
  onProfileChange,
  onPracticeChange,
}) {
  return (
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
              onSearchChange(event.target.value)
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

      <div>
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

      <div>
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
    </div>
  );
}
