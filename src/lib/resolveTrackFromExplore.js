import { applySubTrackToPathwayScores, buildSubTrackInterestSuffix } from './behavioralSorter.js';

export const INTEREST_OPTIONS = [
  {
    id: 'computers',
    emoji: '💻',
    label: 'Computers, apps & problem-solving',
    tracks: { tech: 3, business: 1 },
  },
  {
    id: 'business',
    emoji: '📊',
    label: 'Business, money, marketing & leadership',
    tracks: { business: 3, tech: 1 },
  },
  {
    id: 'law',
    emoji: '⚖️',
    label: 'Justice, rules & helping people legally',
    tracks: { law: 3, business: 1 },
  },
  {
    id: 'building',
    emoji: '🔧',
    label: 'Building, engineering & how things work',
    tracks: { tech: 3, business: 0 },
  },
  {
    id: 'science',
    emoji: '🔬',
    label: 'Science, health & the natural world',
    tracks: { tech: 3, business: 0 },
  },
  {
    id: 'creative',
    emoji: '🎨',
    label: 'Design, media & creative work',
    tracks: { business: 2, tech: 1 },
  },
  {
    id: 'unsure',
    emoji: '🤔',
    label: "Honestly, I'm not sure yet",
    tracks: { business: 1, tech: 1, law: 1 },
  },
];

export const PRIORITY_OPTIONS = [
  { id: 'uae_job', label: 'Job in the UAE after graduation', tracks: { business: 2, tech: 2, law: 1 } },
  { id: 'salary', label: 'Strong earning potential', tracks: { tech: 2, business: 2, law: 1 } },
  { id: 'prestige', label: 'Prestigious university name', tracks: { law: 1, tech: 2, business: 1 } },
  { id: 'easy_entry', label: 'Realistic entry with my current grades', tracks: { business: 2, tech: 1, law: 0 } },
  { id: 'family', label: 'Stay close to family (same emirate)', tracks: { business: 1, tech: 1, law: 1 } },
  { id: 'abroad', label: 'Option to study or work abroad later', tracks: { law: 2, tech: 2, business: 1 } },
];

export const PATHWAY_CATALOG = {
  law: {
    title: 'Law & Legal Studies',
    degrees: 'LLB, Legal Studies, Public Policy',
    careers: 'Courts, government, corporate compliance, further legal training',
    streamNote: {
      moe_general: 'MoE General stream can access several law pathways — verify English & interview requirements.',
      moe_advanced: 'Strong academic profile opens competitive LLB programs in the UAE.',
      default: 'Check language requirements (Arabic or English medium) per university.',
    },
  },
  tech: {
    title: 'Technology, IT & Engineering',
    degrees: 'BSc Computer Science, IT, Cybersecurity, Engineering',
    careers: 'Software, AI, cybersecurity, IT support, engineering roles in UAE & GCC',
    streamNote: {
      moe_general: 'MoE General: IT & computing paths are often more accessible than pure engineering — we will highlight both.',
      moe_advanced: 'Advanced stream unlocks engineering and competitive CS programs.',
      default: 'STEM prerequisites vary — Masar flags conditional pathways.',
    },
  },
  business: {
    title: 'Business & Management',
    degrees: 'BBA, Finance, Marketing, Management',
    careers: 'Banking, marketing, HR, entrepreneurship, government & corporate roles',
    streamNote: {
      moe_general: 'One of the most flexible paths for MoE General graduates in the UAE.',
      moe_advanced: 'Opens business schools across all emirates with strong mobility.',
      default: 'Wide entry options across private and federal institutions.',
    },
  },
};

function streamKey(stream) {
  if (stream === 'moe_general' || stream === 'moe_advanced') return stream;
  return 'default';
}

export function suggestPathways(selectedInterests, selectedPriorities, stream, subTrackId = null) {
  const scores = { law: 0, tech: 0, business: 0 };

  for (const id of selectedInterests) {
    const card = INTEREST_OPTIONS.find((c) => c.id === id);
    if (!card) continue;
    for (const [track, pts] of Object.entries(card.tracks)) {
      scores[track] += pts;
    }
  }

  for (const id of selectedPriorities) {
    const pri = PRIORITY_OPTIONS.find((p) => p.id === id);
    if (!pri) continue;
    for (const [track, pts] of Object.entries(pri.tracks)) {
      scores[track] += pts;
    }
  }

  if (stream === 'moe_general') {
    scores.business += 2;
    scores.tech += 1;
  }

  const adjusted = subTrackId
    ? applySubTrackToPathwayScores(scores, subTrackId)
    : scores;

  const sk = streamKey(stream);
  const ranked = Object.entries(adjusted)
    .map(([track, score]) => ({
      track,
      score,
      ...PATHWAY_CATALOG[track],
      why: PATHWAY_CATALOG[track].streamNote[sk] || PATHWAY_CATALOG[track].streamNote.default,
    }))
    .sort((a, b) => b.score - a.score);

  return ranked;
}

export function buildExploreInterestText(selectedInterests, selectedPriorities, subTrackId = null) {
  const interestLabels = selectedInterests
    .map((id) => INTEREST_OPTIONS.find((c) => c.id === id)?.label)
    .filter(Boolean);
  const priorityLabels = selectedPriorities
    .map((id) => PRIORITY_OPTIONS.find((p) => p.id === id)?.label)
    .filter(Boolean);

  const subSector = subTrackId ? buildSubTrackInterestSuffix(subTrackId) : '';

  return [
    interestLabels.length ? `Interests: ${interestLabels.join('; ')}` : '',
    priorityLabels.length ? `Priorities: ${priorityLabels.join('; ')}` : '',
    subSector.trim(),
  ]
    .filter(Boolean)
    .join('. ');
}
