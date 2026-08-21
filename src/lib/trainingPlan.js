// Content for the "Plan d'entraînement" sub-section — a hand-authored,
// fixed 4-week program (same "bundled with the app, not user-editable"
// convention as lib/venues.js). Only the player's progress through it
// (trainingLogs, in DataContext) is stored/synced; the plan itself never
// changes at runtime.

export const TRAINING_GOAL = 'Améliorer la qualité du contact, la direction et la capacité à reproduire mes coups sur le parcours.';

export const TRAINING_RULE = 'Après chaque séance, choisis une seule chose à améliorer à la prochaine séance. Pas cinq.';

export const TRAINING_WEEKS = [
  { week: 1, title: 'Contact', question: 'Est-ce que je frappe la balle proprement?' },
  { week: 2, title: 'Direction', question: 'Est-ce que ma balle part généralement vers ma cible?' },
  { week: 3, title: 'Variété', question: 'Est-ce que je peux changer de bâton sans perdre complètement mon swing?' },
  { week: 4, title: 'Jeu', question: 'Est-ce que mon swing tient lorsque je n’ai qu’une seule tentative?' },
];

// notesFields' `type` drives the input rendered by TrainingNotesForm:
//   text     — free text
//   number   — a single numeric field, optionally with a unit suffix
//   fraction — two small numeric fields joined by "/" (stored as key_num/key_den)
//   select   — single choice from `options`
export const TRAINING_SESSIONS = [
  {
    id: 'A',
    label: 'Séance A',
    title: 'Technique au range',
    duration: 'Environ 60 minutes',
    goal: 'Travailler la qualité du contact et la mécanique de base.',
    blocks: [
      {
        title: 'Échauffement', duration: '10 min',
        items: ['Wedge : petits swings', 'Monter progressivement jusqu’au swing complet', 'Chercher le contact, pas la distance'],
      },
      {
        title: 'Fer 7', duration: '20 min',
        items: ['Choisir une cible précise', 'Faire une routine avant chaque balle', 'Points techniques : grip, posture, rotation, finish', 'Ne travailler qu’un seul point technique à la fois'],
      },
      {
        title: 'Fer 5 / Fer 6', duration: '10 min',
        items: ['Même objectif : contact solide', 'Ne pas forcer'],
      },
      {
        title: 'Hybride / bois', duration: '10 min',
        items: ['Chercher une trajectoire jouable'],
      },
      {
        title: 'Driver', duration: '10 min',
        items: ['Cible = corridor de fairway', 'Priorité à la balle en jeu, pas à la distance'],
      },
    ],
    notesFields: [
      { key: 'fer7Contacts', label: 'Fer 7 — bons contacts', type: 'number', suffix: '/10' },
      { key: 'driverPlayable', label: 'Driver — balles jouables', type: 'number', suffix: '/10' },
      { key: 'technicalPoint', label: 'Point technique travaillé', type: 'text' },
      { key: 'mainProblem', label: 'Problème principal', type: 'text' },
    ],
  },
  {
    id: 'B',
    label: 'Séance B',
    title: 'Précision au range',
    duration: 'Environ 60 minutes',
    goal: 'Améliorer la précision, les cibles et la capacité à changer de bâton.',
    blocks: [
      {
        title: 'Échauffement', duration: '10 min',
        items: ['Wedge + fer court'],
      },
      {
        title: 'Cibles', duration: '30 min',
        items: [
          '5 balles par cible, puis changer de bâton.',
          'PW → environ 100 vg', 'Fer 8 → environ 120 vg', 'Fer 7 → environ 130 vg',
          'Fer 5 → environ 150 vg', 'Hybride → environ 165–175 vg', 'Driver → fairway imaginaire',
        ],
      },
      {
        title: 'Mode parcours', duration: '20 min',
        items: ['Ne jamais jouer deux fois le même coup.', 'Exemple : Driver → Fer 7 → Wedge → Driver → Fer 5 → Wedge → Hybride → Fer 8'],
      },
    ],
    notesFields: [
      { key: 'bestClub', label: 'Meilleur bâton aujourd’hui', type: 'text' },
      { key: 'worstClub', label: 'Bâton le moins fiable', type: 'text' },
      { key: 'missPattern', label: 'Erreur dominante', type: 'select', options: ['Gauche', 'Droite', 'Top', 'Gratte'] },
      { key: 'contactGeneral', label: 'Contact général', type: 'number', suffix: '/10' },
    ],
  },
  {
    id: 'C',
    label: 'Séance C',
    title: 'Simulateur',
    duration: '9 trous',
    goal: 'Tester le swing dans un contexte de jeu réel, avec une seule tentative par coup.',
    blocks: [
      {
        title: 'Règles',
        items: [
          'Aucun mulligan', 'Pas de coup recommencé', 'Jouer avec mes vraies distances',
          'Choisir le bâton avant de regarder le résultat', 'Ne pas chercher le coup parfait',
        ],
      },
    ],
    notesFields: [
      { key: 'score', label: 'Score', type: 'number' },
      { key: 'penalties', label: 'Pénalités', type: 'number' },
      { key: 'wholeMisses', label: 'Coups complètement ratés', type: 'number' },
      { key: 'playableDrives', label: 'Drives jouables', type: 'fraction' },
      { key: 'greensOrProximity', label: 'Greens (ou proximité) en régulation', type: 'text' },
      { key: 'bestAspect', label: 'Meilleur aspect', type: 'text' },
      { key: 'nextPriority', label: 'Priorité pour la prochaine séance', type: 'text' },
    ],
  },
];

export function sessionById(id) {
  return TRAINING_SESSIONS.find((s) => s.id === id) || null;
}
