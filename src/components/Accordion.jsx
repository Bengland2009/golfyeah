import { useState } from 'react';
import Card from './Card';
import { ChevronDownIcon } from './icons';

// A single collapsible section — the plan's "sections repliables" building
// block. Starts closed by default so a session screen reads as a short list
// of headers, not a wall of instructions, until the golfer taps into the
// block they're on.
export default function Accordion({ title, subtitle, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card style={{ padding: 0 }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 16px', cursor: 'pointer' }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ font: 'var(--text-label)', fontSize: 15 }}>{title}</div>
          {subtitle && <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginTop: 1 }}>{subtitle}</div>}
        </div>
        <ChevronDownIcon
          width={18} height={18} strokeWidth={2}
          style={{ color: 'var(--text-muted)', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
        />
      </div>
      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border-default)', marginTop: -1, paddingTop: 12 }}>
          {children}
        </div>
      )}
    </Card>
  );
}
