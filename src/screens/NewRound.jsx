import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import { useData } from '../contexts/DataContext';
import { avatarSrc } from '../lib/avatar';

const PILL_SEG = { borderRadius: 999, flex: 1 };

export default function NewRound() {
  const navigate = useNavigate();
  const { courses, players, startRound } = useData();
  const [courseId, setCourseId] = useState(courses[0]?.id);
  const [format, setFormat] = useState(18);
  const [playerIds, setPlayerIds] = useState([]);

  const togglePlayer = (id) => {
    setPlayerIds((cur) => (cur.includes(id) ? cur.filter((p) => p !== id) : [...cur, id]));
  };

  const begin = async () => {
    if (!playerIds.length) return;
    await startRound(courseId, format, playerIds);
    navigate('/partie/en-cours');
  };

  return (
    <div>
      <Header title="Nouvelle partie" onBack={() => navigate('/')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <div style={{ font: 'var(--text-label)', marginBottom: 8 }}>Terrain</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {courses.map((c) => (
              <div
                key={c.id}
                onClick={() => setCourseId(c.id)}
                style={{
                  padding: 12, borderRadius: 'var(--radius-card)',
                  border: c.id === courseId ? '2px solid var(--brand-action)' : '1px solid var(--border-default)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ font: 'var(--text-body)', fontWeight: 600 }}>{c.name}</div>
                  <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{c.city}</div>
                </div>
                {c.id === courseId && (
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--brand-action)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>✓</span>
                )}
              </div>
            ))}
            <span onClick={() => navigate('/terrains/nouveau')} style={{ font: 'var(--text-small)', color: 'var(--brand-action)', fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' }}>
              + Ajouter un terrain
            </span>
          </div>
        </div>

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

        <Button variant="primary" onClick={begin} disabled={!playerIds.length} style={{ height: 52, width: '100%' }}>
          Commencer la partie
        </Button>
      </div>
    </div>
  );
}
