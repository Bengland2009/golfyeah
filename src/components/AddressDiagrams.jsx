// Diagrams for the "Adresse & contact" reference sheet — adapted from the
// original reference file's SVG geometry (same shapes/positions, same
// visual logic), recolored to Golfyeah's design tokens instead of a
// separate palette. GOLD/GOLD_DEEP are a small, deliberately isolated
// illustrative accent (the ball marker) — not a UI color, so they're not
// promoted to a design token.
const GOLD = '#B9812A';
const GOLD_DEEP = '#8C6420';
const FONT = 'Inter, -apple-system, sans-serif';
const SERIF = "'Libre Baskerville', Georgia, serif";

function Ball({ cx, cy, r = 9 }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill={GOLD} stroke={GOLD_DEEP} strokeWidth={1.2} />
      <ellipse cx={cx - 1.5} cy={cy - 1.5} rx={3} ry={2} fill="#fff" opacity={0.4} />
    </>
  );
}

export function DriverAddressDiagram() {
  return (
    <svg viewBox="0 0 400 300" role="img" style={{ width: '100%', height: 'auto', display: 'block', color: 'var(--text-body)' }}
      aria-label="Vue de face à l'adresse pour le driver, avec vue du dessus en médaillon : pieds plus larges que les épaules, balle près du talon avant, épaule arrière plus basse, pression 45 pour cent avant et 55 pour cent arrière.">
      <text x="20" y="15" fontFamily={FONT} fontSize="8.5" fill="var(--text-muted)">vue du dessus</text>
      <line x1="20" y1="26" x2="112" y2="26" stroke="currentColor" strokeWidth="1.3" opacity="0.6" strokeDasharray="1 4" />
      <polygon points="112,22 124,26 112,30" fill="currentColor" opacity="0.6" />
      <circle cx="104" cy="26" r="4" fill={GOLD} stroke={GOLD_DEEP} strokeWidth="0.8" />
      <line x1="33" y1="48" x2="105" y2="48" stroke="var(--brand-action)" strokeWidth="1.3" />
      <ellipse cx="42" cy="48" rx="9" ry="4.5" fill="var(--brand-action)" />
      <ellipse cx="96" cy="48" rx="9" ry="4.5" fill="var(--brand-action)" />

      <line x1="100" y1="250" x2="300" y2="250" stroke="var(--brand-action)" strokeWidth="2.5" />
      <ellipse cx="150" cy="250" rx="27" ry="11" fill="var(--brand-action)" />
      <ellipse cx="250" cy="250" rx="27" ry="11" fill="var(--brand-action)" />
      <text x="150" y="271" textAnchor="middle" fontFamily={FONT} fontSize="10.5" fill="var(--text-muted)">arrière</text>
      <text x="250" y="271" textAnchor="middle" fontFamily={FONT} fontSize="10.5" fill="var(--text-muted)">avant</text>

      <line x1="204" y1="225" x2="194" y2="135" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 4" opacity="0.55" />

      <line x1="156" y1="148" x2="232" y2="122" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
      <text x="194" y="106" textAnchor="middle" fontFamily={SERIF} fontSize="10.5" fontWeight="700" fill="currentColor" opacity="0.85">épaules</text>

      <line x1="232" y1="122" x2="222" y2="158" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" opacity="0.55" />
      <line x1="156" y1="148" x2="222" y2="158" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" opacity="0.55" />
      <line x1="222" y1="158" x2="252" y2="239" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" />
      <ellipse cx="248" cy="246" rx="13" ry="7" fill="currentColor" stroke="#fff" strokeWidth="1.5" transform="rotate(-15 248 246)" />
      <circle cx="222" cy="158" r="6.5" fill="currentColor" />

      <Ball cx="260" cy="250" />

      <text x="95" y="282" textAnchor="end" fontFamily={FONT} fontSize="10" fill="var(--text-muted)" opacity="0.85">pression</text>
      <line x1="150" y1="278" x2="250" y2="278" stroke="var(--border-default)" strokeWidth="6" strokeLinecap="round" />
      <circle cx="195" cy="278" r="5.5" fill="currentColor" />
      <text x="150" y="294" textAnchor="middle" fontFamily={FONT} fontSize="9.5" fill="var(--text-muted)">55%</text>
      <text x="250" y="294" textAnchor="middle" fontFamily={FONT} fontSize="9.5" fill="var(--text-muted)">45%</text>
    </svg>
  );
}

