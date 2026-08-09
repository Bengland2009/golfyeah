import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import { avatarSrc } from '../lib/avatar';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useMe } from '../lib/useMe';
import { APP_VERSION } from '../lib/version';

function MenuLink({ label, onClick, sub }) {
  return (
    <div
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '14px 0', cursor: 'pointer' }}
    >
      <span style={{ font: 'var(--font-serif)', fontWeight: 700, fontSize: 30, color: '#fff' }}>{label}</span>
      {sub && <span style={{ font: 'var(--text-body)', color: 'rgba(255,255,255,0.7)' }}>{sub}</span>}
    </div>
  );
}

export default function AppMenu({ open, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { season } = useData();
  const me = useMe();
  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'var(--brand-primary)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 8px', paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))' }}>
        <img src="/assets/icon-gy-cropped.png" alt="Golfyeah!" style={{ height: 46, objectFit: 'contain' }} />
        <button
          onClick={onClose}
          aria-label="Fermer"
          style={{ width: 48, height: 48, background: 'none', border: 'none', color: '#fff', fontSize: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ×
        </button>
      </div>
      {me && (
        <div
          onClick={() => { navigate(`/joueurs/${me.id}`); onClose(); }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 24px 20px', cursor: 'pointer' }}
        >
          <Avatar src={avatarSrc(me)} name={me.name} size={32} />
          <span style={{ font: 'var(--text-small)', color: 'rgba(255,255,255,0.85)' }}>{me.name}</span>
        </div>
      )}
      <div style={{ flex: 1, padding: '4px 24px', display: 'flex', flexDirection: 'column' }}>
        <MenuLink label="Saison" onClick={onClose} sub={season + ' ›'} />
        <MenuLink label="Mon profil" onClick={() => { navigate(`/joueurs/${me?.id}`); onClose(); }} />
        <MenuLink label="Caddie" onClick={() => { navigate('/caddie'); onClose(); }} />
        <MenuLink label="Ajouter un joueur" onClick={() => { navigate('/joueurs'); onClose(); }} />
        <MenuLink label="Commentaires" onClick={() => { navigate('/commentaires'); onClose(); }} />
        <MenuLink label="Paramètres" onClick={onClose} />
        <MenuLink label="À propos" onClick={onClose} />
      </div>
      <div style={{ background: 'var(--brand-action)', padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <span onClick={onClose} style={{ font: 'var(--text-body)', fontSize: 16, color: '#fff', cursor: 'pointer' }}>Aide</span>
        <span onClick={onClose} style={{ font: 'var(--text-body)', fontSize: 16, color: '#fff', cursor: 'pointer' }}>À propos de Golfyeah!</span>
        <span onClick={logout} style={{ font: 'var(--text-small)', color: 'rgba(255,255,255,0.75)', cursor: 'pointer' }}>Déconnexion</span>
        <span style={{ font: 'var(--text-small)', fontSize: 12, color: 'rgba(255,255,255,0.5)', gridColumn: '1 / -1' }}>Golfyeah! v{APP_VERSION}</span>
      </div>
    </div>
  );
}
