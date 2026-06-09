/**
 * Maps programs to behavioral sub-tracks (AI, cybersecurity, CS, data science).
 * Used by matchPrograms for interest-aware ranking.
 */

export const SUB_TRACK_KEYWORDS = {
  ai_systems: [
    'artificial intelligence',
    'machine learning',
    'intelligent system',
    ' ai ',
    'deep learning',
  ],
  cybersecurity: [
    'cyber',
    'information security',
    'information systems security',
    'network security',
    'digital forensics',
    'security engineering',
  ],
  computer_science: [
    'computer science',
    'computer engineering',
    'software engineering',
    'computing',
    'information technology',
    'information systems',
  ],
  data_science: [
    'data science',
    'data analytics',
    'business analytics',
    'business intelligence',
    'statistics',
  ],
};

const INTEREST_BOOST_EXACT = 50;
const INTEREST_BOOST_KEYWORD = 28;

function haystackFor(program) {
  const parts = [
    program.programName,
    program.college,
    program.criteriaText,
    ...(program.focusKeywords || []),
  ];
  return ` ${parts.join(' ').toLowerCase()} `;
}

/** Resolve sub-tracks from explicit JSON tags or program text. */
export function resolveProgramSubTracks(program) {
  if (program.subTracks?.length) return [...program.subTracks];

  const hay = haystackFor(program);
  const found = [];
  for (const [id, keywords] of Object.entries(SUB_TRACK_KEYWORDS)) {
    if (keywords.some((kw) => hay.includes(kw))) found.push(id);
  }
  return found;
}

export function programMatchesSubTrack(program, subTrackId) {
  if (!subTrackId) return false;
  return resolveProgramSubTracks(program).includes(subTrackId);
}

/** 0 = no alignment; higher = stronger interest match for sorting. */
export function computeInterestBoost(program, subTrackId) {
  if (!subTrackId) return { boost: 0, isInterestMatch: false, matchedVia: null };

  const tags = resolveProgramSubTracks(program);
  if (tags.includes(subTrackId)) {
    return {
      boost: INTEREST_BOOST_EXACT,
      isInterestMatch: true,
      matchedVia: program.subTracks?.includes(subTrackId) ? 'tag' : 'inferred',
    };
  }

  const keywords = SUB_TRACK_KEYWORDS[subTrackId] || [];
  const hay = haystackFor(program);
  if (keywords.some((kw) => hay.includes(kw))) {
    return { boost: INTEREST_BOOST_KEYWORD, isInterestMatch: true, matchedVia: 'keyword' };
  }

  return { boost: 0, isInterestMatch: false, matchedVia: null };
}

export function sortScore(fitScore, interestBoost) {
  return fitScore + interestBoost;
}
