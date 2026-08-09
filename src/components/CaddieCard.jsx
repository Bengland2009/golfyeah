import Card from './Card';

// Shared shape for every card on the Caddie page — title (+ optional
// subtitle/icon) followed by whatever content the card needs. New Caddie
// cards (Conseils rapides, Rappels des règles, Conversions…) just wrap
// their content in this, no page-level redesign required.
export default function CaddieCard({ title, subtitle, Icon, children }) {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: subtitle ? 2 : 18 }}>
        {Icon && <Icon width={18} height={18} strokeWidth={1.75} style={{ color: 'var(--brand-action)', flexShrink: 0 }} />}
        <div style={{ font: 'var(--text-h3)', fontSize: 19 }}>{title}</div>
      </div>
      {subtitle && <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', marginBottom: 18 }}>{subtitle}</div>}
      {children}
    </Card>
  );
}
