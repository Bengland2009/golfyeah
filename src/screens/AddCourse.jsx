import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import HolesGrid from '../components/HolesGrid';
import { useData } from '../contexts/DataContext';

const PILL_SEG = { borderRadius: 999, flex: 1 };

export default function AddCourse() {
  const navigate = useNavigate();
  const { addCourse } = useData();
  const [d, setD] = useState({ name: '', city: '', kind: 'exterieur', simulatedCourse: '', holes: 18, pars: Array(18).fill(4), yardages: Array(18).fill('') });

  const update = (field, value) => setD((s) => ({ ...s, [field]: value }));
  const bumpPar = (i, delta) => setD((s) => {
    const arr = [...s.pars];
    arr[i] = Math.max(3, arr[i] + delta);
    return { ...s, pars: arr };
  });
  const setYardage = (i, v) => setD((s) => {
    const arr = [...s.yardages];
    arr[i] = v;
    return { ...s, yardages: arr };
  });

  const save = async () => {
    const yardages = d.yardages.slice(0, d.holes);
    if (!d.name.trim() || !d.city.trim() || yardages.some((y) => !y || Number(y) <= 0)) return;
    await addCourse(d);
    navigate('/terrains');
  };

  return (
    <div>
      <Header title="Nouveau terrain" onBack={() => navigate('/terrains')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input label={d.kind === 'interieur' ? 'Nom du lieu' : 'Nom du terrain'} value={d.name} onChange={(e) => update('name', e.target.value)} />
        <Input label="Ville" value={d.city} onChange={(e) => update('city', e.target.value)} />
        <div>
          <div style={{ font: 'var(--text-label)', marginBottom: 8 }}>Type de golf</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['exterieur', 'Extérieur'], ['interieur', 'Intérieur']].map(([k, label]) => (
              <Button key={k} variant={d.kind === k ? 'primary' : 'secondary'} onClick={() => update('kind', k)} style={PILL_SEG}>{label}</Button>
            ))}
          </div>
        </div>
        {d.kind === 'interieur' && (
          <Input label="Parcours simulé (optionnel)" placeholder="Pebble Beach" value={d.simulatedCourse} onChange={(e) => update('simulatedCourse', e.target.value)} />
        )}
        <div>
          <div style={{ font: 'var(--text-label)', marginBottom: 8 }}>Nombre de trous</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[9, 18].map((h) => (
              <Button key={h} variant={d.holes === h ? 'primary' : 'secondary'} onClick={() => update('holes', h)} style={PILL_SEG}>{h} trous</Button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ font: 'var(--text-label)', marginBottom: 8 }}>Trous</div>
          <HolesGrid holes={d.holes} pars={d.pars} yardages={d.yardages} onBumpPar={bumpPar} onYardageChange={setYardage} />
        </div>
        <Button variant="primary" onClick={save} style={{ height: 52, width: '100%' }}>Enregistrer le terrain</Button>
      </div>
    </div>
  );
}
