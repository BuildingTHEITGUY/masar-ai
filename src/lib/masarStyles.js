/** Shared inline style tokens — use CSS variables for theme support */

export const masarLabel = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: '600',
  color: 'var(--masar-text-muted)',
  marginBottom: '6px',
  letterSpacing: '0.03em',
};

export const masarInput = {
  width: '100%',
  padding: '14px',
  borderRadius: '8px',
  border: '1px solid var(--masar-border-input)',
  backgroundColor: 'var(--masar-bg-input)',
  color: 'var(--masar-text-body)',
  fontSize: '0.95rem',
  boxSizing: 'border-box',
  outline: 'none',
};

export const masarShell = {
  padding: '36px 40px',
  background: 'var(--masar-bg-shell)',
  borderRadius: '16px',
  border: '1px solid var(--masar-border)',
  boxShadow: 'var(--masar-shadow)',
};
