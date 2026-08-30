// Pure scoring/statistics logic — no UI, no Firebase.

const FR_MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

// Every round's `date` is written as "D moisNom AAAA" (e.g. "28 août
// 2026") via toLocaleDateString('fr-CA', {day:'numeric', month:'long',
// year:'numeric'}) — the one place a round's actual played-on date lives.
// Parses it back to a sortable timestamp; unparseable/missing dates sort
// as 0 (oldest) rather than throwing.
export function roundDateValue(dateStr) {
  if (!dateStr) return 0;
  const m = /^(\d{1,2})\s+(\S+)\s+(\d{4})$/.exec(dateStr.trim());
  if (!m) return 0;
  const monthIndex = FR_MONTHS.indexOf(m[2].toLowerCase());
  if (monthIndex === -1) return 0;
  return new Date(Number(m[3]), monthIndex, Number(m[1])).getTime();
}

export function parLabel(n) {
  if (n === 0) return 'E';
  return n > 0 ? '+' + n : String(n);
}

export function toneFor(n) {
  return n < 0 ? 'under' : n === 0 ? 'neutral' : 'over';
}

export function scoreColor(diff) {
  if (diff == null) return 'var(--color-score-even)';
  return diff < 0 ? 'var(--color-score-under)' : diff === 0 ? 'var(--color-score-even)' : 'var(--color-score-over)';
}

// `holes` scopes the sum to the holes actually played — a round's format
// can differ from the course's own stored hole count (a 9-hole round on an
// 18-hole course, or a round converted mid-play via changeRoundFormat), so
// callers computing a specific round's par must pass its `holes`/`format`.
// Omitting it (e.g. Courses.jsx showing a course's own definition) sums
// every stored hole, which is the right behavior there.
export function coursePar(course, holes) {
  const pars = course.pars || [];
  const scoped = holes != null ? pars.slice(0, holes) : pars;
  return scoped.reduce((a, b) => a + (b || 0), 0);
}

// Rounds passed in must already be completed (status === 'completed').
export function leaderboard(players, rounds, courses) {
  return players
    .map((p) => {
      const prounds = rounds.filter((r) => r.playerIds.includes(p.id));
      const diffs = prounds.map((r) => {
        const course = courses.find((c) => c.id === r.courseId);
        const par = course ? coursePar(course, r.holes) : r.par || 72;
        return r.totals[p.id] - par;
      });
      const avg = diffs.length ? Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length) : null;
      return { ...p, avg, rounds: prounds.length };
    })
    .sort((a, b) => (a.avg ?? 999) - (b.avg ?? 999));
}

export function playerStats(playerId, rounds, courses) {
  const prounds = rounds.filter((r) => r.playerIds.includes(playerId));
  const diffs = prounds.map((r) => {
    const course = courses.find((c) => c.id === r.courseId);
    const par = course ? coursePar(course, r.holes) : r.par || 72;
    return r.totals[playerId] - par;
  });
  const avg = diffs.length ? Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length) : null;
  const best = diffs.length ? Math.min(...diffs) : null;
  const scoreAvg = prounds.length ? Math.round(prounds.reduce((a, r) => a + r.totals[playerId], 0) / prounds.length) : null;
  const mulligans = prounds.reduce((a, r) => a + (r.mulligans[playerId] || 0), 0);
  const lostBalls = prounds.reduce((a, r) => a + (r.lostBalls[playerId] || 0), 0);
  const beers = prounds.reduce((a, r) => a + (r.beers[playerId] || 0), 0);
  const putts = prounds.reduce((a, r) => a + (r.putts?.[playerId] || 0), 0);
  return { rounds: prounds.length, avg, best, scoreAvg, mulligans, lostBalls, beers, putts, roundsList: prounds };
}

