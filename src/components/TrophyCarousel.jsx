import { TrophyIcon, MonitorIcon, TargetIcon, FlagIcon, BeerIcon, GolfBallIcon, TrendingUpIcon, RedoIcon } from './icons';
import { bestRound, bestPuttsPerHole, mostBirdies, topByField, mostRoundsPlayed, bestProgression, matchesKind, parLabel } from '../lib/scoring';

// Deliberately independent of the Extérieur/Simulateur/Tous filter that
// scopes the ranking and player profiles — this section always spans both
// worlds (per two of its own cards specifically splitting outdoor vs
// indoor bragging rights), so switching the official ranking's filter
// never changes what's shown here. Each trophy hides itself rather than
// crowning a false champion when there's no real signal in the data —
// see the individual scoring.js functions for their own thresholds.
function TrophyCard({ Icon, title, name, value }) {
  return (
    <div
      style={{
        flex: '0 0 auto', width: 156, height: 168, scrollSnapAlign: 'start',
        background: 'var(--surface-tint)', borderRadius: 16, padding: 16,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}
    >
      <div>
        <Icon width={18} height={18} strokeWidth={1.75} style={{ color: 'var(--brand-action)' }} />
        <div style={{ font: 'var(--text-small)', fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 600, marginTop: 8, lineHeight: 1.3 }}>
          {title}
        </div>
      </div>
      <div>
        <div style={{ font: 'var(--text-label)', fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{name}</div>
        <div style={{ font: 'var(--text-stat-lg)', fontSize: 20, fontWeight: 800, color: 'var(--brand-primary)', lineHeight: 1.15 }}>
          {value}
        </div>
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
    bestOutdoor && { Icon: TrophyIcon, title: 'Meilleure ronde extérieure', name: bestOutdoor.player.name, value: parLabel(bestOutdoor.diff) },
    bestIndoor && { Icon: MonitorIcon, title: 'Champion intérieur', name: bestIndoor.player.name, value: parLabel(bestIndoor.diff) },
    putts && { Icon: TargetIcon, title: 'Meilleure moyenne de putts', name: putts.player.name, value: `${putts.value.toFixed(2).replace('.', ',')} putt/trou` },
    birdies && { Icon: FlagIcon, title: 'Plus de birdies', name: birdies.player.name, value: `${birdies.value} birdie${birdies.value > 1 ? 's' : ''}` },
    beers && { Icon: BeerIcon, title: 'Plus de bières', name: beers.player.name, value: `${beers.value} bière${beers.value > 1 ? 's' : ''}` },
    roundsPlayed && { Icon: GolfBallIcon, title: 'Plus de rondes jouées', name: roundsPlayed.player.name, value: `${roundsPlayed.value} ronde${roundsPlayed.value > 1 ? 's' : ''}` },
    progression && { Icon: TrendingUpIcon, title: 'Plus grande progression', name: progression.player.name, value: `${progression.value.toFixed(1).replace('.', ',')} coups de mieux` },
    mulligans && { Icon: RedoIcon, title: 'Plus de mulligans', name: mulligans.player.name, value: `${mulligans.value} mulligan${mulligans.value > 1 ? 's' : ''}` },
  ].filter(Boolean);

  if (!cards.length) return null;

  return (
    <div>
      <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>
        En vedette
      </div>
      <div style={{ font: 'var(--text-small)', fontSize: 12, color: 'var(--text-disabled)', marginBottom: 12 }}>
        Extérieur et simulateur confondus
      </div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', scrollSnapType: 'x proximity', paddingBottom: 2 }}>
        {cards.map((c, i) => <TrophyCard key={i} {...c} />)}
      </div>
    </div>
  );
}
