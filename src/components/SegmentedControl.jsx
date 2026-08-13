export default function SegmentedControl({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', background: 'var(--surface-tint)', borderRadius: 12, padding: 4, gap: 4 }}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1, height: 40, borderRadius: 9, border: 'none', cursor: 'pointer',
              background: active ? '#fff' : 'transparent',
              boxShadow: active ? 'var(--shadow-elevated)' : 'none',
              font: 'var(--text-body)', fontWeight: 600, fontSize: 14,
              color: active ? 'var(--text-body)' : 'var(--text-muted)',
              transition: 'background 0.15s, box-shadow 0.15s',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
