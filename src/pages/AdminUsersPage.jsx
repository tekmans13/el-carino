import {
  useEffect,
  useState,
} from 'react';

import AdminHeader from '../features/admin/components/AdminHeader';
import AdminSidebar from '../features/admin/components/AdminSidebar';

import {
  createAdminUser,
  getAdminUsers,
} from '../features/admin/services/adminUsersService';

import '../features/admin/admin.css';

export default function AdminUsersPage() {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function loadUsers() {
    try {
      setLoading(true);
      setError('');

      const data = await getAdminUsers();
      setUsers(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Une erreur est survenue.',
      );
    } finally {
      setLoading(false);
    }
  }

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
            : 'Une erreur est survenue.',
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

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setCreating(true);
      setError('');
      setSuccess('');

      await createAdminUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });

      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');

      setSuccess('Utilisateur créé avec succès.');

      await loadUsers();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : 'Impossible de créer l’utilisateur.',
      );
    } finally {
      setCreating(false);
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
          setSidebarCollapsed((current) => !current)
        }
      />

      <div className="admin-dashboard-content">
        <main className="admin-page">
          <section className="admin-shell">
            <AdminHeader
              title="Utilisateurs"
              description="Gérez les membres du bureau ayant accès au back-office."
            />

            <section className="admin-content-card">
              <header className="admin-content-card-header">
                <div className="admin-list-title">
                  <h2>Utilisateurs</h2>

                  <span>
                    {users.length}{' '}
                    utilisateur
                    {users.length > 1 ? 's' : ''}
                  </span>
                </div>
              </header>

              <form
                className="admin-filters admin-users-form"
                onSubmit={handleSubmit}
              >
                <div className="admin-filter-field">
                  <label htmlFor="admin-user-first-name">
                    Prénom
                  </label>

                  <input
                    id="admin-user-first-name"
                    type="text"
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(event.target.value)
                    }
                    required
                  />
                </div>

                <div className="admin-filter-field">
                  <label htmlFor="admin-user-last-name">
                    Nom
                  </label>

                  <input
                    id="admin-user-last-name"
                    type="text"
                    value={lastName}
                    onChange={(event) =>
                      setLastName(event.target.value)
                    }
                    required
                  />
                </div>

                <div className="admin-filter-field">
                  <label htmlFor="admin-user-email">
                    Email
                  </label>

                  <input
                    id="admin-user-email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    required
                  />
                </div>

                <div className="admin-filter-field">
                  <label htmlFor="admin-user-password">
                    Mot de passe initial
                  </label>

                  <input
                    id="admin-user-password"
                    type="text"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    required
                    minLength={8}
                  />
                </div>

                <button
                  type="submit"
                  className="admin-export-button"
                  disabled={creating}
                >
                  {creating
                    ? 'Création...'
                    : 'Créer l’utilisateur'}
                </button>

                {success && (
                  <p>{success}</p>
                )}

                {error && (
                  <p>{error}</p>
                )}
              </form>

              <div className="admin-table-wrapper">
                {loading ? (
                  <p style={{ padding: '20px' }}>
                    Chargement des utilisateurs...
                  </p>
                ) : users.length === 0 ? (
                  <p style={{ padding: '20px' }}>
                    Aucun utilisateur.
                  </p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Créé le</th>
                        <th>Dernière connexion</th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>
                            {user.first_name || '-'}
                          </td>

                          <td>
                            {user.last_name || '-'}
                          </td>

                          <td>
                            {user.email}
                          </td>

                          <td>
                            {new Date(
                              user.created_at,
                            ).toLocaleDateString(
                              'fr-FR',
                            )}
                          </td>

                          <td>
                            {user.last_sign_in_at
                              ? new Date(
                                  user.last_sign_in_at,
                                ).toLocaleString(
                                  'fr-FR',
                                )
                              : 'Jamais'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}
