export default function StatusBadge({
  value,
  labels,
  type = 'registration',
}) {
  return (
    <span
      className={[
        'admin-status-badge',
        `admin-status-${type}`,
        `is-${value ?? 'unknown'}`,
      ].join(' ')}
    >
      <span
        className="admin-status-dot"
        aria-hidden="true"
      />

      {labels[value] ?? value ?? '—'}
    </span>
  );
}
