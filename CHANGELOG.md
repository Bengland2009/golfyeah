# Changelog

Toutes les versions notables de Golfyeah! sont documentées ici.

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
