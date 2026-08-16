import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Sheet from '../components/Sheet';
import Input from '../components/Input';
import Button from '../components/Button';
import RoundExpenses from '../components/RoundExpenses';
import { useData } from '../contexts/DataContext';
import { parLabel, toneFor } from '../lib/scoring';

function tdHead() { return { padding: '6px 10px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid var(--border-default)', position: 'sticky', left: 0, background: '#fff' }; }
function td() { return { padding: '6px 10px', textAlign: 'center', borderBottom: '1px solid var(--border-default)' }; }

export default function Summary() {
  const { roundId } = useParams();
  const navigate = useNavigate();
  const { allRounds, players, courses, saveQuickCourseAsReusable } = useData();
  const round = allRounds.find((r) => r.id === roundId) || allRounds.find((r) => r.status === 'completed');
  const course = courses.find((c) => c.id === round?.courseId);

  const [savePromptOpen, setSavePromptOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveSimulated, setSaveSimulated] = useState('');

  useEffect(() => {
    if (course?.isQuickDraft) {
      setSaveName(course.name || '');
      setSaveSimulated(course.simulatedCourse || '');
      setSavePromptOpen(true);
    }
  }, [course?.id, course?.isQuickDraft]);

  if (!round) {
    return (
      <div>
        <Header title="Résumé" onBack={() => navigate('/parties')} />
        <div style={{ padding: 24 }}>Aucune partie.</div>
      </div>
    );
  }

  const par = course ? course.pars.reduce((a, b) => a + (b || 0), 0) : (round.par || 72);

  const saveCourse = async () => {
    if (!saveName.trim()) return;
    await saveQuickCourseAsReusable(course.id, { name: saveName.trim(), simulatedCourse: saveSimulated.trim() });
    setSavePromptOpen(false);
  };

  return (
    <div>
      <Header title="Résumé" onBack={() => navigate('/parties')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={{ font: 'var(--text-h3)' }}>{course?.name}</div>
          <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{round.date} · {round.holes} trous</div>
        </div>

        {round.playerIds.map((pid) => {
          const player = players.find((p) => p.id === pid);
          const diff = round.totals[pid] - par;
          return (
            <Card key={pid}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ font: 'var(--text-label)' }}>{player?.name}</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ font: 'var(--text-stat-lg)' }}>{round.totals[pid]}</span>
                  <Badge tone={toneFor(diff)}>{parLabel(diff)}</Badge>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', rowGap: 4, font: 'var(--text-small)', color: 'var(--text-muted)' }}>
                <span>{round.putts?.[pid] || 0} putts</span>
                <span>{round.mulligans[pid] || 0} mulligans</span>
                <span>{round.lostBalls[pid] || 0} balle(s) perdue(s)</span>
                <span>{round.beers[pid] || 0} bières</span>
              </div>
            </Card>
          );
        })}

        {round.holeScores && course && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', font: 'var(--text-small)' }}>
              <tbody>
                <tr>
                  <td style={tdHead()}>Trou</td>
                  {course.pars.slice(0, round.holes).map((_, i) => <td key={i} style={td()}>{i + 1}</td>)}
                </tr>
                <tr>
                  <td style={tdHead()}>Par</td>
                  {course.pars.slice(0, round.holes).map((p, i) => <td key={i} style={td()}>{p ?? '-'}</td>)}
                </tr>
                {round.playerIds.map((pid) => (
                  <tr key={pid}>
                    <td style={tdHead()}>{players.find((p) => p.id === pid)?.name}</td>
                    {round.holeScores[pid].map((sc, i) => <td key={i} style={td()}>{sc ?? '-'}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <RoundExpenses roundId={round.id} playerIds={round.playerIds} players={players} />
      </div>

      <Sheet open={savePromptOpen} onClose={() => setSavePromptOpen(false)}>
        <div style={{ font: 'var(--text-h3)' }}>Enregistrer ce parcours ?</div>
        <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)' }}>
          Tu pourras réutiliser les pars et les distances la prochaine fois.
        </div>
        <Input label="Lieu" value={saveName} onChange={(e) => setSaveName(e.target.value)} />
        <Input label="Parcours simulé (optionnel)" placeholder="Pebble Beach" value={saveSimulated} onChange={(e) => setSaveSimulated(e.target.value)} />
        <Button variant="primary" onClick={saveCourse} style={{ height: 52, width: '100%' }}>Enregistrer le parcours</Button>
        <span onClick={() => setSavePromptOpen(false)} style={{ textAlign: 'center', font: 'var(--text-small)', color: 'var(--text-muted)', cursor: 'pointer' }}>
          Pas maintenant
        </span>
      </Sheet>
    </div>
  );
}
