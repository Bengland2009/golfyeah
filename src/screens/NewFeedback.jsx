import { useState } from 'react';
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

export default function NewFeedback() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addFeedback } = useData();

  const [type, setType] = useState('bug');
  const [title, setTitle] = useState('');
  const [currentBehavior, setCurrentBehavior] = useState('');
  const [expectedBehavior, setExpectedBehavior] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const canSave = title.trim().length > 0 && !saving;

  const submit = async () => {
    if (!canSave) return;
    setSaving(true);
    await addFeedback({
      type,
      title: title.trim(),
      currentBehavior: currentBehavior.trim(),
      expectedBehavior: expectedBehavior.trim(),
      notes: notes.trim(),
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

        <Button variant="primary" onClick={submit} disabled={!canSave} style={{ height: 52, width: '100%' }}>
          Envoyer
        </Button>
      </div>
    </div>
  );
}
