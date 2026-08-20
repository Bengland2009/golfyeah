import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import { MonitorIcon, PinIcon, ClockIcon, CalendarIcon, TargetIcon, GolfBallIcon, BeerIcon } from '../components/icons';
import { VENUES } from '../lib/venues';

// Business-card screen: everything a player needs in under 15 seconds,
// nothing more. One fact per line, generous white space, no marketing
// copy. Every field here is optional except name/city/kind, so future
// venues can use this exact same template even with less information.

const FEATURE_ICONS = { monitor: MonitorIcon, ball: GolfBallIcon, target: TargetIcon, calendar: CalendarIcon };

function Hero({ venue }) {
  if (venue.photoUrl) {
    return (
      <img
        src={venue.photoUrl}
        alt=""
        style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', display: 'block' }}
      />
    );
  }
  // Every card always shows a banner — a branded gradient stands in when
  // no real photo exists yet, rather than leaving a gap.
  return (
    <div
      style={{
        width: '100%', aspectRatio: '16 / 9', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-action) 100%)',
      }}
    >
      <img src="/assets/icon-gy-cropped.png" alt="" style={{ height: 52, opacity: 0.55, objectFit: 'contain' }} />
    </div>
  );
}

function venueSubtitle(venue) {
  const typeLabel = venue.kind === 'interieur' ? 'Simulateur intérieur' : 'Terrain extérieur';
  const parts = [];
  if (venue.rating) parts.push(`★ ${venue.rating.toFixed(1).replace('.', ',')}`);
  else parts.push(venue.city);
  parts.push(typeLabel);
  if (venue.bayCount) parts.push(`${venue.bayCount} baies`);
  return parts.join('  •  ');
}

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

      <div style={{ padding: 'var(--page-padding-mobile)', paddingBottom: 14 }}>
        <div style={{ font: 'var(--text-h2)', marginBottom: 4 }}>{venue.name}</div>
        <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{venueSubtitle(venue)}</div>
      </div>

      <Hero venue={venue} />

      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 20 }}>
        {venue.highlight && (
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: '#FBF3DF', border: '1px solid #E8D49A', borderRadius: 14, padding: '14px 16px',
            }}
          >
            <BeerIcon width={22} height={22} style={{ color: '#8A6D1F', flexShrink: 0 }} />
            <div style={{ font: 'var(--text-body)', fontSize: 15, color: '#6B5314', lineHeight: 1.3 }}>
              <span style={{ fontWeight: 800, color: '#8A6D1F' }}>BYOB</span> — {venue.highlight}
            </div>
          </div>
        )}

        {venue.features?.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {venue.features.map((f) => {
              const Icon = FEATURE_ICONS[f.icon];
              return (
                <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  {Icon && <Icon width={17} height={17} strokeWidth={1.75} style={{ color: 'var(--brand-action)', flexShrink: 0 }} />}
                  <span style={{ font: 'var(--text-body)', fontSize: 14.5, fontWeight: 500 }}>{f.label}</span>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid var(--border-default)', paddingTop: 20 }}>
          {venue.address && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: 'var(--text-body)' }}>
              <PinIcon width={17} height={17} strokeWidth={2} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              {venue.address}
            </div>
          )}
          {venue.hours?.map((h) => (
            <div key={h.days} style={{ display: 'flex', alignItems: 'center', gap: 8, font: 'var(--text-body)' }}>
              <ClockIcon width={17} height={17} strokeWidth={2} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              {h.time} <span style={{ color: 'var(--text-muted)' }}>({h.days})</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, borderTop: '1px solid var(--border-default)', paddingTop: 20 }}>
          <Button variant="primary" style={{ flex: 1, height: 44 }}>
            Réserver
          </Button>
          <Button variant="secondary" style={{ flex: 1, height: 44 }} onClick={() => window.open(mapsUrl, '_blank', 'noopener,noreferrer')}>
            Itinéraire
          </Button>
        </div>
      </div>
    </div>
  );
}
