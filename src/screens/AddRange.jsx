import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import Sheet from '../components/Sheet';
import { useData } from '../contexts/DataContext';
import { useMe } from '../lib/useMe';

const today = () => new Date().toLocaleDateString('fr-CA', { day: 'numeric', month: 'long', year: 'numeric' });

export default function AddRange() {
  const navigate = useNavigate();
  const { getMyClubs, addClub, addRangeEntry, CLUB_ORDER } = useData();
  const me = useMe();
  const myClubs = getMyClubs(me?.id);

  const [d, setD] = useState({ club: myClubs[0] || 'Fer 7', balls: 10, avg: 150, date: today(), location: '' });
  const [addClubOpen, setAddClubOpen] = useState(false);
  const [customClubName, setCustomClubName] = useState('');

  const update = (field, value) => setD((s) => ({ ...s, [field]: value }));
  const available = CLUB_ORDER.filter((c) => !myClubs.includes(c));

  const chooseClub = async (name) => {
    const clean = name.trim();
    if (!clean) return;
    await addClub(me.id, clean);
    update('club', clean);
    setAddClubOpen(false);
    setCustomClubName('');
  };

  const save = async () => {
    await addRangeEntry(me.id, d);
    navigate('/range');
  };

  return (
    <div>
      <Header title="Nouvelle séance" onBack={() => navigate('/range')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={{ font: 'var(--text-label)', marginBottom: 8 }}>Mes bâtons</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {myClubs.map((c) => (
              <Button key={c} variant={d.club === c ? 'primary' : 'secondary'} onClick={() => update('club', c)} style={{ borderRadius: 999 }}>{c}</Button>
            ))}
            <Button variant="secondary" onClick={() => setAddClubOpen(true)} style={{ borderRadius: 999 }}>+ Ajouter un bâton</Button>
          </div>
        </div>

        <Input label="Nombre de balles" type="number" inputMode="numeric" value={String(d.balls)} onChange={(e) => update('balls', e.target.value)} />
        <Input label="Distance moyenne (vg)" type="number" inputMode="numeric" value={String(d.avg)} onChange={(e) => update('avg', e.target.value)} />
        <Input label="Date" value={d.date} onChange={(e) => update('date', e.target.value)} />
        <Input label="Lieu (optionnel)" placeholder="Golf In Montréal" value={d.location} onChange={(e) => update('location', e.target.value)} />
        <Button variant="primary" onClick={save} style={{ height: 52, width: '100%' }}>Enregistrer</Button>
      </div>

      <Sheet open={addClubOpen} onClose={() => setAddClubOpen(false)}>
        <div style={{ font: 'var(--text-h3)' }}>Ajouter un bâton</div>
        {available.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {available.map((c) => (
              <Button key={c} variant="secondary" onClick={() => chooseClub(c)} style={{ borderRadius: 999 }}>{c}</Button>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <Input label="Bâton personnalisé" placeholder="52°, Chipper…" value={customClubName} onChange={(e) => setCustomClubName(e.target.value)} />
          </div>
          <Button variant="primary" onClick={() => chooseClub(customClubName)} style={{ borderRadius: 999, height: 46 }}>Ajouter</Button>
        </div>
      </Sheet>
    </div>
  );
}
