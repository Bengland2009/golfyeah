import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import Sheet from '../components/Sheet';
import { MoreVerticalIcon } from '../components/icons';
import { useData } from '../contexts/DataContext';
import { useMe } from '../lib/useMe';
import { sessionById, noteFieldsFor, SIM_MODES } from '../lib/trainingPlan';

function contextLabel(place, mode) {
  if (place === 'range') return 'Range extérieur';
  const m = SIM_MODES.find((x) => x.id === mode);
  return m ? `Simulateur · ${m.label}` : 'Simulateur';
}

function displayValue(field, raw) {
  return field.type === 'boolean' ? (raw ? 'Oui' : 'Non') : raw;
}

export default function TrainingHistory() {
  const navigate = useNavigate();
  const { trainingLogs, deleteTrainingLog } = useData();
  const me = useMe();
  const [deleteId, setDeleteId] = useState(null);

  const myLogs = trainingLogs
    .filter((l) => l.playerId === me?.id)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  const remove = async () => {
    await deleteTrainingLog(deleteId);
    setDeleteId(null);
  };

  return (
    <div>
      <Header title="Notes de progression" onBack={() => navigate('/pratique/plan')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {!myLogs.length && (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)' }}>Aucune séance complétée pour l'instant.</div>
          </div>
        )}

        {myLogs.map((log) => {
          const session = sessionById(log.sessionId);
          const fields = noteFieldsFor(log.sessionId)
            .map((f) => ({ label: f.label, value: log.notes?.[f.key], type: f.type }))
            .filter((f) => f.value != null && f.value !== '')
            .map((f) => ({ label: f.label, value: displayValue(f, f.value) }));
          return (
            <Card key={log.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: fields.length ? 10 : 0 }}>
                <div>
                  <div style={{ font: 'var(--text-label)', fontSize: 15 }}>{session ? session.name : log.sessionId}</div>
                  <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginTop: 1 }}>
                    {contextLabel(log.place, log.mode)} · {log.duration} min · {log.date}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteId(log.id)}
                  aria-label="Options"
                  style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', flexShrink: 0 }}
                >
                  <MoreVerticalIcon width={18} height={18} />
                </button>
              </div>
              {fields.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, borderTop: '1px solid var(--border-default)', paddingTop: 10 }}>
                  {fields.map((f) => (
                    <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, font: 'var(--text-small)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{f.label}</span>
                      <span style={{ fontWeight: 600, textAlign: 'right' }}>{f.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Sheet open={deleteId != null} onClose={() => setDeleteId(null)} zIndex={70} dim={0.45}>
        <div style={{ font: 'var(--text-h3)' }}>Supprimer cette entrée ?</div>
        <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)' }}>Cette note de séance sera supprimée définitivement.</div>
        <Button variant="secondary" onClick={() => setDeleteId(null)} style={{ height: 52, width: '100%' }}>Annuler</Button>
        <Button variant="primary" onClick={remove} style={{ height: 52, width: '100%', background: 'var(--color-score-under)' }}>Supprimer</Button>
      </Sheet>
    </div>
  );
}
