import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sheet from '../components/Sheet';
import Input from '../components/Input';
import Button from '../components/Button';
import HoleSetupPrompt from '../components/HoleSetupPrompt';
import { useData } from '../contexts/DataContext';

// Golf Tracker is an alternate, optional UI for the same live-round data
// the normal hole-by-hole scorecard uses (live.scores[playerId][holeIndex]
// .strokes) — there is deliberately no separate storage for it, so editing
// either one always keeps the other in sync, and autosave/resume falls out
// for free from the existing live-round persistence.
//
// The per-hole entry ({ strokes, mulligans, lostBalls }) is intentionally
// left as-is (not narrowed to just "strokes") so a future version can add
// fields here (club, fairwayHit, bunker, gir, putts, penalties, shots) to
// the same object without a data-model change.

function vibrate(ms) {
  if (navigator.vibrate) {
    try { navigator.vibrate(ms); } catch {}
  }
}

export default function GolfTracker() {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const {
    players, liveRound, currentLiveCourse, getHolePar, getHoleYardage,
    setStrokes, changeHole, finishRound, editHoleForCourse,
  } = useData();

  const [pressed, setPressed] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editValue, setEditValue] = useState('');

  if (!liveRound) {
    navigate('/');
    return null;
  }

  const player = players.find((p) => p.id === playerId);
  const course = currentLiveCourse();
  const i = liveRound.holeIndex;
  const par = getHolePar(i);
  const yard = getHoleYardage(i);
  const isLastHole = i === liveRound.format - 1;
  const needsSetup = par == null;

  // Untouched hole (no entry written yet, by either the tracker or the
  // scorecard) shows a virtual 0 rather than jumping straight to par, so
  // the very first tap really does mean "stroke 1" as specced.
  const rawEntry = liveRound.scores[playerId]?.[i];
  const strokes = rawEntry ? rawEntry.strokes : 0;

  const tap = () => {
    vibrate(12);
    setPressed(true);
    setTimeout(() => setPressed(false), 120);
    setStrokes(playerId, strokes + 1);
  };

  const undo = () => {
    if (strokes <= 0) return;
    vibrate(8);
    setStrokes(playerId, strokes - 1);
  };

  const openEdit = () => { setEditValue(String(strokes || 0)); setEditOpen(true); };
  const saveEdit = () => {
    const v = Number(editValue);
    if (Number.isFinite(v) && v > 0) setStrokes(playerId, v);
    setEditOpen(false);
  };

  const finishHole = async () => {
    if (isLastHole) {
      const id = await finishRound();
      navigate(`/resume/${id}`);
    } else {
      changeHole(1);
    }
  };

  return (
    <div className="gy-viewport-h" style={{ display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ background: 'var(--brand-primary)', color: '#fff', paddingTop: 'var(--safe-top)' }}>
        <div style={{ position: 'relative', textAlign: 'center', padding: '16px var(--page-padding-mobile) 20px' }}>
          <button
            onClick={() => navigate('/partie/en-cours')}
            aria-label="Retour à la scorecard"
            style={{ position: 'absolute', left: 'var(--page-padding-mobile)', top: 14, background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: 24, padding: 4, cursor: 'pointer', lineHeight: 1 }}
          >
            ‹
          </button>
          <div style={{ font: 'var(--text-small)', color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>{course.name}</div>
          <div style={{ font: 'var(--font-serif)', fontWeight: 700, fontSize: 28, color: '#fff' }}>Trou {i + 1}</div>
          {!needsSetup && (
            <div style={{ font: 'var(--text-small)', color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>
              Par {par} · {yard ? `${yard} vg` : 'Distance non indiquée'}
            </div>
          )}
        </div>
      </div>

      {needsSetup && (
        <HoleSetupPrompt holeNumber={i + 1} onSave={(p, y) => editHoleForCourse(p, y)} />
      )}

      {!needsSetup && (
      <>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '24px var(--page-padding-mobile)' }}>
        {player && (
          <div style={{ font: 'var(--text-label)', color: 'var(--text-muted)' }}>{player.name}</div>
        )}

        <div style={{ textAlign: 'center' }}>
          <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
            Coup actuel
          </div>
          <div style={{ font: 'var(--font-sans)', fontWeight: 700, fontSize: 88, lineHeight: 1, color: 'var(--text-body)', fontVariantNumeric: 'tabular-nums' }}>
            {strokes}
          </div>
        </div>

        <button
          onClick={tap}
          aria-label="+1 coup"
          style={{
            width: 220,
            height: 220,
            borderRadius: '50%',
            border: '1px solid var(--border-default)',
            background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #f3f5f3 60%, #e6e9e6 100%)',
            boxShadow: pressed ? 'inset 0 4px 10px rgba(0,0,0,0.15)' : 'var(--shadow-elevated), 0 10px 24px rgba(0,82,57,0.18)',
            cursor: 'pointer',
            transform: pressed ? 'scale(0.94)' : 'scale(1)',
            transition: 'transform 90ms ease, box-shadow 90ms ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          <span style={{ font: 'var(--text-label)', fontWeight: 700, fontSize: 18, color: 'var(--brand-action)' }}>+1 Coup</span>
        </button>

        {strokes > 0 && (
          <span onClick={undo} style={{ font: 'var(--text-small)', color: 'var(--text-muted)', cursor: 'pointer' }}>
            Annuler le dernier coup
          </span>
        )}
      </div>

      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 'calc(var(--page-padding-mobile) + var(--safe-bottom))' }}>
        <Button variant="primary" onClick={finishHole} style={{ height: 52, width: '100%' }}>
          {isLastHole ? 'Terminer la partie' : 'Terminer le trou'}
        </Button>
        <span onClick={openEdit} style={{ textAlign: 'center', font: 'var(--text-small)', color: 'var(--text-muted)', cursor: 'pointer' }}>
          Modifier le score manuellement
        </span>
      </div>
      </>
      )}

      <Sheet open={editOpen} onClose={() => setEditOpen(false)}>
        <div style={{ font: 'var(--text-h3)' }}>Modifier le score</div>
        <Input
          label={'Trou ' + (i + 1)}
          type="number"
          inputMode="numeric"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
        />
        <Button variant="primary" onClick={saveEdit} style={{ height: 52, width: '100%' }}>Enregistrer</Button>
        <span onClick={() => setEditOpen(false)} style={{ textAlign: 'center', font: 'var(--text-small)', color: 'var(--text-muted)', cursor: 'pointer' }}>
          Annuler
        </span>
      </Sheet>
    </div>
  );
}
