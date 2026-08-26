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
// with a short caption and 2-3 info cards — never more, per the "lecture
// rapide avant une pratique" goal. `footnote` is only set where a short
// aside genuinely helps (wedges vs. fer 7).
export const CONTENT = {
  driver: {
    adresse: {
      caption: 'Vue de face avec vue du dessus en médaillon — stance plus large que les épaules, balle au talon avant, pression 45 % avant / 55 % arrière, épaule arrière plus basse.',
      info: [
        { label: 'Balle', value: 'Près du talon avant' },
        { label: 'Épaules', value: 'Parallèles à la cible, arrière plus basse' },
        { label: 'Pression', value: '45 % avant / 55 % arrière' },
      ],
    },
    arc: {
      caption: 'Le point bas survient avant la balle : contact favorisé en légère montée.',
      info: [
        { label: 'Point bas', value: 'Avant la balle' },
        { label: 'Contact', value: 'Favorise un contact légèrement remontant' },
      ],
    },
  },
  fer7: {
    adresse: {
      caption: 'Vue de face avec vue du dessus en médaillon — stance largeur d’épaules, balle légèrement devant le centre, pression 52 % avant / 48 % arrière, épaules carrées.',
      info: [
        { label: 'Balle', value: 'Légèrement devant le centre' },
        { label: 'Épaules', value: 'Carrées, peu inclinées' },
        { label: 'Pression', value: '52 % avant / 48 % arrière' },
      ],
    },
    arc: {
      caption: 'Le point bas survient après la balle : contact descendant, puis divot.',
      info: [
        { label: 'Point bas', value: 'Après la balle' },
        { label: 'Contact', value: 'Descendant — balle puis divot' },
      ],
      footnote: 'Wedges — même mécanique que le fer 7 : balle centrée (plutôt que légèrement devant), stance légèrement plus étroit.',
    },
  },
};

export function contentFor(club, tab) {
  return CONTENT[club]?.[tab] || null;
}
