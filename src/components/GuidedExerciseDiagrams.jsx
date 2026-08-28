// Top-view SVG installations for the "Exercices guidés" reference sheet —
// recreates the five ground setups from the reference sketch (alignment
// sticks laid on the turf), reusing the same shoe silhouette and ball
// marker as "Adresse & contact" so the two features read as one visual
// family. Right-handed golfer, target left, front foot left / back foot
// right — same convention as the rest of the app. Purely geometric: no
// technical labels or annotations belong here yet.
import { Ball, Shoe } from './AddressDiagrams';

const STICK = '#4A5450';
const FONT = 'Inter, -apple-system, sans-serif';
const FRONT_X = 78;
const BACK_X = 122;
const FOOT_Y = 138;
const FRONT_ANGLE = -6;
const BACK_ANGLE = 6;

function Feet() {
  return (
    <>
      <Shoe cx={FRONT_X} cy={FOOT_Y} angle={FRONT_ANGLE} />
      <Shoe cx={BACK_X} cy={FOOT_Y} angle={BACK_ANGLE} />
    </>
  );
}

// Ball with a short dashed arrow pointing toward the target (left),
// matching the top-of-diagram convention used across the app.
function TargetBall({ cx = 100, cy = 34 }) {
  return (
    <>
      <line x1={cx - 10} y1={cy} x2={cx - 40} y2={cy} stroke="currentColor" strokeWidth="1.6" opacity="0.6" strokeDasharray="1 4" />
      <polygon points={`${cx - 40},${cy} ${cx - 33},${cy - 4} ${cx - 33},${cy + 4}`} fill="currentColor" opacity="0.6" />
      <Ball cx={cx} cy={cy} r={7} flat />
    </>
  );
}

function Frame({ ariaLabel, children }) {
  return (
    <svg viewBox="0 0 200 190" role="img" style={{ width: '100%', height: 'auto', display: 'block', color: 'var(--text-body)' }} aria-label={ariaLabel}>
      {children}
    </svg>
  );
}

// #1 — Two sticks parallel to the target line, framing the ball in a
// corridor between them.
export function Exercise1Diagram() {
  return (
    <Frame ariaLabel="Deux bâtons parallèles orientés vers la cible, avec la balle dans le corridor entre les deux.">
      <line x1="25" y1="20" x2="175" y2="20" stroke={STICK} strokeWidth="3" strokeLinecap="round" />
      <line x1="25" y1="48" x2="175" y2="48" stroke={STICK} strokeWidth="3" strokeLinecap="round" />
      <TargetBall />
      <Feet />
    </Frame>
  );
}

// #2 — Two sticks forming a V, apex just in front of the stance, legs
// fanning out past the feet.
export function Exercise2Diagram() {
  return (
    <Frame ariaLabel="Deux bâtons formant un V dont le sommet se trouve près de la balle.">
      <line x1="100" y1="80" x2="15" y2="106.8" stroke={STICK} strokeWidth="3" strokeLinecap="round" />
      <line x1="100" y1="80" x2="185" y2="106.8" stroke={STICK} strokeWidth="3" strokeLinecap="round" />
      <TargetBall />
      <Feet />
    </Frame>
  );
}

// #3 — One stick along the feet line, one diagonal stick crossing it at
// 45° (measured from the horizontal, on the front-foot side), with an
// angle arc and label showing that 45°.
export function Exercise3Diagram() {
  return (
    <Frame ariaLabel="Un bâton parallèle à la ligne des pieds et un bâton diagonal, formant un angle de 45° avec le sol.">
      <line x1="55" y1="138" x2="145" y2="138" stroke={STICK} strokeWidth="3" strokeLinecap="round" />
      <line x1="122" y1="138" x2="39" y2="55" stroke={STICK} strokeWidth="3" strokeLinecap="round" />
      <path d="M 100 138 Q 99.8 128.8 106.4 122.4" fill="none" stroke="var(--text-muted)" strokeWidth="1.4" opacity="0.75" />
      <polygon points="97,141 103,141 100,132" fill="var(--text-muted)" opacity="0.75" />
      <text x="94" y="129" textAnchor="middle" fontFamily={FONT} fontSize="9" fill="var(--text-muted)">45°</text>
      <TargetBall />
      <Feet />
    </Frame>
  );
}

// #4 — Two parallel sticks, offset from each other (one nearer the ball,
// one nearer the feet).
export function Exercise4Diagram() {
  return (
    <Frame ariaLabel="Deux bâtons parallèles, mais décalés l'un par rapport à l'autre.">
      <line x1="15" y1="34" x2="58" y2="34" stroke={STICK} strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="115" x2="140" y2="115" stroke={STICK} strokeWidth="3" strokeLinecap="round" />
      <TargetBall />
      <Feet />
    </Frame>
  );
}

// #5 — One stick perpendicular to the feet line, centered in the stance,
// pointing toward the ball.
export function Exercise5Diagram() {
  return (
    <Frame ariaLabel="Un bâton perpendiculaire à la ligne des pieds, placé au centre du stance et pointant vers la balle.">
      <line x1="100" y1="55" x2="100" y2="150" stroke={STICK} strokeWidth="3" strokeLinecap="round" />
      <TargetBall />
      <Feet />
    </Frame>
  );
}

export const GUIDED_EXERCISE_DIAGRAMS = {
  1: Exercise1Diagram,
  2: Exercise2Diagram,
  3: Exercise3Diagram,
  4: Exercise4Diagram,
  5: Exercise5Diagram,
};

export function guidedExerciseDiagramFor(id) {
  return GUIDED_EXERCISE_DIAGRAMS[id] || null;
}
