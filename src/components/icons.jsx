// Minimal Lucide-style outline icons, inlined (no CDN dependency, works offline).
const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

export function HomeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} {...common} {...props}>
      <path d="M3 9.5 12 3l9 6.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}
export function FlagIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} {...common} {...props}>
      <path d="M5 3v18" />
      <path d="M5 4h13l-3 4 3 4H5" />
    </svg>
  );
}
export function MapIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} {...common} {...props}>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
      <path d="M9 4v14" />
      <path d="M15 6v14" />
    </svg>
  );
}
export function TargetIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} {...common} {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}
export function UsersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} {...common} {...props}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <path d="M16 8.5a3 3 0 1 1 3.8 2.9" />
      <path d="M17 14.3c2.5.5 4.5 2.5 4.5 5.7" />
    </svg>
  );
}
export function TrophyIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} {...common} {...props}>
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 5H4.5A1.5 1.5 0 0 0 3 6.5a2.5 2.5 0 0 0 2.5 2.5H7" />
      <path d="M17 5h2.5A1.5 1.5 0 0 1 21 6.5a2.5 2.5 0 0 1-2.5 2.5H17" />
      <path d="M9 20h6" />
      <path d="M12 15v5" />
    </svg>
  );
}
export function TreeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} {...common} {...props}>
      <path d="M12 3 6.5 11h3L5 18h5v3h4v-3h5l-4.5-7h3L12 3Z" />
    </svg>
  );
}
export function RulerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} {...common} {...props}>
      <path d="M3 17 17 3l4 4L7 21Z" />
      <path d="M7.5 12.5 10 15" />
      <path d="M10.5 9.5 13 12" />
      <path d="M13.5 6.5 16 9" />
    </svg>
  );
}
export function PlusCircleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} {...common} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}
export function TrendingUpIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} {...common} {...props}>
      <path d="M3 17 9 11l4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  );
}
export function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} {...common} {...props}>
      <path d="M4 12.5 9.5 18 20 6.5" />
    </svg>
  );
}
export function BeerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} {...common} {...props}>
      <rect x="5" y="8" width="10" height="12" rx="2" />
      <path d="M15 11h1.5a2 2 0 1 1 0 4H15" />
      <path d="M6.5 8c.6-1.4-.4-2.3.2-3.8" />
      <path d="M9.5 8c.6-1.4-.4-2.3.2-3.8" />
      <path d="M12.5 8c.6-1.4-.4-2.3.2-3.8" />
    </svg>
  );
}
