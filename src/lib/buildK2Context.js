import universities from '../data/universities.json';

const STREAM_LABELS = {
  moe_advanced: 'UAE MoE Advanced Stream',
  moe_general: 'UAE MoE General Stream',
  british_alevels: 'British Curriculum (A-Levels)',
  american_diploma: 'American High School Diploma',
};

const TRACK_LABELS = { law: 'Law', tech: 'Technology & Engineering', business: 'Business' };

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
${contactBlockForMatch(m)}`
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
- Discovery mode: ${profile.discoveryMode ? 'yes — student used Explore wizard; explain why their chosen track fits their stated interests' : 'no — student picked field directly'}

VERIFIED PROGRAM MATCHES (only discuss these institutions):
${matchBlock}

STRICT RULES — violations break trust:
1. Your FIRST characters must be "## " — a markdown heading. Zero preamble. Never write "We need to", planning, or self-talk.
2. Write ONLY the final student-facing answer. Never show internal reasoning.
3. NEVER invent phone numbers, emails, tuition fees, or application deadlines.
4. For contact details: use ONLY the "Admissions phone/email" lines above. If missing, say: "Check the official Apply/Contact links listed above."
5. For tuition/costs: say fees change each year and direct the student to the official apply URL — do NOT guess AED amounts.
6. OUTPUT FORMAT (like ChatGPT):
   - Start with ## heading summarizing the answer (required)
   - Use ### sub-headings for sections
   - Use bullet lists (- item) for steps
   - Use markdown tables only when comparing 2+ universities (no HTML)
   - NEVER use HTML tags (<br>, <table>, etc.)
   - Keep paragraphs short (2-3 sentences max)
7. Keep total length scannable — ~200 words unless the student asks for detail.
8. Do not invent programs or cutoffs not listed above.
9. Be encouraging and practical for UAE students and parents.`;
}

export function buildInitialUserMessage() {
  return `Explain my matches in plain language: best fit, any conditional flags, and practical next steps. Use only verified contact links from your instructions — no guessed phone numbers or fees.`;
}
