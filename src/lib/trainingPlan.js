// Content for the "Plan d'entraînement" sub-section — a small, fixed
// library of practice sessions (same "bundled with the app, not
// user-editable" convention as lib/venues.js).
//
// Ground rule: Golfyeah never invents a session on the fly. Every session
// below is a validated structure, authored directly for each format it
// supports (see FORMATS/stepsByFormat) rather than computed by shrinking
// one canonical version — a short session isn't a proportionally
// squeezed long one, it's its own deliberately-scoped structure.
//
// Duration is not the point of a practice session — attention, structure,
// a clear target, a routine, a measurable test and end-of-session notes
// are what actually matter. So the picker is a *format* (Express/
// Standard/Longue), not a bare minute count, and 90 minutes is
// deliberately not offered for normal range practice: it invites
// unfocused ball-mashing rather than a real practice block. A player with
// 90 minutes is better served playing 9 holes on the simulator, or (later)
// an advanced session combining multiple practice zones.
//
// Place/mode model: "where you practice" has exactly two answers — a real
// range or a simulator. A simulator additionally has a mode (range-style
// practice vs. playing an actual round), because that's what actually
// determines which sessions make sense — not a third flat "location".

export const PLACES = [
  { id: 'range', label: 'Range extérieur' },
  { id: 'simulator', label: 'Simulateur' },
];

// Only asked when place === 'simulator'.
export const SIM_MODES = [
  { id: 'sim-range', label: 'Mode range' },
  { id: 'sim-course', label: 'Mode parcours' },
];

// Practice-session format, for range or simulator "mode range" sessions.
// Each format is its own authored structure (see TRAINING_SESSIONS'
// stepsByFormat), not a proportional shrink of a longer one. Minutes are
// shown for orientation, but the format name is the primary label — this
// is a choice of session shape, not a timer.
export const FORMATS = [
  { id: 'express', label: 'Express', minutes: 20 },
  { id: 'standard', label: 'Standard', minutes: 30 },
  { id: 'longue', label: 'Longue', minutes: 45 },
];

export const DEFAULT_FORMAT_ID = 'standard';

export function formatById(id) {
  return FORMATS.find((f) => f.id === id) || null;
}

// Mode parcours isn't timed practice, it's played in holes — so it gets
// its own picker instead of a duration/format. 18 trous is named here
// honestly as not-yet-available rather than silently omitted, since
// Golfyeah has no validated 18-hole content yet.
export const ROUND_LENGTHS = [
  { id: 9, label: '9 trous sérieux' },
  { id: 18, label: '18 trous', comingSoon: true },
];

export const DEFAULT_ROUND_LENGTH = 9;

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

// Same fields after every session, regardless of type — one shared
// debrief instead of a different form per session, so filling it in never
// requires re-learning the screen. goodContacts, corridorBalls,
// contactGeneral and playableBalls are also the only data points the
// progression system below can actually check against a level's pass
// criterion — see LEVELS.
export const TRAINING_NOTE_FIELDS = [
  { key: 'goodContacts', label: 'Bons contacts au fer 7', type: 'number', suffix: '/10' },
  { key: 'corridorBalls', label: 'Balles dans le corridor', type: 'number', suffix: '/10' },
  { key: 'contactGeneral', label: 'Contact général', type: 'number', suffix: '/10' },
  { key: 'playableBalls', label: 'Drives jouables', type: 'number', suffix: '/10' },
  { key: 'missPattern', label: 'Erreur dominante', type: 'select', options: ['Gauche', 'Droite', 'Top', 'Gratte'] },
  { key: 'bestClub', label: 'Bâton le plus fiable', type: 'text' },
  { key: 'worstClub', label: 'Bâton le moins fiable', type: 'text' },
  { key: 'nextPriority', label: 'Priorité pour la prochaine séance', type: 'text' },
];

// Only shown for the "Jeu réel" family of sessions (see
// REAL_ROUND_SESSION_IDS) — these four are exactly what the Jeu réel
// pass criterion checks, so unlike the shared fields above they only
// appear when they're actually meaningful to fill in.
export const REAL_ROUND_SESSION_IDS = ['parcours-imaginaire', 'neuf-trous', 'gestion-de-partie'];

export const REAL_ROUND_NOTE_FIELDS = [
  { key: 'completedNineHoles', label: '9 trous complétés', type: 'boolean' },
  { key: 'mulligansUsed', label: 'Mulligans utilisés', type: 'number' },
  { key: 'restartedShots', label: 'Coups recommencés', type: 'number' },
  { key: 'sessionNotesCompleted', label: 'Notes de ronde honnêtes', type: 'boolean' },
];

