import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import Avatar from '../components/Avatar';
import HolesGrid from '../components/HolesGrid';
import SegmentedControl from '../components/SegmentedControl';
import CompactPicker from '../components/CompactPicker';
import Sheet from '../components/Sheet';
import { FlagIcon, UsersIcon, TargetIcon, EditIcon, CheckIcon } from '../components/icons';
import { useData } from '../contexts/DataContext';
import { avatarSrc } from '../lib/avatar';

const ENTRY_MODES = [
  { value: 'direct', label: 'En direct', sub: 'Entrer les scores pendant la partie.' },
  { value: 'rapide', label: 'Entrée rapide', sub: 'Entrer la carte de pointage une fois la ronde terminée.' },
];

const ADD_BUTTON_STYLE = { alignSelf: 'flex-start', height: 40, padding: '0 16px', fontSize: 13, borderRadius: 999, marginTop: 10 };

function SummaryRow({ Icon, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Icon width={16} height={16} strokeWidth={2} style={{ color: 'var(--brand-action)', flexShrink: 0 }} />
      <span style={{ font: 'var(--text-body)', fontSize: 14 }}>{text}</span>
    </div>
  );
}

function SectionLabel({ children }) {
  return <div style={{ font: 'var(--text-label)', marginBottom: 6 }}>{children}</div>;
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
  const [coursePickerOpen, setCoursePickerOpen] = useState(false);
  const [entryModePickerOpen, setEntryModePickerOpen] = useState(false);

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
  const selectedCourse = outdoorCourses.find((c) => c.id === courseId);
  const selectedEntryMode = ENTRY_MODES.find((m) => m.value === entryMode);

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

  const terrainLabel = roundType === 'exterieur'
    ? selectedCourse?.name
    : (isQuickIndoor ? 'Partie rapide' : (venue.trim() || 'Simulateur'));

  let statusMessage = 'Prêt à commencer.';
  if (playerIds.length === 0) statusMessage = 'Sélectionne au moins un joueur.';
  else if (roundType === 'exterieur' && !courseId) statusMessage = 'Choisis un terrain.';
  else if (roundType === 'interieur' && !isQuickIndoor && !venue.trim()) statusMessage = 'Nomme ton parcours de simulateur.';

  return (
    <div>
      <Header title="Nouvelle partie" onBack={() => navigate('/')} />
      <div style={{ padding: 'var(--page-padding-mobile)', paddingBottom: 280, display: 'flex', flexDirection: 'column', gap: 16 }}>
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-start' }}>
            {players.map((p) => {
              const selected = playerIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => togglePlayer(p.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer',
                    padding: '8px 10px', borderRadius: 14, minWidth: 68,
                    background: selected ? 'var(--surface-tint)' : 'transparent',
                    boxShadow: selected ? '0 3px 10px rgba(0,103,71,0.15)' : 'none',
                  }}
                >
                  <div style={{ position: 'relative', padding: 3, borderRadius: '50%', border: selected ? '2.5px solid var(--brand-action)' : '2.5px solid transparent' }}>
                    <Avatar src={avatarSrc(p)} name={p.name} size={52} />
                    {selected && (
                      <span style={{ position: 'absolute', bottom: -1, right: -1, width: 17, height: 17, borderRadius: '50%', background: 'var(--brand-action)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, border: '2px solid #fff' }}>✓</span>
                    )}
                  </div>
                  <span style={{ font: 'var(--text-small)', fontWeight: selected ? 700 : 400, color: selected ? 'var(--text-body)' : 'var(--text-muted)' }}>{p.name}</span>
                </div>
              );
            })}
          </div>
          <Button variant="secondary" onClick={() => navigate('/joueurs/nouveau')} style={ADD_BUTTON_STYLE}>
            + Ajouter un joueur
          </Button>
        </div>

        {roundType === 'exterieur' ? (
          <div>
            <SectionLabel>Terrain</SectionLabel>
            <CompactPicker
              value={selectedCourse?.name}
              sublabel={selectedCourse?.city}
              placeholder="Choisir un terrain"
              onClick={() => setCoursePickerOpen(true)}
            />
            <Button variant="secondary" onClick={() => navigate('/terrains/nouveau')} style={ADD_BUTTON_STYLE}>
              + Ajouter un terrain
            </Button>
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
          <CompactPicker
            value={selectedEntryMode.label}
            onClick={() => setEntryModePickerOpen(true)}
          />
        </div>
      </div>

      <div
        className="gy-phone-col"
        style={{
          position: 'fixed', left: 0, right: 0, bottom: 'calc(68px + env(safe-area-inset-bottom, 0px))', margin: '0 auto',
          background: '#fff', borderTop: '1px solid var(--border-default)',
          padding: '12px var(--page-padding-mobile)', zIndex: 15,
        }}
      >
        <div
          style={{
            borderRadius: 12, padding: '12px 14px', marginBottom: 12,
            background: canStart ? '#EAF5EF' : 'var(--surface-tint)',
            border: canStart ? '1px solid rgba(0,103,71,0.15)' : '1px solid var(--border-default)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: canStart ? 10 : 0 }}>
            {canStart ? (
              <CheckIcon width={17} height={17} strokeWidth={2.5} style={{ color: 'var(--brand-action)', flexShrink: 0 }} />
            ) : (
              <span style={{ width: 15, height: 15, borderRadius: '50%', border: '2px solid var(--text-disabled)', flexShrink: 0 }} />
            )}
            <span style={{ font: 'var(--text-label)', fontWeight: 700, color: canStart ? 'var(--brand-action)' : 'var(--text-body)' }}>
              {statusMessage}
            </span>
          </div>
          {canStart && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <SummaryRow Icon={FlagIcon} text={terrainLabel} />
              <SummaryRow Icon={UsersIcon} text={`${playerIds.length} joueur${playerIds.length > 1 ? 's' : ''}`} />
              <SummaryRow Icon={TargetIcon} text={`${format} trous`} />
              <SummaryRow Icon={EditIcon} text={selectedEntryMode.label} />
            </div>
          )}
        </div>
        <Button variant="primary" onClick={begin} disabled={!canStart || starting} style={{ height: 50, width: '100%' }}>
          {entryMode === 'direct' ? 'Commencer la partie' : 'Continuer vers la carte de pointage'}
        </Button>
      </div>

      <Sheet open={coursePickerOpen} onClose={() => setCoursePickerOpen(false)}>
        <div style={{ font: 'var(--text-h3)' }}>Choisir un terrain</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {outdoorCourses.map((c) => (
            <div
              key={c.id}
              onClick={() => { setCourseId(c.id); setCoursePickerOpen(false); }}
              style={{
                cursor: 'pointer', padding: '12px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: '1px solid var(--border-default)',
              }}
            >
              <div>
                <div style={{ font: 'var(--text-body)', fontWeight: c.id === courseId ? 700 : 400 }}>{c.name}</div>
                <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{c.city}</div>
              </div>
              {c.id === courseId && (
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--brand-action)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>✓</span>
              )}
            </div>
          ))}
        </div>
      </Sheet>

      <Sheet open={entryModePickerOpen} onClose={() => setEntryModePickerOpen(false)}>
        <div style={{ font: 'var(--text-h3)' }}>Mode de saisie</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {ENTRY_MODES.map((m) => (
            <div
              key={m.value}
              onClick={() => { setEntryMode(m.value); setEntryModePickerOpen(false); }}
              style={{
                cursor: 'pointer', padding: '12px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: '1px solid var(--border-default)', gap: 12,
              }}
            >
              <div>
                <div style={{ font: 'var(--text-body)', fontWeight: m.value === entryMode ? 700 : 400 }}>{m.label}</div>
                <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{m.sub}</div>
              </div>
              {m.value === entryMode && (
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--brand-action)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>✓</span>
              )}
            </div>
          ))}
        </div>
      </Sheet>
    </div>
  );
}
