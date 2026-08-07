import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider, useData } from './contexts/DataContext';
import BottomNav from './components/BottomNav';
import Button from './components/Button';

import Login from './screens/Login';
import Home from './screens/Home';
import NewRound from './screens/NewRound';
import Live from './screens/Live';
import GolfTracker from './screens/GolfTracker';
import Summary from './screens/Summary';
import Rounds from './screens/Rounds';
import Courses from './screens/Courses';
import AddCourse from './screens/AddCourse';
import Range from './screens/Range';
import AddRange from './screens/AddRange';
import ClubDetail from './screens/ClubDetail';
import Players from './screens/Players';
import Profile from './screens/Profile';

const NAV_ACTIVE_BY_PREFIX = [
  ['/nouvelle-partie', 'rounds'],
  ['/resume', 'rounds'],
  ['/parties', 'rounds'],
  ['/terrains', 'courses'],
  ['/range', 'range'],
  ['/joueurs', 'players'],
  ['/', 'home'],
];

function navActiveFor(pathname) {
  const hit = NAV_ACTIVE_BY_PREFIX.find(([prefix]) => pathname === prefix || pathname.startsWith(prefix + '/'));
  return hit ? hit[1] : 'home';
}

const NAV_TARGET = { home: '/', rounds: '/parties', courses: '/terrains', range: '/range', players: '/joueurs' };

function Shell() {
  const { user, loading, logout, login } = useAuth();
  const { dataReady, dataError } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) return null;
  if (!user) return <div className="gy-app-shell gy-phone-col"><Login /></div>;

  if (dataError) {
    const switchAccount = async () => { await logout(); await login(); };
    return (
      <div className="gy-app-shell gy-phone-col">
        <div className="gy-viewport-h" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32, textAlign: 'center' }}>
          <div style={{ font: 'var(--text-h3)' }}>Impossible de synchroniser</div>
          {user.email && (
            <div style={{ font: 'var(--text-small)', color: 'var(--text-muted)' }}>
              Connecté avec <strong>{user.email}</strong>
            </div>
          )}
          <div style={{ font: 'var(--text-body)', color: 'var(--text-muted)' }}>{dataError}</div>
          <Button variant="primary" onClick={switchAccount} style={{ borderRadius: 999 }}>Essayer un autre compte Google</Button>
          <Button variant="secondary" onClick={logout} style={{ borderRadius: 999 }}>Se déconnecter</Button>
        </div>
      </div>
    );
  }
  if (!dataReady) return null;

  const showNav = !location.pathname.startsWith('/partie/en-cours');

  return (
    <div className="gy-app-shell gy-phone-col">
      <div className={showNav ? 'gy-nav-safe-pad' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nouvelle-partie" element={<NewRound />} />
          <Route path="/partie/en-cours" element={<Live />} />
          <Route path="/partie/en-cours/tracker/:playerId" element={<GolfTracker />} />
          <Route path="/resume/:roundId" element={<Summary />} />
          <Route path="/parties" element={<Rounds />} />
          <Route path="/terrains" element={<Courses />} />
          <Route path="/terrains/nouveau" element={<AddCourse />} />
          <Route path="/range" element={<Range />} />
          <Route path="/range/nouveau" element={<AddRange />} />
          <Route path="/range/:club" element={<ClubDetail />} />
          <Route path="/joueurs" element={<Players />} />
          <Route path="/joueurs/:playerId" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {showNav && (
        <div className="gy-phone-col" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, margin: '0 auto' }}>
          <BottomNav active={navActiveFor(location.pathname)} onChange={(key) => navigate(NAV_TARGET[key] || '/')} />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Shell />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
