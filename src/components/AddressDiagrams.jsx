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

// A sneaker seen from above (top-view stance diagrams) — rounded toe box,
// narrower heel, with a two-tone toe cap and heel counter so it reads as
// an actual shoe rather than a plain oval. `angle` is applied around the
// shoe's own pivot. At angle 0 the toe points straight toward the target
// line (the golfer's own forward-facing direction) and the heel points
// away from it — see the "vue du dessus" blocks below.
function Shoe({ cx, cy, angle }) {
  return (
    <g transform={`translate(${cx},${cy}) rotate(${angle})`}>
      <path
        d="M 0,15 C 3.2,15 4.2,11.5 4,7 C 3.8,3 6,-1.5 6.8,-6.5 C 7.4,-10.5 5.5,-15.5 0,-17 C -5.5,-15.5 -7.4,-10.5 -6.8,-6.5 C -6,-1.5 -3.8,3 -4,7 C -4.2,11.5 -3.2,15 0,15 Z"
        fill="var(--brand-action)"
      />
      <ellipse cx="0" cy="-11.5" rx="4.6" ry="4.3" fill="var(--brand-primary)" />
      <ellipse cx="0" cy="11.5" rx="3.4" ry="3.6" fill="var(--brand-primary)" />
    </g>
  );
}

// Single, unified "vue arrière surélevée" — as if the golfer is looking down
// at their own stance from just behind and above. Two distinct axes only:
// lateral (avant/arrière feet, left-right) and depth (ball ahead of the toe
// line). A dashed line projects the ball straight down onto the toe line to
// show lateral alignment only — never a physical ball-to-foot distance.
// Replaces the old face-view figure (shoulders/club/pressure): that
// information already lives as text in the info-cards below the diagram.
function TopView({ frontX, backX, ballX, arcFront, arcBack, ariaLabel }) {
  const pivotY = 100;
  const toeLineY = pivotY - 17;
  const heelY = pivotY + 15;
  const ballY = 55;
  const toeLineX1 = frontX - 35;
  const toeLineX2 = backX + 35;

  return (
    <svg viewBox="0 0 400 175" role="img" style={{ width: '100%', height: 'auto', display: 'block', color: 'var(--text-body)' }}
      aria-label={ariaLabel}>
      <text x={(backX + 10 + frontX - 30) / 2} y="18" textAnchor="middle" fontFamily={FONT} fontSize="8.5" fill="var(--text-muted)">cible à gauche</text>
      <line x1={backX + 10} y1="28" x2={frontX - 30} y2="28" stroke="currentColor" strokeWidth="1.3" opacity="0.55" strokeDasharray="1 4" />
      <polygon points={`${frontX - 30},24 ${frontX - 30},32 ${frontX - 37},28`} fill="currentColor" opacity="0.55" />

      <Ball cx={ballX} cy={ballY} r={6} />
      <line x1={ballX} y1={ballY + 8} x2={ballX} y2={toeLineY} stroke="var(--text-muted)" strokeWidth="1.2" strokeDasharray="1 3" opacity="0.6" />
      <circle cx={ballX} cy={toeLineY} r="2.5" fill="var(--brand-action)" />

      <line x1={toeLineX1} y1={toeLineY} x2={toeLineX2} y2={toeLineY} stroke="var(--brand-action)" strokeWidth="1.2" strokeDasharray="2 3" opacity="0.55" />
      <text x={toeLineX2 + 6} y={toeLineY + 3} textAnchor="start" fontFamily={FONT} fontSize="7" fill="var(--text-muted)" opacity="0.75">ligne des orteils</text>

      <Shoe cx={frontX} cy={pivotY} angle={-25} />
      <path d={`M ${frontX} ${pivotY - 15} A 15 15 0 0 0 ${arcFront.x} ${arcFront.y}`} fill="none" stroke="var(--text-muted)" strokeWidth="1.4" opacity="0.75" />
      <text x={frontX} y={heelY + 14} textAnchor="middle" fontFamily={FONT} fontSize="8" fontWeight="600" fill="var(--text-body)">avant</text>
      <text x={frontX} y={heelY + 27} textAnchor="middle" fontFamily={FONT} fontSize="7.5" fill="var(--text-muted)">25°</text>

      <Shoe cx={backX} cy={pivotY} angle={10} />
      <path d={`M ${backX} ${pivotY - 15} A 15 15 0 0 1 ${arcBack.x} ${arcBack.y}`} fill="none" stroke="var(--text-muted)" strokeWidth="1.4" opacity="0.75" />
      <text x={backX} y={heelY + 14} textAnchor="middle" fontFamily={FONT} fontSize="8" fontWeight="600" fill="var(--text-body)">arrière</text>
      <text x={backX} y={heelY + 27} textAnchor="middle" fontFamily={FONT} fontSize="7.5" fill="var(--text-muted)">10°</text>

      <text x={(frontX + backX) / 2} y={heelY + 38} textAnchor="middle" fontFamily={FONT} fontSize="6.5" fill="var(--text-muted)" opacity="0.65">repère de départ — alignement, pas une distance</text>
    </svg>
  );
}

export function DriverAddressDiagram() {
  return (
    <TopView
      frontX={150}
      backX={250}
      ballX={175}
      arcFront={{ x: 143.66, y: 86.41 }}
      arcBack={{ x: 252.6, y: 85.23 }}
      ariaLabel="Vue arrière surélevée du stance pour le driver : pied avant à gauche, pied arrière à droite, cible à gauche, balle projetée à l'intérieur du talon avant par rapport à la ligne des orteils."
    />
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
      <text x="195" y="152" textAnchor="middle" fontFamily={FONT} fontSize="11.5" fontWeight="600" fill="currentColor" opacity="0.85">point bas</text>

      <line x1="240" y1="132" x2="240" y2="123" stroke={GOLD_DEEP} strokeWidth="2.5" />
      <Ball cx="240" cy="114" />

      <text x="270" y="82" textAnchor="middle" fontFamily={SERIF} fontSize="13" fontWeight="700" fill="currentColor">Driver</text>
      <text x="270" y="96" textAnchor="middle" fontFamily={FONT} fontSize="11.5" fontWeight="600" fill="currentColor" opacity="0.85">légèrement remontant</text>
    </svg>
  );
}

export function Fer7AddressDiagram() {
  return (
    <TopView
      frontX={165}
      backX={235}
      ballX={192}
      arcFront={{ x: 158.66, y: 86.41 }}
      arcBack={{ x: 237.6, y: 85.23 }}
      ariaLabel="Vue arrière surélevée du stance pour le fer 7 : pied avant à gauche, pied arrière à droite, cible à gauche, balle projetée légèrement devant le centre par rapport à la ligne des orteils."
    />
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
      <text x="225" y="153" textAnchor="middle" fontFamily={FONT} fontSize="11.5" fontWeight="600" fill="currentColor" opacity="0.85">point bas</text>

      <Ball cx="175" cy="123" />

      <line x1="155" y1="103" x2="172" y2="118" stroke="currentColor" strokeWidth="1.6" markerEnd="url(#arrowArcF)" opacity="0.8" />

      <text x="150" y="92" textAnchor="middle" fontFamily={SERIF} fontSize="13" fontWeight="700" fill="currentColor">Fer 7</text>
      <text x="150" y="106" textAnchor="middle" fontFamily={FONT} fontSize="11.5" fontWeight="600" fill="currentColor" opacity="0.85">descendant</text>
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
