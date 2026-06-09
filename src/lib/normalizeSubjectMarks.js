import { ALEVEL_TO_PERCENT } from './subjectMarksConfig.js';

function parsePercent(value) {
  if (value === '' || value == null) return null;
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

function aLevelToPercent(grade) {
  if (!grade) return null;
  const key = String(grade).trim().toUpperCase().replace(/\s+/g, '');
  const normalized = key === 'A*' ? 'A*' : key.charAt(0);
  if (key.startsWith('A') && key.includes('*')) return ALEVEL_TO_PERCENT['A*'];
  return ALEVEL_TO_PERCENT[normalized] ?? null;
}

/**
 * Normalize raw form values to 0–100 scores for matching / K2.
 */
export function normalizeSubjectMarks(stream, raw = {}) {
  const isBritish = stream === 'british_alevels';

  const math = isBritish ? aLevelToPercent(raw.math) : parsePercent(raw.math);
  const english = isBritish ? aLevelToPercent(raw.english) : parsePercent(raw.english);
  const physics = isBritish ? aLevelToPercent(raw.physics) : parsePercent(raw.physics);

  return {
    math,
    english,
    physics,
    rawMath: raw.math ?? '',
    rawEnglish: raw.english ?? '',
    rawPhysics: raw.physics ?? '',
  };
}

export function subjectMarksAreValid(stream, raw = {}) {
  const { math, english } = normalizeSubjectMarks(stream, raw);
  return math != null && english != null;
}

/** Human-readable block for K2 system prompts */
export function formatSubjectMarksLine(stream, raw = {}) {
  const n = normalizeSubjectMarks(stream, raw);
  const isBritish = stream === 'british_alevels';
  const isAmerican = stream === 'american_diploma';

  const fmt = (val, rawVal) => {
    if (isBritish && rawVal) return `A-Level ${rawVal}`;
    if (val != null) return `${val}%`;
    return 'not provided';
  };

  const scienceLabel = isAmerican ? 'Science' : 'Physics/Science';
  const parts = [
    `Mathematics: ${fmt(n.math, n.rawMath)}`,
    `English (school subject): ${fmt(n.english, n.rawEnglish)}`,
  ];

  if (n.physics != null || n.rawPhysics) {
    parts.push(`${scienceLabel}: ${fmt(n.physics, n.rawPhysics)}`);
  }

  return parts.join(' | ');
}
