import React, { useState } from 'react';
import SubjectMarksFields from './SubjectMarksFields';
import { EMPTY_SUBJECT_MARKS } from '../lib/subjectMarksConfig';
import { subjectMarksAreValid } from '../lib/normalizeSubjectMarks';
import { masarLabel as labelStyle, masarInput as inputStyle } from '../lib/masarStyles';

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
  const [subjectMarks, setSubjectMarks] = useState({ ...EMPTY_SUBJECT_MARKS });
  const [interest, setInterest] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nationality, setNationality] = useState('UAE');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      nationality: nationality.trim(),
      stream,
      emirate,
      track,
      highSchoolAvg: parseFloat(highSchoolAvg) || 0,
      subjectMarks,
      emsatMath: subjectMarks.emsatMath ? parseInt(subjectMarks.emsatMath, 10) : null,
      interest,
      discoveryMode: false,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: '36px 40px',
        background: 'var(--masar-bg-form, #1e293b)',
        borderRadius: '16px',
        border: '1px solid var(--masar-border-input, #334155)',
        boxShadow: 'var(--masar-shadow, 0 25px 50px -12px rgba(0, 0, 0, 0.5))',
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

      <h2 style={{ color: 'var(--masar-text-primary, #ffffff)', margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: '700' }}>
        Find universities for your field
      </h2>
      <p style={{ color: 'var(--masar-text-muted, #94a3b8)', fontSize: '0.85rem', margin: '0 0 28px 0', lineHeight: 1.5 }}>
        Tell us about your high school — Masar matches accredited UAE undergraduate programs.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div>
          <label style={labelStyle}>Your name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Sara Ahmed"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Email *</label>
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Nationality</label>
          <input
            type="text"
            placeholder="e.g. UAE"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

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
          <select
            value={stream}
            onChange={(e) => {
              setStream(e.target.value);
              setSubjectMarks({ ...EMPTY_SUBJECT_MARKS });
            }}
            style={inputStyle}
          >
            <option value="moe_general">UAE MoE — General</option>
            <option value="moe_advanced">UAE MoE — Advanced</option>
            <option value="british_alevels">British (A-Levels)</option>
            <option value="american_diploma">American Diploma</option>
            <option value="cbse">CBSE (Indian Curriculum)</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
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

      <SubjectMarksFields
        stream={stream}
        values={subjectMarks}
        onChange={setSubjectMarks}
        inputStyleOverride={inputStyle}
      />

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
        disabled={!subjectMarksAreValid(stream, subjectMarks)}
        style={{
          width: '100%',
          padding: '16px',
          background: 'linear-gradient(135deg, #ff6b3d 0%, #e0531b 100%)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '700',
          fontSize: '1rem',
          cursor: subjectMarksAreValid(stream, subjectMarks) ? 'pointer' : 'not-allowed',
          opacity: subjectMarksAreValid(stream, subjectMarks) ? 1 : 0.6,
          boxShadow: '0 4px 20px rgba(224, 83, 27, 0.3)',
        }}
      >
        Find my matches →
      </button>
    </form>
  );
}
