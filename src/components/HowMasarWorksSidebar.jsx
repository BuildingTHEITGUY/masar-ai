import React from 'react';

export default function HowMasarWorksSidebar({ showExploreHint }) {
  const steps = [
    { n: '1', title: 'Tell Us About You', desc: 'Curriculum, Grades & Location' },
    {
      n: '2',
      title: 'Explore Directions',
      desc: 'Interests + optional Step 2.5 behavioral quiz (RIASEC)',
    },
    { n: '3', title: 'See Real Programs', desc: 'Accredited UAE Universities From Our Database' },
    { n: '4', title: 'Ask K2 Counselor', desc: 'Get Explanations & Follow-Up Help' },
  ];

  return (
    <div>
      <h3
        style={{
          margin: '0 0 4px 0',
          fontSize: '1rem',
          fontWeight: '700',
          color: 'var(--masar-text-primary)',
          letterSpacing: '0.04em',
        }}
      >
        How Masar Works
      </h3>
      <p style={{ margin: '0 0 20px 0', fontSize: '0.8rem', color: 'var(--masar-text-dim)', lineHeight: 1.5 }}>
        Built for UAE High School Graduates — MoE, CBSE, British, American &amp; IELTS/TOEFL Aware.
      </p>

      {showExploreHint && (
        <div
          style={{
            padding: '12px 14px',
            marginBottom: '20px',
            background: 'rgba(56,189,248,0.1)',
            border: '1px solid #38bdf8',
            borderRadius: '8px',
            fontSize: '0.82rem',
            color: '#bae6fd',
            lineHeight: 1.5,
          }}
        >
          <strong>New here?</strong> Choose &apos;I&apos;m not sure yet&apos; — most students start with Explore Mode.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
        {steps.map((s) => (
          <div key={s.n} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--masar-bg-card-alt)',
                border: '1px solid var(--masar-accent)',
                color: 'var(--masar-accent)',
                fontWeight: 800,
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {s.n}
            </span>
            <div>
              <strong style={{ color: 'var(--masar-text-body)', fontSize: '0.88rem', display: 'block' }}>{s.title}</strong>
              <span style={{ color: 'var(--masar-text-dim)', fontSize: '0.78rem' }}>{s.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--masar-border)', paddingTop: '16px' }}>
        <h4 style={{ margin: '0 0 10px', fontSize: '0.85rem', color: 'var(--masar-text-muted)', fontWeight: 600 }}>
          MoE General vs Advanced
        </h4>
        <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.55 }}>
          <strong style={{ color: '#cbd5e1' }}>General</strong> — wider access to Business, IT & Law paths.{' '}
          <strong style={{ color: '#cbd5e1' }}>Advanced</strong> — opens competitive engineering & STEM programs.
          Masar flags when a foundation year may be needed.
        </p>
      </div>
    </div>
  );
}
