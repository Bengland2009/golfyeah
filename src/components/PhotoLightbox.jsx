import { useEffect, useRef, useState } from 'react';

// Full-screen photo viewer with swipe-between support, opened by tapping a
// thumbnail on the feedback detail screen. Deliberately minimal — no zoom,
// no captions — bugs are easier to understand with a bigger picture, not a
// bigger UI.
//
// Structured like Sheet.jsx (fixed wrapper + a separate absolute dim layer,
// content on top) rather than a single fixed+flex+background div — that
// combination silently fails to paint its background in some browsers.
export default function PhotoLightbox({ photos, index, onClose }) {
  const [current, setCurrent] = useState(index);
  const touchStartX = useRef(null);

  useEffect(() => setCurrent(index), [index]);

  if (current == null || !photos?.length) return null;

  const go = (delta) => setCurrent((c) => Math.min(Math.max(c + delta, 0), photos.length - 1));

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  const navBtnStyle = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    width: 40, height: 40, borderRadius: '50%', border: 'none',
    background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 20, cursor: 'pointer',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.92)' }} />

      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 16, paddingTop: 'calc(16px + var(--safe-top))' }}>
          <button onClick={onClose} aria-label="Fermer" style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 20, lineHeight: 1, cursor: 'pointer' }}>
            ×
          </button>
        </div>

        <div
          onClick={(e) => e.stopPropagation()}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '0 12px' }}
        >
          {photos.length > 1 && current > 0 && (
            <button aria-label="Précédente" onClick={() => go(-1)} style={{ ...navBtnStyle, left: 8 }}>‹</button>
          )}
          <img src={photos[current]} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8 }} />
          {photos.length > 1 && current < photos.length - 1 && (
            <button aria-label="Suivante" onClick={() => go(1)} style={{ ...navBtnStyle, right: 8 }}>›</button>
          )}
        </div>

        {photos.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '12px 0 calc(20px + var(--safe-bottom))' }}>
            {photos.map((_, i) => (
              <span
                key={i}
                style={{
                  width: i === current ? 18 : 6, height: 6, borderRadius: 999,
                  background: i === current ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'width 0.15s',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
