// Golf venues/simulators our group visits regularly — a small, hand-curated
// list bundled with the app (not user-editable, not stored in DataContext/
// Firestore). Each entry follows the same "business card" shape so the
// VenueDetail screen works unchanged as more venues are added.
//
// `features` icons are picked by hand from the existing icon set when a
// venue is authored (see ICON_MAP in VenueDetail.jsx) rather than guessed
// automatically from the label text.
export const VENUES = [
  {
    id: 'golf-en-ville-montreal',
    name: 'Golf en Ville Montréal',
    city: 'Montréal',
    kind: 'interieur',
    bayCount: 5,
    rating: null,
    photoUrl: null,
    highlight: 'Apportez votre propre bière',
    features: [
      { label: '5 simulateurs', icon: 'monitor' },
      { label: 'TrackMan & GolfJoy', icon: 'ball' },
      { label: 'Putting intelligent', icon: 'target' },
      { label: 'Ouvert toute l’année', icon: 'calendar' },
    ],
    address: '5674, rue Sherbrooke Est',
    hours: [
      { days: 'dim-jeu', time: '12 h – 21 h' },
      { days: 'ven-sam', time: '12 h – 22 h' },
    ],
    bookingUrl: null,
  },
];
