/**
 * Step 2.5 — RIASEC-informed behavioral sorter (Cognitive Load Theory: one decision per screen).
 * Maps micro-preferences to UAE-relevant sub-sectors before value drivers (Step 3).
 */

/** Interest IDs that route to Step 2.5 instead of Step 3 */
export const BEHAVIORAL_TRIGGER_INTERESTS = [
  'building',
  'creative',
  'science',
  'computers',
];

export function interestTriggersBehavioral(interestId) {
  return BEHAVIORAL_TRIGGER_INTERESTS.includes(interestId);
}

export const ENGINEERING_QUIZ = {
  branch: 'engineering',
  header: 'Step 2.5 — What scale do you prefer to build on?',
  question:
    'When you look at a massive modern airport or city hub, what captures your imagination most?',
  options: [
    {
      id: 'civil_planning',
      label:
        'The overall physical layout, structural foundations, and blueprint shapes.',
      subTracks: ['civil', 'architecture', 'urban_planning'],
      primarySubTrack: 'civil',
    },
    {
      id: 'piping_systems',
      label:
        'The intricate internal networks—fuel lines, water pressure, and complex HVAC pipe designs.',
      subTracks: ['piping'],
      primarySubTrack: 'piping',
    },
    {
      id: 'mechanical_systems',
      label: 'The high-powered machinery, jet engines, and mechanical control systems.',
      subTracks: ['mechanical'],
      primarySubTrack: 'mechanical',
    },
    {
      id: 'aviation_systems',
      label: 'The aerodynamics, flight mechanics, and advanced aviation tracking.',
      subTracks: ['aviation'],
      primarySubTrack: 'aviation',
    },
  ],
};

export const TECH_DIGITAL_QUIZ = {
  branch: 'tech_digital',
  header: 'Step 2.5 — What kind of digital work excites you?',
  question: 'When you imagine your ideal tech career in the UAE, what do you picture yourself doing most?',
  options: [
    {
      id: 'computer_science',
      label: 'Building apps, software, and solving problems with code.',
      subTracks: ['computer_science'],
      primarySubTrack: 'computer_science',
    },
    {
      id: 'cybersecurity',
      label: 'Protecting networks, stopping cyber threats, and securing data.',
      subTracks: ['cybersecurity'],
      primarySubTrack: 'cybersecurity',
    },
    {
      id: 'ai_systems',
      label: 'AI, machine learning, and intelligent systems (UAE national priority).',
      subTracks: ['ai_systems'],
      primarySubTrack: 'ai_systems',
    },
    {
      id: 'data_science',
      label: 'Data analytics, statistics, and turning numbers into decisions.',
      subTracks: ['data_science'],
      primarySubTrack: 'data_science',
    },
  ],
};

export const SCIENCE_QUIZ = {
  branch: 'science',
  header: 'Step 2.5 — What mysteries do you want to solve?',
  question:
    "If you were handed a multi-million-dirham research grant, where would you focus your life's work?",
  options: [
    {
      id: 'medical_bio',
      label:
        'Decoding human cell mutations, biological systems, and clinical medical breakthroughs.',
      subTracks: ['medical', 'biology'],
      primarySubTrack: 'medical',
    },
    {
      id: 'agricultural',
      label:
        'Optimizing global agricultural systems, vertical farming genetics, and soil sustainability.',
      subTracks: ['agricultural'],
      primarySubTrack: 'agricultural',
    },
    {
      id: 'space_physics',
      label: 'Analyzing deep-space celestial trajectories, astrophysics, and quantum realities.',
      subTracks: ['physics', 'space_science'],
      primarySubTrack: 'space_science',
    },
    {
      id: 'psychology',
      label: 'Understanding human emotional behavior, cognitive processing, and mental profiles.',
      subTracks: ['psychology'],
      primarySubTrack: 'psychology',
    },
    {
      id: 'geography',
      label: 'Mapping geographic variations, climate changes, and environmental cartography.',
      subTracks: ['geography'],
      primarySubTrack: 'geography',
    },
    {
      id: 'philosophy',
      label: 'Deconstructing the core nature of absolute truth, logic, ethics, and human thought.',
      subTracks: ['philosophy'],
      primarySubTrack: 'philosophy',
    },
  ],
};

