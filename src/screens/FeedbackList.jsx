import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { FEEDBACK_TYPES, typeLabel, statusLabel, hasUnseenActivity } from '../lib/feedback';

// Plural labels for the filter row, per spec ("Bugs", "Idées", "Améliorations").
const TYPE_FILTER_LABELS = { tous: 'Tous', bug: 'Bugs', idee: 'Idées', amelioration: 'Améliorations' };
const TYPE_FILTERS = [{ key: 'tous' }, ...FEEDBACK_TYPES.map((t) => ({ key: t.key }))];

function FilterPill({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0, height: 34, padding: '0 14px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer',
        border: active ? 'none' : '1px solid var(--border-default)',
        background: active ? 'var(--brand-action)' : '#fff',
        color: active ? '#fff' : 'var(--text-body)',
      }}
    >
      {label}
    </button>
  );
}

const STATUS_TONE = { nouveau: 'under', en_cours: 'progress', resolu: 'success' };

function FeedbackCard({ f, unseen, onClick }) {
  const resolved = f.status === 'resolu';
  const inProgress = f.status === 'en_cours';
  return (
    <div onClick={onClick} style={{ cursor: 'pointer' }}>
      <Card
        tint={resolved}
        style={inProgress ? { borderLeft: '3px solid #E8930C' } : undefined}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, font: 'var(--text-label)', color: resolved ? 'var(--text-muted)' : 'var(--text-body)' }}>
            {unseen && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-action)', flexShrink: 0 }} />}
            {f.title}
          </span>
          <Badge tone={STATUS_TONE[f.status] || 'neutral'}>{statusLabel(f.status)}</Badge>
        </div>
        <div style={{ font: 'var(--text-small)', color: 'var(--text-disabled)' }}>
          {typeLabel(f.type)} · {f.authorName || '—'} · {new Date(f.createdAt).toLocaleDateString('fr-CA')}
        </div>
      </Card>
    </div>
  );
}

function SectionHeader({ label, count }) {
  return (
    <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
      {label} ({count})
    </div>
  );
}

export default function FeedbackList() {
  const navigate = useNavigate();
  const { feedback } = useData();
  const { user } = useAuth();
  const [typeFilter, setTypeFilter] = useState('tous');
  const [resolvedOpen, setResolvedOpen] = useState(false);

  const byType = feedback.filter((f) => typeFilter === 'tous' || f.type === typeFilter);
  const byNewest = (a, b) => (b.createdAt || 0) - (a.createdAt || 0);

  const nouveauItems = byType.filter((f) => f.status === 'nouveau').sort(byNewest);
  const enCoursItems = byType.filter((f) => f.status === 'en_cours').sort(byNewest);
  const resoluItems = byType.filter((f) => f.status === 'resolu').sort(byNewest);
  const activeCount = nouveauItems.length + enCoursItems.length;

  const isUnseen = (f) => user?.email && f.authorEmail === user.email && hasUnseenActivity(f);

  return (
    <div>
      <Header title="Commentaires" onBack={() => navigate('/')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Button variant="primary" onClick={() => navigate('/commentaires/nouveau')} style={{ alignSelf: 'flex-start', borderRadius: 999, height: 46, padding: '0 22px', fontSize: 16 }}>
          + Nouveau commentaire
        </Button>

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
          {TYPE_FILTERS.map((t) => (
            <FilterPill key={t.key} active={typeFilter === t.key} label={TYPE_FILTER_LABELS[t.key]} onClick={() => setTypeFilter(t.key)} />
          ))}
        </div>

        {!byType.length && (
          <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)', textAlign: 'center', padding: 32 }}>
            Aucun commentaire.
          </div>
        )}

        {activeCount > 0 && (
          <div style={{ font: 'var(--text-label)', color: 'var(--text-body)' }}>
            À traiter ({activeCount})
          </div>
        )}

        {nouveauItems.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SectionHeader label="Nouveau" count={nouveauItems.length} />
            {nouveauItems.map((f) => (
              <FeedbackCard key={f.id} f={f} unseen={isUnseen(f)} onClick={() => navigate(`/commentaires/${f.id}`)} />
            ))}
          </div>
        )}

        {enCoursItems.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SectionHeader label="En cours" count={enCoursItems.length} />
            {enCoursItems.map((f) => (
              <FeedbackCard key={f.id} f={f} unseen={isUnseen(f)} onClick={() => navigate(`/commentaires/${f.id}`)} />
            ))}
          </div>
        )}

        {resoluItems.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div
              onClick={() => setResolvedOpen((v) => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
            >
              <span style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Résolus ({resoluItems.length})
              </span>
              <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{resolvedOpen ? '▾' : '▸'}</span>
            </div>
            {resolvedOpen && resoluItems.map((f) => (
              <FeedbackCard key={f.id} f={f} unseen={isUnseen(f)} onClick={() => navigate(`/commentaires/${f.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
