import { Link } from 'react-router-dom';

import {
  PRACTICE_LABELS,
  PROFILE_LABELS,
  STATUS_LABELS,
} from '../constants';

import {
  formatDate,
  getInitials,
} from '../utils/registrationFormatters';

import StatusBadge from './StatusBadge';

const PAYMENT_STATUS_LABELS = {
  unpaid: 'Non payé',
  pending: 'En attente d’encaissement',
  partial: 'Partiellement payé',
  paid: 'Payé',
  undefined: 'À définir',
};

export default function RegistrationCard({
  registration,
}) {
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
              {formatDate(
                registration.created_at,
              )}
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
            {PROFILE_LABELS[
              registration.age_category
            ] ?? '—'}
            {' · '}
            {PRACTICE_LABELS[
              registration.practice_type
            ] ?? '—'}
          </dd>
        </div>

        <div>
          <dt>E-mail</dt>

          <dd>
            <a
              href={`mailto:${registration.email}`}
            >
              {registration.email}
            </a>
          </dd>
        </div>

        <div>
          <dt>Téléphone</dt>

          <dd>
            <a
              href={`tel:${registration.phone}`}
            >
              {registration.phone}
            </a>
          </dd>
        </div>

        <div>
          <dt>Paiement</dt>

          <dd>
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
          </dd>
        </div>
      </dl>

      <Link
        className="admin-card-action"
        to={`/admin/inscriptions/${registration.id}`}
      >
        Ouvrir le dossier
      </Link>
    </article>
  );
}
