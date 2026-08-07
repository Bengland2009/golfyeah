# Changelog

Toutes les versions notables de Golfyeah! sont documentées ici.

## v1.5.0 — 2026-08-07

- Nouveau : **Golf Tracker**, un compteur de coups en direct optionnel.
  Accessible via "Golf Tracker" sous le score de chaque joueur pendant une
  partie. Gros ballon de golf à taper (un tap = un coup), animation +
  vibration au tap, annuler le dernier coup, modification manuelle du
  score, "Terminer le trou" qui avance au trou suivant (ou termine la
  partie sur le dernier trou).
- Le tracker lit/écrit directement le même score que la scorecard normale
  (aucune donnée séparée) — modifier l'un met à jour l'autre instantanément,
  et la reprise après avoir quitté la partie restaure le trou et le compte
  en cours automatiquement (autosave hérité du système existant).
- Corrige un effet de bord découvert en construisant le tracker : changer
  de trou pré-remplissait déjà un score par défaut (= la normale du trou)
  dans Firestore avant même que le joueur ait joué — ça empêchait le
  tracker de vraiment repartir à 0. Les trous non joués restent maintenant
  vides tant qu'aucune vraie interaction n'a eu lieu, sur les deux écrans.

## v1.4.0 — 2026-08-07

- Corrige le vert qui ne remplissait pas toute la largeur sur les téléphones
  plus larges que 390px (courant sur Android, ~400-430px) — l'app est
  maintenant pleine largeur sur tout téléphone réel, et ne se limite à une
  colonne de 390px centrée que sur desktop/tablette (effet "mockup
  téléphone" voulu).
- Corrige l'espace vert vide au-dessus de l'en-tête (le padding de zone
  sécurisée était appliqué comme un vide séparé avant l'en-tête plutôt que
  fondu dans son propre fond vert) — l'en-tête (Header/TopBar/Login)
  s'étend maintenant proprement dans l'encoche/barre de statut.
- Corrige "Utiliser ma photo Google" qui ne faisait rien : le joueur
  correspondant au compte connecté n'avait jamais sa `photoUrl` Google
  synchronisée. Elle se met maintenant à jour automatiquement à la
  connexion (par email si déjà lié, sinon par correspondance de nom).

## v1.3.1 — 2026-08-07

- Corrige l'écran de connexion (et l'écran d'erreur de synchronisation) qui
  s'affichaient hors du conteneur `max-width: 390px` du reste de l'app —
  ils prenaient toute la largeur sur desktop au lieu de rester dans la
  colonne mobile centrée.
- Corrige `100vh` sur mobile (n'exclut pas la barre d'adresse rétractable
  du navigateur, ce qui poussait le bouton "Continuer avec Google" hors de
  la zone visible) — utilise `100dvh` avec repli `100vh`.

## v1.3.0 — 2026-08-07

- Auth Google : repli automatique sur `signInWithRedirect` si le popup est
  bloqué, et les erreurs de connexion sont maintenant affichées à l'écran
  (au lieu d'échouer silencieusement) — inclut la capture du résultat d'un
  retour de redirection après rechargement de page.
- Chargement en 3 paliers (SDK/session connue → données Firestore prêtes) :
  les abonnements Firestore n'écoutent qu'une fois l'utilisateur authentifié
  (évite les erreurs de permission silencieuses avant connexion), et l'app
  attend que toutes les collections aient reçu leur premier instantané avant
  d'afficher l'accueil — plus de flash de classement/parties vides.
- Erreur de synchronisation (ex. compte pas dans `memberEmails`) affichée
  clairement avec option de déconnexion, plutôt qu'un écran vide silencieux.

## v1.2.0 — 2026-08-07

- Remplace le déploiement Firebase Hosting/GitHub Actions (nécessitait une
  clé de service manuelle) par **Vercel** : connexion GitHub en un clic
  dans leur interface, redéploiement automatique à chaque push, aucun
  secret à gérer.
- `vercel.json` ajouté pour le routage SPA (React Router).

## v1.1.0 — 2026-08-07

- Déploiement automatique sur Firebase Hosting à chaque push (GitHub Actions).
- `firebase.json`/`.firebaserc` configurés pour l'hébergement, config web
  publique commitée (`.env.production` — non sensible, voir commentaire
  dans le fichier).

## v1.0.0 — 2026-08-07

Première version fonctionnelle branchée sur un vrai projet Firebase partagé.

- App PWA complète reproduisant le prototype Claude Design (connexion, accueil,
  nouvelle partie, score en direct, résumé/scorecard, parties, terrains, range,
  joueurs, profil).
- Authentification Google, Firestore partagé entre les membres du groupe
  (courses/parties/joueurs/range synchronisés en direct entre appareils),
  règles de sécurité limitant l'accès aux emails listés dans `groups/default`.
- Photos de profil personnalisées stockées directement dans Firestore
  (redimensionnées côté client) — pas besoin de Firebase Storage/plan payant.
- Manifest PWA, icônes, mise en cache de l'app shell hors-ligne.
- Numéro de version affiché dans le menu de l'app (☰ → bas du menu).
