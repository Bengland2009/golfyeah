// Content for the "Plan d'entraînement" sub-section — a small, fixed
// library of practice sessions (same "bundled with the app, not
// user-editable" convention as lib/venues.js).
//
// Ground rule: Golfyeah never invents a session on the fly. Every session
// below is a validated structure; personalization only ever *adapts* that
// structure to the time available (adaptedBlocks, at the bottom) — it
// shrinks the same blocks proportionally, it never swaps in different
// content. If more time is available than a session's canonical length,
// the session is shown as-is (never padded with invented extra content).

export const LOCATIONS = [
  { id: 'range', label: 'Range extérieur' },
  { id: 'indoor-range', label: 'Golf intérieur — mode range' },
  { id: 'simulator-course', label: 'Simulateur — parcours' },
];

export const DURATIONS = [30, 60, 90];

// Every session must carry one of these — and the UI must never claim a
// session is "recommandée par des pros" unless its status actually says so.
// None of the starter sessions below claim VALIDATED_SOURCE or
// VALIDATED_COACH: their structure follows widely-taught range-practice
// concepts (progressive warm-up, block-then-random practice, on-course
// transfer), but Golfyeah has no specific cited source or coach behind
// them yet, so they honestly ship as PENDING until someone documents one.
export const VALIDATION = {
  VALIDATED_SOURCE: 'validated-source',
  VALIDATED_COACH: 'validated-coach',
  PENDING: 'pending',
  CUSTOM: 'custom',
};

export const VALIDATION_LABELS = {
  [VALIDATION.VALIDATED_SOURCE]: 'Validée par source reconnue',
  [VALIDATION.VALIDATED_COACH]: 'Validée par coach',
  [VALIDATION.PENDING]: 'À valider',
  [VALIDATION.CUSTOM]: 'Personnalisée',
};

// Same six fields after every session, regardless of type — one shared
// debrief instead of a different form per session, so filling it in never
// requires re-learning the screen.
export const TRAINING_NOTE_FIELDS = [
  { key: 'wentWell', label: 'Ce qui a bien été', type: 'text' },
  { key: 'wentPoorly', label: 'Ce qui a moins bien été', type: 'text' },
  { key: 'missPattern', label: 'Erreur dominante', type: 'select', options: ['Gauche', 'Droite', 'Top', 'Gratte'] },
  { key: 'bestClub', label: 'Bâton le plus fiable', type: 'text' },
  { key: 'worstClub', label: 'Bâton le moins fiable', type: 'text' },
  { key: 'nextPriority', label: 'Priorité pour la prochaine séance', type: 'text' },
];

