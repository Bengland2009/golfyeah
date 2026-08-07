export default function Input({ label, helper, ...rest }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-sans)' }}>
      {label && <label style={{ font: 'var(--text-label)', color: 'var(--color-text-primary)' }}>{label}</label>}
      <input
        {...rest}
        style={{
          height: 50,
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '0 14px',
          font: 'var(--text-body)',
          outline: 'none',
        }}
        onFocus={(e) => { e.target.style.borderColor = 'var(--color-green-action)'; }}
        onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; }}
      />
      {helper && <span style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{helper}</span>}
    </div>
  );
}
