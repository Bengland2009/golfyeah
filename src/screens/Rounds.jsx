import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { useData } from '../contexts/DataContext';
import { parLabel, toneFor, coursePar } from '../lib/scoring';

// One compact, full-width row per round — replaces the old one-card-per-
// round layout so many rounds can be scanned/compared without excessive
// scrolling. completedRounds already arrives newest-first (DataContext
// sorts it by the round's real played-on date), so no re-sort here.
function RoundRow({ round, course, players, isLast, onClick }) {
  const par = course ? coursePar(course, round.holes) : round.par || 72;
  const envLabel = course?.kind ? (course.kind === 'interieur' ? 'Simulateur' : 'Extérieur') : null;

  return (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer', padding: '14px 4px',
        borderBottom: isLast ? 'none' : '1px solid var(--border-default)',
      }}
    >
      <div style={{ font: 'var(--text-body)', fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>
        {course?.name}
      </div>
      <div style={{ font: 'var(--text-small)', fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2, marginBottom: 8 }}>
        {round.date} · {round.holes} trous{envLabel ? ` · ${envLabel}` : ''}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: 16, rowGap: 6 }}>
        {round.playerIds.map((pid) => {
          const p = players.find((pp) => pp.id === pid);
          const diff = round.totals[pid] - par;
          return (
            <div key={pid} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ font: 'var(--text-small)', fontSize: 13.5, fontWeight: 600 }}>{p?.name}</span>
              <Badge tone={toneFor(diff)}>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>{parLabel(diff)}</span>
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Rounds() {
  const navigate = useNavigate();
  const { completedRounds, players, courses } = useData();

  return (
    <div>
      <TopBar />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ font: 'var(--text-h2)' }}>Parties</div>
        <Button variant="primary" onClick={() => navigate('/nouvelle-partie')} style={{ alignSelf: 'flex-start', borderRadius: 999, height: 46, padding: '0 22px', fontSize: 16 }}>
          + Nouvelle partie
        </Button>

        {!completedRounds.length && (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)', marginBottom: 12 }}>Aucune partie cette saison.</div>
            <Button variant="primary" onClick={() => navigate('/nouvelle-partie')} style={{ borderRadius: 999 }}>Jouer une première ronde</Button>
          </div>
        )}

        {completedRounds.length > 0 && (
          <Card style={{ padding: '0 14px' }}>
            {completedRounds.map((r, i) => (
              <RoundRow
                key={r.id}
                round={r}
                course={courses.find((c) => c.id === r.courseId)}
                players={players}
                isLast={i === completedRounds.length - 1}
                onClick={() => navigate(`/resume/${r.id}`)}
              />
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
