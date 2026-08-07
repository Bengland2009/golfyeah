import { useRef, useState } from 'react';
import Avatar from './Avatar';
import Textarea from './Textarea';
import Button from './Button';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { avatarSrc } from '../lib/avatar';
import { matchPlayer } from '../lib/identity';
import { resizeImageFile } from '../lib/image';

const MAX_SCREENSHOTS = 3;

function formatDateTime(ts) {
  return new Date(ts).toLocaleString('fr-CA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function FeedbackDiscussion({ feedbackId }) {
  const { user } = useAuth();
  const { feedbackComments, addFeedbackComment, players } = useData();
  const comments = feedbackComments
    .filter((c) => c.feedbackId === feedbackId)
    .sort((a, b) => a.createdAt - b.createdAt);

  const [message, setMessage] = useState('');
  const [pendingScreenshots, setPendingScreenshots] = useState([]);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef(null);

  const onFilesSelected = async (ev) => {
    const files = Array.from(ev.target.files || []).slice(0, MAX_SCREENSHOTS - pendingScreenshots.length);
    ev.target.value = '';
    if (!files.length) return;
    // Larger than a profile photo (900px) so UI bugs stay legible.
    const resized = await Promise.all(files.map((f) => resizeImageFile(f, 900, 0.75)));
    setPendingScreenshots((s) => [...s, ...resized].slice(0, MAX_SCREENSHOTS));
  };
  const removePending = (i) => setPendingScreenshots((s) => s.filter((_, idx) => idx !== i));

  const canSend = (message.trim().length > 0 || pendingScreenshots.length > 0) && !sending;

  const send = async () => {
    if (!canSend) return;
    setSending(true);
    await addFeedbackComment(feedbackId, {
      authorEmail: user?.email || null,
      authorName: user?.name || 'Anonyme',
      message,
      screenshots: pendingScreenshots,
    });
    setMessage('');
    setPendingScreenshots([]);
    setSending(false);
  };

  return (
    <div>
      <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
        Discussion
      </div>

      {!comments.length && (
        <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginBottom: 16 }}>Aucun commentaire pour l’instant.</div>
      )}

      {comments.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
          {comments.map((c) => {
            const player = matchPlayer(players, c);
            return (
              <div key={c.id} style={{ display: 'flex', gap: 10 }}>
                <Avatar src={avatarSrc(player)} name={c.authorName} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ font: 'var(--text-label)' }}>{c.authorName}</span>
                    <span style={{ font: 'var(--text-small)', fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>{formatDateTime(c.createdAt)}</span>
                  </div>
                  {c.message && <div style={{ font: 'var(--text-body)', marginTop: 2, whiteSpace: 'pre-wrap' }}>{c.message}</div>}
                  {c.screenshots?.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                      {c.screenshots.map((src, i) => (
                        <img key={i} src={src} alt="Capture d’écran" style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border-default)' }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pendingScreenshots.length > 0 && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          {pendingScreenshots.map((src, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <img src={src} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border-default)' }} />
              <button
                onClick={() => removePending(i)}
                aria-label="Retirer"
                style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', border: '2px solid #fff', background: 'var(--color-score-under)', color: '#fff', fontSize: 12, lineHeight: 1, cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <Textarea placeholder="Écrire un commentaire..." rows={2} value={message} onChange={(e) => setMessage(e.target.value)} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <span
          onClick={() => pendingScreenshots.length < MAX_SCREENSHOTS && fileInputRef.current?.click()}
          style={{ font: 'var(--text-small)', color: pendingScreenshots.length < MAX_SCREENSHOTS ? 'var(--brand-action)' : 'var(--text-disabled)', fontWeight: 600, cursor: pendingScreenshots.length < MAX_SCREENSHOTS ? 'pointer' : 'default' }}
        >
          + Photo
        </span>
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={onFilesSelected} style={{ display: 'none' }} />
        <Button variant="primary" onClick={send} disabled={!canSend} style={{ borderRadius: 999, height: 40, padding: '0 20px', fontSize: 14 }}>
          Envoyer
        </Button>
      </div>
    </div>
  );
}
