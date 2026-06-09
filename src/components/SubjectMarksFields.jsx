import React from 'react';
import { ALEVEL_GRADES } from '../lib/subjectMarksConfig';
import { masarLabel as labelStyle, masarInput as defaultInputStyle } from '../lib/masarStyles';

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: '16px',
  marginBottom: '16px',
};

function PercentInput({ label, value, onChange, required, placeholder = 'e.g. 85', fieldStyle }) {
  return (
    <div>
      <label style={labelStyle}>
        {label}
        {required ? ' *' : ''}
      </label>
      <input
        type="number"
        min="0"
        max="100"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={fieldStyle}
      />
    </div>
  );
}

function GradeSelect({ label, value, onChange, required, fieldStyle }) {
  return (
    <div>
      <label style={labelStyle}>
        {label}
        {required ? ' *' : ''}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={fieldStyle}
      >
        <option value="">Select grade</option>
        {ALEVEL_GRADES.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function SubjectMarksFields({ stream, values, onChange, inputStyleOverride }) {
  const style = inputStyleOverride || defaultInputStyle;
  const set = (key) => (val) => onChange({ ...values, [key]: val });

  const isBritish = stream === 'british_alevels';
  const isAmerican = stream === 'american_diploma';
  const scienceLabel = isAmerican ? 'Science grade (%)' : 'Physics/Science (%)';

  return (
    <div style={{ marginBottom: '20px' }}>
      <p
        style={{
          margin: '0 0 12px',
          fontSize: '0.8rem',
          color: 'var(--masar-text-dim)',
          lineHeight: 1.5,
        }}
      >
        Subject grades help Masar spot STEM vs humanities fit and flag foundation-year routes.
        {isBritish ? ' Enter your A-Level predicted or achieved grades.' : null}
      </p>

      <div style={gridStyle}>
        {isBritish ? (
          <>
            <GradeSelect
              label="Math A-Level"
              required
              value={values.math}
              onChange={set('math')}
              fieldStyle={style}
            />
            <GradeSelect
              label="English A-Level"
              required
              value={values.english}
              onChange={set('english')}
              fieldStyle={style}
            />
            <GradeSelect
              label="Physics / Science A-Level"
              value={values.physics}
              onChange={set('physics')}
              fieldStyle={style}
            />
          </>
        ) : (
          <>
            <PercentInput
              label="Math grade (%)"
              required
              value={values.math}
              onChange={set('math')}
              fieldStyle={style}
            />
            <PercentInput
              label="English grade (%)"
              required
              value={values.english}
              onChange={set('english')}
              fieldStyle={style}
            />
            <PercentInput
              label={scienceLabel}
              value={values.physics}
              onChange={set('physics')}
              placeholder="Optional"
              fieldStyle={style}
            />
          </>
        )}
      </div>
    </div>
  );
}