export function bestRoundLabel(players, rounds, courses) {
  let bestDiff = Infinity, bestPlayerId = null;
  rounds.forEach((r) => {
    const course = courses.find((c) => c.id === r.courseId);
    const par = course ? coursePar(course, r.holes) : r.par || 72;
    r.playerIds.forEach((pid) => {
      const diff = r.totals[pid] - par;
      if (diff < bestDiff) { bestDiff = diff; bestPlayerId = pid; }
    });
  });
  const p = players.find((pp) => pp.id === bestPlayerId);
  return p ? `${p.name} ${parLabel(bestDiff)}` : '—';
}

export function leaderStat(field, players, rounds) {
  const totals = {};
  players.forEach((p) => { totals[p.id] = 0; });
  rounds.forEach((r) => players.forEach((p) => { totals[p.id] += r[field]?.[p.id] || 0; }));
  let leader = players[0], max = -1;
  players.forEach((p) => { if (totals[p.id] > max) { max = totals[p.id]; leader = p; } });
  return leader ? `${leader.name} · ${max}` : '—';
}

export const KIND_OPTIONS = [
  { value: 'exterieur', label: 'Extérieur' },
  { value: 'interieur', label: 'Simulateur' },
  { value: 'tous', label: 'Tous' },
];

// Extérieur = anything not explicitly marked indoor, so a course record
// missing `kind` still counts as outdoor instead of silently vanishing
// from both filters — same convention NewRound.jsx uses for its own
// outdoor course list.
export function matchesKind(round, courses, kindFilter) {
  if (kindFilter === 'tous') return true;
  const course = courses.find((c) => c.id === round.courseId);
  return kindFilter === 'interieur' ? course?.kind === 'interieur' : course?.kind !== 'interieur';
}

// Structured counterpart to bestRoundLabel — returns the winning player and
// raw diff separately (rather than a pre-joined label string) so a trophy
// card can lay out the name and the value as distinct visual elements.
export function bestRound(players, rounds, courses) {
  let bestDiff = Infinity, bestPlayerId = null;
  rounds.forEach((r) => {
    const course = courses.find((c) => c.id === r.courseId);
    const par = course ? coursePar(course, r.holes) : r.par || 72;
    r.playerIds.forEach((pid) => {
      const diff = r.totals[pid] - par;
      if (diff < bestDiff) { bestDiff = diff; bestPlayerId = pid; }
    });
  });
  const player = players.find((p) => p.id === bestPlayerId);
  return player ? { player, diff: bestDiff } : null;
}

// Structured counterpart to leaderStat — same "highest total wins" logic,
// but returns { player, value } instead of a formatted string, and null
// (rather than an arbitrary player at 0) when nobody has any of this
// stat at all, so the caller can hide a trophy with no real data instead
// of crowning a false champion at zero.
export function topByField(field, players, rounds) {
  const totals = {};
  players.forEach((p) => { totals[p.id] = 0; });
  rounds.forEach((r) => players.forEach((p) => { totals[p.id] += r[field]?.[p.id] || 0; }));
  let best = null;
  players.forEach((p) => { if (totals[p.id] > 0 && (best == null || totals[p.id] > best.value)) best = { player: p, value: totals[p.id] }; });
  return best;
}

// Lower putts-per-hole is better. Only rounds with a `putts` field are
// counted — older rounds recorded before putts tracking existed have no
// such field at all, and would otherwise silently count as "0 putts over
// a full round" and drag the average toward an implausible number.
export function bestPuttsPerHole(players, rounds) {
  let best = null;
  let anyPutts = false;
  players.forEach((p) => {
    const prounds = rounds.filter((r) => r.playerIds.includes(p.id) && r.putts?.[p.id] != null);
    const holes = prounds.reduce((a, r) => a + (r.holes || 0), 0);
    const putts = prounds.reduce((a, r) => a + r.putts[p.id], 0);
    if (putts > 0) anyPutts = true;
    if (!holes) return;
    const perHole = putts / holes;
    if (best == null || perHole < best.value) best = { player: p, value: perHole };
  });
  return anyPutts ? best : null;
}

