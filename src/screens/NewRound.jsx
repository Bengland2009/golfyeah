import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import Avatar from '../components/Avatar';
import HolesGrid from '../components/HolesGrid';
import SegmentedControl from '../components/SegmentedControl';
import { useData } from '../contexts/DataContext';
import { avatarSrc } from '../lib/avatar';

const ENTRY_MODE_CAPTIONS = {
  direct: 'Entrer les scores pendant la partie.',
  rapide: 'Entrer la carte de pointage une fois la ronde terminée.',
};

function SectionLabel({ children }) {
  return <div style={{ font: 'var(--text-label)', marginBottom: 8 }}>{children}</div>;
}

export default function NewRound() {
  const navigate = useNavigate();
  const { courses, players, startRound, startIndoorRound, resolveIndoorCourseId } = useData();
  const outdoorCourses = courses.filter((c) => c.kind !== 'interieur' && !c.isQuickDraft);

  const [roundType, setRoundType] = useState('exterieur');
  const [indoorMode, setIndoorMode] = useState('rapide');
  const [courseId, setCourseId] = useState(outdoorCourses[0]?.id);
  const [format, setFormat] = useState(18);
  const [playerIds, setPlayerIds] = useState([]);
  const [entryMode, setEntryMode] = useState('direct');
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

  const isQuickIndoor = roundType === 'interieur' && indoorMode === 'rapide';

  const canStart = roundType === 'exterieur'
    ? Boolean(courseId) && playerIds.length > 0
    : (isQuickIndoor || venue.trim().length > 0) && playerIds.length > 0;

  const begin = async () => {
    if (!canStart || starting) return;
    setStarting(true);
    const finalVenue = isQuickIndoor ? 'Partie rapide' : venue;
    const holesConfig = (roundType === 'interieur' && !isQuickIndoor && !progressive)
      ? { pars: indoorPars, yardages: indoorYardages }
      : null;

    if (entryMode === 'direct') {
      if (roundType === 'exterieur') {
        await startRound(courseId, format, playerIds);
      } else {
        await startIndoorRound(finalVenue, simulatedCourse, format, playerIds, holesConfig);
      }
      navigate('/partie/en-cours');
      return;
    }

    // Entrée rapide never creates an "active" round — the scorecard is
    // filled in on one page and saved as a completed round in one shot, so
    // we only need to resolve which course it belongs to.
    const resolvedCourseId = roundType === 'exterieur'
      ? courseId
      : await resolveIndoorCourseId(finalVenue, simulatedCourse, format, holesConfig);
    navigate('/partie/entree-rapide', { state: { courseId: resolvedCourseId, format, playerIds } });
  };

  return (
    <div>
      <Header title="Nouvelle partie" onBack={() => navigate('/')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <SectionLabel>Type de partie</SectionLabel>
          <SegmentedControl
            value={roundType}
            onChange={setRoundType}
            options={[
              { value: 'exterieur', label: 'Extérieur' },
              { value: 'interieur', label: 'Intérieur / Simulateur' },
            ]}
          />
        </div>

        <div>
          <SectionLabel>Joueurs</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
            {players.map((p) => {
              const selected = playerIds.includes(p.id);
              return (
                <div key={p.id} onClick={() => togglePlayer(p.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <div style={{ position: 'relative', padding: 3, borderRadius: '50%', border: selected ? '3px solid var(--brand-action)' : '3px solid transparent' }}>
                    <Avatar src={avatarSrc(p)} name={p.name} size={52} />
                    {selected && (
                      <span style={{ position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderRadius: '50%', background: 'var(--brand-action)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, border: '2px solid #fff' }}>✓</span>
                    )}
                  </div>
                  <span style={{ font: 'var(--text-small)', fontWeight: selected ? 700 : 400, color: selected ? 'var(--text-body)' : 'var(--text-muted)' }}>{p.name}</span>
                </div>
              );
            })}
          </div>
          <span onClick={() => navigate('/joueurs/nouveau')} style={{ display: 'inline-block', marginTop: 10, font: 'var(--text-small)', color: 'var(--brand-action)', fontWeight: 600, cursor: 'pointer' }}>
            + Ajouter un joueur
          </span>
        </div>

        {roundType === 'exterieur' ? (
          <div>
            <SectionLabel>Terrain</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {outdoorCourses.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setCourseId(c.id)}
                  style={{
                    padding: '10px 12px', borderRadius: 10,
                    border: c.id === courseId ? '2px solid var(--brand-action)' : '1px solid var(--border-default)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ font: 'var(--text-body)', fontWeight: 600 }}>{c.name}</div>
                    <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{c.city}</div>
                  </div>
                  {c.id === courseId && (
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--brand-action)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>✓</span>
                  )}
                </div>
              ))}
            </div>
            <span onClick={() => navigate('/terrains/nouveau')} style={{ display: 'inline-block', marginTop: 10, font: 'var(--text-small)', color: 'var(--brand-action)', fontWeight: 600, cursor: 'pointer' }}>
              + Ajouter un terrain
            </span>
          </div>
        ) : (
          <div>
            <SectionLabel>Terrain</SectionLabel>
            <SegmentedControl
              value={indoorMode}
              onChange={setIndoorMode}
              options={[
                { value: 'rapide', label: 'Partie rapide' },
                { value: 'simulateur', label: 'Parcours de simulateur' },
              ]}
            />

            {indoorMode === 'simulateur' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
                <Input label="Lieu" placeholder="Golf In Montréal" value={venue} onChange={(e) => setVenue(e.target.value)} />
                <Input label="Parcours simulé (optionnel)" placeholder="Pebble Beach" value={simulatedCourse} onChange={(e) => setSimulatedCourse(e.target.value)} />

                <div
                  onClick={() => setProgressive((v) => !v)}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}
                >
                  <span
                    style={{
                      width: 20, height: 20, borderRadius: 6, border: '2px solid var(--brand-action)',
                      background: progressive ? 'var(--brand-action)' : '#fff', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', flexShrink: 0, marginTop: 1,
                    }}
                  >
                    {progressive && <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, lineHeight: 1 }}>✓</span>}
                  </span>
                  <div>
                    <div style={{ font: 'var(--text-small)', fontWeight: 600 }}>Configurer les trous pendant la partie</div>
                    <div style={{ font: 'var(--text-small)', fontSize: 12, color: 'var(--text-muted)' }}>
                      Les pars et les distances seront ajoutés progressivement.
                    </div>
                  </div>
                </div>

                {!progressive && (
                  <div>
                    <SectionLabel>Trous</SectionLabel>
                    <HolesGrid holes={format} pars={indoorPars} yardages={indoorYardages} onBumpPar={bumpIndoorPar} onYardageChange={setIndoorYardage} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div>
          <SectionLabel>Format</SectionLabel>
          <SegmentedControl
            value={format}
            onChange={setFormat}
            options={[{ value: 9, label: '9 trous' }, { value: 18, label: '18 trous' }]}
          />
        </div>

        <div>
          <SectionLabel>Mode de saisie</SectionLabel>
          <SegmentedControl
            value={entryMode}
            onChange={setEntryMode}
            options={[{ value: 'direct', label: 'En direct' }, { value: 'rapide', label: 'Entrée rapide' }]}
          />
          <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginTop: 8 }}>
            {ENTRY_MODE_CAPTIONS[entryMode]}
          </div>
        </div>

        <Button variant="primary" onClick={begin} disabled={!canStart || starting} style={{ height: 52, width: '100%' }}>
          {entryMode === 'direct' ? 'Commencer la partie' : 'Continuer vers la carte de pointage'}
        </Button>
      </div>
    </div>
  );
}
