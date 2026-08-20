// Golf venues/simulators our group visits regularly — a small, hand-curated
// list bundled with the app (not user-editable, not stored in DataContext/
// Firestore). Each entry follows the same "business card" shape so the
// VenueDetail screen works unchanged as more venues are added.
export const VENUES = [
  {
    id: 'golf-en-ville-montreal',
    name: 'Golf en Ville Montréal',
    city: 'Montréal',
    kind: 'interieur',
    highlight: 'Apportez votre propre bière',
    features: [
      '5 simulateurs',
      'TrackMan et GolfJoy',
      'Plateforme de putting intelligente',
      'Ouvert toute l’année',
    ],
    address: '5674, rue Sherbrooke Est',
    hours: [
      { days: 'Dimanche à jeudi', time: '12 h à 21 h' },
      { days: 'Vendredi et samedi', time: '12 h à 22 h' },
    ],
    bookingUrl: null,
  },
];
