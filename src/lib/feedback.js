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

export function typeLabel(key) {
  return FEEDBACK_TYPES.find((t) => t.key === key)?.label || key;
}
export function statusLabel(key) {
  return FEEDBACK_STATUSES.find((s) => s.key === key)?.label || key;
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
