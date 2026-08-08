import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Badge from '../components/Badge';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import RadioRow from '../components/RadioRow';
import Sheet from '../components/Sheet';
import FeedbackDiscussion from '../components/FeedbackDiscussion';
import PhotoLightbox from '../components/PhotoLightbox';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { FEEDBACK_TYPES, FEEDBACK_STATUSES, FEEDBACK_PRIORITIES, typeLabel, statusLabel, priorityLabel, useIsAdmin, markFeedbackSeen } from '../lib/feedback';
import { APP_VERSION } from '../lib/version';

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
  const { feedback, updateFeedback, deleteFeedback, toggleConfirmFeedback } = useData();
  const isAdmin = useIsAdmin();
  const f = feedback.find((x) => x.id === id);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [resolveSheetOpen, setResolveSheetOpen] = useState(false);
  const [resolveDraft, setResolveDraft] = useState({ fixedInVersion: '', resolutionNotes: '' });
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const discussionRef = useRef(null);

  useEffect(() => {
    if (f) markFeedbackSeen(f.id);
  }, [f?.id, f?.lastActivityAt]);

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
  const hasConfirmed = user?.email && (f.confirmedByEmails || []).includes(user.email);
  const confirmCount = (f.confirmedByEmails || []).length;

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

  const setStatus = (status) => {
    if (status === 'resolu') {
      setResolveDraft({ fixedInVersion: f.fixedInVersion || APP_VERSION, resolutionNotes: f.resolutionNotes || '' });
      setResolveSheetOpen(true);
      return;
    }
    updateFeedback(f.id, { status });
  };

  const confirmResolve = async () => {
    await updateFeedback(f.id, {
      status: 'resolu',
      fixedInVersion: resolveDraft.fixedInVersion.trim(),
      resolutionNotes: resolveDraft.resolutionNotes.trim(),
    });
    setResolveSheetOpen(false);
  };

  const setPriority = (priority) => updateFeedback(f.id, { priority });

  const toggleConfirm = () => user?.email && toggleConfirmFeedback(f.id, user.email);

  const confirmDelete = async () => {
    await deleteFeedback(f.id);
    navigate('/commentaires');
  };

  const scrollToDiscussion = () => discussionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <Badge>{typeLabel(f.type)}</Badge>
            <Badge tone={statusTone(f.status)}>{statusLabel(f.status)}</Badge>
            {f.priority && f.priority !== 'normale' && <Badge tone={f.priority === 'haute' ? 'under' : 'neutral'}>{priorityLabel(f.priority)}</Badge>}
          </div>
          <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>
            {f.authorName || '—'} · {new Date(f.createdAt).toLocaleDateString('fr-CA')}
          </div>
        </div>

        {f.status === 'resolu' && (f.fixedInVersion || f.resolutionNotes) && (
          <div style={{ background: 'var(--surface-tint)', borderRadius: 'var(--radius-card)', padding: 12 }}>
            {f.fixedInVersion && (
              <div style={{ font: 'var(--text-label)', marginBottom: f.resolutionNotes ? 6 : 0 }}>Corrigé dans la version {f.fixedInVersion}</div>
            )}
            {f.resolutionNotes && (
              <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>{f.resolutionNotes}</div>
            )}
            {isAdmin && (
              <span
                onClick={() => { setResolveDraft({ fixedInVersion: f.fixedInVersion || '', resolutionNotes: f.resolutionNotes || '' }); setResolveSheetOpen(true); }}
                style={{ display: 'inline-block', marginTop: 8, font: 'var(--text-small)', color: 'var(--brand-action)', fontWeight: 600, cursor: 'pointer' }}
              >
                Modifier les notes
              </span>
            )}
          </div>
        )}

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

        {isAdmin && (
          <div>
            <div style={{ font: 'var(--text-label)', marginBottom: 8 }}>Priorité</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {FEEDBACK_PRIORITIES.map((p) => (
                <Button key={p.key} variant={f.priority === p.key ? 'primary' : 'secondary'} onClick={() => setPriority(p.key)} style={{ borderRadius: 999, flex: 1, fontSize: 13, padding: '0 8px' }}>
                  {p.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div
          onClick={toggleConfirm}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '10px 14px',
            borderRadius: 999, border: hasConfirmed ? '1px solid var(--brand-action)' : '1px solid var(--border-default)',
            background: hasConfirmed ? 'var(--surface-tint)' : '#fff', alignSelf: 'flex-start',
          }}
        >
          <span>👍</span>
          <span style={{ font: 'var(--text-small)', fontWeight: 600, color: hasConfirmed ? 'var(--brand-action)' : 'var(--text-body)' }}>
            {confirmCount === 0 ? "J'ai aussi ce problème" : `${confirmCount} joueur${confirmCount > 1 ? 's ont' : ' a'} ce problème`}
          </span>
        </div>

        <Field label="Comportement actuel" value={f.currentBehavior} />
        <Field label="Comportement attendu" value={f.expectedBehavior} />
        <Field label="Notes" value={f.notes} />

        {f.photos?.length > 0 && (
          <div>
            <div style={{ font: 'var(--text-label)', marginBottom: 8 }}>Photo{f.photos.length > 1 ? 's' : ''}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {f.photos.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  onClick={() => setLightboxIndex(i)}
                  style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border-default)', cursor: 'pointer' }}
                />
              ))}
            </div>
          </div>
        )}

        <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>
          v{f.appVersion || '—'} · {f.platform || '—'}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="primary" onClick={scrollToDiscussion} style={{ height: 48, flex: 1 }}>Ajouter un commentaire</Button>
          {canEdit && <Button variant="secondary" onClick={startEdit} style={{ height: 48, flex: 1 }}>Modifier</Button>}
        </div>
        {canDelete && (
          <span onClick={() => setDeleteConfirmOpen(true)} style={{ textAlign: 'center', font: 'var(--text-small)', color: 'var(--color-score-under)', cursor: 'pointer' }}>
            Supprimer
          </span>
        )}

        <div ref={discussionRef} style={{ borderTop: '1px solid var(--border-default)', paddingTop: 20 }}>
          <FeedbackDiscussion feedbackId={f.id} />
        </div>
      </div>

      <Sheet open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <div style={{ font: 'var(--text-h3)' }}>Supprimer ce commentaire ?</div>
        <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)' }}>Cette action est définitive.</div>
        <Button variant="secondary" onClick={() => setDeleteConfirmOpen(false)} style={{ height: 52, width: '100%' }}>Annuler</Button>
        <Button variant="primary" onClick={confirmDelete} style={{ height: 52, width: '100%', background: 'var(--color-score-under)' }}>Supprimer</Button>
      </Sheet>

      <Sheet open={resolveSheetOpen} onClose={() => setResolveSheetOpen(false)}>
        <div style={{ font: 'var(--text-h3)' }}>Marquer comme résolu</div>
        <Input
          label="Corrigé dans la version"
          placeholder="v1.9.2"
          value={resolveDraft.fixedInVersion}
          onChange={(e) => setResolveDraft((d) => ({ ...d, fixedInVersion: e.target.value }))}
        />
        <Textarea
          label="Notes de résolution (optionnel)"
          placeholder="Explique brièvement ce qui a été corrigé…"
          value={resolveDraft.resolutionNotes}
          onChange={(e) => setResolveDraft((d) => ({ ...d, resolutionNotes: e.target.value }))}
        />
        <Button variant="primary" onClick={confirmResolve} style={{ height: 52, width: '100%' }}>Enregistrer</Button>
        <span onClick={() => setResolveSheetOpen(false)} style={{ textAlign: 'center', font: 'var(--text-small)', color: 'var(--text-muted)', cursor: 'pointer' }}>Annuler</span>
      </Sheet>

      {lightboxIndex != null && (
        <PhotoLightbox photos={f.photos} index={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  );
}
