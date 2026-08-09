// Generic carry-distance starting points (yards), keyed by the same club
// names as CLUB_ORDER/DEFAULT_MY_CLUBS in seed.js — a golfer replaces these
// with real numbers simply by logging Range sessions for that club; no
// separate "personal distance" data model needed.
export const REFERENCE_DISTANCES = {
  Driver: 210,
  'Bois 3': 195,
  'Bois 5': 180,
  'Hybride 3': 175,
  'Hybride 4': 165,
  'Fer 4': 160,
  'Fer 5': 150,
  'Fer 6': 140,
  'Fer 7': 130,
  'Fer 8': 120,
  'Fer 9': 110,
  PW: 100,
  GW: 85,
  SW: 70,
  LW: 55,
};

// Long-form labels for the wedges only — everything else (Driver, Bois 3,
// Fer 7…) already reads naturally as-is.
const CLUB_LABELS = {
  PW: 'Pitching Wedge',
  GW: 'Gap Wedge (50–52°)',
  SW: 'Sand Wedge (54–56°)',
  LW: 'Lob Wedge (58–60°)',
};

export function clubLabel(club) {
  return CLUB_LABELS[club] || club;
}
