// Content for the "Adresse & contact" reference sheet under Pratique — a
// small, fixed library (same "bundled with the app, not user-editable"
// convention as lib/venues.js and lib/trainingPlan.js). Two clubs are
// authored today (Driver, Fer 7); Bois/Hybride and Chip are named
// honestly as locked/coming-soon rather than shipped with placeholder
// content that could be mistaken for real guidance.

export const CLUBS = [
  { id: 'driver', label: 'Driver', locked: false },
  { id: 'bois-hybride', label: 'B/H', locked: true },
  { id: 'fer7', label: 'Fer 7', locked: false },
  { id: 'chip', label: 'Chip', locked: true },
];

export const TABS = [
  { id: 'adresse', label: 'Adresse' },
  { id: 'arc', label: 'Arc et contact' },
];

export const DEFAULT_CLUB = 'driver';
export const DEFAULT_TAB = 'adresse';

// Each club/tab pair pairs one diagram (see components/AddressDiagrams)
// with a short caption, a 3-point "À retenir" summary and 2-3 info cards
// — never more, per the "lecture rapide avant une pratique" goal.
// `keyPoints` and `info` restate the same facts at two reading speeds
// (a 2-second skim vs. a slightly slower scan) rather than adding new
// claims — the underlying technique content doesn't change.
// `footnote` is only set where a short aside genuinely helps (wedges vs.
// fer 7).
export const CONTENT = {
  driver: {
    adresse: {
      keyPoints: ['Balle près du talon avant', 'Épaule arrière plus basse', 'Pression légèrement vers l’arrière'],
      caption: 'Stance large, balle au talon avant, épaule arrière plus basse.',
      info: [
        { label: 'Balle', value: 'Près du talon avant' },
        { label: 'Épaules', value: 'Parallèles à la cible, arrière plus basse' },
        { label: 'Pression', value: '45 % avant / 55 % arrière' },
      ],
    },
    arc: {
      keyPoints: ['Point bas avant la balle', 'Contact légèrement remontant', 'Ne pas chercher à frapper vers le bas'],
      caption: 'Le point bas survient avant la balle — contact en légère montée.',
      info: [
        { label: 'Point bas', value: 'Avant la balle' },
        { label: 'Contact', value: 'Favorise un contact légèrement remontant' },
      ],
    },
  },
  fer7: {
    adresse: {
      keyPoints: ['Balle légèrement devant le centre', 'Épaules carrées', 'Pression légèrement vers l’avant'],
      caption: 'Stance largeur d’épaules, balle légèrement devant le centre, épaules carrées.',
      info: [
        { label: 'Balle', value: 'Légèrement devant le centre' },
        { label: 'Épaules', value: 'Carrées, peu inclinées' },
        { label: 'Pression', value: '52 % avant / 48 % arrière' },
      ],
    },
    arc: {
      keyPoints: ['Point bas après la balle', 'Contact descendant', 'Balle d’abord, puis divot'],
      caption: 'Le point bas survient après la balle — contact descendant, puis divot.',
      info: [
        { label: 'Point bas', value: 'Après la balle' },
        { label: 'Contact', value: 'Descendant — balle puis divot' },
      ],
      footnote: 'Wedges — même mécanique que le fer 7 : balle centrée (plutôt que légèrement devant), stance légèrement plus étroit.',
    },
  },
};

// The one-line Driver-vs-Fer comparison shown at the bottom of the page
// — the single biggest difference a beginner needs to walk away with.
export const QUICK_COMPARE = [
  { club: 'Driver', label: 'Balle avant · contact en remontant' },
  { club: 'Fer 7', label: 'Balle plus centrée · contact descendant' },
];

export function contentFor(club, tab) {
  return CONTENT[club]?.[tab] || null;
}