/** Sub-sector display + matching metadata */
export const SUB_TRACK_CATALOG = {
  civil: {
    id: 'civil',
    label: 'Civil Engineering',
    displayTitle: 'BSc in Civil Engineering',
    holland: 'R–I',
    track: 'tech',
    accent: '#38bdf8',
    category: 'engineering',
    degrees: 'BSc Civil Engineering, Structural Engineering, Infrastructure Design',
    careers: 'Site engineering, infrastructure, transport hubs, UAE mega-projects',
    isTheoretical: false,
  },
  architecture: {
    id: 'architecture',
    label: 'Architecture',
    displayTitle: 'Bachelor of Architecture (BArch)',
    holland: 'A–R',
    track: 'tech',
    accent: '#38bdf8',
    category: 'engineering',
    degrees: 'BArch, Architectural Technology, Sustainable Design',
    careers: 'Architectural studios, urban design, developer design teams',
    isTheoretical: false,
  },
  urban_planning: {
    id: 'urban_planning',
    label: 'Urban Planning',
    displayTitle: 'BSc in Urban Planning & Regional Development',
    holland: 'I–S',
    track: 'tech',
    accent: '#38bdf8',
    category: 'engineering',
    degrees: 'Urban Planning, Smart Cities, Regional Development',
    careers: 'Municipal planning, smart-city consultancies, policy advisory',
    isTheoretical: false,
  },
  piping: {
    id: 'piping',
    label: 'Piping Engineering',
    displayTitle: 'BSc in Mechanical / Piping & HVAC Systems',
    holland: 'R–C',
    track: 'tech',
    accent: '#38bdf8',
    category: 'engineering',
    degrees: 'Mechanical Engineering (HVAC/Piping), Energy Systems',
    careers: 'Oil & gas, district cooling, MEP contracting in the GCC',
    isTheoretical: false,
  },
  mechanical: {
    id: 'mechanical',
    label: 'Mechanical Engineering',
    displayTitle: 'BSc in Mechanical Engineering',
    holland: 'R–I',
    track: 'tech',
    accent: '#38bdf8',
    category: 'engineering',
    degrees: 'BSc Mechanical Engineering, Mechatronics, Manufacturing',
    careers: 'Manufacturing, automotive, energy systems, industrial R&D',
    isTheoretical: false,
  },
  aviation: {
    id: 'aviation',
    label: 'Aviation Engineering',
    displayTitle: 'BSc in Aeronautical / Aviation Engineering',
    holland: 'R–I',
    track: 'tech',
    accent: '#38bdf8',
    category: 'engineering',
    degrees: 'Aeronautical Engineering, Aviation Systems, Aerospace Tech',
    careers: 'Airlines, airports, MRO, defense aerospace in the UAE',
    isTheoretical: false,
  },
  medical: {
    id: 'medical',
    label: 'Medical Sciences',
    displayTitle: 'BSc in Biomedical / Pre-Medical Sciences',
    holland: 'I–S',
    track: 'tech',
    accent: '#10b981',
    category: 'science',
    degrees: 'Biomedical Science, Clinical Laboratory Science, Pre-Med pathways',
    careers: 'Hospitals, clinical research, pharma, public health labs',
    isTheoretical: false,
  },
  biology: {
    id: 'biology',
    label: 'Biological Sciences',
    displayTitle: 'BSc in Biological Sciences',
    holland: 'I–R',
    track: 'tech',
    accent: '#10b981',
    category: 'science',
    degrees: 'Biology, Genetics, Marine Biology, Biotechnology',
    careers: 'Research labs, biotech, environmental agencies, academia',
    isTheoretical: false,
  },
  agricultural: {
    id: 'agricultural',
    label: 'Agricultural Science',
    displayTitle: 'Bachelor of Science in Agricultural Technology',
    holland: 'I–R',
    track: 'tech',
    accent: '#10b981',
    category: 'science',
    degrees: 'Agricultural Tech, Agribusiness, Food Security Systems',
    careers: 'Vertical farming, agri-tech, food security, sustainability consultancies',
    isTheoretical: false,
  },
  physics: {
    id: 'physics',
    label: 'Physics',
    displayTitle: 'BSc in Physics',
    holland: 'I',
    track: 'tech',
    accent: '#10b981',
    category: 'science',
    degrees: 'Physics, Applied Physics, Engineering Physics',
    careers: 'Research, energy, data science bridges, graduate study',
    isTheoretical: true,
  },
  space_science: {
    id: 'space_science',
    label: 'Space Science',
    displayTitle: 'BSc in Space Science / Astrophysics',
    holland: 'I',
    track: 'tech',
    accent: '#10b981',
    category: 'science',
    degrees: 'Space Science, Astrophysics, Satellite Systems (where offered)',
    careers: 'UAE space sector, research institutes, international grad pathways',
    isTheoretical: true,
  },
  psychology: {
    id: 'psychology',
    label: 'Psychology',
    displayTitle: 'BSc in Psychology',
    holland: 'S–I',
    track: 'business',
    accent: '#10b981',
    category: 'science',
    degrees: 'Psychology, Behavioral Science, Organizational Psychology',
    careers: 'HR analytics, counseling pathways, education, corporate wellbeing',
    isTheoretical: false,
  },
  geography: {
    id: 'geography',
    label: 'Geography & Environment',
    displayTitle: 'BSc in Geography / Environmental Science',
    holland: 'I–R',
    track: 'tech',
    accent: '#10b981',
    category: 'science',
    degrees: 'Geography, GIS, Environmental Management, Climate Studies',
    careers: 'GIS mapping, sustainability, urban climate planning, government',
    isTheoretical: false,
  },
  philosophy: {
    id: 'philosophy',
    label: 'Philosophy',
    displayTitle: 'BA in Philosophy',
    holland: 'A–I',
    track: 'law',
    accent: '#10b981',
    category: 'science',
    degrees: 'Philosophy, Ethics, Logic, interdisciplinary humanities',
    careers: 'Law prep, policy, academia, ethics & compliance (often via further study)',
    isTheoretical: true,
  },
  computer_science: {
    id: 'computer_science',
    label: 'Computer Science',
    displayTitle: 'BSc in Computer Science',
    holland: 'I–R',
    track: 'tech',
    accent: '#38bdf8',
    category: 'tech',
    degrees: 'Computer Science, Software Engineering, Information Systems',
    careers: 'Software developer, product engineer, startup tech roles in UAE',
    isTheoretical: false,
  },
  cybersecurity: {
    id: 'cybersecurity',
    label: 'Cybersecurity',
    displayTitle: 'BSc in Cybersecurity',
    holland: 'I–C',
    track: 'tech',
    accent: '#38bdf8',
    category: 'tech',
    degrees: 'Cybersecurity, Information Security, Digital Forensics',
    careers: 'SOC analyst, security engineer, government & finance cyber roles',
    isTheoretical: false,
  },
  ai_systems: {
    id: 'ai_systems',
    label: 'Artificial Intelligence',
    displayTitle: 'BSc in Artificial Intelligence',
    holland: 'I',
    track: 'tech',
    accent: '#38bdf8',
    category: 'tech',
    degrees: 'AI, Machine Learning, Intelligent Systems (e.g. MBZUAI, UAEU pathways)',
    careers: 'AI engineer, research assistant, data-centric product teams',
    isTheoretical: false,
  },
  data_science: {
    id: 'data_science',
    label: 'Data Science',
    displayTitle: 'BSc in Data Science / Analytics',
    holland: 'I–C',
    track: 'tech',
    accent: '#38bdf8',
    category: 'tech',
    degrees: 'Data Science, Business Analytics, Statistics',
    careers: 'Analyst, BI specialist, fintech & logistics analytics in the GCC',
    isTheoretical: false,
  },
};

