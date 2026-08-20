import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import { MonitorIcon, FlagIcon, PinIcon, ClockIcon, BeerIcon } from '../components/icons';
import { VENUES } from '../lib/venues';

// Business-card screen: everything a player needs in under 15 seconds,
// nothing more. One fact per line, generous white space, no marketing
// copy. Every field here is optional except name/city/kind, so future
// venues can use this exact same template even with less information.
export default function VenueDetail() {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const venue = VENUES.find((v) => v.id === venueId);

  if (!venue) {
    return (
      <div>
        <Header title="Golf" onBack={() => navigate('/golf')} />
        <div style={{ padding: 24 }}>Établissement introuvable.</div>
      </div>
    );
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue.name} ${venue.address || ''} ${venue.city}`)}`;

  return (
    <div>
      <Header title="Golf" onBack={() => navigate('/golf')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div>
          <div style={{ font: 'var(--text-h2)', marginBottom: 8 }}>{venue.name}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--text-small)', color: 'var(--text-muted)' }}>
              <PinIcon width={15} height={15} strokeWidth={2} />
              {venue.city}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--text-small)', color: 'var(--text-muted)' }}>
              {venue.kind === 'interieur'
                ? <MonitorIcon width={15} height={15} strokeWidth={2} />
                : <FlagIcon width={15} height={15} strokeWidth={2} />}
              {venue.kind === 'interieur' ? 'Simulateur intérieur' : 'Terrain extérieur'}
            </span>
          </div>
        </div>

        {venue.highlight && (
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#FBF3DF', border: '1px solid #E8D49A', borderRadius: 12, padding: '14px 16px',
            }}
          >
            <BeerIcon width={20} height={20} style={{ color: '#8A6D1F', flexShrink: 0 }} />
            <span style={{ font: 'var(--text-label)', fontSize: 14, fontWeight: 800, color: '#8A6D1F', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              {venue.highlight}
            </span>
          </div>
        )}

        {venue.features?.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid var(--border-default)', paddingTop: 18 }}>
            {venue.features.map((f) => (
              <div key={f} style={{ font: 'var(--text-body)', display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--brand-action)' }}>•</span>
                {f}
              </div>
            ))}
          </div>
        )}

        {venue.address && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: 'var(--text-body)' }}>
            <PinIcon width={17} height={17} strokeWidth={2} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            {venue.address}
          </div>
        )}

        {venue.hours?.length > 0 && (
          <div style={{ display: 'flex', gap: 8 }}>
            <ClockIcon width={17} height={17} strokeWidth={2} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {venue.hours.map((h) => (
                <div key={h.days} style={{ font: 'var(--text-body)' }}>
                  {h.days} : {h.time}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, borderTop: '1px solid var(--border-default)', paddingTop: 20 }}>
          <Button variant="primary" style={{ flex: 1, height: 50 }}>
            Réserver
          </Button>
          <Button variant="secondary" style={{ flex: 1, height: 50 }} onClick={() => window.open(mapsUrl, '_blank', 'noopener,noreferrer')}>
            Itinéraire
          </Button>
        </div>
      </div>
    </div>
  );
}
