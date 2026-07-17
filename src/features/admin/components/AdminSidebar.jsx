import { Link } from 'react-router-dom';

const MENU_ITEMS = [
  {
    id: 'registrations',
    label: 'Inscriptions',
    path: '/admin',
    icon: 'users',
    enabled: true,
  },
  {
    id: 'documents',
    label: 'Documents',
    path: '/admin/documents',
    icon: 'document',
    enabled: false,
  },
  {
    id: 'payments',
    label: 'Paiements',
    path: '/admin/paiements',
    icon: 'payment',
    enabled: false,
  },
  {
    id: 'settings',
    label: 'Paramètres',
    path: '/admin/parametres',
    icon: 'settings',
    enabled: false,
  },
  {
    id: 'accounts',
    label: 'Utilisateurs',
    path: '/admin/utilisateurs',
    icon: 'accounts',
    enabled: false,
  },
  {
    id: 'statistics',
    label: 'Statistiques',
    path: '/admin/statistiques',
    icon: 'statistics',
    enabled: false,
  },
];

function SidebarIcon({ name }) {
  if (name === 'users') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path d="M2.5 20v-1.5A4.5 4.5 0 0 1 7 14h3a4.5 4.5 0 0 1 4.5 4.5V20" />
        <path d="M16 4.5a3.5 3.5 0 0 1 0 7" />
        <path d="M16.5 14a4.5 4.5 0 0 1 5 4.5V20" />
      </svg>
    );
  }

  if (name === 'document') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 3h8l4 4v14H6V3Z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6M9 17h6" />
      </svg>
    );
  }

  if (name === 'payment') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h3" />
      </svg>
    );
  }

  if (name === 'settings') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </svg>
    );
  }

  if (name === 'accounts') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1" />
        <path d="M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 4.9V20" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20V12h4v8H4ZM10 20V4h4v16h-4ZM16 20V8h4v12h-4Z" />
    </svg>
  );
}

export default function AdminSidebar({
  activeItem = 'registrations',
  userEmail = '',
  collapsed = false,
  onToggle,
}) {
  return (
    <aside
      className={[
        'admin-sidebar',
        collapsed ? 'is-collapsed' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <header className="admin-sidebar-brand">
        <span
          className="admin-sidebar-brand-mark"
          aria-hidden="true"
        >
          EC
        </span>

        <span className="admin-sidebar-brand-text">
          <strong>El Carino</strong>
          <small>Boxe thaï</small>
        </span>

        <button
          type="button"
          className="admin-sidebar-toggle"
          onClick={onToggle}
          aria-label={
            collapsed
              ? 'Déployer le menu'
              : 'Réduire le menu'
          }
          aria-expanded={!collapsed}
        >
          <span aria-hidden="true">
            {collapsed ? '›' : '‹'}
          </span>
        </button>
      </header>

      <nav
        className="admin-sidebar-navigation"
        aria-label="Navigation du back-office"
      >
        {MENU_ITEMS.map((item) => {
          const isActive = item.id === activeItem;

          if (!item.enabled) {
            return (
              <span
                key={item.id}
                className="admin-sidebar-link is-disabled"
                title={item.label}
              >
                <span className="admin-sidebar-link-icon">
                  <SidebarIcon name={item.icon} />
                </span>

                <span className="admin-sidebar-link-label">
                  {item.label}
                </span>
              </span>
            );
          }

          return (
            <Link
              key={item.id}
              className={[
                'admin-sidebar-link',
                isActive ? 'is-active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              to={item.path}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
            >
              <span className="admin-sidebar-link-icon">
                <SidebarIcon name={item.icon} />
              </span>

              <span className="admin-sidebar-link-label">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <footer className="admin-sidebar-account">
        <span
          className="admin-sidebar-avatar"
          aria-hidden="true"
        >
          AD
        </span>

        <span className="admin-sidebar-account-text">
          <strong>Administration</strong>
          <small>
            {userEmail || 'Compte administrateur'}
          </small>
        </span>
      </footer>
    </aside>
  );
}
