export default function Sheet({ open, onClose, children, zIndex = 60, dim = 0.35 }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex, display: 'flex', alignItems: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${dim})` }} />
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 390,
          margin: '0 auto',
          background: '#fff',
          borderRadius: '16px 16px 0 0',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          maxHeight: '85vh',
          overflowY: 'auto',
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {children}
      </div>
    </div>
  );
}
