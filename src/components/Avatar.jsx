export default function Avatar({ src, name, size = 48 }) {
  const initials = (name || '').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'var(--color-green-primary)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        fontSize: size * 0.35,
      }}
    >
      {initials}
    </div>
  );
}
