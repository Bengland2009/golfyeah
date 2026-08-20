import { TrophyIcon, MonitorIcon, TargetIcon, FlagIcon, BeerIcon, GolfBallIcon, TrendingUpIcon, RedoIcon } from './icons';
import { bestRound, bestPuttsPerHole, mostBirdies, topByField, mostRoundsPlayed, bestProgression, matchesKind, parLabel, scoreColor } from '../lib/scoring';

// Deliberately independent of the Extérieur/Simulateur/Tous filter that
// scopes the ranking and player profiles — this section always spans both
// worlds (per two of its own cards specifically splitting outdoor vs
// indoor bragging rights), so switching the official ranking's filter
// never changes what's shown here. Each trophy hides itself rather than
// crowning a false champion when there's no real signal in the data —
// see the individual scoring.js functions for their own thresholds.
//
// The record is the star: value leads, name follows — icon + title sit
// above as a quiet caption, sized and spaced to keep the whole card
// compact enough that ~2.8 are visible at once, inviting the swipe.
function TrophyCard({ Icon, title, name, value, valueColor }) {
  return (
    <div
      style={{
        flex: '0 0 auto', width: 120, height: 132, scrollSnapAlign: 'start',
        background: 'var(--surface-tint)', borderRadius: 14, padding: '13px 14px 12px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
        <Icon width={13} height={13} strokeWidth={2} style={{ color: 'var(--brand-action)', flexShrink: 0, marginTop: 1 }} />
        <div style={{ font: 'var(--text-small)', fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.25 }}>
          {title}
        </div>
      </div>
      <div>
        <div style={{ font: 'var(--text-stat-lg)', fontSize: 21, fontWeight: 800, color: valueColor || 'var(--brand-primary)', lineHeight: 1.05, marginBottom: 3 }}>
          {value}
        </div>
        <div style={{ font: 'var(--text-small)', fontSize: 12, fontWeight: 600, color: 'var(--text-body)' }}>{name}</div>
      </div>
    </div>
  );
}

export default function TrophyCarousel({ players, rounds, courses }) {
  const outdoorRounds = rounds.filter((r) => matchesKind(r, courses, 'exterieur'));
  const indoorRounds = rounds.filter((r) => matchesKind(r, courses, 'interieur'));

  const bestOutdoor = bestRound(players, outdoorRounds, courses);
  const bestIndoor = bestRound(players, indoorRounds, courses);
  const putts = bestPuttsPerHole(players, rounds);
  const birdies = mostBirdies(players, rounds, courses);
  const beers = topByField('beers', players, rounds);
  const roundsPlayed = mostRoundsPlayed(players, rounds);
  const progression = bestProgression(players, rounds, courses);
  const mulligans = topByField('mulligans', players, rounds);

  const cards = [
    bestOutdoor && { Icon: TrophyIcon, title: 'Meilleure ronde extérieure', name: bestOutdoor.player.name, value: parLabel(bestOutdoor.diff), valueColor: scoreColor(bestOutdoor.diff) },
    bestIndoor && { Icon: MonitorIcon, title: 'Champion intérieur', name: bestIndoor.player.name, value: parLabel(bestIndoor.diff), valueColor: scoreColor(bestIndoor.diff) },
    putts && { Icon: TargetIcon, title: 'Précision au putting', name: putts.player.name, value: `${putts.value.toFixed(2).replace('.', ',')}/trou` },
    birdies && { Icon: FlagIcon, title: 'Chasseur de birdies', name: birdies.player.name, value: `${birdies.value} birdie${birdies.value > 1 ? 's' : ''}` },
    beers && { Icon: BeerIcon, title: '19e trou', name: beers.player.name, value: `${beers.value} bière${beers.value > 1 ? 's' : ''}` },
    roundsPlayed && { Icon: GolfBallIcon, title: 'Toujours partant', name: roundsPlayed.player.name, value: `${roundsPlayed.value} ronde${roundsPlayed.value > 1 ? 's' : ''}` },
    progression && { Icon: TrendingUpIcon, title: 'En pleine ascension', name: progression.player.name, value: `-${progression.value.toFixed(1).replace('.', ',')} coups`, valueColor: 'var(--color-score-under)' },
    mulligans && { Icon: RedoIcon, title: 'Roi du mulligan', name: mulligans.player.name, value: `${mulligans.value} mulligan${mulligans.value > 1 ? 's' : ''}` },
  ].filter(Boolean);

  if (!cards.length) return null;

  return (
    <div>
      <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>
        En vedette
      </div>
      <div style={{ font: 'var(--text-small)', fontSize: 12, color: 'var(--text-disabled)', marginBottom: 12 }}>
        Saison complète
      </div>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollSnapType: 'x proximity', paddingBottom: 2 }}>
        {cards.map((c, i) => <TrophyCard key={i} {...c} />)}
      </div>
    </div>
  );
}
