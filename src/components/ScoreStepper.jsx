export default function ScoreStepper({ value = 0, onChange, size = 'large', label }) {
  const isLarge = size === 'large';
  const btn = isLarge ? 56 : 40;
  const font = isLarge ? 36 : 22;
  const btnStyle = {
    width: btn,
    height: btn,
    minWidth: btn,
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)',
    background: '#fff',
    fontSize: 20,
    fontWeight: 600,
    color: 'var(--color-green-action)',
    cursor: 'pointer',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontFamily: 'var(--font-sans)' }}>
      {label && <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{label}</span>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button type="button" style={btnStyle} onClick={() => onChange && onChange(Math.max(0, value - 1))}>−</button>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: font,
            minWidth: isLarge ? 56 : 32,
            textAlign: 'center',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </span>
        <button type="button" style={btnStyle} onClick={() => onChange && onChange(value + 1)}>+</button>
      </div>
    </div>
  );
}
