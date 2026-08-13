# Changelog

Toutes les versions notables de Golfyeah! sont documentées ici.

## v1.17.0 — 2026-08-09

- Réorganisation complète de la page **Nouvelle partie** pour suivre
  l'ordre naturel de décision : Type de partie → Joueurs → Terrain →
  Format → Mode de saisie → Commencer la partie.
  - "Ajouter un joueur" est maintenant accessible directement depuis
    la section Joueurs.
  - Pour une partie intérieure, un choix "Partie rapide" (zéro saisie,
    prête à jouer) ou "Parcours de simulateur" (nommer le lieu, avec
    configuration progressive ou complète des trous) remplace
    l'ancien formulaire toujours affiché.
  - Type de partie, Terrain (intérieur), Format et Mode de saisie
    utilisent maintenant des contrôles segmentés compacts au lieu de
    grands blocs empilés — la page est nettement plus courte, plus
    rapide à parcourir et tient presque entièrement à l'écran sans
    défiler pour une partie extérieure typique.

## v1.16.0 — 2026-08-09

- Nouveau mode **Entrée rapide** pour enregistrer une ronde déjà
  jouée, en plus du mode En direct (inchangé) :
  - Après avoir choisi le terrain, le format et les joueurs, un choix
    "Mode de saisie" apparaît — En direct ou Entrée rapide.
  - En Entrée rapide, toute la carte de pointage tient sur une seule
    page (Aller/Retour séparés en 18 trous), avec le par de chaque
    trou déjà affiché et non modifiable.
  - Le score total et le +/- par joueur se calculent automatiquement
    pendant la saisie, avec les statistiques facultatives Mulligans /
    Balles perdues / Bières sous la carte.
  - Pour un simulateur dont les pars ne sont pas encore connus, le par
    est demandé une seule fois par trou (touche "?") et mémorisé pour
    le reste de la saisie — mêmes trous progressifs qu'en mode En
    direct.
  - Produit exactement les mêmes statistiques et le même classement
    que le mode En direct : la ronde est enregistrée dans le même
    format que le mode En direct, donc leaderboard, profils et
    résumé de partie fonctionnent de façon identique.

## v1.15.0 — 2026-08-09

- **Ajouter un joueur** est maintenant un écran dédié avec validation
  complète de l'adresse courriel avant l'envoi de l'invitation :
  - Trois champs : Nom du joueur, Adresse courriel, Confirmer
    l'adresse courriel.
  - Le champ de confirmation bloque le copier-coller (glisser-déposer
    inclus) — l'adresse doit être retapée manuellement.
  - Validation en temps réel avec messages clairs : format d'adresse
    invalide, adresses différentes, ou joueur déjà existant avec cette
    adresse.
  - Le bouton **Ajouter le joueur** reste désactivé tant que tous les
    champs ne sont pas valides.
  - Après l'ajout, un écran de confirmation indique qu'une invitation
    a été envoyée à l'adresse fournie, et ouvre l'application courriel
    avec un message d'invitation prérempli.
  - L'adresse est enregistrée sur le profil du joueur : dès qu'il se
    connectera avec ce compte Google, son profil sera automatiquement
    relié (aucune étape manuelle de liaison requise).

## v1.14.0 — 2026-08-08

- Réorganisation de la navigation : **« Range »** devient **« Pratique »**,
  le centre d'entraînement de Golfyeah! (même icône dans la barre du bas).
  - La page Pratique est maintenant un tableau de bord avec 4 cartes
    élégantes (icône, titre, description) : **Mes distances**,
    **Nouvelle séance**, **Caddie**, **Historique** — chacune
    accessible en un seul tap.
  - **Caddie** n'est plus dans le menu ☰ ; c'est maintenant une
    sous-section de Pratique, toujours accessible en un clic.
  - Nouvel écran **Historique** : toutes les séances de pratique
    (tous bâtons confondus), triées de la plus récente à la plus
    ancienne.
  - Les anciens liens `/range` et `/caddie` redirigent automatiquement
    vers leur nouvel emplacement.
  - Architecture pensée pour accueillir facilement de futures cartes
    (statistiques, dispersion des coups, exercices, défis, conseils)
    sans redesign.

