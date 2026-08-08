import { useState } from 'react';
import AppMenu from './AppMenu';

function HamburgerBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Menu"
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4, width: 22 }}
    >
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ display: 'block', height: 2, width: '100%', background: '#fff', borderRadius: 1 }} />
      ))}
    </button>
  );
}

export default function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div>
      <div style={{ background: 'var(--brand-primary)', paddingTop: 'var(--safe-top)' }}>
        <div
          style={{
            height: 62, display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', padding: '0 var(--page-padding-mobile)',
          }}
        >
          <HamburgerBtn onClick={() => setMenuOpen(true)} />
          <img src="/assets/icon-gy-cropped.png" alt="Golfyeah!" style={{ height: 38, objectFit: 'contain' }} />
        </div>
      </div>
      <AppMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
