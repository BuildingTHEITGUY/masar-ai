import React from 'react';

export default function LandingChoice({ onExplore, onDirect }) {
  return (
    <div
      style={{
        padding: '40px',
        background: '#1e293b',
        borderRadius: '16px',
        border: '1px solid #334155',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }}
    >
      <h2 style={{ color: '#ffffff', margin: '0 0 8px 0', fontSize: '1.55rem', fontWeight: '800', lineHeight: 1.3 }}>
        Not Sure What to Study After High School?
      </h2>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0 0 8px 0', lineHeight: 1.6 }}>
        You&apos;re not alone. Masar helps UAE students discover majors and universities that fit your grades,
        curriculum, and interests.
      </p>
      <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0 0 28px 0' }}>
        مسارك الجامعي — Your Pathway After School
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <button
          type="button"
          onClick={onExplore}
          style={{
            padding: '20px 22px',
            borderRadius: '12px',
            border: '2px solid #38bdf8',
            background: 'linear-gradient(135deg, rgba(56,189,248,0.15) 0%, rgba(15,23,42,0.9) 100%)',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <span style={{ fontSize: '1.4rem', display: 'block', marginBottom: '6px' }}>🧭</span>
          <strong style={{ color: '#e0f2fe', fontSize: '1.05rem', display: 'block', marginBottom: '4px' }}>
            I&apos;m Not Sure Yet — Help Me Explore
          </strong>
          <span style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5 }}>
            Short Quiz → Suggested Majors → Personalized University Matching
          </span>
        </button>

        <button
          type="button"
          onClick={onDirect}
          style={{
            padding: '20px 22px',
            borderRadius: '12px',
            border: '1px solid #475569',
            background: '#0f172a',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <span style={{ fontSize: '1.4rem', display: 'block', marginBottom: '6px' }}>🎯</span>
          <strong style={{ color: '#f1f5f9', fontSize: '1.05rem', display: 'block', marginBottom: '4px' }}>
            I Already Know My Field — Show Universities
          </strong>
          <span style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5 }}>
            Pick Law, Technology, or Business and See Accredited Programs
          </span>
        </button>
      </div>
    </div>
  );
}
