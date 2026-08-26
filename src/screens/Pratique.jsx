import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Card from '../components/Card';
import { RulerIcon, PlusCircleIcon, TargetIcon, TrendingUpIcon, FlagIcon, AlignIcon } from '../components/icons';

const CARDS = [
  {
    Icon: FlagIcon,
    title: 'Plan d’entraînement',
    description: 'Un plan simple sur 4 semaines pour améliorer contact, direction et répétabilité.',
    to: '/pratique/plan',
  },
  {
    Icon: AlignIcon,
    title: 'Adresse & contact',
    description: 'Position de balle, posture et contact selon le bâton.',
    to: '/pratique/adresse-contact',
  },
  {
    Icon: RulerIcon,
    title: 'Mes distances',
    description: 'Consulter et modifier mes distances par bâton.',
    to: '/pratique/distances',
  },
  {
    Icon: PlusCircleIcon,
    title: 'Nouvelle séance',
    description: 'Enregistrer une nouvelle séance de pratique ou de simulateur.',
    to: '/pratique/nouvelle-seance',
  },
  {
    Icon: TargetIcon,
    title: 'Caddie',
    description: 'Distances de référence, conseils et aide-mémoire sur le parcours.',
    to: '/pratique/caddie',
  },
  {
    Icon: TrendingUpIcon,
    title: 'Historique',
    description: 'Consulter les séances précédentes et voir la progression.',
    to: '/pratique/historique',
  },
];

function PratiqueCard({ Icon, title, description, onClick }) {
  return (
    <div onClick={onClick} style={{ cursor: 'pointer' }}>
      <Card style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 18 }}>
        <div
          style={{
            width: 48, height: 48, borderRadius: 14, background: 'var(--surface-tint)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          <Icon width={22} height={22} strokeWidth={1.75} style={{ color: 'var(--brand-action)' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: 'var(--text-h3)', fontSize: 17, marginBottom: 3 }}>{title}</div>
          <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', lineHeight: 1.4 }}>{description}</div>
        </div>
        <span style={{ font: 'var(--text-h3)', color: 'var(--text-muted)', fontSize: 20, flexShrink: 0 }}>›</span>
      </Card>
    </div>
  );
}

export default function Pratique() {
  const navigate = useNavigate();

  return (
    <div>
      <TopBar />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div>
          <div style={{ font: 'var(--text-h2)', marginBottom: 4 }}>Pratique</div>
          <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)' }}>Ton centre d'entraînement Golfyeah!</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {CARDS.map((c) => (
            <PratiqueCard key={c.to} Icon={c.Icon} title={c.title} description={c.description} onClick={() => navigate(c.to)} />
          ))}
        </div>
      </div>
    </div>
  );
}
