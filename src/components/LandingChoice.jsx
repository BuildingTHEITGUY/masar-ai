import React from 'react';
import { masarCard } from '../lib/masarStyles';

export default function LandingChoice({ onExplore, onDirect }) {
  return (
    <div style={masarCard}>
      <h2
        style={{
          color: 'var(--masar-text-primary, #ffffff)',
          margin: '0 0 8px 0',
          fontSize: '1.55rem',
          fontWeight: '800',
          lineHeight: 1.3,
        }}
      >
        Not Sure What to Study After High School?
      </h2>
      <p
        style={{
          color: 'var(--masar-text-muted, #94a3b8)',
          fontSize: '0.9rem',
          margin: '0 0 8px 0',
          lineHeight: 1.6,
        }}
      >
        You&apos;re not alone. Masar helps UAE students discover majors and universities that fit your grades,
        curriculum, and interests.
      </p>
      <p
        style={{
          color: 'var(--masar-text-dim, #64748b)',
          fontSize: '0.8rem',
          margin: '0 0 28px 0',
        }}
      >
        مسارك الجامعي — Your Pathway After School
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <button
          type="button"
          onClick={onExplore}
          style={{
            padding: '20px 22px',
            borderRadius: '12px',
            border: '2px solid var(--masar-accent-blue, #38bdf8)',
            background:
              'linear-gradient(135deg, rgba(56,189,248,0.15) 0%, var(--masar-bg-card-alt, rgba(15,23,42,0.9)) 100%)',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <span style={{ fontSize: '1.4rem', display: 'block', marginBottom: '6px' }}>🧭</span>
          <strong
            style={{
              color: 'var(--masar-text-body, #e0f2fe)',
              fontSize: '1.05rem',
              display: 'block',
              marginBottom: '4px',
            }}
          >
            I&apos;m Not Sure Yet — Help Me Explore
          </strong>
          <span
            style={{
              color: 'var(--masar-text-muted, #94a3b8)',
              fontSize: '0.85rem',
              lineHeight: 1.5,
            }}
          >
            Short Quiz → Suggested Majors → Personalized University Matching
          </span>
        </button>

        <button
          type="button"
          onClick={onDirect}
          style={{
            padding: '20px 22px',
            borderRadius: '12px',
            border: '1px solid var(--masar-border-input, #475569)',
            background: 'var(--masar-bg-card-alt, #0f172a)',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <span style={{ fontSize: '1.4rem', display: 'block', marginBottom: '6px' }}>🎯</span>
          <strong
            style={{
              color: 'var(--masar-text-body, #f1f5f9)',
              fontSize: '1.05rem',
              display: 'block',
              marginBottom: '4px',
            }}
          >
            I Already Know My Field — Show Universities
          </strong>
          <span
            style={{
              color: 'var(--masar-text-muted, #94a3b8)',
              fontSize: '0.85rem',
              lineHeight: 1.5,
            }}
          >
            Pick Law, Technology, or Business and See Accredited Programs
          </span>
        </button>
      </div>
    </div>
  );
}
