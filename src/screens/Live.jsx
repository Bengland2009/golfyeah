import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import Input from '../components/Input';
import ScoreStepper from '../components/ScoreStepper';
import BeerCounter from '../components/BeerCounter';
import Sheet from '../components/Sheet';
import SegmentedControl from '../components/SegmentedControl';
import CompactPicker from '../components/CompactPicker';
import HoleSetupPrompt from '../components/HoleSetupPrompt';
import RoundExpenses from '../components/RoundExpenses';
import HoleStrip from '../components/HoleStrip';
import { GolfBallIcon, ChevronRightIcon } from '../components/icons';
import { useData } from '../contexts/DataContext';
import { useMe } from '../lib/useMe';
import { avatarSrc } from '../lib/avatar';
import { parLabel, toneFor, playerRunningTotal } from '../lib/scoring';

function navBtnStyle(disabled) {
  return { width: 40, height: 40, borderRadius: '50%', border: 'none', background: disabled ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.25)', color: '#fff', fontSize: 20, cursor: disabled ? 'default' : 'pointer' };
}
function smallBtn() {
  return { width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', fontSize: 16 };
}
function StatRow({ label, value, onAdd }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ font: 'var(--text-label)' }}>{value}</span>
        <button type="button" onClick={onAdd} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'var(--brand-action)', color: '#fff', fontSize: 16, cursor: 'pointer' }}>+</button>
      </div>
    </div>
  );
}

