import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sheet from '../components/Sheet';
import Input from '../components/Input';
import Button from '../components/Button';
import SegmentedControl from '../components/SegmentedControl';
import BeerCounter from '../components/BeerCounter';
import HoleSetupPrompt from '../components/HoleSetupPrompt';
import { FlagIcon, ChevronRightIcon } from '../components/icons';
import HoleStrip from '../components/HoleStrip';
import { useData } from '../contexts/DataContext';

// Golf Tracker is an alternate, optional UI for the same live-round data
// the normal hole-by-hole scorecard uses (live.scores[playerId][holeIndex]
// .strokes/.putts) — there is deliberately no separate storage for it, so
// editing either one always keeps the other in sync, and autosave/resume
// falls out for free from the existing live-round persistence.
//
// During play there is exactly one primary action: the big "+1 Coup"
// circle. Putts (a subset of strokes — bumpPuttStroke increments both
// counters together) are logged by tapping the putts pill itself, which
// doubles as the readout and the input — so there is never a second
// button competing with the circle, and no putting "mode" to remember to
// switch into. Mulligans, lost balls and putt confirmation are deferred
// to the end-of-hole sheet so the in-play surface stays minimal.
//
// Visual hierarchy is single-threaded, top to bottom: hole context (quiet,
// with a hairline progress bar) -> score + unit label (dominant) -> putts
// pill (quiet, always rendered, tap to +1) -> +1 Coup (the one bold
// action) -> undo/edit -> Terminer le trou, set apart as its own
// end-of-flow block so it never reads as just another row.

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

// Read-only line in the end-of-hole summary — no controls, just the
// number already recorded during play.
function SummaryRow({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ font: 'var(--text-label)' }}>{value}</span>
    </div>
  );
}

// Editable line shown only once "Modifier les statistiques" is tapped —
// unlike the plain "+"-only rows used during play, this allows both
// directions since its whole purpose is correcting a mistake.
function EditableStatRow({ label, value, onDec, onInc }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {value > 0 && (
          <button type="button" onClick={onDec} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border-default)', background: '#fff', color: 'var(--text-muted)', fontSize: 16, cursor: 'pointer' }}>−</button>
        )}
        <span style={{ font: 'var(--text-label)', minWidth: 16, textAlign: 'center' }}>{value}</span>
        <button type="button" onClick={onInc} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'var(--brand-action)', color: '#fff', fontSize: 16, cursor: 'pointer' }}>+</button>
      </div>
    </div>
  );
}