// Counts holes played at least one under par (birdie or better) using the
// per-hole detail already stored on each round (holeScores vs the course's
// pars, matched by index).
export function mostBirdies(players, rounds, courses) {
  let best = null;
  players.forEach((p) => {
    let count = 0;
    rounds.filter((r) => r.playerIds.includes(p.id)).forEach((r) => {
      const course = courses.find((c) => c.id === r.courseId);
      const pars = course?.pars;
      const holeScores = r.holeScores?.[p.id];
      if (!pars || !holeScores) return;
      holeScores.forEach((strokes, i) => {
        if (strokes != null && pars[i] != null && strokes - pars[i] <= -1) count += 1;
      });
    });
    if (count > 0 && (best == null || count > best.value)) best = { player: p, value: count };
  });
  return best;
}

export function mostRoundsPlayed(players, rounds) {
  let best = null;
  players.forEach((p) => {
    const count = rounds.filter((r) => r.playerIds.includes(p.id)).length;
    if (count > 0 && (best == null || count > best.value)) best = { player: p, value: count };
  });
  return best;
}

// "Progression" compares a player's average score-vs-par in the first
// half of their rounds this season against the second half — chronological
// order relies on the existing app-wide convention that rounds arrays are
// newest-first (same assumption Home.jsx's "dernière partie" already
// makes via rounds[0]). Requires at least 4 rounds so each half has a
// couple of data points, and only returns a winner who actually improved
// (a shrinking average), never someone who got worse.
export function bestProgression(players, rounds, courses) {
  let best = null;
  players.forEach((p) => {
    const prounds = rounds.filter((r) => r.playerIds.includes(p.id));
    if (prounds.length < 4) return;
    const chronological = [...prounds].reverse();
    const diffFor = (r) => {
      const course = courses.find((c) => c.id === r.courseId);
      const par = course ? coursePar(course, r.holes) : r.par || 72;
      return r.totals[p.id] - par;
    };
    const mid = Math.floor(chronological.length / 2);
    const avg = (arr) => arr.reduce((a, r) => a + diffFor(r), 0) / arr.length;
    const improvement = avg(chronological.slice(0, mid)) - avg(chronological.slice(mid));
    if (improvement > 0 && (best == null || improvement > best.value)) best = { player: p, value: improvement };
  });
  return best;
}

export function clubAverage(rangeEntries) {
  if (!rangeEntries || !rangeEntries.length) return null;
  return Math.round(rangeEntries.reduce((a, e) => a + e.avg, 0) / rangeEntries.length);
}

// Builds the final `rounds` document fields from a live round. holePutts
// mirrors holeScores (same per-player, per-hole array shape) so per-hole
// detail — "9 coups dont 4 putts" — survives past the round's active life,
// not just the summed total.
export function finalizeRound(live, course) {
  const totals = {}, mulligans = {}, lostBalls = {}, beers = {}, putts = {}, holeScores = {}, holePutts = {};
  live.playerIds.forEach((id) => {
    let strokes = 0, mull = 0, lost = 0, puttSum = 0;
    (live.scores[id] || []).forEach((h) => { if (h) { strokes += h.strokes; mull += h.mulligans; lost += h.lostBalls; puttSum += h.putts || 0; } });
    totals[id] = strokes;
    mulligans[id] = mull;
    lostBalls[id] = lost;
    putts[id] = puttSum;
    beers[id] = live.beers[id] || 0;
    holeScores[id] = (live.scores[id] || []).map((h) => (h ? h.strokes : null));
    holePutts[id] = (live.scores[id] || []).map((h) => (h ? (h.putts || 0) : null));
  });
  return {
    courseId: course.id,
    holes: live.format,
    playerIds: live.playerIds,
    totals, mulligans, lostBalls, putts, beers, holeScores, holePutts,
    par: coursePar(course, live.format),
    status: 'completed',
  };
}

export function playerRunningTotal(live, playerId, getHolePar) {
  let strokes = 0, par = 0;
  (live.scores[playerId] || []).forEach((h, i) => { if (h) { strokes += h.strokes; par += getHolePar(i) || 0; } });
  return strokes - par;
}
