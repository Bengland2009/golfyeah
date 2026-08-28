# Golfyeah! — instructions persistantes

## Versionnement (règle permanente)

Format : `MAJEURE.FONCTIONNALITÉ.ITÉRATION` (ex. `2.2.4`).

**Source officielle unique** : le champ `"version"` de `package.json`.
Tout le reste en dépend et doit rester synchronisé :
- `vite.config.js` l'injecte au build dans `__APP_VERSION__`.
- `src/lib/version.js` l'exporte comme `APP_VERSION`.
- `AppMenu.jsx` et le module Commentaires (`NewFeedback.jsx`,
  `FeedbackDetail.jsx`) l'affichent/l'enregistrent.
- `CHANGELOG.md` doit avoir une entrée `## vX.Y.Z — AAAA-MM-JJ` en tête
  de fichier pour chaque nouvelle version.

Ne jamais créer une deuxième source de vérité pour le numéro de version.

### Troisième chiffre — itération en cours

Pendant le développement ou la correction d'une fonctionnalité,
augmenter **uniquement le troisième chiffre** à chaque livraison
contenant une modification réelle du code.

Exemple à partir de `2.2.0` : première modification → `2.2.1` ;
deuxième ajustement → `2.2.2` ; troisième ajustement → `2.2.3`.

- Une demande contenant plusieurs petits correctifs mais livrée en une
  seule intervention ne compte que comme **une seule** itération.
- N'augmente pas la version pour une analyse, une discussion ou une
  intervention sans changement de code.

### Deuxième chiffre — fonctionnalité validée

Lorsque Benoit confirme **explicitement** que la fonctionnalité est
terminée, satisfaisante ou validée : augmenter le deuxième chiffre et
remettre le troisième à zéro (ex. `2.2.4` → `2.3.0`).

Ne jamais décider soi-même qu'une fonctionnalité est validée — attendre
une confirmation explicite de Benoit.

### Premier chiffre — version majeure

Ne jamais modifier le premier chiffre sans une demande explicite de
Benoit.

### Application technique

- Au début de chaque intervention, vérifier la version actuelle dans
  `package.json`.
- À la fin de chaque intervention avec changement de code, indiquer
  clairement : `ancienne version → nouvelle version`.
- N'effectuer aucune modification rétroactive des anciennes versions
  sans demande explicite.
