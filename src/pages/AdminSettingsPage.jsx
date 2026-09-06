import {
  useEffect,
  useState,
} from 'react';

import AdminHeader from '../features/admin/components/AdminHeader';
import AdminSidebar from '../features/admin/components/AdminSidebar';

import {
  getClubSettings,
  updateClubSettings,
} from '../features/admin/services/clubSettingsService';

import '../features/admin/admin.css';
import '../features/admin/admin-settings.css';

function centsToEuros(value) {
  return Number(value ?? 0) / 100;
}

export default function AdminSettingsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [settingsId, setSettingsId] = useState(null);

  const [adultAgeThreshold, setAdultAgeThreshold] =
    useState('');

  const [minorAnnualFee, setMinorAnnualFee] =
    useState('');

  const [adultAnnualFee, setAdultAnnualFee] =
    useState('');

  const [federalLicenseFee, setFederalLicenseFee] =
    useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        setLoading(true);
        setError('');

        const data = await getClubSettings();

        if (!active) {
          return;
        }

        setSettingsId(data.id);

        setAdultAgeThreshold(
          String(data.adult_age_threshold),
        );

        setMinorAnnualFee(
          String(
            centsToEuros(
              data.minor_annual_fee_cents,
            ),
          ),
        );

        setAdultAnnualFee(
          String(
            centsToEuros(
              data.adult_annual_fee_cents,
            ),
          ),
        );

        setFederalLicenseFee(
          String(
            centsToEuros(
              data.federal_license_fee_cents,
            ),
          ),
        );
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Impossible de charger les paramètres.',
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    setSaveError('');
    setSaveSuccess('');

    const parsedAdultAgeThreshold =
      Number(adultAgeThreshold);

    const parsedMinorAnnualFee =
      Number(minorAnnualFee);

    const parsedAdultAnnualFee =
      Number(adultAnnualFee);

    const parsedFederalLicenseFee =
      Number(federalLicenseFee);

    if (
      !Number.isInteger(parsedAdultAgeThreshold)
      || parsedAdultAgeThreshold < 1
      || parsedAdultAgeThreshold > 120
    ) {
      setSaveError(
        'Le seuil adulte doit être un âge entier compris entre 1 et 120 ans.',
      );
      return;
    }

    if (
      !Number.isFinite(parsedMinorAnnualFee)
      || parsedMinorAnnualFee < 0
    ) {
      setSaveError(
        'La cotisation mineur doit être un montant positif ou nul.',
      );
      return;
    }

    if (
      !Number.isFinite(parsedAdultAnnualFee)
      || parsedAdultAnnualFee < 0
    ) {
      setSaveError(
        'La cotisation adulte doit être un montant positif ou nul.',
      );
      return;
    }

    if (
      !Number.isFinite(parsedFederalLicenseFee)
      || parsedFederalLicenseFee < 0
    ) {
      setSaveError(
        'Le montant de la licence fédérale doit être positif ou nul.',
      );
      return;
    }

    if (!settingsId) {
      setSaveError(
        'Les paramètres du club ne sont pas chargés.',
      );
      return;
    }

    try {
      setSaving(true);

      const updatedSettings =
        await updateClubSettings(
          settingsId,
          {
            adultAgeThreshold:
              parsedAdultAgeThreshold,
            minorAnnualFee:
              parsedMinorAnnualFee,
            adultAnnualFee:
              parsedAdultAnnualFee,
            federalLicenseFee:
              parsedFederalLicenseFee,
          },
        );

      setAdultAgeThreshold(
        String(updatedSettings.adult_age_threshold),
      );

      setMinorAnnualFee(
        String(
          centsToEuros(
            updatedSettings.minor_annual_fee_cents,
          ),
        ),
      );

      setAdultAnnualFee(
        String(
          centsToEuros(
            updatedSettings.adult_annual_fee_cents,
          ),
        ),
      );

      setFederalLicenseFee(
        String(
          centsToEuros(
            updatedSettings
              .federal_license_fee_cents,
          ),
        ),
      );

      setSaveSuccess(
        'Les paramètres ont été enregistrés.',
      );
    } catch (updateError) {
      setSaveError(
        updateError instanceof Error
          ? updateError.message
          : 'Impossible d’enregistrer les paramètres.',
      );
    } finally {
      setSaving(false);
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
        activeItem="settings"
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
              title="Paramètres"
              description="Configurez les règles d’inscription et les tarifs appliqués par le club."
            />

            {loading && (
              <div className="admin-state-message">
                <span className="admin-loader" />

                <p>
                  Chargement des paramètres…
                </p>
              </div>
            )}

            {error && (
              <div
                className="admin-state-message admin-error-message"
                role="alert"
              >
                <strong>
                  Impossible de charger les paramètres
                </strong>

                <p>{error}</p>
              </div>
            )}

            {!loading && !error && (
              <form
                className="admin-settings-form"
                onSubmit={handleSubmit}
              >
                <section className="admin-content-card">
                  <header className="admin-content-card-header">
                    <div className="admin-list-title">
                      <h2>
                        Catégories d’âge
                      </h2>

                      <span>
                        Seuil mineur / adulte
                      </span>
                    </div>
                  </header>

                  <div className="admin-settings-section">
                    <label className="admin-settings-field">
                      <span className="admin-settings-label">
                        Âge à partir duquel un adhérent est adulte
                      </span>

                      <span className="admin-settings-input-wrapper">
                        <input
                          type="number"
                          min="1"
                          max="120"
                          step="1"
                          value={adultAgeThreshold}
                          onChange={(event) =>
                            setAdultAgeThreshold(
                              event.target.value,
                            )
                          }
                          disabled={saving}
                          required
                        />

                        <span>ans</span>
                      </span>

                      <small>
                        Avec une valeur de 18, les adhérents
                        de moins de 18 ans sont considérés
                        comme mineurs et ceux de 18 ans et
                        plus comme adultes.
                      </small>
                    </label>
                  </div>
                </section>

                <section className="admin-content-card">
                  <header className="admin-content-card-header">
                    <div className="admin-list-title">
                      <h2>Tarifs</h2>

                      <span>
                        Cotisations annuelles
                      </span>
                    </div>
                  </header>

                  <div className="admin-settings-grid">
                    <label className="admin-settings-field">
                      <span className="admin-settings-label">
                        Cotisation mineur
                      </span>

                      <span className="admin-settings-input-wrapper">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={minorAnnualFee}
                          onChange={(event) =>
                            setMinorAnnualFee(
                              event.target.value,
                            )
                          }
                          disabled={saving}
                          required
                        />

                        <span>€</span>
                      </span>
                    </label>

                    <label className="admin-settings-field">
                      <span className="admin-settings-label">
                        Cotisation adulte
                      </span>

                      <span className="admin-settings-input-wrapper">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={adultAnnualFee}
                          onChange={(event) =>
                            setAdultAnnualFee(
                              event.target.value,
                            )
                          }
                          disabled={saving}
                          required
                        />

                        <span>€</span>
                      </span>
                    </label>

                    <label className="admin-settings-field">
                      <span className="admin-settings-label">
                        Licence fédérale
                      </span>

                      <span className="admin-settings-input-wrapper">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={federalLicenseFee}
                          onChange={(event) =>
                            setFederalLicenseFee(
                              event.target.value,
                            )
                          }
                          disabled={saving}
                          required
                        />

                        <span>€</span>
                      </span>

                      <small>
                        Montant ajouté automatiquement pour
                        une inscription en compétition.
                      </small>
                    </label>
                  </div>
                </section>

                {saveSuccess && (
                  <div
                    className="admin-settings-message is-success"
                    role="status"
                  >
                    {saveSuccess}
                  </div>
                )}

                {saveError && (
                  <div
                    className="admin-settings-message is-error"
                    role="alert"
                  >
                    {saveError}
                  </div>
                )}

                <div className="admin-settings-actions">
                  <button
                    type="submit"
                    className="admin-export-button"
                    disabled={saving}
                  >
                    {saving
                      ? 'Enregistrement…'
                      : 'Enregistrer les paramètres'}
                  </button>
                </div>
              </form>
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
