import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import {
  collection, doc, onSnapshot, addDoc, setDoc, updateDoc, deleteDoc, query,
} from 'firebase/firestore';
import { db, isFirebaseConfigured, GROUP_ID } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { CLUB_ORDER, DEFAULT_MY_CLUBS, SEED_PLAYERS, SEED_COURSE, seedRounds, seedRange } from '../lib/seed';
import { finalizeRound, coursePar } from '../lib/scoring';
import { matchPlayer } from '../lib/identity';

const FS_COLLECTIONS = ['players', 'courses', 'rounds', 'range', 'myClubs', 'expenses', 'feedback', 'feedbackComments'];

const DataContext = createContext(null);

const LS_KEY = 'golfyeah_local_store_v1';

function loadLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    // Backfill keys added after someone's local store was first created —
    // without this, a returning demo-mode user with old localStorage data
    // would crash on the missing field.
    if (raw) return { expenses: [], feedback: [], feedbackComments: [], ...JSON.parse(raw) };
  } catch {}
  return {
    players: SEED_PLAYERS,
    courses: [SEED_COURSE],
    rounds: seedRounds(),
    range: seedRange(),
    myClubs: {},
    expenses: [],
    feedback: [],
    feedbackComments: [],
  };
}

function saveLocal(state) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {}
}

