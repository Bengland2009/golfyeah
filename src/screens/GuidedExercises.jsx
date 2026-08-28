import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import { GUIDED_EXERCISES } from '../lib/guidedExercises';
import { guidedExerciseDiagramFor } from '../components/GuidedExerciseDiagrams';

export default function GuidedExercises() {
  const navigate = useNavigate();

  return (
    <div>
      <Header title="Exercices guidés" onBack={() => navigate('/pratique')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          Cinq idées simples pour travailler tes repères.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {GUIDED_EXERCISES.map((exercise) => {
            const Diagram = guidedExerciseDiagramFor(exercise.id);
            return (
              <Card key={exercise.id} style={{ padding: 14 }}>
                <div style={{ font: 'var(--text-h3)', fontSize: 16, marginBottom: 10 }}>Exercice {exercise.id}</div>
                <div style={{ maxWidth: 240, margin: '0 auto' }}>
                  {Diagram && <Diagram />}
                </div>
                <div style={{ marginTop: 10 }}>
                  <div style={{ font: 'var(--text-label)', fontSize: 14, color: 'var(--text-body)', marginBottom: 4 }}>{exercise.name}</div>
                  <div style={{ font: 'var(--text-small)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.45 }}>{exercise.text}</div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