export function noteFieldsFor(sessionId) {
  return REAL_ROUND_SESSION_IDS.includes(sessionId)
    ? [...TRAINING_NOTE_FIELDS, ...REAL_ROUND_NOTE_FIELDS]
    : TRAINING_NOTE_FIELDS;
}

// `places` is which top-level place(s) a session fits; `modes` only
// matters when 'simulator' is in `places` — it says which simulator
// mode(s) it needs.
//
// Range / mode-range sessions carry `stepsByFormat`: a fully authored
// step list per FORMATS id (express/standard/longue) — each step is a
// guided instruction sheet, not a description: title, how long, which
// club, how many balls, what to do, what to observe. A shorter format is
// its own deliberately-scoped structure, not the long one shrunk down.
//
// Mode-parcours sessions (played in holes, not minutes) carry a single
// `steps` list instead, and `roundLengths` says which ROUND_LENGTHS
// they're authored for.
//
// `previewNoteKeys` picks which 2 debrief fields surface as the card's
// "À noter" preview.
export const TRAINING_SESSIONS = [
  {
    id: 'contact',
    name: 'Contact solide',
    objective: 'Améliorer la qualité du contact.',
    principle: 'Échauffement progressif, puis répétition technique ciblée sur un seul point à la fois.',
    places: ['range', 'simulator'],
    modes: ['sim-range'],
    status: VALIDATION.PENDING,
    source: 'Basée sur des principes de pratique golf couramment enseignés (échauffement progressif, répétition ciblée). À documenter/valider par une source ou un coach.',
    previewNoteKeys: ['goodContacts', 'playableBalls'],
    stepsByFormat: {
      express: [
        {
          title: 'Échauffement', durationMinutes: 3, club: 'Wedge', ballCount: null, cardHint: 'tranquilles',
          instructions: ['Petits swings', 'Rythme tranquille', 'Chercher le contact, pas la distance'],
        },
        {
          title: 'Fer 7', durationMinutes: 12, club: 'Fer 7', ballCount: 12, cardHint: 'vers une cible',
          instructions: ['Choisir une cible', 'Faire une routine avant chaque balle', 'Frapper 12 balles', 'Ne travailler qu’un seul point technique'],
          observe: ['Contact propre', 'Direction de départ'],
        },
        {
          title: 'Driver jouable', durationMinutes: 3, club: 'Driver', ballCount: 5, cardHint: 'jouables',
          instructions: ['Viser un corridor de fairway', 'Noter combien de balles seraient jouables'],
          observe: ['Balles jouables sur 5'],
        },
      ],
      standard: [
        {
          title: 'Échauffement', durationMinutes: 5, club: 'Wedge', ballCount: null, cardHint: 'tranquilles',
          instructions: ['Petits swings', 'Rythme tranquille', 'Chercher le contact, pas la distance'],
        },
        {
          title: 'Fer 7', durationMinutes: 15, club: 'Fer 7', ballCount: 20, cardHint: 'vers une cible',
          instructions: ['Choisir une cible', 'Faire une routine avant chaque balle', 'Frapper 20 balles', 'Ne travailler qu’un seul point technique'],
          observe: ['Contact propre', 'Direction de départ', 'Balles complètement ratées'],
        },
        {
          title: 'Driver jouable', durationMinutes: 7, club: 'Driver', ballCount: 10, cardHint: 'jouables',
          instructions: ['Viser un corridor de fairway', 'Ne pas chercher la distance maximale', 'Noter combien de balles seraient jouables'],
          observe: ['Balles jouables sur 10'],
        },
      ],
      longue: [
        {
          title: 'Échauffement', durationMinutes: 8, club: 'Wedge', ballCount: null, cardHint: 'tranquilles',
          instructions: ['Petits swings', 'Rythme tranquille', 'Chercher le contact, pas la distance'],
        },
        {
          title: 'Fer 7', durationMinutes: 15, club: 'Fer 7', ballCount: 20, cardHint: 'vers une cible',
          instructions: ['Choisir une cible', 'Faire une routine avant chaque balle', 'Frapper 20 balles', 'Ne travailler qu’un seul point technique'],
          observe: ['Contact propre', 'Direction de départ', 'Balles complètement ratées'],
        },
        {
          title: 'Fer 5 / Fer 6', durationMinutes: 7, club: 'Fer 5/6', ballCount: 10, cardHint: null,
          instructions: ['Même objectif : contact solide', 'Ne pas forcer'],
        },
        {
          title: 'Driver jouable', durationMinutes: 10, club: 'Driver', ballCount: 12, cardHint: 'jouables',
          instructions: ['Viser un corridor de fairway', 'Ne pas chercher la distance maximale', 'Noter combien de balles seraient jouables'],
          observe: ['Balles jouables sur 12'],
        },
      ],
    },
  },
  {
    id: 'cibles',
    name: 'Cibles et direction',
    objective: 'Développer la direction et une routine fiable.',
    principle: 'Pratique par cibles avec changement de bâton régulier, pour éviter l’automatisme.',
    places: ['range', 'simulator'],
    modes: ['sim-range'],
    // Every format below rotates through at least 3 clubs — this is the
    // template-level confirmation that a completed log of this session
    // really was a mixed-club attempt, used by LEVELS' Répétition
    // criterion (Option A, no extra field needed).
    mixedClub: true,
    status: VALIDATION.PENDING,
    source: 'Basée sur des principes de pratique golf couramment enseignés (pratique par blocs, cibles précises). À documenter/valider par une source ou un coach.',
    previewNoteKeys: ['corridorBalls', 'missPattern'],
    stepsByFormat: {
      express: [
        {
          title: 'Échauffement', durationMinutes: 3, club: 'Wedge + fer court', ballCount: null, cardHint: 'tranquilles',
          instructions: ['Petits swings', 'Chercher le contact avant la cible'],
        },
        {
          title: 'Cibles — PW', durationMinutes: 4, club: 'PW', ballCount: 4, cardHint: '≈ 100 vg',
          instructions: ['Choisir une cible', 'Frapper 4 balles puis changer de bâton'],
          observe: ['Balles dans le corridor visé'],
        },
        {
          title: 'Cibles — Fer 7', durationMinutes: 4, club: 'Fer 7', ballCount: 4, cardHint: '≈ 130 vg',
          instructions: ['Même cible, même routine', 'Frapper 4 balles puis changer de bâton'],
          observe: ['Balles dans le corridor visé'],
        },
        {
          title: 'Cibles — Driver', durationMinutes: 4, club: 'Driver', ballCount: 4, cardHint: 'fairway imaginaire',
          instructions: ['Cible = fairway imaginaire', 'Frapper 4 balles'],
          observe: ['Balles dans le corridor visé'],
        },
        {
          title: 'Test corridor', durationMinutes: 3, club: 'Fer 7', ballCount: 5, cardHint: 'sous pression',
          instructions: ['5 balles au fer 7, une seule tentative chacune', 'Viser précisément le corridor'],
          observe: ['Balles dans le corridor visé sur 5'],
        },
      ],
      standard: [
        {
          title: 'Échauffement', durationMinutes: 5, club: 'Wedge + fer court', ballCount: null, cardHint: 'tranquilles',
          instructions: ['Petits swings', 'Chercher le contact avant la cible'],
        },
        {
          title: 'Cibles — PW', durationMinutes: 5, club: 'PW', ballCount: 5, cardHint: '≈ 100 vg',
          instructions: ['Choisir une cible', 'Frapper 5 balles puis changer de bâton'],
          observe: ['Balles dans le corridor visé'],
        },
        {
          title: 'Cibles — Fer 7', durationMinutes: 5, club: 'Fer 7', ballCount: 5, cardHint: '≈ 130 vg',
          instructions: ['Même cible, même routine', 'Frapper 5 balles puis changer de bâton'],
          observe: ['Balles dans le corridor visé'],
        },
        {
          title: 'Cibles — Driver', durationMinutes: 5, club: 'Driver', ballCount: 5, cardHint: 'fairway imaginaire',
          instructions: ['Cible = fairway imaginaire', 'Frapper 5 balles'],
          observe: ['Balles dans le corridor visé'],
        },
        {
          title: 'Test corridor', durationMinutes: 7, club: 'Fer 7', ballCount: 10, cardHint: 'sous pression',
          instructions: ['10 balles au fer 7, une seule tentative chacune', 'Viser précisément le corridor'],
          observe: ['Balles dans le corridor visé sur 10'],
        },
      ],
      longue: [
        {
          title: 'Échauffement', durationMinutes: 8, club: 'Wedge + fer court', ballCount: null, cardHint: 'tranquilles',
          instructions: ['Petits swings', 'Chercher le contact avant la cible'],
        },
        {
          title: 'Cibles — PW', durationMinutes: 5, club: 'PW', ballCount: 5, cardHint: '≈ 100 vg',
          instructions: ['Choisir une cible', 'Frapper 5 balles puis changer de bâton'],
          observe: ['Balles dans le corridor visé'],
        },
        {
          title: 'Cibles — Fer 8', durationMinutes: 5, club: 'Fer 8', ballCount: 5, cardHint: '≈ 120 vg',
          instructions: ['Même cible, même routine', 'Frapper 5 balles puis changer de bâton'],
          observe: ['Balles dans le corridor visé'],
        },
        {
          title: 'Cibles — Fer 7', durationMinutes: 6, club: 'Fer 7', ballCount: 6, cardHint: '≈ 130 vg',
          instructions: ['Même cible, même routine', 'Frapper 6 balles puis changer de bâton'],
          observe: ['Balles dans le corridor visé'],
        },
        {
          title: 'Cibles — Driver', durationMinutes: 6, club: 'Driver', ballCount: 6, cardHint: 'fairway imaginaire',
          instructions: ['Cible = fairway imaginaire', 'Frapper 6 balles'],
          observe: ['Balles dans le corridor visé'],
        },
        {
          title: 'Test corridor', durationMinutes: 10, club: 'Fer 7', ballCount: 12, cardHint: 'sous pression',
          instructions: ['12 balles au fer 7, une seule tentative chacune', 'Viser précisément le corridor'],
          observe: ['Balles dans le corridor visé sur 12'],
        },
      ],
    },
  },
  {
    id: 'driver-jouable',
    name: 'Driver jouable',
    objective: 'Retrouver un driver fiable et une balle en jeu.',
    principle: 'Répétition ciblée du même point technique, priorité donnée à la balle jouable plutôt qu’à la distance.',
    places: ['range', 'simulator'],
    modes: ['sim-range'],
    status: VALIDATION.PENDING,
    source: 'Basée sur des principes de pratique golf couramment enseignés (répétition ciblée, priorité au résultat jouable). À documenter/valider par une source ou un coach.',
    previewNoteKeys: ['playableBalls', 'missPattern'],
    stepsByFormat: {
      express: [
        {
          title: 'Échauffement', durationMinutes: 3, club: 'Wedge / fers courts', ballCount: null, cardHint: 'pour sentir le contact',
          instructions: ['Petits swings', 'Chercher le contact avant la trajectoire'],
        },
        {
          title: 'Trajectoire', durationMinutes: 12, club: 'Driver', ballCount: null, cardHint: null,
          instructions: ['Cible = corridor de fairway', 'Priorité à la balle en jeu, pas à la distance', 'Une routine avant chaque balle'],
        },
        {
          title: 'Test jouable', durationMinutes: 3, club: 'Driver', ballCount: 5, cardHint: 'jouables',
          instructions: ['Répéter le même point technique sur 5 balles', 'Ne pas changer de correctif en cours de route'],
          observe: ['Balles jouables sur 5'],
        },
      ],
      standard: [
        {
          title: 'Échauffement', durationMinutes: 5, club: 'Wedge / fers courts', ballCount: null, cardHint: 'pour sentir le contact',
          instructions: ['Petits swings', 'Chercher le contact avant la trajectoire'],
        },
        {
          title: 'Trajectoire', durationMinutes: 15, club: 'Driver', ballCount: null, cardHint: null,
          instructions: ['Cible = corridor de fairway', 'Priorité à la balle en jeu, pas à la distance', 'Une routine avant chaque balle'],
        },
        {
          title: 'Test jouable', durationMinutes: 7, club: 'Driver', ballCount: 10, cardHint: 'jouables',
          instructions: ['Répéter le même point technique sur 10 balles', 'Ne pas changer de correctif en cours de route'],
          observe: ['Balles jouables sur 10'],
        },
      ],
      longue: [
        {
          title: 'Échauffement', durationMinutes: 8, club: 'Wedge / fers courts', ballCount: null, cardHint: 'pour sentir le contact',
          instructions: ['Petits swings', 'Chercher le contact avant la trajectoire'],
        },
        {
          title: 'Trajectoire', durationMinutes: 22, club: 'Driver', ballCount: null, cardHint: null,
          instructions: ['Cible = corridor de fairway', 'Priorité à la balle en jeu, pas à la distance', 'Une routine avant chaque balle'],
        },
        {
          title: 'Test jouable', durationMinutes: 10, club: 'Driver', ballCount: 15, cardHint: 'jouables',
          instructions: ['Répéter le même point technique sur 15 balles', 'Ne pas changer de correctif en cours de route'],
          observe: ['Balles jouables sur 15'],
        },
      ],
    },
  },
  {
    id: 'parcours-imaginaire',
    name: 'Parcours imaginaire au range',
    objective: 'Faire le transfert vers le jeu réel, au range.',
    principle: 'Simulation de parcours en pratique libre : enchaîner des coups différents, une seule tentative chacun, jamais le même coup deux fois.',
    places: ['range'],
    modes: [],
    status: VALIDATION.PENDING,
    source: 'Basée sur des principes de pratique golf couramment enseignés (transfert vers le jeu, pratique aléatoire). À documenter/valider par une source ou un coach.',
    previewNoteKeys: ['playableBalls', 'bestClub'],
    stepsByFormat: {
      express: [
        {
          title: 'Échauffement', durationMinutes: 3, club: 'Wedge', ballCount: null, cardHint: 'pour sentir le contact',
          instructions: ['Quelques wedges avant de commencer'],
        },
        {
          title: 'Mode parcours', durationMinutes: 12, club: 'Variés', ballCount: null, cardHint: 'jamais le même coup deux fois',
          instructions: ['Ne jamais jouer deux fois le même coup', 'Exemple : Driver → Fer 7 → Wedge → Fer 5 → Wedge', 'Choisir le bâton avant de regarder le résultat'],
          observe: ['Coups qui auraient été jouables sur un vrai trou'],
        },
        {
          title: 'Bilan', durationMinutes: 3, club: null, ballCount: null, cardHint: null,
          instructions: ['Compter les coups qui auraient été jouables sur un vrai trou', 'Noter le bâton le plus fiable du parcours imaginaire'],
        },
      ],
      standard: [
        {
          title: 'Échauffement', durationMinutes: 5, club: 'Wedge', ballCount: null, cardHint: 'pour sentir le contact',
          instructions: ['Quelques wedges avant de commencer'],
        },
        {
          title: 'Mode parcours', durationMinutes: 15, club: 'Variés', ballCount: null, cardHint: 'jamais le même coup deux fois',
          instructions: ['Ne jamais jouer deux fois le même coup', 'Exemple : Driver → Fer 7 → Wedge → Driver → Fer 5 → Wedge → Hybride → Fer 8', 'Choisir le bâton avant de regarder le résultat'],
          observe: ['Coups qui auraient été jouables sur un vrai trou'],
        },
        {
          title: 'Bilan', durationMinutes: 7, club: null, ballCount: null, cardHint: null,
          instructions: ['Compter les coups qui auraient été jouables sur un vrai trou', 'Noter le bâton le plus fiable du parcours imaginaire'],
        },
      ],
      longue: [
        {
          title: 'Échauffement', durationMinutes: 8, club: 'Wedge', ballCount: null, cardHint: 'pour sentir le contact',
          instructions: ['Quelques wedges avant de commencer'],
        },
        {
          title: 'Mode parcours', durationMinutes: 22, club: 'Variés', ballCount: null, cardHint: 'jamais le même coup deux fois',
          instructions: ['Ne jamais jouer deux fois le même coup', 'Exemple : Driver → Fer 7 → Wedge → Driver → Fer 5 → Wedge → Hybride → Fer 8', 'Choisir le bâton avant de regarder le résultat'],
          observe: ['Coups qui auraient été jouables sur un vrai trou'],
        },
        {
          title: 'Bilan', durationMinutes: 10, club: null, ballCount: null, cardHint: null,
          instructions: ['Compter les coups qui auraient été jouables sur un vrai trou', 'Noter le bâton le plus fiable du parcours imaginaire'],
        },
      ],
    },
  },
  {
    id: 'distances-carry',
    name: 'Distances carry',
    objective: 'Connaître ses vraies distances de carry, bâton par bâton.',
    principle: 'Mesure répétée par bâton à l’aide des données du simulateur, sans corriger le geste en cours de série.',
    places: ['simulator'],
    modes: ['sim-range'],
    status: VALIDATION.PENDING,
    source: 'Basée sur des principes de pratique golf couramment enseignés (mesure répétée, données objectives). À documenter/valider par une source ou un coach.',
    previewNoteKeys: ['bestClub', 'worstClub'],
    stepsByFormat: {
      express: [
        {
          title: 'Échauffement', durationMinutes: 3, club: 'Wedge', ballCount: null, cardHint: null,
          instructions: ['Quelques wedges avant de commencer les mesures'],
        },
        {
          title: 'Mesures par bâton', durationMinutes: 12, club: 'Tous les bâtons', ballCount: 5, cardHint: 'par bâton',
          instructions: ['3 à 5 balles par bâton, du plus court au plus long', 'Noter le carry moyen affiché, pas le meilleur coup', 'Ignorer les balles clairement ratées'],
          observe: ['Carry moyen par bâton'],
        },
        {
          title: 'Bilan', durationMinutes: 3, club: null, ballCount: null, cardHint: null,
          instructions: ['Mettre à jour mes distances dans Mes distances', 'Identifier le bâton le plus irrégulier'],
        },
      ],
      standard: [
        {
          title: 'Échauffement', durationMinutes: 5, club: 'Wedge', ballCount: null, cardHint: null,
          instructions: ['Quelques wedges avant de commencer les mesures'],
        },
        {
          title: 'Mesures par bâton', durationMinutes: 15, club: 'Tous les bâtons', ballCount: 8, cardHint: 'par bâton',
          instructions: ['5 à 8 balles par bâton, du plus court au plus long', 'Noter le carry moyen affiché, pas le meilleur coup', 'Ignorer les balles clairement ratées'],
          observe: ['Carry moyen par bâton'],
        },
        {
          title: 'Bilan', durationMinutes: 7, club: null, ballCount: null, cardHint: null,
          instructions: ['Mettre à jour mes distances dans Mes distances', 'Identifier le bâton le plus irrégulier'],
        },
      ],
      longue: [
        {
          title: 'Échauffement', durationMinutes: 8, club: 'Wedge', ballCount: null, cardHint: null,
          instructions: ['Quelques wedges avant de commencer les mesures'],
        },
        {
          title: 'Mesures par bâton', durationMinutes: 22, club: 'Tous les bâtons', ballCount: 10, cardHint: 'par bâton',
          instructions: ['5 à 10 balles par bâton, du plus court au plus long', 'Noter le carry moyen affiché, pas le meilleur coup', 'Ignorer les balles clairement ratées'],
          observe: ['Carry moyen par bâton'],
        },
        {
          title: 'Bilan', durationMinutes: 10, club: null, ballCount: null, cardHint: null,
          instructions: ['Mettre à jour mes distances dans Mes distances', 'Identifier le bâton le plus irrégulier'],
        },
      ],
    },
  },
  {
    id: 'dispersion',
    name: 'Dispersion gauche/droite',
    objective: 'Voir où partent vraiment mes balles, pas où je pense qu’elles partent.',
    principle: 'Observation de la dispersion latérale affichée par le simulateur, par bâton, sans essayer de la corriger pendant la série.',
    places: ['simulator'],
    modes: ['sim-range'],
    status: VALIDATION.PENDING,
    source: 'Basée sur des principes de pratique golf couramment enseignés (observation neutre, données objectives). À documenter/valider par une source ou un coach.',
    previewNoteKeys: ['missPattern', 'worstClub'],
    stepsByFormat: {
      express: [
        {
          title: 'Échauffement', durationMinutes: 3, club: 'Wedge', ballCount: null, cardHint: 'pour se mettre en route',
          instructions: ['Quelques balles pour se mettre en route'],
        },
        {
          title: 'Série par bâton', durationMinutes: 12, club: 'Tous les bâtons', ballCount: 6, cardHint: 'par bâton',
          instructions: ['6 à 8 balles par bâton sans changer de cible', 'Regarder la dispersion affichée après la série, pas balle par balle'],
          observe: ['Côté qui revient le plus souvent'],
        },
        {
          title: 'Bilan', durationMinutes: 3, club: null, ballCount: null, cardHint: null,
          instructions: ['Nommer le bâton le plus dispersé', 'Une seule priorité pour la prochaine séance'],
        },
      ],
      standard: [
        {
          title: 'Échauffement', durationMinutes: 5, club: 'Wedge', ballCount: null, cardHint: 'pour se mettre en route',
          instructions: ['Quelques balles pour se mettre en route'],
        },
        {
          title: 'Série par bâton', durationMinutes: 15, club: 'Tous les bâtons', ballCount: 10, cardHint: 'par bâton',
          instructions: ['8 à 10 balles par bâton sans changer de cible', 'Regarder la dispersion affichée après la série, pas balle par balle'],
          observe: ['Côté qui revient le plus souvent'],
        },
        {
          title: 'Bilan', durationMinutes: 7, club: null, ballCount: null, cardHint: null,
          instructions: ['Nommer le bâton le plus dispersé', 'Une seule priorité pour la prochaine séance'],
        },
      ],
      longue: [
        {
          title: 'Échauffement', durationMinutes: 8, club: 'Wedge', ballCount: null, cardHint: 'pour se mettre en route',
          instructions: ['Quelques balles pour se mettre en route'],
        },
        {
          title: 'Série par bâton', durationMinutes: 22, club: 'Tous les bâtons', ballCount: 12, cardHint: 'par bâton',
          instructions: ['8 à 12 balles par bâton sans changer de cible', 'Regarder la dispersion affichée après la série, pas balle par balle'],
          observe: ['Côté qui revient le plus souvent'],
        },
        {
          title: 'Bilan', durationMinutes: 10, club: null, ballCount: null, cardHint: null,
          instructions: ['Nommer le bâton le plus dispersé', 'Une seule priorité pour la prochaine séance'],
        },
      ],
    },
  },
  {
    id: 'neuf-trous',
    name: '9 trous sérieux',
    objective: 'Jouer comme sur un vrai terrain.',
    principle: 'Transfert complet en conditions de jeu réelles, sur simulateur, sans filet de sécurité.',
    places: ['simulator'],
    modes: ['sim-course'],
    roundLengths: [9],
    status: VALIDATION.PENDING,
    source: 'Basée sur des principes de pratique golf couramment enseignés (jeu à tentative unique, transfert en conditions réelles). À documenter/valider par une source ou un coach.',
    previewNoteKeys: ['completedNineHoles', 'nextPriority'],
    steps: [
      {
        title: 'Règles', durationMinutes: 10, club: null, ballCount: null, cardHint: null,
        instructions: ['Aucun mulligan', 'Pas de coup recommencé', 'Jouer avec mes vraies distances', 'Choisir le bâton avant de regarder le résultat', 'Ne pas chercher le coup parfait'],
      },
      {
        title: 'Sur le parcours', durationMinutes: 70, club: 'Tous les bâtons', ballCount: null, cardHint: null,
        instructions: ['Jouer les 9 trous au rythme d’une vraie ronde', 'Rester sur la décision prise avant chaque coup'],
        observe: ['Pénalités et coups complètement ratés'],
      },
      {
        title: 'Bilan', durationMinutes: 10, club: null, ballCount: null, cardHint: null,
        instructions: ['Noter le score', 'Meilleur aspect de la ronde', 'Priorité pour la prochaine séance'],
      },
    ],
  },
  {
    id: 'gestion-de-partie',
    name: 'Gestion de partie',
    objective: 'Jouer intelligemment plutôt que de viser le coup parfait.',
    principle: 'Prise de décision avant chaque coup — cible et bâton conservateurs — plutôt que travail technique.',
    places: ['simulator'],
    modes: ['sim-course'],
    roundLengths: [9],
    status: VALIDATION.PENDING,
    source: 'Basée sur des principes de pratique golf couramment enseignés (gestion de parcours, prise de décision). À documenter/valider par une source ou un coach.',
    previewNoteKeys: ['completedNineHoles', 'nextPriority'],
    steps: [
      {
        title: 'Règles', durationMinutes: 10, club: null, ballCount: null, cardHint: null,
        instructions: ['Choisir la cible la plus sûre, pas la plus ambitieuse', 'Un seul bâton envisagé par coup, pas d’hésitation', 'Jouer pour le centre du green, jamais pour le drapeau'],
      },
      {
        title: 'Sur le parcours', durationMinutes: 70, club: 'Tous les bâtons', ballCount: null, cardHint: null,
        instructions: ['Jouer les 9 trous à ce rythme', 'Éviter tout coup à risque inutile'],
        observe: ['Fois où le choix « prudent » aurait mieux servi'],
      },
      {
        title: 'Bilan', durationMinutes: 10, club: null, ballCount: null, cardHint: null,
        instructions: ['Noter le score', 'Nombre de décisions « prudentes » respectées', 'Priorité pour la prochaine séance'],
      },
    ],
  },
];

