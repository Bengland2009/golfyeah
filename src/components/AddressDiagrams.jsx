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
  if (club === 'chip') {
    return (
      <g transform={`rotate(-20 ${cx} ${cy})`}>
        <rect x={cx - 5} y={cy - 1.8} width="10" height="3.6" rx="1.6" fill="currentColor" />
        <rect x={cx - 5} y={cy - 1.8} width="2.4" height="3.6" rx="1.2" fill="var(--brand-primary)" opacity="0.9" />
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
// `zone` is optional — when set (Bois, Hybride), the acceptable range is
// drawn as a bold bracketed segment ON the ruler (two tall gold end-caps
// joined by a solid bar), labelled either at each end (`zone.left`/
// `zone.right` — Bois's "3-bois"/"5/7-bois") or once, centered under the
// segment (`zone.label` — Hybride's "2–5 cm devant"). The solid ball and
// the green ruler dot still mark the single recommended point inside it.
// No zone-above-the-ball band or label anymore — the ruler is the only
// place the range is shown, so it doesn't compete with the ball for
// attention. When a zone is present, the ruler's own "centre" caption
// drops to a second row (there's more going on right at ruler height),
// which is why zone diagrams use a taller viewBox than Driver/Fer 7.
// Driver/Fer 7 pass neither `zone` nor `viewBoxHeight`, so they render
// exactly as before.
//
// `frontAngle`/`backAngle` (default -25/10) and `showAngleDetail` (default
// true) let Chip use a much smaller, unlabelled opening instead of the
// other clubs' fixed 25°/10° — no arcs, no degree text, just the shoes
// themselves turned slightly. `frontPivotY` (defaults to the shared
// `pivotY`) lets Chip's front foot sit lower/further from the ball than
// the back foot, for its dropped-back, "légèrement retiré" stance. None of
// these are passed by Driver/Fer 7/Bois/Hybride, so they're unaffected.
function TopView({
  frontX, backX, ballX, talonAvantX, arcFront, arcBack, club, zone, viewBoxHeight = 180,
  frontAngle = -25, backAngle = 10, showAngleDetail = true, frontPivotY, ariaLabel,
}) {
  const centreX = 100;
  const pivotY = 100;
  const frontY = frontPivotY ?? pivotY;
  const frontHeelY = frontY + 15;
  const backHeelY = pivotY + 15;
  const ballY = 44;
  const ballR = 6.5;
  const clubheadCx = ballX + 17;
  const rulerY = 158;
  const centreLabelY = zone ? rulerY + 24 : rulerY + 13;

  return (
    <svg viewBox={`0 0 200 ${viewBoxHeight}`} role="img" style={{ width: '100%', height: 'auto', display: 'block', color: 'var(--text-body)' }}
      aria-label={ariaLabel}>
      <text x={centreX} y="8" textAnchor="middle" fontFamily={FONT} fontSize="9" fill="var(--text-muted)">cible à gauche</text>
      <line x1="170" y1="18" x2="30" y2="18" stroke="currentColor" strokeWidth="1.4" opacity="0.55" strokeDasharray="1 4" />
      <polygon points="37,14 37,22 30,18" fill="currentColor" opacity="0.55" />

      <Ball cx={ballX} cy={ballY} r={ballR} flat />
      <ClubHead cx={clubheadCx} cy={ballY} club={club} />
      <line x1={ballX} y1={ballY + ballR + 4} x2={ballX} y2={rulerY} stroke="var(--text-muted)" strokeWidth="1.3" strokeDasharray="1 3" opacity="0.6" />

      <Shoe cx={frontX} cy={frontY} angle={frontAngle} />
      {showAngleDetail && (
        <path d={`M ${frontX} ${frontY - 15} A 15 15 0 0 0 ${arcFront.x} ${arcFront.y}`} fill="none" stroke="var(--text-muted)" strokeWidth="1.4" opacity="0.75" />
      )}
      <text x={frontX} y={frontHeelY + 14} textAnchor="middle" fontFamily={FONT} fontSize="10" fontWeight="600" fill="var(--text-body)">avant</text>
      {showAngleDetail && (
        <text x={frontX} y={frontHeelY + 27} textAnchor="middle" fontFamily={FONT} fontSize="8.5" fill="var(--text-muted)">25°</text>
      )}

      <Shoe cx={backX} cy={pivotY} angle={backAngle} />
      {showAngleDetail && (
        <path d={`M ${backX} ${pivotY - 15} A 15 15 0 0 1 ${arcBack.x} ${arcBack.y}`} fill="none" stroke="var(--text-muted)" strokeWidth="1.4" opacity="0.75" />
      )}
      <text x={backX} y={backHeelY + 14} textAnchor="middle" fontFamily={FONT} fontSize="10" fontWeight="600" fill="var(--text-body)">arrière</text>
      {showAngleDetail && (
        <text x={backX} y={backHeelY + 27} textAnchor="middle" fontFamily={FONT} fontSize="8.5" fill="var(--text-muted)">10°</text>
      )}

      <line x1="15" y1={rulerY} x2="185" y2={rulerY} stroke="var(--border-default)" strokeWidth="1.3" />

      {zone ? (
        <>
          <line x1={zone.x1} y1={rulerY} x2={zone.x2} y2={rulerY} stroke={GOLD_DEEP} strokeWidth="3.4" />
          <line x1={zone.x1} y1={rulerY - 7} x2={zone.x1} y2={rulerY + 7} stroke={GOLD_DEEP} strokeWidth="2.2" />
          <line x1={zone.x2} y1={rulerY - 7} x2={zone.x2} y2={rulerY + 7} stroke={GOLD_DEEP} strokeWidth="2.2" />
          {zone.label ? (
            <text x={(zone.x1 + zone.x2) / 2} y={rulerY + 13} textAnchor="middle" fontFamily={FONT} fontSize="8" fontWeight="700" fill={GOLD_DEEP}>{zone.label}</text>
          ) : (
            <>
              <text x={zone.x1 - 2} y={rulerY + 13} textAnchor="end" fontFamily={FONT} fontSize="8" fontWeight="700" fill={GOLD_DEEP}>{zone.left}</text>
              <text x={zone.x2 + 2} y={rulerY + 13} textAnchor="start" fontFamily={FONT} fontSize="8" fontWeight="700" fill={GOLD_DEEP}>{zone.right}</text>
            </>
          )}
        </>
      ) : (
        <>
          <line x1={talonAvantX} y1={rulerY - 4} x2={talonAvantX} y2={rulerY + 4} stroke="var(--text-muted)" strokeWidth="1.3" />
          <text x={talonAvantX} y={rulerY + 13} textAnchor="middle" fontFamily={FONT} fontSize="8" fill="var(--text-muted)">talon</text>
        </>
      )}
      <line x1={centreX} y1={rulerY - 4} x2={centreX} y2={rulerY + 4} stroke="var(--text-muted)" strokeWidth="1.3" />
      <circle cx={ballX} cy={rulerY} r="3" fill="var(--brand-action)" />
      <text x={centreX} y={centreLabelY} textAnchor="middle" fontFamily={FONT} fontSize="8" fill="var(--text-muted)">centre</text>
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
      zone={{ x1: 64, x2: 80, left: '3-bois', right: '5/7-bois' }}
      viewBoxHeight={195}
      arcFront={{ x: 43.66, y: 86.41 }}
      arcBack={{ x: 152.6, y: 85.23 }}
      club="bois"
      ariaLabel="Vue du joueur vers le sol pour le bois : stance légèrement plus large que les épaules, pied avant à gauche, pied arrière à droite, cible à gauche, tête de bois derrière la balle. La balle se joue dans une courte zone acceptable sur le repère au sol, du 3-bois (près du talon avant) au 5/7-bois (plus vers le centre)."
    />
  );
}

export function HybrideAddressDiagram() {
  return (
    <TopView
      frontX={57.5}
      backX={142.5}
      ballX={91}
      zone={{ x1: 87, x2: 94, label: '2–5 cm devant' }}
      viewBoxHeight={195}
      arcFront={{ x: 51.16, y: 86.41 }}
      arcBack={{ x: 145.1, y: 85.23 }}
      club="hybride"
      ariaLabel="Vue du joueur vers le sol pour l'hybride : stance environ largeur d'épaules, pied avant à gauche, pied arrière à droite, cible à gauche, tête d'hybride derrière la balle. La balle se joue dans une courte zone acceptable, 2 à 5 cm devant le centre sur le repère au sol."
    />
  );
}

// A standard chip on a good lie: much narrower than Fer 7, front foot
// dropped back and turned slightly open toward the target (no fixed degree
// — just the shoe's own angle, per the brief's "no 25°/10°" rule), back
// foot left nearly square. Ball sits in a very short zone right at/just
// left of centre — the shortest of any club's zone, since a chip's ball
// position barely moves.
export function ChipAddressDiagram() {
  return (
    <TopView
      frontX={75}
      backX={125}
      ballX={95}
      zone={{ x1: 93, x2: 97, label: 'centre à légèrement devant' }}
      viewBoxHeight={195}
      frontAngle={-14}
      backAngle={4}
      frontPivotY={118}
      showAngleDetail={false}
      club="chip"
      ariaLabel="Vue du joueur vers le sol pour le chip : stance nettement plus étroit que le fer 7, pied avant à gauche légèrement retiré et ouvert vers la cible, pied arrière à droite presque carré, cible à gauche, tête de wedge derrière la balle. La balle se joue dans une très courte zone allant du centre à légèrement devant."
    />
  );
}

// Both played off the turf: the club meets the ball before the ground, and
// the low point of the arc — like the turf interaction after it — falls
// past the ball, toward the target. Since these diagrams put the target on
// the LEFT (matching the Adresse tab's convention) rather than the right
// like Driver/Fer 7's existing Arc diagrams, the swing here runs
// right-to-left and "after the ball" means smaller x, not larger — the
// mirror image of the Driver/Fer 7 pattern above. Bois' arc is wide and
// shallow (skims the turf over a long stretch); Hybride's is narrower and
// dips closer to the ground (a steeper, more compact attack) — the shape
// difference carries the distinction, not just color, per the brief.
export function BoisArcDiagram() {
  return (
    <svg viewBox="0 0 400 170" role="img" style={{ width: '100%', height: 'auto', display: 'block', color: 'var(--text-body)' }}
      aria-label="Vue de côté pour le bois, joué depuis le gazon : arc large et peu profond, avec une flèche sur sa partie descendante montrant la tête de bâton se déplacer de droite à gauche. Elle touche la balle avant le sol ; le point bas, à gauche de la balle, est suivi d'une légère brosse du gazon — jamais un contact remontant comme au driver.">
      <rect x="40" y="100" width="320" height="18" fill="var(--surface-tint)" />
      <line x1="40" y1="100" x2="360" y2="100" stroke="var(--brand-action)" strokeWidth="3.2" />
      <line x1="159" y1="98" x2="168" y2="103" stroke="currentColor" strokeWidth="2" opacity="0.55" strokeLinecap="round" />
      <line x1="172" y1="98" x2="181" y2="103" stroke="currentColor" strokeWidth="2" opacity="0.55" strokeLinecap="round" />
      <line x1="185" y1="98" x2="194" y2="103" stroke="currentColor" strokeWidth="2" opacity="0.55" strokeLinecap="round" />
      <line x1="198" y1="98" x2="207" y2="103" stroke="currentColor" strokeWidth="2" opacity="0.55" strokeLinecap="round" />

      <path d="M 350 65 Q 210 109 90 72" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.8" />
      <polygon points="7,0 -5,-4 -5,4" fill="currentColor" opacity="0.8" transform="translate(300,78) rotate(168)" />

      <circle cx="195" cy="100" r="4.5" fill="currentColor" />
      <text x="195" y="132" textAnchor="middle" fontFamily={FONT} fontSize="13" fontWeight="600" fill="currentColor" opacity="0.85">point bas</text>
      <text x="148" y="148" textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="600" fill="currentColor" opacity="0.7">brosse légère</text>

      <ellipse cx="261" cy="87" rx="13" ry="7" fill="currentColor" />
      <Ball cx="245" cy="87" r="13" />
      <line x1="245" y1="71" x2="245" y2="48" stroke="currentColor" strokeWidth="1.3" opacity="0.6" />
      <text x="245" y="41" textAnchor="middle" fontFamily={FONT} fontSize="13" fontWeight="600" fill="currentColor" opacity="0.85">contact</text>
    </svg>
  );
}

export function HybrideArcDiagram() {
  return (
    <svg viewBox="0 0 400 170" role="img" style={{ width: '100%', height: 'auto', display: 'block', color: 'var(--text-body)' }}
      aria-label="Vue de côté pour l'hybride, joué depuis le gazon : arc plus compact et plus descendant que celui du bois, mais pas aussi abrupt qu'un wedge, avec une flèche sur sa partie descendante montrant la tête de bâton se déplacer de droite à gauche. Elle touche la balle avant le sol ; le point bas, à gauche de la balle, est suivi d'un petit divot qui commence juste après elle.">
      <rect x="40" y="100" width="320" height="18" fill="var(--surface-tint)" />
      <line x1="40" y1="100" x2="360" y2="100" stroke="var(--brand-action)" strokeWidth="3.2" />
      <ellipse cx="192" cy="100" rx="17" ry="4.5" fill="currentColor" opacity="0.22" />
      <ellipse cx="203" cy="97" rx="7" ry="3" fill="currentColor" opacity="0.35" />

      <path d="M 320 25 Q 220 140 125 44" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.8" />
      <polygon points="7,0 -5,-4 -5,4" fill="currentColor" opacity="0.8" transform="translate(250,80) rotate(157)" />

      <circle cx="175" cy="100" r="4.5" fill="currentColor" />
      <text x="175" y="132" textAnchor="middle" fontFamily={FONT} fontSize="13" fontWeight="600" fill="currentColor" opacity="0.85">point bas</text>
      <text x="148" y="148" textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="600" fill="currentColor" opacity="0.7">petit divot</text>

      <ellipse cx="224" cy="87" rx="9" ry="8" fill="currentColor" />
      <Ball cx="210" cy="87" r="13" />
      <line x1="210" y1="71" x2="210" y2="48" stroke="currentColor" strokeWidth="1.3" opacity="0.6" />
      <text x="210" y="41" textAnchor="middle" fontFamily={FONT} fontSize="13" fontWeight="600" fill="currentColor" opacity="0.85">contact</text>
    </svg>
  );
}

export const DIAGRAMS = {
  driver: { adresse: DriverAddressDiagram, arc: DriverArcDiagram },
  fer7: { adresse: Fer7AddressDiagram, arc: Fer7ArcDiagram },
  bois: { adresse: BoisAddressDiagram, arc: BoisArcDiagram },
  hybride: { adresse: HybrideAddressDiagram, arc: HybrideArcDiagram },
  chip: { adresse: ChipAddressDiagram },
};

export function diagramFor(club, tab) {
  return DIAGRAMS[club]?.[tab] || null;
}
