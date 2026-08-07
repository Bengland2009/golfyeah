import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Avatar from '../components/Avatar';
import Card from '../components/Card';
import { useData } from '../contexts/DataContext';
import { avatarSrc } from '../lib/avatar';
import { resizeImageFile } from '../lib/image';
import { playerStats, parLabel, scoreColor, coursePar, clubAverage } from '../lib/scoring';

function StatCard({ label, value }) {
  return (
    <Card tint style={{ textAlign: 'center' }}>
      <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ font: 'var(--text-stat-lg)' }}>{value}</div>
    </Card>
  );
}
function SmallStat({ label, value }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ font: 'var(--text-stat-lg)', fontSize: 22 }}>{value}</div>
      <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{label}</div>
    </div>
  );
}

export default function Profile() {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const { players, courses, completedRounds, range, season, setSeason, setPlayerPhoto, CLUB_ORDER } = useData();
  const player = players.find((p) => p.id === playerId);
  const [photoMenuOpen, setPhotoMenuOpen] = useState(false);
  const [seasonMenuOpen, setSeasonMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  if (!player) {
    return (
      <div>
        <Header title="Joueur" onBack={() => navigate('/joueurs')} />
        <div style={{ padding: 24 }}>Joueur introuvable.</div>
      </div>
    );
  }

  const stats = playerStats(playerId, completedRounds, courses);
  const myEntries = range.filter((e) => e.playerId === playerId);
  const clubsPresent = [...new Set(myEntries.map((e) => e.club))];
  const orderedClubs = CLUB_ORDER.filter((c) => clubsPresent.includes(c));

  const onPickFile = () => { setPhotoMenuOpen(false); fileInputRef.current?.click(); };
  const onFileChange = async (ev) => {
    const file = ev.target.files[0];
    ev.target.value = '';
    if (!file) return;
    const dataUrl = await resizeImageFile(file);
    setPlayerPhoto(playerId, dataUrl);
  };
  const clearPhoto = () => { setPlayerPhoto(playerId, null); setPhotoMenuOpen(false); };

  return (
    <div>
      <Header title={player.name} onBack={() => navigate('/joueurs')} />
      <input type="file" accept="image/*" ref={fileInputRef} onChange={onFileChange} style={{ display: 'none' }} />

      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <Avatar src={avatarSrc(player)} name={player.name} size={88} />
          <span onClick={() => setPhotoMenuOpen(true)} style={{ font: 'var(--text-small)', color: 'var(--brand-action)', cursor: 'pointer' }}>Modifier la photo</span>
          <div style={{ font: 'var(--text-h2)', marginTop: 4 }}>{player.name}</div>
          <div style={{ position: 'relative' }}>
            <span onClick={() => setSeasonMenuOpen((v) => !v)} style={{ font: 'var(--text-small)', color: 'var(--text-muted)', cursor: 'pointer' }}>
              Saison {season} ›
            </span>
            {seasonMenuOpen && (
              <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', background: '#fff', border: '1px solid var(--border-default)', borderRadius: 10, marginTop: 6, overflow: 'hidden', boxShadow: 'var(--shadow-elevated)', zIndex: 10 }}>
                {[2026, 2025].map((s) => (
                  <div key={s} onClick={() => { setSeason(s); setSeasonMenuOpen(false); }} style={{ padding: '10px 20px', font: 'var(--text-small)', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: s === season ? 700 : 400 }}>
                    Saison {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {photoMenuOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'flex-end' }}>
            <div onClick={() => setPhotoMenuOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
            <div style={{ position: 'relative', width: '100%', maxWidth: 390, margin: '0 auto', background: '#fff', borderRadius: '16px 16px 0 0', overflow: 'hidden', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
              <div onClick={onPickFile} style={{ padding: '14px 20px', font: 'var(--text-body)', cursor: 'pointer', borderBottom: '1px solid var(--border-default)' }}>Choisir une photo</div>
              <div onClick={clearPhoto} style={{ padding: '14px 20px', font: 'var(--text-body)', cursor: 'pointer', borderBottom: '1px solid var(--border-default)' }}>Utiliser ma photo Google</div>
              <div onClick={clearPhoto} style={{ padding: '14px 20px', font: 'var(--text-body)', color: 'var(--color-score-under)', cursor: 'pointer' }}>Supprimer la photo personnalisée</div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <StatCard label="Moyenne vs par" value={stats.avg == null ? '—' : parLabel(stats.avg)} />
          <StatCard label="Rondes" value={stats.rounds} />
          <StatCard label="Meilleure ronde" value={stats.best == null ? '—' : parLabel(stats.best)} />
          <StatCard label="Score moyen" value={stats.scoreAvg ?? '—'} />
        </div>

        <div style={{ display: 'flex', gap: 24, justifyContent: 'space-around' }}>
          <SmallStat label="Mulligans" value={stats.mulligans} />
          <SmallStat label="Balles perdues" value={stats.lostBalls} />
          <SmallStat label="Bières" value={stats.beers} />
        </div>

        {orderedClubs.length > 0 && (
          <div>
            <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>Mes distances</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {orderedClubs.map((c) => (
                <div key={c} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: '1px solid var(--border-default)' }}>
                  <span style={{ font: 'var(--text-body)' }}>{c}</span>
                  <span>
                    <span style={{ font: 'var(--text-stat-lg)', fontSize: 20, fontWeight: 700 }}>{clubAverage(myEntries.filter((e) => e.club === c))}</span>
                    <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginLeft: 3 }}>vg</span>
                  </span>
                </div>
              ))}
            </div>
            <span onClick={() => navigate('/range')} style={{ font: 'var(--text-small)', color: 'var(--brand-action)', fontWeight: 600, cursor: 'pointer', display: 'inline-block', marginTop: 10 }}>
              Voir toutes les distances →
            </span>
          </div>
        )}

        {stats.roundsList.length > 0 && (
          <div>
            <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>Parties récentes</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {stats.roundsList.map((r) => {
                const course = courses.find((c) => c.id === r.courseId);
                const par = course ? coursePar(course) : r.par || 72;
                const diff = r.totals[playerId] - par;
                return (
                  <div key={r.id} onClick={() => navigate(`/resume/${r.id}`)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-default)' }}>
                    <div>
                      <div style={{ font: 'var(--text-body)', fontWeight: 600 }}>{course?.name}</div>
                      <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{r.date} · {r.holes} trous</div>
                    </div>
                    <span style={{ font: 'var(--text-label)', fontWeight: 700, color: scoreColor(diff) }}>{parLabel(diff)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
