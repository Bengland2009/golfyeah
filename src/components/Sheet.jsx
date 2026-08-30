import { useEffect, useRef } from 'react';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// Keyboard/focus behavior lives here so every Sheet consumer gets it for
// free: Escape closes, Tab/Shift+Tab is trapped inside while open, the
// panel receives focus on open, and focus returns to whatever triggered
// it (typically the button that opened the sheet) once it closes.
export default function Sheet({ open, onClose, children, zIndex = 60, dim = 0.35, ariaLabel }) {
  const panelRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    previouslyFocused.current = document.activeElement;
    const raf = requestAnimationFrame(() => {
      const first = panelRef.current?.querySelector(FOCUSABLE);
      (first || panelRef.current)?.focus();
    });
    return () => {
      cancelAnimationFrame(raf);
      if (previouslyFocused.current && document.contains(previouslyFocused.current)) {
        previouslyFocused.current.focus();
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const focusables = panelRef.current ? [...panelRef.current.querySelectorAll(FOCUSABLE)] : [];
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex, display: 'flex', alignItems: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${dim})` }} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        className="gy-phone-col"
        style={{
          position: 'relative',
          background: '#fff',
          borderRadius: '16px 16px 0 0',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          maxHeight: '85vh',
          overflowY: 'auto',
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
          outline: 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
}