const THEORETICAL_IDS = new Set(
  Object.values(SUB_TRACK_CATALOG)
    .filter((s) => s.isTheoretical)
    .map((s) => s.id)
);

export function needsBehavioralSorter(selectedInterests) {
  return selectedInterests.some((id) => BEHAVIORAL_TRIGGER_INTERESTS.includes(id));
}

/**
 * Priority: building → engineering quiz; computers → tech quiz;
 * science/creative → science quiz.
 */
export function resolveBehavioralBranch(selectedInterests) {
  if (selectedInterests.includes('building')) return 'engineering';
  if (selectedInterests.includes('computers')) return 'tech_digital';
  if (
    selectedInterests.includes('science') ||
    selectedInterests.includes('creative')
  ) {
    return 'science';
  }
  return 'science';
}

export function getQuizForBranch(branch) {
  if (branch === 'engineering') return ENGINEERING_QUIZ;
  if (branch === 'tech_digital') return TECH_DIGITAL_QUIZ;
  return SCIENCE_QUIZ;
}

export function resolveSubTrackFromOption(option) {
  if (!option) return null;
  return option.primarySubTrack || option.subTracks?.[0] || null;
}

export function getSubTrackMeta(subTrackId) {
  return subTrackId ? SUB_TRACK_CATALOG[subTrackId] ?? null : null;
}

