import { normalizeSubjectMarks } from './normalizeSubjectMarks';
import { computeSubjectFlags } from './subjectThresholds';
import { parseEnglishTestScore } from './englishProficiency';
import { computeInterestBoost, sortScore } from './programSubTracks';

const TRACK_KEYWORDS = {
  law: ['law', 'llb', 'legal', 'شريعة', 'قانون'],
  business: ['market', 'bus', 'fin', 'manag', 'account', 'econom', 'bba'],
  tech: ['tech', 'computer', 'cyber', 'engineer', 'ai', 'data', 'software', 'it', 'security'],
};

const SPECIALTY_SUB_TRACKS = new Set(['ai_systems', 'cybersecurity', 'data_science']);
const MIN_LOCAL_INTEREST_MATCHES = 2;
const MAX_SPECIALTY_CROSS_EMIRATE = 5;

export function curriculumMatches(accepted, studentCurriculum) {
  if (!accepted?.length) return true;
  return accepted.includes(studentCurriculum);
}

export function resolveTrack({ track, interest = '' }) {
  if (track && ['law', 'tech', 'business'].includes(track)) {
    return track;
  }
  const text = interest.toLowerCase();
  for (const [name, words] of Object.entries(TRACK_KEYWORDS)) {
    if (words.some((w) => text.includes(w))) return name;
  }
  return null;
}

function enrichMatch(p, uniById, highSchoolAvg, track, normalizedSubjects, englishTest, subTrack) {
  const uni = uniById[p.universityId];
  const belowOverall = highSchoolAvg < p.minOverallPercent;
  const subjectFlags = normalizedSubjects
    ? computeSubjectFlags(track, normalizedSubjects, highSchoolAvg, englishTest)
    : computeSubjectFlags(track, {}, highSchoolAvg, englishTest);
  const subjectPenalty = subjectFlags.filter((f) => f.includes('below')).length * 5;
  const { boost: interestBoost, isInterestMatch, matchedVia } = computeInterestBoost(p, subTrack);
  const fitScore = highSchoolAvg - p.minOverallPercent - subjectPenalty;

  return {
    ...p,
    uniName: uni ? `${uni.name} (${uni.shortName})` : p.universityId,
    url: uni?.url ?? p.sourceUrl,
    isUnderScore: belowOverall,
    isConditional: belowOverall || subjectFlags.some((f) => /below|foundation|Not taken|missing/i.test(f)),
    subjectFlags,
    fitScore,
    interestBoost,
    isInterestMatch,
    interestMatchedVia: matchedVia,
    sortScore: sortScore(fitScore, interestBoost),
  };
}

function compareMatches(a, b) {
  if (b.sortScore !== a.sortScore) return b.sortScore - a.sortScore;
  if (b.interestBoost !== a.interestBoost) return b.interestBoost - a.interestBoost;
  return b.fitScore - a.fitScore;
}

function baseFilter(programs, { track, emirate, degreeLevel }) {
  return programs.filter(
    (p) =>
      p.active &&
      p.degreeLevel === degreeLevel &&
      p.track === track &&
      (emirate === 'all' || p.emirate === emirate)
  );
}

function mapAndSort(pool, enrichArgs, curriculum, { curriculumMatch }) {
  return pool
    .filter((p) => curriculumMatch === curriculumMatches(p.acceptedCurricula, curriculum))
    .map((p) => enrichMatch(p, ...enrichArgs))
    .sort(compareMatches);
}

export function matchPrograms(programs, universities, profile) {
  const {
    emirate = 'all',
    highSchoolAvg,
    stream: curriculum = 'moe_general',
    subjectMarks = null,
    englishTestType = '',
    englishTestScore = null,
    track: explicitTrack,
    interest = '',
    subTrack = null,
    degreeLevel = 'undergraduate',
  } = profile;

  const track = resolveTrack({ track: explicitTrack, interest });
  if (!track) {
    return {
      track: null,
      matches: [],
      alternatives: [],
      specialtyMatches: [],
      error: 'TRACK_UNRESOLVED',
    };
  }

  const normalizedSubjects = subjectMarks
    ? normalizeSubjectMarks(curriculum, subjectMarks)
    : null;

  const englishTest = {
    type: englishTestType,
    score:
      englishTestScore != null
        ? englishTestScore
        : parseEnglishTestScore(englishTestType, profile.englishTestScore),
  };

  const uniById = Object.fromEntries(universities.map((u) => [u.id, u]));
  const enrichArgs = [uniById, highSchoolAvg, track, normalizedSubjects, englishTest, subTrack];

  const pool = baseFilter(programs, { track, emirate, degreeLevel });

  const matches = mapAndSort(pool, enrichArgs, curriculum, { curriculumMatch: true });
  const alternatives = mapAndSort(pool, enrichArgs, curriculum, { curriculumMatch: false }).map(
    (p) => ({ ...p, curriculumMismatch: true })
  );

  let specialtyMatches = [];
  const wantsSpecialty =
    subTrack &&
    SPECIALTY_SUB_TRACKS.has(subTrack) &&
    emirate !== 'all' &&
    track === 'tech';

  if (wantsSpecialty) {
    const localInterestCount = matches.filter((m) => m.isInterestMatch).length;
    if (localInterestCount < MIN_LOCAL_INTEREST_MATCHES) {
      const localIds = new Set([...matches, ...alternatives].map((m) => m.id));
      const crossPool = programs.filter(
        (p) =>
          p.active &&
          p.degreeLevel === degreeLevel &&
          p.track === track &&
          p.emirate !== emirate
      );

      specialtyMatches = crossPool
        .filter((p) => curriculumMatches(p.acceptedCurricula, curriculum))
        .map((p) => enrichMatch(p, ...enrichArgs))
        .filter((m) => m.isInterestMatch && !localIds.has(m.id))
        .sort(compareMatches)
        .slice(0, MAX_SPECIALTY_CROSS_EMIRATE)
        .map((m) => ({ ...m, crossEmirate: true }));
    }
  }

  return { track, matches, alternatives, specialtyMatches, error: null };
}

export function programsByEmirate(programs, emirate) {
  const rows = programs.filter(
    (p) => p.active && p.degreeLevel === 'undergraduate' && p.emirate === emirate
  );
  const byCollege = {};
  for (const p of rows) {
    const key = p.college || 'Programs';
    if (!byCollege[key]) byCollege[key] = [];
    byCollege[key].push(p);
  }
  return Object.entries(byCollege).map(([title, items]) => ({
    title,
    programs: items,
  }));
}
