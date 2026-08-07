import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { FEEDBACK_TYPES, FEEDBACK_STATUSES, typeLabel, statusLabel, hasUnseenActivity } from '../lib/feedback';

// Plural labels for the filter row, per spec ("Bugs", "Idées", "Améliorations").
const TYPE_FILTER_LABELS = { tous: 'Tous', bug: 'Bugs', idee: 'Idées', amelioration: 'Améliorations' };
const TYPE_FILTERS = [{ key: 'tous' }, ...FEEDBACK_TYPES.map((t) => ({ key: t.key }))];
const STATUS_FILTERS = [{ key: 'tous', label: 'Tous' }, ...FEEDBACK_STATUSES];

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

const statusTone = (status) => (status === 'resolu' ? 'neutral' : status === 'en_cours' ? 'over' : 'under');

export default function FeedbackList() {
  const navigate = useNavigate();
  const { feedback } = useData();
  const { user } = useAuth();
  const [typeFilter, setTypeFilter] = useState('tous');
  const [statusFilter, setStatusFilter] = useState('tous');

  const filtered = feedback
    .filter((f) => typeFilter === 'tous' || f.type === typeFilter)
    .filter((f) => statusFilter === 'tous' || f.status === statusFilter)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

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
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
          {STATUS_FILTERS.map((s) => (
            <FilterPill key={s.key} active={statusFilter === s.key} label={s.label} onClick={() => setStatusFilter(s.key)} />
          ))}
        </div>

        {!filtered.length && (
          <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)', textAlign: 'center', padding: 32 }}>
            Aucun commentaire.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((f) => {
            const unseen = user?.email && f.authorEmail === user.email && hasUnseenActivity(f);
            return (
            <div key={f.id} onClick={() => navigate(`/commentaires/${f.id}`)} style={{ cursor: 'pointer' }}>
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, font: 'var(--text-label)' }}>
                    {unseen && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-action)', flexShrink: 0 }} />}
                    {f.title}
                  </span>
                  <Badge tone={statusTone(f.status)}>{statusLabel(f.status)}</Badge>
                </div>
                <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>
                  {typeLabel(f.type)} · {f.authorName || '—'} · {new Date(f.createdAt).toLocaleDateString('fr-CA')}
                </div>
              </Card>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
