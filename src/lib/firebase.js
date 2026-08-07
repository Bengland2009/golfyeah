// Firebase init — guarded so the app still runs (in local/demo mode) when
// no Firebase project is configured yet. Fill in .env (see .env.example)
// to switch to the real shared backend.
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId);

let app = null, auth = null, db = null, googleProvider = null;

if (isFirebaseConfigured) {
  app = initializeApp(config);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  // Without this, a browser that's already signed into Google silently
  // reuses that session on every popup — if it's the wrong account (a
  // personal Gmail vs. the one on the group's allowlist, say), there's no
  // way to pick a different one and "se déconnecter" + "continuer" just
  // loops back to the same wrong account every time.
  googleProvider.setCustomParameters({ prompt: 'select_account' });
}

export { app, auth, db, googleProvider };

// The shared private group all authorized members read/write. A single
// fixed group is enough for "one small group of friends"; can be made
// dynamic later without changing callers.
export const GROUP_ID = import.meta.env.VITE_GOLFYEAH_GROUP_ID || 'default';
