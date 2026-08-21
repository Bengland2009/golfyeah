import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import { GolfBallIcon, TargetIcon, MonitorIcon, EditIcon, CheckIcon, ChevronRightIcon, FlagIcon } from '../components/icons';
import { useData } from '../contexts/DataContext';
import { useMe } from '../lib/useMe';
import { TRAINING_GOAL, TRAINING_RULE, TRAINING_WEEKS, TRAINING_SESSIONS } from '../lib/trainingPlan';

const SESSION_ICONS = { A: GolfBallIcon, B: TargetIcon, C: MonitorIcon };
const ROTATION = ['A', 'B', 'C'];

function eyebrow(text) {
  return (
    <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
      {text}
    </div>
  );
}

function ActionRow({ Icon, title, subtitle, onClick }) {
  return (
    <div onClick={onClick} style={{ cursor: 'pointer' }}>
      <Card style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--surface-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon width={20} height={20} strokeWidth={1.75} style={{ color: 'var(--brand-action)' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: 'var(--text-label)', fontSize: 15 }}>{title}</div>
          <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginTop: 1 }}>{subtitle}</div>
        </div>
        <ChevronRightIcon width={18} height={18} strokeWidth={2} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
      </Card>
    </div>
  );
}

export default function TrainingPlan() {
  const navigate = useNavigate();
  const { trainingLogs } = useData();
  const me = useMe();

  const myLogs = trainingLogs
    .filter((l) => l.playerId === me?.id)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  const completedCount = myLogs.length;
  const lastLog = myLogs[0] || null;
  const currentWeek = Math.min(4, Math.floor(completedCount / 3) + 1);
  const weekInfo = TRAINING_WEEKS[currentWeek - 1];
  const nextSessionId = lastLog ? ROTATION[(ROTATION.indexOf(lastLog.sessionId) + 1) % 3] : 'A';
  const nextSession = TRAINING_SESSIONS.find((s) => s.id === nextSessionId);
  const NextIcon = SESSION_ICONS[nextSessionId];

  return (
    <div>
      <Header title="Plan d'entraînement" onBack={() => navigate('/pratique')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {eyebrow('Objectif général')}
          <div style={{ font: 'var(--text-body)', lineHeight: 1.5 }}>{TRAINING_GOAL}</div>
        </div>

        <Card style={{ background: 'var(--brand-primary)', border: 'none' }}>
          <div style={{ font: 'var(--text-small)', color: 'rgba(255,255,255,0.65)', marginBottom: 4 }}>Semaine active</div>
          <div style={{ font: 'var(--font-serif)', fontWeight: 700, fontSize: 26, color: '#fff', lineHeight: 1.2, marginBottom: 6 }}>
            Semaine {currentWeek} — {weekInfo.title}
          </div>
          <div style={{ font: 'var(--text-body)', fontSize: 15, color: 'rgba(255,255,255,0.85)' }}>{weekInfo.question}</div>
          <div style={{ display: 'flex', gap: 14, marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.15)', font: 'var(--text-small)', color: 'rgba(255,255,255,0.7)' }}>
            <span>{completedCount} séance{completedCount > 1 ? 's' : ''} complétée{completedCount > 1 ? 's' : ''}</span>
            {lastLog && <span>Dernière : Séance {lastLog.sessionId} · {lastLog.date}</span>}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {eyebrow('Progression — 4 semaines')}
          <div style={{ display: 'flex', gap: 6 }}>
            {TRAINING_WEEKS.map((w) => {
              const done = w.week < currentWeek;
              const active = w.week === currentWeek;
              return (
                <div
                  key={w.week}
                  style={{
                    flex: 1, borderRadius: 10, padding: '10px 6px', textAlign: 'center',
                    background: active ? 'var(--brand-action)' : done ? '#EAF5EF' : 'var(--surface-tint)',
                    border: active ? 'none' : '1px solid var(--border-default)',
                  }}
                >
                  {done ? (
                    <CheckIcon width={15} height={15} strokeWidth={3} style={{ color: 'var(--brand-action)', margin: '0 auto 2px' }} />
                  ) : (
                    <div style={{ font: 'var(--text-small)', fontWeight: 700, color: active ? '#fff' : 'var(--text-muted)' }}>S{w.week}</div>
                  )}
                  <div style={{ font: 'var(--text-small)', fontSize: 11, fontWeight: 600, color: active ? '#fff' : done ? 'var(--brand-action)' : 'var(--text-muted)', marginTop: done ? 2 : 0 }}>
                    {w.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div onClick={() => navigate(`/pratique/plan/${nextSessionId}`)} style={{ cursor: 'pointer' }}>
          <Card elevated style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EAF5EF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <NextIcon width={21} height={21} strokeWidth={1.75} style={{ color: 'var(--brand-action)' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginBottom: 1 }}>Prochaine séance recommandée</div>
              <div style={{ font: 'var(--text-label)', fontSize: 15 }}>{nextSession.label} — {nextSession.title}</div>
            </div>
            <ChevronRightIcon width={18} height={18} strokeWidth={2} style={{ color: 'var(--brand-action)', flexShrink: 0 }} />
          </Card>
        </div>

        <div
          style={{
            display: 'flex', alignItems: 'flex-start', gap: 10, background: 'var(--surface-tint)',
            borderRadius: 'var(--radius-card)', padding: '14px 16px',
          }}
        >
          <FlagIcon width={18} height={18} strokeWidth={1.75} style={{ color: 'var(--brand-action)', flexShrink: 0, marginTop: 1 }} />
          <div style={{ font: 'var(--text-small)', lineHeight: 1.4 }}>
            <span style={{ fontWeight: 700 }}>Règle importante — </span>{TRAINING_RULE}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {eyebrow('Séances')}
          {TRAINING_SESSIONS.map((s) => {
            const count = myLogs.filter((l) => l.sessionId === s.id).length;
            return (
              <ActionRow
                key={s.id}
                Icon={SESSION_ICONS[s.id]}
                title={`${s.label} — ${s.title}`}
                subtitle={count > 0 ? `Complétée ${count} fois` : s.duration}
                onClick={() => navigate(`/pratique/plan/${s.id}`)}
              />
            );
          })}
          <ActionRow
            Icon={EditIcon}
            title="Notes de progression"
            subtitle="Historique des séances et notes"
            onClick={() => navigate('/pratique/plan/historique')}
          />
        </div>
      </div>
    </div>
  );
}
