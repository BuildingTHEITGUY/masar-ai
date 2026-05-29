import React, { useState, useMemo } from 'react';
import {
  INTEREST_OPTIONS,
  PRIORITY_OPTIONS,
  suggestPathways,
  buildExploreInterestText,
} from '../lib/resolveTrackFromExplore';

const labelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: '600',
  color: '#94a3b8',
  marginBottom: '6px',
  letterSpacing: '0.03em',
};

const inputStyle = {
  width: '100%',
  padding: '14px',
  borderRadius: '8px',
  border: '1px solid #334155',
  backgroundColor: '#0f172a',
  color: '#f8fafc',
  fontSize: '0.95rem',
  boxSizing: 'border-box',
  outline: 'none',
};

const shellStyle = {
  padding: '36px 40px',
  background: '#1e293b',
  borderRadius: '16px',
  border: '1px solid #334155',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
};

function StepDots({ step, total }) {
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: '4px',
            borderRadius: '2px',
            background: i <= step ? '#38bdf8' : '#334155',
          }}
        />
      ))}
    </div>
  );
}

function SelectCard({ selected, onClick, emoji, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '14px 16px',
        borderRadius: '10px',
        border: `2px solid ${selected ? '#38bdf8' : '#334155'}`,
        background: selected ? 'rgba(56,189,248,0.12)' : '#0f172a',
        cursor: 'pointer',
        textAlign: 'left',
        color: '#e2e8f0',
        fontSize: '0.88rem',
        lineHeight: 1.45,
      }}
    >
      <span style={{ marginRight: '8px' }}>{emoji}</span>
      {label}
    </button>
  );
}

