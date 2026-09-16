import { useAuth } from '../../../hooks/useAuth';

function getDisplayName(profile, user) {
  if (profile?.display_name) {
    return profile.display_name;
  }

  if (user?.email) {
    return user.email.split('@')[0];
  }

  return 'Administration';
}

function getInitials(displayName) {
  const parts = displayName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return 'AD';
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0]
    + parts[parts.length - 1][0]
  ).toUpperCase();
}

export default function AdminHeader({
  title = 'Inscriptions',
  description = 'Consultez et traitez les dossiers transmis par les adhérents.',
}) {
  const {
    user,
    profile,
  } = useAuth();

  const displayName =
    getDisplayName(profile, user);

  const initials =
    getInitials(displayName);

  return (
    <header className="admin-header">
      <div>
        <p className="admin-header-kicker">
          Back-office El Carino
        </p>

        <h1>{title}</h1>

        <p>{description}</p>
      </div>

      <div className="admin-header-actions">
        <button
          type="button"
          className="admin-account-button"
        >
          <span
            className="admin-account-icon"
            aria-hidden="true"
          >
            {initials}
          </span>

          <span>{displayName}</span>

          <span aria-hidden="true">⌄</span>
        </button>
      </div>
    </header>
  );
}
