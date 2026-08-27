# Changelog

Toutes les versions notables de Golfyeah! sont documentées ici.

## v1.40.0 — 2026-08-27

- **Vue de face affinée dans Adresse & contact.** Le pictogramme principal
  (épaules, bâton, balle, pieds, pression) avait des traits trop épais et
  des pieds représentés par de grosses ellipses pleines. Les lignes sont
  maintenant plus fines, les pieds sont des icônes plus petites et plus
  légères (silhouette en dôme), et surtout — l'orientation gauche/droite
  est inversée pour correspondre à la logique du reste de la page : le
  pied avant (gauche) est maintenant à gauche, le pied arrière (droit) à
  droite, cohérent avec « on frappe vers la gauche ». Toutes les données
  affichées (pression, position de balle, inclinaison des épaules)
  restent exactes — seule leur orientation et leur style visuel changent.

## v1.39.0 — 2026-08-27

- **Correction de l'orientation des pieds dans la vue du dessus.** Les
  chaussures pointaient dans le mauvais sens : le talon était placé côté
  cible et la pointe s'éloignait vers le bas de l'écran. C'est maintenant
  l'inverse — la pointe du pied pointe vers la ligne de jeu/la balle
  (vers l'avant du golfeur), et le talon se trouve en bas (côté arrière
  du joueur), ce qui se lit enfin comme la vraie vue du golfeur derrière
  sa balle. Les silhouettes de chaussure sont aussi plus reconnaissables
  (bout de pied arrondi et talon distincts, en deux tons). Aucun autre
  changement — logique gauche/droite, cible à gauche, angles ~25°/~10° et
  tout le reste de la page restent identiques.

## v1.38.0 — 2026-08-27

- **Vue du dessus agrandie et plus lisible dans Adresse & contact.** Les
  pictogrammes de pieds sont maintenant de vraies silhouettes de bottine
  vues du dessus (talon étroit, avant-pied arrondi, liseré au collet et à
  la pointe) plutôt que de simples ovales. La vue est agrandie pour rester
  utile sur mobile, avec plus d'espace entre les pieds, la balle, les
  angles et les libellés — plus aucun élément ne se touche. La balle est
  maintenant clairement séparée des pieds, positionnée devant la ligne des
  talons (pas collée aux chaussures). Chaque pied porte désormais un
  libellé « avant »/« arrière » en plus de son angle (« 25° »/« 10° »), et
  une note « repère de départ » précise que ces angles ne sont pas des
  règles absolues. Logique spatiale inchangée (cible à gauche, pied avant
  à gauche, pied arrière à droite) — seule la taille et la lisibilité
  changent.

## v1.37.0 — 2026-08-27

- **Vue du dessus corrigée dans Adresse & contact.** La vue du dessus
  (onglet Adresse, Driver et Fer 7) montre maintenant deux vraies
  empreintes de pied au lieu d'une simple barre plate. Elle se lit comme
  la vue du golfeur lui-même : caméra derrière le joueur droitier, cible
  à gauche, pied gauche (avant) à gauche, pied droit (arrière) à droite,
  léger V (pied gauche ouvert ~25° vers la cible, pied droit ~10°), avec
  petits arcs et libellés d'angle présentés comme repère de départ. La
  position de la balle reste inchangée (juste à l'intérieur du talon
  gauche pour le Driver, légèrement devant le centre pour le Fer 7).
  Aucun autre élément touché — boutons, onglets, cartes d'info, vue de
  face et schémas Arc et contact sont identiques.

## v1.36.0 — 2026-08-26

- **Adresse & contact : lecture plus rapide, mobile plus confortable.**
  Un bloc « À retenir » (3 points très courts) apparaît maintenant avant
  le schéma pour chaque bâton/onglet. Le schéma visuel est plus compact
  (largeur limitée, labels plus lisibles) pour ne plus dominer l'écran, et
  les légendes sous le schéma sont raccourcies. Les cartes d'information
  affichent maintenant leur valeur en plus gros/gras pour rester
  scannables d'un coup d'œil. Les onglets Adresse / Arc et contact sont
  plus compacts (hauteur, padding et ombre réduits), et les bâtons
  verrouillés (B/H, Chip) sont plus discrets (texte plus pâle, bordure
  plus légère, cadenas plus petit). Un encadré « Driver vs Fer 7 » en bas
  de page résume la différence principale entre les deux bâtons. Aucun
  changement au contenu technique — seulement à sa présentation.

