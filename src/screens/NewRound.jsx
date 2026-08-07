import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import Avatar from '../components/Avatar';
import HolesGrid from '../components/HolesGrid';
import RadioRow from '../components/RadioRow';
import { useData } from '../contexts/DataContext';
import { avatarSrc } from '../lib/avatar';

const PILL_SEG = { borderRadius: 999, flex: 1 };

export default function NewRound() {
  const navigate = useNavigate();
  const { courses, players, startRound, startIndoorRound } = useData();
  const outdoorCourses = courses.filter((c) => c.kind !== 'interieur' && !c.isQuickDraft);

  const [roundType, setRoundType] = useState('exterieur');
  const [courseId, setCourseId] = useState(outdoorCourses[0]?.id);
  const [format, setFormat] = useState(18);
  const [playerIds, setPlayerIds] = useState([]);
  const [starting, setStarting] = useState(false);

  // indoor-only
  const [venue, setVenue] = useState('');
  const [simulatedCourse, setSimulatedCourse] = useState('');
  const [progressive, setProgressive] = useState(true);
  const [indoorPars, setIndoorPars] = useState(Array(18).fill(4));
  const [indoorYardages, setIndoorYardages] = useState(Array(18).fill(''));

  const togglePlayer = (id) => {
    setPlayerIds((cur) => (cur.includes(id) ? cur.filter((p) => p !== id) : [...cur, id]));
  };
  const bumpIndoorPar = (i, delta) => setIndoorPars((arr) => {
    const next = [...arr];
    next[i] = Math.max(3, next[i] + delta);
    return next;
  });
  const setIndoorYardage = (i, v) => setIndoorYardages((arr) => {
    const next = [...arr];
    next[i] = v;
    return next;
  });

  const canStart = roundType === 'exterieur'
    ? Boolean(courseId) && playerIds.length > 0
    : venue.trim().length > 0 && playerIds.length > 0;

  const begin = async () => {
    if (!canStart || starting) return;
    setStarting(true);
    if (roundType === 'exterieur') {
      await startRound(courseId, format, playerIds);
    } else {
      const holesConfig = progressive ? null : { pars: indoorPars, yardages: indoorYardages };
      await startIndoorRound(venue, simulatedCourse, format, playerIds, holesConfig);
    }
    navigate('/partie/en-cours');
  };

  return (
    <div>
      <Header title="Nouvelle partie" onBack={() => navigate('/')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <div style={{ font: 'var(--text-label)', marginBottom: 8 }}>Type de partie</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <RadioRow selected={roundType === 'exterieur'} label="Golf extérieur" onClick={() => setRoundType('exterieur')} />
            <RadioRow selected={roundType === 'interieur'} label="Golf intérieur / simulateur" onClick={() => setRoundType('interieur')} />
          </div>
        </div>

        {roundType === 'exterieur' && (
          <div>
            <div style={{ font: 'var(--text-label)', marginBottom: 8 }}>Terrain</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {outdoorCourses.map((c) => (
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
        )}

        {roundType === 'interieur' && (
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

            <div
              onClick={() => setProgressive((v) => !v)}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}
            >
              <span
                style={{
                  width: 22, height: 22, borderRadius: 6, border: '2px solid var(--brand-action)',
                  background: progressive ? 'var(--brand-action)' : '#fff', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0, marginTop: 2,
                }}
              >
                {progressive && <span style={{ color: '#fff', fontSize: 14, fontWeight: 700, lineHeight: 1 }}>✓</span>}
              </span>
              <div>
                <div style={{ font: 'var(--text-body)', fontWeight: 600 }}>Configurer les trous pendant la partie</div>
                <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>
                  Les pars et les distances seront ajoutés progressivement pendant la ronde.
                </div>
              </div>
            </div>

            {!progressive && (
              <div>
                <div style={{ font: 'var(--text-label)', marginBottom: 8 }}>Trous</div>
                <HolesGrid holes={format} pars={indoorPars} yardages={indoorYardages} onBumpPar={bumpIndoorPar} onYardageChange={setIndoorYardage} />
              </div>
            )}
          </div>
        )}

        {roundType === 'exterieur' && (
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
        )}

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

        <Button variant="primary" onClick={begin} disabled={!canStart || starting} style={{ height: 52, width: '100%' }}>
          Commencer la partie
        </Button>
      </div>
    </div>
  );
}