// `blocks` is each session's one canonical, validated structure (sized to
// its longest listed duration). adaptedBlocks() is the only thing that
// ever changes what's shown for a shorter pick.
export const TRAINING_SESSIONS = [
  {
    id: 'contact',
    name: 'Contact',
    objective: 'Améliorer la qualité du contact.',
    principle: 'Échauffement progressif, puis répétition technique ciblée sur un seul point à la fois.',
    locations: ['range', 'indoor-range'],
    durations: [30, 60, 90],
    status: VALIDATION.PENDING,
    source: 'Basée sur des principes de pratique golf couramment enseignés (échauffement progressif, répétition ciblée). À documenter/valider par une source ou un coach.',
    blocks: [
      { title: 'Échauffement', minutes: 10, items: ['Wedge : petits swings', 'Monter progressivement jusqu’au swing complet', 'Chercher le contact, pas la distance'] },
      { title: 'Fer 7', minutes: 20, items: ['Choisir une cible précise', 'Faire une routine avant chaque balle', 'Points techniques : grip, posture, rotation, finish', 'Ne travailler qu’un seul point technique à la fois'] },
      { title: 'Fer 5 / Fer 6', minutes: 10, items: ['Même objectif : contact solide', 'Ne pas forcer'] },
      { title: 'Hybride / bois', minutes: 10, items: ['Chercher une trajectoire jouable'] },
      { title: 'Driver', minutes: 10, items: ['Cible = corridor de fairway', 'Priorité à la balle en jeu, pas à la distance'] },
    ],
  },
  {
    id: 'cibles',
    name: 'Cibles',
    objective: 'Développer la direction et une routine fiable.',
    principle: 'Pratique par cibles avec changement de bâton régulier, pour éviter l’automatisme.',
    locations: ['range', 'indoor-range'],
    durations: [30, 60, 90],
    status: VALIDATION.PENDING,
    source: 'Basée sur des principes de pratique golf couramment enseignés (pratique par blocs, cibles précises). À documenter/valider par une source ou un coach.',
    blocks: [
      { title: 'Échauffement', minutes: 10, items: ['Wedge + fer court'] },
      {
        title: 'Cibles', minutes: 40,
        items: [
          '5 balles par cible, puis changer de bâton.',
          'PW → environ 100 vg', 'Fer 8 → environ 120 vg', 'Fer 7 → environ 130 vg',
          'Fer 5 → environ 150 vg', 'Hybride → environ 165–175 vg', 'Driver → fairway imaginaire',
        ],
      },
      { title: 'Finition', minutes: 10, items: ['Terminer avec 5 balles au bâton le plus fiable de la séance', 'Nommer une seule priorité pour la prochaine fois'] },
    ],
  },
  {
    id: 'parcours-simule',
    name: 'Parcours simulé',
    objective: 'Faire le transfert vers le jeu réel.',
    principle: 'Simulation de parcours en pratique libre : enchaîner des coups différents, une seule tentative chacun, jamais le même coup deux fois.',
    locations: ['range', 'indoor-range'],
    durations: [30, 60, 90],
    status: VALIDATION.PENDING,
    source: 'Basée sur des principes de pratique golf couramment enseignés (transfert vers le jeu, pratique aléatoire). À documenter/valider par une source ou un coach.',
    blocks: [
      { title: 'Échauffement', minutes: 10, items: ['Quelques wedges pour sentir le contact avant de commencer'] },
      {
        title: 'Mode parcours', minutes: 40,
        items: ['Ne jamais jouer deux fois le même coup.', 'Exemple : Driver → Fer 7 → Wedge → Driver → Fer 5 → Wedge → Hybride → Fer 8', 'Choisir le bâton avant de regarder le résultat'],
      },
      { title: 'Bilan', minutes: 10, items: ['Compter les coups qui auraient été jouables sur un vrai trou', 'Noter le bâton le plus fiable du parcours simulé'] },
    ],
  },
  {
    id: 'neuf-trous',
    name: '9 trous sérieux',
    objective: 'Jouer comme sur un vrai terrain.',
    principle: 'Transfert complet en conditions de jeu réelles, sur simulateur, sans filet de sécurité.',
    locations: ['simulator-course'],
    durations: [60, 90],
    status: VALIDATION.PENDING,
    source: 'Basée sur des principes de pratique golf couramment enseignés (jeu à tentative unique, transfert en conditions réelles). À documenter/valider par une source ou un coach.',
    blocks: [
      { title: 'Règles', minutes: 10, items: ['Aucun mulligan', 'Pas de coup recommencé', 'Jouer avec mes vraies distances', 'Choisir le bâton avant de regarder le résultat', 'Ne pas chercher le coup parfait'] },
      { title: 'Sur le parcours', minutes: 70, items: ['Jouer autant de trous que le temps le permet, au rythme d’une vraie ronde', 'Compter les pénalités et les coups complètement ratés', 'Rester sur la décision prise avant chaque coup'] },
      { title: 'Bilan', minutes: 10, items: ['Score', 'Meilleur aspect de la ronde', 'Priorité pour la prochaine séance'] },
    ],
  },
];

export function sessionById(id) {
  return TRAINING_SESSIONS.find((s) => s.id === id) || null;
}

export function sessionsFor(locationId, duration) {
  return TRAINING_SESSIONS.filter((s) => s.locations.includes(locationId) && s.durations.includes(duration));
}

function fullLength(session) {
  return session.blocks.reduce((a, b) => a + b.minutes, 0);
}

// The only place a session's structure is ever touched: proportionally
// retimes the same blocks/items to fit less time. Never removes a block,
// never adds one, never edits an item's text — that would be inventing a
// new session, not adapting a validated one. When there's as much or more
// time than the canonical length, the structure is returned untouched.
export function adaptedBlocks(session, targetMinutes) {
  const full = fullLength(session);
  if (targetMinutes >= full) return session.blocks;
  const ratio = targetMinutes / full;
  return session.blocks.map((b) => ({ ...b, minutes: Math.max(5, Math.round((b.minutes * ratio) / 5) * 5) }));
}
