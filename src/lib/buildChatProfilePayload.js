import { normalizeSubjectMarks } from './normalizeSubjectMarks';
import { parseEnglishTestScore, formatEnglishTestLabel } from './englishProficiency';

const CURRICULUM_LABELS = {
  moe_general: 'UAE MoE General Stream',
  moe_advanced: 'UAE MoE Advanced Stream',
  british_alevels: 'British Curriculum (A-Levels)',
  american_diploma: 'American High School Diploma',
  cbse: 'CBSE (Indian Curriculum)',
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
  const stream = studentProfile.stream || 'moe_general';
  const rawMarks = studentProfile.subjectMarks || {};
  const normalized = normalizeSubjectMarks(stream, rawMarks);

  const englishTestType = studentProfile.englishTestType ?? '';
  const englishTestScore =
    studentProfile.englishTestScore != null
      ? studentProfile.englishTestScore
      : parseEnglishTestScore(englishTestType, studentProfile.englishTestScoreRaw);

  return {
    name: studentProfile.name?.trim() || 'Student',
    email: studentProfile.email?.trim() || '',
    nationality: studentProfile.nationality?.trim() || 'UAE',
    curriculum:
      CURRICULUM_LABELS[stream] || stream || 'UAE MoE General Stream',
    overall_average: Number(studentProfile.highSchoolAvg) || 0,
    preferred_location:
      EMIRATE_LABELS[studentProfile.emirate] || studentProfile.emirate || 'Dubai',
    selected_track: subLabel
      ? `${TRACK_LABELS[track] || track} — ${subLabel}`
      : TRACK_LABELS[track] || track,
    math_score: normalized.math,
    physics_score: normalized.physics,
    english_score: normalized.english,
    english_test_type: englishTestType ? formatEnglishTestLabel(englishTestType) : 'Not taken',
    english_test_score: englishTestScore,
    englishTestType,
    englishTestScore,
    capture_roadmap: Boolean(options.captureRoadmap),
  };
}