## v1.35.0 — 2026-08-26

- **Nouvelle sous-section « Adresse & contact » dans Pratique.** Une fiche
  visuelle rapide à consulter au range ou au simulateur : comment se
  placer à l'adresse, et comment le bâton doit entrer en contact avec la
  balle, bâton par bâton. Un sélecteur de bâton (Driver, Fer 7 —
  disponibles; B/H et Chip — verrouillés, affichés honnêtement comme à
  venir) et deux onglets (Adresse / Arc et contact), chacun avec un
  diagramme et 2-3 cartes d'information courtes. Accessible depuis
  Pratique, au même niveau que Plan d'entraînement, Mes distances et
  Caddie.

## v1.34.0 — 2026-08-23

- **Le Plan d'entraînement propose des formats de séance, plus des
  durées.** Les choix 30 / 60 / 90 min laissaient croire que la durée
  était ce qui comptait le plus dans une séance de pratique — ce n'est
  pas ce que les pros et enseignants mettent de l'avant. Ce qui compte :
  une séance courte, structurée, avec une cible claire, une routine, un
  test mesurable et des notes en fin de séance. Le picker « Durée »
  devient donc « Format », avec trois choix : Express (20 min), Standard
  (30 min, recommandé par défaut) et Longue (45 min). 90 minutes n'est
  plus proposé pour une séance de range normale — avec 90 minutes,
  Golfyeah suggère plutôt de jouer 9 trous au simulateur.

  Chaque format est une structure pensée pour ce format (échauffement,
  exercice principal, test), pas une longue séance rétrécie
  proportionnellement — Express, Standard et Longue ont chacun leur
  propre contenu.

  En mode parcours (simulateur), le picker de durée est remplacé par un
  choix de format de ronde : « 9 trous sérieux » (disponible) et
  « 18 trous » (affiché honnêtement comme à venir, pas encore
  sélectionnable — Golfyeah n'a pas encore de contenu validé pour 18
  trous).

## v1.33.0 — 2026-08-22

- **Les séances du Plan d'entraînement deviennent des fiches guidées.** Une
  carte de séance comme « Contact solide » n'affiche plus seulement un
  objectif et un principe abstraits — elle montre directement quoi faire :
  « À faire » (jusqu'à 4 lignes concrètes — bâton, nombre de balles,
  précision) et « À noter » (les 2 éléments à observer en fin de séance).
  L'écran détaillé après « Commencer » suit maintenant chaque séance étape
  par étape : durée, bâton, nombre de balles, instructions et éléments à
  observer pour chaque étape, plutôt qu'une simple liste de points.

  Chaque séance a maintenant une structure interne (`steps`) avec bâton,
  nombre de balles, instructions et observations par étape, au lieu de
  blocs de texte libre. Sur une durée plus courte, Golfyeah retire d'abord
  les étapes optionnelles (jamais les étapes essentielles) avant de
  raccourcir le temps de celles qui restent — la structure validée n'est
  jamais réinventée, seulement adaptée. Aucun changement à la logique de
  progression (niveaux, critères de réussite) : seule la présentation des
  séances change.

## v1.32.1 — 2026-08-21

- **Le critère « Jeu réel » n'est plus automatiquement réussi.** Correctif
  du gap signalé après la dernière mise à jour : compléter une séance
  « 9 trous sérieux », « Parcours imaginaire au range » ou « Gestion de
  partie » comptait comme une réussite dans tous les cas. Quatre nouveaux
  champs apparaissent maintenant sur le formulaire de fin de séance
  uniquement pour ces trois séances : 9 trous complétés (Oui/Non),
  mulligans utilisés, coups recommencés, notes de ronde honnêtes
  (Oui/Non). Le critère de Jeu réel exige désormais que les quatre soient
  respectés exactement (9 trous complétés = Oui, 0 mulligan, 0 coup
  recommencé, notes honnêtes = Oui) — un champ laissé vide ne compte
  jamais comme une réussite silencieuse.

  Le critère de Répétition confirme maintenant qu'une séance était bien
  une séance à bâtons multiples via le gabarit de la séance elle-même
  (« Cibles et direction » couvre déjà PW à Driver), plutôt que de se
  fier uniquement au contact général reporté.

