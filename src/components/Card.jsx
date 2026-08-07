export default function Card({ children, tint = false, elevated = false, style, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: tint ? 'var(--surface-tint)' : '#fff',
        border: tint ? 'none' : '1px solid var(--color-border)',
        borderRadius: 'var(--radius-card)',
        padding: 16,
        boxShadow: elevated ? 'var(--shadow-elevated)' : 'none',
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
