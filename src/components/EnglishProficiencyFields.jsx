import React from 'react';
import {
  ENGLISH_TEST_OPTIONS,
  ENGLISH_TEST_NONE,
  ENGLISH_TEST_IELTS,
  getEnglishScorePlaceholder,
} from '../lib/englishProficiency';
import { masarLabel as labelStyle, masarInput as defaultInputStyle } from '../lib/masarStyles';

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: '16px',
  marginBottom: '20px',
};

export default function EnglishProficiencyFields({
  englishTestType,
  englishTestScore,
  onTypeChange,
  onScoreChange,
  inputStyleOverride,
}) {
  const fieldStyle = inputStyleOverride || defaultInputStyle;
  const hasExam = englishTestType && englishTestType !== ENGLISH_TEST_NONE;
  const isIelts = englishTestType === ENGLISH_TEST_IELTS;

  const disabledFieldStyle = {
    ...fieldStyle,
    opacity: 0.45,
    cursor: 'not-allowed',
  };

  return (
    <div style={{ marginBottom: '8px' }}>
      <p
        style={{
          margin: '0 0 12px',
          fontSize: '0.8rem',
          color: 'var(--masar-text-dim, #64748b)',
          lineHeight: 1.5,
        }}
      >
        UAE universities now use IELTS Academic or TOEFL (iBT / ITP) for English entry — not EmSAT.
      </p>
      <div style={gridStyle}>
        <div>
          <label style={labelStyle}>English Proficiency Exam</label>
          <select
            value={englishTestType}
            onChange={(e) => onTypeChange(e.target.value)}
            style={fieldStyle}
          >
            {ENGLISH_TEST_OPTIONS.map((opt) => (
              <option key={opt.value || 'none'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Test Score {hasExam ? '' : '(select exam first)'}</label>
          <input
            type="number"
            min={isIelts ? 0 : 0}
            max={isIelts ? 9 : undefined}
            step={isIelts ? 0.5 : 1}
            placeholder={hasExam ? getEnglishScorePlaceholder(englishTestType) : '—'}
            value={englishTestScore}
            onChange={(e) => onScoreChange(e.target.value)}
            disabled={!hasExam}
            style={hasExam ? fieldStyle : disabledFieldStyle}
          />
        </div>
      </div>
    </div>
  );
}