## v1.32.0 — 2026-08-21

- **Logique de progression transparente dans le Plan d'entraînement.** La
  carte « Priorité actuelle » explique maintenant clairement pourquoi
  cette priorité est choisie (« Pourquoi ? »), ce qu'il faut atteindre
  pour avancer (« Objectif pour avancer »), et où en est le joueur
  (« Progression : X / 2 séances réussies »). La règle est désormais
  « 2 séances réussies sur les 3 dernières » — jamais une seule bonne
  séance ne suffit — et surtout, **atteindre le critère ne fait plus
  avancer automatiquement** : Golfyeah affiche « Prêt pour la prochaine
  étape » avec deux boutons, Passer à [niveau suivant] ou Continuer
  [niveau actuel], et le joueur choisit. La priorité ne change que sur
  ce tap explicite, jamais toute seule.

  Les niveaux (Contact, Direction, Répétition, Driver jouable, Jeu réel)
  ont chacun un critère basé sur une vraie donnée reportée en fin de
  séance : bons contacts au fer 7, balles dans le corridor, contact
  général, drives jouables — quatre nouveaux champs numériques
  s'ajoutent au formulaire de fin de séance (déjà partagé par toutes les
  séances) pour rendre ça possible.

## v1.31.0 — 2026-08-21

- **Progression par compétences dans le Plan d'entraînement.** Le plan
  affiche maintenant une carte « Priorité actuelle » (Contact → Direction
  → Répétition → Driver jouable → Mode parcours), avec un « Pourquoi ? »
  et le critère simple pour passer au niveau suivant (ex. « environ 6
  bons contacts sur 10 au fer 7 »). La priorité avance automatiquement
  à partir des séances complétées et de leurs notes — jamais un
  calendrier figé, jamais une obligation : les séances compatibles avec
  le contexte du jour restent toutes accessibles, la séance recommandée
  n'est qu'une suggestion mise en évidence (bordure verte, section
  « Séance recommandée » séparée des « Autres séances utiles »).

  La même priorité s'adapte au contexte du jour plutôt que d'être
  dupliquée : au niveau « Mode parcours », Golfyeah recommande « Parcours
  imaginaire au range » si tu pratiques au range, ou « 9 trous sérieux »
  si tu es au simulateur en mode parcours.

  Les notes de fin de séance changent pour capter ce dont la progression
  a besoin : Bons contacts /10 et Balles jouables /10 remplacent les
  anciens champs libres « ce qui a bien/moins bien été » — ce sont les
  deux seules données que Golfyeah utilise pour calculer automatiquement
  quand un niveau est atteint.

## v1.30.0 — 2026-08-21

- **Nouvelle logique de lieu dans le Plan d'entraînement.** Le choix « Où
  je pratique » mélangeait trois concepts différents (Range, Intérieur,
  Simulateur) ; il redevient les deux vraies réponses possibles : Range
  extérieur ou Simulateur — deux gros choix clairs. Si Simulateur est
  choisi, une deuxième question apparaît : Mode range ou Mode parcours,
  puisque c'est ce que l'utilisateur *fait* au simulateur qui détermine
  les séances pertinentes, pas le lieu seul.

  La bibliothèque de séances s'agrandit en conséquence (toujours « à
  valider », aucune ne prétend être validée sans source réelle) :
  **Range extérieur** — Contact solide, Cibles et direction, Driver
  jouable, Parcours imaginaire au range. **Simulateur + Mode range** —
  Contact solide, Cibles et direction, Driver jouable, Distances carry,
  Dispersion gauche/droite (ces trois dernières exploitent les mesures
  du simulateur — carry, dispersion — impossibles à obtenir sur un
  vrai range). **Simulateur + Mode parcours** — 9 trous sérieux, Gestion
  de partie.

  La durée (30/60/90 min) reste un choix, mais seulement après le lieu
  (et le mode si simulateur) — jamais en premier.

