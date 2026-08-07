import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { matchPlayer } from './identity';

// Resolves the signed-in Google account to a player record in the shared
// group, falling back to the first player so range/profile screens
// always have someone to show.
export function useMe() {
  const { user } = useAuth();
  const { players } = useData();
  if (!user) return players[0] || null;
  return matchPlayer(players, user) || players[0] || null;
}
