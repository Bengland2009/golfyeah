const BASE = {
  fontFamily: 'var(--font-sans)',
  fontSize: 16,
  fontWeight: 600,
  height: 52,
  padding: '0 20px',
  borderRadius: 'var(--radius-button)',
  border: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  minWidth: 44,
};

function variantStyle(variant, disabled) {
  if (variant === 'secondary') {
    return {
      background: '#fff',
      color: disabled ? 'var(--color-disabled-text)' : 'var(--color-green-primary)',
      border: '1px solid ' + (disabled ? 'var(--color-disabled-bg)' : 'var(--color-green-primary)'),
    };
  }
  if (variant === 'tertiary') {
    return { background: 'transparent', color: disabled ? 'var(--color-disabled-text)' : 'var(--color-green-action)' };
  }
  return {
    background: disabled ? 'var(--color-disabled-bg)' : 'var(--color-green-action)',
    color: disabled ? 'var(--color-disabled-text)' : '#fff',
  };
}

export default function Button({ variant = 'primary', disabled = false, children, onClick, style, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        ...BASE,
        ...variantStyle(variant, disabled),
        cursor: disabled ? 'default' : 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