## v1.29.1 — 2026-08-21

- **Refonte ergonomique du Plan d'entraînement.** L'écran passait pour un
  formulaire vide ; il devient un outil de départ rapide. L'intro se
  réduit à une phrase, une carte « Je pratique maintenant » regroupe le
  choix du lieu et de la durée en chips compactes (fond vert pâle,
  bordure verte, coche discrète à la sélection — visible en une seconde),
  et les séances compatibles s'affichent immédiatement en dessous dès
  que les deux choix sont faits, sans grand état vide. Chaque carte de
  séance est maintenant l'élément principal de la page : titre, durée ·
  lieu, objectif et principe en une ligne chacun, statut de validation,
  et un bouton « Commencer » explicite. « Notes de progression » descend
  en bas de page dans une carte compacte plutôt que de dominer l'écran
  avant même la première séance.

## v1.29.0 — 2026-08-21

- **Le Plan d'entraînement propose des séances validées au lieu d'un
  programme inventé.** Remplace le calendrier « semaine active » sur 4
  semaines par une bibliothèque fixe de 4 séances (Contact, Cibles,
  Parcours simulé, 9 trous sérieux), chacune avec un objectif, un
  principe d'entraînement, une structure, et un statut de validation
  honnête. Aucune des 4 séances de départ n'affiche « recommandée par
  des pros » : sans source ou coach documenté derrière, elles portent le
  badge « À valider » plutôt qu'une fausse caution.

  À l'ouverture, l'utilisateur choisit où il pratique (range extérieur,
  golf intérieur — mode range, ou simulateur — parcours) et le temps
  disponible (30/60/90 min) ; seules les séances compatibles avec ces
  deux choix s'affichent. Une séance plus courte reste la même
  structure validée, seulement retimée proportionnellement (mêmes blocs,
  mêmes exercices, juste moins de minutes chacun) — jamais une séance
  différente. Le principe, le statut de validation, la durée et le lieu
  compatible s'affichent discrètement sur chaque séance.

  Les notes après séance sont maintenant les mêmes six champs partout
  (ce qui a bien été, ce qui a moins bien été, erreur dominante, bâton
  le plus/moins fiable, priorité pour la prochaine séance), au lieu de
  champs différents par séance — un seul formulaire à apprendre.
  L'historique (« Notes de progression ») affiche le lieu et la durée
  choisis plutôt qu'un numéro de semaine.

## v1.28.0 — 2026-08-21

- **Nouvelle sous-section « Plan d'entraînement » dans Pratique.** Un
  plan simple sur 4 semaines pour améliorer le contact, la direction et
  la répétabilité des coups — pensé pour être ouvert rapidement au range
  ou au simulateur, suivi pendant 60 minutes, puis fermé. La page
  d'accueil du plan affiche l'objectif général, la semaine active (avec
  sa question-repère), la progression sur les 4 semaines, la prochaine
  séance recommandée et un accès direct aux trois séances (A — Technique
  au range, B — Précision au range, C — Simulateur) ainsi qu'aux notes
  de progression. Chaque séance se présente en sections repliables
  (accordéons) plutôt qu'un long texte, avec un court formulaire « À
  noter après la séance » et un bouton « Marquer comme complétée ».
  Les notes sont sauvegardées dans un historique consultable et
  supprimable ; le nombre de séances complétées, la dernière séance et
  la prochaine suggérée se recalculent automatiquement à chaque
  complétion — semaine active comprise, qui avance toutes les 3
  séances (une rotation complète A/B/C).

## v1.27.0 — 2026-08-21

