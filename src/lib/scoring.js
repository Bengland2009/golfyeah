// Pure scoring/statistics logic — no UI, no Firebase.

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

export function coursePar(course) {
  return (course.pars || []).reduce((a, b) => a + b, 0);
}

// Rounds passed in must already be completed (status === 'completed').
export function leaderboard(players, rounds, courses) {
  return players
    .map((p) => {
      const prounds = rounds.filter((r) => r.playerIds.includes(p.id));
      const diffs = prounds.map((r) => {
        const course = courses.find((c) => c.id === r.courseId);
        const par = course ? coursePar(course) : r.par || 72;
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
    const par = course ? coursePar(course) : r.par || 72;
    return r.totals[playerId] - par;
  });
  const avg = diffs.length ? Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length) : null;
  const best = diffs.length ? Math.min(...diffs) : null;
  const scoreAvg = prounds.length ? Math.round(prounds.reduce((a, r) => a + r.totals[playerId], 0) / prounds.length) : null;
  const mulligans = prounds.reduce((a, r) => a + (r.mulligans[playerId] || 0), 0);
  const lostBalls = prounds.reduce((a, r) => a + (r.lostBalls[playerId] || 0), 0);
  const beers = prounds.reduce((a, r) => a + (r.beers[playerId] || 0), 0);
  return { rounds: prounds.length, avg, best, scoreAvg, mulligans, lostBalls, beers, roundsList: prounds };
}

export function bestRoundLabel(players, rounds, courses) {
  let bestDiff = Infinity, bestPlayerId = null;
  rounds.forEach((r) => {
    const course = courses.find((c) => c.id === r.courseId);
    const par = course ? coursePar(course) : r.par || 72;
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

export function clubAverage(rangeEntries) {
  if (!rangeEntries || !rangeEntries.length) return null;
  return Math.round(rangeEntries.reduce((a, e) => a + e.avg, 0) / rangeEntries.length);
}

// Builds the final `rounds` document fields from a live round.
export function finalizeRound(live, course) {
  const totals = {}, mulligans = {}, lostBalls = {}, beers = {}, holeScores = {};
  live.playerIds.forEach((id) => {
    let strokes = 0, mull = 0, lost = 0;
    (live.scores[id] || []).forEach((h) => { if (h) { strokes += h.strokes; mull += h.mulligans; lost += h.lostBalls; } });
    totals[id] = strokes;
    mulligans[id] = mull;
    lostBalls[id] = lost;
    beers[id] = live.beers[id] || 0;
    holeScores[id] = (live.scores[id] || []).map((h) => (h ? h.strokes : null));
  });
  return {
    courseId: course.id,
    holes: live.format,
    playerIds: live.playerIds,
    totals, mulligans, lostBalls, beers, holeScores,
    par: coursePar(course),
    status: 'completed',
  };
}

export function playerRunningTotal(live, playerId, getHolePar) {
  let strokes = 0, par = 0;
  (live.scores[playerId] || []).forEach((h, i) => { if (h) { strokes += h.strokes; par += getHolePar(i); } });
  return strokes - par;
}
