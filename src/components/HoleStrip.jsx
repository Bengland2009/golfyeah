import { useEffect, useRef } from 'react';
import { parLabel, scoreColor } from '../lib/scoring';

// A compact, always-visible "where am I in the round" strip. Each hole is
// one of three states, deliberately rendered with very different visual
// weight so the eye never has to work to find the current hole:
//   - current: filled pill, a dot instead of a score (strokes aren't final
//     until the hole is completed, so showing a live diff here would be
//     misleading mid-hole)
//   - played: quiet vs-par text, no background — same color convention
//     used everywhere else in the app (scoreColor)
//   - upcoming: a muted dash, minimal weight
// Tapping any hole jumps straight to it via onSelect.
export default function HoleStrip({ format, currentIndex, getDiff, onSelect }) {
  const activeRef = useRef(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [currentIndex]);

  return (
    <div
      style={{
        display: 'flex', gap: 4, overflowX: 'auto',
        padding: '10px var(--page-padding-mobile)',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {Array.from({ length: format }, (_, idx) => {
        const isCurrent = idx === currentIndex;
        const diff = isCurrent ? null : getDiff(idx);
        const label = isCurrent ? '●' : (diff == null ? '—' : parLabel(diff));
        const scoreCol = isCurrent ? 'rgba(255,255,255,0.95)' : (diff == null ? 'var(--text-disabled)' : scoreColor(diff));
        return (
          <button
            key={idx}
            ref={isCurrent ? activeRef : null}
            type="button"
            onClick={() => onSelect(idx)}
            style={{
              flex: '0 0 auto', width: 36, height: 46,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
              borderRadius: 10, border: 'none', cursor: 'pointer',
              background: isCurrent ? 'var(--brand-action)' : 'transparent',
            }}
          >
            <span style={{ font: 'var(--text-small)', fontSize: 11, lineHeight: 1, color: isCurrent ? 'rgba(255,255,255,0.7)' : 'var(--text-disabled)' }}>
              {idx + 1}
            </span>
            <span style={{ font: 'var(--text-label)', fontSize: 13, fontWeight: 700, lineHeight: 1, color: scoreCol }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
