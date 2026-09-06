import {
  useEffect,
  useState,
} from 'react';

import AdminHeader from '../features/admin/components/AdminHeader';
import AdminSidebar from '../features/admin/components/AdminSidebar';

import {
  createAdminUser,
  deleteAdminUser,
  getAdminUsers,
} from '../features/admin/services/adminUsersService';

import '../features/admin/admin.css';
import '../features/admin/admin-settings.css';

function formatDate(date) {
  if (!date) {
    return 'Jamais';
  }

  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(date));
}

export default function AdminUsersPage() {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingUserId, setDeletingUserId] =
    useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    let active = true;

    async function loadInitialUsers() {
      try {
        const data = await getAdminUsers();

        if (active) {
          setUsers(data);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Impossible de charger les utilisateurs.',
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadInitialUsers();

    return () => {
      active = false;
    };
  }, []);

  async function loadUsers() {
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Impossible de charger les utilisateurs.',
      );
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setSuccess('');

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password
    ) {
      setError('Tous les champs sont obligatoires.');
      return;
    }

    if (password.length < 6) {
      setError(
        'Le mot de passe doit contenir au moins 6 caractères.',
      );
      return;
    }

    try {
      setCreating(true);

      await createAdminUser({
        firstName,
        lastName,
        email,
        password,
      });

      setForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      });

      await loadUsers();

      setSuccess(
        `L'utilisateur ${firstName} ${lastName} a été créé avec succès.`,
      );
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Impossible de créer l'utilisateur.",
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteUser(user) {
    const displayName =
      `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();

    const confirmed = window.confirm(
      `Supprimer définitivement ${
        displayName || user.email
      } ?\n\nCette action est irréversible.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      setDeletingUserId(user.id);

      await deleteAdminUser(user.id);

      await loadUsers();

      setSuccess(
        `L'utilisateur ${
          displayName || user.email
        } a été supprimé.`,
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Impossible de supprimer l'utilisateur.",
      );
    } finally {
      setDeletingUserId(null);
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
        activeItem="accounts"
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
              title="Utilisateurs"
              description="Gérez les membres du bureau autorisés à accéder au back-office."
            />

            {error && (
              <div
                className="admin-state-message admin-error-message"
                role="alert"
              >
                <strong>Une erreur est survenue</strong>
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div
                className="admin-settings-message is-success"
                role="status"
              >
                {success}
              </div>
            )}

            <section className="admin-content-card">
              <header className="admin-content-card-header">
                <div className="admin-list-title">
                  <h2>Ajouter un utilisateur</h2>

                  <span>
                    Nouveau membre du bureau
                  </span>
                </div>
              </header>

              <form
                className="admin-users-form"
                onSubmit={handleSubmit}
              >
                <label className="admin-settings-field">
                  <span className="admin-settings-label">
                    Prénom
                  </span>

                  <input
                    name="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                    disabled={creating}
                    required
                  />
                </label>

                <label className="admin-settings-field">
                  <span className="admin-settings-label">
                    Nom
                  </span>

                  <input
                    name="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                    disabled={creating}
                    required
                  />
                </label>

                <label className="admin-settings-field">
                  <span className="admin-settings-label">
                    Email
                  </span>

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    disabled={creating}
                    required
                  />
                </label>

                <label className="admin-settings-field">
                  <span className="admin-settings-label">
                    Mot de passe initial
                  </span>

                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    minLength={6}
                    disabled={creating}
                    required
                  />
                </label>

                <button
                  type="submit"
                  className="admin-export-button"
                  disabled={creating}
                >
                  {creating
                    ? 'Création…'
                    : 'Créer'}
                </button>
              </form>
            </section>

            <section className="admin-content-card">
              <header className="admin-content-card-header">
                <div className="admin-list-title">
                  <h2>Utilisateurs existants</h2>

                  <span>
                    {users.length} utilisateur
                    {users.length > 1 ? 's' : ''}
                  </span>
                </div>
              </header>

              {loading && (
                <div className="admin-state-message">
                  <span className="admin-loader" />

                  <p>
                    Chargement des utilisateurs…
                  </p>
                </div>
              )}

              {!loading && users.length === 0 && (
                <div className="admin-state-message">
                  <p>Aucun utilisateur.</p>
                </div>
              )}

              {!loading && users.length > 0 && (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Créé le</th>
                        <th>
                          Dernière connexion
                        </th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>
                            {user.first_name || '—'}
                          </td>

                          <td>
                            {user.last_name || '—'}
                          </td>

                          <td>{user.email}</td>

                          <td>
                            {formatDate(
                              user.created_at,
                            )}
                          </td>

                          <td>
                            {user.last_sign_in_at
                              ? formatDate(
                                  user.last_sign_in_at,
                                )
                              : 'Jamais'}
                          </td>

                          <td>
                            <button
                              type="button"
                              className="admin-delete-button"
                              onClick={() =>
                                handleDeleteUser(user)
                              }
                              disabled={
                                deletingUserId ===
                                user.id
                              }
                            >
                              {deletingUserId ===
                              user.id
                                ? 'Suppression…'
                                : 'Supprimer'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