- **Scorecard premium sur l'écran Résumé.** La grille de pointage était
  un simple tableau de chiffres ; elle prend maintenant la forme d'une
  vraie carte de pointage golf. Colonnes Total et +/- ajoutées et mises
  en évidence par un léger lavis vert, ligne « Par » distincte avec fond
  tinté, noms des joueurs en gras, lignes de séparation claires entre
  chaque joueur, et une rangée « Putts » secondaire et discrète sous
  chaque score (masquée quand la ronde n'a pas de données de putts). La
  première colonne (Trou/Par/joueurs) reste fixe au défilement horizontal
  sur mobile. Le nouveau composant `Scorecard` est partagé avec l'écran
  d'édition (« Modifier la partie ») : mêmes lignes, mais scores, pars et
  putts y deviennent directement modifiables dans la grille, avec Total
  et +/- qui se recalculent en direct pendant la saisie.

## v1.26.0 — 2026-08-21

- **Modifier une partie déjà terminée.** Un lien « Modifier la partie »
  sur l'écran Résumé ouvre maintenant une scorecard éditable : scores et
  putts par trou (dans une grille identique à la saisie manuelle), pars,
  mulligans, balles perdues et bières par joueur, ainsi que le terrain et
  le nombre de trous. Une erreur de saisie après coup — un coup mal
  entré, une bière oubliée — ne demande plus de supprimer la partie et
  de la recréer. Le format ne peut être agrandi (9→18) que si les
  nouveaux trous sont complétés (mêmes pars/scores requis qu'à la
  création) ; le rétrécir (18→9) est toujours possible. Avant
  d'enregistrer, un message rappelle que les statistiques et le
  classement seront recalculés automatiquement — et c'est le cas partout
  (classement, faits marquants, profils, moyennes de saison, filtres
  extérieur/simulateur) puisque tout se calcule à la volée à partir des
  données de la ronde, sans étape manuelle. Les dépenses restent
  modifiables directement sur le Résumé, comme avant.

## v1.25.1 — 2026-08-21

- **Correctif : score relatif au par incorrect sur les rondes de 9 trous.**
  Le calcul du +/- par rapport au par sommait à tort les pars de *tous*
  les trous enregistrés pour un terrain, même quand seuls les 9 premiers
  avaient été joués — un terrain à 18 trous jouée en 9 trous affichait
  donc un score relatif basé sur un par 72 (ou une valeur incohérente)
  au lieu du vrai par des trous 1 à 9. Le calcul utilise maintenant
  systématiquement la somme des pars des trous réellement joués sur
  cette ronde précise, tirée des données du terrain enregistré (aucune
  valeur fixe comme 36 ou 72 n'est présumée). Corrigé partout où ce
  calcul apparaît : résumé de ronde, liste des parties, classement,
  dernière partie, profils des joueurs et faits marquants.

## v1.25.0 — 2026-08-21

- **Modifier une partie en cours.** Un nouveau lien « Modifier la partie »,
  accessible à tout moment pendant une ronde active, permet de changer le
  terrain, le nombre de trous et le nom de la partie sans l'abandonner.
  Particulièrement utile sur simulateur, où il est fréquent de ne pas
  terminer un 18 trous : la partie peut maintenant être convertie en 9
  trous à tout moment (une confirmation prévient que les données des
  trous 10 à 18 seront définitivement supprimées), ou repassée de 9 à 18
  trous si on décide finalement de continuer — les trous 10 à 18 restent
  alors à configurer au fur et à mesure, comme pour n'importe quel trou
  manquant. Toutes les statistiques (coups, mulligans, balles perdues,
  putts, bières) se recalculent automatiquement à partir des trous
  conservés, sans étape supplémentaire. Cette option disparaît une fois
  la ronde enregistrée : le format d'une partie terminée ne peut plus
  être modifié.

## v1.24.1 — 2026-08-16

- **Raffinement de la fiche Golf, style Apple Plans / Airbnb.** Bannière
  photo 16:9 plein cadre entre le titre et le bandeau (un dégradé vert
  de marque s'affiche tant qu'aucune vraie photo n'existe — chaque
  fiche a toujours une bannière). Sous-titre compact sous le nom
  (« Montréal • Simulateur intérieur • 5 baies »). Les caractéristiques
  passent d'une liste à puces à une grille 2×2 avec petites icônes. Le
  bandeau « apportez votre bière » devient « BYOB — Apportez votre
  propre bière », plus convivial qu'un avertissement. Les heures
  tiennent maintenant sur une ligne compacte par plage (« 12 h – 21 h
  (dim-jeu) »). Boutons Réserver/Itinéraire légèrement plus fins.

## v1.24.0 — 2026-08-16

- **Nouvelle section « Golf » dans le menu.** Regroupe les fiches des
  terrains et simulateurs que le groupe visite régulièrement, au format
  carte de visite : toutes les infos utiles en un coup d'œil (ville,
  type, aspects pratiques, adresse, heures), sans texte marketing.
  Premier établissement ajouté : **Golf en Ville Montréal**, avec sa
  mention « Apportez votre propre bière » mise en évidence. Le bouton
  Itinéraire ouvre l'adresse dans Google Maps ; le bouton Réserver est
  prêt visuellement, en attente d'un lien de réservation.

## v1.23.1 — 2026-08-16

- **Raffinement premium de l'accueil.** Les cartes « En vedette » sont
  plus compactes (près de 3 visibles à l'écran, pour inviter au
  défilement) et leur hiérarchie s'inverse : le record — le chiffre —
  devient la vedette, en grand et coloré, avec le nom du joueur en
  dessous. Les 8 trophées ont des noms plus variés et moins répétitifs
  (Précision au putting, Chasseur de birdies, 19e trou, Toujours
  partant, En pleine ascension, Roi du mulligan…). Le sous-titre devient
  « Saison complète ». La carte « Dernière partie » affiche maintenant
  un petit repère sobre (Extérieur/Simulateur · nombre de trous), et les
  espacements verticaux de la page sont resserrés pour une meilleure
  densité sans surcharger l'écran.

## v1.23.0 — 2026-08-16

- **« En vedette » remplace « Faits marquants ».** Un carrousel
  horizontal de 8 trophées (Meilleure ronde extérieure, Champion
  intérieur, Meilleure moyenne de putts, Plus de birdies, Plus de
  bières, Plus de rondes jouées, Plus grande progression, Plus de
  mulligans) raconte l'histoire de la saison. Contrairement au
  classement, cette section combine toujours l'extérieur et le
  simulateur — elle ne suit pas le filtre Extérieur/Simulateur/Tous, qui
  reste réservé au classement officiel. Un trophée ne s'affiche que s'il
  y a une vraie donnée derrière (jamais un « champion » à zéro par
  défaut).
- **Le filtre de l'accueil suit maintenant le joueur jusqu'à son
  profil.** Extérieur/Simulateur/Tous est partagé entre l'accueil et
  les profils de joueurs — un sélecteur identique apparaît aussi sur le
  profil, et ses statistiques (moyenne, rondes, parties récentes, etc.)
  se recalculent selon le filtre actif.

## v1.22.0 — 2026-08-16

- **Filtre Extérieur / Simulateur / Tous sur l'accueil.** Un sélecteur
  apparaît juste sous « Classement · saison » pour ne plus mélanger les
  statistiques de terrain et de simulateur : classement, moyenne,
  nombre de rondes, dernière partie et faits marquants se recalculent
  instantanément selon le filtre choisi, sans quitter la page. « Extérieur »
  est la vue par défaut à l'ouverture (le classement officiel de
  Golfyeah!), « Simulateur » sert à consulter ses performances
  hivernales, et « Tous » combine les deux.

