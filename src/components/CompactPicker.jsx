export default function CompactPicker({ value, sublabel, placeholder, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer', padding: '12px 14px', border: '1px solid var(--border-default)',
        borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ font: 'var(--text-body)', fontWeight: 600, color: value ? 'var(--text-body)' : 'var(--text-muted)' }}>
          {value || placeholder}
        </div>
        {sublabel && <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{sublabel}</div>}
      </div>
      <span style={{ color: 'var(--text-muted)', fontSize: 13, flexShrink: 0 }}>▾</span>
    </div>
  );
}