export default function GolfTracker() {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const {
    players, liveRound, currentLiveCourse, getHolePar, getHoleYardage,
    setStrokes, bumpPuttStroke, setPutts, bumpHoleField, addBeer, removeBeer,
    changeHole, goToHole, finishRound, editHoleForCourse,
  } = useData();

  const [pressed, setPressed] = useState(null); // 'stroke' | 'putt' | null
  const [lastActionWasPutt, setLastActionWasPutt] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [finishOpen, setFinishOpen] = useState(false);
  const [editingStats, setEditingStats] = useState(false);

  useEffect(() => {
    setLastActionWasPutt(false);
    setEditingStats(false);
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

  // For the hole strip: null means "no final score yet" (upcoming, or the
  // hole currently being played — its strokes are still moving).
  const getDiff = (idx) => {
    const entry = liveRound.scores[playerId]?.[idx];
    const holePar = getHolePar(idx);
    if (!entry || !entry.strokes || holePar == null) return null;
    return entry.strokes - holePar;
  };

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

  const openFinish = () => { setEditingStats(false); setFinishOpen(true); };

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
        <div style={{ position: 'relative', textAlign: 'center', padding: '10px var(--page-padding-mobile) 12px' }}>
          <button
            onClick={() => navigate('/partie/en-cours')}
            aria-label="Retour à la scorecard"
            style={{ position: 'absolute', left: 4, top: 4, background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', fontSize: 22, padding: 8, cursor: 'pointer', lineHeight: 1 }}
          >
            ‹
          </button>
          <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', textTransform: 'uppercase', color: '#fff' }}>
            Trou {i + 1} <span style={{ opacity: 0.55, fontWeight: 500 }}>de {liveRound.format}</span>
          </div>
          {!needsSetup && (
            <div style={{ font: 'var(--text-small)', fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>
              Par {par}{yard ? ` · ${yard} vg` : ''}
            </div>
          )}
        </div>
        <div style={{ height: 2, background: 'rgba(255,255,255,0.16)' }}>
          <div style={{ height: '100%', width: `${((i + 1) / liveRound.format) * 100}%`, background: 'rgba(255,255,255,0.9)', transition: 'width 200ms ease' }} />
        </div>
      </div>

      <HoleStrip format={liveRound.format} currentIndex={i} getDiff={getDiff} onSelect={goToHole} />

      {needsSetup && (
        <HoleSetupPrompt holeNumber={i + 1} onSave={(p, y) => editHoleForCourse(p, y)} />
      )}

      {!needsSetup && (
      <>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0, padding: '16px var(--page-padding-mobile)' }}>
        {player && (
          <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', textTransform: 'uppercase', color: 'var(--text-disabled)' }}>
            {player.name}
          </div>
        )}

        <div style={{ font: 'var(--font-sans)', fontWeight: 800, fontSize: 116, lineHeight: 1, color: 'var(--text-body)', fontVariantNumeric: 'tabular-nums', marginTop: 6 }}>
          {strokes}
        </div>
        <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 4 }}>
          {strokes === 1 ? 'coup' : 'coups'}
        </div>

        <button
          onClick={tapPutt}
          aria-label="+1 putt"
          style={{
            marginTop: 22,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            height: 40, padding: '0 8px 0 14px',
            borderRadius: 999, border: 'none',
            background: pressed === 'putt' ? 'var(--border-default)' : 'var(--surface-tint)',
            cursor: 'pointer',
            transform: pressed === 'putt' ? 'scale(0.96)' : 'scale(1)',
            transition: 'transform 110ms ease, background 110ms ease',
          }}
        >
          <FlagIcon width={15} height={15} strokeWidth={2} style={{ color: 'var(--text-muted)' }} />
          <span style={{ font: 'var(--text-small)', fontSize: 14, color: 'var(--text-muted)' }}>
            {putts} putt{putts > 1 ? 's' : ''}
          </span>
          <span
            style={{
              width: 22, height: 22, borderRadius: '50%', background: 'var(--brand-action)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, lineHeight: 1,
            }}
          >
            +
          </span>
        </button>

        <button
          onClick={tapStroke}
          aria-label="+1 coup"
          style={{
            width: 208,
            height: 208,
            marginTop: 36,
            borderRadius: '50%',
            border: 'none',
            background: 'var(--brand-action)',
            boxShadow: pressed === 'stroke' ? '0 4px 14px rgba(0,82,57,0.25)' : '0 14px 30px rgba(0,82,57,0.28)',
            cursor: 'pointer',
            transform: pressed === 'stroke' ? 'scale(0.95)' : 'scale(1)',
            transition: 'transform 110ms ease, box-shadow 110ms ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          <span style={{ font: 'var(--font-sans)', fontWeight: 700, fontSize: 19, color: '#fff' }}>+1 Coup</span>
        </button>
      </div>

      <div style={{ borderTop: '1px solid var(--border-default)', paddingBottom: 'var(--safe-bottom)' }}>
        {strokes > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 28, padding: '14px var(--page-padding-mobile) 0' }}>
            <span onClick={undo} style={{ font: 'var(--text-small)', color: 'var(--text-muted)', cursor: 'pointer' }}>
              Annuler
            </span>
            <span onClick={openEdit} style={{ font: 'var(--text-small)', color: 'var(--text-muted)', cursor: 'pointer' }}>
              Modifier le score
            </span>
          </div>
        )}
        {strokes === 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '14px var(--page-padding-mobile) 0' }}>
            <span onClick={openEdit} style={{ font: 'var(--text-small)', color: 'var(--text-muted)', cursor: 'pointer' }}>
              Modifier le score
            </span>
          </div>
        )}

        <div style={{ padding: '20px var(--page-padding-mobile) 18px' }}>
          <button
            onClick={openFinish}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', height: 56, borderRadius: 14,
              background: 'var(--surface-tint)', border: 'none', cursor: 'pointer',
            }}
          >
            <span style={{ font: 'var(--text-label)', fontWeight: 700, fontSize: 16, color: 'var(--brand-action)' }}>
              {isLastHole ? 'Terminer la partie' : 'Terminer le trou'}
            </span>
            <ChevronRightIcon width={20} height={20} strokeWidth={2.25} style={{ color: 'var(--brand-action)' }} />
          </button>
        </div>
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
          <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>Score</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ font: 'var(--font-sans)', fontWeight: 800, fontSize: 26, color: 'var(--text-body)' }}>{strokes}</span>
            <span
              onClick={() => { setFinishOpen(false); openEdit(); }}
              style={{ font: 'var(--text-small)', color: 'var(--brand-action)', cursor: 'pointer' }}
            >
              Modifier
            </span>
          </div>
        </div>

        {editingStats ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginBottom: 8 }}>Putts</div>
              <SegmentedControl options={puttOptions(strokes)} value={Math.min(putts, strokes)} onChange={(v) => setPutts(playerId, v)} />
            </div>
            <EditableStatRow
              label="Mulligans" value={rawEntry?.mulligans || 0}
              onDec={() => bumpHoleField(playerId, 'mulligans', -1)}
              onInc={() => bumpHoleField(playerId, 'mulligans', 1)}
            />
            <EditableStatRow
              label="Balles perdues" value={rawEntry?.lostBalls || 0}
              onDec={() => bumpHoleField(playerId, 'lostBalls', -1)}
              onInc={() => bumpHoleField(playerId, 'lostBalls', 1)}
            />
            <BeerCounter value={liveRound.beers[playerId] || 0} onAdd={() => addBeer(playerId)} onRemove={() => removeBeer(playerId)} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SummaryRow label="Putts" value={`${putts} putt${putts > 1 ? 's' : ''}`} />
            <SummaryRow label="Mulligans" value={rawEntry?.mulligans || 0} />
            <SummaryRow label="Balles perdues" value={rawEntry?.lostBalls || 0} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 16 }}>🍺</span> Bières
              </span>
              <span style={{ font: 'var(--text-label)' }}>{liveRound.beers[playerId] || 0}</span>
            </div>
          </div>
        )}

        <Button variant="primary" onClick={confirmFinish} style={{ height: 52, width: '100%' }}>
          {isLastHole ? 'Terminer la partie' : 'Trou suivant'}
        </Button>

        {!editingStats && (
          <span
            onClick={() => setEditingStats(true)}
            style={{ textAlign: 'center', font: 'var(--text-small)', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            Modifier les statistiques
          </span>
        )}
      </Sheet>
    </div>
  );
}
