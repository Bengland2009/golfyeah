import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Avatar from '../components/Avatar';
import Card from '../components/Card';
import Button from '../components/Button';
import SegmentedControl from '../components/SegmentedControl';
import { useData } from '../contexts/DataContext';
import { avatarSrc } from '../lib/avatar';
import { leaderboard, parLabel, scoreColor, bestRoundLabel, leaderStat } from '../lib/scoring';
import { TrophyIcon, TargetIcon, TreeIcon, BeerIcon } from '../components/icons';

const KIND_OPTIONS = [
  { value: 'exterieur', label: 'Extérieur' },
  { value: 'interieur', label: 'Simulateur' },
  { value: 'tous', label: 'Tous' },
];

// Extérieur = anything not explicitly marked indoor, so a course record
// missing `kind` (shouldn't happen, but cheap to guard) still counts as
// outdoor instead of silently vanishing from both filters — same
// convention NewRound.jsx already uses for its own outdoor course list.
function matchesKind(round, courses, kindFilter) {
  if (kindFilter === 'tous') return true;
  const course = courses.find((c) => c.id === round.courseId);
  return kindFilter === 'interieur' ? course?.kind === 'interieur' : course?.kind !== 'interieur';
}

function HighlightCard({ Icon, label, value }) {
  return (
    <div style={{ background: 'var(--surface-tint)', borderRadius: 14, padding: '14px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <Icon width={15} height={15} strokeWidth={1.75} style={{ color: 'var(--brand-action)', flexShrink: 0 }} />
        <span style={{ font: 'var(--text-small)', fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
      </div>
      <div style={{ font: 'var(--text-label)', fontSize: 17, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { players, courses, completedRounds, allRounds, liveRound, currentLiveCourse, season, setSeason } = useData();
  const [seasonMenuOpen, setSeasonMenuOpen] = useState(false);
  const [kindFilter, setKindFilter] = useState('exterieur');

  const filteredRounds = completedRounds.filter((r) => matchesKind(r, courses, kindFilter));
  const board = leaderboard(players, filteredRounds, courses);
  const latest = filteredRounds[0];
  const latestCourse = latest ? courses.find((c) => c.id === latest.courseId) : null;

  return (
    <div>
      <TopBar />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 36 }}>
        {liveRound && (
          <div
            onClick={() => navigate('/partie/en-cours')}
            style={{ cursor: 'pointer', background: 'var(--brand-primary)', borderRadius: 'var(--radius-card)', padding: 16, color: '#fff' }}
          >
            <div style={{ font: 'var(--text-small)', color: 'rgba(255,255,255,0.75)', marginBottom: 4 }}>Partie en cours</div>
            <div style={{ font: 'var(--text-h3)', color: '#fff', marginBottom: 2 }}>{currentLiveCourse().name}</div>
            <div style={{ font: 'var(--text-small)', color: 'rgba(255,255,255,0.75)', marginBottom: 12 }}>
              Trou {liveRound.holeIndex + 1} sur {liveRound.format}
            </div>
            <Button variant="primary" onClick={() => navigate('/partie/en-cours')} style={{ borderRadius: 999, height: 52, width: '100%', background: '#fff', color: 'var(--brand-primary)' }}>
              Continuer la partie
            </Button>
          </div>
        )}

        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6, position: 'relative' }}>
            <span style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Classement</span>
            <span onClick={() => setSeasonMenuOpen((v) => !v)} style={{ font: 'var(--text-small)', color: 'var(--text-muted)', cursor: 'pointer' }}>
              · {season} ▾
            </span>
            {seasonMenuOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 10, marginTop: 6, overflow: 'hidden', boxShadow: 'var(--shadow-elevated)', zIndex: 10 }}>
                {[2026, 2025].map((s) => (
                  <div key={s} onClick={() => { setSeason(s); setSeasonMenuOpen(false); }} style={{ padding: '10px 20px', font: 'var(--text-small)', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: s === season ? 700 : 400 }}>
                    Saison {s}
                  </div>
                ))}
              </div>
            )}
          </div>
          <SegmentedControl options={KIND_OPTIONS} value={kindFilter} onChange={setKindFilter} />
          <div style={{ display: 'flex', overflowX: 'auto', marginTop: 6 }}>
            {board.map((p, i) => (
              <div key={p.id} style={{ display: 'contents' }}>
                <div
                  onClick={() => navigate(`/joueurs/${p.id}`)}
                  style={{
                    cursor: 'pointer', flex: board.length <= 4 ? '1 1 0' : '0 0 auto', minWidth: 88,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    padding: '14px 10px',
                  }}
                >
                  <span style={{ font: 'var(--text-small)', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>{i + 1}</span>
                  <Avatar src={avatarSrc(p)} name={p.name} size={58} />
                  {p.avg == null ? (
                    <span style={{ font: 'var(--text-small)', fontSize: 11, color: 'var(--text-disabled)', margin: '8px 0 4px' }}>
                      Aucune ronde
                    </span>
                  ) : (
                    <span style={{ font: 'var(--text-leaderboard-score)', fontSize: 36, fontWeight: 800, color: scoreColor(p.avg), lineHeight: 1, marginTop: 2 }}>
                      {parLabel(p.avg)}
                    </span>
                  )}
                  <span style={{ font: 'var(--text-small)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap', letterSpacing: '0.03em' }}>
                    {p.name.toUpperCase()}
                  </span>
                  {p.avg != null && (
                    <span style={{ font: 'var(--text-small)', fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{p.rounds} rondes</span>
                  )}
                </div>
                {i < board.length - 1 && (
                  <div style={{ width: 1, alignSelf: 'center', height: 56, background: 'var(--border-default)', flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Button variant="primary" onClick={() => navigate('/nouvelle-partie')} style={{ alignSelf: 'flex-start', borderRadius: 999, height: 46, padding: '0 22px', fontSize: 16 }}>
          + Nouvelle partie
        </Button>

        {latest && (
          <div>
            <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
              Dernière partie
            </div>
            <div onClick={() => navigate(`/resume/${latest.id}`)} style={{ cursor: 'pointer' }}>
              <Card>
                <div style={{ font: 'var(--text-h3)', fontSize: 22, marginBottom: 4 }}>{latestCourse?.name}</div>
                <div style={{ font: 'var(--text-small)', fontSize: 12, color: 'var(--text-muted)', marginBottom: 18 }}>{latest.date} · {latest.holes} trous</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                  {latest.playerIds.map((pid) => {
                    const player = players.find((pp) => pp.id === pid);
                    const diff = latest.totals[pid] - (latestCourse?.pars?.reduce((a, b) => a + b, 0) || 72);
                    return (
                      <div key={pid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ font: 'var(--text-body)' }}>{player?.name}</span>
                        <span style={{ font: 'var(--text-label)', fontWeight: 700, color: scoreColor(diff) }}>{parLabel(diff)}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, font: 'var(--text-label)', fontSize: 15, color: 'var(--brand-action)', fontWeight: 700 }}>
                  Voir la scorecard <span style={{ fontSize: 17 }}>›</span>
                </div>
              </Card>
            </div>
          </div>
        )}

        <div>
          <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
            Faits marquants
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <HighlightCard Icon={TrophyIcon} label="Meilleure ronde" value={bestRoundLabel(players, filteredRounds, courses)} />
            <HighlightCard Icon={TargetIcon} label="Plus de mulligans" value={leaderStat('mulligans', players, filteredRounds)} />
            <HighlightCard Icon={TreeIcon} label="Plus de balles perdues" value={leaderStat('lostBalls', players, filteredRounds)} />
            <HighlightCard Icon={BeerIcon} label="Champion des bières" value={leaderStat('beers', players, filteredRounds)} />
          </div>
        </div>
      </div>
    </div>
  );
}
