import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import Avatar from '../components/Avatar';
import { useData } from '../contexts/DataContext';
import { avatarSrc } from '../lib/avatar';
import { coursePar } from '../lib/scoring';

const PILL_SEG = { borderRadius: 999, flex: 1 };

export default function IndoorQuickRound() {
  const navigate = useNavigate();
  const { courses, players, startRound, startQuickIndoorRound } = useData();
  const savedIndoorCourses = courses.filter((c) => c.kind === 'interieur' && !c.isQuickDraft);

  const [venue, setVenue] = useState('');
  const [simulatedCourse, setSimulatedCourse] = useState('');
  const [format, setFormat] = useState(18);
  const [playerIds, setPlayerIds] = useState([]);
  const [starting, setStarting] = useState(false);

  const togglePlayer = (id) => {
    setPlayerIds((cur) => (cur.includes(id) ? cur.filter((p) => p !== id) : [...cur, id]));
  };

  const beginQuick = async () => {
    if (!venue.trim() || !playerIds.length || starting) return;
    setStarting(true);
    await startQuickIndoorRound(venue.trim(), simulatedCourse.trim(), format, playerIds);
    navigate('/partie/en-cours');
  };

  const beginReplay = async (course) => {
    if (!playerIds.length || starting) return;
    setStarting(true);
    await startRound(course.id, course.holes, playerIds);
    navigate('/partie/en-cours');
  };

  return (
    <div>
      <Header title="Partie intérieure rapide" onBack={() => navigate('/nouvelle-partie')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <div style={{ font: 'var(--text-label)', marginBottom: 8 }}>Joueurs</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {players.map((p) => {
              const selected = playerIds.includes(p.id);
              return (
                <div key={p.id} onClick={() => togglePlayer(p.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <div style={{ position: 'relative', padding: 3, borderRadius: '50%', border: selected ? '3px solid var(--brand-action)' : '3px solid transparent' }}>
                    <Avatar src={avatarSrc(p)} name={p.name} size={56} />
                    {selected && (
                      <span style={{ position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderRadius: '50%', background: 'var(--brand-action)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, border: '2px solid #fff' }}>✓</span>
                    )}
                  </div>
                  <span style={{ font: 'var(--text-small)', fontWeight: selected ? 700 : 400, color: selected ? 'var(--text-body)' : 'var(--text-muted)' }}>{p.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {savedIndoorCourses.length > 0 && (
          <div>
            <div style={{ font: 'var(--text-label)', marginBottom: 8 }}>Rejouer un parcours</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {savedIndoorCourses.map((c) => (
                <div
                  key={c.id}
                  onClick={() => beginReplay(c)}
                  style={{
                    padding: 12, borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)',
                    cursor: playerIds.length ? 'pointer' : 'default', opacity: playerIds.length ? 1 : 0.5,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ font: 'var(--text-body)', fontWeight: 600 }}>{c.name}</div>
                    <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>
                      {c.simulatedCourse ? c.simulatedCourse + ' · ' : ''}{c.holes} trous · Par {coursePar(c)}
                    </div>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: 18 }}>›</span>
                </div>
              ))}
            </div>
            {!playerIds.length && (
              <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginTop: 6 }}>Choisis les joueurs pour continuer.</div>
            )}
          </div>
        )}

        <div>
          <div style={{ font: 'var(--text-label)', marginBottom: 8 }}>{savedIndoorCourses.length > 0 ? 'Ou un nouveau lieu' : 'Lieu'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Lieu" placeholder="Golf In Montréal" value={venue} onChange={(e) => setVenue(e.target.value)} />
            <Input label="Parcours simulé (optionnel)" placeholder="Pebble Beach" value={simulatedCourse} onChange={(e) => setSimulatedCourse(e.target.value)} />
            <div>
              <div style={{ font: 'var(--text-label)', marginBottom: 8 }}>Format</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[9, 18].map((f) => (
                  <Button key={f} variant={format === f ? 'primary' : 'secondary'} onClick={() => setFormat(f)} style={PILL_SEG}>
                    {f} trous
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>
          Les pars et distances se configurent trou par trou en jouant — pas besoin de tout entrer maintenant.
        </div>

        <Button variant="primary" onClick={beginQuick} disabled={!venue.trim() || !playerIds.length || starting} style={{ height: 52, width: '100%' }}>
          Commencer la partie
        </Button>
      </div>
    </div>
  );
}
