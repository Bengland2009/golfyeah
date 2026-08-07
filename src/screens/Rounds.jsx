import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { useData } from '../contexts/DataContext';
import { parLabel, toneFor, coursePar } from '../lib/scoring';

export default function Rounds() {
  const navigate = useNavigate();
  const { completedRounds, players, courses } = useData();

  return (
    <div>
      <TopBar />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ font: 'var(--text-h2)' }}>Parties</div>
        <Button variant="primary" onClick={() => navigate('/nouvelle-partie')} style={{ alignSelf: 'flex-start', borderRadius: 999, height: 46, padding: '0 22px', fontSize: 16 }}>
          + Nouvelle partie
        </Button>

        {!completedRounds.length && (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)', marginBottom: 12 }}>Aucune partie cette saison.</div>
            <Button variant="primary" onClick={() => navigate('/nouvelle-partie')} style={{ borderRadius: 999 }}>Jouer une première ronde</Button>
          </div>
        )}

        {completedRounds.map((r) => {
          const course = courses.find((c) => c.id === r.courseId);
          const par = course ? coursePar(course) : r.par || 72;
          return (
            <div key={r.id} onClick={() => navigate(`/resume/${r.id}`)} style={{ cursor: 'pointer' }}>
              <Card>
                <div style={{ font: 'var(--text-h3)', marginBottom: 2 }}>{course?.name}</div>
                <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginBottom: 12 }}>{r.date} · {r.holes} trous</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {r.playerIds.map((pid) => {
                    const p = players.find((pp) => pp.id === pid);
                    const diff = r.totals[pid] - par;
                    return (
                      <div key={pid} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{p?.name}</span>
                        <Badge tone={toneFor(diff)}>{parLabel(diff)}</Badge>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
