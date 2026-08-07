# Changelog

Toutes les versions notables de Golfyeah! sont documentées ici.

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
