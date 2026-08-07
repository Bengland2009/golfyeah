import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';

const AuthContext = createContext(null);

const DEMO_USER_KEY = 'golfyeah_demo_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsub = onAuthStateChanged(auth, (u) => {
        setUser(u ? { uid: u.uid, name: u.displayName || 'Golfeur', email: u.email, photoUrl: u.photoURL } : null);
        setLoading(false);
      });
      return unsub;
    }
    const raw = localStorage.getItem(DEMO_USER_KEY);
    if (raw) setUser(JSON.parse(raw));
    setLoading(false);
  }, []);

  const login = useCallback(async () => {
    if (isFirebaseConfigured) {
      const res = await signInWithPopup(auth, googleProvider);
      const u = res.user;
      setUser({ uid: u.uid, name: u.displayName || 'Golfeur', email: u.email, photoUrl: u.photoURL });
      return;
    }
    // Demo mode: no Firebase project configured yet.
    const demo = { uid: 'demo-benoit', name: 'Benoit', email: 'demo@golfyeah.app', photoUrl: null };
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demo));
    setUser(demo);
  }, []);

  const logout = useCallback(async () => {
    if (isFirebaseConfigured) await fbSignOut(auth);
    localStorage.removeItem(DEMO_USER_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isFirebaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