export function DriverArcDiagram() {
  return (
    <svg viewBox="0 0 400 190" role="img" style={{ width: '100%', height: 'auto', display: 'block', color: 'var(--text-body)' }}
      aria-label="Vue de côté pour le driver : le point bas de l'arc du swing survient avant la balle, ce qui favorise un contact légèrement remontant.">
      <defs>
        <marker id="arrowArcD" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
        </marker>
      </defs>
      <text x="50" y="30" fontFamily={FONT} fontSize="10.5" fill="currentColor" opacity="0.65">sens du swing</text>
      <line x1="50" y1="42" x2="110" y2="42" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowArcD)" opacity="0.6" />

      <rect x="40" y="132" width="320" height="18" fill="var(--surface-tint)" />
      <line x1="40" y1="132" x2="360" y2="132" stroke="var(--brand-action)" strokeWidth="2.5" />
      <path d="M 72 88 Q 208 186 345 66" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.8" />

      <circle cx="195" cy="132" r="3" fill="currentColor" />
      <text x="195" y="152" textAnchor="middle" fontFamily={FONT} fontSize="10" fill="currentColor" opacity="0.7">point bas</text>

      <line x1="240" y1="132" x2="240" y2="123" stroke={GOLD_DEEP} strokeWidth="2.5" />
      <Ball cx="240" cy="114" />

      <text x="270" y="82" textAnchor="middle" fontFamily={SERIF} fontSize="11.5" fontWeight="700" fill="currentColor">Driver</text>
      <text x="270" y="96" textAnchor="middle" fontFamily={FONT} fontSize="10" fill="currentColor" opacity="0.8">légèrement remontant</text>
    </svg>
  );
}

