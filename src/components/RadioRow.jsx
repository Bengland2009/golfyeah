export default function RadioRow({ selected, label, sub, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: sub ? 'flex-start' : 'center', gap: 12, padding: 14, cursor: 'pointer',
        borderRadius: 'var(--radius-card)', border: selected ? '2px solid var(--brand-action)' : '1px solid var(--border-default)',
      }}
    >
      <span style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--brand-action)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: sub ? 1 : 0 }}>
        {selected && <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--brand-action)' }} />}
      </span>
      <div>
        <div style={{ font: 'var(--text-body)', fontWeight: 600 }}>{label}</div>
        {sub && <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}