/** Boost pathway ranking using sub-track + RIASEC alignment */
export function applySubTrackToPathwayScores(scores, subTrackId) {
  const meta = getSubTrackMeta(subTrackId);
  if (!meta) return scores;

  const next = { ...scores };
  next[meta.track] = (next[meta.track] || 0) + 8;

  if (meta.category === 'engineering' || meta.category === 'tech') {
    next.tech = (next.tech || 0) + 4;
  }
  if (meta.category === 'science' && meta.track === 'business') {
    next.business = (next.business || 0) + 2;
  }

  return next;
}

export function buildSubTrackInterestSuffix(subTrackId) {
  const meta = getSubTrackMeta(subTrackId);
  if (!meta) return '';
  return ` Behavioral sub-sector focus: ${meta.label} (${meta.displayTitle}).`;
}

export function computeAdvisorInsight(subTrackId, selectedPriorities) {
  const meta = getSubTrackMeta(subTrackId);
  if (!meta || !THEORETICAL_IDS.has(subTrackId)) return null;
  if (!selectedPriorities.includes('uae_job')) return null;

  return {
    title: 'Advisor Insight',
    body: 'While your profile shows an elite alignment with deep theoretical concepts, local market placement indices show faster day-one employment vectors in corporate technology or structural planning disciplines. Consider exploring an analytical track that bridges these sectors.',
  };
}

/** Wizard step indices (behavioral step may be skipped) */
export const WIZARD_STEP = {
  PROFILE: 0,
  INTERESTS: 1,
  BEHAVIORAL: 2,
  PRIORITIES: 3,
  PATHWAYS: 4,
};

export function getWizardProgress(step, hasBehavioral) {
  if (!hasBehavioral) {
    const indexByStep = { 0: 0, 1: 1, 3: 2, 4: 3 };
    return { index: indexByStep[step] ?? 0, total: 4 };
  }
  const indexByStep = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 };
  return { index: indexByStep[step] ?? 0, total: 5 };
}

export function getPreviousStep(currentStep, hasBehavioral) {
  if (currentStep === WIZARD_STEP.PROFILE) return null;
  if (currentStep === WIZARD_STEP.INTERESTS) return WIZARD_STEP.PROFILE;
  if (currentStep === WIZARD_STEP.BEHAVIORAL) return WIZARD_STEP.INTERESTS;
  if (currentStep === WIZARD_STEP.PRIORITIES) {
    return hasBehavioral ? WIZARD_STEP.BEHAVIORAL : WIZARD_STEP.INTERESTS;
  }
  if (currentStep === WIZARD_STEP.PATHWAYS) return WIZARD_STEP.PRIORITIES;
  return null;
}

export function getNextStepFromInterests(hasBehavioral) {
  return hasBehavioral ? WIZARD_STEP.BEHAVIORAL : WIZARD_STEP.PRIORITIES;
}
