// Mock/demo data — used only by the local (no-Firebase) backend, kept
// separate from the real data layer and scoring logic.

export const CLUB_ORDER = ['Driver', 'Bois 3', 'Bois 5', 'Hybride 3', 'Hybride 4', 'Fer 4', 'Fer 5', 'Fer 6', 'Fer 7', 'Fer 8', 'Fer 9', 'PW', 'GW', 'SW', 'LW'];
export const DEFAULT_MY_CLUBS = ['Driver', 'Bois 3', 'Fer 5', 'Fer 7', 'Fer 9', 'PW'];

export const SEED_PLAYERS = [
  { id: 'benoit', name: 'Benoit', photoUrl: null },
  { id: 'sam', name: 'Sam', photoUrl: null },
  { id: 'frank', name: 'Frank', photoUrl: null },
];

export const SEED_COURSE = {
  id: 'vallee',
  name: 'Golf de la Vallée',
  city: 'Saint-Sauveur, QC',
  kind: 'exterieur',
  holes: 18,
  pars: [4, 3, 5, 4, 4, 3, 5, 4, 4, 4, 3, 5, 4, 4, 3, 5, 4, 4],
  yardages: [387, 162, 512, 401, 375, 178, 545, 392, 410, 398, 155, 528, 384, 372, 168, 538, 405, 415],
};

export function seedRounds() {
  return [
    {
      id: 'r1', courseId: 'vallee', date: '3 août 2026', holes: 18, season: 2026,
      status: 'completed', playerIds: ['benoit', 'sam', 'frank'],
      totals: { benoit: 79, sam: 76, frank: 84 },
      mulligans: { benoit: 2, sam: 1, frank: 3 },
      lostBalls: { benoit: 1, sam: 0, frank: 2 },
      beers: { benoit: 3, sam: 2, frank: 4 },
    },
    {
      id: 'r2', courseId: 'vallee', date: '27 juillet 2026', holes: 18, season: 2026,
      status: 'completed', playerIds: ['benoit', 'sam', 'frank'],
      totals: { benoit: 81, sam: 79, frank: 88 },
      mulligans: { benoit: 1, sam: 2, frank: 4 },
      lostBalls: { benoit: 0, sam: 1, frank: 3 },
      beers: { benoit: 2, sam: 3, frank: 5 },
    },
  ];
}

export function seedRange() {
  return [
    { id: 'g1', playerId: 'benoit', club: 'Driver', date: '7 août 2026', avg: 238, balls: 10 },
    { id: 'g2', playerId: 'benoit', club: 'Driver', date: '28 juillet 2026', avg: 232, balls: 12 },
    { id: 'g3', playerId: 'benoit', club: 'Bois 3', date: '7 août 2026', avg: 215, balls: 10 },
    { id: 'g4', playerId: 'benoit', club: 'Fer 5', date: '28 juillet 2026', avg: 185, balls: 10 },
    { id: 'g5', playerId: 'benoit', club: 'Fer 7', date: '7 août 2026', avg: 154, balls: 10 },
    { id: 'g6', playerId: 'benoit', club: 'Fer 7', date: '28 juillet 2026', avg: 162, balls: 12 },
    { id: 'g7', playerId: 'benoit', club: 'Fer 9', date: '28 juillet 2026', avg: 135, balls: 10 },
    { id: 'g8', playerId: 'benoit', club: 'PW', date: '28 juillet 2026', avg: 118, balls: 10 },
  ];
}
