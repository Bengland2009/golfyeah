import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Sheet from '../components/Sheet';
import SegmentedControl from '../components/SegmentedControl';
import CompactPicker from '../components/CompactPicker';
import Scorecard from '../components/Scorecard';
import { useData } from '../contexts/DataContext';
import { avatarSrc } from '../lib/avatar';

const PAR_OPTIONS = [3, 4, 5];
const PUTT_OPTIONS = [
  { value: 0, label: '0' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4+' },
];

function MiniStepper({ label, value, onDec, onInc }) {
  const smallBtn = { width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', fontSize: 16 };
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button type="button" onClick={onDec} style={smallBtn}>−</button>
        <span style={{ font: 'var(--text-label)', width: 16, textAlign: 'center' }}>{value}</span>
        <button type="button" onClick={onInc} style={smallBtn}>+</button>
      </div>
    </div>
  );
}

// Resizes an array to `len`, keeping existing values at their index and
// filling any newly-added slots with `fill(i)` — used when the format
// changes (9<->18) so already-entered holes are never disturbed.
function resized(arr, len, fill) {
  return Array.from({ length: len }, (_, i) => (i < arr.length ? arr[i] : fill(i)));
}

export default function EditRound() {
  const { roundId } = useParams();
  const navigate = useNavigate();
  const { allRounds, courses, players, updateCourseHoles, updateCompletedRound } = useData();
  const round = allRounds.find((r) => r.id === roundId);

  const [courseId, setCourseId] = useState(round?.courseId);
  const [format, setFormat] = useState(round?.holes || 18);
  const [pars, setPars] = useState(() => {
    const c = courses.find((x) => x.id === round?.courseId);
    return Array.from({ length: round?.holes || 18 }, (_, i) => c?.pars?.[i] ?? null);
  });
  const [scores, setScores] = useState(() => Object.fromEntries(
    (round?.playerIds || []).map((pid) => [pid, Array.from({ length: round?.holes || 18 }, (_, i) => (round.holeScores?.[pid]?.[i] != null ? String(round.holeScores[pid][i]) : ''))]),
  ));
  const [holePutts, setHolePutts] = useState(() => Object.fromEntries(
    (round?.playerIds || []).map((pid) => [pid, Array.from({ length: round?.holes || 18 }, (_, i) => (round.holePutts?.[pid]?.[i] != null ? String(round.holePutts[pid][i]) : ''))]),
  ));
  const [mulligans, setMulligans] = useState(() => Object.fromEntries((round?.playerIds || []).map((pid) => [pid, round.mulligans?.[pid] || 0])));
  const [lostBalls, setLostBalls] = useState(() => Object.fromEntries((round?.playerIds || []).map((pid) => [pid, round.lostBalls?.[pid] || 0])));
  const [beers, setBeers] = useState(() => Object.fromEntries((round?.playerIds || []).map((pid) => [pid, round.beers?.[pid] || 0])));
  const [parPickerHole, setParPickerHole] = useState(null);
  const [puttPickerCell, setPuttPickerCell] = useState(null);
  const [courseListOpen, setCourseListOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!round || round.status !== 'completed') {
    navigate('/parties');
    return null;
  }

  const playerIds = round.playerIds;
  const course = courses.find((c) => c.id === courseId);

  const setScore = (pid, holeIdx, v) => {
    if (v !== '' && !/^\d{1,2}$/.test(v)) return;
    setScores((s) => ({ ...s, [pid]: s[pid].map((x, i) => (i === holeIdx ? v : x)) }));
  };
  const setPuttHole = (pid, holeIdx, v) => {
    setHolePutts((s) => ({ ...s, [pid]: s[pid].map((x, i) => (i === holeIdx ? v : x)) }));
    setPuttPickerCell(null);
  };
  const setPar = (holeIdx, val) => {
    setPars((arr) => arr.map((p, i) => (i === holeIdx ? val : p)));
    setParPickerHole(null);
  };
  const bump = (setter, pid, delta) => setter((s) => ({ ...s, [pid]: Math.max(0, (s[pid] || 0) + delta) }));

  const changeFormat = (newFormat) => {
    setFormat(newFormat);
    setPars((arr) => resized(arr, newFormat, (i) => course?.pars?.[i] ?? null));
    setScores((s) => {
      const next = {};
      playerIds.forEach((pid) => { next[pid] = resized(s[pid], newFormat, () => ''); });
      return next;
    });
    setHolePutts((s) => {
      const next = {};
      playerIds.forEach((pid) => { next[pid] = resized(s[pid], newFormat, () => ''); });
      return next;
    });
  };

  const selectCourse = (newCourseId) => {
    setCourseId(newCourseId);
    const newCourse = courses.find((c) => c.id === newCourseId);
    setPars(Array.from({ length: format }, (_, i) => newCourse?.pars?.[i] ?? null));
    setCourseListOpen(false);
  };

  const totalFor = (pid) => scores[pid].reduce((a, v) => a + (Number(v) || 0), 0);
  const puttsTotalFor = (pid) => holePutts[pid].reduce((a, v) => a + (Number(v) || 0), 0);

  const allParsKnown = pars.every((p) => p != null);
  const allScoresFilled = playerIds.every((pid) => scores[pid].every((v) => v !== '' && Number(v) > 0));
  const canSave = allParsKnown && allScoresFilled && !saving;

  const doSave = async () => {
    if (!canSave) return;
    setSaving(true);
    if (course?.isQuickDraft) {
      const yardages = Array.from({ length: format }, (_, i) => course.yardages?.[i] ?? null);
      await updateCourseHoles(course.id, pars, yardages);
    }
    const totals = {}, mull = {}, lost = {}, beersOut = {}, puttsOut = {}, holeScores = {}, holePuttsOut = {};
    playerIds.forEach((pid) => {
      totals[pid] = totalFor(pid);
      mull[pid] = mulligans[pid] || 0;
      lost[pid] = lostBalls[pid] || 0;
      beersOut[pid] = beers[pid] || 0;
      puttsOut[pid] = puttsTotalFor(pid);
      holeScores[pid] = scores[pid].map((v) => Number(v));
      holePuttsOut[pid] = holePutts[pid].map((v) => Number(v) || 0);
    });
    await updateCompletedRound(round.id, {
      courseId, holes: format,
      totals, mulligans: mull, lostBalls: lost, beers: beersOut, putts: puttsOut,
      holeScores, holePutts: holePuttsOut,
    });
    setConfirmOpen(false);
    navigate(`/resume/${round.id}`);
  };

  return (
    <div>
      <Header title="Modifier la partie" onBack={() => navigate(`/resume/${round.id}`)} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ font: 'var(--text-label)' }}>Terrain</span>
          <CompactPicker value={course?.name} onClick={() => setCourseListOpen(true)} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ font: 'var(--text-label)' }}>Nombre de trous</span>
          <SegmentedControl
            options={[{ value: 9, label: '9 trous' }, { value: 18, label: '18 trous' }]}
            value={format}
            onChange={changeFormat}
          />
        </div>

        <Scorecard
          holes={format}
          pars={pars}
          players={playerIds.map((pid) => players.find((p) => p.id === pid) || { id: pid, name: '?' })}
          scores={scores}
          putts={holePutts}
          editable
          onScoreChange={setScore}
          onPuttClick={(pid, h) => setPuttPickerCell({ pid, holeIdx: h })}
          onParClick={setParPickerHole}
        />

        {!allParsKnown && (
          <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', textAlign: 'center' }}>
            Indique le par de chaque trou (touche « ? ») avant d'enregistrer.
          </div>
        )}

        <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Statistiques
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {playerIds.map((pid) => {
            const player = players.find((p) => p.id === pid);
            return (
              <Card key={pid}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <Avatar src={avatarSrc(player)} name={player?.name} size={36} />
                  <span style={{ font: 'var(--text-label)' }}>{player?.name}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <MiniStepper label="Mulligans" value={mulligans[pid]} onDec={() => bump(setMulligans, pid, -1)} onInc={() => bump(setMulligans, pid, 1)} />
                  <MiniStepper label="Balles perdues" value={lostBalls[pid]} onDec={() => bump(setLostBalls, pid, -1)} onInc={() => bump(setLostBalls, pid, 1)} />
                  <MiniStepper label="Bières" value={beers[pid]} onDec={() => bump(setBeers, pid, -1)} onInc={() => bump(setBeers, pid, 1)} />
                </div>
              </Card>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" onClick={() => navigate(`/resume/${round.id}`)} style={{ flex: 1, height: 52 }}>
            Annuler
          </Button>
          <Button variant="primary" onClick={() => setConfirmOpen(true)} disabled={!canSave} style={{ flex: 1, height: 52 }}>
            Enregistrer les modifications
          </Button>
        </div>
      </div>

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
                border: c.id === courseId ? '2px solid var(--brand-action)' : '1px solid var(--border-default)',
                cursor: 'pointer',
              }}
            >
              <div>
                <div style={{ font: 'var(--text-body)', fontWeight: 600 }}>{c.name}</div>
                <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>
                  {c.kind === 'interieur' ? 'Simulateur' : c.city} · {c.holes} trous
                </div>
              </div>
              {c.id === courseId && <span style={{ color: 'var(--brand-action)', fontWeight: 700 }}>✓</span>}
            </div>
          ))}
        </div>
        <span onClick={() => setCourseListOpen(false)} style={{ textAlign: 'center', font: 'var(--text-small)', color: 'var(--text-muted)', cursor: 'pointer' }}>Annuler</span>
      </Sheet>

      <Sheet open={parPickerHole != null} onClose={() => setParPickerHole(null)}>
        <div style={{ font: 'var(--text-h3)' }}>Par du trou {parPickerHole != null ? parPickerHole + 1 : ''}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {PAR_OPTIONS.map((p) => (
            <Button key={p} variant="secondary" onClick={() => setPar(parPickerHole, p)} style={{ flex: 1, borderRadius: 999 }}>{p}</Button>
          ))}
        </div>
      </Sheet>

      <Sheet open={puttPickerCell != null} onClose={() => setPuttPickerCell(null)}>
        <div style={{ font: 'var(--text-h3)' }}>Putts — trou {puttPickerCell != null ? puttPickerCell.holeIdx + 1 : ''}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {PUTT_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant="secondary"
              onClick={() => setPuttHole(puttPickerCell.pid, puttPickerCell.holeIdx, opt.value)}
              style={{ flex: 1, borderRadius: 999 }}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </Sheet>

      <Sheet open={confirmOpen} onClose={() => setConfirmOpen(false)} zIndex={70} dim={0.45}>
        <div style={{ font: 'var(--text-h3)' }}>Enregistrer les modifications ?</div>
        <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)' }}>
          Les statistiques et le classement seront recalculés automatiquement.
        </div>
        <Button variant="secondary" onClick={() => setConfirmOpen(false)} style={{ height: 52, width: '100%' }}>Annuler</Button>
        <Button variant="primary" onClick={doSave} disabled={saving} style={{ height: 52, width: '100%' }}>
          Enregistrer les modifications
        </Button>
      </Sheet>
    </div>
  );
}
