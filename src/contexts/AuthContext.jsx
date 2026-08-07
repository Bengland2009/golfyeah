import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  signInWithPopup, signInWithRedirect, getRedirectResult,
  signOut as fbSignOut, onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';

const AuthContext = createContext(null);

const DEMO_USER_KEY = 'golfyeah_demo_user';

// Popup can't complete in these environments — redirect is the only option.
const REDIRECT_FALLBACK_CODES = new Set([
  'auth/popup-blocked',
  'auth/operation-not-supported-in-this-environment',
]);

function toAppUser(u) {
  return { uid: u.uid, name: u.displayName || 'Golfeur', email: u.email, photoUrl: u.photoURL };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (isFirebaseConfigured) {
      // Catches the error from a signInWithRedirect that just completed on
      // page reload — without this, a redirect failure leaves the user
      // silently stuck on the login screen with no explanation.
      getRedirectResult(auth).catch((err) => {
        setAuthError({ code: err.code || 'inconnu', message: err.message });
      });
      const unsub = onAuthStateChanged(auth, (u) => {
        setUser(u ? toAppUser(u) : null);
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
      setAuthError(null);
      try {
        const res = await signInWithPopup(auth, googleProvider);
        setUser(toAppUser(res.user));
      } catch (err) {
        if (REDIRECT_FALLBACK_CODES.has(err.code)) {
          // Popup didn't work at all (blocked, or an environment that can't
          // host one) — fall back to a full-page redirect instead.
          try {
            await signInWithRedirect(auth, googleProvider);
          } catch (err2) {
            setAuthError({ code: err2.code, message: err2.message });
          }
        } else if (err.code !== 'auth/cancelled-popup-request') {
          // Deliberately not swallowing this: some mobile browsers fire
          // "popup-closed-by-user" spuriously when Google's sign-in page
          // blocks Firebase from checking popup state — showing the error
          // beats leaving the user in an unexplained sign-in loop.
          setAuthError({ code: err.code, message: err.message });
        }
      }
      return;
    }
    // Demo mode: no Firebase project configured yet.
    const demo = { uid: 'demo-benoit', name: 'Benoit', email: 'demo@golfyeah.app', photoUrl: null };
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demo));
    setUser(demo);
  }, []);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const logout = useCallback(async () => {
    if (isFirebaseConfigured) await fbSignOut(auth);
    localStorage.removeItem(DEMO_USER_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, authError, clearAuthError, login, logout, isFirebaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
