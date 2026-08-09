export default function Input({ label, helper, error, onFocus, onBlur, ...rest }) {
  const restingColor = error ? 'var(--color-score-under)' : 'var(--color-border)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-sans)' }}>
      {label && <label style={{ font: 'var(--text-label)', color: 'var(--color-text-primary)' }}>{label}</label>}
      <input
        {...rest}
        style={{
          height: 50,
          border: `1px solid ${restingColor}`,
          borderRadius: 'var(--radius-sm)',
          padding: '0 14px',
          font: 'var(--text-body)',
          outline: 'none',
        }}
        onFocus={(e) => { e.target.style.borderColor = error ? 'var(--color-score-under)' : 'var(--color-green-action)'; onFocus?.(e); }}
        onBlur={(e) => { e.target.style.borderColor = restingColor; onBlur?.(e); }}
      />
      {error ? (
        <span style={{ font: 'var(--text-small)', color: 'var(--color-score-under)' }}>{error}</span>
      ) : helper ? (
        <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{helper}</span>
      ) : null}
    </div>
  );
}
