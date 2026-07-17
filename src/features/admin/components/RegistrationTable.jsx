import {
  PAYMENT_STATUS_LABELS,
  PRACTICE_LABELS,
  PROFILE_LABELS,
  STATUS_LABELS,
} from '../constants';

import {
  formatDate,
  getInitials,
} from '../utils/registrationFormatters';

import RegistrationCard from './RegistrationCard';
import StatusBadge from './StatusBadge';

export default function RegistrationTable({
  registrations,
}) {
  return (
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
            {registrations.map((registration) => (
              <tr key={registration.id}>
                <td>
                  {formatDate(registration.created_at)}
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
                    {PROFILE_LABELS[
                      registration.age_category
                    ] ?? '—'}
                  </span>
                </td>

                <td>
                  <span className="admin-category-badge is-practice">
                    {PRACTICE_LABELS[
                      registration.practice_type
                    ] ?? '—'}
                  </span>
                </td>

                <td>
                  <a
                    href={`mailto:${registration.email}`}
                  >
                    {registration.email}
                  </a>

                  <span>{registration.phone}</span>
                </td>

                <td>
                  <StatusBadge
                    value={registration.status}
                    labels={STATUS_LABELS}
                  />
                </td>

                <td>
                  <StatusBadge
                    value={registration.payment_status}
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
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-mobile-list">
        {registrations.map((registration) => (
          <RegistrationCard
            key={registration.id}
            registration={registration}
          />
        ))}
      </div>
    </>
  );
}
