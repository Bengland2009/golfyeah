import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import CaddieCard from '../components/CaddieCard';
import { TargetIcon } from '../components/icons';
import { useData } from '../contexts/DataContext';
import { useMe } from '../lib/useMe';
import { clubAverage } from '../lib/scoring';
import { REFERENCE_DISTANCES, clubLabel } from '../lib/caddie';

function ClubCell({ club, reference, personal }) {
  const hasPersonal = personal != null;
  const diff = hasPersonal ? personal - reference : null;
  return (
    <div>
      <div style={{ font: 'var(--text-small)', fontSize: 12, color: 'var(--text-muted)', marginBottom: 3 }}>
        {clubLabel(club)}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ font: 'var(--text-stat-lg)', fontSize: 24, fontWeight: 800, color: hasPersonal ? 'var(--brand-action)' : 'var(--text-body)', lineHeight: 1 }}>
          {hasPersonal ? personal : reference}
        </span>
        <span style={{ font: 'var(--text-small)', fontSize: 12, color: 'var(--text-muted)' }}>vg</span>
      </div>
      {hasPersonal && (
        <div style={{ font: 'var(--text-small)', fontSize: 11, color: 'var(--text-disabled)', marginTop: 2 }}>
          {diff === 0 ? 'Comme la référence' : `${diff > 0 ? '+' : ''}${diff} vg vs réf.`}
        </div>
      )}
    </div>
  );
}

export default function Caddie() {
  const navigate = useNavigate();
  const { range, CLUB_ORDER } = useData();
  const me = useMe();

  const personalFor = (club) => clubAverage(range.filter((e) => e.playerId === me?.id && e.club === club));

  return (
    <div>
      <Header title="Caddie" onBack={() => navigate('/pratique')} />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <CaddieCard Icon={TargetIcon} title="Distances de référence" subtitle="Distances de carry (dans les airs)">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 22, columnGap: 16 }}>
            {CLUB_ORDER.map((club) => (
              <ClubCell key={club} club={club} reference={REFERENCE_DISTANCES[club]} personal={personalFor(club)} />
            ))}
          </div>
        </CaddieCard>

        <Card tint>
          <div style={{ font: 'var(--text-eyebrow)', letterSpacing: 'var(--letter-spacing-eyebrow)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>
            À retenir
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Ces distances représentent le carry (distance parcourue dans les airs, avant le roulement).
            </div>
            <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Elles servent uniquement de point de départ.
            </div>
            <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Ton objectif est de remplacer progressivement ces valeurs par tes propres distances mesurées au simulateur ou au champ de pratique.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
