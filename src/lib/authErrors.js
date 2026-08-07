const MESSAGES = {
  'auth/popup-closed-by-user': "La fenêtre de connexion a été fermée avant la fin. Réessaie.",
  'auth/cancelled-popup-request': null,
  'auth/network-request-failed': 'Problème de connexion réseau. Vérifie ta connexion et réessaie.',
  'auth/user-disabled': 'Ce compte a été désactivé.',
  'auth/unauthorized-domain': "Ce domaine n'est pas autorisé pour la connexion Google (à ajouter dans Firebase Authentication → Settings → Authorized domains).",
};

export function authErrorMessage(err) {
  if (!err) return null;
  return MESSAGES[err.code] ?? `Connexion impossible (${err.code || 'erreur inconnue'}).`;
}
