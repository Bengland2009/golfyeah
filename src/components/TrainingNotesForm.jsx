import Input from './Input';

// Renders whichever post-session debrief fields the caller passes in
// (see noteFieldsFor in lib/trainingPlan.js) — the shared fields plus,
// for the "Jeu réel" session family, a few extra ones — so this stays a
// short set of quick controls, never a form wizard.
export default function TrainingNotesForm({ fields, values, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {fields.map((f) => {
        if (f.type === 'select') {
          return (
            <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ font: 'var(--text-label)' }}>{f.label}</span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {f.options.map((opt) => {
                  const active = values[f.key] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onChange(f.key, opt)}
                      style={{
                        height: 36, padding: '0 14px', borderRadius: 999, cursor: 'pointer',
                        border: active ? '1px solid var(--brand-action)' : '1px solid var(--border-default)',
                        background: active ? '#EAF5EF' : '#fff',
                        color: active ? 'var(--brand-action)' : 'var(--text-body)',
                        font: 'var(--text-small)', fontWeight: active ? 700 : 400,
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }

        if (f.type === 'boolean') {
          return (
            <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ font: 'var(--text-label)' }}>{f.label}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                {[{ v: true, l: 'Oui' }, { v: false, l: 'Non' }].map((opt) => {
                  const active = values[f.key] === opt.v;
                  return (
                    <button
                      key={opt.l}
                      type="button"
                      onClick={() => onChange(f.key, opt.v)}
                      style={{
                        flex: 1, height: 36, borderRadius: 999, cursor: 'pointer',
                        border: active ? '1px solid var(--brand-action)' : '1px solid var(--border-default)',
                        background: active ? '#EAF5EF' : '#fff',
                        color: active ? 'var(--brand-action)' : 'var(--text-body)',
                        font: 'var(--text-small)', fontWeight: active ? 700 : 400,
                      }}
                    >
                      {opt.l}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }

        if (f.type === 'number') {
          return (
            <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ font: 'var(--text-label)' }}>{f.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="text" inputMode="numeric" pattern="[0-9]*"
                  value={values[f.key] || ''}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  style={{ width: 72, height: 44, textAlign: 'center', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', font: 'var(--text-body)', padding: 0, outline: 'none' }}
                />
                {f.suffix && <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{f.suffix}</span>}
              </div>
            </div>
          );
        }

        return (
          <Input
            key={f.key}
            label={f.label}
            value={values[f.key] || ''}
            onChange={(e) => onChange(f.key, e.target.value)}
          />
        );
      })}
    </div>
  );
}