## v1.21.1 — 2026-08-16

- **Saisie des putts par sélecteur dans Entrée rapide.** La rangée
  Putts n'est plus un champ de texte ambigu : chaque case se touche et
  ouvre une petite feuille avec les choix 0 / 1 / 2 / 3 / 4+. Un tap
  sélectionne et referme automatiquement — aucun clavier numérique ne
  s'ouvre. La case prend un fond vert pâle une fois renseignée, pour
  voir en un coup d'œil quels trous restent à compléter. Même
  mécanique que le sélecteur de par déjà présent sur cet écran.

## v1.21.0 — 2026-08-16

- **Putts par trou dans Entrée rapide.** Une rangée compacte « Putts »
  apparaît maintenant directement sous le score de chaque joueur, dans
  le même tableau que Trou/Par/Score — les colonnes restent parfaitement
  alignées, sans effet feuille de calcul (pas de bordures, texte plus
  petit et discret). Le total de putts se calcule automatiquement dans
  la carte Résultats et alimente les statistiques du joueur comme les
  scorecards, exactement comme les rondes jouées En direct.

## v1.20.1 — 2026-08-16

- La bande de progression des trous est maintenant aussi visible en
  haut de l'écran **En direct** (la scorecard trou par trou), pas
  seulement dans le Golf Tracker — même comportement : recentrage
  automatique sur le trou courant, tap pour sauter à un trou. Sur une
  partie à plusieurs joueurs, elle reflète la progression du joueur
  connecté.

