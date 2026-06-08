import universities from '../data/universities.json' with { type: 'json' };
import { formatSubjectMarksLine } from './normalizeSubjectMarks';

const STREAM_LABELS = {
  moe_advanced: 'UAE MoE Advanced Stream',
  moe_general: 'UAE MoE General Stream',
  british_alevels: 'British Curriculum (A-Levels)',
  american_diploma: 'American High School Diploma',
};

const TRACK_LABELS = { law: 'Law', tech: 'Technology & Engineering', business: 'Business' };

/** Cap programs sent to K2 — large prompts slow K2-Think and can cause Vercel 504 timeouts */
const K2_INITIAL_MATCH_LIMIT = 8;

const UNI_ALIASES = {
  mbzuai: ['mbzuai', 'mohamed bin zayed', 'bin zayed university', 'mbz uai'],
  khalifa: ['khalifa', 'ku '],
  uaeu: ['uaeu', 'emirates university', 'uae university'],
  adu: ['abu dhabi university', ' adu '],
  ud: ['university of dubai', ' ud '],
  aud: ['american university in dubai', ' aud '],
};

function contactBlockForMatch(m) {
  const uni = universities.find((u) => u.id === m.universityId);
  if (!uni) return `   Official site: ${m.url}`;

  const lines = [`   Official site: ${uni.url}`];
  if (uni.applyUrl) lines.push(`   Apply online: ${uni.applyUrl}`);
  if (uni.admissionsPhone) lines.push(`   Admissions phone (verified): ${uni.admissionsPhone}`);
  if (uni.admissionsEmail) lines.push(`   Admissions email (verified): ${uni.admissionsEmail}`);
  if (uni.contactUrl) lines.push(`   Contact page: ${uni.contactUrl}`);
  return lines.join('\n');
}

function formatMatchBlock(matches) {
  if (matches.length === 0) {
    return '(No programs matched — help the student broaden search or improve profile.)';
  }
  return matches
    .map(
      (m, i) =>
        `${i + 1}. ${m.uniName} — ${m.programName}
   Emirate: ${m.emirate} | Min overall: ${m.minOverallPercent}%
   Criteria: ${m.criteriaText}
   Student vs threshold: ${m.isUnderScore ? 'BELOW (conditional pathway likely)' : 'MEETS typical overall index'}${m.subjectFlags?.length ? `\n   Subject flags: ${m.subjectFlags.join('; ')}` : ''}
${contactBlockForMatch(m)}`
    )
    .join('\n\n');
}

function subjectMarksBlock(profile) {
  if (!profile.subjectMarks) {
    return `- EmSAT Math: ${profile.emsatMath != null ? profile.emsatMath : 'not provided'}`;
  }
  return `- Subject marks: ${formatSubjectMarksLine(profile.stream, profile.subjectMarks)}`;
}

function profileSummary(profile, track) {
  return `- Preferred emirate: ${profile.emirate === 'all' ? 'All Emirates' : profile.emirate}
- Target track: ${TRACK_LABELS[track] || track}
- Curriculum: ${STREAM_LABELS[profile.stream] || profile.stream} | Overall: ${profile.highSchoolAvg}%
${subjectMarksBlock(profile)}`;
}

/** Pick programs mentioned in the student's follow-up question */
export function filterRelevantMatches(matches, userQuestion) {
  if (!userQuestion?.trim() || matches.length === 0) return matches.slice(0, 6);

  const q = ` ${userQuestion.toLowerCase()} `;

  const scored = matches.map((m) => {
    const uni = universities.find((u) => u.id === m.universityId);
    const haystack = ` ${m.uniName} ${m.programName} ${m.universityId} ${uni?.shortName ?? ''} ${uni?.name ?? ''} `.toLowerCase();
    let score = 0;

    for (const token of q.split(/\W+/).filter((t) => t.length > 2)) {
      if (haystack.includes(token)) score += 2;
    }

    const aliases = UNI_ALIASES[m.universityId];
    if (aliases?.some((a) => q.includes(a))) score += 12;

    if (q.includes('ai') && /artificial intelligence|\bai\b/i.test(m.programName)) score += 4;

    return { m, score };
  });

  const hits = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  if (hits.length > 0) {
    const seen = new Set();
    const picked = [];
    for (const { m } of hits) {
      if (seen.has(m.id)) continue;
      seen.add(m.id);
      picked.push(m);
      if (picked.length >= 6) break;
    }
    return picked;
  }

  return matches.slice(0, 6);
}

