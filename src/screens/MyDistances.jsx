import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import { useData } from '../contexts/DataContext';
import { useMe } from '../lib/useMe';
import { clubAverage } from '../lib/scoring';

export default function MyDistances() {
  const navigate = useNavigate();
  const { range, CLUB_ORDER } = useData();
  const me = useMe();
  const myEntries = range.filter((e) => e.playerId === me?.id);
  const clubsPresent = [...new Set(myEntries.map((e) => e.club))];
  const orderedClubs = CLUB_ORDER.filter((c) => clubsPresent.includes(c));

  return (
    <div>
      <Header title="Mes distances" onBack={() => navigate('/pratique')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Button variant="primary" onClick={() => navigate('/pratique/nouvelle-seance')} style={{ alignSelf: 'flex-start', borderRadius: 999, height: 46, padding: '0 22px', fontSize: 16 }}>
          + Ajouter une séance
        </Button>

        {!orderedClubs.length && (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)' }}>Aucune distance enregistrée.</div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {orderedClubs.map((club) => {
            const entries = myEntries.filter((e) => e.club === club);
            const avg = clubAverage(entries);
            return (
              <div
                key={club}
                onClick={() => navigate(`/pratique/distances/${encodeURIComponent(club)}`)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', border: '1px solid var(--border-default)', borderRadius: 9 }}
              >
                <div>
                  <div style={{ font: 'var(--text-body)', fontWeight: 600 }}>{club}</div>
                  <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{entries.length} séance{entries.length > 1 ? 's' : ''}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span>
                    <span style={{ font: 'var(--text-stat-lg)', fontSize: 22, fontWeight: 700 }}>{avg}</span>
                    <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginLeft: 3 }}>vg</span>
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 18 }}>›</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
