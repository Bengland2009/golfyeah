export default function RadioRow({ selected, label, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: 14, cursor: 'pointer',
        borderRadius: 'var(--radius-card)', border: selected ? '2px solid var(--brand-action)' : '1px solid var(--border-default)',
      }}
    >
      <span style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--brand-action)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {selected && <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--brand-action)' }} />}
      </span>
      <span style={{ font: 'var(--text-body)', fontWeight: 600 }}>{label}</span>
    </div>
  );
}
