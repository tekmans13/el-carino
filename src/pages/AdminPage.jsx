import { useEffect, useState } from 'react';

import { listRegistrations } from '../features/admin/services/registrationAdminService';

function formatDate(value) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatValue(value) {
  const labels = {
    enfant: 'Enfant',
    adulte: 'Adulte',
    loisir: 'Loisir',
    competition: 'Compétition',
    brouillon: 'Brouillon',
    soumis: 'Soumis',
    incomplet: 'Incomplet',
    complement_demande: 'Complément demandé',
    valide: 'Validé',
    en_attente_paiement: 'En attente de paiement',
    paye: 'Payé',
    refuse: 'Refusé',
    annule: 'Annulé',
    non_demande: 'Non demandé',
    en_attente: 'En attente',
    session_creee: 'Session créée',
    echoue: 'Échoué',
    rembourse: 'Remboursé',
  };

  return labels[value] ?? value ?? '—';
}

export default function AdminPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <main>
      <header>
        <p>Back-office El Carino</p>
        <h1>Inscriptions</h1>
        <p>
          Consultez les dossiers soumis par les adhérents.
        </p>
      </header>

      {loading && (
        <p>Chargement des inscriptions…</p>
      )}

      {error && (
        <p role="alert">{error}</p>
      )}

      {!loading && !error && registrations.length === 0 && (
        <p>Aucune inscription enregistrée.</p>
      )}

      {!loading && !error && registrations.length > 0 && (
        <div className="admin-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Adhérent</th>
                <th>Profil</th>
                <th>Pratique</th>
                <th>Contact</th>
                <th>Dossier</th>
                <th>Paiement</th>
              </tr>
            </thead>

            <tbody>
              {registrations.map((registration) => (
                <tr key={registration.id}>
                  <td>
                    {formatDate(registration.created_at)}
                  </td>

                  <td>
                    <strong>
                      {registration.first_name}
                      {' '}
                      {registration.last_name}
                    </strong>
                  </td>

                  <td>
                    {formatValue(
                      registration.age_category,
                    )}
                  </td>

                  <td>
                    {formatValue(
                      registration.practice_type,
                    )}
                  </td>

                  <td>
                    <a href={`mailto:${registration.email}`}>
                      {registration.email}
                    </a>

                    <br />

                    <a href={`tel:${registration.phone}`}>
                      {registration.phone}
                    </a>
                  </td>

                  <td>
                    {formatValue(registration.status)}
                  </td>

                  <td>
                    {formatValue(
                      registration.payment_status,
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
