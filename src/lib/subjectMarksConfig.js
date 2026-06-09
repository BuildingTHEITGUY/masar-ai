/** A-Level letter grades → normalized 0–100 for threshold comparison */
export const ALEVEL_GRADES = ['A*', 'A', 'B', 'C', 'D', 'E', 'U'];

export const ALEVEL_TO_PERCENT = {
  'A*': 95,
  A: 90,
  B: 80,
  C: 70,
  D: 60,
  E: 50,
  U: 0,
};

export const EMPTY_SUBJECT_MARKS = {
  math: '',
  english: '',
  physics: '',
};
