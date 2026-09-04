import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import Sheet from '../components/Sheet';

// A standalone "mode=standalone" counterpart to GolfTracker's "mode=round"
// live-round score entry: same big-number/big-button visual language (see
// GolfTracker.jsx), but a fully separate component rather than a mode prop
// on GolfTracker itself. GolfTracker is deeply wired to liveRound/playerId/
// holeIndex and a multi-sheet finish-hole flow (putts, mulligans, lost
// balls, beers) — threading a "standalone" branch through all of that would
// meaningfully raise the risk of regressing the real round tracker for a
// screen that must, by spec, never touch a round, a player, a hole or a
// stat. A local-state-only component satisfies every "must not" in the
// brief by construction: it never imports or calls anything from
// DataContext, so there is nothing here that could save a round, a score,
// or a stat even by accident.
function vibrate(ms) {
  if (navigator.vibrate) {
    try { navigator.vibrate(ms); } catch {}
  }
}

export default function StandaloneShotCounter() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [pressed, setPressed] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const addStroke = () => {
    vibrate(12);
    setPressed(true);
    setTimeout(() => setPressed(false), 120);
    setCount((c) => c + 1);
  };

  const undo = () => {
    if (count <= 0) return;
    vibrate(8);
    setCount((c) => Math.max(0, c - 1));
  };

  const askReset = () => {
    if (count > 0) setConfirmOpen(true);
    else setCount(0);
  };

  const confirmReset = () => {
    setCount(0);
    setConfirmOpen(false);
  };

  return (
    <div className="gy-viewport-h" style={{ display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <Header title="Compteur de coups" onBack={() => navigate('/pratique')} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px var(--page-padding-mobile)' }}>
        <div style={{ font: 'var(--font-sans)', fontWeight: 800, fontSize: 128, lineHeight: 1, color: 'var(--text-body)', fontVariantNumeric: 'tabular-nums' }}>
          {count}
        </div>
        <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 4 }}>
          {count === 1 ? 'coup' : 'coups'}
        </div>

        <button
          onClick={addStroke}
          aria-label="+1 coup"
          style={{
            width: 208,
            height: 208,
            marginTop: 40,
            borderRadius: '50%',
            border: 'none',
            background: 'var(--brand-action)',
            boxShadow: pressed ? '0 4px 14px rgba(0,82,57,0.25)' : '0 14px 30px rgba(0,82,57,0.28)',
            cursor: 'pointer',
            transform: pressed ? 'scale(0.95)' : 'scale(1)',
            transition: 'transform 110ms ease, box-shadow 110ms ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          <span style={{ font: 'var(--font-sans)', fontWeight: 700, fontSize: 19, color: '#fff' }}>+1 coup</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 var(--page-padding-mobile) calc(24px + var(--safe-bottom))' }}>
        <Button variant="secondary" onClick={undo} disabled={count === 0} style={{ height: 52, width: '100%' }}>
          Annuler le dernier coup
        </Button>
        <Button variant="secondary" onClick={askReset} style={{ height: 52, width: '100%' }}>
          Remettre à zéro
        </Button>
      </div>

      <Sheet open={confirmOpen} onClose={() => setConfirmOpen(false)} ariaLabel="Remettre le compteur à zéro ?">
        <div style={{ font: 'var(--text-h3)' }}>Remettre le compteur à zéro?</div>
        <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)' }}>
          Cette action effacera le compteur actuel.
        </div>
        <Button variant="secondary" onClick={() => setConfirmOpen(false)} style={{ height: 52, width: '100%' }}>
          Annuler
        </Button>
        <Button variant="primary" onClick={confirmReset} style={{ height: 52, width: '100%' }}>
          Remettre à zéro
        </Button>
      </Sheet>
    </div>
  );
}
