import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import {
  collection, doc, onSnapshot, addDoc, setDoc, updateDoc, deleteDoc, query,
} from 'firebase/firestore';
import { db, isFirebaseConfigured, GROUP_ID } from '../lib/firebase';
import { CLUB_ORDER, DEFAULT_MY_CLUBS, SEED_PLAYERS, SEED_COURSE, seedRounds, seedRange } from '../lib/seed';
import { finalizeRound, coursePar } from '../lib/scoring';

const DataContext = createContext(null);

const LS_KEY = 'golfyeah_local_store_v1';

function loadLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    players: SEED_PLAYERS,
    courses: [SEED_COURSE],
    rounds: seedRounds(),
    range: seedRange(),
    myClubs: {},
  };
}

function saveLocal(state) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {}
}

export function DataProvider({ children }) {
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

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const g = (name) => collection(db, 'groups', GROUP_ID, name);
    const unsubs = [
      onSnapshot(query(g('players')), (snap) => setFsPlayers(snap.docs.map((d) => ({ id: d.id, ...d.data() })))),
      onSnapshot(query(g('courses')), (snap) => setFsCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() })))),
      onSnapshot(query(g('rounds')), (snap) => setFsRounds(snap.docs.map((d) => ({ id: d.id, ...d.data() })))),
      onSnapshot(query(g('range')), (snap) => setFsRange(snap.docs.map((d) => ({ id: d.id, ...d.data() })))),
      onSnapshot(query(g('myClubs')), (snap) => {
        const m = {};
        snap.docs.forEach((d) => { m[d.id] = d.data().clubs || []; });
        setFsMyClubs(m);
      }),
    ];
    return () => unsubs.forEach((u) => u());
  }, []);

  const players = isFirebaseConfigured ? fsPlayers : local.players;
  const courses = isFirebaseConfigured ? fsCourses : local.courses;
  const allRounds = isFirebaseConfigured ? fsRounds : local.rounds;
  const range = isFirebaseConfigured ? fsRange : local.range;
  const myClubsMap = isFirebaseConfigured ? fsMyClubs : local.myClubs;

  const liveRound = allRounds.find((r) => r.status === 'active') || null;
  const completedRounds = useMemo(
    () => allRounds.filter((r) => r.status === 'completed' && (r.season || 2026) === season),
    [allRounds, season]
  );

  // ---------- players ----------
  const addPlayer = useCallback(async (name) => {
    const id = 'p' + Date.now();
    const player = { name };
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
      await addDoc(collection(db, 'groups', GROUP_ID, 'courses'), course);
    } else {
      setLocal((s) => ({ ...s, courses: [...s.courses, { id: 'c' + Date.now(), ...course }] }));
    }
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

  const getHolePar = useCallback((i) => {
    if (!liveRound) return 4;
    const ov = liveRound.holeOverrides?.[i];
    if (ov) return ov.par;
    return currentLiveCourse().pars[i] ?? 4;
  }, [liveRound, currentLiveCourse]);

  const getHoleYardage = useCallback((i) => {
    if (!liveRound) return 0;
    const ov = liveRound.holeOverrides?.[i];
    if (ov) return ov.yardage;
    return currentLiveCourse().yardages[i] ?? 0;
  }, [liveRound, currentLiveCourse]);

  function ensureHole(scores, playerIds, holeIndex, par) {
    const next = JSON.parse(JSON.stringify(scores));
    playerIds.forEach((id) => {
      if (!next[id]) next[id] = [];
      if (!next[id][holeIndex]) next[id][holeIndex] = { strokes: par || 4, mulligans: 0, lostBalls: 0 };
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
    const par = getHolePar(idx);
    const scores = ensureHole(liveRound.scores, liveRound.playerIds, idx, par);
    patchLiveRound({ holeIndex: idx, scores });
  }, [liveRound, getHolePar, patchLiveRound]);

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
    if (isFirebaseConfigured) {
      await deleteDoc(doc(db, 'groups', GROUP_ID, 'rounds', liveRound.id));
    } else {
      setLocal((s) => ({ ...s, rounds: s.rounds.filter((r) => r.id !== liveRound.id) }));
    }
  }, [liveRound]);

  // ---------- range ----------
  const addRangeEntry = useCallback(async (playerId, entry) => {
    const doc_ = { playerId, club: entry.club, avg: Number(entry.avg), balls: Number(entry.balls), date: entry.date, location: entry.location || '' };
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
    players, courses, range, allRounds, completedRounds,
    liveRound, currentLiveCourse, getHolePar, getHoleYardage,
    addPlayer, setPlayerPhoto,
    addCourse, updateCourseHolePar,
    startRound, setStrokes, bumpHoleField, addBeer, removeBeer, changeHole,
    editHoleForRoundOnly, editHoleForCourse, finishRound, abandonRound,
    addRangeEntry, getMyClubs, addClub,
    CLUB_ORDER,
    coursePar,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}
