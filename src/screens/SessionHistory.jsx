import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import { useData } from '../contexts/DataContext';
import { useMe } from '../lib/useMe';

export default function SessionHistory() {
  const navigate = useNavigate();
  const { range } = useData();
  const me = useMe();

  const sessions = range
    .filter((e) => e.playerId === me?.id)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  return (
    <div>
      <Header title="Historique" onBack={() => navigate('/pratique')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {!sessions.length && (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)' }}>Aucune séance enregistrée pour l'instant.</div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sessions.map((s) => (
            <Card key={s.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                <div style={{ font: 'var(--text-label)' }}>{s.club}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                  <span style={{ font: 'var(--text-stat-lg)', fontSize: 20, fontWeight: 700 }}>{s.avg}</span>
                  <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>vg</span>
                </div>
              </div>
              <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>
                {s.date} · {s.balls} balles{s.location ? ` · ${s.location}` : ''}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
