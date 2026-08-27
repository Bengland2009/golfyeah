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

// `flat` drops the glossy highlight for the more compact, sober top-view
// diagrams — the side-view Arc diagrams keep the original glossier ball.
function Ball({ cx, cy, r = 9, flat = false }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill={GOLD} stroke={GOLD_DEEP} strokeWidth={1.2} />
      {!flat && <ellipse cx={cx - 1.5} cy={cy - 1.5} rx={3} ry={2} fill="#fff" opacity={0.4} />}
    </>
  );
}

// A small, flat clubhead silhouette sitting just right of the ball (target
// is left) — rounded/bulbous for the Driver, a thinner blade for the Fer 7,
// so the two clubs read differently without any shaft, arms or body. Each
// gets a small two-tone "face" accent on its ball-facing edge, echoing the
// shoe icon's two-tone language, so it reads as a clubhead rather than a
// second, darker ball.
function ClubHead({ cx, cy, club }) {
  if (club === 'driver') {
    return (
      <g transform={`rotate(-10 ${cx} ${cy})`}>
        <ellipse cx={cx} cy={cy} rx="7" ry="4.3" fill="currentColor" />
        <ellipse cx={cx - 3.3} cy={cy} rx="2.3" ry="3.4" fill="var(--brand-primary)" opacity="0.9" />
      </g>
    );
  }
  if (club === 'bois') {
    return (
      <g transform={`rotate(-10 ${cx} ${cy})`}>
        <ellipse cx={cx} cy={cy} rx="6.2" ry="4.1" fill="currentColor" />
        <ellipse cx={cx - 2.9} cy={cy} rx="2" ry="3.1" fill="var(--brand-primary)" opacity="0.9" />
      </g>
    );
  }
  if (club === 'hybride') {
    return (
      <g transform={`rotate(-9 ${cx} ${cy})`}>
        <ellipse cx={cx} cy={cy} rx="5.2" ry="4.3" fill="currentColor" />
        <ellipse cx={cx - 2.4} cy={cy} rx="1.8" ry="2.9" fill="var(--brand-primary)" opacity="0.9" />
      </g>
    );
  }
  return (
    <g transform={`rotate(-8 ${cx} ${cy})`}>
      <rect x={cx - 5.5} y={cy - 2.1} width="11" height="4.2" rx="2" fill="currentColor" />
      <rect x={cx - 5.5} y={cy - 2.1} width="2.6" height="4.2" rx="1.3" fill="var(--brand-primary)" opacity="0.9" />
    </g>
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

// Single, unified "vue du joueur vers le sol, légèrement surélevée" — as if
// looking down and slightly forward at one's own stance. Ball and clubhead
// sit well above the feet with a clear gap; a fixed-width alignment ruler
// below the feet (talon avant / centre) acts like a measuring line, and a
// dashed plumb line drops from the ball straight onto it, showing where the
// ball sits laterally in the stance — never a physical distance. Both clubs
// share the same viewBox and ruler/arrow span, so the ruler reads as a
// constant backdrop: only the stance width and ball position move on it,
// which is what makes Driver's wider stance and more-forward ball legible
// against Fer 7's narrower one. Replaces the old face-view figure
// (shoulders/club-shaft/pressure): that already lives as text below.
//
// `zoneX1`/`zoneX2`/`zoneLabel` are optional — when set (Bois, Hybride),
// a short gold band is drawn around the ball and reproduced on the ruler
// to show an acceptable range, while the solid ball and the green ruler
// dot still mark the single recommended point within it. Driver/Fer 7
// don't pass these, so their diagrams are unaffected.
function TopView({ frontX, backX, ballX, talonAvantX, arcFront, arcBack, club, zoneX1, zoneX2, zoneLabel, ariaLabel }) {
  const centreX = 100;
  const pivotY = 100;
  const heelY = pivotY + 15;
  const ballY = 44;
  const ballR = 6.5;
  const clubheadCx = ballX + 17;
  const rulerY = 158;
  const hasZone = zoneX1 != null && zoneX2 != null;

  return (
    <svg viewBox="0 0 200 180" role="img" style={{ width: '100%', height: 'auto', display: 'block', color: 'var(--text-body)' }}
      aria-label={ariaLabel}>
      <text x={centreX} y="8" textAnchor="middle" fontFamily={FONT} fontSize="9" fill="var(--text-muted)">cible à gauche</text>
      <line x1="170" y1="18" x2="30" y2="18" stroke="currentColor" strokeWidth="1.4" opacity="0.55" strokeDasharray="1 4" />
      <polygon points="37,14 37,22 30,18" fill="currentColor" opacity="0.55" />

      {hasZone && (
        <>
          <rect x={zoneX1} y={ballY - 2.5} width={zoneX2 - zoneX1} height="5" rx="2.5" fill={GOLD} opacity="0.3" />
          <text x={(zoneX1 + zoneX2) / 2} y="29" textAnchor="middle" fontFamily={FONT} fontSize="7.5" fontWeight="600" fill={GOLD_DEEP}>{zoneLabel}</text>
        </>
      )}
      <Ball cx={ballX} cy={ballY} r={ballR} flat />
      <ClubHead cx={clubheadCx} cy={ballY} club={club} />
      <line x1={ballX} y1={ballY + ballR + 4} x2={ballX} y2={rulerY} stroke="var(--text-muted)" strokeWidth="1.3" strokeDasharray="1 3" opacity="0.6" />

      <Shoe cx={frontX} cy={pivotY} angle={-25} />
      <path d={`M ${frontX} ${pivotY - 15} A 15 15 0 0 0 ${arcFront.x} ${arcFront.y}`} fill="none" stroke="var(--text-muted)" strokeWidth="1.4" opacity="0.75" />
      <text x={frontX} y={heelY + 14} textAnchor="middle" fontFamily={FONT} fontSize="10" fontWeight="600" fill="var(--text-body)">avant</text>
      <text x={frontX} y={heelY + 27} textAnchor="middle" fontFamily={FONT} fontSize="8.5" fill="var(--text-muted)">25°</text>

      <Shoe cx={backX} cy={pivotY} angle={10} />
      <path d={`M ${backX} ${pivotY - 15} A 15 15 0 0 1 ${arcBack.x} ${arcBack.y}`} fill="none" stroke="var(--text-muted)" strokeWidth="1.4" opacity="0.75" />
      <text x={backX} y={heelY + 14} textAnchor="middle" fontFamily={FONT} fontSize="10" fontWeight="600" fill="var(--text-body)">arrière</text>
      <text x={backX} y={heelY + 27} textAnchor="middle" fontFamily={FONT} fontSize="8.5" fill="var(--text-muted)">10°</text>

      <line x1="15" y1={rulerY} x2="185" y2={rulerY} stroke="var(--border-default)" strokeWidth="1.3" />
      {hasZone && (
        <line x1={zoneX1} y1={rulerY} x2={zoneX2} y2={rulerY} stroke={GOLD} strokeWidth="4" strokeLinecap="round" opacity="0.55" />
      )}
      <line x1={talonAvantX} y1={rulerY - 4} x2={talonAvantX} y2={rulerY + 4} stroke="var(--text-muted)" strokeWidth="1.3" />
      <line x1={centreX} y1={rulerY - 4} x2={centreX} y2={rulerY + 4} stroke="var(--text-muted)" strokeWidth="1.3" />
      <circle cx={ballX} cy={rulerY} r="3" fill="var(--brand-action)" />
      <text x={talonAvantX} y={rulerY + 13} textAnchor="middle" fontFamily={FONT} fontSize="8" fill="var(--text-muted)">talon</text>
      <text x={centreX} y={rulerY + 13} textAnchor="middle" fontFamily={FONT} fontSize="8" fill="var(--text-muted)">centre</text>
    </svg>
  );
}

export function DriverAddressDiagram() {
  return (
    <TopView
      frontX={35}
      backX={165}
      ballX={49}
      talonAvantX={49}
      arcFront={{ x: 28.66, y: 86.41 }}
      arcBack={{ x: 167.6, y: 85.23 }}
      club="driver"
      ariaLabel="Vue du joueur vers le sol pour le driver : stance large, pied avant à gauche, pied arrière à droite, cible à gauche, tête de bâton derrière la balle. La balle, bien au-dessus des pieds, s'aligne exactement avec l'intérieur du talon avant sur le repère au sol."
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
      frontX={57.5}
      backX={142.5}
      ballX={92}
      talonAvantX={69.5}
      arcFront={{ x: 51.16, y: 86.41 }}
      arcBack={{ x: 145.1, y: 85.23 }}
      club="fer7"
      ariaLabel="Vue du joueur vers le sol pour le fer 7 : stance largeur d'épaules, pied avant à gauche, pied arrière à droite, cible à gauche, tête de bâton derrière la balle. La balle, bien au-dessus des pieds, s'aligne légèrement à gauche du centre, vers la cible, sur le repère au sol."
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

export function BoisAddressDiagram() {
  return (
    <TopView
      frontX={50}
      backX={150}
      ballX={70}
      talonAvantX={64}
      zoneX1={64}
      zoneX2={80}
      zoneLabel="zone avancée"
      arcFront={{ x: 43.66, y: 86.41 }}
      arcBack={{ x: 152.6, y: 85.23 }}
      club="bois"
      ariaLabel="Vue du joueur vers le sol pour le bois : stance légèrement plus large que les épaules, pied avant à gauche, pied arrière à droite, cible à gauche, tête de bois derrière la balle. La balle se joue dans une courte zone avancée, à l'intérieur du talon avant."
    />
  );
}

export function HybrideAddressDiagram() {
  return (
    <TopView
      frontX={57.5}
      backX={142.5}
      ballX={94}
      talonAvantX={71.5}
      zoneX1={90}
      zoneX2={98}
      zoneLabel="zone hybride"
      arcFront={{ x: 51.16, y: 86.41 }}
      arcBack={{ x: 145.1, y: 85.23 }}
      club="hybride"
      ariaLabel="Vue du joueur vers le sol pour l'hybride : stance environ largeur d'épaules, pied avant à gauche, pied arrière à droite, cible à gauche, tête d'hybride derrière la balle. La balle se joue dans une courte zone légèrement devant le centre."
    />
  );
}

export const DIAGRAMS = {
  driver: { adresse: DriverAddressDiagram, arc: DriverArcDiagram },
  fer7: { adresse: Fer7AddressDiagram, arc: Fer7ArcDiagram },
  bois: { adresse: BoisAddressDiagram },
  hybride: { adresse: HybrideAddressDiagram },
};

export function diagramFor(club, tab) {
  return DIAGRAMS[club]?.[tab] || null;
}
