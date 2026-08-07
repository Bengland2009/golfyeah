import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { authErrorMessage } from '../lib/authErrors';

export default function Login() {
  const { login, isFirebaseConfigured, authError } = useAuth();
  const errorMessage = authErrorMessage(authError);

  return (
    <div
      className="gy-viewport-h"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 16,
        padding: '72px 32px 40px',
        background: 'var(--brand-primary)',
        color: '#fff',
      }}
    >
      <img src="/assets/logo-golfyeah-dark.png" alt="Golfyeah!" style={{ width: 300, maxWidth: '92%' }} />
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <div style={{ font: 'var(--text-h2)', marginBottom: 6, color: '#fff' }}>Bienvenue au club</div>
        <div style={{ font: 'var(--text-body)', color: 'rgba(255,255,255,0.85)' }}>Suivez vos parties entre amis.</div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {errorMessage && (
          <div style={{ font: 'var(--text-small)', color: '#FFD9DE', textAlign: 'center', background: 'rgba(200,16,46,0.25)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
            {errorMessage}
          </div>
        )}
        <Button variant="primary" onClick={login} style={{ borderRadius: 999, height: 52, width: '100%', background: '#fff', color: 'var(--brand-primary)' }}>
          Continuer avec Google
        </Button>
        {!isFirebaseConfigured && (
          <div style={{ font: 'var(--text-small)', color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
            Mode démo — aucun projet Firebase configuré.
          </div>
        )}
      </div>
    </div>
  );
}
