// Resolves a { email, name } identity (from Firebase Auth, or a snapshot
// stored on a feedback/comment doc) to a player record in the shared
// group — matched by authEmail once DataContext has linked it, falling
// back to a name match for players that haven't been linked yet.
// Pure function so it can be reused both for "who am I" (useMe) and for
// "who wrote this comment" (any other user, not just the current one).
export function matchPlayer(players, { email, name }) {
  const eEmail = email?.toLowerCase();
  const eName = name?.trim().toLowerCase();
  return players.find((p) => {
    if (p.authEmail) return p.authEmail.toLowerCase() === eEmail;
    const pName = p.name?.trim().toLowerCase();
    return pName && eName && (pName === eName || eName.includes(pName) || pName.includes(eName));
  }) || null;
}
