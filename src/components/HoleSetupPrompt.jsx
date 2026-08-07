import { useState } from 'react';

// Shown in place of live scoring whenever the current hole has no par yet
// (Partie intérieure rapide, and any hole entered without pre-planning).
// One tap on a par number saves it (and whatever distance was typed, if
// any) and hands control straight back to scoring — no separate form, no
// confirmation step.
export default function HoleSetupPrompt({ holeNumber, onSave }) {
  const [yardage, setYardage] = useState('');

  return (
    <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, paddingTop: 8 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
          Trou {holeNumber}
        </div>
        <div style={{ font: 'var(--text-h3)' }}>Quel est le par de ce trou ?</div>
      </div>

      <div>
        <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>
          Par
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          {[3, 4, 5].map((p) => (
            <button
              key={p}
              onClick={() => onSave(p, yardage)}
              style={{
                width: 76, height: 76, borderRadius: '50%', border: 'none',
                background: 'var(--color-green-action)', color: '#fff',
                font: 'var(--font-sans)', fontWeight: 700, fontSize: 32,
                cursor: 'pointer', boxShadow: 'var(--shadow-elevated)',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: 260 }}>
        <div style={{ font: 'var(--text-label)', textAlign: 'center', marginBottom: 8 }}>Distance (facultative)</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <input
            type="number" inputMode="numeric" value={yardage} placeholder="387"
            onChange={(e) => setYardage(e.target.value)}
            style={{ width: 96, height: 46, font: 'var(--text-body)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '0 12px', textAlign: 'center' }}
          />
          <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>vg</span>
        </div>
      </div>
    </div>
  );
}