export function DataProvider({ children }) {
  const { user } = useAuth();
  const [season, setSeason] = useState(2026);

  // ---- local (no-Firebase) backend ----
  const [local, setLocal] = useState(loadLocal);
  useEffect(() => { if (!isFirebaseConfigured) saveLocal(local); }, [local]);

  // ---- Firestore backend ----
  const [fsPlayers, setFsPlayers] = useState([]);
  const [fsCourses, setFsCourses] = useState([]);
  const [fsRounds, setFsRounds] = useState([]);
  const [fsRange, setFsRange] = useState([]);
  const [fsMyClubs, setFsMyClubs] = useState({});
  const [fsExpenses, setFsExpenses] = useState([]);
  const [fsFeedback, setFsFeedback] = useState([]);
  const [fsFeedbackComments, setFsFeedbackComments] = useState([]);
  const [loadedCollections, setLoadedCollections] = useState(() => new Set());
  const [dataError, setDataError] = useState(null);

  useEffect(() => {
    // Wait for a known, authenticated user before subscribing — reading
    // before that is certain to fail Firestore's rules (see firestore.rules)
    // and would otherwise fire silent permission-denied errors on every load.
    if (!isFirebaseConfigured || !user) {
      setFsPlayers([]); setFsCourses([]); setFsRounds([]); setFsRange([]); setFsMyClubs({}); setFsExpenses([]); setFsFeedback([]); setFsFeedbackComments([]);
      setLoadedCollections(new Set());
      setDataError(null);
      return;
    }
    const g = (name) => collection(db, 'groups', GROUP_ID, name);
    const markLoaded = (name) => setLoadedCollections((s) => (s.has(name) ? s : new Set(s).add(name)));
    const onError = (name) => (err) => {
      console.error(`[golfyeah] groups/${GROUP_ID}/${name} subscription failed:`, err);
      setDataError(err.code === 'permission-denied'
        ? "Accès refusé — vérifie que ton compte est dans la liste des membres du groupe (Firestore : groups/default.memberEmails)."
        : `Erreur de synchronisation (${err.code || err.message}).`);
      markLoaded(name);
    };
    const unsubs = [
      onSnapshot(query(g('players')), (snap) => { setFsPlayers(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); markLoaded('players'); }, onError('players')),
      onSnapshot(query(g('courses')), (snap) => { setFsCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); markLoaded('courses'); }, onError('courses')),
      onSnapshot(query(g('rounds')), (snap) => { setFsRounds(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); markLoaded('rounds'); }, onError('rounds')),
      onSnapshot(query(g('range')), (snap) => { setFsRange(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); markLoaded('range'); }, onError('range')),
      onSnapshot(query(g('myClubs')), (snap) => {
        const m = {};
        snap.docs.forEach((d) => { m[d.id] = d.data().clubs || []; });
        setFsMyClubs(m);
        markLoaded('myClubs');
      }, onError('myClubs')),
      onSnapshot(query(g('expenses')), (snap) => { setFsExpenses(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); markLoaded('expenses'); }, onError('expenses')),
      onSnapshot(query(g('feedback')), (snap) => { setFsFeedback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); markLoaded('feedback'); }, onError('feedback')),
      onSnapshot(query(g('feedbackComments')), (snap) => { setFsFeedbackComments(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); markLoaded('feedbackComments'); }, onError('feedbackComments')),
    ];
    return () => unsubs.forEach((u) => u());
  }, [user]);

  // Auto-link the signed-in Google account to its matching player record —
  // backfills that player's photoUrl the moment they first sign in (and
  // keeps it synced if their Google photo changes later), matched by email
  // once known, falling back to a name match for players added before this
  // existed. Without this, "Utiliser ma photo Google" has nothing to fall
  // back to and silently does nothing.
  useEffect(() => {
    if (!isFirebaseConfigured || !user || !fsPlayers.length) return;
    const me = matchPlayer(fsPlayers, user);
    if (!me) return;
    const patch = {};
    if (me.authEmail !== user.email) patch.authEmail = user.email;
    if (!me.customPhotoUrl && me.photoUrl !== user.photoUrl) patch.photoUrl = user.photoUrl || null;
    if (Object.keys(patch).length) {
      updateDoc(doc(db, 'groups', GROUP_ID, 'players', me.id), patch).catch((e) =>
        console.error('[golfyeah] failed to sync Google profile photo:', e)
      );
    }
  }, [user, fsPlayers]);

  // False only during the brief window between "authenticated" and "first
  // Firestore snapshot for every collection has arrived" — lets the shell
  // show a loading state instead of flashing empty leaderboards/round lists.
  const dataReady = !isFirebaseConfigured || !user || FS_COLLECTIONS.every((c) => loadedCollections.has(c));

  const players = isFirebaseConfigured ? fsPlayers : local.players;
  const courses = isFirebaseConfigured ? fsCourses : local.courses;
  const allRounds = isFirebaseConfigured ? fsRounds : local.rounds;
  const range = isFirebaseConfigured ? fsRange : local.range;
  const myClubsMap = isFirebaseConfigured ? fsMyClubs : local.myClubs;
  const expenses = isFirebaseConfigured ? fsExpenses : local.expenses;
  const feedback = isFirebaseConfigured ? fsFeedback : local.feedback;
  const feedbackComments = isFirebaseConfigured ? fsFeedbackComments : local.feedbackComments;

  const liveRound = allRounds.find((r) => r.status === 'active') || null;
  const completedRounds = useMemo(
    () => allRounds.filter((r) => r.status === 'completed' && (r.season || 2026) === season),
    [allRounds, season]
  );

  // ---------- players ----------
  // Storing the invited email as authEmail up front means matchPlayer finds
  // this player on the very first Google sign-in with that address — no
  // reliance on the fuzzy name-matching fallback.
  const addPlayer = useCallback(async (name, email) => {
    const id = 'p' + Date.now();
    const player = { name, authEmail: email || null };
    if (isFirebaseConfigured) await setDoc(doc(db, 'groups', GROUP_ID, 'players', id), player);
    else setLocal((s) => ({ ...s, players: [...s.players, { id, ...player }] }));
  }, []);

  // dataUrl is expected pre-resized/compressed (see lib/image.js) so it fits
  // comfortably inside a Firestore document — no Storage/billing plan needed.
  const setPlayerPhoto = useCallback(async (playerId, dataUrl) => {
    if (isFirebaseConfigured) {
      await updateDoc(doc(db, 'groups', GROUP_ID, 'players', playerId), { customPhotoUrl: dataUrl || null });
      return;
    }
    setLocal((s) => ({
      ...s,
      players: s.players.map((p) => (p.id === playerId ? { ...p, customPhotoUrl: dataUrl || null } : p)),
    }));
  }, []);

  // ---------- courses ----------
  const addCourse = useCallback(async (draft) => {
    const yardages = draft.yardages.slice(0, draft.holes).map(Number);
    const pars = draft.pars.slice(0, draft.holes);
    const course = {
      name: draft.name, city: draft.city, kind: draft.kind,
      simulatedCourse: draft.simulatedCourse || '', holes: draft.holes, pars, yardages,
    };
    if (isFirebaseConfigured) {
      const ref = await addDoc(collection(db, 'groups', GROUP_ID, 'courses'), course);
      return ref.id;
    }
    const id = 'c' + Date.now();
    setLocal((s) => ({ ...s, courses: [...s.courses, { id, ...course }] }));
    return id;
  }, []);

  const updateCourseHolePar = useCallback(async (courseId, holeIndex, par, yardage) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;
    const pars = [...course.pars]; pars[holeIndex] = par;
    const yardages = [...course.yardages]; yardages[holeIndex] = yardage;
    if (isFirebaseConfigured) {
      await updateDoc(doc(db, 'groups', GROUP_ID, 'courses', courseId), { pars, yardages });
    } else {
      setLocal((s) => ({ ...s, courses: s.courses.map((c) => (c.id === courseId ? { ...c, pars, yardages } : c)) }));
    }
  }, [courses]);

  // ---------- rounds: new / live ----------
  const startRound = useCallback(async (courseId, format, playerIds) => {
    const scores = {}, beers = {};
    playerIds.forEach((id) => { scores[id] = []; beers[id] = 0; });
    const round = {
      courseId, format, holes: format, holeIndex: 0, playerIds, scores, beers,
      holeOverrides: {}, status: 'active', season,
    };
    if (isFirebaseConfigured) {
      await addDoc(collection(db, 'groups', GROUP_ID, 'rounds'), round);
    } else {
      setLocal((s) => ({ ...s, rounds: [{ id: 'r' + Date.now(), ...round }, ...s.rounds] }));
    }
  }, [season]);

  // Resolves an indoor/simulator venue to a course id, used by both the
  // live-mode and Quick Entry setup paths:
  //  1. If venue+simulatedCourse matches an already-saved (non-draft)
  //     indoor course, reuse it outright — "reuse this course automatically
  //     next time", no separate picker needed.
  //  2. Otherwise, if holesConfig is given (golfer chose to configure the
  //     course up front), create it as a normal fully-specified course.
  //  3. Otherwise, create a draft (isQuickDraft: true, pars/yardages all
  //     null) that gets filled in progressively, one hole at a time.
  const resolveIndoorCourseId = useCallback(async (venue, simulatedCourse, format, holesConfig) => {
    const venueNorm = venue.trim().toLowerCase();
    const simNorm = (simulatedCourse || '').trim().toLowerCase();
    const existing = courses.find((c) => c.kind === 'interieur' && !c.isQuickDraft &&
      c.name.trim().toLowerCase() === venueNorm &&
      (c.simulatedCourse || '').trim().toLowerCase() === simNorm);
    if (existing) return existing.id;
    const course = holesConfig
      ? {
          name: venue.trim(), city: '', kind: 'interieur', simulatedCourse: (simulatedCourse || '').trim(),
          holes: format, pars: holesConfig.pars.slice(0, format), yardages: holesConfig.yardages.slice(0, format).map(Number),
        }
      : {
          name: venue.trim(), city: '', kind: 'interieur', simulatedCourse: (simulatedCourse || '').trim(),
          holes: format, pars: Array(format).fill(null), yardages: Array(format).fill(null),
          isQuickDraft: true,
        };
    if (isFirebaseConfigured) {
      const ref = await addDoc(collection(db, 'groups', GROUP_ID, 'courses'), course);
      return ref.id;
    }
    const courseId = 'c' + Date.now();
    setLocal((s) => ({ ...s, courses: [...s.courses, { id: courseId, ...course }] }));
    return courseId;
  }, [courses]);

  const startIndoorRound = useCallback(async (venue, simulatedCourse, format, playerIds, holesConfig) => {
    const courseId = await resolveIndoorCourseId(venue, simulatedCourse, format, holesConfig);
    await startRound(courseId, format, playerIds);
  }, [resolveIndoorCourseId, startRound]);

  // Bulk-writes the discovered pars/yardages for a course (e.g. once a Quick
  // Entry scorecard on a quick-draft simulator course is fully filled in).
  // Deliberately leaves isQuickDraft untouched — Summary's "Enregistrer ce
  // parcours ?" prompt is what offers to make it reusable, same as live play.
  const updateCourseHoles = useCallback(async (courseId, pars, yardages) => {
    if (isFirebaseConfigured) {
      await updateDoc(doc(db, 'groups', GROUP_ID, 'courses', courseId), { pars, yardages });
    } else {
      setLocal((s) => ({ ...s, courses: s.courses.map((c) => (c.id === courseId ? { ...c, pars, yardages } : c)) }));
    }
  }, []);

  // Quick Entry builds a round in its final shape directly (totals,
  // mulligans, lostBalls, beers, holeScores) instead of going through the
  // active/live per-hole machinery — same finished document shape as
  // finishRound() produces, so every screen that reads a completed round
  // (leaderboard, Profile stats, Summary) treats it identically either way.
  const createCompletedRound = useCallback(async (data) => {
    const round = {
      ...data, status: 'completed', season,
      date: new Date().toLocaleDateString('fr-CA', { day: 'numeric', month: 'long', year: 'numeric' }),
    };
    if (isFirebaseConfigured) {
      const ref = await addDoc(collection(db, 'groups', GROUP_ID, 'rounds'), round);
      return ref.id;
    }
    const id = 'r' + Date.now();
    setLocal((s) => ({ ...s, rounds: [{ id, ...round }, ...s.rounds] }));
    return id;
  }, [season]);

  const saveQuickCourseAsReusable = useCallback(async (courseId, { name, simulatedCourse }) => {
    const patch = { isQuickDraft: false };
    if (name) patch.name = name;
    if (simulatedCourse !== undefined) patch.simulatedCourse = simulatedCourse;
    if (isFirebaseConfigured) {
      await updateDoc(doc(db, 'groups', GROUP_ID, 'courses', courseId), patch);
    } else {
      setLocal((s) => ({ ...s, courses: s.courses.map((c) => (c.id === courseId ? { ...c, ...patch } : c)) }));
    }
  }, []);

  const patchLiveRound = useCallback(async (patch) => {
    if (!liveRound) return;
    if (isFirebaseConfigured) {
      await updateDoc(doc(db, 'groups', GROUP_ID, 'rounds', liveRound.id), patch);
    } else {
      setLocal((s) => ({ ...s, rounds: s.rounds.map((r) => (r.id === liveRound.id ? { ...r, ...patch } : r)) }));
    }
  }, [liveRound]);

  const currentLiveCourse = useCallback(() => {
    if (!liveRound) return SEED_COURSE;
    return courses.find((c) => c.id === liveRound.courseId) || SEED_COURSE;
  }, [liveRound, courses]);

  // Returns null (not a made-up default) when this hole genuinely has no par
  // yet — that's the signal the Partie intérieure rapide setup prompt uses
  // to know a hole hasn't been configured. Outdoor/fully-configured courses
  // always have real numbers here, so this is a no-op for them.
  const getHolePar = useCallback((i) => {
    if (!liveRound) return null;
    const ov = liveRound.holeOverrides?.[i];
    if (ov) return ov.par;
    return currentLiveCourse().pars[i] ?? null;
  }, [liveRound, currentLiveCourse]);

  const getHoleYardage = useCallback((i) => {
    if (!liveRound) return null;
    const ov = liveRound.holeOverrides?.[i];
    if (ov) return ov.yardage || null;
    return currentLiveCourse().yardages[i] ?? null;
  }, [liveRound, currentLiveCourse]);

  function ensureHole(scores, playerIds, holeIndex, par) {
    const next = JSON.parse(JSON.stringify(scores));
    playerIds.forEach((id) => {
      if (!next[id]) next[id] = [];
      if (!next[id][holeIndex]) next[id][holeIndex] = { strokes: par || 4, mulligans: 0, lostBalls: 0, putts: 0 };
    });
    return next;
  }

  const setStrokes = useCallback((playerId, v) => {
    if (!liveRound) return;
    const par = getHolePar(liveRound.holeIndex);
    const scores = ensureHole(liveRound.scores, liveRound.playerIds, liveRound.holeIndex, par);
    scores[playerId][liveRound.holeIndex].strokes = Math.max(1, v);
    patchLiveRound({ scores });
  }, [liveRound, getHolePar, patchLiveRound]);

  const bumpHoleField = useCallback((playerId, field, delta) => {
    if (!liveRound) return;
    const par = getHolePar(liveRound.holeIndex);
    const scores = ensureHole(liveRound.scores, liveRound.playerIds, liveRound.holeIndex, par);
    const entry = scores[playerId][liveRound.holeIndex];
    entry[field] = Math.max(0, (entry[field] || 0) + delta);
    patchLiveRound({ scores });
  }, [liveRound, getHolePar, patchLiveRound]);

  // Putts are a subset of the hole's strokes, never more — used by the
  // scorecard's independent "+" (strokes already set via the stepper, so
  // this just nudges the putt count, clamped to what's possible).
  const bumpPutts = useCallback((playerId, delta) => {
    if (!liveRound) return;
    const par = getHolePar(liveRound.holeIndex);
    const scores = ensureHole(liveRound.scores, liveRound.playerIds, liveRound.holeIndex, par);
    const entry = scores[playerId][liveRound.holeIndex];
    entry.putts = Math.max(0, Math.min(entry.strokes, (entry.putts || 0) + delta));
    patchLiveRound({ scores });
  }, [liveRound, getHolePar, patchLiveRound]);

  // Golf Tracker's "+1 Putt": a putt IS a stroke, so this bumps both
  // fields together in one write — no separate "putting mode" needed, the
  // player just taps the matching button per shot.
  const bumpPuttStroke = useCallback((playerId, delta) => {
    if (!liveRound) return;
    const par = getHolePar(liveRound.holeIndex);
    const scores = ensureHole(liveRound.scores, liveRound.playerIds, liveRound.holeIndex, par);
    const entry = scores[playerId][liveRound.holeIndex];
    entry.strokes = Math.max(0, entry.strokes + delta);
    entry.putts = Math.max(0, Math.min(entry.strokes, (entry.putts || 0) + delta));
    patchLiveRound({ scores });
  }, [liveRound, getHolePar, patchLiveRound]);

  // Direct-set version used by the end-of-hole sheet's quick-pick chips.
  const setPutts = useCallback((playerId, value) => {
    if (!liveRound) return;
    const par = getHolePar(liveRound.holeIndex);
    const scores = ensureHole(liveRound.scores, liveRound.playerIds, liveRound.holeIndex, par);
    const entry = scores[playerId][liveRound.holeIndex];
    entry.putts = Math.max(0, Math.min(entry.strokes, value));
    patchLiveRound({ scores });
  }, [liveRound, getHolePar, patchLiveRound]);

  const addBeer = useCallback((playerId) => {
    if (!liveRound) return;
    patchLiveRound({ beers: { ...liveRound.beers, [playerId]: (liveRound.beers[playerId] || 0) + 1 } });
  }, [liveRound, patchLiveRound]);

  const removeBeer = useCallback((playerId) => {
    if (!liveRound) return;
    patchLiveRound({ beers: { ...liveRound.beers, [playerId]: Math.max(0, (liveRound.beers[playerId] || 0) - 1) } });
  }, [liveRound, patchLiveRound]);

  const changeHole = useCallback((delta) => {
    if (!liveRound) return;
    const idx = Math.max(0, Math.min(liveRound.format - 1, liveRound.holeIndex + delta));
    // Deliberately doesn't pre-write a default entry for the new hole — the
    // scorecard's ScoreStepper already falls back to par for display only,
    // and Golf Tracker needs an untouched hole to have no entry yet so it
    // can show a real "starts at 0" instead of a pre-filled par value.
    patchLiveRound({ holeIndex: idx });
  }, [liveRound, patchLiveRound]);

  const editHoleForRoundOnly = useCallback((par, yardage) => {
    if (!liveRound) return;
    const holeOverrides = { ...(liveRound.holeOverrides || {}), [liveRound.holeIndex]: { par, yardage: Number(yardage) || 0 } };
    patchLiveRound({ holeOverrides });
  }, [liveRound, patchLiveRound]);

  const editHoleForCourse = useCallback(async (par, yardage) => {
    if (!liveRound) return;
    await updateCourseHolePar(liveRound.courseId, liveRound.holeIndex, par, Number(yardage) || 0);
    const holeOverrides = { ...(liveRound.holeOverrides || {}) };
    delete holeOverrides[liveRound.holeIndex];
    patchLiveRound({ holeOverrides });
  }, [liveRound, updateCourseHolePar, patchLiveRound]);

  const finishRound = useCallback(async () => {
    if (!liveRound) return null;
    const course = currentLiveCourse();
    const finalized = finalizeRound(liveRound, course);
    finalized.date = new Date().toLocaleDateString('fr-CA', { day: 'numeric', month: 'long', year: 'numeric' });
    finalized.season = liveRound.season || season;
    if (isFirebaseConfigured) {
      await updateDoc(doc(db, 'groups', GROUP_ID, 'rounds', liveRound.id), finalized);
    } else {
      setLocal((s) => ({ ...s, rounds: s.rounds.map((r) => (r.id === liveRound.id ? { ...r, ...finalized } : r)) }));
    }
    return liveRound.id;
  }, [liveRound, currentLiveCourse, season]);

  const abandonRound = useCallback(async () => {
    if (!liveRound) return;
    // Expenses belong to the round — abandoning it permanently deletes its
    // scores, so its expenses shouldn't linger behind either.
    const toDelete = expenses.filter((e) => e.roundId === liveRound.id);
    if (isFirebaseConfigured) {
      await Promise.all([
        deleteDoc(doc(db, 'groups', GROUP_ID, 'rounds', liveRound.id)),
        ...toDelete.map((e) => deleteDoc(doc(db, 'groups', GROUP_ID, 'expenses', e.id))),
      ]);
    } else {
      setLocal((s) => ({
        ...s,
        rounds: s.rounds.filter((r) => r.id !== liveRound.id),
        expenses: s.expenses.filter((e) => e.roundId !== liveRound.id),
      }));
    }
  }, [liveRound, expenses]);

  // Deletes a completed round (e.g. from a player's profile). Every derived
  // stat — playerStats, leaderboard, bestRoundLabel — is computed live from
  // the `rounds` array on each render, so removing the doc here is the only
  // work needed; nothing downstream is cached and needs a manual refresh.
  const deleteRound = useCallback(async (roundId) => {
    const toDelete = expenses.filter((e) => e.roundId === roundId);
    if (isFirebaseConfigured) {
      await Promise.all([
        deleteDoc(doc(db, 'groups', GROUP_ID, 'rounds', roundId)),
        ...toDelete.map((e) => deleteDoc(doc(db, 'groups', GROUP_ID, 'expenses', e.id))),
      ]);
    } else {
      setLocal((s) => ({
        ...s,
        rounds: s.rounds.filter((r) => r.id !== roundId),
        expenses: s.expenses.filter((e) => e.roundId !== roundId),
      }));
    }
  }, [expenses]);

  // ---------- expenses ----------
  const addExpense = useCallback(async (roundId, { description, amountInCents, paidByPlayerId, participantPlayerIds }) => {
    const now = Date.now();
    const doc_ = { roundId, description, amountInCents, paidByPlayerId, participantPlayerIds, createdAt: now, updatedAt: now };
    if (isFirebaseConfigured) {
      await addDoc(collection(db, 'groups', GROUP_ID, 'expenses'), doc_);
    } else {
      setLocal((s) => ({ ...s, expenses: [{ id: 'e' + now, ...doc_ }, ...s.expenses] }));
    }
  }, []);

  const updateExpense = useCallback(async (expenseId, patch) => {
    const full = { ...patch, updatedAt: Date.now() };
    if (isFirebaseConfigured) {
      await updateDoc(doc(db, 'groups', GROUP_ID, 'expenses', expenseId), full);
    } else {
      setLocal((s) => ({ ...s, expenses: s.expenses.map((e) => (e.id === expenseId ? { ...e, ...full } : e)) }));
    }
  }, []);

  const deleteExpense = useCallback(async (expenseId) => {
    if (isFirebaseConfigured) {
      await deleteDoc(doc(db, 'groups', GROUP_ID, 'expenses', expenseId));
    } else {
      setLocal((s) => ({ ...s, expenses: s.expenses.filter((e) => e.id !== expenseId) }));
    }
  }, []);

  // ---------- feedback ("Commentaires") ----------
  const addFeedback = useCallback(async (data) => {
    const now = Date.now();
    const doc_ = {
      ...data, status: 'nouveau', priority: 'normale', confirmedByEmails: [],
      fixedInVersion: '', resolutionNotes: '', createdAt: now, updatedAt: now, lastActivityAt: now,
    };
    if (isFirebaseConfigured) {
      await addDoc(collection(db, 'groups', GROUP_ID, 'feedback'), doc_);
    } else {
      setLocal((s) => ({ ...s, feedback: [{ id: 'f' + now, ...doc_ }, ...s.feedback] }));
    }
  }, []);

  // Any update (status change, priority, resolution notes, an edit) counts
  // as activity the author would want to know about — see the unread
  // indicator in FeedbackList, which compares this against a per-item
  // "last seen" timestamp.
  const updateFeedback = useCallback(async (id, patch) => {
    const now = Date.now();
    const full = { ...patch, updatedAt: now, lastActivityAt: now };
    if (isFirebaseConfigured) {
      await updateDoc(doc(db, 'groups', GROUP_ID, 'feedback', id), full);
    } else {
      setLocal((s) => ({ ...s, feedback: s.feedback.map((f) => (f.id === id ? { ...f, ...full } : f)) }));
    }
  }, []);

  const deleteFeedback = useCallback(async (id) => {
    const orphanedComments = feedbackComments.filter((c) => c.feedbackId === id);
    if (isFirebaseConfigured) {
      await Promise.all([
        deleteDoc(doc(db, 'groups', GROUP_ID, 'feedback', id)),
        ...orphanedComments.map((c) => deleteDoc(doc(db, 'groups', GROUP_ID, 'feedbackComments', c.id))),
      ]);
    } else {
      setLocal((s) => ({
        ...s,
        feedback: s.feedback.filter((f) => f.id !== id),
        feedbackComments: s.feedbackComments.filter((c) => c.feedbackId !== id),
      }));
    }
  }, [feedbackComments]);

  const toggleConfirmFeedback = useCallback(async (id, email) => {
    const f = feedback.find((x) => x.id === id);
    if (!f || !email) return;
    const current = f.confirmedByEmails || [];
    const next = current.includes(email) ? current.filter((e) => e !== email) : [...current, email];
    if (isFirebaseConfigured) {
      await updateDoc(doc(db, 'groups', GROUP_ID, 'feedback', id), { confirmedByEmails: next });
    } else {
      setLocal((s) => ({ ...s, feedback: s.feedback.map((x) => (x.id === id ? { ...x, confirmedByEmails: next } : x)) }));
    }
  }, [feedback]);

  const addFeedbackComment = useCallback(async (feedbackId, { authorEmail, authorName, message, screenshots }) => {
    const now = Date.now();
    const doc_ = {
      feedbackId, authorEmail, authorName, message: message.trim(),
      screenshots: screenshots || [], createdAt: now,
    };
    if (isFirebaseConfigured) {
      await addDoc(collection(db, 'groups', GROUP_ID, 'feedbackComments'), doc_);
      await updateDoc(doc(db, 'groups', GROUP_ID, 'feedback', feedbackId), { lastActivityAt: now });
    } else {
      setLocal((s) => ({
        ...s,
        feedbackComments: [...s.feedbackComments, { id: 'fc' + now, ...doc_ }],
        feedback: s.feedback.map((f) => (f.id === feedbackId ? { ...f, lastActivityAt: now } : f)),
      }));
    }
  }, []);

  // ---------- range ----------
  const addRangeEntry = useCallback(async (playerId, entry) => {
    const doc_ = { playerId, club: entry.club, avg: Number(entry.avg), balls: Number(entry.balls), date: entry.date, location: entry.location || '', createdAt: Date.now() };
    if (isFirebaseConfigured) {
      await addDoc(collection(db, 'groups', GROUP_ID, 'range'), doc_);
    } else {
      setLocal((s) => ({ ...s, range: [{ id: 'g' + Date.now(), ...doc_ }, ...s.range] }));
    }
  }, []);

  // ---------- clubs ----------
  const getMyClubs = useCallback((playerId) => myClubsMap[playerId] || DEFAULT_MY_CLUBS, [myClubsMap]);

  const addClub = useCallback(async (playerId, clubName) => {
    const name = clubName.trim();
    if (!name) return;
    const current = getMyClubs(playerId);
    if (current.includes(name)) return;
    const next = [...current, name];
    if (isFirebaseConfigured) {
      await setDoc(doc(db, 'groups', GROUP_ID, 'myClubs', playerId), { clubs: next });
    } else {
      setLocal((s) => ({ ...s, myClubs: { ...s.myClubs, [playerId]: next } }));
    }
  }, [getMyClubs]);

  const value = {
    season, setSeason,
    dataReady, dataError,
    players, courses, range, expenses, feedback, feedbackComments, allRounds, completedRounds,
    liveRound, currentLiveCourse, getHolePar, getHoleYardage,
    addPlayer, setPlayerPhoto,
    addCourse, updateCourseHolePar, updateCourseHoles,
    startRound, startIndoorRound, resolveIndoorCourseId, saveQuickCourseAsReusable,
    createCompletedRound,
    setStrokes, bumpHoleField, bumpPutts, bumpPuttStroke, setPutts, addBeer, removeBeer, changeHole,
    editHoleForRoundOnly, editHoleForCourse, finishRound, abandonRound, deleteRound,
    addRangeEntry, getMyClubs, addClub,
    addExpense, updateExpense, deleteExpense,
    addFeedback, updateFeedback, deleteFeedback, toggleConfirmFeedback, addFeedbackComment,
    CLUB_ORDER,
    coursePar,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}
