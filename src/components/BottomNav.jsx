import { HomeIcon, FlagIcon, MapIcon, TargetIcon, UsersIcon } from './icons';

const ITEMS = [
  { key: 'home', label: 'Accueil', Icon: HomeIcon },
  { key: 'rounds', label: 'Parties', Icon: FlagIcon },
  { key: 'courses', label: 'Terrains', Icon: MapIcon },
  { key: 'range', label: 'Range', Icon: TargetIcon },
  { key: 'players', label: 'Joueurs', Icon: UsersIcon },
];

export default function BottomNav({ active = 'home', onChange }) {
  return (
    <nav
      style={{
        display: 'flex',
        height: 68,
        borderTop: '1px solid var(--color-border)',
        background: '#fff',
        fontFamily: 'var(--font-sans)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {ITEMS.map(({ key, label, Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange && onChange(key)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: isActive ? 'var(--color-green-primary)' : 'var(--color-text-secondary)',
            }}
          >
            <Icon style={{ opacity: isActive ? 1 : 0.65 }} />
            <span style={{ fontSize: 11, fontWeight: 600 }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
