import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Badge from '../components/Badge';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import RadioRow from '../components/RadioRow';
import Sheet from '../components/Sheet';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { FEEDBACK_TYPES, FEEDBACK_STATUSES, typeLabel, statusLabel, useIsAdmin } from '../lib/feedback';

const statusTone = (status) => (status === 'resolu' ? 'neutral' : status === 'en_cours' ? 'over' : 'under');

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <div style={{ font: 'var(--text-label)', marginBottom: 4 }}>{label}</div>
      <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>{value}</div>
    </div>
  );
}

export default function FeedbackDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { feedback, updateFeedback, deleteFeedback } = useData();
  const isAdmin = useIsAdmin();
  const f = feedback.find((x) => x.id === id);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  if (!f) {
    return (
      <div>
        <Header title="Commentaire" onBack={() => navigate('/commentaires')} />
        <div style={{ padding: 24 }}>Introuvable.</div>
      </div>
    );
  }

  const isAuthor = user?.email && f.authorEmail === user.email;
  const canEdit = isAdmin || (isAuthor && f.status === 'nouveau');
  const canDelete = isAdmin || (isAuthor && f.status === 'nouveau');

  const startEdit = () => {
    setForm({
      type: f.type,
      title: f.title,
      currentBehavior: f.currentBehavior || '',
      expectedBehavior: f.expectedBehavior || '',
      notes: f.notes || '',
    });
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!form.title.trim()) return;
    await updateFeedback(f.id, {
      type: form.type,
      title: form.title.trim(),
      currentBehavior: form.currentBehavior.trim(),
      expectedBehavior: form.expectedBehavior.trim(),
      notes: form.notes.trim(),
    });
    setEditing(false);
  };

  const setStatus = (status) => updateFeedback(f.id, { status });

  const confirmDelete = async () => {
    await deleteFeedback(f.id);
    navigate('/commentaires');
  };

  if (editing) {
    return (
      <div>
        <Header title="Modifier" onBack={() => setEditing(false)} />
        <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ font: 'var(--text-label)', marginBottom: 8 }}>Type</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FEEDBACK_TYPES.map((t) => (
                <RadioRow key={t.key} selected={form.type === t.key} label={t.label} onClick={() => setForm((s) => ({ ...s, type: t.key }))} />
              ))}
            </div>
          </div>
          <Input label="Titre" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
          <Textarea label="Comportement actuel" value={form.currentBehavior} onChange={(e) => setForm((s) => ({ ...s, currentBehavior: e.target.value }))} />
          <Textarea label="Comportement attendu" value={form.expectedBehavior} onChange={(e) => setForm((s) => ({ ...s, expectedBehavior: e.target.value }))} />
          <Textarea label="Notes (optionnel)" rows={2} value={form.notes} onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))} />
          <Button variant="primary" onClick={saveEdit} disabled={!form.title.trim()} style={{ height: 52, width: '100%' }}>Enregistrer</Button>
          <span onClick={() => setEditing(false)} style={{ textAlign: 'center', font: 'var(--text-small)', color: 'var(--text-muted)', cursor: 'pointer' }}>Annuler</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Commentaire" onBack={() => navigate('/commentaires')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={{ font: 'var(--text-h3)', marginBottom: 6 }}>{f.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Badge>{typeLabel(f.type)}</Badge>
            <Badge tone={statusTone(f.status)}>{statusLabel(f.status)}</Badge>
          </div>
          <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>
            {f.authorName || '—'} · {new Date(f.createdAt).toLocaleDateString('fr-CA')}
          </div>
        </div>

        {isAdmin && (
          <div>
            <div style={{ font: 'var(--text-label)', marginBottom: 8 }}>Statut</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {FEEDBACK_STATUSES.map((s) => (
                <Button key={s.key} variant={f.status === s.key ? 'primary' : 'secondary'} onClick={() => setStatus(s.key)} style={{ borderRadius: 999, flex: 1, fontSize: 13, padding: '0 8px' }}>
                  {s.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Field label="Comportement actuel" value={f.currentBehavior} />
        <Field label="Comportement attendu" value={f.expectedBehavior} />
        <Field label="Notes" value={f.notes} />

        <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>
          v{f.appVersion || '—'} · {f.platform || '—'}
        </div>

        {canEdit && (
          <Button variant="secondary" onClick={startEdit} style={{ height: 48, width: '100%' }}>Modifier</Button>
        )}
        {canDelete && (
          <span onClick={() => setDeleteConfirmOpen(true)} style={{ textAlign: 'center', font: 'var(--text-small)', color: 'var(--color-score-under)', cursor: 'pointer' }}>
            Supprimer
          </span>
        )}
      </div>

      <Sheet open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <div style={{ font: 'var(--text-h3)' }}>Supprimer ce commentaire ?</div>
        <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)' }}>Cette action est définitive.</div>
        <Button variant="secondary" onClick={() => setDeleteConfirmOpen(false)} style={{ height: 52, width: '100%' }}>Annuler</Button>
        <Button variant="primary" onClick={confirmDelete} style={{ height: 52, width: '100%', background: 'var(--color-score-under)' }}>Supprimer</Button>
      </Sheet>
    </div>
  );
}
