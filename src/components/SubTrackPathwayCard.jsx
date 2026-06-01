import React from 'react';
import { getSubTrackMeta } from '../lib/behavioralSorter';

function HighlightedDegree({ text, accent }) {
  const parts = text.split(/(BSc|Bachelor|BA|BArch|BEng)/gi);
  return (
    <span style={{ fontSize: '1.05rem', lineHeight: 1.4 }}>
      {parts.map((part, i) =>
        /^(BSc|Bachelor|BA|BArch|BEng)/i.test(part) ? (
          <strong key={i} style={{ color: accent, fontWeight: 800 }}>
            {part}
          </strong>
        ) : (
          <span key={i} style={{ color: '#f8fafc', fontWeight: 800 }}>
            {part}
          </span>
        )
      )}
    </span>
  );
}

export function SubTrackHeroCard({ subTrackId, isTopPick }) {
  const meta = getSubTrackMeta(subTrackId);
  if (!meta) return null;

  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '12px',
        border: `2px solid ${meta.accent}`,
        background: `linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(11, 15, 25, 0.98) 100%)`,
        boxShadow: `0 4px 24px ${meta.accent}22`,
        marginBottom: '4px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: meta.accent,
            }}
          >
            RIASEC {meta.holland} · Precision match
          </span>
          <h3 style={{ margin: '8px 0 0', fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
            {meta.label}
          </h3>
        </div>
        {isTopPick && (
          <span
            style={{
              fontSize: '0.65rem',
              background: '#10b981',
              color: '#fff',
              padding: '4px 10px',
              borderRadius: '4px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            BEST FIT
          </span>
        )}
      </div>

      <div style={{ marginTop: '14px' }}>
        <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
          Recommended major pathway
        </span>
        <HighlightedDegree text={meta.displayTitle} accent={meta.accent} />
      </div>

      <p style={{ margin: '12px 0 0', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
        <strong style={{ color: meta.accent, fontWeight: 800 }}>{meta.degrees.split(',')[0]}</strong>
        {meta.degrees.includes(',') ? ` · ${meta.degrees.split(',').slice(1).join(',').trim()}` : ''}
      </p>
      <p style={{ margin: '10px 0 0', fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.45 }}>
        <strong style={{ color: '#e2e8f0' }}>UAE careers:</strong> {meta.careers}
      </p>
    </div>
  );
}

export function AdvisorInsightBox({ insight }) {
  if (!insight) return null;

  return (
    <div
      style={{
        marginBottom: '16px',
        padding: '14px 16px',
        borderRadius: '10px',
        border: '1px solid rgba(251, 191, 36, 0.45)',
        background: 'rgba(251, 191, 36, 0.08)',
      }}
    >
      <p style={{ margin: 0, fontSize: '0.85rem', color: '#fde68a', lineHeight: 1.55 }}>
        <strong style={{ color: '#fbbf24' }}>💡 {insight.title}:</strong> {insight.body}
      </p>
    </div>
  );
}
