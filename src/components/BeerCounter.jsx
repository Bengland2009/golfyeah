export default function BeerCounter({ value = 0, onAdd, onRemove }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 16 }}>🍺</span> Bières
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ font: 'var(--text-label)' }}>{value}</span>
        {value > 0 && (
          <button
            type="button"
            onClick={onRemove}
            style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #E8D49A', background: '#FBF3DF', color: '#8A6D1F', fontSize: 16, cursor: 'pointer' }}
          >
            −
          </button>
        )}
        <button
          type="button"
          onClick={onAdd}
          style={{ height: 32, padding: '0 12px', borderRadius: 999, border: 'none', background: '#C79A3E', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
        >
          +1
        </button>
      </div>
    </div>
  );
}
