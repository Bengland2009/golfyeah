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
