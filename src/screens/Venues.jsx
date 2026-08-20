import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Card from '../components/Card';
import { MonitorIcon, FlagIcon } from '../components/icons';
import { VENUES } from '../lib/venues';

export default function Venues() {
  const navigate = useNavigate();

  return (
    <div>
      <TopBar />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ font: 'var(--text-h2)' }}>Golf</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {VENUES.map((v) => (
            <Card key={v.id} onClick={() => navigate(`/golf/${v.id}`)}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ font: 'var(--text-h3)', fontSize: 18, marginBottom: 3 }}>{v.name}</div>
                  <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{v.city}</div>
                </div>
                {v.kind === 'interieur'
                  ? <MonitorIcon width={20} height={20} strokeWidth={1.75} style={{ color: 'var(--brand-action)', flexShrink: 0 }} />
                  : <FlagIcon width={20} height={20} strokeWidth={1.75} style={{ color: 'var(--brand-action)', flexShrink: 0 }} />}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