export function Fer7AddressDiagram() {
  return (
    <svg viewBox="0 0 400 300" role="img" style={{ width: '100%', height: 'auto', display: 'block', color: 'var(--text-body)' }}
      aria-label="Vue de face à l'adresse pour le fer 7, avec vue du dessus en médaillon : pieds largeur d'épaules, balle légèrement devant le centre, épaules carrées, pression 52 pour cent avant et 48 pour cent arrière.">
      <text x="20" y="15" fontFamily={FONT} fontSize="8.5" fill="var(--text-muted)">vue du dessus</text>
      <line x1="20" y1="26" x2="88" y2="26" stroke="currentColor" strokeWidth="1.3" opacity="0.6" strokeDasharray="1 4" />
      <polygon points="88,22 100,26 88,30" fill="currentColor" opacity="0.6" />
      <circle cx="76" cy="26" r="4" fill={GOLD} stroke={GOLD_DEEP} strokeWidth="0.8" />
      <line x1="39" y1="48" x2="103" y2="48" stroke="var(--brand-action)" strokeWidth="1.3" />
      <ellipse cx="48" cy="48" rx="9" ry="4.5" fill="var(--brand-action)" />
      <ellipse cx="94" cy="48" rx="9" ry="4.5" fill="var(--brand-action)" />

      <line x1="100" y1="250" x2="300" y2="250" stroke="var(--brand-action)" strokeWidth="2.5" />
      <ellipse cx="160" cy="250" rx="27" ry="11" fill="var(--brand-action)" />
      <ellipse cx="240" cy="250" rx="27" ry="11" fill="var(--brand-action)" />
      <text x="160" y="271" textAnchor="middle" fontFamily={FONT} fontSize="10.5" fill="var(--text-muted)">arrière</text>
      <text x="240" y="271" textAnchor="middle" fontFamily={FONT} fontSize="10.5" fill="var(--text-muted)">avant</text>

      <line x1="191" y1="225" x2="186" y2="137" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 4" opacity="0.55" />

      <line x1="150" y1="140" x2="222" y2="134" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
      <text x="186" y="108" textAnchor="middle" fontFamily={SERIF} fontSize="10.5" fontWeight="700" fill="currentColor" opacity="0.85">épaules</text>

      <line x1="222" y1="134" x2="203" y2="163" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" opacity="0.55" />
      <line x1="150" y1="140" x2="203" y2="163" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" opacity="0.55" />
      <line x1="203" y1="163" x2="199" y2="241" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" />
      <ellipse cx="195" cy="247" rx="12" ry="6.5" fill="currentColor" stroke="#fff" strokeWidth="1.5" transform="rotate(13 195 247)" />
      <circle cx="203" cy="163" r="6.5" fill="currentColor" />

      <Ball cx="207" cy="250" />

      <text x="95" y="282" textAnchor="end" fontFamily={FONT} fontSize="10" fill="var(--text-muted)" opacity="0.85">pression</text>
      <line x1="160" y1="278" x2="240" y2="278" stroke="var(--border-default)" strokeWidth="6" strokeLinecap="round" />
      <circle cx="202" cy="278" r="5.5" fill="currentColor" />
      <text x="160" y="294" textAnchor="middle" fontFamily={FONT} fontSize="9.5" fill="var(--text-muted)">48%</text>
      <text x="240" y="294" textAnchor="middle" fontFamily={FONT} fontSize="9.5" fill="var(--text-muted)">52%</text>
    </svg>
  );
}

export function Fer7ArcDiagram() {
  return (
    <svg viewBox="0 0 400 190" role="img" style={{ width: '100%', height: 'auto', display: 'block', color: 'var(--text-body)' }}
      aria-label="Vue de côté pour le fer 7 : le point bas de l'arc du swing survient après la balle, produisant un contact descendant suivi d'un divot.">
      <defs>
        <marker id="arrowArcF" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
        </marker>
      </defs>
      <text x="50" y="30" fontFamily={FONT} fontSize="10.5" fill="currentColor" opacity="0.65">sens du swing</text>
      <line x1="50" y1="42" x2="110" y2="42" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowArcF)" opacity="0.6" />

      <rect x="40" y="132" width="320" height="18" fill="var(--surface-tint)" />
      <line x1="40" y1="132" x2="360" y2="132" stroke="var(--brand-action)" strokeWidth="2.5" />
      <ellipse cx="225" cy="133" rx="20" ry="3.5" fill="currentColor" opacity="0.16" />
      <path d="M 78 78 Q 212 176 345 96" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.8" />

      <circle cx="225" cy="132" r="3" fill="currentColor" />
      <text x="225" y="153" textAnchor="middle" fontFamily={FONT} fontSize="10" fill="currentColor" opacity="0.7">point bas</text>

      <Ball cx="175" cy="123" />

      <line x1="155" y1="103" x2="172" y2="118" stroke="currentColor" strokeWidth="1.6" markerEnd="url(#arrowArcF)" opacity="0.8" />

      <text x="150" y="92" textAnchor="middle" fontFamily={SERIF} fontSize="11.5" fontWeight="700" fill="currentColor">Fer 7</text>
      <text x="150" y="106" textAnchor="middle" fontFamily={FONT} fontSize="10" fill="currentColor" opacity="0.8">descendant</text>
    </svg>
  );
}

export const DIAGRAMS = {
  driver: { adresse: DriverAddressDiagram, arc: DriverArcDiagram },
  fer7: { adresse: Fer7AddressDiagram, arc: Fer7ArcDiagram },
};

export function diagramFor(club, tab) {
  return DIAGRAMS[club]?.[tab] || null;
}
