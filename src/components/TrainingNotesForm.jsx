import Input from './Input';

// Renders the shared post-session debrief fields (see
// TRAINING_NOTE_FIELDS in lib/trainingPlan.js) — same six fields after
// every session, so this stays a couple of text fields plus one chip
// picker, never a form wizard.
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
