/** Shared inline style tokens — CSS variables with fallbacks if index.css is missing */

export const masarLabel = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: '600',
  color: 'var(--masar-text-muted, #94a3b8)',
  marginBottom: '6px',
  letterSpacing: '0.03em',
};

export const masarInput = {
  width: '100%',
  padding: '14px',
  borderRadius: '8px',
  border: '1px solid var(--masar-border-input, #334155)',
  backgroundColor: 'var(--masar-bg-input, #131a26)',
  color: 'var(--masar-text-body, #f8fafc)',
  fontSize: '0.95rem',
  boxSizing: 'border-box',
  outline: 'none',
};

export const masarShell = {
  padding: '36px 40px',
  background: 'var(--masar-bg-shell, #131a26)',
  borderRadius: '16px',
  border: '1px solid var(--masar-border, #1e293b)',
  boxShadow: 'var(--masar-shadow, 0 25px 50px -12px rgba(0, 0, 0, 0.5))',
};

export const masarCard = {
  padding: '40px',
  background: 'var(--masar-bg-form, #1e293b)',
  borderRadius: '16px',
  border: '1px solid var(--masar-border-input, #334155)',
  boxShadow: 'var(--masar-shadow, 0 25px 50px -12px rgba(0, 0, 0, 0.5))',
};
