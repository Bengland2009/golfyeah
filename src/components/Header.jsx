export default function Header({ title, onBack, action }) {
  return (
    <header
      style={{
        height: 60,
        background: 'var(--color-green-primary)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        fontFamily: 'var(--font-sans)',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Retour"
            style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: '#fff', fontSize: 22, lineHeight: 1 }}
          >
            ‹
          </button>
        )}
        <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 20 }}>{title}</span>
      </div>
      {action}
    </header>
  );
}