## v1.13.0 — 2026-08-08

- Nouvelle section **Caddie** (menu ☰), le carnet de distances de poche
  du golfeur :
  - Carte "Distances de référence" : distances de carry génériques pour
    les 15 bâtons habituels (Driver à Lob Wedge), présentées dans une
    grille à deux colonnes aérée plutôt qu'un tableau.
  - Dès qu'une distance personnelle existe pour un bâton (calculée à
    partir des séances déjà loggées dans Range), elle devient la valeur
    principale — affichée en vert avec l'écart par rapport à la
    référence ("+28 vg vs réf.") — et la référence générique passe au
    second plan. Aucune nouvelle saisie requise : ça réutilise les
    séances de pratique déjà enregistrées.
  - Carte "À retenir" discrète expliquant que ces chiffres sont un
    point de départ à remplacer par ses propres distances mesurées.
  - Structure pensée pour accueillir facilement de futures cartes
    Caddie (conseils, règles, conversions, notes) sans redesign.

## v1.12.1 — 2026-08-08

- Retouches de finition sur la page d'accueil :
  - Le logo GY! est déplacé complètement à droite du header, le menu
    ☰ reste à gauche — header plus équilibré, toujours minimaliste.
  - Resserré l'espace entre le titre "Classement" et les joueurs pour
    remonter le bloc.
  - "Aucune ronde" (joueur sans partie jouée) est maintenant beaucoup
    plus discret — petit texte gris pâle qui n'attire plus l'œil
    autant que le score des joueurs actifs.
  - Les emojis des **Faits marquants** sont remplacés par des icônes
    vectorielles monochromes (trophée, cible, sapin, chope) en vert
    Golfyeah!, plus sobres et cohérentes avec le reste de l'app.
  - Espacement augmenté entre les grandes sections (Classement,
    Nouvelle partie, Dernière partie, Faits marquants) pour que la
    page respire davantage.

## v1.12.0 — 2026-08-08

- Refonte visuelle de la page d'accueil pour un rendu plus premium,
  sans ajouter de nouvelle fonctionnalité :
  - **Classement** : photos des joueurs agrandies (58px), score
    encore plus dominant, noms légèrement réduits, séparateurs
    verticaux plus fins et détachés des bords, plus d'espace pour
    respirer. Un joueur sans ronde affiche maintenant "Aucune ronde"
    au lieu d'un simple tiret.
  - Retrait du raccourci ambigu "+ Ajouter" à côté du classement —
    l'ajout d'un joueur reste accessible depuis le menu ☰ et l'écran
    Joueurs.
  - **Dernière partie** : nom du terrain plus en évidence, date/trous
    plus discrets, lien "Voir la scorecard" légèrement plus visible.
  - **Faits marquants** : une petite icône sobre par statistique
    (🏆 🎯 🌲 🍺) pour les reconnaître plus vite, avec un peu plus
    d'espacement dans les cartes.
  - Espacement général augmenté entre les sections pour un look moins
    "formulaire", plus proche d'une application de golf haut de
    gamme.

## v1.11.0 — 2026-08-08

- Le formulaire **Nouveau commentaire** permet maintenant d'attacher des
  photos :
  - Nouvelle section optionnelle "Photo" avec deux façons d'ajouter une
    image en un tap — **Prendre une photo** (ouvre directement
    l'appareil photo) ou **Choisir des photos** (galerie, sélection
    multiple) — jusqu'à 5 photos par commentaire.
  - Miniatures affichées sous la zone d'ajout, chacune retirable avant
    l'envoi.
  - Les photos attachées apparaissent maintenant dans l'écran de
    détail ; toucher une photo l'ouvre en plein écran, et on peut
    glisser entre les photos si plusieurs sont attachées.

## v1.10.1 — 2026-08-07

