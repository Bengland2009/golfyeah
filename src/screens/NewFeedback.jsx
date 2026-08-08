import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import RadioRow from '../components/RadioRow';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { FEEDBACK_TYPES, detectPlatform, detectDeviceInfo } from '../lib/feedback';
import { APP_VERSION } from '../lib/version';
import { resizeImageFile } from '../lib/image';

const MAX_PHOTOS = 5;

export default function NewFeedback() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addFeedback } = useData();

  const [type, setType] = useState('bug');
  const [title, setTitle] = useState('');
  const [currentBehavior, setCurrentBehavior] = useState('');
  const [expectedBehavior, setExpectedBehavior] = useState('');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState([]);
  const [saving, setSaving] = useState(false);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const canSave = title.trim().length > 0 && !saving;
  const photosFull = photos.length >= MAX_PHOTOS;

  const onFilesSelected = async (ev) => {
    const files = Array.from(ev.target.files || []).slice(0, MAX_PHOTOS - photos.length);
    ev.target.value = '';
    if (!files.length) return;
    const resized = await Promise.all(files.map((f) => resizeImageFile(f, 900, 0.75)));
    setPhotos((s) => [...s, ...resized].slice(0, MAX_PHOTOS));
  };
  const removePhoto = (i) => setPhotos((s) => s.filter((_, idx) => idx !== i));

  const submit = async () => {
    if (!canSave) return;
    setSaving(true);
    await addFeedback({
      type,
      title: title.trim(),
      currentBehavior: currentBehavior.trim(),
      expectedBehavior: expectedBehavior.trim(),
      notes: notes.trim(),
      photos,
      authorEmail: user?.email || null,
      authorName: user?.name || 'Anonyme',
      appVersion: APP_VERSION,
      platform: detectPlatform(),
      deviceInfo: detectDeviceInfo(),
    });
    navigate('/commentaires');
  };

  return (
    <div>
      <Header title="Nouveau commentaire" onBack={() => navigate('/commentaires')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={{ font: 'var(--text-label)', marginBottom: 8 }}>Type</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FEEDBACK_TYPES.map((t) => (
              <RadioRow key={t.key} selected={type === t.key} label={t.label} onClick={() => setType(t.key)} />
            ))}
          </div>
        </div>

        <Input label="Titre" placeholder="Résumé en une phrase" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea label="Comportement actuel" placeholder="Ce qui se passe présentement" value={currentBehavior} onChange={(e) => setCurrentBehavior(e.target.value)} />
        <Textarea label="Comportement attendu" placeholder="Ce qui devrait se passer" value={expectedBehavior} onChange={(e) => setExpectedBehavior(e.target.value)} />
        <Textarea label="Notes (optionnel)" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />

        <div>
          <div style={{ font: 'var(--text-label)', marginBottom: 8 }}>Photo (optionnel)</div>

          {photos.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              {photos.map((src, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={src} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border-default)' }} />
                  <button
                    onClick={() => removePhoto(i)}
                    aria-label="Retirer"
                    style={{ position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: '50%', border: '2px solid #fff', background: 'var(--color-score-under)', color: '#fff', fontSize: 13, lineHeight: 1, cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 20 }}>
            <span
              onClick={() => !photosFull && cameraInputRef.current?.click()}
              style={{ font: 'var(--text-small)', color: photosFull ? 'var(--text-disabled)' : 'var(--brand-action)', fontWeight: 600, cursor: photosFull ? 'default' : 'pointer' }}
            >
              Prendre une photo
            </span>
            <span
              onClick={() => !photosFull && galleryInputRef.current?.click()}
              style={{ font: 'var(--text-small)', color: photosFull ? 'var(--text-disabled)' : 'var(--brand-action)', fontWeight: 600, cursor: photosFull ? 'default' : 'pointer' }}
            >
              Choisir des photos
            </span>
          </div>
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={onFilesSelected} style={{ display: 'none' }} />
          <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={onFilesSelected} style={{ display: 'none' }} />
        </div>

        <Button variant="primary" onClick={submit} disabled={!canSave} style={{ height: 52, width: '100%' }}>
          Envoyer
        </Button>
      </div>
    </div>
  );
}
