import Input from './Input';

function fieldStyle() {
  return { flex: 1, height: 44, border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '0 12px', font: 'var(--text-body)', outline: 'none' };
}

// Renders the "À noter après la séance" fields for a session (see
// lib/trainingPlan.js notesFields) — deliberately just a handful of small
// controls, not a form wizard, so it stays quick to fill in one-handed
// between range balls.
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

        if (f.type === 'fraction') {
          return (
            <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ font: 'var(--text-label)' }}>{f.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="text" inputMode="numeric" pattern="[0-9]*"
                  value={values[`${f.key}_num`] || ''}
                  onChange={(e) => onChange(`${f.key}_num`, e.target.value)}
                  style={{ ...fieldStyle(), flex: 'none', width: 56, textAlign: 'center' }}
                />
                <span style={{ font: 'var(--text-label)', color: 'var(--text-muted)' }}>/</span>
                <input
                  type="text" inputMode="numeric" pattern="[0-9]*"
                  value={values[`${f.key}_den`] || ''}
                  onChange={(e) => onChange(`${f.key}_den`, e.target.value)}
                  style={{ ...fieldStyle(), flex: 'none', width: 56, textAlign: 'center' }}
                />
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
                  style={{ ...fieldStyle(), flex: 'none', width: 72, textAlign: 'center' }}
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
