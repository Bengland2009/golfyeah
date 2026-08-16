import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sheet from '../components/Sheet';
import Input from '../components/Input';
import Button from '../components/Button';
import SegmentedControl from '../components/SegmentedControl';
import BeerCounter from '../components/BeerCounter';
import HoleSetupPrompt from '../components/HoleSetupPrompt';
import { useData } from '../contexts/DataContext';

// Golf Tracker is an alternate, optional UI for the same live-round data
// the normal hole-by-hole scorecard uses (live.scores[playerId][holeIndex]
// .strokes/.putts) — there is deliberately no separate storage for it, so
// editing either one always keeps the other in sync, and autosave/resume
// falls out for free from the existing live-round persistence.
//
// During play there is only ever "+1 Coup" and "+1 Putt" — a putt IS a
// stroke, so +1 Putt bumps both counters together. There is no putting
// "mode": both buttons are always on screen. Mulligans, lost balls and
// putt confirmation are deferred to the end-of-hole sheet so the in-play
// surface stays down to those two taps.

function vibrate(ms) {
  if (navigator.vibrate) {
    try { navigator.vibrate(ms); } catch {}
  }
}

function puttOptions(strokes) {
  const cap = Math.max(0, strokes || 0);
  const opts = [];
  for (let n = 0; n <= Math.min(3, cap); n++) opts.push({ label: String(n), value: n });
  if (cap >= 4) opts.push({ label: '4+', value: 4 });
  return opts;
}

