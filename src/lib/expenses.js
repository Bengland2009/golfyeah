// Pure money/settlement logic for "Dépenses de la partie" — no UI, no
// Firestore. Everything works in integer cents; nothing here ever touches
// a float for currency math, so totals always balance to exactly 0 (no
// rounding drift to explain away).

export function formatCAD(cents) {
  return ((cents || 0) / 100).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' });
}

// Splits amountInCents evenly across participantIds with no floating
// point: base = floor(amount / n), then the first `remainder` participants
// (in array order) get one extra cent each so the parts sum exactly back
// to amountInCents.
export function splitEqually(amountInCents, participantIds) {
  const n = participantIds.length;
  if (!n) return {};
  const base = Math.floor(amountInCents / n);
  const remainder = amountInCents - base * n;
  const shares = {};
  participantIds.forEach((id, i) => {
    shares[id] = base + (i < remainder ? 1 : 0);
  });
  return shares;
}

// Returns { [playerId]: { paid, share, balance } }, all in cents.
// balance > 0 → the group owes this player. balance < 0 → they owe the group.
export function computeBalances(expenses, playerIds) {
  const balances = {};
  playerIds.forEach((id) => { balances[id] = { paid: 0, share: 0, balance: 0 }; });

  expenses.forEach((exp) => {
    if (balances[exp.paidByPlayerId]) balances[exp.paidByPlayerId].paid += exp.amountInCents;
    const shares = splitEqually(exp.amountInCents, exp.participantPlayerIds);
    Object.entries(shares).forEach(([id, cents]) => {
      if (balances[id]) balances[id].share += cents;
    });
  });

  Object.values(balances).forEach((b) => { b.balance = b.paid - b.share; });
  return balances;
}

// Greedy settlement: repeatedly match the largest creditor with the
// largest debtor. Minimizes the number of payments in practice without
// the complexity of an exact minimum-transaction solver, which is
// overkill for a golf-round-sized group. Returns [{ fromId, toId, cents }].
export function computeSettlement(balances) {
  const creditors = [];
  const debtors = [];
  Object.entries(balances).forEach(([id, b]) => {
    if (b.balance > 0) creditors.push({ id, amount: b.balance });
    else if (b.balance < 0) debtors.push({ id, amount: -b.balance });
  });
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let ci = 0, di = 0;
  while (ci < creditors.length && di < debtors.length) {
    const c = creditors[ci];
    const d = debtors[di];
    const amount = Math.min(c.amount, d.amount);
    if (amount > 0) transactions.push({ fromId: d.id, toId: c.id, cents: amount });
    c.amount -= amount;
    d.amount -= amount;
    if (c.amount === 0) ci++;
    if (d.amount === 0) di++;
  }
  return transactions;
}
