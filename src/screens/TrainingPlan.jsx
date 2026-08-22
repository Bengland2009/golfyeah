import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { CheckIcon, ChevronRightIcon, GolfBallIcon, MonitorIcon } from '../components/icons';
import { useData } from '../contexts/DataContext';
import { useMe } from '../lib/useMe';
import {
  PLACES, SIM_MODES, DURATIONS, VALIDATION, VALIDATION_LABELS,
  LEVELS, sessionsFor, levelProgress, levelWhy, recommendedSessionId,
  adaptedSteps, noteFieldsFor,
} from '../lib/trainingPlan';

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

// A session card is a preview of the guided sheet, not just a
// description — "quel bâton, combien de balles" must be readable before
// tapping "Commencer". cardLine mirrors the exact worked example: club —
// ballCount balles <hint>, falling back to the club alone (or the title)
// when a step has no ball count.
function cardLine(step) {
  if (step.club && step.ballCount) return `${step.club} — ${step.ballCount} balles${step.cardHint ? ` ${step.cardHint}` : ''}`;
  if (step.club) return step.cardHint ? `${step.club} — ${step.cardHint}` : step.club;
  return step.title;
}

function SessionCard({ session, duration, place, mode, recommended, onStart }) {
  const steps = adaptedSteps(session, duration);
  const toDo = steps.slice(0, 4);
  const fields = noteFieldsFor(session.id);
  const noteLabels = (session.previewNoteKeys || [])
    .map((key) => fields.find((f) => f.key === key)?.label)
    .filter(Boolean);

  return (
    <Card elevated={recommended} style={recommended ? { border: '1px solid var(--brand-action)' } : undefined}>
      <div style={{ font: 'var(--text-label)', fontSize: 17 }}>{session.name}</div>
      <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginTop: 2, marginBottom: 12 }}>{duration} min · {contextLabel(place, mode)}</div>

      <div style={{ marginBottom: noteLabels.length ? 10 : 14 }}>
        <div style={{ font: 'var(--text-small)', fontWeight: 700, marginBottom: 4 }}>À faire</div>
        <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {toDo.map((s) => (
            <li key={s.title} style={{ font: 'var(--text-small)', color: 'var(--text-muted)', lineHeight: 1.4 }}>{cardLine(s)}</li>
          ))}
        </ul>
      </div>

      {noteLabels.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ font: 'var(--text-small)', fontWeight: 700, marginBottom: 4 }}>À noter</div>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {noteLabels.map((label) => (
              <li key={label} style={{ font: 'var(--text-small)', color: 'var(--text-muted)', lineHeight: 1.4 }}>{label}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <Badge tone={statusTone(session.status)}>{VALIDATION_LABELS[session.status]}</Badge>
        <Button variant="primary" onClick={onStart} style={{ height: 40, padding: '0 20px', fontSize: 14 }}>Commencer</Button>
      </div>
    </Card>
  );
}

export default function TrainingPlan() {
  const navigate = useNavigate();
  const { trainingLogs, getTrainingLevel, setTrainingLevel } = useData();
  const me = useMe();
  const [place, setPlace] = useState(null);
  const [mode, setMode] = useState(null);
  const [duration, setDuration] = useState(60);

  const myLogs = trainingLogs.filter((l) => l.playerId === me?.id);
  const completedCount = myLogs.length;
  const levelIndex = getTrainingLevel(me?.id);
  const level = LEVELS[levelIndex];
  const nextLevel = LEVELS[levelIndex + 1] || null;
  const progress = levelProgress(level, myLogs);
  const why = levelWhy(level, progress.attempts);

  const advance = () => setTrainingLevel(me.id, levelIndex + 1);

  const selectPlace = (id) => {
    setPlace(id);
    setMode(null);
  };

  const contextReady = place === 'range' || (place === 'simulator' && mode);
  const results = contextReady ? sessionsFor(place, mode, duration) : [];
  const recommendedId = contextReady ? recommendedSessionId(level, place, mode) : null;
  const recommended = results.find((s) => s.id === recommendedId) || null;
  const others = results.filter((s) => s.id !== recommendedId);

  const start = (session) => navigate(`/pratique/plan/${session.id}`, { state: { duration, place, mode } });

  return (
    <div>
      <Header title="Plan d'entraînement" onBack={() => navigate('/pratique')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>
          Choisis ton contexte du jour. Golfyeah te guide, sans jamais te forcer.
        </div>

        <Card style={{ background: 'var(--brand-primary)', border: 'none' }}>
          <div style={{ font: 'var(--text-small)', color: 'rgba(255,255,255,0.65)', marginBottom: 4 }}>Priorité actuelle</div>
          <div style={{ font: 'var(--font-serif)', fontWeight: 700, fontSize: 24, color: '#fff', marginBottom: 10 }}>{level.name}</div>

          <div style={{ font: 'var(--text-small)', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 2 }}>Pourquoi ?</div>
          <div style={{ font: 'var(--text-small)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, marginBottom: 10 }}>{why}</div>

          <div style={{ font: 'var(--text-small)', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 2 }}>Objectif pour avancer</div>
          <div style={{ font: 'var(--text-small)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>{level.passCriterion}</div>

          {!progress.meetsCriteria && (
            <div style={{ font: 'var(--text-small)', color: 'rgba(255,255,255,0.85)', marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              <span style={{ fontWeight: 600 }}>Progression : </span>{Math.min(progress.passCount, 2)} / 2 séances réussies
            </div>
          )}

          {progress.meetsCriteria && level.terminal && (
            <div style={{ font: 'var(--text-small)', color: 'rgba(255,255,255,0.85)', marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              Tu respectes les règles de {level.name} dans {progress.passCount} des {progress.attempts} dernières séances — continue comme ça.
            </div>
          )}

          {progress.ready && nextLevel && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ font: 'var(--text-label)', color: '#fff', marginBottom: 4 }}>Prêt pour la prochaine étape</div>
              <div style={{ font: 'var(--text-small)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, marginBottom: 2 }}>
                Tu as atteint l'objectif {level.name} dans {progress.passCount} des {progress.attempts} dernières séances.
              </div>
              <div style={{ font: 'var(--text-small)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, marginBottom: 12 }}>
                Prochaine priorité recommandée : {nextLevel.name}.
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={advance}
                  style={{ flex: 1, height: 42, borderRadius: 10, border: 'none', background: '#fff', color: 'var(--brand-primary)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                >
                  Passer à {nextLevel.name}
                </button>
                <button
                  type="button"
                  style={{ flex: 1, height: 42, borderRadius: 10, border: '1px solid rgba(255,255,255,0.4)', background: 'transparent', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
                >
                  Continuer {level.name}
                </button>
              </div>
            </div>
          )}
        </Card>

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

            {recommended && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {eyebrow('Séance recommandée')}
                <SessionCard session={recommended} duration={duration} place={place} mode={mode} recommended onStart={() => start(recommended)} />
              </div>
            )}

            {others.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: recommended ? 6 : 0 }}>
                {eyebrow(recommended ? 'Autres séances utiles' : 'Séances compatibles')}
                {others.map((s) => (
                  <SessionCard key={s.id} session={s} duration={duration} place={place} mode={mode} onStart={() => start(s)} />
                ))}
              </div>
            )}
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