export function sessionById(id) {
  return TRAINING_SESSIONS.find((s) => s.id === id) || null;
}

export function sessionsFor(place, mode) {
  return TRAINING_SESSIONS.filter((s) => {
    if (!s.places.includes(place)) return false;
    if (place === 'simulator' && !s.modes.includes(mode)) return false;
    return true;
  });
}

// The one place that resolves "which steps does this session show" — a
// format-authored session (stepsByFormat) looks up the requested format
// (falling back to Standard if an unknown id somehow arrives); a
// round-length session (steps) isn't format-driven, so it just returns
// its one fixed structure regardless of what's passed.
export function stepsForSession(session, formatId) {
  if (session.stepsByFormat) return session.stepsByFormat[formatId] || session.stepsByFormat[DEFAULT_FORMAT_ID];
  return session.steps || [];
}

// This is not a calendar — it's a skill progression. It never blocks the
// player from picking any other session; it only informs which one
// Golfyeah highlights as "recommandée" for today, and it never advances
// on its own: reaching the pass criterion only shows a "prêt pour la
// prochaine étape" prompt (see levelProgress) — the player still has to
// tap "Passer à ..." (see setTrainingLevel in DataContext) to actually
// move on. `sessionIds` lists which existing library session(s) serve
// this level — the same skill can point at a different session depending
// on today's place/mode (see recommendedSessionId), which is how a level
// "adapts to context" without forking its content.
//
// `passesAttempt(log)` decides whether one completed session counts as a
// success for this level. Every level's criterion is mechanically
// checked against real reported data — nothing here defaults to "always
// passes". numEquals guards the exact-zero checks (mulligansUsed,
// restartedShots): Number('') is 0 in JS, so an unfilled field must not
// silently count as "0 mulligans used".
function numEquals(value, target) {
  return value !== undefined && value !== null && value !== '' && Number(value) === target;
}