export default function GolfTracker() {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const {
    players, liveRound, currentLiveCourse, getHolePar, getHoleYardage,
    setStrokes, bumpPuttStroke, setPutts, bumpHoleField, addBeer, removeBeer,
    changeHole, finishRound, editHoleForCourse,
  } = useData();

  const [pressed, setPressed] = useState(null); // 'stroke' | 'putt' | null
  const [lastActionWasPutt, setLastActionWasPutt] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [finishOpen, setFinishOpen] = useState(false);

  useEffect(() => {
    setLastActionWasPutt(false);
  }, [liveRound?.holeIndex]);

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
  const putts = rawEntry ? (rawEntry.putts || 0) : 0;

  const flash = (which) => {
    setPressed(which);
    setTimeout(() => setPressed(null), 120);
  };

  const tapStroke = () => {
    vibrate(12);
    flash('stroke');
    setLastActionWasPutt(false);
    setStrokes(playerId, strokes + 1);
  };

  const tapPutt = () => {
    vibrate(12);
    flash('putt');
    setLastActionWasPutt(true);
    bumpPuttStroke(playerId, 1);
  };

  const undo = () => {
    if (strokes <= 0) return;
    vibrate(8);
    if (lastActionWasPutt && putts > 0) {
      bumpPuttStroke(playerId, -1);
    } else {
      setStrokes(playerId, strokes - 1);
    }
    setLastActionWasPutt(false);
  };

  const openEdit = () => { setEditValue(String(strokes || 0)); setEditOpen(true); };
  const saveEdit = () => {
    const v = Number(editValue);
    if (Number.isFinite(v) && v > 0) setStrokes(playerId, v);
    setEditOpen(false);
  };

  const openFinish = () => setFinishOpen(true);

  const confirmFinish = async () => {
    setFinishOpen(false);
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '20px var(--page-padding-mobile)' }}>
        {player && (
          <div style={{ font: 'var(--text-label)', color: 'var(--text-muted)' }}>{player.name}</div>
        )}

        <div style={{ textAlign: 'center' }}>
          <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
            Coup actuel
          </div>
          <div style={{ font: 'var(--font-sans)', fontWeight: 700, fontSize: 80, lineHeight: 1, color: 'var(--text-body)', fontVariantNumeric: 'tabular-nums' }}>
            {strokes}
          </div>
          {putts > 0 && (
            <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginTop: 4 }}>
              dont {putts} putt{putts > 1 ? 's' : ''}
            </div>
          )}
        </div>

        <button
          onClick={tapStroke}
          aria-label="+1 coup"
          style={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            border: '1px solid var(--border-default)',
            background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #f3f5f3 60%, #e6e9e6 100%)',
            boxShadow: pressed === 'stroke' ? 'inset 0 4px 10px rgba(0,0,0,0.15)' : 'var(--shadow-elevated), 0 10px 24px rgba(0,82,57,0.18)',
            cursor: 'pointer',
            transform: pressed === 'stroke' ? 'scale(0.94)' : 'scale(1)',
            transition: 'transform 90ms ease, box-shadow 90ms ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          <span style={{ font: 'var(--text-label)', fontWeight: 700, fontSize: 18, color: 'var(--brand-action)' }}>+1 Coup</span>
        </button>

        <button
          onClick={tapPutt}
          aria-label="+1 putt"
          style={{
            width: 128,
            height: 64,
            borderRadius: 999,
            border: '1px solid var(--border-default)',
            background: pressed === 'putt' ? 'var(--surface-tint)' : '#fff',
            boxShadow: pressed === 'putt' ? 'inset 0 3px 8px rgba(0,0,0,0.1)' : 'var(--shadow-card)',
            cursor: 'pointer',
            transform: pressed === 'putt' ? 'scale(0.96)' : 'scale(1)',
            transition: 'transform 90ms ease, box-shadow 90ms ease, background 90ms ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          <span style={{ font: 'var(--text-label)', fontWeight: 700, fontSize: 15, color: 'var(--text-body)' }}>+1 Putt</span>
        </button>

        {strokes > 0 && (
          <span onClick={undo} style={{ font: 'var(--text-small)', color: 'var(--text-muted)', cursor: 'pointer' }}>
            Annuler le dernier coup
          </span>
        )}
      </div>

      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 'calc(var(--page-padding-mobile) + var(--safe-bottom))' }}>
        <Button variant="primary" onClick={openFinish} style={{ height: 52, width: '100%' }}>
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

      <Sheet open={finishOpen} onClose={() => setFinishOpen(false)}>
        <div style={{ font: 'var(--text-h3)' }}>Trou {i + 1} terminé</div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div>
            <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Score</div>
            <div style={{ font: 'var(--font-sans)', fontWeight: 700, fontSize: 44, lineHeight: 1.1, color: 'var(--text-body)' }}>{strokes}</div>
          </div>
          <span
            onClick={() => { setFinishOpen(false); openEdit(); }}
            style={{ font: 'var(--text-small)', color: 'var(--brand-action)', cursor: 'pointer' }}
          >
            Modifier le score
          </span>
        </div>

        <div>
          <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginBottom: 8 }}>Nombre de putts</div>
          <SegmentedControl options={puttOptions(strokes)} value={Math.min(putts, strokes)} onChange={(v) => setPutts(playerId, v)} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>Mulligan</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ font: 'var(--text-label)' }}>{rawEntry?.mulligans || 0}</span>
              <button type="button" onClick={() => bumpHoleField(playerId, 'mulligans', 1)} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'var(--brand-action)', color: '#fff', fontSize: 16, cursor: 'pointer' }}>+</button>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>Balle perdue</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ font: 'var(--text-label)' }}>{rawEntry?.lostBalls || 0}</span>
              <button type="button" onClick={() => bumpHoleField(playerId, 'lostBalls', 1)} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'var(--brand-action)', color: '#fff', fontSize: 16, cursor: 'pointer' }}>+</button>
            </div>
          </div>
          <BeerCounter value={liveRound.beers[playerId] || 0} onAdd={() => addBeer(playerId)} onRemove={() => removeBeer(playerId)} />
        </div>

        <Button variant="primary" onClick={confirmFinish} style={{ height: 52, width: '100%' }}>
          {isLastHole ? 'Terminer la partie' : 'Trou suivant'}
        </Button>
      </Sheet>
    </div>
  );
}
