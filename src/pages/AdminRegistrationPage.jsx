import MedicalCertificateReplacement from '../features/admin/components/MedicalCertificateReplacement';
import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useParams,
} from 'react-router-dom';

import AdminSidebar from '../features/admin/components/AdminSidebar';
import RegistrationAdminNote from '../features/admin/components/RegistrationAdminNote';
import RegistrationStatusEditor from '../features/admin/components/RegistrationStatusEditor';
import StatusBadge from '../features/admin/components/StatusBadge';

import {
  PAYMENT_STATUS_LABELS,
  PRACTICE_LABELS,
  PROFILE_LABELS,
  STATUS_LABELS,
} from '../features/admin/constants';

import {
  createMedicalCertificateUrl,
  getRegistrationById,
  updateRegistrationAdminNote,
  updateRegistrationStatus,
} from '../features/admin/services/registrationAdminService';

import { formatDate } from '../features/admin/utils/registrationFormatters';

import '../features/admin/admin.css';

function formatBoolean(value) {
  if (value === true) {
    return 'Oui';
  }

  if (value === false) {
    return 'Non';
  }

  return '—';
}

function formatGender(value) {
  const labels = {
    femme: 'Femme',
    homme: 'Homme',
    autre: 'Autre',
  };

  return labels[value] ?? value ?? '—';
}

function formatAmount(amountCents, currency) {
  if (
    amountCents === null
    || amountCents === undefined
  ) {
    return 'Non défini';
  }

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: (currency ?? 'eur').toUpperCase(),
  }).format(amountCents / 100);
}

function DetailRow({
  label,
  value,
}) {

  return (
    <div className="admin-detail-row">
      <dt>{label}</dt>
      <dd>{value || '—'}</dd>
    </div>
  );
}