## v1.20.0 — 2026-08-16

- **Mini scorecard de progression dans le Golf Tracker.** Une bande
  discrète et défilable apparaît maintenant juste sous l'en-tête,
  montrant tous les trous de la ronde d'un coup d'œil : résultat vs par
  pour les trous terminés (coloré selon la convention habituelle), un
  point ● pour le trou en cours (mis en évidence), un tiret pour les
  trous à venir. La bande se recentre automatiquement sur le trou
  courant, et chaque case est tapable pour sauter directement à ce
  trou — pratique pour corriger un trou précédent sans repasser par
  tous les trous intermédiaires.

## v1.19.0 — 2026-08-16

- **Suppression d'une ronde depuis le profil.** Dans « Parties
  récentes », chaque ronde a maintenant un bouton ⋮ qui ouvre une
  confirmation claire (« Supprimer cette ronde ? ») avec Annuler et
  Supprimer la ronde (rouge, destructif). Une fois confirmée, la
  suppression est irréversible et met à jour automatiquement — sans
  action supplémentaire — la moyenne vs par, le score moyen, la
  meilleure ronde, le nombre de rondes, les putts, mulligans, balles
  perdues et bières, ainsi que le classement général, pour tous les
  joueurs ayant participé à cette ronde.

## v1.18.3 — 2026-08-16

- **Fenêtre de fin de trou repensée en écran de confirmation.** Elle
  n'affiche plus un formulaire à remplir : les putts, mulligans, balles
  perdues et bières déjà enregistrés pendant le jeu sont simplement
  résumés en lecture seule. Le bouton **Trou suivant** est immédiatement
  disponible — le cas normal ne demande plus aucune saisie. Un lien
  discret **Modifier les statistiques** ouvre les compteurs (putts en
  choix rapide, mulligans/balles perdues avec +/−, bières) uniquement
  quand une correction est nécessaire.

## v1.18.2 — 2026-08-16

- **Golf Tracker, second passage de raffinement** :
  - Le score affiche maintenant son unité ("coups"/"coup") directement
    sous le chiffre, pour un contexte immédiat.
  - Le bouton "+1 Putt" disparaît en tant que bouton séparé : la
    pastille de putts elle-même devient l'action (un petit "+" l'indique
    clairement). Il ne reste donc qu'une seule action principale à
    l'écran — le gros bouton "+1 Coup" — au lieu de deux boutons qui se
    faisaient compétition.
  - "Terminer le trou" est maintenant clairement séparé du reste :
    davantage d'espace au-dessus et un bouton contenu à part entière,
    plutôt qu'une simple rangée dans le bas de l'écran.
  - L'en-tête affiche désormais "Trou X de 18" et une fine barre de
    progression sous le bandeau, pour situer où on en est dans la
    ronde sans surcharger l'écran.

## v1.18.1 — 2026-08-16

- **Refonte premium du Golf Tracker.** Hiérarchie visuelle repensée de
  fond en comble, dans l'esprit d'une application haut de gamme (Apple,
  WHOOP, Oura) : une seule information dominante (le score, très grand),
  un indicateur de putts discret mais toujours visible juste en dessous,
  un unique bouton principal **+1 Coup** en cercle plein, et **+1 Putt**
  en pilule contour nettement plus léger. L'en-tête de trou est
  raccourci. Annuler, Modifier le score et Terminer le trou deviennent
  des actions secondaires en texte simple (plus de gros bouton vert pour
  terminer le trou), avec beaucoup plus d'espace blanc partout. Le
  comportement (tap, annulation, édition, feuille de fin de trou) reste
  identique — seule la mise en page change.

