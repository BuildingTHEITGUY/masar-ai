/** Typical UAE entry thresholds (Phase 1 — advisory flags only, not hard filters) */
const THRESHOLDS = {
  tech: { math: 75, physics: 70, english: 70 },
  law: { math: 60, physics: null, english: 75 },
  business: { math: 60, physics: null, english: 70 },
};

/**
 * Build subject gap flags for a program match.
 * @returns {string[]}
 */
export function computeSubjectFlags(track, normalized, highSchoolAvg) {
  const flags = [];
  const t = THRESHOLDS[track] || THRESHOLDS.business;
  const avg = Number(highSchoolAvg) || 0;

  if (t.math != null && normalized.math != null && normalized.math < t.math) {
    flags.push(`Math (${normalized.math}%) below typical ${track} entry (~${t.math}%)`);
  }
  if (t.physics != null && normalized.physics != null && normalized.physics < t.physics) {
    flags.push(`Physics/Science (${normalized.physics}%) below typical STEM entry (~${t.physics}%)`);
  }
  if (t.english != null && normalized.english != null && normalized.english < t.english) {
    flags.push(`English (${normalized.english}%) below typical entry (~${t.english}%)`);
  }

  if (
    track === 'tech' &&
    normalized.math != null &&
    avg > 0 &&
    normalized.math >= t.math + 10 &&
    normalized.math > avg + 5
  ) {
    flags.push('Strong Math vs overall — STEM programs from verified list may fit well');
  }

  if (normalized.emsatMath == null && track === 'tech') {
    flags.push('EmSAT Math not provided — verify requirement with admissions');
  }

  return flags;
}
