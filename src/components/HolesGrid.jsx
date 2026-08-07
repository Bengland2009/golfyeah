function smallBtn() {
  return { width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', fontSize: 16 };
}

// Per-hole par (stepper) + optional yardage (input) list, used both by the
// full "Ajouter un terrain" flow and by "Nouvelle partie" when the golfer
// chooses to configure an indoor course's holes up front instead of
// progressively during play.
export default function HolesGrid({ holes, pars, yardages, onBumpPar, onYardageChange }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px', marginBottom: 4 }}>
        <span style={{ flex: '0 0 64px', font: 'var(--text-small)', color: 'var(--text-muted)' }}>Trou</span>
        <span style={{ flex: '0 0 88px', font: 'var(--text-small)', color: 'var(--text-muted)', textAlign: 'center' }}>Par</span>
        <span style={{ flex: 1, font: 'var(--text-small)', color: 'var(--text-muted)', textAlign: 'right' }}>Distance</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Array.from({ length: holes }).map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', padding: 10, border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ flex: '0 0 64px', font: 'var(--text-body)', fontWeight: 600 }}>Trou {i + 1}</span>
            <div style={{ flex: '0 0 88px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <button onClick={() => onBumpPar(i, -1)} style={smallBtn()}>−</button>
              <span style={{ font: 'var(--text-label)', width: 18, textAlign: 'center' }}>{pars[i]}</span>
              <button onClick={() => onBumpPar(i, 1)} style={smallBtn()}>+</button>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
              <input
                type="number" inputMode="numeric" value={yardages[i]} placeholder="385"
                onChange={(e) => onYardageChange(i, e.target.value)}
                style={{ width: 72, font: 'var(--text-small)', border: '1px solid var(--border-default)', borderRadius: 6, padding: '6px 8px', textAlign: 'right' }}
              />
              <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>vg</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginTop: 10 }}>
        Par total : {pars.slice(0, holes).reduce((a, b) => a + (b || 0), 0)}
      </div>
    </div>
  );
}
