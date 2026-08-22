import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { CheckIcon, ChevronRightIcon, GolfBallIcon, MonitorIcon } from '../components/icons';
import { useData } from '../contexts/DataContext';
import { useMe } from '../lib/useMe';
import { PLACES, SIM_MODES, DURATIONS, VALIDATION, VALIDATION_LABELS, sessionsFor } from '../lib/trainingPlan';

const PLACE_ICONS = { range: GolfBallIcon, simulator: MonitorIcon };

function eyebrow(text) {
  return (
    <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
      {text}
    </div>
  );
}

// One visual language (pale green fill, green border, dark green text,
// small check) across all three steps — only the size changes: the place
// choice is the "gros choix clair" step, mode and duration are lighter
// follow-up chips.
function Choice({ label, Icon, active, onClick, size = 'sm' }) {
  const big = size === 'lg';
  const mid = size === 'md';
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1, display: 'flex', flexDirection: big ? 'column' : 'row', alignItems: 'center', justifyContent: 'center',
        gap: big ? 6 : 5, height: big ? 76 : mid ? 46 : 38, borderRadius: big ? 14 : 999, cursor: 'pointer', padding: '0 8px',
        border: active ? '1px solid var(--brand-action)' : '1px solid var(--border-default)',
        background: active ? '#EAF5EF' : '#fff',
        color: active ? 'var(--brand-action)' : 'var(--text-body)',
        font: big ? 'var(--text-label)' : 'var(--text-small)', fontSize: big ? 15 : undefined, fontWeight: active ? 700 : 500,
      }}
    >
      {Icon && <Icon width={big ? 22 : 16} height={big ? 22 : 16} strokeWidth={1.75} style={{ flexShrink: 0 }} />}
      {!Icon && active && <CheckIcon width={13} height={13} strokeWidth={3} style={{ flexShrink: 0 }} />}
      {label}
    </button>
  );
}

function statusTone(status) {
  return status === VALIDATION.VALIDATED_SOURCE || status === VALIDATION.VALIDATED_COACH ? 'success' : 'neutral';
}

function contextLabel(place, mode) {
  if (place === 'range') return 'Range extérieur';
  const m = SIM_MODES.find((x) => x.id === mode);
  return m ? `Simulateur · ${m.label}` : 'Simulateur';
}

function SessionCard({ session, duration, place, mode, onStart }) {
  return (
    <Card elevated>
      <div style={{ font: 'var(--text-label)', fontSize: 17 }}>{session.name}</div>
      <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginTop: 2, marginBottom: 12 }}>{duration} min · {contextLabel(place, mode)}</div>

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
  const [place, setPlace] = useState(null);
  const [mode, setMode] = useState(null);
  const [duration, setDuration] = useState(60);

  const myLogs = trainingLogs.filter((l) => l.playerId === me?.id);
  const completedCount = myLogs.length;

  const selectPlace = (id) => {
    setPlace(id);
    setMode(null);
  };

  const contextReady = place === 'range' || (place === 'simulator' && mode);
  const results = contextReady ? sessionsFor(place, mode, duration) : [];

  return (
    <div>
      <Header title="Plan d'entraînement" onBack={() => navigate('/pratique')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>
          Choisis ton contexte du jour. Golfyeah te propose une séance compatible.
        </div>

        <Card elevated>
          <div style={{ font: 'var(--text-h3)', fontSize: 18, marginBottom: 14 }}>Je pratique aujourd'hui</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: place === 'simulator' ? 14 : 0 }}>
            <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)', fontWeight: 600 }}>Où es-tu ?</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {PLACES.map((p) => (
                <Choice key={p.id} label={p.label} Icon={PLACE_ICONS[p.id]} active={place === p.id} onClick={() => selectPlace(p.id)} size="lg" />
              ))}
            </div>
          </div>

          {place === 'simulator' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)', fontWeight: 600 }}>Que veux-tu faire ?</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {SIM_MODES.map((m) => (
                  <Choice key={m.id} label={m.label} active={mode === m.id} onClick={() => setMode(m.id)} size="md" />
                ))}
              </div>
            </div>
          )}
        </Card>

        {contextReady && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {eyebrow('Séances compatibles')}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)', fontWeight: 600 }}>Durée</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {DURATIONS.map((d) => (
                  <Choice key={d} label={`${d} min`} active={duration === d} onClick={() => setDuration(d)} size="sm" />
                ))}
              </div>
            </div>

            {!results.length && (
              <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>
                Aucune séance compatible avec ce contexte et ce temps.
              </div>
            )}

            {results.map((s) => (
              <SessionCard
                key={s.id}
                session={s}
                duration={duration}
                place={place}
                mode={mode}
                onStart={() => navigate(`/pratique/plan/${s.id}`, { state: { duration, place, mode } })}
              />
            ))}
          </div>
        )}

        {!contextReady && (
          <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            Choisis où tu pratiques aujourd'hui. Golfyeah affichera les séances compatibles.
          </div>
        )}

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
