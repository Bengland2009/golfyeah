import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { useData } from '../contexts/DataContext';

const PILL_SEG = { borderRadius: 999, flex: 1 };

function smallBtn() {
  return { width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', fontSize: 16 };
}

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
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px', marginBottom: 4 }}>
            <span style={{ flex: '0 0 64px', font: 'var(--text-small)', color: 'var(--text-muted)' }}>Trou</span>
            <span style={{ flex: '0 0 88px', font: 'var(--text-small)', color: 'var(--text-muted)', textAlign: 'center' }}>Par</span>
            <span style={{ flex: 1, font: 'var(--text-small)', color: 'var(--text-muted)', textAlign: 'right' }}>Distance</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Array.from({ length: d.holes }).map((_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', padding: 10, border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ flex: '0 0 64px', font: 'var(--text-body)', fontWeight: 600 }}>Trou {i + 1}</span>
                <div style={{ flex: '0 0 88px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <button onClick={() => bumpPar(i, -1)} style={smallBtn()}>−</button>
                  <span style={{ font: 'var(--text-label)', width: 18, textAlign: 'center' }}>{d.pars[i]}</span>
                  <button onClick={() => bumpPar(i, 1)} style={smallBtn()}>+</button>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                  <input
                    type="number" inputMode="numeric" value={d.yardages[i]} placeholder="385"
                    onChange={(e) => setYardage(i, e.target.value)}
                    style={{ width: 72, font: 'var(--text-small)', border: '1px solid var(--border-default)', borderRadius: 6, padding: '6px 8px', textAlign: 'right' }}
                  />
                  <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>vg</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginTop: 10 }}>
            Par total : {d.pars.slice(0, d.holes).reduce((a, b) => a + b, 0)}
          </div>
        </div>
        <Button variant="primary" onClick={save} style={{ height: 52, width: '100%' }}>Enregistrer le terrain</Button>
      </div>
    </div>
  );
}
