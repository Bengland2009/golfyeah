import { useAuth } from '../contexts/AuthContext';

// The developer's account — the only one allowed to change status, edit
// items once work has started, or delete other people's feedback. Fixed
// on purpose: this is a private single-developer feedback inbox, not a
// role system.
export const ADMIN_EMAIL = 'berthiaumebenoit@gmail.com';

export function useIsAdmin() {
  const { user } = useAuth();
  return Boolean(user?.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
}

export const FEEDBACK_TYPES = [
  { key: 'bug', label: 'Bug' },
  { key: 'idee', label: 'Idée' },
  { key: 'amelioration', label: 'Amélioration' },
];

export const FEEDBACK_STATUSES = [
  { key: 'nouveau', label: 'Nouveau' },
  { key: 'en_cours', label: 'En cours' },
  { key: 'resolu', label: 'Résolu' },
];

export const FEEDBACK_PRIORITIES = [
  { key: 'basse', label: 'Basse' },
  { key: 'normale', label: 'Normale' },
  { key: 'haute', label: 'Haute' },
];

export function typeLabel(key) {
  return FEEDBACK_TYPES.find((t) => t.key === key)?.label || key;
}
export function statusLabel(key) {
  return FEEDBACK_STATUSES.find((s) => s.key === key)?.label || key;
}
export function priorityLabel(key) {
  return FEEDBACK_PRIORITIES.find((p) => p.key === key)?.label || key;
}

// Lightweight "unread since I last looked" tracking, kept in localStorage
// rather than real push notifications — this is a small in-app tool, not
// worth standing up Cloud Functions/FCM for. `lastActivityAt` on the
// feedback doc (bumped by comments/status/resolution) is compared against
// the last-seen timestamp recorded here per item.
const SEEN_KEY_PREFIX = 'golfyeah_feedback_seen_';

export function markFeedbackSeen(id) {
  try {
    localStorage.setItem(SEEN_KEY_PREFIX + id, String(Date.now()));
  } catch {
    // localStorage unavailable (private browsing, etc.) — unread badges
    // just won't clear, which is harmless.
  }
}

export function hasUnseenActivity(f) {
  if (!f?.lastActivityAt) return false;
  try {
    const seen = Number(localStorage.getItem(SEEN_KEY_PREFIX + f.id) || 0);
    return f.lastActivityAt > seen;
  } catch {
    return false;
  }
}

// Best-effort, no permissions/prompts — just enough to help triage a bug
// report without asking the reporter to type it out themselves.
export function detectPlatform() {
  if (typeof navigator === 'undefined') return 'Web';
  const ua = navigator.userAgent || '';
  if (/Android/i.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iPhone';
  return 'Web';
}

export function detectDeviceInfo() {
  if (typeof navigator === 'undefined') return '';
  return navigator.userAgent || '';
}
