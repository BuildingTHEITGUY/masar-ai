import React from 'react';
import { getQuizForBranch } from '../lib/behavioralSorter';

const rowBase = {
  width: '100%',
  padding: '16px 18px',
  borderRadius: '10px',
  border: '1px solid #334155',
  background: '#131a26',
  cursor: 'pointer',
  textAlign: 'left',
  color: '#e2e8f0',
  fontSize: '0.9rem',
  lineHeight: 1.55,
  transition: 'border-color 0.15s ease, background 0.15s ease',
  boxSizing: 'border-box',
};

function SelectionRow({ selected, onClick, label, mapsHint }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...rowBase,
        border: `2px solid ${selected ? '#38bdf8' : '#334155'}`,
        background: selected ? 'rgba(56, 189, 248, 0.1)' : '#131a26',
        boxShadow: selected ? '0 0 0 1px rgba(56, 189, 248, 0.25)' : 'none',
      }}
    >
      <span style={{ display: 'block', fontWeight: selected ? 600 : 500 }}>{label}</span>
      {mapsHint && (
        <span
          style={{
            display: 'block',
            marginTop: '8px',
            fontSize: '0.72rem',
            color: '#64748b',
            fontWeight: 600,
            letterSpacing: '0.03em',
          }}
        >
          → {mapsHint}
        </span>
      )}
    </button>
  );
}

export default function BehavioralSorterStep({
  branch,
  selectedOptionId,
  onSelect,
  onContinue,
  canContinue,
}) {
  const quiz = getQuizForBranch(branch);

  const mapsLabel = (option) => {
    const names = option.subTracks
      .map((id) => {
        const labels = {
          civil: 'Civil Engineering',
          architecture: 'Architecture',
          urban_planning: 'Urban Planning',
          piping: 'Piping Engineering',
          mechanical: 'Mechanical Engineering',
          aviation: 'Aviation Engineering',
          medical: 'Medical Sciences',
          biology: 'Biological Sciences',
          agricultural: 'Agricultural Science',
          physics: 'Physics',
          space_science: 'Space Science',
          psychology: 'Psychology',
          geography: 'Geography',
          philosophy: 'Philosophy',
          computer_science: 'Computer Science',
          cybersecurity: 'Cybersecurity',
          ai_systems: 'Artificial Intelligence',
          data_science: 'Data Science',
        };
        return labels[id] || id;
      })
      .join(' / ');
    return names;
  };

  return (
    <>
      <h2 style={{ color: '#fff', margin: '0 0 6px', fontSize: '1.35rem', fontWeight: 700 }}>
        {quiz.header}
      </h2>
      <p
        style={{
          color: '#94a3b8',
          fontSize: '0.85rem',
          margin: '0 0 8px',
          lineHeight: 1.55,
        }}
      >
        One focused choice — we narrow your pathway using{' '}
        <strong style={{ color: '#38bdf8', fontWeight: 600 }}>RIASEC</strong> behavioral mapping
        (reduced cognitive load).
      </p>
      <p
        style={{
          color: '#f1f5f9',
          fontSize: '0.95rem',
          margin: '0 0 20px',
          lineHeight: 1.5,
          fontWeight: 500,
        }}
      >
        {quiz.question}
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginBottom: '28px',
        }}
      >
        {quiz.options.map((opt) => (
          <SelectionRow
            key={opt.id}
            label={opt.label}
            mapsHint={mapsLabel(opt)}
            selected={selectedOptionId === opt.id}
            onClick={() => onSelect(opt.id)}
          />
        ))}
      </div>

      <button
        type="button"
        disabled={!canContinue}
        onClick={onContinue}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '8px',
          border: 'none',
          background: canContinue
            ? 'linear-gradient(135deg, #38bdf8, #0ea5e9)'
            : '#334155',
          color: '#0f172a',
          fontWeight: 700,
          cursor: canContinue ? 'pointer' : 'not-allowed',
        }}
      >
        Continue →
      </button>
    </>
  );
}