export const LEVELS = [
  {
    level: 1,
    name: 'Contact',
    objective: 'Frapper la balle proprement.',
    passCriterion: '6 bons contacts sur 10 au fer 7, dans 2 des 3 dernières séances.',
    whyStart: 'Tu n’as pas encore complété assez de séances pour confirmer que ton contact est stable. Golfyeah commence donc par la base : frapper la balle proprement.',
    sessionIds: ['contact'],
    passesAttempt: (log) => Number(log.notes?.goodContacts) >= 6,
  },
  {
    level: 2,
    name: 'Direction',
    objective: 'Faire partir la balle vers la cible.',
    passCriterion: '6 balles sur 10 dans le corridor visé, dans 2 des 3 dernières séances.',
    whyStart: 'Tu n’as pas encore complété assez de séances pour confirmer que ta direction est fiable. Golfyeah propose donc de travailler les cibles et le corridor visé.',
    sessionIds: ['cibles'],
    passesAttempt: (log) => Number(log.notes?.corridorBalls) >= 6,
  },
  {
    level: 3,
    name: 'Répétition',
    objective: 'Changer de bâton sans perdre complètement le swing.',
    passCriterion: 'Une séance mixte avec plusieurs bâtons et un contact général d’au moins 6/10, dans 2 des 3 dernières séances.',
    whyStart: 'Tu n’as pas encore complété assez de séances pour confirmer que ton swing tient en changeant de bâton. Golfyeah propose donc une séance mixte avec plusieurs bâtons.',
    sessionIds: ['cibles'],
    // "Séance mixte" is confirmed by the session template itself
    // (cibles.mixedClub) rather than an extra field — completion is
    // already implicit since a log only exists once the session was
    // marked done.
    passesAttempt: (log) => !!sessionById(log.sessionId)?.mixedClub && Number(log.notes?.contactGeneral) >= 6,
  },
  {
    level: 4,
    name: 'Driver jouable',
    objective: 'Garder la balle en jeu.',
    passCriterion: '5 ou 6 drives sur 10 jouables, dans 2 des 3 dernières séances.',
    whyStart: 'Tu n’as pas encore complété assez de séances pour confirmer que ton driver est fiable. Golfyeah propose donc de travailler la balle jouable avant la distance.',
    sessionIds: ['driver-jouable'],
    passesAttempt: (log) => Number(log.notes?.playableBalls) >= 5,
  },
  {
    level: 5,
    name: 'Jeu réel',
    objective: 'Transférer la pratique vers une vraie ronde.',
    passCriterion: 'Compléter 9 trous sans mulligan, sans coup recommencé, avec des notes honnêtes après la ronde.',
    whyStart: 'Tu n’as pas encore transféré ta pratique vers une vraie ronde. Golfyeah propose donc de jouer 9 trous sans mulligan, avec des notes honnêtes.',
    sessionIds: REAL_ROUND_SESSION_IDS,
    // Only a pass if every serious-round rule was actually respected —
    // never a free pass just for showing up. sessionNotesCompleted and
    // completedNineHoles must be explicitly ticked "Oui" (undefined
    // fails both, same as never having answered); mulligansUsed and
    // restartedShots must be exactly 0, guarded against a blank field
    // silently reading as zero.
    passesAttempt: (log) => (
      log.notes?.completedNineHoles === true
      && numEquals(log.notes?.mulligansUsed, 0)
      && numEquals(log.notes?.restartedShots, 0)
      && log.notes?.sessionNotesCompleted === true
    ),
    terminal: true,
  },
];

