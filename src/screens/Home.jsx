import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Avatar from '../components/Avatar';
import Card from '../components/Card';
import Button from '../components/Button';
import { useData } from '../contexts/DataContext';
import { avatarSrc } from '../lib/avatar';
import { leaderboard, parLabel, scoreColor, bestRoundLabel, leaderStat } from '../lib/scoring';

function HighlightCard({ label, value }) {
  return (
    <div style={{ background: 'var(--surface-tint)', borderRadius: 12, padding: '10px 12px' }}>
      <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
      <div style={{ font: 'var(--text-label)', fontWeight: 700 }}>{value}</div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { players, courses, completedRounds, allRounds, liveRound, currentLiveCourse, season, setSeason } = useData();
  const [seasonMenuOpen, setSeasonMenuOpen] = useState(false);

  const board = leaderboard(players, completedRounds, courses);
  const latest = completedRounds[0];
  const latestCourse = latest ? courses.find((c) => c.id === latest.courseId) : null;

  return (
    <div>
      <TopBar />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 28 }}>
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
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Classement</span>
              <span onClick={() => setSeasonMenuOpen((v) => !v)} style={{ font: 'var(--text-small)', color: 'var(--text-muted)', cursor: 'pointer' }}>
                · {season} ▾
              </span>
            </div>
            <span onClick={() => navigate('/joueurs')} style={{ font: 'var(--text-small)', color: 'var(--brand-action)', fontWeight: 600, cursor: 'pointer' }}>
              + Ajouter
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
          <div style={{ display: 'flex', overflowX: 'auto' }}>
            {board.map((p, i) => (
              <div
                key={p.id}
                onClick={() => navigate(`/joueurs/${p.id}`)}
                style={{
                  cursor: 'pointer', flex: board.length <= 4 ? '1 1 0' : '0 0 auto', minWidth: 78,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  padding: '4px 10px', borderRight: i < board.length - 1 ? '1px solid var(--border-default)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                  <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)', fontWeight: 600 }}>{i + 1}</span>
                  <Avatar src={avatarSrc(p)} name={p.name} size={42} />
                </div>
                <span style={{ font: 'var(--text-leaderboard-score)', fontSize: 30, fontWeight: 700, color: scoreColor(p.avg), lineHeight: 1 }}>
                  {p.avg == null ? '—' : parLabel(p.avg)}
                </span>
                <span style={{ font: 'var(--text-small)', fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>{p.name.toUpperCase()}</span>
                <span style={{ font: 'var(--text-small)', fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{p.rounds} rondes</span>
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
                <div style={{ font: 'var(--text-h3)', marginBottom: 4 }}>{latestCourse?.name}</div>
                <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginBottom: 12 }}>{latest.date} · {latest.holes} trous</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
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
                <div style={{ font: 'var(--text-small)', color: 'var(--brand-action)', fontWeight: 600 }}>Voir la scorecard →</div>
              </Card>
            </div>
          </div>
        )}

        <div>
          <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>
            Faits marquants
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <HighlightCard label="Meilleure ronde" value={bestRoundLabel(players, completedRounds, courses)} />
            <HighlightCard label="Plus de mulligans" value={leaderStat('mulligans', players, completedRounds)} />
            <HighlightCard label="Plus de balles perdues" value={leaderStat('lostBalls', players, completedRounds)} />
            <HighlightCard label="Champion des bières" value={leaderStat('beers', players, completedRounds)} />
          </div>
        </div>
      </div>
    </div>
  );
}
