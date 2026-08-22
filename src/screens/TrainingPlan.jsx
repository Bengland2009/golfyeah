import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { CheckIcon, ChevronRightIcon } from '../components/icons';
import { useData } from '../contexts/DataContext';
import { useMe } from '../lib/useMe';
import { LOCATIONS, DURATIONS, VALIDATION, VALIDATION_LABELS, sessionsFor } from '../lib/trainingPlan';

function eyebrow(text) {
  return (
    <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
      {text}
    </div>
  );
}

function Chip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
        height: 38, borderRadius: 999, cursor: 'pointer', padding: '0 6px',
        border: active ? '1px solid var(--brand-action)' : '1px solid var(--border-default)',
        background: active ? '#EAF5EF' : '#fff',
        color: active ? 'var(--brand-action)' : 'var(--text-body)',
        font: 'var(--text-small)', fontWeight: active ? 700 : 500,
      }}
    >
      {active && <CheckIcon width={13} height={13} strokeWidth={3} style={{ flexShrink: 0 }} />}
      {label}
    </button>
  );
}

function statusTone(status) {
  return status === VALIDATION.VALIDATED_SOURCE || status === VALIDATION.VALIDATED_COACH ? 'success' : 'neutral';
}

function SessionCard({ session, duration, locationLabel, onStart }) {
  return (
    <Card elevated>
      <div style={{ font: 'var(--text-label)', fontSize: 17 }}>{session.name}</div>
      <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginTop: 2, marginBottom: 12 }}>{duration} min · {locationLabel}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14, font: 'var(--text-small)', lineHeight: 1.4 }}>
        <div><span style={{ fontWeight: 600 }}>Objectif : </span><span style={{ color: 'var(--text-muted)' }}>{session.objective}</span></div>
        <div><span style={{ fontWeight: 600 }}>Principe : </span><span style={{ color: 'var(--text-muted)' }}>{session.principle}</span></div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <Badge tone={statusTone(session.status)}>{VALIDATION_LABELS[session.status]}</Badge>
        <Button variant="primary" onClick={onStart} style={{ height: 40, padding: '0 20px', fontSize: 14 }}>Commencer</Button>
      </div>
    </Card>
  );
}

export default function TrainingPlan() {
  const navigate = useNavigate();
  const { trainingLogs } = useData();
  const me = useMe();
  const [location, setLocation] = useState(null);
  const [duration, setDuration] = useState(null);

  const myLogs = trainingLogs.filter((l) => l.playerId === me?.id);
  const completedCount = myLogs.length;

  const locationLabel = LOCATIONS.find((l) => l.id === location)?.label;
  const results = location && duration ? sessionsFor(location, duration) : [];

  return (
    <div>
      <Header title="Plan d'entraînement" onBack={() => navigate('/pratique')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>
          Choisis ton contexte du jour. Golfyeah te propose une séance compatible.
        </div>

        <Card elevated>
          <div style={{ font: 'var(--text-h3)', fontSize: 18, marginBottom: 14 }}>Je pratique maintenant</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)', fontWeight: 600 }}>Lieu</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {LOCATIONS.map((l) => (
                <Chip key={l.id} label={l.shortLabel} active={location === l.id} onClick={() => setLocation(l.id)} />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)', fontWeight: 600 }}>Durée</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {DURATIONS.map((d) => (
                <Chip key={d} label={`${d} min`} active={duration === d} onClick={() => setDuration(d)} />
              ))}
            </div>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {eyebrow('Séances compatibles')}

          {(!location || !duration) && (
            <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Choisis ton lieu et ton temps disponible. Golfyeah affichera les séances compatibles.
            </div>
          )}

          {location && duration && !results.length && (
            <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>
              Aucune séance compatible avec ce lieu et ce temps.
            </div>
          )}

          {results.map((s) => (
            <SessionCard
              key={s.id}
              session={s}
              duration={duration}
              locationLabel={locationLabel}
              onStart={() => navigate(`/pratique/plan/${s.id}`, { state: { duration, location } })}
            />
          ))}
        </div>

        <div
          onClick={() => navigate('/pratique/plan/historique')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border-default)' }}
        >
          <div>
            <div style={{ font: 'var(--text-small)', fontWeight: 700 }}>Notes de progression</div>
            <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>
              {completedCount > 0 ? `${completedCount} séance${completedCount > 1 ? 's' : ''} complétée${completedCount > 1 ? 's' : ''}` : 'Aucune séance complétée'}
            </div>
          </div>
          <ChevronRightIcon width={16} height={16} strokeWidth={2} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        </div>
      </div>
    </div>
  );
}