// The core rule: "2 séances réussies sur les 3 dernières" — never a
// single good session. Looks only at logs for this level's session(s),
// newest first, windowed to the last 3 attempts. `meetsCriteria` and
// `ready` are kept separate so a terminal level (Jeu réel — nothing to
// advance to) still honestly reports whether its criterion is met,
// without ever showing a "next step" prompt that doesn't exist.
export function levelProgress(level, logs) {
  const relevant = logs
    .filter((l) => level.sessionIds.includes(l.sessionId))
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 3);
  const passCount = relevant.filter(level.passesAttempt).length;
  const meetsCriteria = relevant.length > 0 && passCount >= 2;
  return {
    attempts: relevant.length,
    passCount,
    meetsCriteria,
    ready: meetsCriteria && !level.terminal,
  };
}

// The short "why" line shown once the player has at least tried this
// level; the fuller whyStart is reserved for a level with zero attempts
// yet (freshly reached, including the very start of the plan).
export function levelWhy(level, attempts) {
  return attempts === 0 ? level.whyStart : `${level.name} pas encore confirmé.`;
}

// Picks which of a level's candidate sessions actually fits today's
// place/mode — the same skill, adapted to context rather than forked
// into different content. Falls back to the first candidate if none
// fits today's context (still lets the UI recognize the mismatch).
export function recommendedSessionId(level, place, mode) {
  const candidates = level.sessionIds.map(sessionById).filter(Boolean);
  const match = candidates.find((s) => s.places.includes(place) && (place !== 'simulator' || s.modes.includes(mode)));
  return (match || candidates[0])?.id || null;
}