export default function Live() {
  const navigate = useNavigate();
  const {
    players, courses, liveRound, currentLiveCourse, getHolePar, getHoleYardage,
    setStrokes, bumpHoleField, bumpPutts, addBeer, removeBeer, changeHole, goToHole,
    editHoleForRoundOnly, editHoleForCourse, changeRoundFormat, changeRoundCourse, updateCourseName,
    finishRound, abandonRound,
  } = useData();
  const me = useMe();

  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);
  const [abandonConfirmOpen, setAbandonConfirmOpen] = useState(false);
  const [editHoleOpen, setEditHoleOpen] = useState(false);
  const [editDraft, setEditDraft] = useState({ par: 4, yardage: 0 });
  const [editRoundOpen, setEditRoundOpen] = useState(false);
  const [courseListOpen, setCourseListOpen] = useState(false);
  const [shrinkConfirmOpen, setShrinkConfirmOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState('');

  if (!liveRound) {
    navigate('/');
    return null;
  }

  const course = currentLiveCourse();
  const i = liveRound.holeIndex;
  const par = getHolePar(i);
  const yard = getHoleYardage(i);
  const needsSetup = par == null;

  // The strip shows one perspective — the signed-in player's, falling back
  // to the round's first player if they aren't part of it.
  const stripPlayerId = liveRound.playerIds.includes(me?.id) ? me.id : liveRound.playerIds[0];
  const getDiff = (idx) => {
    const entry = liveRound.scores[stripPlayerId]?.[idx];
    const holePar = getHolePar(idx);
    if (!entry || !entry.strokes || holePar == null) return null;
    return entry.strokes - holePar;
  };

  const openEditHole = () => {
    setEditDraft({ par: getHolePar(i) || 4, yardage: getHoleYardage(i) || '' });
    setEditHoleOpen(true);
  };

  const saveHoleSetup = (chosenPar, yardage) => {
    editHoleForCourse(chosenPar, yardage);
  };

  const openEditRound = () => {
    setNameDraft(course.name);
    setEditRoundOpen(true);
  };

  const saveName = () => {
    if (nameDraft.trim() && nameDraft.trim() !== course.name) {
      updateCourseName(liveRound.courseId, nameDraft);
    }
  };

  const handleFormatChange = (newFormat) => {
    if (newFormat < liveRound.format) {
      setShrinkConfirmOpen(true);
    } else {
      changeRoundFormat(newFormat);
    }
  };

  const confirmShrink = () => {
    changeRoundFormat(9);
    setShrinkConfirmOpen(false);
  };

  const selectCourse = (courseId) => {
    changeRoundCourse(courseId);
    setNameDraft(courses.find((c) => c.id === courseId)?.name || '');
    setCourseListOpen(false);
  };

  const finish = async () => {
    const id = await finishRound();
    navigate(`/resume/${id}`);
  };

  const abandon = async () => {
    await abandonRound();
    setAbandonConfirmOpen(false);
    setExitConfirmOpen(false);
    navigate('/');
  };

  return (
    <div>
      <div style={{ background: 'var(--brand-primary)', color: '#fff', padding: 'calc(16px + env(safe-area-inset-top, 0px)) var(--page-padding-mobile) 22px' }}>
        <div style={{ position: 'relative', textAlign: 'center', marginBottom: 14 }}>
          <button
            onClick={() => setExitConfirmOpen(true)}
            style={{ position: 'absolute', left: 0, top: 0, background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', fontSize: 22, padding: 4, cursor: 'pointer', lineHeight: 1, width: 32, height: 32 }}
          >
            ×
          </button>
          <span style={{ font: 'var(--text-body)', fontSize: 16, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.01em' }}>{course.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <button onClick={() => changeHole(-1)} disabled={i === 0} style={navBtnStyle(i === 0)}>‹</button>
          <div style={{ textAlign: 'center' }}>
            <span style={{ font: 'var(--font-serif)', fontWeight: 700, fontSize: 40, color: '#fff', lineHeight: 1 }}>Trou {i + 1}</span>
            <div style={{ font: 'var(--text-small)', color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>sur {liveRound.format}</div>
          </div>
          <button onClick={() => changeHole(1)} disabled={i === liveRound.format - 1} style={navBtnStyle(i === liveRound.format - 1)}>›</button>
        </div>
        {!needsSetup && (
          <div style={{ display: 'flex', gap: 16, marginTop: 14, alignItems: 'baseline', justifyContent: 'center' }}>
            <span style={{ font: 'var(--text-label)', color: '#fff' }}>PAR {par}</span>
            <span style={{ font: 'var(--text-label)', color: 'rgba(255,255,255,0.85)' }}>{yard ? `${yard} vg` : 'Distance non indiquée'}</span>
            <span onClick={openEditHole} style={{ font: 'var(--text-small)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', textDecoration: 'underline' }}>Modifier</span>
          </div>
        )}
      </div>

      <HoleStrip format={liveRound.format} currentIndex={i} getDiff={getDiff} onSelect={goToHole} />

      {needsSetup && (
        <>
          <HoleSetupPrompt holeNumber={i + 1} onSave={saveHoleSetup} />
          <div style={{ padding: '0 var(--page-padding-mobile) var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
            <span onClick={openEditRound} style={{ display: 'block', textAlign: 'center', font: 'var(--text-small)', color: 'var(--brand-action)', cursor: 'pointer' }}>
              Modifier la partie
            </span>
            <span onClick={() => setAbandonConfirmOpen(true)} style={{ display: 'block', textAlign: 'center', font: 'var(--text-small)', color: 'var(--color-score-under)', cursor: 'pointer' }}>
              Abandonner la partie
            </span>
          </div>
        </>
      )}

      {!needsSetup && (
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {liveRound.playerIds.map((pid) => {
          const player = players.find((p) => p.id === pid);
          const entry = (liveRound.scores[pid] && liveRound.scores[pid][i]) || { strokes: par || 4, mulligans: 0, lostBalls: 0, putts: 0 };
          const running = playerRunningTotal(liveRound, pid, getHolePar);
          return (
            <Card key={pid} elevated>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar src={avatarSrc(player)} name={player?.name} size={36} />
                  <span style={{ font: 'var(--text-label)' }}>{player?.name}</span>
                </div>
                <Badge tone={toneFor(running)}>{parLabel(running)}</Badge>
              </div>
              <ScoreStepper value={entry.strokes} size="large" onChange={(v) => setStrokes(pid, v)} />
              <div
                onClick={() => navigate(`/partie/en-cours/tracker/${pid}`)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  height: 40, marginTop: 10, borderRadius: 999,
                  border: '1px solid var(--border-default)', background: 'var(--surface-tint)', cursor: 'pointer',
                }}
              >
                <GolfBallIcon width={16} height={16} strokeWidth={2} style={{ color: 'var(--brand-action)', flexShrink: 0 }} />
                <span style={{ font: 'var(--text-small)', fontWeight: 700, color: 'var(--text-body)' }}>Compter les coups</span>
                <ChevronRightIcon width={15} height={15} strokeWidth={2.5} style={{ color: 'var(--brand-action)', flexShrink: 0 }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                <StatRow label="Putts" value={entry.putts || 0} onAdd={() => bumpPutts(pid, 1)} />
                <StatRow label="Mulligan" value={entry.mulligans} onAdd={() => bumpHoleField(pid, 'mulligans', 1)} />
                <StatRow label="Balle perdue" value={entry.lostBalls} onAdd={() => bumpHoleField(pid, 'lostBalls', 1)} />
                <BeerCounter value={liveRound.beers[pid] || 0} onAdd={() => addBeer(pid)} onRemove={() => removeBeer(pid)} />
              </div>
            </Card>
          );
        })}

        {i === liveRound.format - 1 ? (
          <Button variant="primary" onClick={finish} style={{ height: 52, width: '100%' }}>Terminer la partie</Button>
        ) : (
          <Button variant="secondary" onClick={() => changeHole(1)} style={{ height: 52, width: '100%' }}>Trou suivant</Button>
        )}

        <span onClick={openEditRound} style={{ textAlign: 'center', font: 'var(--text-small)', color: 'var(--brand-action)', cursor: 'pointer', marginTop: 10 }}>
          Modifier la partie
        </span>

        <span onClick={() => setAbandonConfirmOpen(true)} style={{ textAlign: 'center', font: 'var(--text-small)', color: 'var(--color-score-under)', cursor: 'pointer' }}>
          Abandonner la partie
        </span>
      </div>
      )}

      <div style={{ padding: '0 var(--page-padding-mobile) var(--page-padding-mobile)' }}>
        <RoundExpenses roundId={liveRound.id} playerIds={liveRound.playerIds} players={players} />
      </div>

      <Sheet open={exitConfirmOpen} onClose={() => setExitConfirmOpen(false)}>
        <div style={{ font: 'var(--text-h3)' }}>Quitter la partie ?</div>
        <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)' }}>Tes scores sont enregistrés automatiquement. Tu pourras reprendre la partie plus tard.</div>
        <Button variant="primary" onClick={() => { setExitConfirmOpen(false); navigate('/'); }} style={{ height: 52, width: '100%' }}>Retour à l’accueil</Button>
        <Button variant="secondary" onClick={() => setExitConfirmOpen(false)} style={{ height: 52, width: '100%' }}>Continuer à jouer</Button>
      </Sheet>

      <Sheet open={abandonConfirmOpen} onClose={() => setAbandonConfirmOpen(false)} zIndex={70} dim={0.45}>
        <div style={{ font: 'var(--text-h3)' }}>Abandonner cette partie ?</div>
        <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)' }}>Tous les scores et les données de cette ronde seront supprimés définitivement.</div>
        <Button variant="secondary" onClick={() => setAbandonConfirmOpen(false)} style={{ height: 52, width: '100%' }}>Annuler</Button>
        <Button variant="primary" onClick={abandon} style={{ height: 52, width: '100%', background: 'var(--color-score-under)' }}>Abandonner la partie</Button>
      </Sheet>

      <Sheet open={editHoleOpen} onClose={() => setEditHoleOpen(false)}>
        <div style={{ font: 'var(--text-h3)' }}>Modifier le trou</div>
        <div style={{ font: 'var(--text-label)' }}>Trou {i + 1}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ font: 'var(--text-body)' }}>Par</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setEditDraft((d) => ({ ...d, par: Math.max(3, d.par - 1) }))} style={smallBtn()}>−</button>
            <span style={{ font: 'var(--text-label)', width: 20, textAlign: 'center' }}>{editDraft.par}</span>
            <button onClick={() => setEditDraft((d) => ({ ...d, par: d.par + 1 }))} style={smallBtn()}>+</button>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ font: 'var(--text-body)' }}>Distance</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="number" inputMode="numeric" value={editDraft.yardage}
              onChange={(e) => setEditDraft((d) => ({ ...d, yardage: e.target.value }))}
              style={{ width: 72, font: 'var(--text-small)', border: '1px solid var(--border-default)', borderRadius: 6, padding: '6px 8px', textAlign: 'right' }}
            />
            <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>vg</span>
          </div>
        </div>
        <Button variant="primary" onClick={() => { editHoleForRoundOnly(editDraft.par, editDraft.yardage); setEditHoleOpen(false); }} style={{ height: 52, width: '100%' }}>
          Modifier pour cette partie seulement
        </Button>
        <Button variant="secondary" onClick={() => { editHoleForCourse(editDraft.par, editDraft.yardage); setEditHoleOpen(false); }} style={{ height: 52, width: '100%' }}>
          Mettre à jour le terrain
        </Button>
        <span onClick={() => setEditHoleOpen(false)} style={{ textAlign: 'center', font: 'var(--text-small)', color: 'var(--text-muted)', cursor: 'pointer' }}>Annuler</span>
      </Sheet>

      <Sheet open={editRoundOpen} onClose={() => { saveName(); setEditRoundOpen(false); }}>
        <div style={{ font: 'var(--text-h3)' }}>Modifier la partie</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ font: 'var(--text-label)' }}>Terrain</span>
          <CompactPicker value={course.name} onClick={() => setCourseListOpen(true)} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ font: 'var(--text-label)' }}>Nombre de trous</span>
          <SegmentedControl
            options={[{ value: 9, label: '9 trous' }, { value: 18, label: '18 trous' }]}
            value={liveRound.format}
            onChange={handleFormatChange}
          />
        </div>

        <Input
          label="Nom de la partie"
          value={nameDraft}
          onChange={(e) => setNameDraft(e.target.value)}
          onBlur={saveName}
        />

        <Button variant="primary" onClick={() => { saveName(); setEditRoundOpen(false); }} style={{ height: 52, width: '100%' }}>
          Terminé
        </Button>
      </Sheet>

      <Sheet open={courseListOpen} onClose={() => setCourseListOpen(false)} zIndex={70} dim={0.45}>
        <div style={{ font: 'var(--text-h3)' }}>Choisir un terrain</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '50vh', overflowY: 'auto' }}>
          {courses.map((c) => (
            <div
              key={c.id}
              onClick={() => selectCourse(c.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', borderRadius: 10,
                border: c.id === liveRound.courseId ? '2px solid var(--brand-action)' : '1px solid var(--border-default)',
                cursor: 'pointer',
              }}
            >
              <div>
                <div style={{ font: 'var(--text-body)', fontWeight: 600 }}>{c.name}</div>
                <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>
                  {c.kind === 'interieur' ? 'Simulateur' : c.city} · {c.holes} trous
                </div>
              </div>
              {c.id === liveRound.courseId && <span style={{ color: 'var(--brand-action)', fontWeight: 700 }}>✓</span>}
            </div>
          ))}
        </div>
        <span onClick={() => setCourseListOpen(false)} style={{ textAlign: 'center', font: 'var(--text-small)', color: 'var(--text-muted)', cursor: 'pointer' }}>Annuler</span>
      </Sheet>

      <Sheet open={shrinkConfirmOpen} onClose={() => setShrinkConfirmOpen(false)} zIndex={70} dim={0.45}>
        <div style={{ font: 'var(--text-h3)' }}>Convertir en 9 trous ?</div>
        <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)' }}>
          Toutes les données des trous 10 à 18 seront supprimées. Cette action est irréversible.
        </div>
        <Button variant="secondary" onClick={() => setShrinkConfirmOpen(false)} style={{ height: 52, width: '100%' }}>Annuler</Button>
        <Button variant="primary" onClick={confirmShrink} style={{ height: 52, width: '100%', background: 'var(--color-score-under)' }}>Convertir en 9 trous</Button>
      </Sheet>
    </div>
  );
}
