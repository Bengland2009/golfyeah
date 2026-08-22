import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Sheet from '../components/Sheet';
import Accordion from '../components/Accordion';
import TrainingNotesForm from '../components/TrainingNotesForm';
import { useData } from '../contexts/DataContext';
import { useMe } from '../lib/useMe';
import { sessionById, adaptedBlocks, TRAINING_NOTE_FIELDS, VALIDATION, VALIDATION_LABELS, LOCATIONS } from '../lib/trainingPlan';

function statusTone(status) {
  return status === VALIDATION.VALIDATED_SOURCE || status === VALIDATION.VALIDATED_COACH ? 'success' : 'neutral';
}

export default function TrainingSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { addTrainingLog } = useData();
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

  const duration = routerLocation.state?.duration || session.durations[session.durations.length - 1];
  const practiceLocation = routerLocation.state?.location || session.locations[0];
  const locationLabel = LOCATIONS.find((l) => l.id === practiceLocation)?.label || practiceLocation;
  const blocks = adaptedBlocks(session, duration);
  const extraTime = duration > session.blocks.reduce((a, b) => a + b.minutes, 0);

  const setField = (key, value) => setNotes((n) => ({ ...n, [key]: value }));

  const confirmComplete = async () => {
    setSaving(true);
    await addTrainingLog(me.id, { sessionId: session.id, location: practiceLocation, duration, notes });
    setSaving(false);
    setConfirmOpen(false);
    setSavedOpen(true);
  };

  return (
    <div>
      <Header title={session.name} onBack={() => navigate('/pratique/plan')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={{ font: 'var(--text-h3)', marginBottom: 4 }}>{session.objective}</div>
          <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            <span style={{ fontWeight: 600 }}>Principe : </span>{session.principle}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone={statusTone(session.status)}>{VALIDATION_LABELS[session.status]}</Badge>
          <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{duration} min</span>
          <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>· {locationLabel}</span>
        </div>

        {extraTime && (
          <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Tu as plus de temps que la structure de base — profites-en pour répéter les blocs qui te semblent utiles.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {blocks.map((b, i) => (
            <Accordion key={b.title} title={b.title} subtitle={`${b.minutes} min`} defaultOpen={i === 0}>
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
          <TrainingNotesForm fields={TRAINING_NOTE_FIELDS} values={notes} onChange={setField} />
        </Card>

        <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>
          Source : {session.source}
        </div>

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
