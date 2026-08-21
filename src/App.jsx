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
import EditRound from './screens/EditRound';
import QuickEntry from './screens/QuickEntry';
import Rounds from './screens/Rounds';
import Courses from './screens/Courses';
import AddCourse from './screens/AddCourse';
import Pratique from './screens/Pratique';
import MyDistances from './screens/MyDistances';
import AddRange from './screens/AddRange';
import ClubDetail from './screens/ClubDetail';
import SessionHistory from './screens/SessionHistory';
import Players from './screens/Players';
import AddPlayer from './screens/AddPlayer';
import Profile from './screens/Profile';
import FeedbackList from './screens/FeedbackList';
import NewFeedback from './screens/NewFeedback';
import FeedbackDetail from './screens/FeedbackDetail';
import Caddie from './screens/Caddie';
import TrainingPlan from './screens/TrainingPlan';
import TrainingSession from './screens/TrainingSession';
import TrainingHistory from './screens/TrainingHistory';
import Venues from './screens/Venues';
import VenueDetail from './screens/VenueDetail';

const NAV_ACTIVE_BY_PREFIX = [
  ['/nouvelle-partie', 'rounds'],
  ['/resume', 'rounds'],
  ['/parties', 'rounds'],
  ['/terrains', 'courses'],
  ['/pratique', 'pratique'],
  ['/joueurs', 'players'],
  ['/', 'home'],
];

function navActiveFor(pathname) {
  const hit = NAV_ACTIVE_BY_PREFIX.find(([prefix]) => pathname === prefix || pathname.startsWith(prefix + '/'));
  return hit ? hit[1] : 'home';
}

const NAV_TARGET = { home: '/', rounds: '/parties', courses: '/terrains', pratique: '/pratique', players: '/joueurs' };

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

  const showNav = !location.pathname.startsWith('/partie/en-cours') && !location.pathname.startsWith('/partie/entree-rapide') && !location.pathname.endsWith('/modifier');

  return (
    <div className="gy-app-shell gy-phone-col">
      <div className={showNav ? 'gy-nav-safe-pad' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nouvelle-partie" element={<NewRound />} />
          <Route path="/partie/en-cours" element={<Live />} />
          <Route path="/partie/en-cours/tracker/:playerId" element={<GolfTracker />} />
          <Route path="/resume/:roundId" element={<Summary />} />
          <Route path="/resume/:roundId/modifier" element={<EditRound />} />
          <Route path="/partie/entree-rapide" element={<QuickEntry />} />
          <Route path="/parties" element={<Rounds />} />
          <Route path="/terrains" element={<Courses />} />
          <Route path="/terrains/nouveau" element={<AddCourse />} />
          <Route path="/pratique" element={<Pratique />} />
          <Route path="/pratique/distances" element={<MyDistances />} />
          <Route path="/pratique/distances/:club" element={<ClubDetail />} />
          <Route path="/pratique/nouvelle-seance" element={<AddRange />} />
          <Route path="/pratique/historique" element={<SessionHistory />} />
          <Route path="/pratique/caddie" element={<Caddie />} />
          <Route path="/pratique/plan" element={<TrainingPlan />} />
          <Route path="/pratique/plan/historique" element={<TrainingHistory />} />
          <Route path="/pratique/plan/:sessionId" element={<TrainingSession />} />
          <Route path="/joueurs" element={<Players />} />
          <Route path="/joueurs/nouveau" element={<AddPlayer />} />
          <Route path="/joueurs/:playerId" element={<Profile />} />
          <Route path="/commentaires" element={<FeedbackList />} />
          <Route path="/commentaires/nouveau" element={<NewFeedback />} />
          <Route path="/commentaires/:id" element={<FeedbackDetail />} />
          <Route path="/golf" element={<Venues />} />
          <Route path="/golf/:venueId" element={<VenueDetail />} />
          {/* Legacy shortcuts, kept as redirects in case a device has an old link/shortcut. */}
          <Route path="/range" element={<Navigate to="/pratique/distances" replace />} />
          <Route path="/caddie" element={<Navigate to="/pratique/caddie" replace />} />
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