export function buildSystemPrompt(profile, matches, track) {
  const topMatches = matches.slice(0, K2_INITIAL_MATCH_LIMIT);
  const matchBlock = formatMatchBlock(topMatches);
  const overflowNote =
    matches.length > K2_INITIAL_MATCH_LIMIT
      ? `\n(Top ${K2_INITIAL_MATCH_LIMIT} of ${matches.length} total matches — discuss only these in the table.)`
      : '';

  return `You are Masar AI (مسار), a UAE academic pathway counselor for high school graduates.

STUDENT PROFILE (authoritative — do not contradict):
- Preferred emirate: ${profile.emirate === 'all' ? 'All Emirates' : profile.emirate}
- Target track: ${TRACK_LABELS[track] || track}
- High school curriculum: ${STREAM_LABELS[profile.stream] || profile.stream}
- Overall average: ${profile.highSchoolAvg}%
${subjectMarksBlock(profile)}
- Additional interests: ${profile.interest || 'none'}
- Discovery mode: ${profile.discoveryMode ? 'yes — student used Explore wizard; explain why their chosen track fits their stated interests' : 'no — student picked field directly'}
${profile.subTrackMeta ? `- Behavioral sub-sector (RIASEC sorter): ${profile.subTrackMeta.label} — target degree pathway: ${profile.subTrackMeta.displayTitle}` : ''}

VERIFIED PROGRAM MATCHES (only discuss these institutions):
${matchBlock}${overflowNote}

STRICT RULES — violations break trust:
1. Your FIRST characters must be "## " — a markdown heading. Zero preamble. Never write "The user wants", "We need to", "Let's parse", word counts, or any planning.
2. Write ONLY ONE final answer — no drafts, no revisions, no "Will produce final answer". Never show internal reasoning.
3. NEVER invent phone numbers, emails, tuition fees, or application deadlines.
4. For contact details: use ONLY the "Admissions phone/email" lines above. If missing, say: "Check the official Apply/Contact links listed above."
5. For tuition/costs: say fees change each year and direct the student to the official apply URL — do NOT guess AED amounts.
6. OUTPUT FORMAT — use this exact structure:
   - ## Main title (one line summary)
   - Optional 1–2 sentence intro paragraph
   - ### Best Fit — MUST include a markdown comparison table with columns:
     | University | Program | Why it fits you | Contact |
     Pick your top 3–4 matches from the list above. One row per university.
     In Contact column: use verified phone/email ONLY if provided above; otherwise write "See verified links above".
   - ### Conditional Flags — bullet list (- item) of admission gaps or requirements to watch
   - ### Practical Next Steps — numbered or bullet action list
   - End with one short encouraging sentence (optional)
   - NEVER use HTML tags (<br>, <table>, etc.)
   - Keep paragraphs short (2–3 sentences max)
7. Keep total length scannable — ~200 words unless the student asks for detail.
8. Do not invent programs or cutoffs not listed above.
9. Use subject marks vs overall average: if Math/Science exceed overall, highlight STEM-friendly programs from the verified list; if Math/Science are weak for a STEM program, flag foundation/placement — never invent programs outside the list.
10. Be encouraging and practical for UAE students and parents.`;
}

export function buildFollowUpSystemPrompt(profile, matches, track, userQuestion) {
  const relevant = filterRelevantMatches(matches, userQuestion);
  const matchBlock = formatMatchBlock(relevant);

  return `You are Masar AI (مسار), a UAE academic pathway counselor. The student already saw their match summary. Answer THIS follow-up only.

STUDENT PROFILE:
${profileSummary(profile, track)}

RELEVANT VERIFIED PROGRAMS (only discuss these — do not invent others):
${matchBlock}

FOLLOW-UP RULES:
1. FIRST characters must be "## " — one short heading. Zero preamble or planning text.
2. ~120 words max. Use ### sub-heading optional, then bullet list (- item).
3. NO comparison table unless the student explicitly asks to compare 2+ universities.
4. NEVER invent phone, email, fees, or deadlines — use verified lines above only.
5. If a university is not listed above, say it is not in their current Masar match list and suggest checking the official site or broadening emirate/track.
6. Write ONLY the final student-facing answer.`;
}

export function buildInitialUserMessage() {
  return `Explain my top matches in plain language. Use a comparison table for best-fit universities (University | Program | Why it fits | Contact), then conditional flags and next steps. Verified contacts only.`;
}
