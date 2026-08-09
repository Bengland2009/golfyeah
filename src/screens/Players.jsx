import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Avatar from '../components/Avatar';
import { useData } from '../contexts/DataContext';
import { avatarSrc } from '../lib/avatar';
import { leaderboard, parLabel, scoreColor } from '../lib/scoring';

export default function Players() {
  const navigate = useNavigate();
  const { players, courses, completedRounds } = useData();

  const board = leaderboard(players, completedRounds, courses);

  return (
    <div>
      <TopBar />
      <div style={{ padding: 'var(--page-padding-mobile)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ font: 'var(--text-h2)' }}>Joueurs</div>
        <span onClick={() => navigate('/joueurs/nouveau')} style={{ alignSelf: 'flex-start', font: 'var(--text-small)', color: 'var(--brand-action)', fontWeight: 600, cursor: 'pointer' }}>
          + Ajouter un joueur
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {board.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/joueurs/${p.id}`)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', border: '1px solid var(--border-default)', borderRadius: 11 }}
            >
              <Avatar src={avatarSrc(p)} name={p.name} size={44} />
              <div style={{ flex: 1 }}>
                <div style={{ font: 'var(--text-label)' }}>{p.name}</div>
                <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>{p.rounds} rondes</div>
              </div>
              <span style={{ font: 'var(--text-stat-lg)', fontSize: 22, fontWeight: 700, color: scoreColor(p.avg) }}>
                {p.avg == null ? '—' : parLabel(p.avg)}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: 18 }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
