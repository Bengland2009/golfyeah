import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Button from '../components/Button';
import Card from '../components/Card';
import { useData } from '../contexts/DataContext';
import { coursePar } from '../lib/scoring';

export default function Courses() {
  const navigate = useNavigate();
  const { courses } = useData();
  const pickableCourses = courses.filter((c) => !c.isQuickDraft);

  return (
    <div>
      <TopBar />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ font: 'var(--text-h2)' }}>Terrains</div>
        <Button variant="primary" onClick={() => navigate('/terrains/nouveau')} style={{ alignSelf: 'flex-start', borderRadius: 999, height: 46, padding: '0 22px', fontSize: 16 }}>
          + Ajouter un terrain
        </Button>
        {pickableCourses.map((c) => (
          <Card key={c.id}>
            <div style={{ font: 'var(--text-h3)', marginBottom: 2 }}>{c.name}</div>
            <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>
              {c.city} · {c.holes} trous · Par {coursePar(c)}{c.kind === 'interieur' ? ' · Intérieur' : ''}
            </div>
            {c.kind === 'interieur' && c.simulatedCourse && (
              <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginTop: 2 }}>Parcours simulé : {c.simulatedCourse}</div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
