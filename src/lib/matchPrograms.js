const TRACK_KEYWORDS = {
  law: ['law', 'llb', 'legal', 'شريعة', 'قانون'],
  business: ['market', 'bus', 'fin', 'manag', 'account', 'econom', 'bba'],
  tech: ['tech', 'computer', 'cyber', 'engineer', 'ai', 'data', 'software', 'it', 'security'],
};

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

function enrichMatch(p, uniById, highSchoolAvg, emsatMath) {
  const uni = uniById[p.universityId];
  const belowOverall = highSchoolAvg < p.minOverallPercent;
  const belowEmsat =
    p.emsatMathMin != null && (emsatMath == null || emsatMath < p.emsatMathMin);
  return {
    ...p,
    uniName: uni ? `${uni.name} (${uni.shortName})` : p.universityId,
    url: uni?.url ?? p.sourceUrl,
    isUnderScore: belowOverall,
    isConditional: belowOverall || belowEmsat,
    fitScore: highSchoolAvg - p.minOverallPercent,
  };
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

export function matchPrograms(programs, universities, profile) {
  const {
    emirate = 'all',
    highSchoolAvg,
    stream: curriculum = 'moe_general',
    emsatMath = null,
    track: explicitTrack,
    interest = '',
    degreeLevel = 'undergraduate',
  } = profile;

  const track = resolveTrack({ track: explicitTrack, interest });
  if (!track) {
    return { track: null, matches: [], alternatives: [], error: 'TRACK_UNRESOLVED' };
  }

  const uniById = Object.fromEntries(universities.map((u) => [u.id, u]));
  const pool = baseFilter(programs, { track, emirate, degreeLevel });

  const matches = pool
    .filter((p) => curriculumMatches(p.acceptedCurricula, curriculum))
    .map((p) => enrichMatch(p, uniById, highSchoolAvg, emsatMath))
    .sort((a, b) => b.fitScore - a.fitScore);

  const alternatives = pool
    .filter((p) => !curriculumMatches(p.acceptedCurricula, curriculum))
    .map((p) => ({
      ...enrichMatch(p, uniById, highSchoolAvg, emsatMath),
      curriculumMismatch: true,
    }))
    .sort((a, b) => b.fitScore - a.fitScore);

  return { track, matches, alternatives, error: null };
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