export default function ExploreWizard({ onSubmit, onBack }) {
  const [step, setStep] = useState(0);
  const [stream, setStream] = useState('moe_general');
  const [emirate, setEmirate] = useState('dubai');
  const [highSchoolAvg, setHighSchoolAvg] = useState('');
  const [emsatMath, setEmsatMath] = useState('');
  const [interests, setInterests] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [chosenTrack, setChosenTrack] = useState(null);

  const suggestions = useMemo(
    () => (step >= 3 ? suggestPathways(interests, priorities, stream) : []),
    [step, interests, priorities, stream]
  );

  const toggleInterest = (id) => {
    setInterests((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  const togglePriority = (id) => {
    setPriorities((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const finishWithTrack = (track) => {
    onSubmit({
      stream,
      emirate,
      track,
      highSchoolAvg: parseFloat(highSchoolAvg) || 0,
      emsatMath: emsatMath ? parseInt(emsatMath, 10) : null,
      interest: buildExploreInterestText(interests, priorities),
      discoveryMode: true,
    });
  };

  const canNextStep0 = highSchoolAvg && parseFloat(highSchoolAvg) >= 50;
  const canNextStep1 = interests.length >= 1;

  const goToPathways = () => {
    const ranked = suggestPathways(interests, priorities, stream);
    setChosenTrack(ranked[0]?.track ?? 'business');
    setStep(3);
  };

  return (
    <div style={shellStyle}>
      <button
        type="button"
        onClick={step === 0 ? onBack : () => setStep((s) => s - 1)}
        style={{
          background: 'none',
          border: 'none',
          color: '#64748b',
          cursor: 'pointer',
          fontSize: '0.8rem',
          marginBottom: '12px',
          padding: 0,
        }}
      >
        ← {step === 0 ? 'Back to start' : 'Previous step'}
      </button>

      <StepDots step={step} total={4} />

      {step === 0 && (
        <>
          <h2 style={{ color: '#fff', margin: '0 0 6px', fontSize: '1.35rem', fontWeight: 700 }}>
            Step 1 — About your high school
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 24px', lineHeight: 1.5 }}>
            Basic facts so Masar can check which UAE programs you qualify for.
          </p>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Which high school system did you follow?</label>
            <select value={stream} onChange={(e) => setStream(e.target.value)} style={inputStyle}>
              <option value="moe_general">UAE MoE — General Stream</option>
              <option value="moe_advanced">UAE MoE — Advanced Stream</option>
              <option value="british_alevels">British Curriculum (A-Levels)</option>
              <option value="american_diploma">American Diploma</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Your overall average (%)</label>
              <input
                type="number"
                min="50"
                max="100"
                placeholder="e.g. 78"
                value={highSchoolAvg}
                onChange={(e) => setHighSchoolAvg(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>EmSAT Math (optional)</label>
              <input
                type="number"
                placeholder="Haven't taken it yet"
                value={emsatMath}
                onChange={(e) => setEmsatMath(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={labelStyle}>Where would you prefer to study?</label>
            <select value={emirate} onChange={(e) => setEmirate(e.target.value)} style={inputStyle}>
              <option value="dubai">Dubai</option>
              <option value="abudhabi">Abu Dhabi</option>
              <option value="sharjah">Sharjah</option>
              <option value="all">Open to all emirates</option>
            </select>
          </div>

          <button
            type="button"
            disabled={!canNextStep0}
            onClick={() => setStep(1)}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              border: 'none',
              background: canNextStep0 ? 'linear-gradient(135deg, #38bdf8, #0ea5e9)' : '#334155',
              color: '#0f172a',
              fontWeight: 700,
              cursor: canNextStep0 ? 'pointer' : 'not-allowed',
            }}
          >
            Continue →
          </button>
        </>
      )}

      {step === 1 && (
        <>
          <h2 style={{ color: '#fff', margin: '0 0 6px', fontSize: '1.35rem', fontWeight: 700 }}>
            Step 2 — What do you enjoy?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 20px' }}>
            Pick up to <strong style={{ color: '#38bdf8' }}>2</strong> that feel closest to you.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '28px' }}>
            {INTEREST_OPTIONS.map((opt) => (
              <SelectCard
                key={opt.id}
                emoji={opt.emoji}
                label={opt.label}
                selected={interests.includes(opt.id)}
                onClick={() => toggleInterest(opt.id)}
              />
            ))}
          </div>

          <button
            type="button"
            disabled={!canNextStep1}
            onClick={() => setStep(2)}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              border: 'none',
              background: canNextStep1 ? 'linear-gradient(135deg, #38bdf8, #0ea5e9)' : '#334155',
              color: '#0f172a',
              fontWeight: 700,
              cursor: canNextStep1 ? 'pointer' : 'not-allowed',
            }}
          >
            Continue →
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 style={{ color: '#fff', margin: '0 0 6px', fontSize: '1.35rem', fontWeight: 700 }}>
            Step 3 — What matters to you?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 20px' }}>
            Select any that apply — this helps rank your best pathways.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
            {PRIORITY_OPTIONS.map((opt) => (
              <SelectCard
                key={opt.id}
                emoji={priorities.includes(opt.id) ? '✓' : '○'}
                label={opt.label}
                selected={priorities.includes(opt.id)}
                onClick={() => togglePriority(opt.id)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goToPathways}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
              color: '#0f172a',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            See my suggested pathways →
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <h2 style={{ color: '#fff', margin: '0 0 6px', fontSize: '1.35rem', fontWeight: 700 }}>
            Step 4 — Your suggested directions
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 20px', lineHeight: 1.5 }}>
            Based on your answers, these undergraduate paths fit you best. Pick one to see real UAE universities.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {suggestions.map((s, idx) => (
              <button
                key={s.track}
                type="button"
                onClick={() => setChosenTrack(s.track)}
                style={{
                  padding: '18px',
                  borderRadius: '12px',
                  border: `2px solid ${chosenTrack === s.track ? '#ff6b3d' : '#334155'}`,
                  background: chosenTrack === s.track ? 'rgba(255,107,61,0.1)' : '#0f172a',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ color: '#f8fafc', fontSize: '1rem' }}>{s.title}</strong>
                  {idx === 0 && (
                    <span
                      style={{
                        fontSize: '0.65rem',
                        background: '#10b981',
                        color: '#fff',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 700,
                      }}
                    >
                      BEST FIT
                    </span>
                  )}
                </div>
                <p style={{ margin: '0 0 6px', fontSize: '0.8rem', color: '#38bdf8' }}>{s.degrees}</p>
                <p style={{ margin: '0 0 6px', fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.45 }}>{s.why}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                  <strong style={{ color: '#cbd5e1' }}>Careers:</strong> {s.careers}
                </p>
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={!chosenTrack}
            onClick={() => finishWithTrack(chosenTrack)}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #ff6b3d 0%, #e0531b 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: chosenTrack ? 'pointer' : 'not-allowed',
              boxShadow: '0 4px 20px rgba(224, 83, 27, 0.3)',
            }}
          >
            Show universities for this path →
          </button>
        </>
      )}
    </div>
  );
}