## v1.18.0 — 2026-08-16

- **Suivi des putts** ajouté partout où les coups sont enregistrés :
  - Golf Tracker garde un seul écran pendant le jeu, avec deux boutons
    toujours visibles : **+1 Coup** (n'importe quel coup) et **+1 Putt**
    (un putt est aussi un coup, donc il incrémente les deux à la fois).
    Aucun changement de mode requis.
  - En appuyant sur **Terminer le trou**, une feuille de confirmation
    s'ouvre avant de passer au trou suivant : score du trou, choix
    rapide du nombre de putts (0/1/2/3/4+, plafonné au score du trou),
    mulligan, balle perdue et bières — le tout saisi après coup plutôt
    que pendant le jeu.
  - La scorecard **En direct** garde son propre compteur de putts,
    synchronisé avec le Golf Tracker puisque les deux s'appuient sur la
    même donnée de trou.
  - Les putts sont maintenant enregistrés trou par trou et disponibles
    partout : sommaire de partie, historique, profil des joueurs
    (nouvelle statistique "Putts") et Entrée rapide (total de putts par
    joueur).

## v1.17.3 — 2026-08-09

- Le point d'entrée vers le **Golf Tracker** (écran En direct) devient
  un vrai bouton d'action au lieu d'un simple texte vert : pilule avec
  icône de balle de golf, libellé "Compter les coups" en texte foncé,
  et un chevron pour indiquer clairement la navigation vers un écran
  dédié. Reste discret par rapport au score et au bouton "Trou
  suivant".

## v1.17.2 — 2026-08-09

- Finitions supplémentaires sur **Nouvelle partie** :
  - Le résumé devient un véritable état de validation : "Prêt à
    commencer" avec le terrain, le nombre de joueurs, le format et le
    mode de saisie, chacun avec une icône, sur fond vert une fois la
    configuration complète.
  - Tant que la configuration est incomplète, un message guide
    directement l'utilisateur ("Sélectionne au moins un joueur.",
    "Choisis un terrain.", "Nomme ton parcours de simulateur.") à la
    même place — le bouton "Commencer la partie" ne s'active qu'une
    fois tout complété.
  - La carte de chaque joueur est maintenant entièrement cliquable
    (photo, nom ou espace autour) au lieu de seulement l'avatar.
  - "+ Ajouter un joueur" / "+ Ajouter un terrain" légèrement agrandis
    (40px) pour bien se distinguer comme actions secondaires.
  - Le chevron du sélecteur de terrain est remplacé par une icône plus
    visible indiquant clairement une liste déroulante.

## v1.17.1 — 2026-08-09

- Raffinements UX sur **Nouvelle partie** :
  - Sélection des joueurs plus lisible : contour vert, fond subtil,
    légère ombre et petite coche discrète sur les joueurs sélectionnés.
  - **Terrain** (extérieur) devient un sélecteur compact ("Golf de la
    Vallée / Saint-Sauveur, QC ▾") au lieu d'une grande carte —
    touche pour choisir parmi les terrains dans une feuille.
  - **Mode de saisie** devient aussi un sélecteur compact ("En direct
    ▾") plutôt que deux gros boutons toujours visibles — réduit le
    nombre de décisions affichées d'emblée, "Entrée rapide" reste à
    un tap.
  - "+ Ajouter un joueur" et "+ Ajouter un terrain" sont maintenant de
    petits boutons secondaires cohérents avec le reste de l'app.
  - Le bouton **Commencer la partie** est maintenant sticky au bas de
    l'écran (au-dessus de la barre de navigation), toujours visible
    sans avoir à défiler.
  - Résumé compact juste au-dessus du bouton ("Extérieur · Golf de la
    Vallée · 18 trous · 2 joueurs · En direct") pour confirmer d'un
    coup d'œil avant de lancer la partie.
  - Espacement resserré entre les sections — la configuration complète
    d'une partie extérieure tient maintenant sur un seul écran.

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
