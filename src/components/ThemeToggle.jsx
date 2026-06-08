import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ compact = false }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: compact ? '0' : '8px',
        padding: compact ? '8px 10px' : '8px 14px',
        borderRadius: '999px',
        border: '1px solid var(--masar-border-input)',
        background: 'var(--masar-bg-card-alt)',
        color: 'var(--masar-text-muted)',
        fontSize: '0.78rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'background 0.2s, border-color 0.2s',
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: '1rem', lineHeight: 1 }} aria-hidden>
        {isDark ? '☀️' : '🌙'}
      </span>
      {!compact && <span>{isDark ? 'Light' : 'Dark'}</span>}
    </button>
  );
}
