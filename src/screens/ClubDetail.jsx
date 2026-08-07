import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import { useData } from '../contexts/DataContext';
import { useMe } from '../lib/useMe';
import { clubAverage } from '../lib/scoring';

export default function ClubDetail() {
  const { club } = useParams();
  const navigate = useNavigate();
  const { range } = useData();
  const me = useMe();
  const clubName = decodeURIComponent(club);
  const entries = range.filter((e) => e.playerId === me?.id && e.club === clubName);
  const avg = clubAverage(entries);

  return (
    <div>
      <Header title={clubName} onBack={() => navigate('/range')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ font: 'var(--text-stat-lg)', fontSize: 44 }}>{avg} vg</div>
          <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{entries.length} séance(s)</div>
        </div>
        {entries.map((en) => (
          <Card key={en.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{en.date}</span>
              <span style={{ fontWeight: 600 }}>{en.avg} vg · {en.balls} balles</span>
            </div>
            {en.location && <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginTop: 2 }}>{en.location}</div>}
          </Card>
        ))}
      </div>
    </div>
  );
}
