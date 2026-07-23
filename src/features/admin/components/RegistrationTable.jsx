import { Link } from 'react-router-dom';

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

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M4 6.5h16v11H4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m4.5 7 7.5 6 7.5-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M2.8 12s3.4-5.5 9.2-5.5S21.2 12 21.2 12 17.8 17.5 12 17.5 2.8 12 2.8 12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="2.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5.5"
        width="18"
        height="13"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M3 9.5h18M7 14.5h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M5 19h3.5L19 8.5 15.5 5 5 15.5V19Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m13.8 6.7 3.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M5 7h14M9 7V4.5h6V7M7.5 7l.7 12h7.6l.7-12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 10.5v5M14 10.5v5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function RegistrationTable({
  registrations,
}) {
  return (
    <>
      <div className="admin-table-wrapper">
        <table className="admin-table admin-registrations-table">
          <thead>
            <tr>
              <th>Adhérent</th>
              <th>Profil</th>
              <th>Pratique</th>
              <th>Contact</th>
              <th>Dossier</th>
              <th>Paiement</th>
              <th>Date</th>
              <th className="admin-actions-column">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {registrations.map((registration) => (
              <tr key={registration.id}>
                <td className="admin-member-column">
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

                <td className="admin-contact-column">
                  <a href={`mailto:${registration.email}`}>
                    {registration.email}
                  </a>

                  <span>{registration.phone || '—'}</span>
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

                <td className="admin-date-column">
                  {formatDate(registration.created_at)}
                </td>

                <td className="admin-actions-column">
                  <div className="admin-row-actions">
                    <a
                      className="admin-icon-action"
                      href={`mailto:${registration.email}`}
                      aria-label={`Envoyer un e-mail à ${registration.first_name} ${registration.last_name}`}
                      title="Envoyer un e-mail"
                    >
                      <MailIcon />
                    </a>

                    <Link
                      className="admin-icon-action is-primary"
                      to={`/admin/inscriptions/${registration.id}`}
                      aria-label={`Ouvrir le dossier de ${registration.first_name} ${registration.last_name}`}
                      title="Ouvrir le dossier"
                    >
                      <EyeIcon />
                    </Link>

                    <button
                      type="button"
                      className="admin-icon-action"
                      aria-label="Gérer le paiement"
                      title="Paiement — à venir"
                      disabled
                    >
                      <PaymentIcon />
                    </button>

                    <button
                      type="button"
                      className="admin-icon-action"
                      aria-label="Modifier le dossier"
                      title="Modification — à venir"
                      disabled
                    >
                      <EditIcon />
                    </button>

                    <button
                      type="button"
                      className="admin-icon-action is-danger"
                      aria-label="Supprimer le dossier"
                      title="Suppression — à venir"
                      disabled
                    >
                      <DeleteIcon />
                    </button>
                  </div>
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
