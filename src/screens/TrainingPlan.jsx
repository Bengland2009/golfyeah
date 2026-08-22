import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { EditIcon, ChevronRightIcon } from '../components/icons';
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

function ChoiceChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1, height: 44, borderRadius: 10, cursor: 'pointer',
        border: active ? '1px solid var(--brand-action)' : '1px solid var(--border-default)',
        background: active ? 'var(--brand-action)' : '#fff',
        color: active ? '#fff' : 'var(--text-body)',
        font: 'var(--text-small)', fontWeight: active ? 700 : 500,
        padding: '0 4px',
      }}
    >
      {label}
    </button>
  );
}

function statusTone(status) {
  return status === VALIDATION.VALIDATED_SOURCE || status === VALIDATION.VALIDATED_COACH ? 'success' : 'neutral';
}

export default function TrainingPlan() {
  const navigate = useNavigate();
  const { trainingLogs } = useData();
  const me = useMe();
  const [location, setLocation] = useState(null);
  const [duration, setDuration] = useState(null);

  const myLogs = trainingLogs.filter((l) => l.playerId === me?.id);
  const completedCount = myLogs.length;
  const lastLog = [...myLogs].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0] || null;

  const results = location && duration ? sessionsFor(location, duration) : [];

  return (
    <div>
      <Header title="Plan d'entraînement" onBack={() => navigate('/pratique')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Des séances validées, adaptées à ton lieu et au temps que tu as — pas de calendrier, pas d'improvisation.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {eyebrow('Où je pratique aujourd’hui')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {LOCATIONS.map((l) => (
              <ChoiceChip key={l.id} label={l.label} active={location === l.id} onClick={() => setLocation(l.id)} />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {eyebrow('Temps disponible')}
          <div style={{ display: 'flex', gap: 8 }}>
            {DURATIONS.map((d) => (
              <ChoiceChip key={d} label={`${d} min`} active={duration === d} onClick={() => setDuration(d)} />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {eyebrow('Séances disponibles')}

          {(!location || !duration) && (
            <div style={{ textAlign: 'center', padding: '20px 12px', font: 'var(--text-small)', color: 'var(--text-muted)' }}>
              Choisis un lieu et un temps disponible pour voir les séances proposées.
            </div>
          )}

          {location && duration && !results.length && (
            <div style={{ textAlign: 'center', padding: '20px 12px', font: 'var(--text-small)', color: 'var(--text-muted)' }}>
              Aucune séance compatible avec ce lieu et ce temps.
            </div>
          )}

          {results.map((s) => (
            <div key={s.id} onClick={() => navigate(`/pratique/plan/${s.id}`, { state: { duration, location } })} style={{ cursor: 'pointer' }}>
              <Card elevated>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                  <div>
                    <div style={{ font: 'var(--text-label)', fontSize: 16 }}>{s.name}</div>
                    <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginTop: 1 }}>{s.objective}</div>
                  </div>
                  <ChevronRightIcon width={18} height={18} strokeWidth={2} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 3 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid var(--border-default)' }}>
                  <Badge tone={statusTone(s.status)}>{VALIDATION_LABELS[s.status]}</Badge>
                  <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{duration} min</span>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div onClick={() => navigate('/pratique/plan/historique')} style={{ cursor: 'pointer' }}>
          <Card style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--surface-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <EditIcon width={20} height={20} strokeWidth={1.75} style={{ color: 'var(--brand-action)' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: 'var(--text-label)', fontSize: 15 }}>Notes de progression</div>
              <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginTop: 1 }}>
                {completedCount > 0
                  ? `${completedCount} séance${completedCount > 1 ? 's' : ''} complétée${completedCount > 1 ? 's' : ''}${lastLog ? ` · dernière : ${lastLog.date}` : ''}`
                  : 'Aucune séance complétée pour l’instant'}
              </div>
            </div>
            <ChevronRightIcon width={18} height={18} strokeWidth={2} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          </Card>
        </div>
      </div>
    </div>
  );
}
