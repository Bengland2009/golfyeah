import { Fragment, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Sheet from '../components/Sheet';
import { useData } from '../contexts/DataContext';
import { avatarSrc } from '../lib/avatar';
import { parLabel, toneFor } from '../lib/scoring';

const PAR_OPTIONS = [3, 4, 5];
const PUTT_OPTIONS = [
  { value: 0, label: '0' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4+' },
];

function tdHead() {
  return { padding: '6px 10px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid var(--border-default)', position: 'sticky', left: 0, background: '#fff', whiteSpace: 'nowrap' };
}
function td() {
  return { padding: '4px', textAlign: 'center', borderBottom: '1px solid var(--border-default)' };
}

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

export default function QuickEntry() {
  const location = useLocation();
  const navigate = useNavigate();
  const { courses, players, updateCourseHoles, createCompletedRound } = useData();
  const setup = location.state;
  const course = setup && courses.find((c) => c.id === setup.courseId);
  const format = setup?.format || 18;
  const playerIds = setup?.playerIds || [];

  const [pars, setPars] = useState(() => Array.from({ length: format }, (_, i) => course?.pars?.[i] ?? null));
  const [scores, setScores] = useState(() => Object.fromEntries(playerIds.map((pid) => [pid, Array(format).fill('')])));
  const [holePutts, setHolePutts] = useState(() => Object.fromEntries(playerIds.map((pid) => [pid, Array(format).fill('')])));
  const [mulligans, setMulligans] = useState(() => Object.fromEntries(playerIds.map((pid) => [pid, 0])));
  const [lostBalls, setLostBalls] = useState(() => Object.fromEntries(playerIds.map((pid) => [pid, 0])));
  const [beers, setBeers] = useState(() => Object.fromEntries(playerIds.map((pid) => [pid, 0])));
  const [parPickerHole, setParPickerHole] = useState(null);
  const [puttPickerCell, setPuttPickerCell] = useState(null); // { pid, holeIdx } | null
  const [saving, setSaving] = useState(false);

  if (!setup || !course || !playerIds.length) {
    navigate('/nouvelle-partie');
    return null;
  }

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

  const totalFor = (pid) => scores[pid].reduce((a, v) => a + (Number(v) || 0), 0);
  const puttsTotalFor = (pid) => holePutts[pid].reduce((a, v) => a + (Number(v) || 0), 0);
  const roundPar = pars.reduce((a, p) => a + (p || 0), 0);

  const allParsKnown = pars.every((p) => p != null);
  const allScoresFilled = playerIds.every((pid) => scores[pid].every((v) => v !== '' && Number(v) > 0));
  const canSave = allParsKnown && allScoresFilled && !saving;

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    if (course.isQuickDraft) {
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
    const roundId = await createCompletedRound({
      courseId: course.id, holes: format, playerIds,
      totals, mulligans: mull, lostBalls: lost, beers: beersOut, putts: puttsOut,
      holeScores, holePutts: holePuttsOut, par: roundPar,
    });
    navigate(`/resume/${roundId}`);
  };

  const halves = format === 18
    ? [{ label: 'Aller', from: 0, to: 9 }, { label: 'Retour', from: 9, to: 18 }]
    : [{ label: null, from: 0, to: format }];

  return (
    <div>
      <Header title="Entrée rapide" onBack={() => navigate('/')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={{ font: 'var(--text-h3)', marginBottom: 2 }}>{course.name}</div>
          <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{format} trous</div>
        </div>

        {halves.map((half) => {
          const range = Array.from({ length: half.to - half.from }, (_, k) => half.from + k);
          return (
            <div key={half.from}>
              {half.label && (
                <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                  {half.label} ({half.from + 1}–{half.to})
                </div>
              )}
              <Card>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ borderCollapse: 'collapse', font: 'var(--text-small)' }}>
                    <tbody>
                      <tr>
                        <td style={tdHead()}>Trou</td>
                        {range.map((h) => <td key={h} style={td()}>{h + 1}</td>)}
                      </tr>
                      <tr>
                        <td style={tdHead()}>Par</td>
                        {range.map((h) => (
                          <td key={h} style={td()}>
                            {pars[h] != null ? pars[h] : (
                              <span
                                onClick={() => setParPickerHole(h)}
                                style={{
                                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 24,
                                  borderRadius: 6, border: '1px dashed var(--brand-action)', color: 'var(--brand-action)',
                                  fontWeight: 700, cursor: 'pointer',
                                }}
                              >
                                ?
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                      {playerIds.map((pid) => {
                        const player = players.find((p) => p.id === pid);
                        return (
                          <Fragment key={pid}>
                            <tr>
                              <td style={{ ...tdHead(), borderBottom: 'none' }}>{player?.name}</td>
                              {range.map((h) => (
                                <td key={h} style={{ ...td(), borderBottom: 'none', paddingBottom: 2 }}>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={scores[pid][h]}
                                    onChange={(e) => setScore(pid, h, e.target.value)}
                                    style={{ width: 30, height: 30, textAlign: 'center', border: '1px solid var(--border-default)', borderRadius: 6, font: 'var(--text-small)', padding: 0, outline: 'none' }}
                                  />
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td style={{ ...tdHead(), color: 'var(--text-muted)', fontWeight: 400, fontSize: 12, paddingTop: 0 }}>Putts</td>
                              {range.map((h) => {
                                const v = holePutts[pid][h];
                                const isSet = v !== '';
                                return (
                                  <td key={h} style={{ ...td(), paddingTop: 0 }}>
                                    <span
                                      onClick={() => setPuttPickerCell({ pid, holeIdx: h })}
                                      style={{
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        width: 22, height: 20, borderRadius: 6, cursor: 'pointer',
                                        background: isSet ? '#EAF5EF' : 'transparent',
                                        border: isSet ? '1px solid rgba(0,103,71,0.2)' : '1px dashed var(--border-default)',
                                        color: isSet ? 'var(--brand-action)' : 'var(--text-disabled)',
                                        font: 'var(--text-small)', fontSize: 12, fontWeight: isSet ? 700 : 400,
                                      }}
                                    >
                                      {isSet ? (Number(v) >= 4 ? '4+' : v) : '·'}
                                    </span>
                                  </td>
                                );
                              })}
                            </tr>
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          );
        })}

        {!allParsKnown && (
          <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', textAlign: 'center' }}>
            Indique le par de chaque trou (touche « ? ») avant d'enregistrer.
          </div>
        )}

        <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Résultats
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {playerIds.map((pid) => {
            const player = players.find((p) => p.id === pid);
            const complete = scores[pid].every((v) => v !== '') && allParsKnown;
            const diff = totalFor(pid) - roundPar;
            return (
              <Card key={pid}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar src={avatarSrc(player)} name={player?.name} size={36} />
                    <span style={{ font: 'var(--text-label)' }}>{player?.name}</span>
                  </div>
                  {complete ? (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ font: 'var(--text-stat-lg)', fontSize: 22, fontWeight: 700 }}>{totalFor(pid)}</span>
                      <Badge tone={toneFor(diff)}>{parLabel(diff)}</Badge>
                    </div>
                  ) : (
                    <span style={{ font: 'var(--text-small)', color: 'var(--text-disabled)' }}>—</span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>Putts</span>
                    <span style={{ font: 'var(--text-label)' }}>{puttsTotalFor(pid)}</span>
                  </div>
                  <MiniStepper label="Mulligans" value={mulligans[pid]} onDec={() => bump(setMulligans, pid, -1)} onInc={() => bump(setMulligans, pid, 1)} />
                  <MiniStepper label="Balles perdues" value={lostBalls[pid]} onDec={() => bump(setLostBalls, pid, -1)} onInc={() => bump(setLostBalls, pid, 1)} />
                  <MiniStepper label="Bières" value={beers[pid]} onDec={() => bump(setBeers, pid, -1)} onInc={() => bump(setBeers, pid, 1)} />
                </div>
              </Card>
            );
          })}
        </div>

        <Button variant="primary" onClick={save} disabled={!canSave} style={{ height: 52, width: '100%' }}>
          Enregistrer la partie
        </Button>
      </div>

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
    </div>
  );
}
