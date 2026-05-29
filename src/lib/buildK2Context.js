const STREAM_LABELS = {
  moe_advanced: 'UAE MoE Advanced Stream',
  moe_general: 'UAE MoE General Stream',
  british_alevels: 'British Curriculum (A-Levels)',
  american_diploma: 'American High School Diploma',
};

const TRACK_LABELS = { law: 'Law', tech: 'Technology & Engineering', business: 'Business' };

export function buildSystemPrompt(profile, matches, track) {
  const matchBlock =
    matches.length === 0
      ? '(No programs matched — help the student broaden search or improve profile.)'
      : matches
          .map(
            (m, i) =>
              `${i + 1}. ${m.uniName} — ${m.programName}
   Emirate: ${m.emirate} | Min overall: ${m.minOverallPercent}%
   Criteria: ${m.criteriaText}
   Student vs threshold: ${m.isUnderScore ? 'BELOW (conditional pathway likely)' : 'MEETS typical overall index'}
   URL: ${m.url}`
          )
          .join('\n\n');

  return `You are Masar AI (مسار), a UAE academic pathway counselor for high school graduates.

STUDENT PROFILE (authoritative — do not contradict):
- Preferred emirate: ${profile.emirate === 'all' ? 'All Emirates' : profile.emirate}
- Target track: ${TRACK_LABELS[track] || track}
- High school curriculum: ${STREAM_LABELS[profile.stream] || profile.stream}
- Overall average: ${profile.highSchoolAvg}%
- EmSAT Math: ${profile.emsatMath != null ? profile.emsatMath : 'not provided'}
- Additional interests: ${profile.interest || 'none'}

VERIFIED PROGRAM MATCHES FROM LOCAL KNOWLEDGE BASE (only discuss these — never invent universities or cutoffs):
${matchBlock}

RULES:
1. Explain matches in clear, encouraging language suitable for UAE students and parents.
2. Reference MoE General vs Advanced stream implications when relevant.
3. If a program is marked BELOW threshold, explain conditional options (placement tests, foundation, retakes) without guaranteeing admission.
4. Do not invent programs, scores, or universities not listed above.
5. Keep answers concise unless the student asks for detail.
6. You may discuss career pathways in the UAE/GCC linked to the chosen track.`;
}

export function buildInitialUserMessage() {
  return `Please explain my institutional matches above in plain language. Cover: (1) which options fit me best and why, (2) any conditional flags, (3) practical next steps for applications in the UAE.`;
}