- La liste **Commentaires** met maintenant le travail actif en avant au
  lieu de tout trier par date :
  - Les commentaires sont groupés par statut — **Nouveau** puis
    **En cours** puis **Résolu** — plutôt que triés uniquement par
    date ; à l'intérieur de chaque groupe, le plus récent reste en
    premier.
  - En-tête "À traiter (N)" au-dessus des sections Nouveau/En cours,
    chaque section affichant son propre compte.
  - La section **Résolus** est repliée par défaut (dépliable d'un tap)
    pour ne pas encombrer l'écran avec l'historique.
  - Hiérarchie visuelle par statut : badge rouge + carte blanche pour
    Nouveau, badge orange + accent orange discret pour En cours, badge
    vert + carte gris pâle et texte adouci pour Résolu (se sent
    "archivé" sans devenir illisible).
  - Une section sans aucun élément est simplement masquée (ex. pas de
    "En cours" affiché s'il n'y a aucun commentaire en cours).
  - Le filtre par statut (Tous/Nouveau/En cours/Résolu) est retiré —
    les sections groupées le remplacent directement ; le filtre par
    type (Bugs/Idées/Améliorations) reste disponible.

## v1.10.0 — 2026-08-07

- **Commentaires** devient une vraie conversation plutôt qu'un rapport
  statique :
  - **Discussion** : chaque commentaire a maintenant un fil de
    discussion (avatar, nom, date/heure, message) avec une zone
    "Écrire un commentaire..." + bouton Envoyer en bas — les testeurs
    peuvent échanger sans créer de nouveaux rapports.
  - **Captures d'écran** : les messages du fil peuvent inclure jusqu'à
    3 captures d'écran (bouton "+ Photo"), utile pour les bugs visuels.
  - **"J'ai aussi ce problème"** : un tap pour confirmer qu'on vit le
    même problème plutôt que de dupliquer un rapport — affiche
    "👍 X joueurs ont ce problème".
  - **Priorité** (Basse/Normale/Haute) : réservée à l'administrateur.
  - **Version corrigée** : en marquant un commentaire "Résolu",
    l'administrateur précise dans quelle version le correctif est
    inclus (ex. "v1.10.0"), affiché sous le statut.
  - **Notes de résolution** : l'administrateur peut expliquer
    brièvement ce qui a été corrigé ; les notes restent visibles après
    la résolution.
  - **Indicateur non-lu** : un point apparaît dans la liste sur les
    commentaires dont on est l'auteur quand il y a eu une nouvelle
    activité (commentaire, changement de statut, résolution) depuis la
    dernière visite.
  - Les actions "Modifier" ont été remplacées par deux boutons
    principaux : **Ajouter un commentaire** et **Modifier** — les
    testeurs vont commenter bien plus souvent que modifier le rapport
    original.

## v1.9.0 — 2026-08-07

- Corrige un vrai bug rapporté : le menu ☰ affichait toujours "Benoit"
  peu importe qui était connecté (`meId` était figé en dur au lieu de
  résoudre le vrai compte connecté). Utilise maintenant la même
  résolution "qui suis-je" que le reste de l'app — chacun voit son
  propre profil.
- Nouveau : **Commentaires**, un système de retour intégré et léger
  (accessible via le menu ☰, pas dans la navigation du bas — c'est un
  outil de support, pas une fonctionnalité de golf) :
  - Créer un commentaire : Bug / Idée / Amélioration, titre,
    comportement actuel/attendu, notes optionnelles.
  - Liste filtrable par type (Tous/Bugs/Idées/Améliorations) et par
    statut (Tous/Nouveau/En cours/Résolu), plus récent en premier.
  - L'auteur peut modifier son propre commentaire tant qu'il est
    "Nouveau" ; une fois "En cours", seul l'administrateur (le
    développeur) peut le modifier ou changer son statut.
  - Suppression : l'administrateur peut tout supprimer ; un utilisateur
    normal ne peut supprimer que son propre commentaire, et seulement
    avant qu'il ne soit pris en charge.
  - Version de l'app, plateforme (Android/iPhone/Web) et informations
    de l'appareil enregistrées automatiquement à la soumission — jamais
    modifiables par l'utilisateur.
  - Les commentaires "Résolu" restent dans l'historique, jamais
    supprimés automatiquement.

