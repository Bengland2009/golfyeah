import { useState } from 'react';
import Card from './Card';
import Button from './Button';
import Input from './Input';
import Avatar from './Avatar';
import Sheet from './Sheet';
import { useData } from '../contexts/DataContext';
import { avatarSrc } from '../lib/avatar';
import { formatCAD, computeBalances, computeSettlement } from '../lib/expenses';

function PlayerPickRow({ players, selectedIds, multi, onToggle }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
      {players.map((p) => {
        const selected = selectedIds.includes(p.id);
        return (
          <div key={p.id} onClick={() => onToggle(p.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            <div style={{ position: 'relative', padding: 2, borderRadius: '50%', border: selected ? '3px solid var(--brand-action)' : '3px solid transparent' }}>
              <Avatar src={avatarSrc(p)} name={p.name} size={44} />
              {selected && (
                <span style={{ position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: '50%', background: 'var(--brand-action)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, border: '2px solid #fff' }}>✓</span>
              )}
            </div>
            <span style={{ font: 'var(--text-small)', fontSize: 12, fontWeight: selected ? 700 : 400, color: selected ? 'var(--text-body)' : 'var(--text-muted)' }}>{p.name}</span>
          </div>
        );
      })}
    </div>
  );
}

const emptyForm = (playerIds) => ({ description: '', amount: '', paidByPlayerId: null, participantPlayerIds: [...playerIds] });

export default function RoundExpenses({ roundId, playerIds, players }) {
  const { expenses, addExpense, updateExpense, deleteExpense } = useData();
  const roundExpenses = expenses.filter((e) => e.roundId === roundId);
  const roundPlayers = players.filter((p) => playerIds.includes(p.id));
  const playerName = (id) => players.find((p) => p.id === id)?.name || '—';

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(() => emptyForm(playerIds));

  const openAdd = () => { setEditingId(null); setForm(emptyForm(playerIds)); setSheetOpen(true); };
  const openEdit = (exp) => {
    setEditingId(exp.id);
    setForm({
      description: exp.description,
      amount: String((exp.amountInCents / 100).toFixed(2)).replace(/\.00$/, ''),
      paidByPlayerId: exp.paidByPlayerId,
      participantPlayerIds: exp.participantPlayerIds,
    });
    setSheetOpen(true);
  };

  const toggleParticipant = (id) => setForm((f) => ({
    ...f,
    participantPlayerIds: f.participantPlayerIds.includes(id)
      ? f.participantPlayerIds.filter((p) => p !== id)
      : [...f.participantPlayerIds, id],
  }));

  const amountInCents = Math.round((parseFloat(form.amount.replace(',', '.')) || 0) * 100);
  const canSave = form.description.trim() && amountInCents > 0 && form.paidByPlayerId && form.participantPlayerIds.length > 0;

  const save = async () => {
    if (!canSave) return;
    const payload = {
      description: form.description.trim(),
      amountInCents,
      paidByPlayerId: form.paidByPlayerId,
      participantPlayerIds: form.participantPlayerIds,
    };
    if (editingId) await updateExpense(editingId, payload);
    else await addExpense(roundId, payload);
    setSheetOpen(false);
  };

  const remove = async () => {
    if (editingId) await deleteExpense(editingId);
    setSheetOpen(false);
  };

  const balances = computeBalances(roundExpenses, playerIds);
  const settlement = computeSettlement(balances);
  const total = roundExpenses.reduce((a, e) => a + e.amountInCents, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
          Dépenses
        </div>

        {roundExpenses.length === 0 && (
          <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginBottom: 12 }}>Aucune dépense pour cette partie.</div>
        )}

        {roundExpenses.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            {roundExpenses.map((exp) => (
              <div key={exp.id} onClick={() => openEdit(exp)} style={{ cursor: 'pointer' }}>
                <Card>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <span style={{ font: 'var(--text-label)' }}>{exp.description}</span>
                    <span style={{ font: 'var(--text-label)', fontWeight: 700 }}>{formatCAD(exp.amountInCents)}</span>
                  </div>
                  <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>
                    Payé par {playerName(exp.paidByPlayerId)} · {exp.participantPlayerIds.length} participant{exp.participantPlayerIds.length > 1 ? 's' : ''}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}

        <span onClick={openAdd} style={{ font: 'var(--text-small)', color: 'var(--brand-action)', fontWeight: 600, cursor: 'pointer' }}>
          + Ajouter une dépense
        </span>
      </div>

      {roundExpenses.length > 0 && (
        <>
          <div>
            <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginBottom: 8 }}>
              Total dépensé · <strong style={{ color: 'var(--text-body)' }}>{formatCAD(total)}</strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {roundPlayers.map((p) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--text-small)' }}>
                  <span>{p.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{formatCAD(balances[p.id]?.paid || 0)} payé</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>
              Régler les comptes
            </div>
            {settlement.length === 0 ? (
              <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>Tout le monde est à jour.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {settlement.map((t, i) => (
                  <Card key={i} tint>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ font: 'var(--text-body)' }}>{playerName(t.fromId)} → {playerName(t.toId)}</span>
                      <span style={{ font: 'var(--text-label)', fontWeight: 700 }}>{formatCAD(t.cents)}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <div style={{ font: 'var(--text-h3)' }}>{editingId ? 'Modifier la dépense' : 'Ajouter une dépense'}</div>
        <Input label="Description" placeholder="Terrain + voiturette" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        <Input label="Montant" type="number" inputMode="decimal" placeholder="0,00" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
        <div>
          <div style={{ font: 'var(--text-label)', marginBottom: 8 }}>Payé par</div>
          <PlayerPickRow
            players={roundPlayers}
            selectedIds={form.paidByPlayerId ? [form.paidByPlayerId] : []}
            onToggle={(id) => setForm((f) => ({ ...f, paidByPlayerId: id }))}
          />
        </div>
        <div>
          <div style={{ font: 'var(--text-label)', marginBottom: 8 }}>Partagé entre</div>
          <PlayerPickRow players={roundPlayers} selectedIds={form.participantPlayerIds} multi onToggle={toggleParticipant} />
        </div>
        <Button variant="primary" onClick={save} disabled={!canSave} style={{ height: 52, width: '100%' }}>Enregistrer</Button>
        {editingId && (
          <span onClick={remove} style={{ textAlign: 'center', font: 'var(--text-small)', color: 'var(--color-score-under)', cursor: 'pointer' }}>
            Supprimer la dépense
          </span>
        )}
        <span onClick={() => setSheetOpen(false)} style={{ textAlign: 'center', font: 'var(--text-small)', color: 'var(--text-muted)', cursor: 'pointer' }}>
          Annuler
        </span>
      </Sheet>
    </div>
  );
}
