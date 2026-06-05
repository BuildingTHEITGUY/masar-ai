const CURRICULUM_LABELS = {
  moe_general: 'UAE MoE General Stream',
  moe_advanced: 'UAE MoE Advanced Stream',
  british_alevels: 'British Curriculum (A-Levels)',
  american_diploma: 'American High School Diploma',
};

const EMIRATE_LABELS = {
  dubai: 'Dubai',
  abudhabi: 'Abu Dhabi',
  sharjah: 'Sharjah',
  all: 'All Emirates',
};

const TRACK_LABELS = {
  law: 'Law',
  tech: 'Technology & Engineering',
  business: 'Business',
};

/**
 * Maps studentProfile + resolvedTrack into API primitives for /api/chat.
 */
export function buildChatProfilePayload(studentProfile, resolvedTrack, options = {}) {
  if (!studentProfile) return {};

  const track = resolvedTrack || studentProfile.track || 'business';
  const subLabel = studentProfile.subTrackMeta?.label;

  return {
    name: studentProfile.name?.trim() || 'Student',
    email: studentProfile.email?.trim() || '',
    nationality: studentProfile.nationality?.trim() || 'UAE',
    curriculum:
      CURRICULUM_LABELS[studentProfile.stream] || studentProfile.stream || 'UAE MoE General Stream',
    overall_average: Number(studentProfile.highSchoolAvg) || 0,
    preferred_location:
      EMIRATE_LABELS[studentProfile.emirate] || studentProfile.emirate || 'Dubai',
    selected_track: subLabel
      ? `${TRACK_LABELS[track] || track} — ${subLabel}`
      : TRACK_LABELS[track] || track,
    capture_roadmap: Boolean(options.captureRoadmap),
  };
}