export default function AdminRegistrationPage() {
  const { registrationId } = useParams();

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [registration, setRegistration] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [
    certificateOpening,
    setCertificateOpening,
  ] = useState(false);

  const [
    certificateError,
    setCertificateError,
  ] = useState('');

  useEffect(() => {
    let active = true;

    async function loadRegistration() {
      try {
        setLoading(true);
        setError('');

        const data = await getRegistrationById(
          registrationId,
        );

        if (active) {
          setRegistration(data);
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

    loadRegistration();

    return () => {
      active = false;
    };
  }, [registrationId]);

  async function handleStatusChange(status) {
    const updatedRegistration =
      await updateRegistrationStatus(
        registrationId,
        status,
      );

    setRegistration(updatedRegistration);
  }

  async function handleAdminNoteSave(adminNote) {
    const updatedRegistration =
      await updateRegistrationAdminNote(
        registrationId,
        adminNote,
      );

    setRegistration(updatedRegistration);
  }

  async function handleOpenMedicalCertificate() {
    if (
      certificateOpening
      || !registration?.medical_certificate_storage_path
    ) {
      return;
    }

    try {
      setCertificateOpening(true);
      setCertificateError('');

      const signedUrl =
        await createMedicalCertificateUrl(
          registration
            .medical_certificate_storage_path,
        );

      const link = document.createElement('a');

      link.href = signedUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      link.click();
    } catch (openError) {
      setCertificateError(
        openError instanceof Error
          ? openError.message
          : 'Impossible d’ouvrir le certificat médical.',
      );
    } finally {
      setCertificateOpening(false);
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
            <header className="admin-detail-header">
              <div>
                <Link
                  className="admin-detail-back-link"
                  to="/admin"
                >
                  ← Retour aux inscriptions
                </Link>

                <p className="admin-header-kicker">
                  Dossier d’inscription
                </p>

                <h1>
                  {registration
                    ? `${registration.first_name} ${registration.last_name}`
                    : 'Chargement du dossier'}
                </h1>

                {registration && (
                  <p>
                    Référence :
                    {' '}
                    <code>{registration.id}</code>
                  </p>
                )}
              </div>

              {registration && (
                <div className="admin-detail-statuses">
                  <StatusBadge
                    value={registration.status}
                    labels={STATUS_LABELS}
                  />

                  <StatusBadge
                    value={registration.payment_status}
                    labels={PAYMENT_STATUS_LABELS}
                    type="payment"
                  />
                </div>
              )}
            </header>

            {loading && (
              <div className="admin-state-message admin-detail-state">
                <span className="admin-loader" />
                <p>Chargement du dossier…</p>
              </div>
            )}

            {error && (
              <div
                className="admin-state-message admin-error-message admin-detail-state"
                role="alert"
              >
                <strong>
                  Impossible de charger le dossier
                </strong>

                <p>{error}</p>

                <Link
                  className="admin-detail-back-button"
                  to="/admin"
                >
                  Retour aux inscriptions
                </Link>
              </div>
            )}

            {!loading && !error && registration && (
              <>
                <RegistrationStatusEditor
          key={registration.id}
                  currentStatus={registration.status}
                  onSave={handleStatusChange}
                />

                <RegistrationAdminNote
          key={registration.id}
                  initialNote={registration.admin_note}
                  onSave={handleAdminNoteSave}
                />

                <div className="admin-detail-grid">
                <section className="admin-detail-card">
                  <header>
                    <span aria-hidden="true">1</span>

                    <div>
                      <h2>Profil</h2>
                      <p>
                        Catégorie et pratique sélectionnées.
                      </p>
                    </div>
                  </header>

                  <dl>
                    <DetailRow
                      label="Catégorie"
                      value={
                        PROFILE_LABELS[
                          registration.age_category
                        ]
                      }
                    />

                    <DetailRow
                      label="Pratique"
                      value={
                        PRACTICE_LABELS[
                          registration.practice_type
                        ]
                      }
                    />

                    <DetailRow
                      label="Date de création"
                      value={formatDate(
                        registration.created_at,
                      )}
                    />

                    <DetailRow
                      label="Dernière mise à jour"
                      value={formatDate(
                        registration.updated_at,
                      )}
                    />
                  </dl>
                </section>

                <section className="admin-detail-card">
                  <header>
                    <span aria-hidden="true">2</span>

                    <div>
                      <h2>Identité</h2>
                      <p>
                        Informations de la personne inscrite.
                      </p>
                    </div>
                  </header>

                  <dl>
                    <DetailRow
                      label="Nom"
                      value={registration.last_name}
                    />

                    <DetailRow
                      label="Prénom"
                      value={registration.first_name}
                    />

                    <DetailRow
                      label="Sexe"
                      value={formatGender(
                        registration.gender,
                      )}
                    />

                    <DetailRow
                      label="Date de naissance"
                      value={registration.birth_date}
                    />
                  </dl>
                </section>

                <section className="admin-detail-card">
                  <header>
                    <span aria-hidden="true">3</span>

                    <div>
                      <h2>Coordonnées</h2>
                      <p>
                        Contact et adresse de l’adhérent.
                      </p>
                    </div>
                  </header>

                  <dl>
                    <DetailRow
                      label="Adresse e-mail"
                      value={
                        <a
                          href={`mailto:${registration.email}`}
                        >
                          {registration.email}
                        </a>
                      }
                    />

                    <DetailRow
                      label="Téléphone"
                      value={
                        <a
                          href={`tel:${registration.phone}`}
                        >
                          {registration.phone}
                        </a>
                      }
                    />

                    <DetailRow
                      label="Adresse"
                      value={[
                        registration.address_line1,
                        registration.address_line2,
                        registration.postal_code,
                        registration.city,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    />
                  </dl>
                </section>

                <section className="admin-detail-card">
                  <header>
                    <span aria-hidden="true">4</span>

                    <div>
                      <h2>Contact d’urgence</h2>
                      <p>
                        Personne à prévenir en cas de besoin.
                      </p>
                    </div>
                  </header>

                  <dl>
                    <DetailRow
                      label="Nom et prénom"
                      value={
                        registration.emergency_contact_name
                      }
                    />

                    <DetailRow
                      label="Téléphone"
                      value={
                        <a
                          href={`tel:${registration.emergency_contact_phone}`}
                        >
                          {
                            registration.emergency_contact_phone
                          }
                        </a>
                      }
                    />
                  </dl>
                </section>

                {registration.age_category === 'enfant' && (
                  <section className="admin-detail-card">
                    <header>
                      <span aria-hidden="true">5</span>

                      <div>
                        <h2>Représentant légal</h2>
                        <p>
                          Coordonnées du responsable légal.
                        </p>
                      </div>
                    </header>

                    <dl>
                      <DetailRow
                        label="Nom et prénom"
                        value={
                          registration
                            .legal_representative_name
                        }
                      />

                      <DetailRow
                        label="Adresse e-mail"
                        value={
                          registration
                            .legal_representative_email
                            ? (
                              <a
                                href={`mailto:${registration.legal_representative_email}`}
                              >
                                {
                                  registration
                                    .legal_representative_email
                                }
                              </a>
                            )
                            : '—'
                        }
                      />

                      <DetailRow
                        label="Téléphone"
                        value={
                          registration
                            .legal_representative_phone
                            ? (
                              <a
                                href={`tel:${registration.legal_representative_phone}`}
                              >
                                {
                                  registration
                                    .legal_representative_phone
                                }
                              </a>
                            )
                            : '—'
                        }
                      />
                    </dl>
                  </section>
                )}

                <section className="admin-detail-card admin-detail-card-wide">
                  <header>
                    <span aria-hidden="true">6</span>

                    <div>
                      <h2>Santé</h2>
                      <p>
                        Questionnaire et certificat médical.
                      </p>
                    </div>
                  </header>

                  <dl>
                    <DetailRow
                      label="Questionnaire complété"
                      value={formatBoolean(
                        registration
                          .health_questionnaire_completed,
                      )}
                    />

                    <DetailRow
                      label="Réponse positive"
                      value={formatBoolean(
                        registration
                          .health_questionnaire_has_positive_answer,
                      )}
                    />

                    <DetailRow
                      label="Certificat médical"
                      value={
                        registration
                          .medical_certificate_required
                          ? (
                            registration
                              .medical_certificate_storage_path
                              ? 'Requis et reçu'
                              : 'Requis mais absent'
                          )
                          : (
                            registration
                              .medical_certificate_storage_path
                              ? 'Fourni'
                              : 'Non requis'
                          )
                      }
                    />

                    <DetailRow
                      label="Nom du fichier"
                      value={
                        registration
                          .medical_certificate_filename
                        ?? 'Aucun fichier'
                      }
                    />

                    <DetailRow
                      label="Date de dépôt"
                      value={
                        registration
                          .medical_certificate_uploaded_at
                          ? formatDate(
                            registration
                              .medical_certificate_uploaded_at,
                          )
                          : '—'
                      }
                    />
                  </dl>

                {registration.medical_certificate_storage_path && (
  <>
    <button
      type="button"
      className="admin-detail-back-button"
      onClick={handleOpenMedicalCertificate}
      disabled={certificateOpening}
    >
      {certificateOpening
        ? 'Ouverture en cours…'
        : 'Ouvrir le certificat médical'}
    </button>

    <MedicalCertificateReplacement
      registration={registration}
      onUpdated={setRegistration}
    />
  </>
)}

                  {certificateError && (
                    <p
                      className="admin-error-message"
                      role="alert"
                    >
                      {certificateError}
                    </p>
                  )}
                </section>

                <section className="admin-detail-card">
                  <header>
                    <span aria-hidden="true">7</span>

                    <div>
                      <h2>Autorisations</h2>
                      <p>
                        Consentements déclarés dans le formulaire.
                      </p>
                    </div>
                  </header>

                  <dl>
                    <DetailRow
                      label="Droit à l’image"
                      value={formatBoolean(
                        registration.image_consent,
                      )}
                    />

                    <DetailRow
                      label="Autorisation parentale"
                      value={
                        registration.age_category === 'enfant'
                          ? formatBoolean(
                            registration
                              .parental_authorization,
                          )
                          : 'Non concerné'
                      }
                    />
                  </dl>
                </section>

                <section className="admin-detail-card admin-detail-card-wide">
                  <header>
                    <span aria-hidden="true">8</span>

                    <div>
                      <h2>Paiement</h2>
                      <p>
                        Informations financières du dossier.
                      </p>
                    </div>
                  </header>

                  <dl>
                    <DetailRow
                      label="Montant"
                      value={formatAmount(
                        registration.payment_amount_cents,
                        registration.payment_currency,
                      )}
                    />

                    <DetailRow
                      label="État du paiement"
                      value={
                        PAYMENT_STATUS_LABELS[
                          registration.payment_status
                        ]
                      }
                    />

                    <DetailRow
                      label="Date de paiement"
                      value={formatDate(
                        registration.paid_at,
                      )}
                    />
                  </dl>
                </section>
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
