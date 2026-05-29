import React, { useState } from 'react';

const TRACK_HINTS = {
  law: 'Courts, legal work, government & corporate compliance',
  tech: 'Computers, AI, cybersecurity, IT & engineering',
  business: 'Finance, marketing, entrepreneurship & management',
};

export default function FormInput({ onSubmit, onBack }) {
  const [stream, setStream] = useState('moe_general');
  const [emirate, setEmirate] = useState('dubai');
  const [track, setTrack] = useState('business');
  const [highSchoolAvg, setHighSchoolAvg] = useState('');
  const [emsatMath, setEmsatMath] = useState('');
  const [interest, setInterest] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      stream,
      emirate,
      track,
      highSchoolAvg: parseFloat(highSchoolAvg) || 0,
      emsatMath: emsatMath ? parseInt(emsatMath, 10) : null,
      interest,
      discoveryMode: false,
    });
  };

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

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: '36px 40px',
        background: '#1e293b',
        borderRadius: '16px',
        border: '1px solid #334155',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }}
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
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
          ← Back to start
        </button>
      )}

      <h2 style={{ color: '#ffffff', margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: '700' }}>
        Find universities for your field
      </h2>
      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 28px 0', lineHeight: 1.5 }}>
        Tell us about your high school — Masar matches accredited UAE undergraduate programs.
      </p>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>What do you want to study?</label>
        <select value={track} onChange={(e) => setTrack(e.target.value)} style={inputStyle} required>
          <option value="law">Law (LLB / Legal Studies)</option>
          <option value="tech">Technology, IT & Engineering</option>
          <option value="business">Business & Management (BBA)</option>
        </select>
        <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: '#64748b' }}>{TRACK_HINTS[track]}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div>
          <label style={labelStyle}>Preferred emirate</label>
          <select value={emirate} onChange={(e) => setEmirate(e.target.value)} style={inputStyle}>
            <option value="dubai">Dubai</option>
            <option value="abudhabi">Abu Dhabi</option>
            <option value="sharjah">Sharjah</option>
            <option value="all">All Emirates</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>High school system</label>
          <select value={stream} onChange={(e) => setStream(e.target.value)} style={inputStyle}>
            <option value="moe_general">UAE MoE — General</option>
            <option value="moe_advanced">UAE MoE — Advanced</option>
            <option value="british_alevels">British (A-Levels)</option>
            <option value="american_diploma">American Diploma</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div>
          <label style={labelStyle}>Overall average (%) *</label>
          <input
            type="number"
            required
            min="50"
            max="100"
            placeholder="e.g. 85"
            value={highSchoolAvg}
            onChange={(e) => setHighSchoolAvg(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>EmSAT Math (optional)</label>
          <input
            type="number"
            placeholder="Leave blank if skipped"
            value={emsatMath}
            onChange={(e) => setEmsatMath(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <label style={labelStyle}>Anything else we should know? (optional)</label>
        <input
          type="text"
          placeholder="e.g. prefer morning classes, scholarship needed"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          style={inputStyle}
        />
      </div>

      <button
        type="submit"
        style={{
          width: '100%',
          padding: '16px',
          background: 'linear-gradient(135deg, #ff6b3d 0%, #e0531b 100%)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '700',
          fontSize: '1rem',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(224, 83, 27, 0.3)',
        }}
      >
        Find my matches →
      </button>
    </form>
  );
}
