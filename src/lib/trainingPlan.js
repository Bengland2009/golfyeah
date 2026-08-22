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
// mode(s) it needs. `blocks` is the one canonical, validated structure
// (sized to the session's longest listed duration); adaptedBlocks() is
// the only thing that ever changes what's shown for a shorter pick.
export const TRAINING_SESSIONS = [
  {
    id: 'contact',
    name: 'Contact solide',
    objective: 'Améliorer la qualité du contact.',
    principle: 'Échauffement progressif, puis répétition technique ciblée sur un seul point à la fois.',
    places: ['range', 'simulator'],
    modes: ['sim-range'],
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
    name: 'Cibles et direction',
    objective: 'Développer la direction et une routine fiable.',
    principle: 'Pratique par cibles avec changement de bâton régulier, pour éviter l’automatisme.',
    places: ['range', 'simulator'],
    modes: ['sim-range'],
    durations: [30, 60, 90],
    // Its own block already rotates through PW/Fer8/Fer7/Fer5/Hybride/
    // Driver — this is the template-level confirmation that a completed
    // log of this session really was a mixed-club attempt, used by
    // LEVELS' Répétition criterion (Option A, no extra field needed).
    mixedClub: true,
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
    id: 'driver-jouable',
    name: 'Driver jouable',
    objective: 'Retrouver un driver fiable et une balle en jeu.',
    principle: 'Répétition ciblée du même point technique, priorité donnée à la balle jouable plutôt qu’à la distance.',
    places: ['range', 'simulator'],
    modes: ['sim-range'],
    durations: [30, 60, 90],
    status: VALIDATION.PENDING,
    source: 'Basée sur des principes de pratique golf couramment enseignés (répétition ciblée, priorité au résultat jouable). À documenter/valider par une source ou un coach.',
    blocks: [
      { title: 'Échauffement', minutes: 10, items: ['Wedge et fers courts pour sentir le contact'] },
      { title: 'Trajectoire', minutes: 25, items: ['Cible = corridor de fairway', 'Priorité à la balle en jeu, pas à la distance', 'Une routine avant chaque balle'] },
      { title: 'Répétition', minutes: 15, items: ['Répéter le même point technique sur 10 balles', 'Ne pas changer de correctif en cours de route'] },
      { title: 'Bilan', minutes: 10, items: ['Compter les balles jouables sur 10', 'Nommer le point technique qui a le plus aidé'] },
    ],
  },
  {
    id: 'parcours-imaginaire',
    name: 'Parcours imaginaire au range',
    objective: 'Faire le transfert vers le jeu réel, au range.',
    principle: 'Simulation de parcours en pratique libre : enchaîner des coups différents, une seule tentative chacun, jamais le même coup deux fois.',
    places: ['range'],
    modes: [],
    durations: [30, 60, 90],
    status: VALIDATION.PENDING,
    source: 'Basée sur des principes de pratique golf couramment enseignés (transfert vers le jeu, pratique aléatoire). À documenter/valider par une source ou un coach.',
    blocks: [
      { title: 'Échauffement', minutes: 10, items: ['Quelques wedges pour sentir le contact avant de commencer'] },
      {
        title: 'Mode parcours', minutes: 40,
        items: ['Ne jamais jouer deux fois le même coup.', 'Exemple : Driver → Fer 7 → Wedge → Driver → Fer 5 → Wedge → Hybride → Fer 8', 'Choisir le bâton avant de regarder le résultat'],
      },
      { title: 'Bilan', minutes: 10, items: ['Compter les coups qui auraient été jouables sur un vrai trou', 'Noter le bâton le plus fiable du parcours imaginaire'] },
    ],
  },
  {
    id: 'distances-carry',
    name: 'Distances carry',
    objective: 'Connaître ses vraies distances de carry, bâton par bâton.',
    principle: 'Mesure répétée par bâton à l’aide des données du simulateur, sans corriger le geste en cours de série.',
    places: ['simulator'],
    modes: ['sim-range'],
    durations: [30, 60, 90],
    status: VALIDATION.PENDING,
    source: 'Basée sur des principes de pratique golf couramment enseignés (mesure répétée, données objectives). À documenter/valider par une source ou un coach.',
    blocks: [
      { title: 'Échauffement', minutes: 10, items: ['Quelques wedges avant de commencer les mesures'] },
      {
        title: 'Mesures par bâton', minutes: 40,
        items: ['5 à 8 balles par bâton, du plus court au plus long', 'Noter le carry moyen affiché, pas le meilleur coup', 'Ignorer les balles clairement ratées'],
      },
      { title: 'Bilan', minutes: 10, items: ['Mettre à jour mes distances dans Mes distances', 'Identifier le bâton le plus irrégulier'] },
    ],
  },
  {
    id: 'dispersion',
    name: 'Dispersion gauche/droite',
    objective: 'Voir où partent vraiment mes balles, pas où je pense qu’elles partent.',
    principle: 'Observation de la dispersion latérale affichée par le simulateur, par bâton, sans essayer de la corriger pendant la série.',
    places: ['simulator'],
    modes: ['sim-range'],
    durations: [30, 60, 90],
    status: VALIDATION.PENDING,
    source: 'Basée sur des principes de pratique golf couramment enseignés (observation neutre, données objectives). À documenter/valider par une source ou un coach.',
    blocks: [
      { title: 'Échauffement', minutes: 10, items: ['Quelques balles pour se mettre en route'] },
      {
        title: 'Série par bâton', minutes: 40,
        items: ['8 à 10 balles par bâton sans changer de cible', 'Regarder la dispersion affichée après la série, pas balle par balle', 'Noter le côté qui revient le plus souvent'],
      },
      { title: 'Bilan', minutes: 10, items: ['Nommer le bâton le plus dispersé', 'Une seule priorité pour la prochaine séance'] },
    ],
  },
  {
    id: 'neuf-trous',
    name: '9 trous sérieux',
    objective: 'Jouer comme sur un vrai terrain.',
    principle: 'Transfert complet en conditions de jeu réelles, sur simulateur, sans filet de sécurité.',
    places: ['simulator'],
    modes: ['sim-course'],
    durations: [60, 90],
    status: VALIDATION.PENDING,
    source: 'Basée sur des principes de pratique golf couramment enseignés (jeu à tentative unique, transfert en conditions réelles). À documenter/valider par une source ou un coach.',
    blocks: [
      { title: 'Règles', minutes: 10, items: ['Aucun mulligan', 'Pas de coup recommencé', 'Jouer avec mes vraies distances', 'Choisir le bâton avant de regarder le résultat', 'Ne pas chercher le coup parfait'] },
      { title: 'Sur le parcours', minutes: 70, items: ['Jouer autant de trous que le temps le permet, au rythme d’une vraie ronde', 'Compter les pénalités et les coups complètement ratés', 'Rester sur la décision prise avant chaque coup'] },
      { title: 'Bilan', minutes: 10, items: ['Score', 'Meilleur aspect de la ronde', 'Priorité pour la prochaine séance'] },
    ],
  },
  {
    id: 'gestion-de-partie',
    name: 'Gestion de partie',
    objective: 'Jouer intelligemment plutôt que de viser le coup parfait.',
    principle: 'Prise de décision avant chaque coup — cible et bâton conservateurs — plutôt que travail technique.',
    places: ['simulator'],
    modes: ['sim-course'],
    durations: [60, 90],
    status: VALIDATION.PENDING,
    source: 'Basée sur des principes de pratique golf couramment enseignés (gestion de parcours, prise de décision). À documenter/valider par une source ou un coach.',
    blocks: [
      { title: 'Règles', minutes: 10, items: ['Choisir la cible la plus sûre, pas la plus ambitieuse', 'Un seul bâton envisagé par coup, pas d’hésitation', 'Jouer pour le centre du green, jamais pour le drapeau'] },
      { title: 'Sur le parcours', minutes: 70, items: ['Jouer autant de trous que le temps le permet', 'Compter les fois où le choix « prudent » aurait mieux servi', 'Éviter tout coup à risque inutile'] },
      { title: 'Bilan', minutes: 10, items: ['Score', 'Nombre de décisions « prudentes » respectées', 'Priorité pour la prochaine séance'] },
    ],
  },
];

export function sessionById(id) {
  return TRAINING_SESSIONS.find((s) => s.id === id) || null;
}

export function sessionsFor(place, mode, duration) {
  return TRAINING_SESSIONS.filter((s) => {
    if (!s.places.includes(place)) return false;
    if (place === 'simulator' && !s.modes.includes(mode)) return false;
    return s.durations.includes(duration);
  });
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
