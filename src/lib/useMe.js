import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

// Resolves the signed-in Google account to a player record in the shared
// group — matched by authEmail once DataContext has linked it (see the
// auto-sync effect there), falling back to a name match for players that
// haven't been linked yet, and finally to the first player so range/profile
// screens always have someone to show.
export function useMe() {
  const { user } = useAuth();
  const { players } = useData();
  if (!user) return players[0] || null;
  const uEmail = user.email?.toLowerCase();
  const uName = user.name?.trim().toLowerCase();
  const match = players.find((p) => {
    if (p.authEmail) return p.authEmail.toLowerCase() === uEmail;
    const pName = p.name?.trim().toLowerCase();
    return pName && uName && (pName === uName || uName.includes(pName) || pName.includes(uName));
  });
  return match || players[0] || null;
}
