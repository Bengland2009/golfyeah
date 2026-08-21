import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import Sheet from '../components/Sheet';
import Accordion from '../components/Accordion';
import TrainingNotesForm from '../components/TrainingNotesForm';
import { useData } from '../contexts/DataContext';
import { useMe } from '../lib/useMe';
import { sessionById } from '../lib/trainingPlan';

export default function TrainingSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { trainingLogs, addTrainingLog } = useData();
  const me = useMe();
  const session = sessionById(sessionId);

  const [notes, setNotes] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);

  if (!session) {
    navigate('/pratique/plan');
    return null;
  }

  const myLogs = trainingLogs.filter((l) => l.playerId === me?.id);
  const completedCount = myLogs.length;
  const currentWeek = Math.min(4, Math.floor(completedCount / 3) + 1);

  const setField = (key, value) => setNotes((n) => ({ ...n, [key]: value }));

  const confirmComplete = async () => {
    setSaving(true);
    await addTrainingLog(me.id, { sessionId: session.id, week: currentWeek, notes });
    setSaving(false);
    setConfirmOpen(false);
    setSavedOpen(true);
  };

  return (
    <div>
      <Header title={session.label} onBack={() => navigate('/pratique/plan')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={{ font: 'var(--text-h3)', marginBottom: 4 }}>{session.title}</div>
          <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginBottom: 10 }}>{session.duration}</div>
          <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)', lineHeight: 1.5 }}>{session.goal}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {session.blocks.map((b, i) => (
            <Accordion key={b.title} title={b.title} subtitle={b.duration} defaultOpen={i === 0}>
              <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {b.items.map((item) => (
                  <li key={item} style={{ font: 'var(--text-body)', fontSize: 15, lineHeight: 1.4, color: 'var(--text-body)' }}>{item}</li>
                ))}
              </ul>
            </Accordion>
          ))}
        </div>

        <Card>
          <div style={{ font: 'var(--text-label)', fontSize: 15, marginBottom: 14 }}>À noter après la séance</div>
          <TrainingNotesForm fields={session.notesFields} values={notes} onChange={setField} />
        </Card>

        <Button variant="primary" onClick={() => setConfirmOpen(true)} style={{ height: 52, width: '100%' }}>
          Marquer comme complétée
        </Button>
      </div>

      <Sheet open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <div style={{ font: 'var(--text-h3)' }}>Marquer cette séance comme complétée ?</div>
        <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)' }}>
          Tes notes seront enregistrées dans l'historique.
        </div>
        <Button variant="secondary" onClick={() => setConfirmOpen(false)} style={{ height: 52, width: '100%' }}>Annuler</Button>
        <Button variant="primary" onClick={confirmComplete} disabled={saving} style={{ height: 52, width: '100%' }}>
          Marquer comme complétée
        </Button>
      </Sheet>

      <Sheet open={savedOpen} onClose={() => navigate('/pratique/plan')}>
        <div style={{ font: 'var(--text-h3)' }}>Séance enregistrée</div>
        <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)' }}>
          Rappelle-toi : une seule chose à améliorer à la prochaine séance.
        </div>
        <Button variant="primary" onClick={() => navigate('/pratique/plan')} style={{ height: 52, width: '100%' }}>
          Retour au plan
        </Button>
      </Sheet>
    </div>
  );
}
