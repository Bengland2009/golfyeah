import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Sheet from '../components/Sheet';
import Input from '../components/Input';
import Button from '../components/Button';
import RoundExpenses from '../components/RoundExpenses';
import Scorecard from '../components/Scorecard';
import { useData } from '../contexts/DataContext';
import { parLabel, toneFor, coursePar } from '../lib/scoring';

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

  const par = course ? coursePar(course, round.holes) : (round.par || 72);

  const saveCourse = async () => {
    if (!saveName.trim()) return;
    await saveQuickCourseAsReusable(course.id, { name: saveName.trim(), simulatedCourse: saveSimulated.trim() });
    setSavePromptOpen(false);
  };

  return (
    <div>
      <Header title="Résumé" onBack={() => navigate('/parties')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ font: 'var(--text-h3)' }}>{course?.name}</div>
            <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{round.date} · {round.holes} trous</div>
          </div>
          <span
            onClick={() => navigate(`/resume/${round.id}/modifier`)}
            style={{ font: 'var(--text-small)', color: 'var(--brand-action)', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', marginTop: 2 }}
          >
            Modifier la partie
          </span>
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
                <span>{round.mulligans[pid] || 0} mulligans</span>
                <span>{round.lostBalls[pid] || 0} balle(s) perdue(s)</span>
                <span>{round.beers[pid] || 0} bières</span>
              </div>
            </Card>
          );
        })}

        {round.holeScores && course && (
          <Scorecard
            holes={round.holes}
            pars={Array.from({ length: round.holes }, (_, i) => course.pars[i] ?? null)}
            players={round.playerIds.map((pid) => players.find((p) => p.id === pid) || { id: pid, name: '?' })}
            scores={round.holeScores}
            putts={round.holePutts}
          />
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
