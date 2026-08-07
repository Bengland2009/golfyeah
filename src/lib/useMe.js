import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

// Resolves the signed-in Google account to a player record in the shared
// group (matched by name as a simple heuristic), falling back to the first
// player so range/profile screens always have someone to show.
export function useMe() {
  const { user } = useAuth();
  const { players } = useData();
  const byName = user && players.find((p) => p.name?.toLowerCase() === user.name?.toLowerCase());
  return byName || players[0] || null;
}