## v1.8.0 — 2026-08-07

- Nouveau : **Dépenses de la partie**. Chaque ronde (active ou terminée)
  a maintenant une section "Dépenses" — ajoute qui a payé quoi (terrain,
  bières, etc.), sélectionne qui partage la dépense (tous les joueurs de
  la ronde par défaut, décochables individuellement), et Golfyeah!
  calcule automatiquement :
  - le total dépensé et ce que chacun a payé,
  - **Régler les comptes** : le plan de remboursement le plus simple
    possible (minimise le nombre de transactions), ex. "Sam doit 30 $ à
    François".
- Chaque dépense se modifie ou se supprime en la retouchant dans la
  liste. Tous les calculs monétaires se font en cents (entiers), jamais
  en nombres à virgule flottante — les soldes retombent toujours
  exactement à zéro, sans dérive d'arrondi.
- Les dépenses s'enregistrent automatiquement comme les scores ; quitter
  et reprendre une partie active les conserve. Abandonner une partie
  supprime aussi ses dépenses.
- Montants affichés en dollars canadiens (ex. "45,00 $").

## v1.7.0 — 2026-08-07

- **Nouvelle partie** est maintenant un seul écran adaptatif au lieu de
  deux flux séparés. Un sélecteur "Type de partie" (Golf extérieur / Golf
  intérieur simulateur) en haut de l'écran fait apparaître la bonne suite
  automatiquement :
  - **Extérieur** : inchangé (Terrain, Format, Joueurs).
  - **Intérieur** : Lieu + Parcours simulé (optionnel), Format, puis une
    case "Configurer les trous pendant la partie" (cochée par défaut).
    Cochée → les pars/distances se demandent trou par trou en jouant,
    comme avant. Décochée → la grille complète des trous (par/distance)
    apparaît directement sur cet écran pour tout configurer maintenant.
- **Réutilisation automatique** : si le lieu + parcours simulé saisis
  correspondent (à la casse/espaces près) à un parcours déjà enregistré,
  Golfyeah! le réutilise directement — pas de liste à parcourir, pas de
  configuration à refaire.
- Retire l'écran "Partie intérieure rapide" séparé (`/nouvelle-partie/
  interieur-rapide`) — tout est maintenant dans l'écran Nouvelle partie.
- La grille par/distance est maintenant un composant partagé
  (`HolesGrid`) réutilisé par "Ajouter un terrain" et par le nouveau flux
  intérieur "configurer maintenant", au lieu d'être dupliquée.

## v1.6.0 — 2026-08-07

- Nouveau : **Partie intérieure rapide**. Depuis "Nouvelle partie", un
  nouveau lien lance une partie de golf intérieur/simulateur avec un
  formulaire minimal (lieu, parcours simulé optionnel, 9/18 trous,
  joueurs) — plus besoin d'entrer 18 pars et distances avant de jouer.
- Le par de chaque trou est demandé une seule fois, la première fois que
  tu l'atteins (gros boutons Par 3/4/5, distance facultative), intégré
  directement dans l'écran de score en direct — pas de formulaire séparé.
  Le score du trou n'est disponible qu'une fois le par entré.
- Le parcours se construit progressivement pendant que tu joues. À la fin
  de la partie, si c'était une partie rapide, Golfyeah! propose
  d'enregistrer le parcours pour le rejouer plus tard (pars et distances
  préchargés, toujours modifiables trou par trou).
- Les parcours rapides non enregistrés restent invisibles dans la liste
  normale des terrains — la création de terrain complète existante n'a
  pas changé.
- Corrige un bug de connexion réel : le navigateur réutilisait
  silencieusement le dernier compte Google connecté, sans possibilité
  d'en choisir un autre — un compte non autorisé menait à une boucle
  déconnexion/reconnexion sans issue. La sélection de compte Google
  s'affiche maintenant systématiquement, et l'écran d'erreur de
  synchronisation indique maintenant l'email connecté avec un bouton
  "Essayer un autre compte Google".

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
