/** English proficiency exam types (UAE admissions post-EmSAT cancellation) */

export const ENGLISH_TEST_NONE = '';
export const ENGLISH_TEST_IELTS = 'ielts_academic';
export const ENGLISH_TEST_TOEFL_IBT = 'toefl_ibt';
export const ENGLISH_TEST_TOEFL_ITP = 'toefl_itp';

export const ENGLISH_TEST_OPTIONS = [
  { value: ENGLISH_TEST_NONE, label: 'Not Taken / None' },
  { value: ENGLISH_TEST_IELTS, label: 'IELTS Academic' },
  { value: ENGLISH_TEST_TOEFL_IBT, label: 'TOEFL iBT' },
  { value: ENGLISH_TEST_TOEFL_ITP, label: 'TOEFL ITP' },
];

const LABELS = {
  [ENGLISH_TEST_IELTS]: 'IELTS Academic',
  [ENGLISH_TEST_TOEFL_IBT]: 'TOEFL iBT',
  [ENGLISH_TEST_TOEFL_ITP]: 'TOEFL ITP',
};

/** Typical UAE direct-entry minimums (advisory — verify per university) */
const BENCHMARKS = {
  [ENGLISH_TEST_IELTS]: { min: 5.0, ideal: 5.5, max: 9, step: 0.5, unit: '' },
  [ENGLISH_TEST_TOEFL_IBT]: { min: 61, ideal: 70, max: 120, step: 1, unit: '' },
  [ENGLISH_TEST_TOEFL_ITP]: { min: 500, ideal: 525, max: 677, step: 1, unit: '' },
};

export function getEnglishScorePlaceholder(testType) {
  switch (testType) {
    case ENGLISH_TEST_IELTS:
      return 'e.g. 6.5';
    case ENGLISH_TEST_TOEFL_IBT:
      return 'e.g. 72';
    case ENGLISH_TEST_TOEFL_ITP:
      return 'e.g. 510';
    default:
      return '';
  }
}

export function parseEnglishTestScore(testType, raw) {
  if (!testType || testType === ENGLISH_TEST_NONE) return null;
  if (raw === '' || raw == null) return null;
  const n = testType === ENGLISH_TEST_IELTS ? parseFloat(raw) : parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

export function formatEnglishTestLabel(testType) {
  if (!testType || testType === ENGLISH_TEST_NONE) return 'Not taken';
  return LABELS[testType] || testType;
}

export function formatEnglishProficiencyLine(testType, score) {
  if (!testType || testType === ENGLISH_TEST_NONE) {
    return 'English proficiency exam: Not taken / None';
  }
  const label = formatEnglishTestLabel(testType);
  const scoreText = score != null ? score : 'not provided';
  return `English proficiency: ${label}, Score: ${scoreText}`;
}

/**
 * Advisory flags for match cards and K2 context.
 * @returns {string[]}
 */
export function computeEnglishProficiencyFlags(testType, score) {
  const flags = [];

  if (!testType || testType === ENGLISH_TEST_NONE) {
    flags.push(
      'No IELTS/TOEFL score on file — most UAE universities require IELTS Academic (typically 5.0–5.5+) or TOEFL equivalent; foundation English may be needed'
    );
    return flags;
  }

  if (score == null) {
    flags.push(
      `${formatEnglishTestLabel(testType)} selected but score missing — add your result or verify with admissions`
    );
    return flags;
  }

  const bench = BENCHMARKS[testType];
  if (!bench) return flags;

  if (score < bench.min) {
    flags.push(
      `${formatEnglishTestLabel(testType)} ${score} is below typical UAE direct-entry minimum (~${bench.min}${bench.unit}) — preparatory/foundation English semester likely`
    );
  } else if (score < bench.ideal) {
    flags.push(
      `${formatEnglishTestLabel(testType)} ${score} may meet conditional entry (~${bench.min}+) — confirm cut-off on official university sites`
    );
  } else {
    flags.push(
      `${formatEnglishTestLabel(testType)} ${score} meets typical UAE direct-entry English benchmarks`
    );
  }

  return flags;
}

/** Instruction block for K2 personalization (api/chat.js) */
export function buildEnglishProficiencyK2Instruction(testType, score) {
  const typeLabel = formatEnglishTestLabel(testType);
  const scoreLabel = score != null ? String(score) : 'not provided';

  return (
    `Take notice that the UAE Ministry of Education has cancelled the EmSAT exam. ` +
    `Admissions criteria across UAE universities now strictly look for IELTS Academic (typically minimum 5.0 to 5.5 for direct entry) ` +
    `or TOEFL equivalents (TOEFL iBT ~61–70 or ITP ~500–525). ` +
    `The student's current English qualification profile is Type: ${typeLabel}, Score: ${scoreLabel}. ` +
    `Use this data to determine if they qualify for immediate program admission or if they will require a preparatory foundation English semester at their targeted UAE university.`
  );
}
