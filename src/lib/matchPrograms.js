const TRACK_KEYWORDS = {
  law: ['law', 'llb', 'legal', 'شريعة', 'قانون'],
  business: ['market', 'bus', 'fin', 'manag', 'account', 'econom', 'bba'],
  tech: ['tech', 'computer', 'cyber', 'engineer', 'ai', 'data', 'software', 'it', 'security'],
};

function curriculumMatches(accepted, studentCurriculum) {
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
    return { track: null, matches: [], error: 'TRACK_UNRESOLVED' };
  }

  const uniById = Object.fromEntries(universities.map((u) => [u.id, u]));

  const matches = programs
    .filter((p) => p.active)
    .filter((p) => p.degreeLevel === degreeLevel)
    .filter((p) => p.track === track)
    .filter((p) => emirate === 'all' || p.emirate === emirate)
    .filter((p) => curriculumMatches(p.acceptedCurricula, curriculum))
    .map((p) => {
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
    })
    .sort((a, b) => b.fitScore - a.fitScore);

  return { track, matches, error: null };
}

/** Group active undergrad programs by emirate for the reference sidebar */
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
