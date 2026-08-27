// Content for the "Adresse & contact" reference sheet under Pratique — a
// small, fixed library (same "bundled with the app, not user-editable"
// convention as lib/venues.js and lib/trainingPlan.js). Driver, Fer 7,
// Bois and Hybride are authored today, each with both tabs. Chip is
// unlocked with only its "adresse" entry so far (a standard chip off a
// good lie) — its "arc" tab isn't built yet, and neither are the
// roulée/haute variants, so the UI shows a temporary "À venir" there
// rather than reusing another club's content.

export const CLUBS = [
  { id: 'driver', label: 'Driver', locked: false },
  { id: 'bois-hybride', label: 'B/H', locked: false },
  { id: 'fer7', label: 'Fer 7', locked: false },
  { id: 'chip', label: 'Chip', locked: false },
];

// B/H groups two sub-clubs behind one secondary toggle — Bois is the
// default. Only relevant when the active main club is 'bois-hybride'.
export const BH_SUBCLUBS = [
  { id: 'bois', label: 'Bois' },
  { id: 'hybride', label: 'Hybride' },
];
export const DEFAULT_BH_SUBCLUB = 'bois';

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
      footnote: { badge: 'Wedges', text: 'même mécanique que le fer 7 : balle centrée (plutôt que légèrement devant), stance légèrement plus étroit.' },
    },
  },
  bois: {
    adresse: {
      context: 'Depuis le gazon',
      keyPoints: ['Balle en avant', 'Corps presque centré', 'Balle puis brosse'],
      caption: 'Stance légèrement plus large que les épaules, balle dans une zone avancée à l’intérieur du talon avant.',
      info: [
        { label: 'Balle', value: 'Zone avancée, à l’intérieur du talon avant' },
        { label: 'Épaules', value: 'Parallèles à la cible, arrière légèrement plus basse' },
        { label: 'Pression', value: 'Presque 50/50, légère préférence arrière' },
      ],
      footnote: { badge: 'Info', text: '3-bois plus près du talon ; 5/7-bois légèrement plus vers le centre.' },
    },
    arc: {
      keyPoints: ['Arc large et rasant', 'Balle, puis le sol', 'Brosse légère après'],
      caption: 'Balayer signifie arriver peu profondément, pas frapper en remontant.',
      info: [
        { label: 'Arc', value: 'Large et peu profond' },
        { label: 'Contact', value: 'Balle puis légère brosse du gazon' },
        { label: 'Point bas', value: 'Légèrement après la balle' },
      ],
    },
  },
  hybride: {
    adresse: {
      context: 'Depuis le gazon',
      keyPoints: ['Un peu devant le centre', 'Corps centré', 'Petit divot après'],
      caption: 'Stance environ largeur d’épaules, balle dans une petite zone légèrement devant le centre.',
      info: [
        { label: 'Balle', value: '2 à 5 cm devant le centre' },
        { label: 'Épaules', value: 'Presque nivelées, torse centré' },
        { label: 'Pression', value: '50 % avant / 50 % arrière' },
      ],
    },
    arc: {
      keyPoints: ['Arc plus descendant', 'Balle, puis le sol', 'Petit divot après'],
      caption: 'Frappe l’hybride comme un fer, sans chercher à soulever la balle.',
      info: [
        { label: 'Arc', value: 'Plus compact et légèrement descendant' },
        { label: 'Contact', value: 'Balle puis petit divot' },
        { label: 'Point bas', value: 'Après la balle' },
      ],
    },
  },
  chip: {
    adresse: {
      context: 'Standard · bonne lie',
      keyPoints: ['Balle centre à légèrement devant', 'Stance étroit et ouvert', '60–70 % sur le pied avant'],
      caption: 'Stance étroit et légèrement ouvert, balle près du centre, pression sur l’avant.',
      info: [
        { label: 'Balle', value: 'Centre à légèrement devant' },
        { label: 'Corps', value: 'Sternum légèrement devant, épaules presque nivelées' },
        { label: 'Pression', value: '60–70 % sur le pied avant et y rester' },
      ],
      footnote: { badge: 'Référence', text: 'chip standard sur une bonne lie. Les variantes roulée et haute seront ajoutées plus tard.' },
    },
    arc: {
      context: 'Standard · bonne lie',
      keyPoints: ['Petit arc contrôlé', 'Semelle qui brosse le sol', 'Point bas juste après'],
      caption: 'Laisse la semelle brosser le sol; ne cherche pas à cueillir la balle.',
      info: [
        { label: 'Arc', value: 'Court et contrôlé' },
        { label: 'Contact', value: 'Semelle qui brosse le sol' },
        { label: 'Point bas', value: 'Sous ou légèrement après la balle' },
      ],
      footnote: { badge: 'Info', text: 'bras, épaules et poitrine bougent ensemble, avec une petite rotation vers la cible.' },
    },
  },
};

// The one-line quick-compare card at the bottom of the page — the single
// biggest difference a beginner needs to walk away with. Swapped for the
// B/H pair (title + rows) whenever B/H is the active main club, so the
// card never compares clubs that aren't on screen.
export const QUICK_COMPARE_TITLE = 'Driver vs Fer 7';
export const QUICK_COMPARE = [
  { club: 'Driver', label: 'Balle avant · contact en remontant' },
  { club: 'Fer 7', label: 'Balle plus centrée · contact descendant' },
];

export const QUICK_COMPARE_BH_TITLE = 'Bois vs Hybride';
export const QUICK_COMPARE_BH = [
  { club: 'Bois', label: 'Balle avancée · contact rasant' },
  { club: 'Hybride', label: 'Balle plus centrée · contact descendant' },
];

export function contentFor(club, tab) {
  return CONTENT[club]?.[tab] || null;
}
